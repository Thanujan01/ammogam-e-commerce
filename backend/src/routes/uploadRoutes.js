const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "tmp/" });
const uploadCtrl = require("../controllers/uploadController");

router.post("/image", upload.single("file"), uploadCtrl.uploadImage);

module.exports = router;
