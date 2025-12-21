const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const emailService = require("../services/emailService");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Helper to generate a random password
const generateRandomPassword = (length = 10) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') // convert to hexadecimal format
    .slice(0, length); // return required number of characters
};

// Seller registration
exports.registerSeller = async (req, res) => {
  console.log("-----------------------------------------");
  console.log("BACKEND DEBUG: registerSeller RECEIVED DATA:");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("-----------------------------------------");

  try {
    const {
      name,
      email,
      phone,
      businessName,
      businessAddress,
      businessPhone,
      taxId
    } = req.body;

    // Basic validation - Password NO LONGER REQUIRED during registration
    if (!name || !email || !phone) {
      console.log("BACKEND DEBUG: Validation Failed - Missing basic data (name, email, or phone)");
      return res.status(400).json({ message: "Name, email, and phone are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("BACKEND DEBUG: Conflict - Email already exists:", email);
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create seller instance with no password (will be generated on approval)
    console.log("BACKEND DEBUG: Creating User document in MongoDB...");
    const seller = new User({
      name,
      email,
      password: "PENDING_APPROVAL", // Placeholder
      phone,
      role: "seller",
      isApproved: false,
      businessName,
      businessAddress,
      businessPhone,
      taxId
    });

    await seller.save();
    console.log("BACKEND DEBUG: Seller Saved Successfully. ID:", seller._id);

    return res.status(201).json({
      message: "Registration successful. Admin will review your application and send login details via email.",
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email
      }
    });

  } catch (error) {
    console.error("BACKEND DEBUG: FATAL ERROR DURING SELLER REGISTRATION:", error);
    return res.status(500).json({ message: "Internal Server Error: " + error.message });
  }
};

// Get pending sellers (admin only)
exports.getPendingSellers = async (req, res) => {
  try {
    const pendingSellers = await User.find({
      role: "seller",
      isApproved: false
    }).select('-password').sort({ createdAt: -1 });

    res.json(pendingSellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve seller (admin only)
exports.approveSeller = async (req, res) => {
  console.log("BACKEND DEBUG: approveSeller called for ID:", req.params.id);
  try {
    const seller = await User.findById(req.params.id);
    if (!seller) {
      console.log("BACKEND DEBUG: Seller not found");
      return res.status(404).json({ message: "Seller not found" });
    }

    if (seller.role !== 'seller') {
      return res.status(400).json({ message: "User is not a seller" });
    }

    // Generate credentials
    const plainPassword = generateRandomPassword(12);
    console.log("BACKEND DEBUG: Generated Password for seller:", plainPassword);

    // Hash the generated password
    console.log("BACKEND DEBUG: Hashing generated password...");
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    seller.password = hashedPassword;
    seller.isApproved = true;
    seller.approvedAt = new Date();
    if (req.user) {
      seller.approvedBy = req.user._id || req.user.id;
    }

    await seller.save();
    console.log("BACKEND DEBUG: Seller approved and password saved");

    // Send email with credentials
    console.log("BACKEND DEBUG: Sending credentials email to:", seller.email);
    const emailSent = await emailService.sendSellerCredentials(seller.email, seller.name, plainPassword);
    
    if (!emailSent) {
      console.warn("BACKEND DEBUG: Account approved but email failed to send.");
      return res.json({ 
        message: "Seller approved, but there was an error sending the welcome email. Please contact the seller manually.",
        tempPassword: plainPassword // Optional: provide to admin in case of failure
      });
    }

    res.json({ message: "Seller approved successfully and credentials sent via email." });
  } catch (error) {
    console.error("BACKEND DEBUG: Error in approveSeller:", error);
    res.status(500).json({ message: error.message });
  }
};

// Reject seller (admin only)
exports.rejectSeller = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    // For rejection, we can just delete the user record
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "Seller request rejected and removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all approved sellers (admin only)
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({
      role: "seller",
      isApproved: true
    }).select('-password').sort({ createdAt: -1 });

    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific seller's basic details (admin only)
exports.getSellerById = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id).select("-password");
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific seller's products (admin only)
exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.id }).populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific seller's orders (admin only)
exports.getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.params.id;
    const products = await Product.find({ seller: sellerId });
    const productIds = products.map(p => p._id);

    const orders = await Order.find({
      'items.product': { $in: productIds }
    }).populate('user', 'name email').populate('items.product').sort({ createdAt: -1 });

    const filteredOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.filter(item => 
        item.product && item.product.seller && item.product.seller.toString() === sellerId
      );
      return orderObj;
    });

    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
