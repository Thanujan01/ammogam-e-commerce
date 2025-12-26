const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { rating, comment, productId, orderId } = req.body;
    const userId = req.user._id;

    // Check if user already reviewed this product from this order
    const existingReview = await Review.findOne({ product: productId, user: userId, order: orderId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product for this order." });
    }

    // Verify order exists and belongs to user and is delivered
    const order = await Order.findOne({ _id: orderId, user: userId, status: 'delivered' });
    if (!order) {
      return res.status(400).json({ message: "You can only review items from delivered orders." });
    }

    // Verify product is in the order
    const productInOrder = order.items.some(item => item.product.toString() === productId);
    if (!productInOrder) {
      return res.status(400).json({ message: "Product not found in this order." });
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      order: orderId,
      rating,
      comment
    });

    // Update product rating
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(productId, {
      rating: parseFloat(avgRating.toFixed(1))
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name image")
      .sort("-createdAt");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
