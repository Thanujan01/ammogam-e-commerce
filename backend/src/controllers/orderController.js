const Order = require("../models/Order");

exports.placeOrder = async (req, res) => {
  const { items, totalAmount } = req.body;

  const order = await Order.create({
    user: req.user._id,
    items,
    totalAmount,
  });

  res.json(order);
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("items.product");
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user");
  res.json(orders);
};
