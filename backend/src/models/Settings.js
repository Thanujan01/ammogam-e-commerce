const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
  {
    shippingFee: { type: Number, default: 350 },
    feePerAdditionalItem: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", SettingsSchema);
