const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

console.log('Seed script started...');
dotenv.config();
console.log('MONGO_URI present:', !!process.env.MONGO_URI);
if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is missing from .env');
    process.exit(1);
}

const categoriesData = [
    { 
      name: 'Mobile accessories', 
      icon: 'FaMobileAlt', 
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'Up to 50% OFF on mobile accessories',
      mainSubcategories: [
        {
          title: 'Phone Accessories',
          items: ['Cases & Covers', 'Screen Protectors', 'Chargers', 'Power Banks', 'Headphones', 'Cables']
        },
        {
          title: 'Smart Devices',
          items: ['Smart Watches', 'Fitness Bands', 'Bluetooth Earphones', 'Wireless Chargers', 'Selfie Sticks']
        },
        {
          title: 'Audio & Sound',
          items: ['Earphones', 'Speakers', 'Headphones', 'Microphones', 'Sound Systems']
        }
      ],
      featuredProducts: [
        { name: 'Wireless Earbuds', price: '₹4,999', discount: '30% OFF', image: '🎧' },
        { name: 'Fast Charger', price: '₹1,499', tag: 'Bestseller', image: '🔌' },
        { name: 'Phone Case', price: '₹799', discount: '20% OFF', image: '📱' }
      ]
    },
    { 
      name: 'Security cameras', 
      icon: 'FaCamera', 
      color: 'from-gray-500 to-gray-700',
      bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-700',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'Free installation available',
      mainSubcategories: [
        {
          title: 'Home Security',
          items: ['WiFi Cameras', 'Outdoor Cameras', 'Doorbell Cameras', 'Baby Monitors', 'Night Vision']
        },
        {
          title: 'Security Systems',
          items: ['CCTV Systems', 'NVR Kits', 'DVR Systems', 'Security Alarms', 'Motion Sensors']
        },
        {
          title: 'Accessories',
          items: ['Mounts & Stands', 'Cables', 'Storage Cards', 'Power Supplies', 'Extension Kits']
        }
      ],
      featuredProducts: [
        { name: 'WiFi Camera', price: '₹6,999', discount: '25% OFF', image: '📹' },
        { name: 'CCTV Kit', price: '₹12,499', tag: 'Popular', image: '🎥' },
        { name: 'Doorbell Camera', price: '₹8,999', discount: '15% OFF', image: 'Doors' }
      ]
    },
    { 
      name: 'Men fashion', 
      icon: 'FaTshirt', 
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-100',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-700',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'New arrivals up to 60% OFF',
      mainSubcategories: [
        {
          title: 'Clothing',
          items: ['Shirts', 'T-Shirts', 'Jeans', 'Formal Wear', 'Jackets', 'Shorts']
        },
        {
          title: 'Footwear',
          items: ['Sneakers', 'Formal Shoes', 'Sandals', 'Sports Shoes', 'Boots']
        },
        {
          title: 'Accessories',
          items: ['Watches', 'Belts', 'Wallets', 'Sunglasses', 'Caps', 'Ties']
        }
      ],
      featuredProducts: [
        { name: 'Formal Shirt', price: '₹2,499', discount: '40% OFF', image: '👔' },
        { name: 'Sneakers', price: '₹3,999', tag: 'Trending', image: '👟' },
        { name: 'Leather Wallet', price: '₹1,299', discount: '25% OFF', image: '👛' }
      ]
    },
    { 
      name: 'Women fashion', 
      icon: 'FaTshirt', 
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-100',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-700',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'Buy 1 Get 1 Free on selected items',
      mainSubcategories: [
        {
          title: 'Clothing',
          items: ['Dresses', 'Tops', 'Jeans', 'Skirts', 'Traditional Wear', 'Jackets']
        },
        {
          title: 'Footwear',
          items: ['Heels', 'Flats', 'Sandals', 'Sneakers', 'Boots', 'Wedges']
        },
        {
          title: 'Accessories',
          items: ['Handbags', 'Jewelry', 'Scarves', 'Sunglasses', 'Watches', 'Belts']
        }
      ],
      featuredProducts: [
        { name: 'Summer Dress', price: '₹3,499', discount: '35% OFF', image: '👗' },
        { name: 'Designer Handbag', price: '₹5,999', tag: 'Luxury', image: '👜' },
        { name: 'Heels', price: '₹2,799', discount: '30% OFF', image: '👠' }
      ]
    },
    { 
      name: 'Wallets', 
      icon: 'FaCreditCard', 
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-100',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'Premium leather wallets starting ₹799',
      mainSubcategories: [
        {
          title: 'Men Wallets',
          items: ['Leather Wallets', 'Card Holders', 'Money Clips', 'Bifold Wallets', 'Travel Wallets']
        },
        {
          title: 'Women Wallets',
          items: ['Clutch Wallets', 'Long Wallets', 'Coin Purses', 'Designer Wallets', 'Mini Wallets']
        },
        {
          title: 'Specialty',
          items: ['RFID Blocking', 'Travel Wallets', 'Business Card Holders', 'Passport Covers']
        }
      ],
      featuredProducts: [
        { name: 'Leather Wallet', price: '₹1,899', discount: '20% OFF', image: '👛' },
        { name: 'RFID Wallet', price: '₹2,499', tag: 'Secure', image: '🛡️' },
        { name: 'Card Holder', price: '₹999', discount: '15% OFF', image: '💳' }
      ]
    },
    { 
      name: 'Fashion jewelry', 
      icon: 'FaCrown', 
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-violet-100',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'Exclusive jewelry collections',
      mainSubcategories: [
        {
          title: 'Necklaces',
          items: ['Gold Plated', 'Silver', 'Pearl', 'Designer', 'Choker', 'Pendants']
        },
        {
          title: 'Earrings',
          items: ['Studs', 'Hoops', 'Danglers', 'Jhumkas', 'Clips', 'Threads']
        },
        {
          title: 'Rings & Bracelets',
          items: ['Engagement Rings', 'Fashion Rings', 'Bangles', 'Bracelets', 'Anklets']
        }
      ],
      featuredProducts: [
        { name: 'Gold Necklace', price: '₹3,499', discount: '25% OFF', image: '📿' },
        { name: 'Diamond Earrings', price: '₹5,999', tag: 'Premium', image: '💎' },
        { name: 'Silver Bracelet', price: '₹1,899', discount: '20% OFF', image: '💍' }
      ]
    },
    { 
      name: 'Pet friendly products', 
      icon: 'FaPaw', 
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-100',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      image: 'https://images.unsplash.com/photo-1558929996-da64ba858215?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'Everything your pet needs',
      mainSubcategories: [
        {
          title: 'Pet Food',
          items: ['Dry Food', 'Wet Food', 'Treats', 'Supplements', 'Puppy Food', 'Senior Food']
        },
        {
          title: 'Accessories',
          items: ['Collars', 'Leashes', 'Beds', 'Toys', 'Bowls', 'Grooming']
        },
        {
          title: 'Health & Care',
          items: ['Shampoos', 'Flea Control', 'Vitamins', 'Dental Care', 'First Aid']
        }
      ],
      featuredProducts: [
        { name: 'Pet Bed', price: '₹2,999', discount: '30% OFF', image: '🛏️' },
        { name: 'Dog Food', price: '₹1,499', tag: 'Healthy', image: '🍖' },
        { name: 'Cat Toy Set', price: '₹899', discount: '25% OFF', image: '🐱' }
      ]
    },
    { 
      name: 'Baby fashion & toys', 
      icon: 'FaBaby', 
      color: 'from-pink-400 to-rose-500',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-100',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-600',
      image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'Quality products for your little ones',
      mainSubcategories: [
        {
          title: 'Baby Clothing',
          items: ['Onesies', 'Rompers', 'Sleepwear', 'Sets', 'Winter Wear', 'Party Wear']
        },
        {
          title: 'Toys & Games',
          items: ['Soft Toys', 'Educational Toys', 'Rattles', 'Teethers', 'Activity Gyms']
        },
        {
          title: 'Nursery',
          items: ['Diapers', 'Feeding', 'Bathing', 'Strollers', 'Car Seats', 'Safety']
        }
      ],
      featuredProducts: [
        { name: 'Baby Romper Set', price: '₹1,299', discount: '40% OFF', image: '👶' },
        { name: 'Educational Toy', price: '₹1,999', tag: 'Learning', image: '🧸' },
        { name: 'Stroller', price: '₹8,999', discount: '20% OFF', image: '🚼' }
      ]
    },
    { 
      name: 'Watches', 
      icon: 'FaClock', 
      color: 'from-slate-600 to-gray-700',
      bgColor: 'bg-gradient-to-br from-slate-50 to-gray-100',
      borderColor: 'border-slate-200',
      textColor: 'text-slate-700',
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'Timeless elegance for every wrist',
      mainSubcategories: [
        {
          title: 'Men Watches',
          items: ['Analog', 'Digital', 'Smart Watches', 'Sports', 'Luxury', 'Casual']
        },
        {
          title: 'Women Watches',
          items: ['Fashion', 'Diamond', 'Leather', 'Gold', 'Rose Gold', 'Slim']
        },
        {
          title: 'Brands',
          items: ['Titan', 'Fastrack', 'Casio', 'Fossil', 'Rolex', 'Apple Watch']
        }
      ],
      featuredProducts: [
        { name: 'Smart Watch', price: '₹9,999', discount: '35% OFF', image: '⌚' },
        { name: 'Luxury Watch', price: '₹24,999', tag: 'Premium', image: '💎' },
        { name: 'Sports Watch', price: '₹4,499', discount: '25% OFF', image: '🏃' }
      ]
    },
    { 
      name: 'Srilankan products', 
      icon: 'FaGlobeAsia', 
      color: 'from-red-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-orange-100',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'Authentic Sri Lankan products',
      mainSubcategories: [
        {
          title: 'Traditional',
          items: ['Handlooms', 'Batik', 'Wood Carvings', 'Masks', 'Brassware', 'Ceramics']
        },
        {
          title: 'Food & Spices',
          items: ['Ceylon Tea', 'Spices', 'Rice', 'Sweets', 'Traditional Snacks']
        },
        {
          title: 'Handicrafts',
          items: ['Jewelry', 'Bags', 'Home Decor', 'Clothing', 'Accessories']
        }
      ],
      featuredProducts: [
        { name: 'Ceylon Tea', price: '₹699', discount: '20% OFF', image: '🍵' },
        { name: 'Batik Dress', price: '₹3,499', tag: 'Traditional', image: '👗' },
        { name: 'Wood Carving', price: '₹2,999', discount: '15% OFF', image: '🗿' }
      ]
    },
    { 
      name: 'Indian products', 
      icon: 'FaGlobeAsia', 
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-amber-100',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      image: 'https://images.unsplash.com/photo-1543060749-aa4b64180d21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'Rich Indian heritage products',
      mainSubcategories: [
        {
          title: 'Textiles',
          items: ['Silk Sarees', 'Cotton Kurtas', 'Handlooms', 'Dress Materials', 'Embroidered']
        },
        {
          title: 'Handicrafts',
          items: ['Pottery', 'Jewelry', 'Paintings', 'Woodwork', 'Metal Crafts']
        },
        {
          title: 'Food & Spices',
          items: ['Masalas', 'Pickles', 'Sweets', 'Tea', 'Rice', 'Snacks']
        }
      ],
      featuredProducts: [
        { name: 'Silk Saree', price: '₹8,999', discount: '30% OFF', image: '👘' },
        { name: 'Spice Set', price: '₹1,499', tag: 'Authentic', image: '🌶️' },
        { name: 'Handicraft', price: '₹2,999', discount: '25% OFF', image: '🏺' }
      ]
    },
    { 
      name: 'Climate dress', 
      icon: 'FaCloudSun', 
      color: 'from-sky-500 to-blue-500',
      bgColor: 'bg-gradient-to-br from-sky-50 to-blue-100',
      borderColor: 'border-sky-200',
      textColor: 'text-sky-700',
      image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'Dress appropriately for every season',
      mainSubcategories: [
        {
          title: 'Summer Wear',
          items: ['Cotton Dresses', 'Shorts', 'T-Shirts', 'Linen Clothes', 'Sun Hats']
        },
        {
          title: 'Winter Wear',
          items: ['Sweaters', 'Jackets', 'Thermals', 'Winter Coats', 'Woolens']
        },
        {
          title: 'Rainy Season',
          items: ['Raincoats', 'Umbrellas', 'Waterproof Shoes', 'Quick Dry', 'Windcheaters']
        }
      ],
      featuredProducts: [
        { name: 'Winter Jacket', price: '₹4,999', discount: '40% OFF', image: '🧥' },
        { name: 'Summer Dress', price: '₹2,499', tag: 'Lightweight', image: '👗' },
        { name: 'Raincoat', price: '₹1,899', discount: '30% OFF', image: '🌧️' }
      ]
    },
    { 
      name: 'Shoes', 
      icon: 'FaShoppingBag', 
      color: 'from-brown-500 to-amber-700',
      bgColor: 'bg-gradient-to-br from-amber-50 to-brown-100',
      borderColor: 'border-amber-200',
      textColor: 'text-brown-700',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'Step in style with premium footwear',
      mainSubcategories: [
        {
          title: 'Men Shoes',
          items: ['Formal Shoes', 'Sneakers', 'Sports Shoes', 'Sandals', 'Boots', 'Casual']
        },
        {
          title: 'Women Shoes',
          items: ['Heels', 'Flats', 'Wedges', 'Sandals', 'Sneakers', 'Boots']
        },
        {
          title: 'Kids Shoes',
          items: ['School Shoes', 'Sports', 'Sandals', 'Casual', 'Party Shoes']
        }
      ],
      featuredProducts: [
        { name: 'Running Shoes', price: '₹3,999', discount: '35% OFF', image: '👟' },
        { name: 'Formal Shoes', price: '₹4,499', tag: 'Premium', image: '👞' },
        { name: 'High Heels', price: '₹2,999', discount: '30% OFF', image: '👠' }
      ]
    },
    { 
      name: 'Electrical tool & hard ware', 
      icon: 'FaTools', 
      color: 'from-gray-600 to-gray-800',
      bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-800',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'Professional tools for every job',
      mainSubcategories: [
        {
          title: 'Power Tools',
          items: ['Drills', 'Saws', 'Grinders', 'Sanders', 'Welders', 'Compressors']
        },
        {
          title: 'Hand Tools',
          items: ['Screwdrivers', 'Wrenches', 'Hammers', 'Pliers', 'Measuring Tools']
        },
        {
          title: 'Hardware',
          items: ['Nails', 'Screws', 'Bolts', 'Hinges', 'Locks', 'Electrical Fittings']
        }
      ],
      featuredProducts: [
        { name: 'Power Drill', price: '₹5,999', discount: '25% OFF', image: '🔧' },
        { name: 'Tool Kit', price: '₹3,499', tag: 'Complete Set', image: '🧰' },
        { name: 'Measuring Tape', price: '₹499', discount: '20% OFF', image: '📏' }
      ]
    },
    { 
      name: 'Electronics products', 
      icon: 'FaLaptop', 
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-blue-100 to-indigo-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'Latest electronics at best prices',
      mainSubcategories: [
        {
          title: 'Home Appliances',
          items: ['TVs', 'Refrigerators', 'Washing Machines', 'ACs', 'Microwaves', 'Fans']
        },
        {
          title: 'Computers',
          items: ['Laptops', 'Desktops', 'Monitors', 'Printers', 'Keyboards', 'Mouse']
        },
        {
          title: 'Audio & Video',
          items: ['Speakers', 'Headphones', 'Home Theater', 'Soundbars', 'Projectors']
        }
      ],
      featuredProducts: [
        { name: 'Smart TV', price: '₹34,999', discount: '20% OFF', image: '📺' },
        { name: 'Laptop', price: '₹54,999', tag: 'Latest', image: '💻' },
        { name: 'Refrigerator', price: '₹28,999', discount: '15% OFF', image: '🧊' }
      ]
    },
    { 
      name: 'T. Shirts', 
      icon: 'FaTshirt', 
      color: 'from-teal-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-teal-50 to-green-100',
      borderColor: 'border-teal-200',
      textColor: 'text-teal-700',
      image: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'Comfort meets style in every tee',
      mainSubcategories: [
        {
          title: 'Men T-Shirts',
          items: ['Plain T-Shirts', 'Printed T-Shirts', 'Polo T-Shirts', 'Oversized', 'V-Neck']
        },
        {
          title: 'Women T-Shirts',
          items: ['Crop Tops', 'Oversized', 'Graphic Tees', 'Basic Tees', 'Sleeveless']
        },
        {
          title: 'Kids T-Shirts',
          items: ['Cartoon Prints', 'School T-Shirts', 'Sports T-Shirts', 'Pack of 3']
        }
      ],
      featuredProducts: [
        { name: 'Premium T-Shirt', price: '₹999', discount: '40% OFF', image: '👕' },
        { name: 'Graphic Tee', price: '₹1,299', tag: 'Trendy', image: '🎨' },
        { name: 'Pack of 3', price: '₹2,499', discount: '35% OFF', image: '👕👕👕' }
      ]
    },
    { 
      name: 'Home kitchen products', 
      icon: 'FaHome', 
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-100',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'Upgrade your kitchen essentials',
      mainSubcategories: [
        {
          title: 'Cookware',
          items: ['Pots & Pans', 'Pressure Cookers', 'Non-Stick', 'Utensils', 'Knives']
        },
        {
          title: 'Appliances',
          items: ['Mixer Grinders', 'Toasters', 'Microwaves', 'Induction Cookers', 'Blenders']
        },
        {
          title: 'Storage',
          items: ['Containers', 'Jars', 'Bottles', 'Lunch Boxes', 'Organizers']
        }
      ],
      featuredProducts: [
        { name: 'Non-Stick Pan Set', price: '₹3,999', discount: '30% OFF', image: '🍳' },
        { name: 'Mixer Grinder', price: '₹4,499', tag: 'Powerful', image: '⚡' },
        { name: 'Food Container Set', price: '₹1,299', discount: '25% OFF', image: '🥡' }
      ]
    },
    { 
      name: 'Photo editing', 
      icon: 'FaImages', 
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-100',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'Professional photo editing services',
      mainSubcategories: [
        {
          title: 'Editing Services',
          items: ['Portrait Editing', 'Product Photos', 'Real Estate', 'Event Photos', 'Restoration']
        },
        {
          title: 'Software',
          items: ['Adobe Photoshop', 'Lightroom Presets', 'Mobile Apps', 'Templates', 'Plugins']
        },
        {
          title: 'Tools & Equipment',
          items: ['Graphics Tablets', 'Monitors', 'Color Calibrators', 'Studio Lighting']
        }
      ],
      featuredProducts: [
        { name: 'Portrait Editing', price: '₹499/photo', discount: '50% OFF', image: '📸' },
        { name: 'Photoshop Presets', price: '₹1,999', tag: 'Professional', image: '🎨' },
        { name: 'Graphics Tablet', price: '₹8,999', discount: '20% OFF', image: '✏️' }
      ]
    },
    { 
      name: 'Print out services', 
      icon: 'FaPrint', 
      color: 'from-gray-500 to-black',
      bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-800',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'High quality printing services',
      mainSubcategories: [
        {
          title: 'Document Printing',
          items: ['Color Printing', 'Black & White', 'Bulk Printing', 'Thesis Binding', 'Reports']
        },
        {
          title: 'Photo Printing',
          items: ['Photo Prints', 'Canvas Prints', 'Photo Books', 'Frames', 'Albums']
        },
        {
          title: 'Commercial Printing',
          items: ['Business Cards', 'Flyers', 'Banners', 'Brochures', 'Stickers']
        }
      ],
      featuredProducts: [
        { name: '100 Page Printing', price: '₹499', discount: '30% OFF', image: '📄' },
        { name: 'Photo Canvas', price: '₹1,999', tag: 'Premium', image: '🖼️' },
        { name: 'Business Cards', price: '₹799', discount: '25% OFF', image: '📇' }
      ]
    },
    { 
      name: 'Beauty & Health', 
      icon: 'FaMagic', 
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-100',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-700',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      promoText: 'Premium beauty and health products',
      mainSubcategories: [
        {
          title: 'Beauty Care',
          items: ['Permanent Makeup', 'False Eyelashes', 'Tattoo Needles', 'Tattoo']
        },
        {
          title: 'Massage & Relax',
          items: ['Massage Comb', 'Fascia Gun', 'Back Massage', 'Eye Massage', 'Massage Roller', 'Massage Cushion']
        },
        {
          title: 'Dental & Body',
          items: ['Dental Handpiece', 'Body Shaping', 'Scrubs Treatments', 'Dental Curing', 'Dental Basic', 'Dental Consumables', 'Dental Teaching']
        }
      ],
      featuredProducts: [
        { name: 'Fascia Gun', price: '₹8,999', discount: '30% OFF', image: '🔫' },
        { name: 'Massage Roller', price: '₹1,499', tag: 'Top Rated', image: '💆' },
        { name: 'Dental Kit', price: '₹12,999', discount: '15% OFF', image: '🦷' }
      ]
    }
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing categories to start fresh with new structure
        await Category.deleteMany({}); 
        console.log('Existing categories cleared');

        for (const catData of categoriesData) {
            // Flat subcategories for backwards compatibility or search
            const flatSubCats = catData.mainSubcategories.flatMap(group => group.items).map(name => ({ name }));
            
            await Category.create({
                name: catData.name,
                icon: catData.icon,
                color: catData.color,
                bgColor: catData.bgColor,
                borderColor: catData.borderColor,
                textColor: catData.textColor,
                image: catData.image,
                promoText: catData.promoText,
                mainSubcategories: catData.mainSubcategories,
                featuredProducts: catData.featuredProducts,
                subCategories: flatSubCats
            });
            console.log(`Added: ${catData.name}`);
        }

        console.log('Category seeding completed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
