const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('../models/Order');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function updateOrderWithColor() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const orderId = '694d6f371849cb89443794b5';
        
        // Find the order
        const order = await Order.findById(orderId);
        
        if (!order) {
            console.log('Order not found!');
            process.exit(1);
        }

        console.log('Order found:', order.items[0].product);

        // Update the first item with color information
        // Assuming it's the Floral Summer Dress
        order.items[0].color = 'Coral Sunset';
        order.items[0].colorCode = '#ff7f50';
        order.items[0].variationId = 'variant_coral_sunset';

        await order.save();

        console.log('✅ Order updated successfully with color information!');
        console.log('Color:', order.items[0].color);
        console.log('Color Code:', order.items[0].colorCode);
        
        process.exit(0);
    } catch (error) {
        console.error('Error updating order:', error);
        process.exit(1);
    }
}

updateOrderWithColor();
