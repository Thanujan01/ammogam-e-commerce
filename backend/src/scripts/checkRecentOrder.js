const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('../models/Order');
const Product = require('../models/Product'); // Need to require this for populate to work
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function checkRecentOrder() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected\n');

        // Find the most recent order
        const recentOrder = await Order.findOne()
            .sort({ createdAt: -1 })
            .populate('items.product');
        
        if (!recentOrder) {
            console.log('No orders found!');
            process.exit(1);
        }

        console.log('=== MOST RECENT ORDER ===');
        console.log('Order ID:', recentOrder._id);
        console.log('Created:', recentOrder.createdAt);
        console.log('Status:', recentOrder.status);
        console.log('\n=== ORDER ITEMS ===');
        
        recentOrder.items.forEach((item, index) => {
            console.log(`\nItem ${index + 1}:`);
            console.log('  Product:', item.product?.name || 'Unknown');
            console.log('  Quantity:', item.quantity);
            console.log('  Price:', item.price);
            console.log('  Color:', item.color || 'NOT SET');
            console.log('  Color Code:', item.colorCode || 'NOT SET');
            console.log('  Variation ID:', item.variationId || 'NOT SET');
        });

        console.log('\n=== RAW ITEM DATA ===');
        console.log(JSON.stringify(recentOrder.items[0], null, 2));
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkRecentOrder();
