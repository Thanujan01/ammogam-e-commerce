const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  const category = await Category.create({ name: req.body.name });
  res.json(category);
};

exports.getCategories = async (req, res) => {
  const list = await Category.find();
  res.json(list);
};
