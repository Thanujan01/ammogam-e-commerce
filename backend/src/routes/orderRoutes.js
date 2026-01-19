const router = require("express").Router();
const { auth, admin } = require("../middlewares/authMiddleware");
const orderCtrl = require("../controllers/orderController");

router.post("/", auth, orderCtrl.placeOrder);
router.put("/:id/pay", auth, orderCtrl.updateOrderToPaid);
router.get("/my", auth, orderCtrl.getMyOrders);
router.get("/:id", auth, orderCtrl.getOrderById);

// Seller routes
router.get("/seller/all", auth, orderCtrl.getSellerOrders);
router.put("/seller/status", auth, orderCtrl.updateSellerOrderStatus);
router.put("/item-status", auth, orderCtrl.updateOrderItemStatus);

// Admin only
router.put("/:id/status", auth, admin, orderCtrl.updateOrderStatus);
router.get("/", auth, admin, orderCtrl.getAllOrders);

module.exports = router;
