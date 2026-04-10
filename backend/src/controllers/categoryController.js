const Category = require("../models/Category");

const categoryCache = new Map();
const CATEGORY_CACHE_TTL_MS = 60 * 1000;

const getCategoryCache = (key) => {
  const cached = categoryCache.get(key);
  if (!cached) return null;
  if (cached.expiresAt < Date.now()) {
    categoryCache.delete(key);
    return null;
  }
  return cached.data;
};

const setCategoryCache = (key, data) => {
  categoryCache.set(key, { data, expiresAt: Date.now() + CATEGORY_CACHE_TTL_MS });
};

const clearCategoryCache = () => {
  categoryCache.clear();
};

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    clearCategoryCache();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const cacheKey = req.originalUrl;
    const cached = getCategoryCache(cacheKey);
    if (cached) {
      res.set('X-Cache', 'HIT');
      res.set('Cache-Control', 'public, max-age=60');
      return res.json(cached);
    }

    const limit = parseInt(req.query.limit) || 0;
    const query = Category.find().lean();

    if (limit > 0) {
      query.limit(limit);
    }

    if (req.query.select) {
      const selectFields = req.query.select.split(',').join(' ');
      query.select(selectFields);
    }

    const list = await query;
    setCategoryCache(cacheKey, list);
    res.set('X-Cache', 'MISS');
    res.set('Cache-Control', 'public, max-age=60');
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    clearCategoryCache();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    clearCategoryCache();
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
