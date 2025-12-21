const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

// Get admin dashboard statistics
exports.getAdminStats = async (req, res) => {
  try {
    // Get all products
    const allProducts = await Product.find().populate('seller');
    const adminProducts = allProducts.filter(p => !p.seller);
    const sellerProducts = allProducts.filter(p => p.seller);

    const { type, date } = req.query;

    let startDate, endDate;
    let labels = [];
    let revenueData = [];
    let ordersData = [];
    const now = new Date();

    // Default: Yearly view for current year
    const viewType = type || 'yearly';
    const filterDate = date || now.getFullYear().toString();

    if (viewType === 'monthly') {
        // Expected format: YYYY-MM
        const [yearStr, monthStr] = filterDate.split('-');
        const year = parseInt(yearStr);
        const month = parseInt(monthStr) - 1; // 0-indexed

        if (isNaN(year) || isNaN(month)) {
            // Fallback if bad date
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        } else {
            startDate = new Date(year, month, 1);
            endDate = new Date(year, month + 1, 0, 23, 59, 59);
        }

        const daysInMonth = endDate.getDate(); // e.g., 31
        
        // Initialize daily buckets
        for (let i = 1; i <= daysInMonth; i++) {
            labels.push(i.toString());
            revenueData.push(0);
            ordersData.push(0);
        }
    } else {
        // Yearly view
        const year = parseInt(filterDate) || now.getFullYear();
        startDate = new Date(year, 0, 1);
        endDate = new Date(year, 11, 31, 23, 59, 59);

        labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        revenueData = new Array(12).fill(0);
        ordersData = new Array(12).fill(0);
    }

    // Get orders in range
    const allOrders = await Order.find({
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $ne: 'cancelled' } // Only count valid sales
    }).populate('items.product');


    // 1. Calculate Aggregates for Chart
    allOrders.forEach(order => {
        const d = new Date(order.createdAt);
        let index = 0;

        if (viewType === 'monthly') {
            index = d.getDate() - 1; // 1 -> 0
        } else {
            index = d.getMonth(); // 0 -> 0
        }

        if (index >= 0 && index < labels.length) {
            ordersData[index] += 1;
            
            // Calculate revenue for this order
            let orderRevenue = 0;
            order.items.forEach(item => {
                const itemTotal = item.price * item.quantity;
                const isSellerProduct = item.product && item.product.seller;

                if (!isSellerProduct) {
                    orderRevenue += itemTotal;
                } else {
                    orderRevenue += itemTotal * 0.05; // 5% commission
                }
            });
            revenueData[index] += orderRevenue;
        }
    });

    const monthlyRevenue = {
        labels: labels,
        data: revenueData
    };
    const monthlyOrders = {
        labels: labels,
        data: ordersData
    };


    // 2. Calculate Totals (card stats) for the Selected Date Range
    let adminProductRevenue = 0;
    let sellerProductRevenue = 0;

    allOrders.forEach(order => {
      let storeTotal = 0;
      order.items.forEach(item => {
        const isSellerProduct = item.product && item.product.seller;
        
        if (!isSellerProduct) {
          storeTotal += item.price * item.quantity;
        } else {
          sellerProductRevenue += item.price * item.quantity;
        }
      });
      adminProductRevenue += storeTotal;
    });

    const adminCommissionFromSellers = sellerProductRevenue * 0.05;
    const totalAdminRevenue = adminProductRevenue + adminCommissionFromSellers;
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(o => o.status === 'pending').length;
    
    // Global stats (not filtered by date) for these specific counters if desired? 
    // Usually reports differ from "Dashboard" in that reports are filtered. 
    // The previous implementation mixed them (totalSellers is global, totalOrders was filtered). 
    // Let's keep totals filtered to be consistent "Report for this period".
    // But totalProducts/Customers/Sellers are usually snapshots of NOW, not historical.
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalSellers = await User.countDocuments({ role: 'seller', isApproved: true });


    // Sales by Category
    const categoryMap = new Map();
    allOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.product && item.product.category) {
          const categoryName = item.product.category.name || 'Uncategorized';
          const itemTotal = item.price * item.quantity;
          categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + itemTotal);
        }
      });
    });
    
    const salesByCategory = {
      labels: Array.from(categoryMap.keys()),
      data: Array.from(categoryMap.values())
    };

    // Top Products (by revenue)
    const productRevenueMap = new Map();
    allOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.product) {
          const productId = item.product._id.toString();
          const itemTotal = item.price * item.quantity;
          
          if (!productRevenueMap.has(productId)) {
            productRevenueMap.set(productId, {
              name: item.product.name,
              revenue: 0,
              unitsSold: 0
            });
          }
          
          const productData = productRevenueMap.get(productId);
          productData.revenue += itemTotal;
          productData.unitsSold += item.quantity;
        }
      });
    });
    
    const topProducts = Array.from(productRevenueMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Low Stock Products (stock < 20)
    const lowStockProducts = await Product.find({ stock: { $lt: 20 } })
      .populate('category')
      .sort({ stock: 1 })
      .limit(5)
      .lean();
    
    const formattedLowStock = lowStockProducts.map(p => ({
      name: p.name,
      stock: p.stock,
      category: p.category?.name || 'Uncategorized'
    }));

    console.log(`Low stock products found: ${formattedLowStock.length}`);

    res.json({
      totalRevenue: totalAdminRevenue,
      adminProductRevenue,
      sellerProductRevenue,
      adminCommissionFromSellers,
      sellerPayoutAmount: sellerProductRevenue * 0.95,
      totalProducts: allProducts.length,
      adminProducts: adminProducts.length,
      sellerProducts: sellerProducts.length,
      totalOrders,
      pendingOrders,
      totalCustomers,
      totalSellers,
      monthlyRevenue: monthlyRevenue, // { labels, data }
      monthlyOrders: monthlyOrders,   // { labels, data }
      averageOrderValue: allOrders.length > 0 ? (totalAdminRevenue / allOrders.length) : 0,
      salesByCategory,
      topProducts,
      lowStockProducts: formattedLowStock,
      recentOrders: allOrders.slice(0, 5).map(order => ({
        _id: order._id,
        user: order.user,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
