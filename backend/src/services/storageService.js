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
  const uploadsDir = path.join(__dirname, "../../uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

  const finalPath = path.join(uploadsDir, path.basename(destPath));
  await fs.promises.rename(file.path, finalPath);

  return { url: `/uploads/${path.basename(destPath)}` };
};
