const Product = require("../models/Product");
const Notification = require("../models/Notification");
const User = require("../models/User");

/**
 * Handles stock reduction and sold count increment after successful payment or delivery.
 * This should be called only once per order's payment lifecycle.
 */
exports.handleOrderPayment = async (order) => {
  // If order is already partially processed or paid, we should be careful.
  // However, handleOrderPayment is intended to be called when paymentStatus transitions to 'paid'.
  
  for (const item of order.items) {
    const product = await Product.findById(item.product._id || item.product);
    if (product) {
      let variantFound = false;
      let targetVariant = null;

      // Update variant stock if applicable
      if (product.colorVariants && product.colorVariants.length > 0) {
        targetVariant = product.colorVariants.find(v => 
          (item.variationId && v._id.toString() === item.variationId.toString()) || 
          (v.colorName === item.color)
        );
        
        if (targetVariant) {
          if (targetVariant.variantType === 'size' && item.selectedSize) {
            const sizeOpt = targetVariant.sizes.find(s => s.size === item.selectedSize);
            if (sizeOpt) sizeOpt.stock = Math.max(0, sizeOpt.stock - item.quantity);
          } else if (targetVariant.variantType === 'weight' && item.selectedWeight) {
            const weightOpt = targetVariant.weights.find(w => w.weight === item.selectedWeight);
            if (weightOpt) weightOpt.stock = Math.max(0, weightOpt.stock - item.quantity);
          } else {
            targetVariant.stock = Math.max(0, targetVariant.stock - item.quantity);
          }
          variantFound = true;
        }
      }
      
      // Recalculate overall product stock
      let totalStock = 0;
      if (product.colorVariants && product.colorVariants.length > 0) {
        totalStock = product.colorVariants.reduce((sum, variant) => {
          if (variant.variantType === 'size' && variant.sizes) {
            return sum + variant.sizes.reduce((s, size) => s + (Number(size.stock) || 0), 0);
          } else if (variant.variantType === 'weight' && variant.weights) {
            return sum + variant.weights.reduce((w, weight) => w + (Number(weight.stock) || 0), 0);
          } else {
            return sum + (Number(variant.stock) || 0);
          }
        }, 0);
      } else {
        totalStock = Math.max(0, product.stock - item.quantity);
      }
      
      product.stock = totalStock;
      product.sold = (product.sold || 0) + item.quantity;
      
      await product.save();

      // Check for Low Stock Alert (Threshold: 5)
      const STOCK_THRESHOLD = 5;
      const currentStock = variantFound && targetVariant ? targetVariant.stock : product.stock;

      if (currentStock <= STOCK_THRESHOLD) {
        const lowStockMsg = `Low Stock Alert: ${product.name}${item.color ? ` (Color: ${item.color})` : ''} only has ${currentStock} left!`;
        
        // Notify Seller
        if (product.seller) {
          await Notification.create({
            recipient: product.seller,
            title: "Low Stock Alert!",
            message: lowStockMsg,
            type: "stock_alert",
            productId: product._id
          });
        }

        // Notify Admins
        const admins = await User.find({ role: "admin" });
        const adminStockNotifications = admins.map(admin => ({
          recipient: admin._id,
          title: "Inventory Alert",
          message: lowStockMsg + (product.seller ? ` (Seller: ${product.seller.businessName || 'Merchant'})` : ''),
          type: "stock_alert",
          productId: product._id
        }));
        await Notification.insertMany(adminStockNotifications);
      }
    }
  }
};
