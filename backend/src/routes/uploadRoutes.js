const router = require("express").Router();
const multer = require("multer");
const os = require("os");
const upload = multer({ dest: os.tmpdir() });
const uploadCtrl = require("../controllers/uploadController");

router.post("/image", upload.single("file"), uploadCtrl.uploadImage);

module.exports = router;
