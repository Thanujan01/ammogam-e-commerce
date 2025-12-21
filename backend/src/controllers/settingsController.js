const Settings = require("../models/Settings");

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ shippingFee: 350, freeShippingThreshold: 5000 });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { shippingFee, freeShippingThreshold, feePerAdditionalItem } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    settings.shippingFee = shippingFee !== undefined ? shippingFee : settings.shippingFee;
    settings.freeShippingThreshold = freeShippingThreshold !== undefined ? freeShippingThreshold : settings.freeShippingThreshold;
    settings.feePerAdditionalItem = feePerAdditionalItem !== undefined ? feePerAdditionalItem : settings.feePerAdditionalItem;
    
    const updated = await settings.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
