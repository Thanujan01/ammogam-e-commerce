const router = require("express").Router();
const { register, login, updateProfile, changePassword, forgotPassword, resetPassword, verifyOTP } = require("../controllers/authController");
const { auth } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.put("/profile", auth, updateProfile);
router.put("/change-password", auth, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

module.exports = router;
