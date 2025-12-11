const storageService = require("../services/storageService");

exports.uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file" });

  const filename = `uploads/${Date.now()}-${req.file.originalname}`;
  const { url } = await storageService.upload(req.file, filename);

  res.json({ url });
};
