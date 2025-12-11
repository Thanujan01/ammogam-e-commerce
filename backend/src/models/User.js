const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["admin", "customer"], default: "customer" },

    address: String,
    phone: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
