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
    rating: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    badge: String,
    brand: String,
    
    // Seller reference
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null for admin-added products
    
    // Enhanced product details
    features: [String], // e.g., ["High quality material", "Durable and long lasting", "Warranty included"]
    warranty: String, // e.g., "1 year warranty"
    returnPolicy: String, // e.g., "30-day return policy"
    shippingFee: { type: Number, default: 0 },
    bundleDeals: String, // Description of bundle deals available
    isCertified: { type: Boolean, default: false },
    isChoice: { type: Boolean, default: false },
    
    // Color Variants with weight or size options
    colorVariants: [{
      colorName: String,
      colorCode: String,
      variantType: { type: String, enum: ['size', 'weight', 'none'], default: 'none' },
      sizes: [{
        size: String,
        stock: { type: Number, default: 0 },
        price: { type: Number, default: 0 }
      }],
      weights: [{
        weight: String,
        stock: { type: Number, default: 0 },
        price: { type: Number, default: 0 }
      }],
      stock: { type: Number, default: 0 }, // fallback stock if no size/weight
      images: [String] // Array of image URLs (max 5 enforced in frontend/controller)
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
