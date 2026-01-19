const fs = require("fs");
const path = require("path");
const initGCS = require("../config/storage");

const gcsBucket = initGCS();

exports.upload = async (file, destPath) => {
  // GCS - PRIMARY STORAGE METHOD
  if (process.env.STORAGE_DRIVER === "gcs") {
    if (!gcsBucket) {
      console.error("CRITICAL: STORAGE_DRIVER is set to 'gcs' but GCS bucket is not initialized.");
      console.error("Please check: GCS_BUCKET, GCS_PROJECT_ID, and GCS_KEY_JSON environment variables.");
      throw new Error("Google Cloud Storage is not properly configured. Check your environment variables.");
    }

    try {
      // Upload to GCS bucket
      // Note: With uniform bucket-level access enabled, files are accessible based on bucket IAM policies
      // Make sure your bucket has public read access configured via IAM
      await gcsBucket.upload(file.path, { 
        destination: destPath,
        metadata: {
          cacheControl: 'public, max-age=31536000', // Cache for 1 year
        }
      });
      
      // Clean up temporary file
      await fs.promises.unlink(file.path);
      
      const bucketName = process.env.GCS_BUCKET;
      return {
        url: `https://storage.googleapis.com/${bucketName}/${destPath}`,
      };
    } catch (error) {
      console.error("GCS Upload Error:", error.message);
      // Clean up temp file even on error
      try {
        await fs.promises.unlink(file.path);
      } catch (unlinkErr) {
        // Ignore cleanup errors
      }
      throw new Error(`Failed to upload to Google Cloud Storage: ${error.message}`);
    }
  }

  // LOCAL STORAGE - ONLY FOR DEVELOPMENT
  // In production (Vercel), this will fail which is expected
  if (process.env.NODE_ENV === "production") {
    console.error("CRITICAL: Local storage is not supported on Vercel.");
    console.error("Please set STORAGE_DRIVER=gcs and configure GCS environment variables.");
    throw new Error("Local storage not supported in production environment. Configure GCS instead.");
  }

  const uploadsDir = path.join(__dirname, "../../uploads");
  try {
    if (!fs.existsSync(uploadsDir)) {
      // On Vercel this will fail, which is expected if GCS isn't used
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  } catch (err) {
    console.error("Failed to create uploads directory:", err.message);
    throw new Error(`Failed to create local uploads directory: ${err.message}`);
  }

  const finalPath = path.join(uploadsDir, path.basename(destPath));
  await fs.promises.rename(file.path, finalPath);

  return { url: `/uploads/${path.basename(destPath)}` };
};
