const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    mainSubcategory: String, // e.g., "Phone Accessories"
    subCategory: String, // e.g., "Cases & Covers"
    price: Number,
    stock: Number,
    image: String, // URL
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    sold: { type: Number, default: 0 },
    badge: String,
    brand: String,
    
    // Seller reference
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null for admin-added products
    
    // Enhanced product details
    features: [String], // e.g., ["High quality material", "Durable and long lasting", "Warranty included"]
    warranty: String, // e.g., "1 year warranty"
    returnPolicy: String, // e.g., "30-day return policy"
    freeShipping: { type: Boolean, default: false },
    freeShippingThreshold: Number, // Minimum order amount for free shipping
    bundleDeals: String, // Description of bundle deals available
    isCertified: { type: Boolean, default: false },
    isChoice: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
