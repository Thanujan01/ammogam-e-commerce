const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");
const productCtrl = require("../controllers/productController");

router.get("/", productCtrl.getAllProducts);
router.get("/:id", productCtrl.getProduct);

router.post("/", auth, admin, productCtrl.createProduct);
router.put("/:id", auth, admin, productCtrl.updateProduct);
router.delete("/:id", auth, admin, productCtrl.deleteProduct);

module.exports = router;
