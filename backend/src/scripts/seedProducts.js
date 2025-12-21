const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const productsData = [
    // Mobile Accessories
    {
        name: 'Full Coverage Tempered Glass',
        description: 'Premium quality 9H hardness tempered glass for latest iPhone and Samsung models.',
        price: 499,
        stock: 150,
        mainSubcategory: 'Phone Accessories',
        subCategory: 'Screen Protectors',
        brand: 'Ammogam',
        badge: 'Bestseller',
        image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=400',
        features: ['9H hardness protection', 'Bubble-free installation', 'Ultra-clear transparency', 'Oleophobic coating'],
        warranty: '6 months warranty',
        returnPolicy: '30-day return policy',
        freeShipping: true,
        isCertified: true,
        isChoice: true,
        bundleDeals: 'Buy 2 Get 1 Free'
    },
    {
        name: 'Magnetic Silicone Case',
        description: 'Soft touch silicone case with built-in magnets for wireless charging.',
        price: 899,
        stock: 100,
        mainSubcategory: 'Phone Accessories',
        subCategory: 'Cases & Covers',
        brand: 'Ammogam',
        badge: 'New',
        image: 'https://images.unsplash.com/photo-1605170328248-c55091bf2e1d?auto=format&fit=crop&q=80&w=400',
        features: ['MagSafe compatible', 'Soft-touch silicone', 'Raised edges for screen protection', 'Wireless charging ready'],
        warranty: '1 year warranty',
        returnPolicy: '30-day return policy',
        freeShipping: false,
        freeShippingThreshold: 1500,
        isCertified: true,
        isChoice: true
    },
    {
        name: 'Fast Charging USB-C Cable',
        description: '60W Power Delivery compatible braided nylon cable for fast charging.',
        price: 350,
        stock: 500,
        mainSubcategory: 'Phone Accessories',
        subCategory: 'Cables',
        brand: 'Ammogam',
        image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&q=80&w=400',
        features: ['60W fast charging', 'Braided nylon design', 'Tangle-free', '10,000+ bend lifespan'],
        warranty: '1 year warranty',
        returnPolicy: '30-day return policy',
        freeShipping: true,
        isCertified: true,
        bundleDeals: 'Buy 3 for $ 10'
    },
    // Security Cameras
    {
        name: '360° WiFi Smart Camera',
        description: '1080p full HD smart camera with night vision and two-way audio.',
        price: 3499,
        stock: 50,
        mainSubcategory: 'Home Security',
        subCategory: 'WiFi Cameras',
        brand: 'SecureView',
        badge: 'Sale',
        discount: 15,
        image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&q=80&w=400',
        features: ['1080p Full HD', '360° pan and tilt', 'Night vision up to 10m', 'Two-way audio', 'Motion detection alerts'],
        warranty: '2 years warranty',
        returnPolicy: '30-day return policy',
        freeShipping: true,
        isCertified: true,
        isChoice: true
    },
    {
        name: 'Smart Video Doorbell',
        description: 'Talk to visitors from anywhere with our HD video doorbell with motion detection.',
        price: 7999,
        stock: 30,
        mainSubcategory: 'Home Security',
        subCategory: 'Doorbell Cameras',
        brand: 'SecureView',
        badge: 'New',
        image: 'https://images.unsplash.com/photo-1558002038-1055907df8d7?auto=format&fit=crop&q=80&w=400',
        features: ['HD video quality', 'Motion-activated alerts', 'Two-way talk', 'Cloud storage included', 'Night vision'],
        warranty: '2 years warranty',
        returnPolicy: '30-day return policy',
        freeShipping: true,
        isCertified: true,
        isChoice: true,
        bundleDeals: 'Free installation kit included'
    },
    // Men Fashion
    {
        name: 'Classic White Polo',
        description: 'High-quality cotton polo shirt, perfect for casual and semi-formal wear.',
        price: 1299,
        stock: 200,
        mainSubcategory: 'Clothing',
        subCategory: 'Polo Shirts',
        brand: 'Ammogam Men',
        image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=400',
        features: ['100% premium cotton', 'Breathable fabric', 'Wrinkle-resistant', 'Classic fit'],
        warranty: 'Quality guarantee',
        returnPolicy: '30-day return policy',
        freeShipping: false,
        freeShippingThreshold: 2000,
        isChoice: true
    },
    {
        name: 'Slim Fit Blue Jeans',
        description: 'Durable and stylish slim fit denim jeans with five-pocket styling.',
        price: 2499,
        stock: 120,
        mainSubcategory: 'Clothing',
        subCategory: 'Jeans',
        brand: 'Ammogam Men',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400',
        features: ['Premium denim fabric', 'Slim fit design', 'Five-pocket styling', 'Fade-resistant'],
        warranty: 'Quality guarantee',
        returnPolicy: '30-day return policy',
        freeShipping: true,
        isChoice: true
    },
    // Women Fashion
    {
        name: 'Floral Summer Dress',
        description: 'Lightweight and breathable floral print dress for hot summer days.',
        price: 3499,
        stock: 80,
        mainSubcategory: 'Clothing',
        subCategory: 'Dresses',
        brand: 'Ammogam Women',
        badge: 'Bestseller',
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=400',
        features: ['Lightweight fabric', 'Breathable material', 'Floral print design', 'Perfect for summer'],
        warranty: 'Quality guarantee',
        returnPolicy: '30-day return policy',
        freeShipping: true,
        isChoice: true,
        bundleDeals: 'Buy 2 Get 10% Off'
    },
    // Electronics
    {
        name: 'Wireless Bluetooth Headphones',
        description: 'Over-ear headphones with noise isolation and 20-hour battery life.',
        price: 4999,
        stock: 60,
        mainSubcategory: 'Audio & Video',
        subCategory: 'Headphones',
        brand: 'SoundPro',
        badge: 'New',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
        features: ['Active noise cancellation', '20-hour battery life', 'Bluetooth 5.0', 'Foldable design', 'Premium sound quality'],
        warranty: '1 year warranty',
        returnPolicy: '30-day return policy',
        freeShipping: true,
        isCertified: true,
        isChoice: true
    },
    {
        name: '14" Business Laptop',
        description: 'Powerful laptop with 16GB RAM and 512GB SSD for professional use.',
        price: 85000,
        stock: 15,
        mainSubcategory: 'Computers',
        subCategory: 'Laptops',
        brand: 'TechMaster',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400',
        features: ['Intel Core i7 processor', '16GB RAM', '512GB SSD storage', 'Full HD display', 'Backlit keyboard'],
        warranty: '1 year warranty',
        returnPolicy: '30-day return policy',
        freeShipping: true,
        isCertified: true,
        isChoice: true,
        bundleDeals: 'Free laptop bag + mouse'
    },
    // Home & Kitchen
    {
        name: 'Stainless Steel Cookware Set',
        description: '10-piece professional grade stainless steel pots and pans set.',
        price: 12999,
        stock: 25,
        mainSubcategory: 'Cookware',
        subCategory: 'Pots & Pans',
        brand: 'KitchenQueen',
        image: 'https://images.unsplash.com/photo-1584990344616-3b9427ae5e04?auto=format&fit=crop&q=80&w=400',
        features: ['10-piece set', 'Stainless steel construction', 'Dishwasher safe', 'Oven safe up to 500°F', 'Lifetime durability'],
        warranty: 'Lifetime warranty',
        returnPolicy: '30-day return policy',
        freeShipping: true,
        isCertified: true,
        isChoice: true,
        bundleDeals: 'Free cooking utensils set'
    }
];

async function seedProducts() {
    try {
        console.log('Product seed script started...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Existing products cleared');

        // Get categories to link products
        const categories = await Category.find({});
        if (categories.length === 0) {
            console.log('No categories found. Please run seedCategories.js first.');
            process.exit(1);
        }

        const seededProductsCount = 0;

        for (const pData of productsData) {
            // Find matched category by looking into its mainSubcategories titles
            const matchedCategory = categories.find(cat => 
                cat.mainSubcategories.some(ms => ms.title === pData.mainSubcategory)
            );

            if (matchedCategory) {
                await Product.create({
                    ...pData,
                    category: matchedCategory._id
                });
                console.log(`Added: ${pData.name} to Category: ${matchedCategory.name}`);
            } else {
                console.warn(`Could not find category for section: ${pData.mainSubcategory}`);
            }
        }

        console.log('Successfully seeded products.');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
}

seedProducts();
