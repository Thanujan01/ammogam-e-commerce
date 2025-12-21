const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { auth } = require("../middlewares/authMiddleware");

router.post("/create-checkout-session", auth, paymentController.createCheckoutSession);
router.post("/verify-payment", auth, paymentController.verifyPayment);

module.exports = router;
