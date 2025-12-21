const express = require("express");
const router = express.Router();
const sellerCtrl = require("../controllers/sellerController");
const sellerProfileCtrl = require("../controllers/sellerProfileController");
const { auth, admin } = require("../middlewares/authMiddleware");

// Public route - seller registration
router.post("/register", sellerCtrl.registerSeller);

// Seller profile routes (authenticated sellers only)
router.get("/profile", auth, sellerProfileCtrl.getSellerProfile);
router.put("/profile", auth, sellerProfileCtrl.updateSellerProfile);
router.post("/profile/change-password", auth, sellerProfileCtrl.changeSellerPassword);

// Admin routes
router.get("/pending", auth, admin, sellerCtrl.getPendingSellers);
router.get("/all", auth, admin, sellerCtrl.getAllSellers);
router.post("/approve/:id", auth, admin, sellerCtrl.approveSeller);
router.post("/reject/:id", auth, admin, sellerCtrl.rejectSeller);
router.get("/:id", auth, admin, sellerCtrl.getSellerById);
router.get("/:id/products", auth, admin, sellerCtrl.getSellerProducts);
router.get("/:id/orders", auth, admin, sellerCtrl.getSellerOrders);

module.exports = router;
