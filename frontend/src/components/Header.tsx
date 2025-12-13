import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import { 
  FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes, 
  FaSearch, FaStore, FaTag, FaCrown, FaHome, FaShoppingBag,
  FaCaretDown, FaMobileAlt, FaPercent, FaBoxOpen, FaList,
  FaTruck, FaToolbox, FaEllipsisH, FaClock, FaChartLine,
  FaUsers, FaShieldAlt, FaCreditCard, FaStar, FaFire,
  FaRegHeart, FaBell, FaMapMarkerAlt, FaPhone
} from 'react-icons/fa';

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

  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/');
    setIsMenuOpen(false);
    setShowUserMenu(false);
  };

  const categories = [
    { name: 'Electronics', icon: '💻', color: 'bg-blue-100 text-blue-600' },
    { name: 'Fashion', icon: '👗', color: 'bg-pink-100 text-pink-600' },
    { name: 'Home & Kitchen', icon: '🏠', color: 'bg-orange-100 text-orange-600' },
    { name: 'Beauty & Health', icon: '💄', color: 'bg-purple-100 text-purple-600' },
    { name: 'Sports & Fitness', icon: '⚽', color: 'bg-green-100 text-green-600' },
    { name: 'Automotive', icon: '🚗', color: 'bg-red-100 text-red-600' },
    { name: 'Toys & Games', icon: '🎮', color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Books & Stationery', icon: '📚', color: 'bg-indigo-100 text-indigo-600' },
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

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-700 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-4 mb-2 sm:mb-0">
              <div className="flex items-center gap-2">
                <FaPhone className="text-xs" />
                <span>Support: +94 77 123 4567</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <FaMapMarkerAlt className="text-xs" />
                <span>Free Delivery Islandwide</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
                <FaClock className="text-xs animate-pulse" />
                <span className="font-bold">Flash Sale: {timeLeft}</span>
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <FaPercent className="text-xs" />
                <span>Use Code: <span className="font-bold">AMMO15</span> for 15% OFF</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white border-b'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <FaStore className="text-2xl text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
                  AMMOGAM
                </h1>
                <p className="text-xs text-gray-500">Premium E-Commerce</p>
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for products, brands, and categories..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500" />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              {/* Wishlist */}
              <Link 
                to="/wishlist" 
                className="hidden md:flex flex-col items-center p-2 hover:bg-amber-50 rounded-lg transition-colors group"
              >
                <div className="relative">
                  <FaRegHeart className="text-xl text-gray-600 group-hover:text-red-500" />
                </div>
                <span className="text-xs mt-1">Wishlist</span>
              </Link>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="relative flex flex-col items-center p-2 hover:bg-amber-50 rounded-lg transition-colors group"
              >
                <div className="relative">
                  <FaShoppingCart className="text-xl text-gray-600 group-hover:text-amber-600" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1">Cart</span>
              </Link>

              {/* User Profile */}
              {auth.user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-white">
                      {auth.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-semibold">{auth.user.name.split(' ')[0]}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        {auth.user.role === 'admin' ? (
                          <>
                            <FaCrown className="text-yellow-500" />
                            <span>Admin</span>
                          </>
                        ) : (
                          <>
                            <FaUser className="text-amber-500" />
                            <span>Customer</span>
                          </>
                        )}
                      </div>
                    </div>
                    <FaCaretDown className={`text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border z-50">
                      <div className="p-4 border-b bg-gradient-to-r from-amber-50 to-amber-100">
                        <div className="font-bold">{auth.user.name}</div>
                        <div className="text-sm text-gray-600">{auth.user.email}</div>
                        <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${auth.user.role === 'admin' ? 'bg-yellow-100 text-yellow-800' : 'bg-amber-100 text-amber-800'}`}>
                          {auth.user.role === 'admin' ? 'Administrator' : 'Premium Member'}
                        </div>
                      </div>
                      
                      <div className="p-2">
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
                          className="dropdown-item text-red-600 hover:bg-red-50 mt-2"
                        >
                          <FaSignOutAlt />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link 
                    to="/login" 
                    className="px-4 py-2 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-lg"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                className="lg:hidden p-2 rounded-lg hover:bg-amber-50 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between py-3 border-t">
            {/* Categories */}
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <FaBars />
                <span className="font-semibold">All Categories</span>
                <FaCaretDown />
              </button>
              
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center gap-2 text-gray-700 hover:text-amber-600 transition-colors font-medium"
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Promo Banner */}
            <div className="flex items-center gap-4">
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

          {/* Categories Dropdown */}
          {showCategoryMenu && (
            <div className="absolute left-4 right-4 mt-2 bg-white rounded-xl shadow-2xl border z-50">
              <div className="grid grid-cols-4 gap-6 p-6">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={`/category/${category.name.toLowerCase().replace(/ /g, '-')}`}
                    className="group p-4 rounded-lg hover:bg-amber-50 transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => setShowCategoryMenu(false)}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color} mb-3`}>
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <div className="font-semibold text-gray-800 group-hover:text-amber-700">
                      {category.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Explore products →</div>
                  </Link>
                ))}
              </div>
              <div className="border-t p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-b-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg">Featured Collection</div>
                    <div className="text-sm text-gray-600">Limited time offers</div>
                  </div>
                  <Link 
                    to="/featured" 
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg hover:opacity-90"
                    onClick={() => setShowCategoryMenu(false)}
                  >
                    View All
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden border-t bg-gray-50">
          <form onSubmit={handleSearch} className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500" />
            </div>
          </form>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}></div>
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
          {/* Mobile Menu Header */}
          <div className="p-6 bg-gradient-to-b from-amber-50 to-white border-b">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-amber-900">Menu</h2>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-amber-100 rounded-lg"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            {/* User Info */}
            {auth.user ? (
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-white font-bold">
                  {auth.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold">{auth.user.name}</div>
                  <div className="text-sm text-gray-600">{auth.user.email}</div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link 
                  to="/login" 
                  className="flex-1 text-center py-3 border border-amber-600 text-amber-600 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="flex-1 text-center py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="p-4">
            <div className="space-y-1">
              {quickLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              
              <Link 
                to="/cart" 
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaShoppingCart />
                Shopping Cart
                {cartItemCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {cartItemCount} items
                  </span>
                )}
              </Link>

              <Link 
                to="/download" 
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaMobileAlt />
                Download App
                <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">NEW</span>
              </Link>
            </div>

            {/* Categories Section */}
            <div className="mt-8">
              <div className="text-xs font-bold text-gray-500 uppercase mb-3">Shop Categories</div>
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 6).map((category) => (
                  <Link
                    key={category.name}
                    to={`/category/${category.name.toLowerCase().replace(/ /g, '-')}`}
                    className="p-3 border rounded-lg hover:bg-amber-50 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color} mx-auto mb-2`}>
                      <span className="text-xl">{category.icon}</span>
                    </div>
                    <div className="text-sm font-medium">{category.name}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* User Account Links */}
            {auth.user && (
              <div className="mt-8 pt-6 border-t">
                <div className="text-xs font-bold text-gray-500 uppercase mb-3">My Account</div>
                <div className="space-y-1">
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
                      <div className="my-2 border-t pt-3">
                        <div className="text-xs font-bold text-amber-700 uppercase mb-2">Admin Panel</div>
                        {adminFeatures.map((feature) => (
                          <Link
                            key={feature.name}
                            to={feature.path}
                            className="mobile-nav-link bg-gradient-to-r from-amber-50 to-yellow-50"
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
                    className="w-full mobile-nav-link text-red-600 hover:bg-red-50 mt-2"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Section */}
          <div className="mt-auto p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-t">
            <div className="text-center text-sm text-gray-600">
              <div className="font-bold mb-2">Secure Shopping</div>
              <div className="flex items-center justify-center gap-4">
                <FaShieldAlt className="text-green-600" />
                <FaCreditCard className="text-blue-600" />
                <FaTruck className="text-amber-600" />
              </div>
              <p className="mt-2">100% Secure Payment & Free Shipping</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}