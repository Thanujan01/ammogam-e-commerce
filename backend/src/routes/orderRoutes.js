const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");
const orderCtrl = require("../controllers/orderController");

router.post("/", auth, orderCtrl.placeOrder);
router.get("/my", auth, orderCtrl.getMyOrders);

// Admin only
router.get("/", auth, admin, orderCtrl.getAllOrders);

module.exports = router;
