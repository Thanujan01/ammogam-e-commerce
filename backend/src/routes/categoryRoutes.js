const router = require("express").Router();
const { auth, admin } = require("../middlewares/authMiddleware");
const categoryCtrl = require("../controllers/categoryController");

router.get("/", categoryCtrl.getCategories);
router.post("/", auth, admin, categoryCtrl.createCategory);
router.put("/:id", auth, admin, categoryCtrl.updateCategory);
router.delete("/:id", auth, admin, categoryCtrl.deleteCategory);

module.exports = router;
