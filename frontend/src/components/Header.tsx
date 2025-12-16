import { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import { 
  FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes, 
  FaSearch, FaTag, FaCrown, FaHome, FaShoppingBag,
  FaCaretDown, FaMobileAlt, FaPercent, FaBoxOpen, FaList,
  FaTruck, FaClock, FaChartLine, FaLaptop, FaTshirt,
  FaUsers, FaShieldAlt, FaCreditCard, FaFire,
  FaRegHeart, FaBell, FaMapMarkerAlt, FaPhone, FaAngleRight,
  FaHeartbeat, FaDumbbell, FaCar, FaGamepad, FaBook,
  FaChevronRight, FaArrowRight, FaCheck, FaShippingFast
} from 'react-icons/fa';

// Placeholder images - using Unsplash URLs
const placeholderImages = {
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  home: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  beauty: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  sports: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  auto: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  toys: 'https://images.unsplash.com/photo-1587654780298-8c6d6b2c8b2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  books: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
};

import logoImage from '../assets/logo.jpg';

export default function Header() {
  const auth = useContext(AuthContext)!;
  const cart = useContext(CartContext)!;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Electronics');
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate sale countdown
  useEffect(() => {
    const updateCountdown = () => {
      const saleEndDate = new Date('Dec 15, 2025 13:29:00 GMT+5.5');
      const now = new Date();
      const diff = saleEndDate.getTime() - now.getTime();

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft('Sale Ended');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close category menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setShowCategoryMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
      setSearchActive(false);
    }
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/');
    setIsMenuOpen(false);
    setShowUserMenu(false);
  };

  // Professional category data with subcategories and featured products
  const categories = [
    { 
      name: 'Electronics', 
      icon: <FaLaptop className="text-lg" />, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      image: placeholderImages.electronics,
      mainSubcategories: [
        {
          title: 'Mobile & Accessories',
          items: ['Smartphones', 'Tablets', 'Smart Watches', 'Headphones', 'Power Banks', 'Cases & Covers']
        },
        {
          title: 'Computers & Laptops',
          items: ['Laptops', 'Desktops', 'Monitors', 'Printers', 'Keyboards', 'Mouse']
        },
        {
          title: 'Home Entertainment',
          items: ['Televisions', 'Soundbars', 'Home Theaters', 'Streaming Devices', 'Gaming Consoles']
        }
      ],
      featuredProducts: [
        { name: 'iPhone 15 Pro', price: '₹1,19,999', discount: '10% OFF', image: '📱' },
        { name: 'Samsung OLED TV', price: '₹89,999', discount: '15% OFF', image: '📺' },
        { name: 'Sony Headphones', price: '₹14,999', tag: 'Bestseller', image: '🎧' }
      ],
      promoText: 'Up to 50% OFF on latest gadgets'
    },
    { 
      name: 'Fashion', 
      icon: <FaTshirt className="text-lg" />, 
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-100',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-700',
      image: placeholderImages.fashion,
      mainSubcategories: [
        {
          title: 'Women\'s Fashion',
          items: ['Ethnic Wear', 'Western Wear', 'Lingerie', 'Handbags', 'Jewelry', 'Footwear']
        },
        {
          title: 'Men\'s Fashion',
          items: ['Shirts & T-Shirts', 'Jeans & Trousers', 'Formal Wear', 'Watches', 'Shoes', 'Accessories']
        },
        {
          title: 'Kids & Infant',
          items: ['Baby Clothing', 'Kids Wear', 'School Uniforms', 'Footwear', 'Toys', 'Accessories']
        }
      ],
      featuredProducts: [
        { name: 'Designer Handbag', price: '₹12,999', discount: '30% OFF', image: '👜' },
        { name: 'Leather Jacket', price: '₹8,499', tag: 'Trending', image: '🧥' },
        { name: 'Running Shoes', price: '₹5,999', discount: '25% OFF', image: '👟' }
      ],
      promoText: 'New Arrivals 40% OFF'
    },
    { 
      name: 'Home & Kitchen', 
      icon: <FaHome className="text-lg" />, 
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-amber-100',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      image: placeholderImages.home,
      mainSubcategories: [
        {
          title: 'Furniture',
          items: ['Sofa & Couches', 'Beds', 'Wardrobes', 'Dining Sets', 'Office Furniture', 'Outdoor']
        },
        {
          title: 'Kitchen & Dining',
          items: ['Cookware', 'Cutlery', 'Small Appliances', 'Storage', 'Serveware', 'Bakeware']
        },
        {
          title: 'Home Decor',
          items: ['Lighting', 'Wall Decor', 'Clocks', 'Mirrors', 'Rugs', 'Curtains']
        }
      ],
      featuredProducts: [
        { name: 'Smart Air Fryer', price: '₹9,999', discount: '20% OFF', image: '🍳' },
        { name: 'King Size Bed', price: '₹34,999', tag: 'Premium', image: '🛏️' },
        { name: 'Dining Set', price: '₹22,999', discount: '15% OFF', image: '🍽️' }
      ],
      promoText: 'Home makeover starting ₹999'
    },
    { 
      name: 'Beauty & Health', 
      icon: <FaHeartbeat className="text-lg" />, 
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-violet-100',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      image: placeholderImages.beauty,
      mainSubcategories: [
        {
          title: 'Skincare',
          items: ['Face Care', 'Body Care', 'Sunscreen', 'Acne Care', 'Anti-Aging', 'Masks']
        },
        {
          title: 'Makeup',
          items: ['Foundation', 'Lipstick', 'Eyeshadow', 'Mascara', 'Blush', 'Makeup Kits']
        },
        {
          title: 'Health & Wellness',
          items: ['Vitamins', 'Protein', 'Fitness Gear', 'Medical Devices', 'Personal Care', 'Supplements']
        }
      ],
      featuredProducts: [
        { name: 'Vitamin C Serum', price: '₹1,499', discount: '25% OFF', image: '🧴' },
        { name: 'Fitness Tracker', price: '₹3,999', tag: 'Bestseller', image: '⌚' },
        { name: 'Makeup Kit', price: '₹2,999', discount: '30% OFF', image: '💄' }
      ],
      promoText: 'Buy 1 Get 1 Free on skincare'
    },
    { 
      name: 'Sports & Fitness', 
      icon: <FaDumbbell className="text-lg" />, 
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-100',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      image: placeholderImages.sports,
      mainSubcategories: [
        {
          title: 'Fitness Equipment',
          items: ['Treadmills', 'Dumbbells', 'Yoga Mats', 'Exercise Bikes', 'Home Gyms', 'Weights']
        },
        {
          title: 'Sportswear',
          items: ['Activewear', 'Running Shoes', 'Sport Shoes', 'Accessories', 'Team Jerseys', 'Outdoor']
        },
        {
          title: 'Sports Gear',
          items: ['Cricket', 'Football', 'Badminton', 'Tennis', 'Basketball', 'Cycling']
        }
      ],
      featuredProducts: [
        { name: 'Treadmill Pro', price: '₹45,999', discount: '18% OFF', image: '🏃' },
        { name: 'Yoga Mat Set', price: '₹1,999', tag: 'Popular', image: '🧘' },
        { name: 'Protein Powder', price: '₹2,499', discount: '20% OFF', image: '🥤' }
      ],
      promoText: 'Fitness sale up to 60% OFF'
    },
    { 
      name: 'Automotive', 
      icon: <FaCar className="text-lg" />, 
      color: 'from-red-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-orange-100',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      image: placeholderImages.auto,
      mainSubcategories: [
        {
          title: 'Car Accessories',
          items: ['Audio Systems', 'Seat Covers', 'Dash Cams', 'Lighting', 'Cleaning', 'Storage']
        },
        {
          title: 'Car Care',
          items: ['Cleaning Kits', 'Polish & Wax', 'Air Fresheners', 'Maintenance', 'Tools', 'Tires']
        },
        {
          title: 'Two Wheelers',
          items: ['Helmets', 'Bike Covers', 'Accessories', 'Maintenance', 'Security', 'Storage']
        }
      ],
      featuredProducts: [
        { name: 'Car Dash Camera', price: '₹5,999', discount: '30% OFF', image: '📹' },
        { name: 'Leather Seat Covers', price: '₹8,499', tag: 'Premium', image: '🚗' },
        { name: 'Car Vacuum', price: '₹2,999', discount: '25% OFF', image: '🧹' }
      ],
      promoText: 'Free installation available'
    },
    { 
      name: 'Toys & Games', 
      icon: <FaGamepad className="text-lg" />, 
      color: 'from-yellow-500 to-amber-600',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-100',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      image: placeholderImages.toys,
      mainSubcategories: [
        {
          title: 'Kids Toys',
          items: ['Educational Toys', 'Soft Toys', 'Action Figures', 'Dolls', 'Puzzles', 'Building Blocks']
        },
        {
          title: 'Video Games',
          items: ['Consoles', 'Games', 'Controllers', 'VR Headsets', 'Accessories', 'Gaming Chairs']
        },
        {
          title: 'Board Games',
          items: ['Family Games', 'Strategy Games', 'Card Games', 'Puzzle Games', 'Party Games', 'Classic']
        }
      ],
      featuredProducts: [
        { name: 'Drone with Camera', price: '₹12,999', discount: '20% OFF', image: '🚁' },
        { name: 'Gaming Console', price: '₹39,999', tag: 'Hot', image: '🎮' },
        { name: 'LEGO Set', price: '₹3,499', discount: '15% OFF', image: '🧱' }
      ],
      promoText: 'Perfect gifts for Christmas'
    },
    { 
      name: 'Books & Stationery', 
      icon: <FaBook className="text-lg" />, 
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-100',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-700',
      image: placeholderImages.books,
      mainSubcategories: [
        {
          title: 'Books',
          items: ['Fiction', 'Non-Fiction', 'Academic', 'Children\'s', 'Biographies', 'Self-Help']
        },
        {
          title: 'Office Supplies',
          items: ['Notebooks', 'Pens', 'Desk Organizers', 'Files & Folders', 'Calculators', 'Art Supplies']
        },
        {
          title: 'Educational',
          items: ['Textbooks', 'Reference Books', 'Exam Prep', 'Learning Kits', 'Stationery Sets', 'School']
        }
      ],
      featuredProducts: [
        { name: 'Bestseller Novel', price: '₹499', discount: '10% OFF', image: '📚' },
        { name: 'Premium Pen Set', price: '₹2,999', tag: 'Luxury', image: '🖊️' },
        { name: 'Art Supplies Kit', price: '₹1,799', discount: '25% OFF', image: '🎨' }
      ],
      promoText: 'Buy 2 Books Get 1 Free'
    },
  ];

  const quickLinks = [
    { name: 'Home', path: '/', icon: <FaHome className="text-lg" /> },
    { name: 'Products', path: '/products', icon: <FaShoppingBag className="text-lg" /> },
    { name: 'Categories', path: '/categories', icon: <FaList className="text-lg" /> },
    { name: 'Hot Deals', path: '/deals', icon: <FaFire className="text-lg text-red-500" /> },
    { name: 'Flash Sale', path: '/flash-sale', icon: <FaTag className="text-lg text-orange-500" /> },
  ];

  const adminFeatures = [
    { name: 'Dashboard', path: '/admin', icon: <FaChartLine /> },
    { name: 'Products', path: '/admin/products', icon: <FaBoxOpen /> },
    { name: 'Orders', path: '/admin/orders', icon: <FaShoppingBag /> },
    { name: 'Customers', path: '/admin/customers', icon: <FaUsers /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <FaChartLine /> },
  ];

  // Get active category data
  const activeCategoryData = categories.find(cat => cat.name === activeCategory) || categories[0];

  // Mobile search bar component
  const MobileSearchBar = () => (
    <div className="lg:hidden w-full bg-white px-4 py-3 border-b">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 text-sm" />
        </div>
        <button
          type="button"
          onClick={() => setSearchActive(false)}
          className="px-3 py-2.5 text-gray-600 hover:text-gray-800"
        >
          <FaTimes className="text-lg" />
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* Top Announcement Bar - Mobile Optimized */}
      <div className="bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between py-1.5 sm:py-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-0 w-full sm:w-auto justify-center sm:justify-start">
              <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                <FaPhone className="text-xs hidden xs:inline" />
                <span className="truncate">Support: +94 77 123 4567</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-amber-200">•</span>
                <FaMapMarkerAlt className="text-xs" />
                <span>Free Delivery Islandwide</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
              <div className="flex items-center gap-1.5 bg-black/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                <FaClock className="text-xs animate-pulse" />
                <span className="font-bold truncate">Flash Sale: {timeLeft}</span>
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <FaPercent className="text-xs" />
                <span className="hidden xl:inline">Use Code: <span className="font-bold">AMMO15</span> for 15% OFF</span>
                <span className="xl:hidden">Code: <span className="font-bold">AMMO15</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white border-b'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile Logo & Menu Button */}
            <div className="flex items-center gap-3 lg:hidden">
              <button 
                className="p-2 rounded-lg hover:bg-amber-50 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
              
              <Link to="/" className="flex items-center gap-3 w-164">
                <img 
                  src={logoImage} 
                  alt="AMMOGAM Logo" 
                  className="h-10 w-164 object-contain"
                />
              </Link>
            </div>

            {/* Desktop Logo */}
            <Link to="/" className="hidden lg:flex items-center gap-4 group">
              <img 
                src={logoImage} 
                alt="AMMOGAM Logo" 
                className="h-14 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-4 xl:mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for products, brands, and categories..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 text-sm xl:text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500" />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Search Button */}
              <button 
                className="lg:hidden p-2 rounded-lg hover:bg-amber-50 transition-colors"
                onClick={() => setSearchActive(!searchActive)}
                aria-label="Search"
              >
                <FaSearch className="text-lg text-gray-600" />
              </button>

              {/* Mobile Cart */}
              <Link 
                to="/cart" 
                className="lg:hidden relative p-2 hover:bg-amber-50 rounded-lg transition-colors"
              >
                <FaShoppingCart className="text-lg text-gray-600" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>

              {/* Mobile User Button */}
              {auth.user && (
                <Link 
                  to="/dashboard" 
                  className="lg:hidden p-2 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-[#8B4513] to-[#A0522D] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {auth.user.name.charAt(0).toUpperCase()}
                  </div>
                </Link>
              )}

              {/* Desktop Wishlist */}
              <Link 
                to="/wishlist" 
                className="hidden md:flex flex-col items-center p-2 hover:bg-amber-50 rounded-lg transition-colors group"
              >
                <div className="relative">
                  <FaRegHeart className="text-xl text-gray-600 group-hover:text-red-500" />
                </div>
                <span className="text-xs mt-1 hidden lg:block">Wishlist</span>
              </Link>

              {/* Desktop Cart */}
              <Link 
                to="/cart" 
                className="hidden md:flex flex-col items-center p-2 hover:bg-amber-50 rounded-lg transition-colors group relative"
              >
                <div className="relative">
                  <FaShoppingCart className="text-xl text-gray-600 group-hover:text-amber-600" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce">
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1 hidden lg:block">Cart</span>
              </Link>

              {/* Desktop User Profile */}
              {auth.user ? (
                <div className="hidden lg:block relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-[#8B4513] to-[#A0522D] rounded-full flex items-center justify-center text-white">
                      {auth.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden xl:block text-left">
                      <div className="text-sm font-semibold">{auth.user.name.split(' ')[0]}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        {auth.user.role === 'admin' ? (
                          <>
                            <FaCrown className="text-yellow-500 text-xs" />
                            <span>Admin</span>
                          </>
                        ) : (
                          <>
                            <FaUser className="text-amber-500 text-xs" />
                            <span>Customer</span>
                          </>
                        )}
                      </div>
                    </div>
                    <FaCaretDown className={`text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-xl border z-50">
                      <div className="p-4 border-b bg-gradient-to-r from-amber-50 to-amber-100">
                        <div className="font-bold truncate">{auth.user.name}</div>
                        <div className="text-sm text-gray-600 truncate">{auth.user.email}</div>
                        <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${auth.user.role === 'admin' ? 'bg-yellow-100 text-yellow-800' : 'bg-amber-100 text-amber-800'}`}>
                          {auth.user.role === 'admin' ? 'Administrator' : 'Premium Member'}
                        </div>
                      </div>
                      
                      <div className="p-2 max-h-96 overflow-y-auto">
                        <Link 
                          to="/dashboard" 
                          className="dropdown-item"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaHome className="text-amber-500" />
                          My Dashboard
                        </Link>
                        <Link 
                          to="/orders" 
                          className="dropdown-item"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaShoppingBag className="text-amber-500" />
                          My Orders
                        </Link>
                        <Link 
                          to="/wishlist" 
                          className="dropdown-item"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaRegHeart className="text-amber-500" />
                          Wishlist
                        </Link>
                        <Link 
                          to="/notifications" 
                          className="dropdown-item"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaBell className="text-amber-500" />
                          Notifications
                          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                        </Link>
                        
                        {auth.user.role === 'admin' && (
                          <>
                            <div className="my-2 border-t pt-2">
                              <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">Admin Panel</div>
                              {adminFeatures.map((feature) => (
                                <Link
                                  key={feature.name}
                                  to={feature.path}
                                  className="dropdown-item bg-gradient-to-r from-amber-50 to-yellow-50"
                                  onClick={() => setShowUserMenu(false)}
                                >
                                  {feature.icon}
                                  {feature.name}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                        
                        <button 
                          onClick={handleLogout}
                          className="w-full mt-2 px-4 py-2.5 flex items-center gap-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                        >
                          <FaSignOutAlt />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Link 
                    to="/login" 
                    className="px-3 xl:px-4 py-2 border border-[#8B4513] text-[#8B4513] rounded-lg hover:bg-amber-50 transition-colors font-medium text-sm xl:text-base"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-3 xl:px-4 py-2 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-lg text-sm xl:text-base"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Auth Buttons */}
              {!auth.user && !isMobile && (
                <div className="lg:hidden flex items-center gap-1">
                  <Link 
                    to="/login" 
                    className="px-3 py-1.5 border border-[#8B4513] text-[#8B4513] rounded-lg text-xs font-medium"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between py-3 border-t">
            {/* Categories */}
            <div className="flex items-center gap-4 xl:gap-6">
              <button 
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                onMouseEnter={() => !isMobile && setShowCategoryMenu(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-lg hover:opacity-90 transition-opacity text-sm xl:text-base relative group"
              >
                <FaBars />
                <span className="font-semibold">All Categories</span>
                <FaCaretDown className={`transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} />
                <div className="absolute -bottom-2 left-0 right-0 h-2 bg-transparent"></div>
              </button>
              
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center gap-2 text-gray-700 hover:text-[#8B4513] transition-colors font-medium text-sm xl:text-base"
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Promo Banner */}
            <div className="hidden xl:flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full px-4 py-2">
                <FaShieldAlt className="text-green-600" />
                <span className="text-sm font-semibold">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-full px-4 py-2">
                <FaTruck className="text-blue-600" />
                <span className="text-sm font-semibold">Free Shipping</span>
              </div>
            </div>
          </div>

          {/* Professional Mega Menu with Images */}
          {showCategoryMenu && !isMobile && (
            <div 
              ref={categoryMenuRef}
              className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 hidden lg:block overflow-hidden mega-menu"
              onMouseLeave={() => setShowCategoryMenu(false)}
            >
              <div className="flex">
                {/* Left sidebar - Categories List */}
                <div className="w-72 bg-gradient-to-b from-gray-50 to-white border-r p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Browse Categories</h3>
                    <div className="text-xs text-amber-600 font-medium">8 Categories</div>
                  </div>
                  
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group ${activeCategory === category.name ? 'bg-white shadow-lg border border-gray-200' : 'hover:bg-white hover:shadow-md'}`}
                        onMouseEnter={() => setActiveCategory(category.name)}
                        onClick={() => {
                          navigate(`/category/${category.name.toLowerCase().replace(/ /g, '-')}`);
                          setShowCategoryMenu(false);
                        }}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-sm`}>
                          {category.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-gray-800 group-hover:text-amber-700">
                            {category.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">Shop Now →</div>
                        </div>
                        <FaChevronRight className={`text-gray-400 transition-transform ${activeCategory === category.name ? 'translate-x-1 text-amber-600' : ''}`} />
                      </button>
                    ))}
                  </div>

                  {/* Flash Sale Banner */}
                  <div className="mt-8 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                        <FaFire className="text-white text-lg" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">Flash Sale Live!</div>
                        <div className="text-sm text-gray-600 flex items-center gap-2 mt-0.5">
                          <FaClock className="text-red-500 animate-pulse" />
                          <span className="font-bold text-red-600">{timeLeft}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Content - Dynamic Category Details */}
                <div className="flex-1 p-8 bg-white">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{activeCategoryData.name}</h2>
                      <p className="text-gray-600 mt-1">Explore thousands of products with premium quality</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-full flex items-center gap-2">
                        <FaCheck className="text-xs" />
                        {activeCategoryData.promoText}
                      </div>
                      <Link 
                        to={`/category/${activeCategoryData.name.toLowerCase().replace(/ /g, '-')}`}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-lg hover:opacity-90 font-medium text-sm flex items-center gap-2 shadow-lg"
                        onClick={() => setShowCategoryMenu(false)}
                      >
                        View All
                        <FaArrowRight className="text-xs" />
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-8">
                    {/* Subcategories Section */}
                    <div className="col-span-8">
                      <div className="grid grid-cols-3 gap-6">
                        {activeCategoryData.mainSubcategories.map((subcategory, index) => (
                          <div key={index} className="space-y-4">
                            <h4 className="font-bold text-gray-900 text-lg pb-2 border-b border-gray-200">
                              {subcategory.title}
                            </h4>
                            <ul className="space-y-2.5">
                              {subcategory.items.map((item, idx) => (
                                <li key={idx}>
                                  <Link
                                    to={`/category/${activeCategoryData.name.toLowerCase().replace(/ /g, '-')}/${item.toLowerCase().replace(/ /g, '-')}`}
                                    className="text-sm text-gray-700 hover:text-amber-700 hover:font-medium flex items-center justify-between group"
                                    onClick={() => setShowCategoryMenu(false)}
                                  >
                                    <span className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-amber-500"></span>
                                      {item}
                                    </span>
                                    <FaChevronRight className="text-[10px] text-gray-400 group-hover:text-amber-500" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Featured Products Grid */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="font-bold text-gray-900 text-lg mb-4">Featured Products</h4>
                        <div className="grid grid-cols-3 gap-4">
                          {activeCategoryData.featuredProducts.map((product, index) => (
                            <Link
                              key={index}
                              to={`/product/${product.name.toLowerCase().replace(/ /g, '-')}`}
                              className="group p-4 border border-gray-200 rounded-xl hover:border-amber-300 hover:shadow-lg transition-all duration-300"
                              onClick={() => setShowCategoryMenu(false)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl">
                                  {product.image}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-800 group-hover:text-amber-700 line-clamp-1">
                                    {product.name}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="font-bold text-gray-900">{product.price}</span>
                                    {product.discount && (
                                      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">
                                        {product.discount}
                                      </span>
                                    )}
                                    {product.tag && (
                                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded-full font-medium">
                                        {product.tag}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Category Image and Promotions */}
                    <div className="col-span-4 space-y-6">
                      {/* Main Category Image */}
                      <div className="relative overflow-hidden rounded-2xl group">
                        <img 
                          src={activeCategoryData.image} 
                          alt={activeCategoryData.name}
                          className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="text-white font-bold text-lg">Top Brands</div>
                          <div className="text-white/90 text-sm">Premium quality guaranteed</div>
                        </div>
                      </div>

                      {/* Quick Links */}
                      <div className="p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl">
                        <h5 className="font-bold text-gray-900 mb-3">Quick Links</h5>
                        <div className="space-y-2">
                          <Link 
                            to={`/category/${activeCategoryData.name.toLowerCase().replace(/ /g, '-')}/best-sellers`}
                            className="flex items-center justify-between p-2 hover:bg-amber-50 rounded-lg group"
                            onClick={() => setShowCategoryMenu(false)}
                          >
                            <span className="text-sm text-gray-700 group-hover:text-amber-700">Best Sellers</span>
                            <FaChevronRight className="text-xs text-gray-400 group-hover:text-amber-600" />
                          </Link>
                          <Link 
                            to={`/category/${activeCategoryData.name.toLowerCase().replace(/ /g, '-')}/new-arrivals`}
                            className="flex items-center justify-between p-2 hover:bg-amber-50 rounded-lg group"
                            onClick={() => setShowCategoryMenu(false)}
                          >
                            <span className="text-sm text-gray-700 group-hover:text-amber-700">New Arrivals</span>
                            <FaChevronRight className="text-xs text-gray-400 group-hover:text-amber-600" />
                          </Link>
                          <Link 
                            to={`/category/${activeCategoryData.name.toLowerCase().replace(/ /g, '-')}/deals`}
                            className="flex items-center justify-between p-2 hover:bg-amber-50 rounded-lg group"
                            onClick={() => setShowCategoryMenu(false)}
                          >
                            <span className="text-sm text-gray-700 group-hover:text-amber-700">Top Deals</span>
                            <FaChevronRight className="text-xs text-gray-400 group-hover:text-amber-600" />
                          </Link>
                        </div>
                      </div>

                      {/* Service Badges */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg text-center">
                          <FaShippingFast className="text-green-600 text-lg mx-auto mb-1" />
                          <div className="text-xs font-medium text-gray-800">Free Shipping</div>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg text-center">
                          <FaShieldAlt className="text-blue-600 text-lg mx-auto mb-1" />
                          <div className="text-xs font-medium text-gray-800">1 Year Warranty</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Search Bar (when active) */}
        {searchActive && <MobileSearchBar />}
      </header>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}></div>
        <div className="absolute right-0 top-0 bottom-0 w-80 sm:w-96 bg-white shadow-xl overflow-y-auto flex flex-col">
          {/* Mobile Menu Header */}
          <div className="p-4 bg-gradient-to-b from-amber-50 to-white border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={logoImage} 
                  alt="AMMOGAM Logo" 
                  className="h-8 w-auto object-contain"
                />
                <span className="text-xl font-bold text-amber-900">AMMOGAM</span>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-amber-100 rounded-lg"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
            
            {/* Mobile Search in Menu */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
              </div>
            </form>
            
            {/* User Info */}
            {auth.user ? (
              <Link 
                to="/dashboard" 
                className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border hover:bg-amber-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-[#8B4513] to-[#A0522D] rounded-full flex items-center justify-center text-white font-bold">
                  {auth.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{auth.user.name}</div>
                  <div className="text-xs text-gray-600 truncate">{auth.user.email}</div>
                </div>
                <FaAngleRight className="text-gray-400" />
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link 
                  to="/login" 
                  className="flex-1 text-center py-2.5 border border-[#8B4513] text-[#8B4513] rounded-lg font-medium text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="flex-1 text-center py-2.5 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-lg font-medium text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="space-y-0">
                {quickLinks.map((link) => (
                  <Link 
                    key={link.name}
                    to={link.path} 
                    className="flex items-center gap-3 px-3 py-3.5 text-gray-700 hover:text-[#8B4513] hover:bg-amber-50 rounded-lg transition-colors text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="text-amber-500">{link.icon}</div>
                    {link.name}
                    <FaAngleRight className="ml-auto text-gray-400" />
                  </Link>
                ))}
                
                <Link 
                  to="/cart" 
                  className="flex items-center gap-3 px-3 py-3.5 text-gray-700 hover:text-[#8B4513] hover:bg-amber-50 rounded-lg transition-colors text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaShoppingCart className="text-amber-500" />
                  Shopping Cart
                  {cartItemCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {cartItemCount} items
                    </span>
                  )}
                </Link>

                <Link 
                  to="/wishlist" 
                  className="flex items-center gap-3 px-3 py-3.5 text-gray-700 hover:text-[#8B4513] hover:bg-amber-50 rounded-lg transition-colors text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaRegHeart className="text-amber-500" />
                  Wishlist
                </Link>

                <Link 
                  to="/download" 
                  className="flex items-center gap-3 px-3 py-3.5 text-gray-700 hover:text-[#8B4513] hover:bg-amber-50 rounded-lg transition-colors text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaMobileAlt className="text-amber-500" />
                  Download App
                  <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">NEW</span>
                </Link>
              </div>

              {/* Categories Section */}
              <div className="mt-6 pt-4 border-t">
                <div className="text-xs font-bold text-gray-500 uppercase mb-3 px-3">Shop Categories</div>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      to={`/category/${category.name.toLowerCase().replace(/ /g, '-')}`}
                      className="p-3 border rounded-lg hover:bg-amber-50 transition-colors text-center group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.bgColor} ${category.textColor} mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                        {category.icon}
                      </div>
                      <div className="text-xs font-medium">{category.name}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* User Account Links */}
              {auth.user && (
                <div className="mt-6 pt-4 border-t">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-3 px-3">My Account</div>
                  <div className="space-y-0">
                    <Link to="/dashboard" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                      Dashboard
                    </Link>
                    <Link to="/orders" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                      My Orders
                    </Link>
                    <Link to="/wishlist" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                      Wishlist
                    </Link>
                    <Link to="/notifications" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                      Notifications
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                    </Link>
                    
                    {auth.user.role === 'admin' && (
                      <>
                        <div className="my-3 pt-3 border-t">
                          <div className="text-xs font-bold text-[#8B4513] uppercase mb-2 px-3">Admin Panel</div>
                          {adminFeatures.map((feature) => (
                            <Link
                              key={feature.name}
                              to={feature.path}
                              className="mobile-nav-link bg-gradient-to-r from-amber-50/50 to-yellow-50/50"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {feature.icon}
                              {feature.name}
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-3.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium mt-2"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Section */}
          <div className="mt-auto p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-t">
            <div className="text-center text-xs text-gray-600">
              <div className="font-bold mb-2">Secure Shopping</div>
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="flex flex-col items-center">
                  <FaShieldAlt className="text-green-600 text-lg mb-1" />
                  <span className="text-xs">100% Secure</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaCreditCard className="text-blue-600 text-lg mb-1" />
                  <span className="text-xs">Safe Payment</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaTruck className="text-amber-600 text-lg mb-1" />
                  <span className="text-xs">Free Shipping</span>
                </div>
              </div>
              <p className="text-[10px]">© 2025 AMMOGAM. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for dropdown items */}
      <style>{`
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          color: #4b5563;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.2s ease-in-out;
          text-decoration: none;
        }
        .dropdown-item:hover {
          background: linear-gradient(90deg, #fef3c7, #fde68a);
          color: #92400e;
          transform: translateX(4px);
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #4b5563;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.2s;
          text-decoration: none;
        }
        .mobile-nav-link:hover {
          background: linear-gradient(90deg, #fef3c7, #fde68a);
          color: #92400e;
        }
        
        /* Professional menu animations */
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
        
        .mega-menu {
          animation: fadeIn 0.3s ease-out;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid #e5e7eb;
        }
        
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        
        /* Smooth hover transitions */
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
      `}</style>
    </>
  );
}