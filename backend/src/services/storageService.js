const fs = require("fs");
const path = require("path");
const initGCS = require("../config/storage");

const gcsBucket = initGCS();

exports.upload = async (file, destPath) => {
  // GCS
  if (process.env.STORAGE_DRIVER === "gcs" && gcsBucket) {
    await gcsBucket.upload(file.path, { destination: destPath });
    await fs.promises.unlink(file.path);
    return {
      url: `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${destPath}`,
    };
  }

  // LOCAL STORAGE
  if (process.env.NODE_ENV === "production" && process.env.STORAGE_DRIVER !== "gcs") {
    console.error("CRITICAL: Local storage is not supported on Vercel. Please configure GCS.");
    throw new Error("Local storage not supported in production environment");
  }

  const uploadsDir = path.join(__dirname, "../../uploads");
  try {
    if (!fs.existsSync(uploadsDir)) {
      // On Vercel this will fail, which is expected if GCS isn't used
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  } catch (err) {
    console.error("Failed to create uploads directory:", err.message);
  }

  const finalPath = path.join(uploadsDir, path.basename(destPath));
  await fs.promises.rename(file.path, finalPath);

  return { url: `/uploads/${path.basename(destPath)}` };
};
