const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        color: { type: String }, // Selected color name
        colorCode: { type: String }, // Selected color hex code
        variationId: { type: String }, // Color variant ID
        selectedSize: { type: String },
        selectedWeight: { type: String },
        shippingFee: { type: Number, default: 0 },
        status: {
          type: String,
          enum: ["pending", "processed", "shipped", "delivered", "cancelled"],
          default: "pending",
        },
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
      postalCode: String,
    },
    paymentMethod: { type: String, default: "Online Payment" },
    paymentStatus: { type: String, enum: ["unpaid", "paid", "failed"], default: "unpaid" },
    status: {
      type: String,
      enum: ["pending", "processed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
