const router = require("express").Router();
const { auth, admin } = require("../middlewares/authMiddleware");
const settingsCtrl = require("../controllers/settingsController");

router.get("/", settingsCtrl.getSettings);
router.put("/", auth, admin, settingsCtrl.updateSettings);

module.exports = router;
