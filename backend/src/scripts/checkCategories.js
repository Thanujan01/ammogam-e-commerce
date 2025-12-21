const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

dotenv.config();

const checkCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const categories = await Category.find({});
        console.log(`Found ${categories.length} categories.`);
        categories.forEach(c => {
            console.log(`Category: ${c.name}, Subcats: ${c.subCategories.length}`);
            if (c.subCategories.length > 0) {
                console.log(` - Example sub: ${c.subCategories[0].name}`);
            }
        });
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkCategories();
