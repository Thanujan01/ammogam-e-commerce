const { Storage } = require('@google-cloud/storage');

module.exports = function initGCS(){
  if (process.env.STORAGE_DRIVER !== 'gcs') {
    console.log('Storage driver is not set to GCS. Using local storage (development only).');
    return null;
  }
  
  const bucketName = process.env.GCS_BUCKET;
  const projectId = process.env.GCS_PROJECT_ID;
  
  if (!bucketName || !projectId) {
    console.error('❌ GCS Configuration Error: GCS_BUCKET or GCS_PROJECT_ID is missing.');
    console.error('   Required: STORAGE_DRIVER=gcs, GCS_BUCKET, GCS_PROJECT_ID, GCS_KEY_JSON');
    return null;
  }

  if (!process.env.GCS_KEY_FILE && !process.env.GCS_KEY_JSON) {
    console.error('❌ GCS Configuration Error: Neither GCS_KEY_FILE nor GCS_KEY_JSON is provided.');
    console.error('   For Vercel, use GCS_KEY_JSON (paste the entire service account JSON).');
    return null;
  }

  const storageOptions = { projectId };

  if (process.env.GCS_KEY_JSON) {
    try {
      // Handle JSON that might be wrapped in quotes or have escaped characters
      let jsonString = process.env.GCS_KEY_JSON.trim();
      
      // Remove surrounding quotes if present (common in .env files)
      if ((jsonString.startsWith('"') && jsonString.endsWith('"')) || 
          (jsonString.startsWith("'") && jsonString.endsWith("'"))) {
        jsonString = jsonString.slice(1, -1);
        // Unescape quotes
        jsonString = jsonString.replace(/\\"/g, '"').replace(/\\'/g, "'");
      }
      
      // CRITICAL: Remove actual newlines/carriage returns that shouldn't be in JSON
      // The private key should have \n (backslash-n) as a string literal, not actual newlines
      // Replace actual newlines with nothing (they break JSON parsing)
      jsonString = jsonString.replace(/\r\n/g, '').replace(/\r/g, '').replace(/\n/g, '');
      
      // The \n sequences in the private key should already be in the string as "\n"
      // If they got converted to actual newlines, we've removed them above
      // The JSON parser will handle the \n escape sequences correctly
      
      storageOptions.credentials = JSON.parse(jsonString);
      console.log('✅ GCS initialized with JSON credentials');
    } catch (err) {
      console.error('❌ Error parsing GCS_KEY_JSON:', err.message);
      console.error('   Received value (first 200 chars):', process.env.GCS_KEY_JSON.substring(0, 200));
      console.error('   Make sure GCS_KEY_JSON contains valid JSON.');
      console.error('   Tip: The private key should have \\n (backslash-n) not actual newlines.');
      console.error('   Consider using GCS_KEY_FILE instead for local development.');
      return null;
    }
  } else {
    storageOptions.keyFilename = process.env.GCS_KEY_FILE;
    console.log('✅ GCS initialized with key file:', process.env.GCS_KEY_FILE);
  }

  try {
    const storage = new Storage(storageOptions);
    const bucket = storage.bucket(bucketName);
    console.log(`✅ GCS Bucket initialized: ${bucketName}`);
    return bucket;
  } catch (err) {
    console.error('❌ Failed to initialize GCS Storage:', err.message);
    return null;
  }
};
