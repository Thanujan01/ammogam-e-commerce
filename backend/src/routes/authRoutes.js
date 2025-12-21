const router = require("express").Router();
const { register, login, updateProfile, changePassword } = require("../controllers/authController");
const { auth } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.put("/profile", auth, updateProfile);
router.put("/change-password", auth, changePassword);

module.exports = router;
