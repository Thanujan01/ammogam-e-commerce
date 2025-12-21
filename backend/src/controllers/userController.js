const User = require("../models/User");
const Order = require("../models/Order");

// Get all customers (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Only fetch users with role 'customer'
    const users = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    
    // Calculate stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({ user: user._id });
        // Corrected totalPrice to totalAmount based on Order model
        const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        return {
          ...user.toObject(),
          orders: orders.length,
          totalSpent,
          status: 'active',
          joinedDate: user.createdAt
        };
      })
    );
    
    res.json(usersWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const orders = await Order.find({ user: user._id });
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    res.json({
      ...user.toObject(),
      orders: orders.length,
      totalSpent,
      status: 'active',
      joinedDate: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    
    await user.save();
    
    res.json({ message: "User updated successfully", user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user stats (customers only)
exports.getUserStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const orders = await Order.find({}); // All orders total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    res.json({
      totalUsers: totalCustomers,
      activeUsers: totalCustomers,
      inactiveUsers: 0,
      totalRevenue,
      totalOrders: orders.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
