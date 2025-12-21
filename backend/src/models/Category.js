const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    icon: { type: String },
    color: { type: String },
    bgColor: { type: String },
    borderColor: { type: String },
    textColor: { type: String },
    image: { type: String },
    promoText: { type: String },
    mainSubcategories: [
      {
        title: { type: String, required: true },
        items: [{ type: String, required: true }],
      },
    ],
    featuredProducts: [
      {
        name: { type: String, required: true },
        price: { type: String, required: true },
        discount: { type: String },
        tag: { type: String },
        image: { type: String },
      },
    ],
    subCategories: [
      {
        name: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
