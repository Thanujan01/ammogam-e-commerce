const router = require("express").Router();
const { auth } = require("../middlewares/authMiddleware");
const notificationCtrl = require("../controllers/notificationController");

router.get("/", auth, notificationCtrl.getMyNotifications);
router.put("/:id/read", auth, notificationCtrl.markAsRead);
router.put("/mark-all-read", auth, notificationCtrl.markAllAsRead);
router.delete("/:id", auth, notificationCtrl.deleteNotification);
router.delete("/clear", auth, notificationCtrl.clearNotifications);

module.exports = router;
