const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Update seller profile (contact info and bank details)
exports.updateSellerProfile = async (req, res) => {
  try {
    const { email, phone, bankName, accountHolderName, accountNumber, ifscCode, branchName } = req.body;
    
    const seller = await User.findById(req.user._id);
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: "Seller not found" });
    }
    
    // Update only allowed fields
    if (email) seller.email = email;
    if (phone) seller.phone = phone;
    if (bankName !== undefined) seller.bankName = bankName;
    if (accountHolderName !== undefined) seller.accountHolderName = accountHolderName;
    if (accountNumber !== undefined) seller.accountNumber = accountNumber;
    if (ifscCode !== undefined) seller.ifscCode = ifscCode;
    if (branchName !== undefined) seller.branchName = branchName;
    
    await seller.save();
    
    res.json({ 
      message: "Profile updated successfully", 
      seller: { 
        ...seller.toObject(), 
        password: undefined 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change seller password
exports.changeSellerPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old password and new password are required" });
    }
    
    const seller = await User.findById(req.user._id);
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: "Seller not found" });
    }
    
    const isMatch = await bcrypt.compare(oldPassword, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid old password" });
    }
    
    seller.password = await bcrypt.hash(newPassword, 10);
    await seller.save();
    
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get seller profile
exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await User.findById(req.user._id).select('-password');
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: "Seller not found" });
    }
    
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
