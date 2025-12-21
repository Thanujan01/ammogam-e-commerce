const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User'); 
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("DB Error:", err.message);
        process.exit(1);
    }
};

const run = async () => {
    console.log("Starting Debug Script...");
    await connectDB();

    try {
        const allOrders = await Order.find().populate('items.product');
        console.log(`Total Orders: ${allOrders.length}`);

        let adminRevenue = 0;
        let sellerRevenue = 0;

        for (const order of allOrders) {
            // console.log(`Order ID: ${order._id}, Total: ${order.totalAmount}`);
            for (const item of order.items) {
                const itemTotal = item.price * item.quantity;
                
                // NEW LOGIC
                const isSellerProduct = item.product && item.product.seller;

                if (!isSellerProduct) {
                    // console.log(`  Item (Price: ${item.price}, Qty: ${item.quantity}) -> Admin Revenue`);
                    adminRevenue += itemTotal;
                } else {
                    // console.log(`  Item (Price: ${item.price}, Qty: ${item.quantity}) -> Seller Revenue`);
                    sellerRevenue += itemTotal;
                }
            }
        }

        console.log('--- Summary ---');
        console.log(`Calculated Admin Revenue: ${adminRevenue}`);
        console.log(`Calculated Seller Revenue: ${sellerRevenue}`);

    } catch (e) {
        console.error(e);
    }
    
    process.exit();
};

run();
