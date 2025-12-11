const { Storage } = require('@google-cloud/storage');

module.exports = function initGCS(){
  if (process.env.STORAGE_DRIVER !== 'gcs') return null;
  if (!process.env.GCS_BUCKET || !process.env.GCS_KEY_FILE || !process.env.GCS_PROJECT_ID) {
    console.warn('GCS env not fully configured. STORAGE_DRIVER set to gcs but GCS_* vars missing.');
    return null;
  }
  const storage = new Storage({
    keyFilename: process.env.GCS_KEY_FILE,
    projectId: process.env.GCS_PROJECT_ID,
  });
  return storage.bucket(process.env.GCS_BUCKET);
};
