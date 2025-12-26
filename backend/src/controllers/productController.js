const Product = require("../models/Product");
const Order = require("../models/Order");

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category, mainSubcategory, subCategory } = req.body;
    const colorVariants = req.body.colorVariants || [];
    
    // Calculate total stock from variants
    const totalStock = colorVariants.reduce((sum, variant) => sum + (Number(variant.stock) || 0), 0);
    
    // Pick the first image of the first variant as the main image
    let defaultImage = null;
    if (colorVariants.length > 0 && colorVariants[0].images && colorVariants[0].images.length > 0) {
      defaultImage = colorVariants[0].images[0];
    }

    const product = await Product.create({
      name,
      price,
      stock: totalStock,
      description,
      category,
      mainSubcategory,
      subCategory,
      image: defaultImage,
      discount: req.body.discount || 0,
      badge: req.body.badge || '',
      brand: req.body.brand || '',
      features: req.body.features || [],
      warranty: req.body.warranty || '',
      returnPolicy: req.body.returnPolicy || '',
      shippingFee: req.body.shippingFee || 0,
      bundleDeals: req.body.bundleDeals || '',
      isCertified: req.body.isCertified || false,
      isChoice: req.body.isChoice || false,
      colorVariants,
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
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Calculate accurate stock from colorVariants
    let accurateStock = 0;
    if (Array.isArray(product.colorVariants) && product.colorVariants.length > 0) {
      accurateStock = product.colorVariants.reduce((sum, variant) => sum + (Number(variant.stock) || 0), 0);
    } else if (typeof product.stock === 'number') {
      accurateStock = product.stock;
    }

    // Return product with accurate stock and sold count
    const productObj = product.toObject();
    productObj.stock = accurateStock;
    productObj.sold = product.sold || 0;
    res.json(productObj);
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

    const updateData = { ...req.body };

    // If colorVariants are provided, recalculate stock and image
    if (updateData.colorVariants) {
      const colorVariants = updateData.colorVariants;
      updateData.stock = colorVariants.reduce((sum, variant) => sum + (Number(variant.stock) || 0), 0);
      
      if (colorVariants.length > 0 && colorVariants[0].images && colorVariants[0].images.length > 0) {
        updateData.image = colorVariants[0].images[0];
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
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
        if (item.product && productIds.some(id => id.toString() === item.product._id.toString())) {
          totalRevenue += (item.price * item.quantity) + (item.shippingFee || 0);
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
