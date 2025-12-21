const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["admin", "customer", "seller"], default: "customer" },

    address: String,
    phone: String,
    
    
    // Seller-specific fields
    isApproved: { type: Boolean, default: true }, // false for sellers until admin approves
    businessName: String,
    businessAddress: String,
    businessPhone: String,
    taxId: String,
    approvedAt: Date,
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    
    // Bank details for sellers
    bankName: String,
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    branchName: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
