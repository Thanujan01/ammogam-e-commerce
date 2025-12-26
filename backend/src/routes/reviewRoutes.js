const router = require("express").Router();
const reviewCtrl = require("../controllers/reviewController");
const { auth } = require("../middlewares/authMiddleware");

router.post("/", auth, reviewCtrl.createReview);
router.get("/product/:productId", reviewCtrl.getProductReviews);

module.exports = router;
