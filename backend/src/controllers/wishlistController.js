const Wishlist = require("../models/Wishlist");

exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    } else {
      // Filter out any products that were deleted from the database
      wishlist.products = wishlist.products.filter(p => p !== null);
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
      return res.json({ message: "Product added to wishlist", wishlist });
    }

    const index = wishlist.products.findIndex(id => id.toString() === productId);
    if (index === -1) {
      wishlist.products.push(productId);
      await wishlist.save();
      res.json({ message: "Product added to wishlist", wishlist });
    } else {
      wishlist.products.splice(index, 1);
      await wishlist.save();
      res.json({ message: "Product removed from wishlist", wishlist });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { products: [] },
      { new: true }
    );
    res.json({ message: "Wishlist cleared", wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
