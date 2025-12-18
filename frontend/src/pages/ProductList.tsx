import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

import { 
  FaTshirt, FaCrown, 
  FaLaptop, FaHome, FaFire,
  FaChevronRight, FaStar,
  FaTag, FaCheck, FaHeart,
  FaMobileAlt, FaCamera, FaShoePrints,
  FaPaw, FaChild, FaClock,
  FaCloudSun, FaTools,
  FaPrint, FaCartPlus, FaPalette, FaRuler,
  FaChevronRight as FaChevronRightIcon,
  FaSprayCan, FaHandSparkles, FaMagic,
  FaTooth, FaSyringe, FaWeight, FaEye, FaBed,
  FaFilter, FaSortAmountDown,
  FaGlobeAsia, FaCreditCard, FaImages
} from 'react-icons/fa';

// Subcategory image mapping
const subcategoryImages: Record<string, string> = {
  // Mobile accessories subcategories
  'phone-cases': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'screen-protectors': 'https://images.unsplash.com/photo-1588514912908-8f5891714f8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'chargers': 'https://images.unsplash.com/photo-1594736797933-d0c6e4d6d6c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'earphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'power-banks': 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'cases-covers': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'smart-watches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'bluetooth-earphones': 'https://images.unsplash.com/photo-1590658165737-15a047b8b5e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',

  // Security cameras subcategories
  'wifi-cameras': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'outdoor-cameras': 'https://images.unsplash.com/photo-1588018682850-8dd56c2ec5f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'cctv-systems': 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'doorbell-cameras': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'baby-monitors': 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'nvr-kits': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',

  // Men fashion subcategories
  'shirts': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  't-shirts': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'formal-wear': 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'jackets': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'sneakers': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'accessories': 'https://images.unsplash.com/photo-1590649887895-7d0c86e5d9c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',

  // Women fashion subcategories
  'dresses': 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'tops': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'skirts': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'jeans-women': 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'traditional-wear': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'handbags': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'jewelry': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',

  // Beauty & Health subcategories (from your image)
  'permanent-makeup': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'false-eyelashes': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'massage-comb': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'fascia-gun': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'dental-handpiece': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'back-massage': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'body-shaping': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'eye-massage': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'scrubs-treatments': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'tattoo-needles': 'https://images.unsplash.com/photo-1568640348855-5c007571c1c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'dental-curing': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'dental-basic': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'massage-roller': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'dental-consumables': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'dental-teaching': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'massage-cushion': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'tattoo': 'https://images.unsplash.com/photo-1568640348855-5c007571c1c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',

  // Default fallback images for other subcategories
  'default-electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'default-fashion': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'default-home': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'default-beauty': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
};

// Helper function to get subcategory image
const getSubcategoryImage = (subcategoryId: string): string => {
  return subcategoryImages[subcategoryId] || 
         subcategoryImages['default-electronics']; // Fallback image
};

// Mock product data for each subcategory
const subcategoryProducts: Record<string, any[]> = {
  // Mobile accessories products
  'phone-cases': Array.from({ length: 18 }, (_, i) => ({
    id: `phone-case-${i}`,
    name: `Premium Phone Case ${i + 1} - ${['iPhone 15', 'Samsung S24', 'Google Pixel', 'OnePlus'][i % 4]}`,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    badge: i % 3 === 0 ? 'New' : i % 3 === 1 ? 'Sale' : 'Bestseller',
    badgeIcon: i % 3 === 0 ? <FaFire /> : i % 3 === 1 ? <FaFire /> : <FaStar />,
    discountPercent: [75, 74, 88, 31, 67, 84, 50, 60, 45, 55, 40, 35, 70, 65, 25, 80, 30, 42][i],
    currentPrice: `LKR${[861.88, 519.21, 342.67, 6242.32, 1000.33, 342.67, 1499, 2299, 1799, 3499, 899, 299, 499, 399, 199, 1599, 1299, 4499][i].toFixed(2)}`,
    originalPrice: `LKR${[2311.08, 1976.44, 2835.35, 9000.33, 3000.33, 2100.98, 2999, 4599, 2999, 6999, 1499, 599, 999, 799, 399, 3199, 2599, 8999][i].toFixed(2)}`,
    saveAmount: `LKR${[1448.20, 1457.23, 2492.68, 2758.01, 2000.00, 1758.31, 1500, 2300, 1200, 3500, 600, 300, 500, 400, 200, 1600, 1300, 4500][i].toFixed(2)}`,
    rating: [4.6, 3.0, 4.1, 4.3, 3.6, 4.6, 4.8, 4.5, 4.2, 4.7, 4.0, 4.9, 3.8, 4.4, 4.1, 4.6, 4.3, 4.9][i],
    sold: [800, 261, 2000, 5000, 50000, 800, 1200, 890, 560, 340, 780, 450, 920, 670, 340, 1200, 890, 560][i],
    colorOptions: true,
    sizeOptions: i % 2 === 0,
    bundleDeal: i % 4 === 0 ? 'LKR692.27 off on LKR5,199' : null,
    promotions: [
      { icon: <FaTag />, text: 'Free shipping available' },
      { icon: <FaCheck />, text: 'Shockproof & Anti-scratch' }
    ]
  })),
  
  'chargers': Array.from({ length: 18 }, (_, i) => ({
    id: `charger-${i}`,
    name: `Fast Charger ${i + 1} - ${['65W USB-C', '30W PD', 'Wireless', 'Car Charger'][i % 4]}`,
    image: 'https://images.unsplash.com/photo-1594736797933-d0c6e4d6d6c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    badge: i % 3 === 0 ? 'New' : i % 3 === 1 ? 'Sale' : 'Bestseller',
    badgeIcon: i % 3 === 0 ? <FaFire /> : i % 3 === 1 ? <FaFire /> : <FaStar />,
    discountPercent: [70, 65, 80, 45, 60, 75, 50, 55, 40, 35, 30, 25, 65, 70, 45, 80, 35, 50][i],
    currentPrice: `LKR${[1299.99, 899.50, 1999.00, 1499.99, 799.00, 2499.00, 1599.99, 699.50, 1899.00, 1199.99, 849.00, 1699.00, 999.50, 2199.00, 749.99, 2799.00, 1399.99, 899.00][i].toFixed(2)}`,
    originalPrice: `LKR${[2999.00, 1999.00, 3999.00, 2999.00, 1599.00, 4999.00, 3199.00, 1499.00, 3799.00, 2399.00, 1699.00, 3399.00, 1999.00, 4399.00, 1499.00, 5599.00, 2799.00, 1799.00][i].toFixed(2)}`,
    saveAmount: `LKR${[1700.01, 1099.50, 2000.00, 1499.01, 800.00, 2500.00, 1599.01, 799.50, 1900.00, 1199.01, 850.00, 1700.00, 999.50, 2200.00, 749.01, 2800.00, 1399.01, 900.00][i].toFixed(2)}`,
    rating: [4.8, 4.5, 4.9, 4.3, 4.2, 4.7, 4.4, 4.1, 4.6, 4.0, 4.3, 4.8, 4.5, 4.9, 4.2, 4.7, 4.4, 4.6][i],
    sold: [1200, 890, 560, 340, 780, 450, 920, 670, 340, 1200, 890, 560, 340, 780, 450, 920, 670, 340][i],
    colorOptions: true,
    sizeOptions: false,
    bundleDeal: i % 3 === 0 ? 'Buy 2 get 15% off' : null,
    promotions: [
      { icon: <FaTag />, text: 'Fast charging certified' },
      { icon: <FaCheck />, text: 'Overheat protection' }
    ]
  })),
  
  'earphones': Array.from({ length: 18 }, (_, i) => ({
    id: `earphone-${i}`,
    name: `Wireless Earphones ${i + 1} - ${['Noise Cancelling', 'Sports', 'Budget', 'Premium'][i % 4]}`,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    badge: i % 3 === 0 ? 'New' : i % 3 === 1 ? 'Sale' : 'Bestseller',
    badgeIcon: i % 3 === 0 ? <FaFire /> : i % 3 === 1 ? <FaFire /> : <FaStar />,
    discountPercent: [65, 70, 80, 45, 60, 75, 50, 55, 40, 35, 30, 25, 65, 70, 45, 80, 35, 50][i],
    currentPrice: `LKR${[2499.99, 1799.50, 3999.00, 2999.99, 1599.00, 4999.00, 3199.99, 1399.50, 3799.00, 2399.99, 1699.00, 3399.00, 1999.50, 4499.00, 1499.99, 5999.00, 2799.99, 1899.00][i].toFixed(2)}`,
    originalPrice: `LKR${[5999.00, 3999.00, 7999.00, 5999.00, 3199.00, 9999.00, 6399.00, 2999.00, 7599.00, 4799.00, 3399.00, 6799.00, 3999.00, 8999.00, 2999.00, 11999.00, 5599.00, 3799.00][i].toFixed(2)}`,
    saveAmount: `LKR${[3500.01, 2199.50, 4000.00, 2999.01, 1600.00, 5000.00, 3199.01, 1599.50, 3800.00, 2399.01, 1700.00, 3400.00, 1999.50, 4500.00, 1499.01, 6000.00, 2799.01, 1900.00][i].toFixed(2)}`,
    rating: [4.7, 4.4, 4.9, 4.2, 4.3, 4.8, 4.5, 4.1, 4.6, 4.0, 4.3, 4.7, 4.4, 4.9, 4.2, 4.8, 4.5, 4.6][i],
    sold: [1500, 920, 670, 340, 1200, 890, 560, 340, 780, 450, 920, 670, 340, 1200, 890, 560, 340, 780][i],
    colorOptions: true,
    sizeOptions: false,
    bundleDeal: i % 4 === 0 ? 'Free carrying case included' : null,
    promotions: [
      { icon: <FaTag />, text: 'Battery life 24h+' },
      { icon: <FaCheck />, text: 'Bluetooth 5.3' }
    ]
  })),
  
  // Default/featured products (when no subcategory selected)
  'featured': Array.from({ length: 18 }, (_, index) => ({
    id: `product-${index}`,
    name: `Featured Product ${index + 1}`,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    badge: index % 3 === 0 ? 'New' : index % 3 === 1 ? 'Sale' : 'Bestseller',
    badgeIcon: index % 3 === 0 ? <FaFire /> : index % 3 === 1 ? <FaFire /> : <FaStar />,
    discountPercent: [75, 74, 88, 31, 67, 84, 50, 60, 45, 55, 40, 35, 70, 65, 25, 80, 30, 42][index],
    currentPrice: `LKR${[861.88, 519.21, 342.67, 6242.32, 1000.33, 342.67, 1499, 2299, 1799, 3499, 899, 299, 499, 399, 199, 1599, 1299, 4499][index].toFixed(2)}`,
    originalPrice: `LKR${[2311.08, 1976.44, 2835.35, 9000.33, 3000.33, 2100.98, 2999, 4599, 2999, 6999, 1499, 599, 999, 799, 399, 3199, 2599, 8999][index].toFixed(2)}`,
    saveAmount: `LKR${[1448.20, 1457.23, 2492.68, 2758.01, 2000.00, 1758.31, 1500, 2300, 1200, 3500, 600, 300, 500, 400, 200, 1600, 1300, 4500][index].toFixed(2)}`,
    rating: [4.6, 3.0, 4.1, 4.3, 3.6, 4.6, 4.8, 4.5, 4.2, 4.7, 4.0, 4.9, 3.8, 4.4, 4.1, 4.6, 4.3, 4.9][index],
    sold: [800, 261, 2000, 5000, 50000, 800, 1200, 890, 560, 340, 780, 450, 920, 670, 340, 1200, 890, 560][index],
    colorOptions: true,
    sizeOptions: index % 2 === 0,
    bundleDeal: index % 4 === 0 ? 'LKR692.27 off on LKR5,199' : null,
    promotions: [
      { icon: <FaTag />, text: 'Free shipping available' },
      { icon: <FaCheck />, text: 'Choice quality' }
    ]
  }))
};

// Related products data
const relatedProducts = Array.from({ length: 12 }, (_, i) => ({
  id: `related-${i}`,
  name: `Related Product ${i + 1}`,
  image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  badge: i % 3 === 0 ? 'New' : i % 3 === 1 ? 'Sale' : 'Bestseller',
  badgeIcon: i % 3 === 0 ? <FaFire /> : i % 3 === 1 ? <FaFire /> : <FaStar />,
  discountPercent: [55, 60, 70, 35, 50, 65, 40, 45, 30, 25, 20, 15][i],
  currentPrice: `LKR${[1999.99, 1499.50, 2999.00, 2499.99, 1299.00, 3999.00, 2599.99, 1199.50, 3499.00, 2199.99, 1599.00, 3199.00][i].toFixed(2)}`,
  originalPrice: `LKR${[3999.00, 2999.00, 5999.00, 4999.00, 2599.00, 7999.00, 5199.00, 2399.00, 6999.00, 4399.00, 3199.00, 6399.00][i].toFixed(2)}`,
  rating: [4.5, 4.2, 4.8, 4.1, 4.3, 4.7, 4.4, 4.0, 4.6, 3.9, 4.2, 4.7][i],
  sold: [450, 320, 890, 560, 340, 1200, 890, 560, 340, 780, 450, 920][i],
  colorOptions: true,
  sizeOptions: i % 2 === 0,
}));

// Import categories from your Header component structure
// Updated categories based on your Header
const mainCategories = [
  { 
    id: 'mobile-accessories', 
    name: 'Mobile accessories', 
    icon: <FaMobileAlt />,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'blue',
    items: '245 Items',
    subcategories: [
      { id: 'phone-cases', name: 'Phone Cases', icon: <FaMobileAlt />, image: getSubcategoryImage('phone-cases') },
      { id: 'screen-protectors', name: 'Screen Protectors', icon: <FaMobileAlt />, image: getSubcategoryImage('screen-protectors') },
      { id: 'chargers', name: 'Chargers', icon: <FaMobileAlt />, image: getSubcategoryImage('chargers') },
      { id: 'earphones', name: 'Earphones', icon: <FaMobileAlt />, image: getSubcategoryImage('earphones') },
      { id: 'power-banks', name: 'Power Banks', icon: <FaMobileAlt />, image: getSubcategoryImage('power-banks') },
      { id: 'cases-covers', name: 'Cases & Covers', icon: <FaMobileAlt />, image: getSubcategoryImage('cases-covers') },
      { id: 'smart-watches', name: 'Smart Watches', icon: <FaMobileAlt />, image: getSubcategoryImage('smart-watches') },
      { id: 'bluetooth-earphones', name: 'Bluetooth Earphones', icon: <FaMobileAlt />, image: getSubcategoryImage('bluetooth-earphones') }
    ]
  },
  { 
    id: 'security-cameras', 
    name: 'Security cameras', 
    icon: <FaCamera />,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'gray',
    items: '98 Items',
    subcategories: [
      { id: 'wifi-cameras', name: 'WiFi Cameras', icon: <FaCamera />, image: getSubcategoryImage('wifi-cameras') },
      { id: 'outdoor-cameras', name: 'Outdoor Cameras', icon: <FaCamera />, image: getSubcategoryImage('outdoor-cameras') },
      { id: 'cctv-systems', name: 'CCTV Systems', icon: <FaCamera />, image: getSubcategoryImage('cctv-systems') },
      { id: 'doorbell-cameras', name: 'Doorbell Cameras', icon: <FaCamera />, image: getSubcategoryImage('doorbell-cameras') },
      { id: 'baby-monitors', name: 'Baby Monitors', icon: <FaCamera />, image: getSubcategoryImage('baby-monitors') },
      { id: 'nvr-kits', name: 'NVR Kits', icon: <FaCamera />, image: getSubcategoryImage('nvr-kits') }
    ]
  },
  { 
    id: 'men-fashion', 
    name: 'Men fashion', 
    icon: <FaTshirt />,
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'blue',
    items: '567 Items',
    subcategories: [
      { id: 'shirts', name: 'Shirts', icon: <FaTshirt />, image: getSubcategoryImage('shirts') },
      { id: 't-shirts', name: 'T-Shirts', icon: <FaTshirt />, image: getSubcategoryImage('t-shirts') },
      { id: 'jeans', name: 'Jeans', icon: <FaTshirt />, image: getSubcategoryImage('jeans') },
      { id: 'formal-wear', name: 'Formal Wear', icon: <FaTshirt />, image: getSubcategoryImage('formal-wear') },
      { id: 'jackets', name: 'Jackets', icon: <FaTshirt />, image: getSubcategoryImage('jackets') },
      { id: 'sneakers', name: 'Sneakers', icon: <FaShoePrints />, image: getSubcategoryImage('sneakers') },
      { id: 'accessories', name: 'Accessories', icon: <FaTshirt />, image: getSubcategoryImage('accessories') }
    ]
  },
  { 
    id: 'women-fashion', 
    name: 'Women fashion', 
    icon: <FaCrown />,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'pink',
    items: '789 Items',
    subcategories: [
      { id: 'dresses', name: 'Dresses', icon: <FaCrown />, image: getSubcategoryImage('dresses') },
      { id: 'tops', name: 'Tops', icon: <FaCrown />, image: getSubcategoryImage('tops') },
      { id: 'skirts', name: 'Skirts', icon: <FaCrown />, image: getSubcategoryImage('skirts') },
      { id: 'jeans-women', name: 'Jeans', icon: <FaCrown />, image: getSubcategoryImage('jeans-women') },
      { id: 'traditional-wear', name: 'Traditional Wear', icon: <FaCrown />, image: getSubcategoryImage('traditional-wear') },
      { id: 'handbags', name: 'Handbags', icon: <FaCrown />, image: getSubcategoryImage('handbags') },
      { id: 'jewelry', name: 'Jewelry', icon: <FaCrown />, image: getSubcategoryImage('jewelry') }
    ]
  },
  { 
    id: 'wallets', 
    name: 'Wallets', 
    icon: <FaCreditCard />,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'brown',
    items: '123 Items',
    subcategories: [
      { id: 'leather-wallets', name: 'Leather Wallets', icon: <FaCreditCard />, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'card-holders', name: 'Card Holders', icon: <FaCreditCard />, image: 'https://images.unsplash.com/photo-1550253001-4a5b8b8b8b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'money-clips', name: 'Money Clips', icon: <FaCreditCard />, image: 'https://images.unsplash.com/photo-1550253001-4a5b8b8b8b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'bifold-wallets', name: 'Bifold Wallets', icon: <FaCreditCard />, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'rfid-wallets', name: 'RFID Blocking', icon: <FaCreditCard />, image: 'https://images.unsplash.com/photo-1550253001-4a5b8b8b8b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
    ]
  },
  { 
    id: 'fashion-jewelry', 
    name: 'Fashion jewelry', 
    icon: <FaCrown />,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'purple',
    items: '345 Items',
    subcategories: [
      { id: 'necklaces', name: 'Necklaces', icon: <FaCrown />, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'earrings', name: 'Earrings', icon: <FaCrown />, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'rings', name: 'Rings', icon: <FaCrown />, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'bracelets', name: 'Bracelets', icon: <FaCrown />, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'pendants', name: 'Pendants', icon: <FaCrown />, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'jhumkas', name: 'Jhumkas', icon: <FaCrown />, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
    ]
  },
  { 
    id: 'pet-friendly-products', 
    name: 'Pet friendly products', 
    icon: <FaPaw />,
    image: 'https://images.unsplash.com/photo-1558929996-da64ba858215?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'green',
    items: '156 Items',
    subcategories: [
      { id: 'pet-food', name: 'Pet Food', icon: <FaPaw />, image: 'https://images.unsplash.com/photo-1558929996-da64ba858215?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'collars-leashes', name: 'Collars & Leashes', icon: <FaPaw />, image: 'https://images.unsplash.com/photo-1558929996-da64ba858215?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'pet-beds', name: 'Pet Beds', icon: <FaPaw />, image: 'https://images.unsplash.com/photo-1558929996-da64ba858215?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'pet-toys', name: 'Toys', icon: <FaPaw />, image: 'https://images.unsplash.com/photo-1558929996-da64ba858215?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'grooming', name: 'Grooming', icon: <FaPaw />, image: 'https://images.unsplash.com/photo-1558929996-da64ba858215?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'health-care', name: 'Health & Care', icon: <FaPaw />, image: 'https://images.unsplash.com/photo-1558929996-da64ba858215?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
    ]
  },
  { 
    id: 'baby-fashion-toys', 
    name: 'Baby fashion & toys', 
    icon: <FaChild />,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'pink',
    items: '234 Items',
    subcategories: [
      { id: 'baby-clothing', name: 'Baby Clothing', icon: <FaChild />, image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'onesies', name: 'Onesies', icon: <FaChild />, image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'toys-games', name: 'Toys & Games', icon: <FaChild />, image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'soft-toys', name: 'Soft Toys', icon: <FaChild />, image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'educational-toys', name: 'Educational Toys', icon: <FaChild />, image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'nursery', name: 'Nursery', icon: <FaChild />, image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
    ]
  },
  { 
    id: 'watches', 
    name: 'Watches', 
    icon: <FaClock />,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'gray',
    items: '189 Items',
    subcategories: [
      { id: 'men-watches', name: 'Men Watches', icon: <FaClock />, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'women-watches', name: 'Women Watches', icon: <FaClock />, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'smart-watches', name: 'Smart Watches', icon: <FaClock />, image: getSubcategoryImage('smart-watches') },
      { id: 'sports-watches', name: 'Sports Watches', icon: <FaClock />, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'luxury-watches', name: 'Luxury Watches', icon: <FaClock />, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'analog-watches', name: 'Analog', icon: <FaClock />, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
    ]
  },
  { 
    id: 'srilankan-products', 
    name: 'Srilankan products', 
    icon: <FaGlobeAsia />,
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'red',
    items: '278 Items',
    subcategories: [
      { id: 'handlooms', name: 'Handlooms', icon: <FaGlobeAsia />, image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'batik', name: 'Batik', icon: <FaGlobeAsia />, image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'ceylon-tea', name: 'Ceylon Tea', icon: <FaGlobeAsia />, image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'spices', name: 'Spices', icon: <FaGlobeAsia />, image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'wood-carvings', name: 'Wood Carvings', icon: <FaGlobeAsia />, image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'handicrafts', name: 'Handicrafts', icon: <FaGlobeAsia />, image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
    ]
  },
  { 
    id: 'indian-products', 
    name: 'Indian products', 
    icon: <FaGlobeAsia />,
    image: 'https://images.unsplash.com/photo-1543060749-aa4b64180d21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'orange',
    items: '456 Items',
    subcategories: [
      { id: 'silk-sarees', name: 'Silk Sarees', icon: <FaGlobeAsia />, image: 'https://images.unsplash.com/photo-1543060749-aa4b64180d21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'cotton-kurtas', name: 'Cotton Kurtas', icon: <FaGlobeAsia />, image: 'https://images.unsplash.com/photo-1543060749-aa4b64180d21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'masalas', name: 'Masalas', icon: <FaGlobeAsia />, image: 'https://images.unsplash.com/photo-1543060749-aa4b64180d21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'handicrafts-indian', name: 'Handicrafts', icon: <FaGlobeAsia />, image: 'https://images.unsplash.com/photo-1543060749-aa4b64180d21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'jewelry-indian', name: 'Jewelry', icon: <FaGlobeAsia />, image: getSubcategoryImage('jewelry') },
      { id: 'paintings', name: 'Paintings', icon: <FaGlobeAsia />, image: 'https://images.unsplash.com/photo-1543060749-aa4b64180d21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
    ]
  },
  { 
    id: 'climate-dress', 
    name: 'Climate dress', 
    icon: <FaCloudSun />,
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'cyan',
    items: '167 Items',
    subcategories: [
      { id: 'summer-wear', name: 'Summer Wear', icon: <FaCloudSun />, image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'winter-wear', name: 'Winter Wear', icon: <FaCloudSun />, image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'rainy-season', name: 'Rainy Season', icon: <FaCloudSun />, image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'cotton-dresses', name: 'Cotton Dresses', icon: <FaCloudSun />, image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'sweaters', name: 'Sweaters', icon: <FaCloudSun />, image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'raincoats', name: 'Raincoats', icon: <FaCloudSun />, image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
    ]
  },
  { 
    id: 'shoes', 
    name: 'Shoes', 
    icon: <FaShoePrints />,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'brown',
    items: '345 Items',
    subcategories: [
      { id: 'men-shoes', name: 'Men Shoes', icon: <FaShoePrints />, image: getSubcategoryImage('sneakers') },
      { id: 'women-shoes', name: 'Women Shoes', icon: <FaShoePrints />, image: getSubcategoryImage('sneakers') },
      { id: 'kids-shoes', name: 'Kids Shoes', icon: <FaShoePrints />, image: getSubcategoryImage('sneakers') },
      { id: 'formal-shoes', name: 'Formal Shoes', icon: <FaShoePrints />, image: getSubcategoryImage('sneakers') },
      { id: 'sneakers-shoes', name: 'Sneakers', icon: <FaShoePrints />, image: getSubcategoryImage('sneakers') },
      { id: 'sports-shoes', name: 'Sports Shoes', icon: <FaShoePrints />, image: getSubcategoryImage('sneakers') }
    ]
  },
  { 
    id: 'electrical-tool-hardware', 
    name: 'Electrical tool & hardware', 
    icon: <FaTools />,
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'gray',
    items: '456 Items',
    subcategories: [
      { id: 'power-tools', name: 'Power Tools', icon: <FaTools />, image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'hand-tools', name: 'Hand Tools', icon: <FaTools />, image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'hardware', name: 'Hardware', icon: <FaTools />, image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'drills', name: 'Drills', icon: <FaTools />, image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'saws', name: 'Saws', icon: <FaTools />, image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'measuring-tools', name: 'Measuring Tools', icon: <FaTools />, image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
    ]
  },
  { 
    id: 'electronics-products', 
    name: 'Electronics products', 
    icon: <FaLaptop />,
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'blue',
    items: '1,234 Items',
    subcategories: [
      { id: 'home-appliances', name: 'Home Appliances', icon: <FaLaptop />, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'computers', name: 'Computers', icon: <FaLaptop />, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'audio-video', name: 'Audio & Video', icon: <FaLaptop />, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'smart-tvs', name: 'Smart TVs', icon: <FaLaptop />, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'laptops', name: 'Laptops', icon: <FaLaptop />, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'refrigerators', name: 'Refrigerators', icon: <FaLaptop />, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
    ]
  },
  { 
    id: 't-shirts', 
    name: 'T. Shirts', 
    icon: <FaTshirt />,
    image: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'teal',
    items: '789 Items',
    subcategories: [
      { id: 'men-t-shirts', name: 'Men T-Shirts', icon: <FaTshirt />, image: getSubcategoryImage('t-shirts') },
      { id: 'women-t-shirts', name: 'Women T-Shirts', icon: <FaTshirt />, image: getSubcategoryImage('t-shirts') },
      { id: 'kids-t-shirts', name: 'Kids T-Shirts', icon: <FaTshirt />, image: getSubcategoryImage('t-shirts') },
      { id: 'printed-t-shirts', name: 'Printed T-Shirts', icon: <FaTshirt />, image: getSubcategoryImage('t-shirts') },
      { id: 'polo-t-shirts', name: 'Polo T-Shirts', icon: <FaTshirt />, image: getSubcategoryImage('t-shirts') },
      { id: 'graphic-tees', name: 'Graphic Tees', icon: <FaTshirt />, image: getSubcategoryImage('t-shirts') }
    ]
  },
  { 
    id: 'home-kitchen-products', 
    name: 'Home kitchen products', 
    icon: <FaHome />,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'orange',
    items: '567 Items',
    subcategories: [
      { id: 'cookware', name: 'Cookware', icon: <FaHome />, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'appliances', name: 'Appliances', icon: <FaHome />, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'storage', name: 'Storage', icon: <FaHome />, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'pots-pans', name: 'Pots & Pans', icon: <FaHome />, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'mixer-grinders', name: 'Mixer Grinders', icon: <FaHome />, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'containers', name: 'Containers', icon: <FaHome />, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
    ]
  },
  { 
    id: 'photo-editing', 
    name: 'Photo editing', 
    icon: <FaImages />,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'purple',
    items: '89 Items',
    subcategories: [
      { id: 'editing-services', name: 'Editing Services', icon: <FaImages />, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'software', name: 'Software', icon: <FaImages />, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'tools-equipment', name: 'Tools & Equipment', icon: <FaImages />, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'portrait-editing', name: 'Portrait Editing', icon: <FaImages />, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'product-photos', name: 'Product Photos', icon: <FaImages />, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'graphics-tablets', name: 'Graphics Tablets', icon: <FaImages />, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
    ]
  },
  { 
    id: 'print-out-services', 
    name: 'Print out services', 
    icon: <FaPrint />,
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'gray',
    items: '45 Items',
    subcategories: [
      { id: 'document-printing', name: 'Document Printing', icon: <FaPrint />, image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'photo-printing', name: 'Photo Printing', icon: <FaPrint />, image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'commercial-printing', name: 'Commercial Printing', icon: <FaPrint />, image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'color-printing', name: 'Color Printing', icon: <FaPrint />, image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'business-cards', name: 'Business Cards', icon: <FaPrint />, image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: 'canvas-prints', name: 'Canvas Prints', icon: <FaPrint />, image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
    ]
  },
  { 
    id: 'beauty-health', 
    name: 'Beauty & Health', 
    icon: <FaMagic />,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'pink',
    items: '324 Items',
    subcategories: [
      { id: 'permanent-makeup', name: 'Permanent Makeup', icon: <FaSprayCan />, image: getSubcategoryImage('permanent-makeup') },
      { id: 'false-eyelashes', name: 'False Eyelashes', icon: <FaEye />, image: getSubcategoryImage('false-eyelashes') },
      { id: 'massage-comb', name: 'Massage Comb', icon: <FaHandSparkles />, image: getSubcategoryImage('massage-comb') },
      { id: 'fascia-gun', name: 'Fascia Gun', icon: <FaWeight />, image: getSubcategoryImage('fascia-gun') },
      { id: 'dental-handpiece', name: 'Dental Handpiece', icon: <FaTooth />, image: getSubcategoryImage('dental-handpiece') },
      { id: 'back-massage', name: 'Back Massage', icon: <FaBed />, image: getSubcategoryImage('back-massage') },
      { id: 'body-shaping', name: 'Body Shaping', icon: <FaWeight />, image: getSubcategoryImage('body-shaping') },
      { id: 'eye-massage', name: 'Eye Massage', icon: <FaEye />, image: getSubcategoryImage('eye-massage') },
      { id: 'scrubs-treatments', name: 'Scrubs Treatments', icon: <FaHandSparkles />, image: getSubcategoryImage('scrubs-treatments') },
      { id: 'tattoo-needles', name: 'Tattoo Needles', icon: <FaSyringe />, image: getSubcategoryImage('tattoo-needles') },
      { id: 'dental-curing', name: 'Dental Curing', icon: <FaTooth />, image: getSubcategoryImage('dental-curing') },
      { id: 'dental-basic', name: 'Dental Basic', icon: <FaTooth />, image: getSubcategoryImage('dental-basic') },
      { id: 'massage-roller', name: 'Massage Roller', icon: <FaHandSparkles />, image: getSubcategoryImage('massage-roller') },
      { id: 'dental-consumables', name: 'Dental Consumables', icon: <FaTooth />, image: getSubcategoryImage('dental-consumables') },
      { id: 'dental-teaching', name: 'Dental Teaching', icon: <FaTooth />, image: getSubcategoryImage('dental-teaching') },
      { id: 'massage-cushion', name: 'Massage Cushion', icon: <FaBed />, image: getSubcategoryImage('massage-cushion') },
      { id: 'tattoo', name: 'Tattoo', icon: <FaSyringe />, image: getSubcategoryImage('tattoo') }
    ]
  }
];

// Product Grid Section
const ProductGridSection = ({ filteredProducts, addToCart, openProductModal, title = "Featured Products", description = "Discover our handpicked selection" }: any) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="mb-12">
      {/* Products Grid Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
            <FaFilter /> Filter
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
            <FaSortAmountDown /> Sort
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 mb-8 sm:mb-12">
        {filteredProducts.map((product: any) => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group relative"
          >
            {/* Quick Add Icon */}
            <button 
              onClick={() => addToCart(product)}
              className="absolute top-2 sm:top-3 right-2 sm:right-3 z-20 bg-white/90 hover:bg-white rounded-full p-1.5 sm:p-2 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-110"
              title="Add to cart"
            >
              <FaCartPlus className="text-amber-600 text-base sm:text-lg" />
            </button>

            {/* Product Image */}
            <div 
              className="relative h-32 sm:h-40 overflow-hidden bg-gray-100 cursor-pointer"
              onClick={() => openProductModal(product)}
            >
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Brand Badge */}
              {product.badge && (
                <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2">
                  <div className="bg-amber-600 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg flex items-center gap-0.5 sm:gap-1">
                    {product.badgeIcon}
                    <span className="text-xs">{product.badge}</span>
                  </div>
                </div>
              )}

              {/* Discount Badge */}
              {product.discountPercent && (
                <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 mt-6 sm:mt-8">
                  <div className="bg-red-500 text-white text-xs font-bold px-1 sm:px-1.5 py-0.5 rounded">
                    -{product.discountPercent}%
                  </div>
                </div>
              )}

              {/* Wishlist Button */}
              <button 
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-110"
                title="Add to wishlist"
              >
                <FaHeart className={`text-sm sm:text-base ${wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-2 sm:p-3">
              {/* Product Name */}
              <h3 
                className="font-semibold text-gray-900 line-clamp-2 mb-1.5 sm:mb-2 text-xs sm:text-sm h-8 sm:h-10 cursor-pointer hover:text-amber-700"
                onClick={() => openProductModal(product)}
              >
                {product.name}
              </h3>

              {/* Color and Size Options */}
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                {product.colorOptions && (
                  <div className="flex items-center gap-0.5">
                    <FaPalette className="text-xs text-gray-500" />
                    <span className="text-xs text-gray-600">Color</span>
                  </div>
                )}
                {product.sizeOptions && (
                  <div className="flex items-center gap-0.5">
                    <FaRuler className="text-xs text-gray-500" />
                    <span className="text-xs text-gray-600">Size</span>
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className="mb-1.5 sm:mb-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm sm:text-base font-bold text-gray-900">
                    {product.currentPrice}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs sm:text-sm text-gray-500 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                </div>
                {product.saveAmount && (
                  <div className="text-xs text-green-600 font-semibold">
                    Save {product.saveAmount}
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i}
                      className={`text-xs ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  {product.rating} | {product.sold.toLocaleString()}+
                </span>
              </div>

              {/* Bundle Deals */}
              {product.bundleDeal && (
                <div className="mb-2 sm:mb-3 p-2 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-700 font-medium mb-1">
                    Bundle deals available
                  </div>
                  <div className="text-xs text-gray-600">
                    {product.bundleDeal}
                  </div>
                </div>
              )}

              {/* Promotions */}
              {product.promotions && product.promotions.length > 0 && (
                <div className="mb-2 sm:mb-3 space-y-1">
                  {product.promotions.map((promo: any, index: number) => (
                    <div key={index} className="flex items-center gap-1">
                      <div className="flex-shrink-0">
                        {promo.icon}
                      </div>
                      <span className="text-xs text-gray-700 flex-1 line-clamp-1">
                        {promo.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Bundle Deals Button */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <button 
                  className="text-amber-700 hover:text-amber-800 font-medium text-xs flex items-center gap-0.5"
                  onClick={() => openProductModal(product)}
                >
                  Bundle deals <FaChevronRightIcon className="text-xs" />
                </button>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <FaCartPlus className="text-xs" />
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Show more products button */}
      <div className="text-center mt-8">
        <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors">
          Show More Products
        </button>
      </div>
    </div>
  );
};

// Related Products Section
const RelatedProductsSection = ({ products, openProductModal }: any) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Related Products</h3>
          <p className="text-gray-600 text-sm">You might also like these</p>
        </div>
        <Link 
          to="/products/all" 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
        >
          View all <FaChevronRight className="text-xs" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {products.slice(0, 12).map((product: any) => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group"
          >
            {/* Product Image */}
            <div 
              className="relative h-24 sm:h-28 overflow-hidden bg-gray-100 cursor-pointer"
              onClick={() => openProductModal(product)}
            >
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Discount Badge */}
              {product.discountPercent && (
                <div className="absolute top-1.5 left-1.5">
                  <div className="bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded">
                    -{product.discountPercent}%
                  </div>
                </div>
              )}

              {/* Wishlist Button */}
              <button 
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300"
                title="Add to wishlist"
              >
                <FaHeart className={`text-xs ${wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-2">
              {/* Product Name */}
              <h3 
                className="font-medium text-gray-900 line-clamp-2 mb-1 text-xs h-8 cursor-pointer hover:text-amber-700"
                onClick={() => openProductModal(product)}
              >
                {product.name}
              </h3>

              {/* Price Section */}
              <div className="mb-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold text-gray-900">
                    {product.currentPrice}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-500 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i}
                      className={`text-xs ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  {product.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Subcategories Section (only visible when a category is selected)
const SubcategoriesSection = ({ categories, selectedCategory, selectedSubcategory, onSubcategorySelect }: any) => {
  // Only show subcategories when a category is selected
  if (!selectedCategory) return null;

  const category = categories.find((cat: any) => cat.id === selectedCategory);
  if (!category || !category.subcategories) return null;

  const subcategoriesToShow = category.subcategories;

  return (
    <div className="mb-10 animate-fadeIn">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {category.name} Subcategories
          </h2>
          <p className="text-gray-600">
            Explore all {category.name} products
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onSubcategorySelect(null)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
          >
            View all subcategories
          </button>
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
        {subcategoriesToShow.slice(0, 24).map((subcat: any) => (
          <button
            key={`${subcat.id}-${selectedCategory}`}
            onClick={() => onSubcategorySelect(subcat.id)}
            className={`group flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
              selectedSubcategory === subcat.id 
                ? 'border-blue-500 bg-blue-50 shadow-lg' 
                : 'border-gray-200 bg-white hover:border-blue-500 hover:shadow-lg'
            }`}
          >
            {/* Subcategory Image */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden mb-3">
              <img 
                src={subcat.image || getSubcategoryImage(subcat.id)} 
                alt={subcat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              {/* Icon Overlay */}
              <div className={`absolute bottom-2 right-2 w-8 h-8 ${
                selectedSubcategory === subcat.id 
                  ? 'bg-blue-100' 
                  : 'bg-white/80 group-hover:bg-blue-50'
              } rounded-full flex items-center justify-center shadow-md`}>
                <div className={`text-sm ${
                  selectedSubcategory === subcat.id 
                    ? 'text-blue-600' 
                    : 'text-gray-700 group-hover:text-blue-600'
                }`}>
                  {subcat.icon}
                </div>
              </div>
            </div>
            
            <span className={`text-sm font-medium text-center ${
              selectedSubcategory === subcat.id 
                ? 'text-blue-700 font-semibold' 
                : 'text-gray-800 group-hover:text-blue-700'
            }`}>
              {subcat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Professional categories display (always visible)
const ProfessionalCategories = ({ categories, selectedCategory, onCategorySelect }: any) => {
  const getCategoryColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      pink: 'bg-gradient-to-br from-pink-500 to-rose-500',
      orange: 'bg-gradient-to-br from-orange-500 to-amber-500',
      purple: 'bg-gradient-to-br from-purple-500 to-violet-500',
      green: 'bg-gradient-to-br from-green-500 to-emerald-500',
      gray: 'bg-gradient-to-br from-gray-500 to-slate-500',
      amber: 'bg-gradient-to-br from-amber-500 to-yellow-500',
      cyan: 'bg-gradient-to-br from-cyan-500 to-blue-500',
      yellow: 'bg-gradient-to-br from-yellow-500 to-amber-500',
      brown: 'bg-gradient-to-br from-amber-700 to-yellow-600',
      teal: 'bg-gradient-to-br from-teal-500 to-green-600',
      red: 'bg-gradient-to-br from-red-500 to-orange-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide">
          {categories.map((category: any) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`group flex-shrink-0 w-48 ${selectedCategory === category.id ? 'ring-2 ring-blue-500 rounded-2xl' : ''}`}
            >
              <div className="relative overflow-hidden rounded-2xl mb-3">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute top-3 left-3 w-10 h-10 ${getCategoryColor(category.color)} rounded-lg flex items-center justify-center text-white shadow-lg`}>
                  {category.icon}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg mb-1">{category.name}</h3>
                  <div className="text-white/90 text-sm flex items-center gap-2">
                    <span>{category.items}</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Shop Now</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

// Active filters display
const ActiveFilters = ({ selectedCategory, selectedSubcategory, onClearFilters }: any) => {
  if (!selectedCategory && !selectedSubcategory) return null;

  const categoryName = selectedCategory 
    ? mainCategories.find(cat => cat.id === selectedCategory)?.name 
    : null;
  
  const subcategoryName = selectedSubcategory 
    ? mainCategories
        .flatMap(cat => cat.subcategories)
        .find(sub => sub.id === selectedSubcategory)?.name
    : null;

  return (
    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Active Filters:</span>
          </div>
          <div className="flex items-center gap-2">
            {selectedCategory && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2">
                <span>Category: {categoryName}</span>
                <button 
                  onClick={() => onClearFilters('category')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedSubcategory && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2">
                <span>Subcategory: {subcategoryName}</span>
                <button 
                  onClick={() => onClearFilters('subcategory')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
        {(selectedCategory || selectedSubcategory) && (
          <button 
            onClick={() => onClearFilters('all')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
};

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(searchParams.get('subcategory'));

  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Get products based on selected subcategory
      let productsToShow;
      if (selectedSubcategory && subcategoryProducts[selectedSubcategory]) {
        productsToShow = subcategoryProducts[selectedSubcategory];
      } else if (selectedCategory) {
        // Show featured products for the category
        productsToShow = subcategoryProducts['featured'];
      } else {
        productsToShow = subcategoryProducts['featured'];
      }
      
      setFilteredProducts(productsToShow);
      setLoading(false);
    }, 500);
  }, [selectedCategory, selectedSubcategory]);

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(categoryId);
      setSelectedSubcategory(null);
    }
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    if (selectedSubcategory === subcategoryId) {
      setSelectedSubcategory(null);
    } else {
      setSelectedSubcategory(subcategoryId);
    }
  };

  const handleClearFilters = (type: 'category' | 'subcategory' | 'all') => {
    if (type === 'all') {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else if (type === 'category') {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else if (type === 'subcategory') {
      setSelectedSubcategory(null);
    }
  };

  const addToCart = (product: any) => {
    console.log('Added to cart:', product);
    // Add your cart logic here
  };

  const openProductModal = (product: any) => {
    console.log('Open product modal:', product);
    // Add your modal opening logic here
  };

  // Get current category and subcategory names for display
  const currentCategoryName = selectedCategory 
    ? mainCategories.find(cat => cat.id === selectedCategory)?.name 
    : null;
  
  const currentSubcategoryName = selectedSubcategory 
    ? mainCategories
        .flatMap(cat => cat.subcategories)
        .find(sub => sub.id === selectedSubcategory)?.name
    : null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl h-32 sm:h-40 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      
      {/* Professional Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {selectedSubcategory 
              ? currentSubcategoryName 
              : selectedCategory 
                ? currentCategoryName + ' Products'
                : 'Shop by Category'
            }
          </h1>
          <Link 
            to="/products/all" 
            className="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-2 group"
          >
            View all
            <FaChevronRight className="text-sm group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <p className="text-gray-600 mb-6">
          {selectedSubcategory 
            ? `Browse all ${currentSubcategoryName} products`
            : selectedCategory 
              ? `Browse all ${selectedSubcategory ? 'selected' : ''} products in ${currentCategoryName}`
              : 'Discover amazing products curated just for you'
          }
        </p>
        
        {/* Choice Badge */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <FaCheck className="text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900">Choice | Better services and selected items</div>
              <div className="text-sm text-gray-600">Premium quality guaranteed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      <ActiveFilters 
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        onClearFilters={handleClearFilters}
      />

      {/* Categories Section (Always Visible) */}
      <ProfessionalCategories 
        categories={mainCategories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* Subcategories Section (Only visible when a category is selected) */}
      <SubcategoriesSection 
        categories={mainCategories}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        onSubcategorySelect={handleSubcategorySelect}
      />

      {/* Products Grid Section (Always Visible) */}
      <ProductGridSection 
        filteredProducts={filteredProducts}
        addToCart={addToCart}
        openProductModal={openProductModal}
        title={
          selectedSubcategory 
            ? `${currentSubcategoryName} Products`
            : selectedCategory
              ? `${currentCategoryName} Products`
              : 'Featured Products'
        }
        description={
          selectedSubcategory 
            ? `Best ${currentSubcategoryName} for your needs`
            : selectedCategory
              ? `Discover amazing ${currentCategoryName}`
              : 'Discover our handpicked selection'
        }
      />

      {/* Related Products Section (Only show when a subcategory is selected) */}
      {selectedSubcategory && (
        <RelatedProductsSection 
          products={relatedProducts}
          openProductModal={openProductModal}
        />
      )}
    </div>
  );
}