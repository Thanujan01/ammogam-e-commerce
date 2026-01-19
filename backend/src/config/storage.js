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
      storageOptions.credentials = JSON.parse(process.env.GCS_KEY_JSON);
      console.log('✅ GCS initialized with JSON credentials');
    } catch (err) {
      console.error('❌ Error parsing GCS_KEY_JSON:', err.message);
      console.error('   Make sure GCS_KEY_JSON contains valid JSON.');
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
