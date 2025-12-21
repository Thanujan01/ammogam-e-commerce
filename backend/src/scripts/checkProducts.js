const mongoose = require('mongoose');
const Product = require('../models/Product');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await Product.countDocuments();
    console.log(`Product count: ${count}`);
    const products = await Product.find().populate('category');
    products.forEach(p => {
        console.log(`- ${p.name} | Cat: ${p.category?.name} | Section: ${p.mainSubcategory} | Item: ${p.subCategory}`);
    });
    process.exit(0);
}
check();
