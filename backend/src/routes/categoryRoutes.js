const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");
const categoryCtrl = require("../controllers/categoryController");

router.get("/", categoryCtrl.getCategories);
router.post("/", auth, admin, categoryCtrl.createCategory);

module.exports = router;
