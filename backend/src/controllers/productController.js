const Product = require("../models/Product");
const Order = require("../models/Order");

exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock, description, category, mainSubcategory, subCategory } = req.body;

    const product = await Product.create({
      name,
      price,
      stock,
      description,
      category,
      mainSubcategory,
      subCategory,
      image: req.body.image || null,
      discount: req.body.discount || 0,
      badge: req.body.badge || '',
      brand: req.body.brand || '',
      features: req.body.features || [],
      warranty: req.body.warranty || '',
      returnPolicy: req.body.returnPolicy || '',
      freeShipping: req.body.freeShipping || false,
      freeShippingThreshold: req.body.freeShippingThreshold || 0,
      bundleDeals: req.body.bundleDeals || '',
      isCertified: req.body.isCertified || false,
      isChoice: req.body.isChoice || false,
      // Track seller if user is a seller
      seller: req.user && req.user.role === 'seller' ? req.user._id : null
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category").populate("seller", "name businessName email");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category").populate("seller", "name businessName");
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If user is a seller, they can only update their own products
    if (req.user.role === 'seller' && product.seller && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own products" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If user is a seller, they can only delete their own products
    if (req.user.role === 'seller' && product.seller && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own products" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get seller's own products
exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get seller dashboard stats
exports.getSellerStats = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Get seller's products
    const products = await Product.find({ seller: sellerId });
    const productIds = products.map(p => p._id);

    // Get orders containing seller's products
    const orders = await Order.find({
      'items.product': { $in: productIds }
    }).populate('items.product');

    // Calculate stats
    let totalRevenue = 0;
    let totalOrders = 0;
    let totalProductsSold = 0;

    orders.forEach(order => {
      order.items.forEach(item => {
        if (productIds.some(id => id.toString() === item.product._id.toString())) {
          totalRevenue += item.price * item.quantity;
          totalProductsSold += item.quantity;
        }
      });
      totalOrders++;
    });

    res.json({
      totalProducts: products.length,
      totalOrders,
      totalRevenue,
      totalProductsSold,
      products: products.slice(0, 10) // Return latest 10 products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get seller's orders
exports.getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Get seller's products
    const products = await Product.find({ seller: sellerId });
    const productIds = products.map(p => p._id);

    // Get orders containing seller's products
    const orders = await Order.find({
      'items.product': { $in: productIds }
    }).populate('user', 'name email phone').populate('items.product').sort({ createdAt: -1 });

    // Filter order items to only include seller's products
    const sellerOrders = orders.map(order => {
      const sellerItems = order.items.filter(item => 
        productIds.some(id => id.toString() === item.product._id.toString())
      );

      const sellerTotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...order.toObject(),
        items: sellerItems,
        sellerTotal
      };
    });

    res.json(sellerOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
