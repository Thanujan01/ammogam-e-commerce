import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/api';
import type { IProduct } from '../types';
import { 
  FaStar, FaShoppingCart, FaHeart, FaEye, FaChevronRight, FaChevronDown,
  FaMobileAlt, FaTshirt, FaHome, FaSearch, FaUser, FaBars, FaTimes,
  FaTruck, FaCreditCard, FaUndo, FaTag, FaHeadphones, FaGamepad,
  FaCamera, FaLaptop, FaBolt, FaFacebook, FaTwitter, FaInstagram
} from 'react-icons/fa';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockProducts = [
        {
          id: 101,
          name: '180ML Mini Air Humidifier',
          currentPrice: 'LKR1,278.28',
          originalPrice: null,
          rating: 4.4,
          sold: 50000,
          badge: 'Top selling',
          tags: ['Bundle deals'],
          category: 'Electronics',
          subCategory: 'Air Care',
          image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
          discountPercent: 30
        },
        {
          id: 102,
          name: '270 Air Pro5 Earphone',
          currentPrice: 'LKR342.95',
          originalPrice: 'LKR1,163.96',
          rating: 4.2,
          sold: 15000,
          discount: 'Save LKR802.83',
          badge: 'New deal',
          category: 'Electronics',
          subCategory: 'Audio',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
          sale: true,
          discountPercent: 70
        },
        {
          id: 103,
          name: 'Y2K Hello Kitty Phone Case',
          currentPrice: 'LKR1,135.57',
          originalPrice: null,
          rating: 4.6,
          sold: 4000,
          badge: 'Trending',
          category: 'Accessories',
          subCategory: 'Phone Cases',
          image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400',
          sale: true
        },
        {
          id: 104,
          name: '100W Magnetic Fast Charger',
          currentPrice: 'LKR342.95',
          originalPrice: 'LKR1,563.33',
          rating: 4.2,
          sold: 1000,
          discount: 'Save LKR1,200',
          badge: 'Fast Charging',
          category: 'Electronics',
          subCategory: 'Chargers',
          image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400',
          sale: true,
          discountPercent: 78
        },
        {
          id: 105,
          name: 'Wireless Bluetooth Earbuds',
          currentPrice: 'LKR1,899.99',
          originalPrice: 'LKR2,599.99',
          rating: 4.5,
          sold: 8000,
          discount: 'Save LKR700',
          badge: 'Best Seller',
          category: 'Electronics',
          subCategory: 'Audio',
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
          sale: true,
          discountPercent: 27
        },
        {
          id: 106,
          name: 'U.S Plug 3-Port Charger',
          currentPrice: 'LKR2,499.99',
          originalPrice: 'LKR3,199.99',
          rating: 4.8,
          sold: 3500,
          discount: 'Save LKR700',
          badge: 'Fast Delivery',
          category: 'Electronics',
          subCategory: 'Chargers',
          image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400',
          sale: true,
          discountPercent: 22
        },
        {
          id: 107,
          name: 'Smart Watch Pro Max',
          currentPrice: 'LKR4,999.99',
          originalPrice: 'LKR6,499.99',
          rating: 4.7,
          sold: 12000,
          discount: 'Save LKR1,500',
          badge: 'Limited Time',
          category: 'Electronics',
          subCategory: 'Wearables',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
          sale: true,
          discountPercent: 23
        },
        {
          id: 108,
          name: 'RGB Gaming Keyboard',
          currentPrice: 'LKR3,299.99',
          originalPrice: 'LKR4,199.99',
          rating: 4.3,
          sold: 6500,
          discount: 'Save LKR900',
          badge: 'Gaming',
          category: 'Electronics',
          subCategory: 'Gaming',
          image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
          sale: true,
          discountPercent: 21
        }
      ];
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter products by category
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  // Get unique categories
  const categories = ['All', 'Electronics', 'Accessories', 'Home', 'Fashion', 'Gaming'];

  // Featured categories
  const featuredCategories = [
    { name: 'Electronics', icon: <FaMobileAlt />, color: 'bg-blue-50', textColor: 'text-blue-600' },
    { name: 'Fashion', icon: <FaTshirt />, color: 'bg-pink-50', textColor: 'text-pink-600' },
    { name: 'Home & Living', icon: <FaHome />, color: 'bg-green-50', textColor: 'text-green-600' },
    { name: 'Audio', icon: <FaHeadphones />, color: 'bg-purple-50', textColor: 'text-purple-600' },
    { name: 'Gaming', icon: <FaGamepad />, color: 'bg-red-50', textColor: 'text-red-600' },
    { name: 'Photography', icon: <FaCamera />, color: 'bg-yellow-50', textColor: 'text-yellow-600' },
    { name: 'Laptops', icon: <FaLaptop />, color: 'bg-indigo-50', textColor: 'text-indigo-600' },
    { name: 'Smart Home', icon: <FaBolt />, color: 'bg-teal-50', textColor: 'text-teal-600' },
  ];

  // Features section
  const features = [
    { icon: <FaTruck />, title: 'Free Shipping', desc: 'On orders over LKR5,000' },
    { icon: <FaCreditCard />, title: 'Secure Payment', desc: '100% secure payment' },
    { icon: <FaTag />, title: 'Best Price', desc: 'Guaranteed best price' },
    { icon: <FaUndo />, title: 'Easy Returns', desc: '30-day return policy' },
  ];

  // Navigation items
  const navItems = ['Home', 'Shop', 'Categories', 'Deals', 'New Arrivals', 'Best Sellers'];

  return (
    <div className="min-h-screen bg-gray-50">
     

      

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Features Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-8 border border-amber-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-amber-100">
                  <div className="text-amber-600 text-xl">{feature.icon}</div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Banner */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
          <div className="relative h-80 md:h-96 bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600">
            <div className="absolute inset-0 flex items-center">
              <div className="pl-8 md:pl-16 max-w-xl">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm mb-4">
                  Limited Time Offer
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Summer Sale <br />Up to 70% Off
                </h1>
                <p className="text-white/90 text-lg mb-6">
                  Discover amazing deals on electronics, fashion, and more
                </p>
                <button className="bg-white text-amber-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl">
                  Shop Now
                </button>
              </div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=800"
                alt="Summer Sale"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
            <button className="text-amber-700 hover:text-amber-800 font-medium flex items-center">
              View all <FaChevronRight className="ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {featuredCategories.map((category, index) => (
              <div 
                key={index}
                className={`${category.color} rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-amber-200 hover:scale-105`}
              >
                <div className={`text-3xl ${category.textColor} mb-3 flex justify-center`}>
                  {category.icon}
                </div>
                <div className="font-semibold text-gray-800 text-sm">{category.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
            <button className="text-amber-700 hover:text-amber-800 font-medium flex items-center">
              View all <FaChevronRight className="ml-1" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-[#8B4513] text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-amber-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                  >
                    {/* Product Image */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Discount Badge */}
                      {product.discountPercent && (
                        <div className="absolute top-4 left-4">
                          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                            -{product.discountPercent}% OFF
                          </div>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 hover:text-red-500 transition-colors">
                          <FaHeart className="text-gray-600 group-hover:text-red-500" />
                        </button>
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-50 hover:text-blue-500 transition-colors">
                          <FaEye className="text-gray-600 group-hover:text-blue-500" />
                        </button>
                      </div>

                      {/* Sale Badge */}
                      {product.sale && (
                        <div className="absolute bottom-4 left-4">
                          <div className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                            FLASH SALE
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      {/* Category */}
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                        {product.category}
                      </div>
                      
                      {/* Product Name */}
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-3 h-14 hover:text-amber-700 cursor-pointer transition-colors">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i}
                              className={`text-sm ${
                                i < Math.floor(product.rating) 
                                  ? 'text-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {product.rating} ({product.sold.toLocaleString()}+ sold)
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xl font-bold text-gray-900">
                            {product.currentPrice}
                          </span>
                          {product.originalPrice && (
                            <>
                              <span className="text-sm text-gray-500 line-through">
                                {product.originalPrice}
                              </span>
                              {product.discount && (
                                <span className="text-xs bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-3 py-1 rounded-lg font-medium">
                                  {product.discount}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Badge */}
                      {product.badge && (
                        <div className="mb-4">
                          <div className="text-xs bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 px-3 py-2 rounded-lg border border-amber-100 inline-block">
                            {product.badge}
                          </div>
                        </div>
                      )}

                      
                    </div>
                  </div>
                ))}
              </div>

              {/* Promotional Banner */}
              <div className="mb-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 md:p-12 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-24 translate-y-24"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-8 md:mb-0 md:max-w-lg">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Flash Sale Ends Soon!</h2>
                    <p className="text-lg mb-6 text-white/90">Limited time offers on selected items. Don't miss out!</p>
                    <div className="flex gap-4 mb-6">
                      <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3">
                        <div className="text-2xl font-bold">02</div>
                        <div className="text-sm mt-1">Hours</div>
                      </div>
                      <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3">
                        <div className="text-2xl font-bold">45</div>
                        <div className="text-sm mt-1">Minutes</div>
                      </div>
                      <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3">
                        <div className="text-2xl font-bold">18</div>
                        <div className="text-sm mt-1">Seconds</div>
                      </div>
                    </div>
                    <button className="bg-white text-amber-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                      Shop Flash Sale
                    </button>
                  </div>
                  <div className="w-64 md:w-80">
                    <img 
                      src="https://images.unsplash.com/photo-1606788075767-20b25ec7eac5?w=400"
                      alt="Flash Sale"
                      className="w-full h-auto rounded-xl shadow-2xl"
                    />
                  </div>
                </div>
              </div>

              {/* Recently Viewed */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Recently Viewed</h2>
                  <button className="text-amber-700 hover:text-amber-800 font-medium flex items-center">
                    See all <FaChevronRight className="ml-1" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {products.slice(0, 6).map((product) => (
                    <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow hover:border-amber-200">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      <div className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">{product.name}</div>
                      <div className="text-base font-bold text-amber-700">{product.currentPrice}</div>
                    </div>
                  ))}
                </div>
              </div>

           
            </>
          )}
        </div>
      </div>

     
    </div>
  );
}