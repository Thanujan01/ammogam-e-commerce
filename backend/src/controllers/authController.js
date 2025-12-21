const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { signToken } = require("../config/jwt");

exports.register = async (req, res) => {
  console.log("BACKEND DEBUG: authController register HIT with data:", req.body.email);
  const { name, email, password, phone, address } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email exists" });

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hash,
    phone,
    address,
    role: "customer",
  });

  res.json(user);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  // Check if seller account is approved
  if (user.role === 'seller' && user.isApproved === false) {
    return res.status(403).json({ 
      message: "Your seller account is pending approval. Please wait for admin confirmation." 
    });
  }

  const ok = await bcrypt.compare(password, user.password).catch(() => false);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = signToken({ id: user._id, role: user.role });

  // Don't send password to frontend
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address
  };

  res.json({ token, user: userResponse });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.address = address || user.address;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid old password" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.json({ message: "Password changed successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
