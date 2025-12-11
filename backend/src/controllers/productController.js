const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  const { name, price, stock, description, category } = req.body;

  const product = await Product.create({
    name,
    price,
    stock,
    description,
    category,
    image: req.body.image || null,
  });

  res.json(product);
};

exports.getAllProducts = async (req, res) => {
  const products = await Product.find().populate("category");
  res.json(products);
};

exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
