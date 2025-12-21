const router = require("express").Router();
const { auth, admin } = require("../middlewares/authMiddleware");
const productCtrl = require("../controllers/productController");

// Middleware to check if user is seller or admin
const sellerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Sellers and admins only." });
  }
};

// Public routes
router.get("/", productCtrl.getAllProducts);
router.get("/:id", productCtrl.getProduct);

// Seller routes
router.get("/seller/my-products", auth, productCtrl.getSellerProducts);
router.get("/seller/stats", auth, productCtrl.getSellerStats);
router.get("/seller/orders", auth, productCtrl.getSellerOrders);

// Seller and Admin can create/update/delete products
router.post("/", auth, sellerOrAdmin, productCtrl.createProduct);
router.put("/:id", auth, sellerOrAdmin, productCtrl.updateProduct);
router.delete("/:id", auth, sellerOrAdmin, productCtrl.deleteProduct);

module.exports = router;
