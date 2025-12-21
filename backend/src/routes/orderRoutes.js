const router = require("express").Router();
const { auth, admin } = require("../middlewares/authMiddleware");
const orderCtrl = require("../controllers/orderController");

router.post("/", auth, orderCtrl.placeOrder);
router.put("/:id/pay", auth, orderCtrl.updateOrderToPaid);
router.get("/my", auth, orderCtrl.getMyOrders);
router.get("/:id", auth, orderCtrl.getOrderById);

// Admin only
router.put("/:id/status", auth, admin, orderCtrl.updateOrderStatus);
router.get("/", auth, admin, orderCtrl.getAllOrders);

// Seller routes
router.get("/seller/all", auth, orderCtrl.getSellerOrders);
router.put("/item-status", auth, orderCtrl.updateOrderItemStatus);

module.exports = router;
