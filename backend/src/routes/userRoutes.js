const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userController");
const { auth, admin } = require("../middlewares/authMiddleware");

// Admin routes
router.get("/", auth, admin, userCtrl.getAllUsers);
router.get("/stats", auth, admin, userCtrl.getUserStats);
router.get("/:id", auth, admin, userCtrl.getUserById);
router.put("/:id", auth, admin, userCtrl.updateUser);
router.delete("/:id", auth, admin, userCtrl.deleteUser);

module.exports = router;
