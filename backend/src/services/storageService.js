const fs = require("fs");
const path = require("path");
const initGCS = require("../config/storage");

let sharp = null;
try {
  sharp = require("sharp");
} catch (_) {
  console.warn("sharp is not installed. Image optimization is disabled.");
}

const gcsBucket = initGCS();

const optimizeImageIfPossible = async (file) => {
  const isImage = file && typeof file.mimetype === "string" && file.mimetype.startsWith("image/");
  const isUnsupported = file.mimetype === "image/gif" || file.mimetype === "image/svg+xml";

  if (!sharp || !isImage || isUnsupported) {
    return { uploadPath: file.path, cleanupPaths: [file.path] };
  }

  let optimizedExt = ".jpg";
  if (file.mimetype === "image/png") optimizedExt = ".png";
  if (file.mimetype === "image/webp") optimizedExt = ".webp";
  const optimizedPath = `${file.path}-optimized${optimizedExt}`;

  try {
    let transformer = sharp(file.path).rotate().resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    });

    if (file.mimetype === "image/png") {
      transformer = transformer.png({ compressionLevel: 9, palette: true });
    } else if (file.mimetype === "image/webp") {
      transformer = transformer.webp({ quality: 78 });
    } else {
      transformer = transformer.jpeg({ quality: 78, mozjpeg: true });
    }

    await transformer.toFile(optimizedPath);
    return { uploadPath: optimizedPath, cleanupPaths: [file.path, optimizedPath] };
  } catch (error) {
    return { uploadPath: file.path, cleanupPaths: [file.path] };
  }
};

exports.upload = async (file, destPath) => {
  const { uploadPath, cleanupPaths } = await optimizeImageIfPossible(file);

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
      await gcsBucket.upload(uploadPath, {
        destination: destPath,
        metadata: {
          cacheControl: 'public, max-age=31536000', // Cache for 1 year
        }
      });
      
      // Clean up temporary file(s)
      await Promise.all(cleanupPaths.map(async (tempPath) => {
        try {
          await fs.promises.unlink(tempPath);
        } catch (_) {
          // ignore cleanup errors
        }
      }));
      
      const bucketName = process.env.GCS_BUCKET;
      return {
        url: `https://storage.googleapis.com/${bucketName}/${destPath}`,
      };
    } catch (error) {
      console.error("GCS Upload Error:", error.message);
      await Promise.all(cleanupPaths.map(async (tempPath) => {
        try {
          await fs.promises.unlink(tempPath);
        } catch (_) {
          // ignore cleanup errors
        }
      }));
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
  await fs.promises.rename(uploadPath, finalPath);

  await Promise.all(cleanupPaths.map(async (tempPath) => {
    if (tempPath === uploadPath) return;
    try {
      await fs.promises.unlink(tempPath);
    } catch (_) {
      // ignore cleanup errors
    }
  }));

  return { url: `/uploads/${path.basename(destPath)}` };
};
