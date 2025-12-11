const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    price: Number,
    stock: Number,
    image: String, // URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
