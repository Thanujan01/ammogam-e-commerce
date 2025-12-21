const express = require("express");
const router = express.Router();
const adminStatsCtrl = require("../controllers/adminStatsController");
const { auth, admin } = require("../middlewares/authMiddleware");

// Admin dashboard stats
router.get("/stats", auth, admin, adminStatsCtrl.getAdminStats);

module.exports = router;
