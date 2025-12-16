import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import { 
  FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes, 
  FaSearch, FaTag, FaCrown, FaHome, FaShoppingBag,
  FaCaretDown, FaMobileAlt, FaPercent, FaBoxOpen, FaList,
  FaTruck, FaClock, FaChartLine,
  FaUsers, FaShieldAlt, FaCreditCard, FaFire,
  FaRegHeart, FaBell, FaMapMarkerAlt, FaPhone, FaAngleRight
} from 'react-icons/fa';
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
                className="h-14 w-auto object-contain transform group-hover:scale-155 transition-transform duration-300"
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
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-lg hover:opacity-90 transition-opacity text-sm xl:text-base"
              >
                <FaBars />
                <span className="font-semibold">All Categories</span>
                <FaCaretDown />
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

          {/* Categories Dropdown */}
          {showCategoryMenu && !isMobile && (
            <div className="absolute left-4 right-4 mt-2 bg-white rounded-xl shadow-2xl border z-50 hidden lg:block">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-6">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={`/category/${category.name.toLowerCase().replace(/ /g, '-')}`}
                    className="group p-4 rounded-lg hover:bg-amber-50 transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => setShowCategoryMenu(false)}
                  >
                    <div className={`w-10 h-10 xl:w-12 xl:h-12 rounded-lg flex items-center justify-center ${category.color} mb-3`}>
                      <span className="text-xl xl:text-2xl">{category.icon}</span>
                    </div>
                    <div className="font-semibold text-gray-800 group-hover:text-[#8B4513] text-sm xl:text-base">
                      {category.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Explore products →</div>
                  </Link>
                ))}
              </div>
              <div className="border-t p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-b-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-base xl:text-lg">Featured Collection</div>
                    <div className="text-xs xl:text-sm text-gray-600">Limited time offers</div>
                  </div>
                  <Link 
                    to="/featured" 
                    className="px-4 py-2 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-lg hover:opacity-90 text-sm"
                    onClick={() => setShowCategoryMenu(false)}
                  >
                    View All
                  </Link>
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
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color} mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                        <span className="text-xl">{category.icon}</span>
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
          transition: all 0.2s;
          text-decoration: none;
        }
        .dropdown-item:hover {
          background-color: #fef3c7;
          color: #92400e;
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
          background-color: #fef3c7;
          color: #92400e;
        }
      `}</style>
    </>
  );
}