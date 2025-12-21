require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

async function debugSeller() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const email = "debug.seller." + Date.now() + "@example.com";
    const tempPassword = "password123";
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    console.log("Creating user...");
    const seller = await User.create({
      name: "Debug Seller",
      email: email,
      password: hashedPassword,
      phone: "1234567890",
      role: "seller",
      isApproved: false,
      businessName: "Debug Business",
      businessAddress: "Debug Address",
      businessPhone: "1234567890",
      taxId: "TAXDEBUG"
    });

    console.log("Seller created:", seller._id);
    
    // Test finding admin
    const admins = await User.find({ role: "admin" });
    console.log("Admins found:", admins.length);

    mongoose.disconnect();
  } catch (error) {
    console.error("DEBUG ERROR:", error);
    mongoose.disconnect();
  }
}

debugSeller();
