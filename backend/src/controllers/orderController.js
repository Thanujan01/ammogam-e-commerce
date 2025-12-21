const Order = require("../models/Order");
const Notification = require("../models/Notification");
const User = require("../models/User");
const Product = require("../models/Product");

exports.placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingFee, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingFee: shippingFee || 0,
      shippingAddress,
      paymentMethod,
    });

    // Notify Admins
    try {
      const admins = await User.find({ role: "admin" });
      const adminNotifications = admins.map(admin => ({
        recipient: admin._id,
        title: "New Order Received!",
        message: `A new order #${order._id.toString().slice(-8).toUpperCase()} has been placed by ${req.user.name}.`,
        type: "order_status",
        orderId: order._id
      }));
      await Notification.insertMany(adminNotifications);

      // Notify Sellers
      // We need to group items by seller to avoid sending multiple notifications to same seller for one order
      const sellerItemsMap = {}; // sellerId -> [productNames]
      
      // We need to fetch product details to know the sellers (req.body.items only has IDs usually, or minimal data)
      // But wait, checking the model, items array structure in request might not have seller info populated?
      // We stored the order. let's re-fetch it with populate or rely on IDs if we can.
      // Easiest is to iterate the items from request and look up products, or fetch the created order.
      
      const popOrder = await Order.findById(order._id).populate('items.product');

      popOrder.items.forEach(item => {
          if (item.product && item.product.seller) {
              const sellerId = item.product.seller.toString();
              if (!sellerItemsMap[sellerId]) {
                  sellerItemsMap[sellerId] = [];
              }
              sellerItemsMap[sellerId].push(item.product.name);
          }
      });

      const sellerNotifications = Object.keys(sellerItemsMap).map(sellerId => ({
          recipient: sellerId,
          title: "New Order for Your Products!",
          message: `You have sold: ${sellerItemsMap[sellerId].join(', ')} in Order #${order._id.toString().slice(-8).toUpperCase()}`,
          type: "order", // 'order_status' or 'order'
          orderId: order._id
      }));

      if (sellerNotifications.length > 0) {
          await Notification.insertMany(sellerNotifications);
      }

    } catch (notiErr) {
      console.error("Notification Error:", notiErr);
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.paymentStatus = "paid";
      order.status = "processed";
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      // Sync all items to the same status when admin updates overall order
      order.items.forEach(item => {
        item.status = status;
      });
      const updatedOrder = await order.save();

      // Create notification for customer
      try {
        await Notification.create({
          recipient: order.user,
          title: "Order Status Updated",
          message: `Your order #${order._id.toString().slice(-8).toUpperCase()} is now ${status}.`,
          type: "order_status",
          orderId: order._id
        });
      } catch (notiErr) {
        console.error("Notification Error:", notiErr);
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort("-createdAt");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort("-createdAt");

    // Filter to only include store products (where seller is null)
    const storeOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.filter(item => !item.product || !item.product.seller);
      
      // Calculate store-specific subtotal for the admin view
      orderObj.storeTotal = orderObj.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return orderObj;
    }).filter(order => order.items.length > 0); // Only show orders that have at least one store product

    res.json(storeOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product");

    if (order) {
      // Check if user is owner or admin
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSellerOrders = async (req, res) => {
  try {
    // Find all products by this seller
    const sellerProducts = await Product.find({ seller: req.user._id });
    const productIds = sellerProducts.map(p => p._id.toString());

    // Find orders containing these products
    const orders = await Order.find({ "items.product": { $in: productIds } })
      .populate("user", "name email")
      .populate("items.product")
      .sort("-createdAt");

    // For each order, only include the items belonging to the seller
    const filteredOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.filter(item => 
        item.product && item.product.seller && item.product.seller.toString() === req.user._id.toString()
      );
      // Recalculate seller-specific total for this order view if needed, 
      // but let's keep original total and just filter items for display.
      return orderObj;
    });

    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderItemStatus = async (req, res) => {
  try {
    const { orderId, productId, status } = req.body;
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.items.find(it => it.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found in order" });

    // Verify it's the seller's product
    const product = await Product.findById(productId);
    if (!product || !product.seller || product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this product's status" });
    }

    item.status = status;
    
    // Auto-update overall order status based on items? 
    // If all items are shipped, maybe order is shipped? 
    // For now, let's keep them independent or let admin handle overall.
    
    await order.save();

    res.json({ message: "Item status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
