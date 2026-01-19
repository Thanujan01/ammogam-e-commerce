const { Storage } = require('@google-cloud/storage');

module.exports = function initGCS(){
  if (process.env.STORAGE_DRIVER !== 'gcs') return null;
  
  const bucketName = process.env.GCS_BUCKET;
  const projectId = process.env.GCS_PROJECT_ID;
  
  if (!bucketName || !projectId || (!process.env.GCS_KEY_FILE && !process.env.GCS_KEY_JSON)) {
    console.warn('GCS env not fully configured. STORAGE_DRIVER set to gcs but GCS_* vars missing.');
    return null;
  }

  const storageOptions = { projectId };

  if (process.env.GCS_KEY_JSON) {
    try {
      storageOptions.credentials = JSON.parse(process.env.GCS_KEY_JSON);
    } catch (err) {
      console.error('Error parsing GCS_KEY_JSON:', err.message);
      return null;
    }
  } else {
    storageOptions.keyFilename = process.env.GCS_KEY_FILE;
  }

  const storage = new Storage(storageOptions);
  return storage.bucket(bucketName);
};
