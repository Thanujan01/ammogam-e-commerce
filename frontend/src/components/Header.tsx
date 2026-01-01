import { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import { WishlistContext } from '../contexts/WishlistContext';
import {
  FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes,
  FaSearch, FaCrown, FaHome, FaShoppingBag,
  FaCaretDown, FaMobileAlt, FaBoxOpen,
  FaTruck, FaClock, FaChartLine, FaLaptop, FaTshirt,
  FaUsers, FaShieldAlt, FaCreditCard, FaFire,
  FaRegHeart, FaHeart, FaBell, FaAngleRight,
  FaChevronRight, FaArrowRight,
  FaCamera, FaPaw, FaBaby, FaGlobeAsia, FaCloudSun,
  FaTools, FaPrint, FaImages, FaDog, FaBaby as FaBabyIcon, FaWallet
} from 'react-icons/fa';
import { api } from '../api/api';

// Helper to render icon from string name
const CategoryIcon = ({ name, className }: { name: string; className?: string }) => {
  const icons: any = {
    FaMobileAlt: FaMobileAlt,
    FaCamera: FaCamera,
    FaTshirt: FaTshirt,
    FaCrown: FaCrown,
    FaCreditCard: FaCreditCard,
    FaPaw: FaPaw,
    FaBaby: FaBaby,
    FaClock: FaClock,
    FaGlobeAsia: FaGlobeAsia,
    FaCloudSun: FaCloudSun,
    FaTools: FaTools,
    FaLaptop: FaLaptop,
    FaHome: FaHome,
    FaImages: FaImages,
    FaPrint: FaPrint,
    FaDog: FaDog,
    FaBabyIcon: FaBabyIcon,
    FaWallet: FaWallet,
    FaShoppingBag: FaShoppingBag
  };
  const IconComponent = icons[name] || FaShoppingBag;
  return <IconComponent className={className} />;
};

import logoImage from '../assets/logo.jpeg';

export default function Header() {
  const auth = useContext(AuthContext)!;
  const cart = useContext(CartContext)!;
  const { wishlistCount } = useContext(WishlistContext)!;
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  // Check if current path is active
  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

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
      // Check both desktop and mobile search refs
      const isOutsideDesktopSearch = searchRef.current && !searchRef.current.contains(event.target as Node);
      const isOutsideMobileSearch = mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node);
      
      if (isOutsideDesktopSearch && isOutsideMobileSearch) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // State for dynamic categories from DB
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotificationsCount = async () => {
      if (!auth.user) return;
      try {
        const { data } = await api.get('/notifications');
        const unread = data.filter((n: any) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Failed to fetch notifications count", error);
      }
    };
    fetchNotificationsCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotificationsCount, 30000);
    return () => clearInterval(interval);
  }, [auth.user]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        const transformedCategories = data.map((cat: any) => ({
          ...cat,
          id: cat._id,
          name: cat.name,
          slug: cat.name.toLowerCase().replace(/ /g, '-'),
          icon: cat.icon,
          iconName: cat.icon,
          image: cat.image || '',
          items: `${cat.subCategories?.length || 0} Items`,
          mainSubcategories: cat.mainSubcategories || [],
          color: cat.color || 'blue',
          bgColor: `bg-gradient-to-br ${cat.color}`,
          textColor: 'text-white'
        }));
        setCategories(transformedCategories);

        // Set active category based on URL params or first category
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
          const category = transformedCategories.find((cat: any) => cat.id === categoryParam);
          if (category) {
            setActiveCategory(category.name);
          }
        } else if (transformedCategories.length > 0) {
          setActiveCategory(transformedCategories[0].name);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, [searchParams]);

  // Fetch products for search
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  // Search suggestions logic
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const suggestions: any[] = [];

    // Search in categories
    categories.forEach(category => {
      if (category.name.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'category',
          id: category.id,
          name: category.name,
          displayName: `${category.name} (Category)`,
          icon: category.icon,
          color: category.color
        });
      }

      // Search in subcategories
      if (category.mainSubcategories) {
        category.mainSubcategories.forEach((subcategoryGroup: any) => {
          subcategoryGroup.items.forEach((subcategory: string) => {
            if (subcategory.toLowerCase().includes(query)) {
              suggestions.push({
                type: 'subcategory',
                id: category.id,
                name: subcategory,
                displayName: `${subcategory} (${category.name})`,
                categoryName: category.name,
                icon: category.icon,
                color: category.color
              });
            }
          });
        });
      }
    });

    // Search in products
    products.forEach(product => {
      if (product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'product',
          id: product._id,
          name: product.name,
          displayName: `${product.name} (Product)`,
          price: product.price,
          image: product.images?.[0],
          categoryId: product.category?._id
        });
      }
    });

    // Limit suggestions to 10
    setSearchSuggestions(suggestions.slice(0, 10));
    setShowSuggestions(suggestions.length > 0);
  }, [searchQuery, categories, products]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Scroll to top before navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
      setSearchActive(false);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (suggestion.type === 'category') {
      navigate(`/products?category=${suggestion.id}`);
    } else if (suggestion.type === 'subcategory') {
      navigate(`/products?category=${suggestion.id}&subcategory=${encodeURIComponent(suggestion.name)}`);
    } else if (suggestion.type === 'product') {
      navigate(`/products/${suggestion.id}`);
    }
    
    // Clean up UI states
    setSearchQuery('');
    setShowSuggestions(false);
    setIsMenuOpen(false);
    setSearchActive(false);
    setShowCategoryMenu(false);
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/');
    setIsMenuOpen(false);
    setShowUserMenu(false);
  };

  // ========== ROUTING FUNCTIONS ==========

  // 1. Main Category Click - Goes to products page with category parameter
  const handleMainCategoryClick = (category: any) => {
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/products?category=${category.id}`);
    
    // Clean up all UI states
    setShowCategoryMenu(false);
    setIsMenuOpen(false);
    setSearchActive(false);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  // 2. Subcategory Click - Goes to products page with BOTH category and subcategory parameters
  const handleSubcategoryClick = (category: any, subcategory: string) => {
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/products?category=${category.id}&subcategory=${encodeURIComponent(subcategory)}`);
    
    // Clean up all UI states
    setShowCategoryMenu(false);
    setIsMenuOpen(false);
    setSearchActive(false);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  // 3. View All Category - Goes to products page with category parameter
  const handleViewAllCategory = (category: any) => {
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/products?category=${category.id}`);
    
    // Clean up all UI states
    setShowCategoryMenu(false);
    setIsMenuOpen(false);
    setSearchActive(false);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  // 4. Quick links navigation function
  const handleQuickLinkClick = () => {
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
    setSearchActive(false);
    setShowCategoryMenu(false);
    setShowSuggestions(false);
  };

  const quickLinks = [
    { name: 'Home', path: '/', icon: <FaHome className="text-lg" /> },
    { name: 'Products', path: '/products', icon: <FaShoppingBag className="text-lg" /> },
    { name: 'Wishlist', path: '/wishlist', icon: <FaHeart className="text-lg text-red-500" /> },
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
    <div ref={mobileSearchRef} className="lg:hidden w-full bg-white px-4 py-3 border-b">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(searchQuery.trim().length > 0)}
            autoFocus // This ensures keyboard opens immediately on mobile
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 text-sm" />

          {/* Mobile Search Suggestions */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-lg border max-h-64 overflow-y-auto z-50">
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.id}-${index}`}
                  type='button' // FIXED: Add type="button" to prevent form submission
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left p-3 hover:bg-amber-50 border-b last:border-b-0 flex items-center gap-3"
                >
                  {suggestion.type === 'category' && (
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${suggestion.color} flex items-center justify-center`}>
                      <CategoryIcon name={suggestion.icon} className="text-white text-sm" />
                    </div>
                  )}
                  {suggestion.type === 'subcategory' && (
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <FaChevronRight className="text-amber-600 text-xs" />
                    </div>
                  )}
                  {suggestion.type === 'product' && (
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <FaShoppingBag className="text-gray-600 text-sm" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{suggestion.displayName}</div>
                    {suggestion.type === 'product' && suggestion.price && (
                      <div className="text-sm text-amber-600 font-semibold">₹{suggestion.price}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setSearchActive(false);
            setShowSuggestions(false);
          }}
          className="px-3 py-2.5 text-gray-600 hover:text-gray-800"
        >
          <FaTimes className="text-lg" />
        </button>
      </form>
    </div>
  );

  return (
    <>
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

              <Link to="/" className="flex items-center gap-3 w-164" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <img
                  src={logoImage}
                  alt="AMMOGAM Logo"
                  className="h-10 w-164 object-contain"
                />
              </Link>
            </div>

            {/* Desktop Logo */}
            <Link to="/" className="hidden lg:flex items-center gap-4 group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img
                src={logoImage}
                alt="AMMOGAM Logo"
                className="h-14 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Desktop Search Bar with Suggestions */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-4 xl:mx-8" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for products, brands, and categories..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 text-sm xl:text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(searchQuery.trim().length > 0)}
                  />
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500" />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                  >
                    Search
                  </button>

                  {/* Desktop Search Suggestions */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border max-h-80 overflow-y-auto z-50">
                      <div className="p-3 border-b bg-gray-50">
                        <div className="text-sm font-semibold text-gray-700">
                          {searchSuggestions.length} results for "{searchQuery}"
                        </div>
                      </div>

                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={`${suggestion.type}-${suggestion.id}-${index}`}
                          type='button' // FIXED: Add type="button" to prevent form submission
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left p-3 hover:bg-amber-50 border-b last:border-b-0 flex items-center gap-3 group"
                        >
                          {suggestion.type === 'category' && (
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${suggestion.color} flex items-center justify-center flex-shrink-0`}>
                              <CategoryIcon name={suggestion.icon} className="text-white" />
                            </div>
                          )}
                          {suggestion.type === 'subcategory' && (
                            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                              <FaChevronRight className="text-amber-600" />
                            </div>
                          )}
                          {suggestion.type === 'product' && (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {suggestion.image ? (
                                <img
                                  src={suggestion.image}
                                  alt={suggestion.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <FaShoppingBag className="text-gray-600" />
                              )}
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 truncate">{suggestion.displayName}</div>
                            {suggestion.type === 'subcategory' && (
                              <div className="text-xs text-gray-500 truncate">in {suggestion.categoryName}</div>
                            )}
                            {suggestion.type === 'product' && suggestion.price && (
                              <div className="text-sm text-amber-600 font-semibold">₹{suggestion.price}</div>
                            )}
                          </div>

                          <div className={`text-xs px-2 py-1 rounded-full ${suggestion.type === 'category' ? 'bg-blue-100 text-blue-800' : suggestion.type === 'subcategory' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                            {suggestion.type}
                          </div>
                        </button>
                      ))}

                      <div className="p-3 border-t bg-gray-50">
                        <button
                          type="button"
                          onClick={handleSearch}
                          className="w-full text-center py-2 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-lg hover:opacity-90 text-sm font-medium"
                        >
                          View all results for "{searchQuery}"
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Search Button - Always show when not in search mode */}
              {!searchActive && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchActive(true);
                    // REMOVED: setSearchQuery(''); // Don't clear the search query when opening search
                    setShowSuggestions(false);
                  }}
                  className="lg:hidden p-2 hover:bg-amber-50 rounded-lg transition-colors"
                  aria-label="Search"
                >
                  <FaSearch className="text-lg text-gray-600" />
                </button>
              )}

              {/* Mobile Cart */}
              <Link
                to="/cart"
                className="lg:hidden relative p-2 hover:bg-amber-50 rounded-lg transition-colors"
                onClick={handleQuickLinkClick}
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
                  onClick={handleQuickLinkClick}
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
                onClick={handleQuickLinkClick}
              >
                <div className="relative">
                  <FaRegHeart className={`text-xl ${isActivePath('/wishlist') ? 'text-red-500' : 'text-gray-600'} group-hover:text-red-500`} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className={`text-xs mt-1 hidden lg:block ${isActivePath('/wishlist') ? 'text-red-500 font-semibold' : ''}`}>Wishlist</span>
              </Link>

              {/* Desktop Notifications Bell */}
              {auth.user && (
                <Link
                  to="/notifications"
                  className="hidden md:flex flex-col items-center p-2 hover:bg-amber-50 rounded-lg transition-colors group relative"
                  onClick={handleQuickLinkClick}
                >
                  <div className="relative">
                    <FaBell className="text-xl text-gray-600 group-hover:text-amber-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs mt-1 hidden lg:block">Alerts</span>
                </Link>
              )}

              {/* Desktop Cart */}
              <Link
                to="/cart"
                className="hidden md:flex flex-col items-center p-2 hover:bg-amber-50 rounded-lg transition-colors group relative"
                onClick={handleQuickLinkClick}
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
                          onClick={() => {
                            setShowUserMenu(false);
                            handleQuickLinkClick();
                          }}
                        >
                          <FaHome className="text-amber-500" />
                          My Dashboard
                        </Link>
                        <Link
                          to="/wishlist"
                          className="dropdown-item"
                          onClick={() => {
                            setShowUserMenu(false);
                            handleQuickLinkClick();
                          }}
                        >
                          <FaRegHeart className="text-amber-500" />
                          Wishlist
                          {wishlistCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">{wishlistCount}</span>
                          )}
                        </Link>
                        <Link
                          to="/notifications"
                          className="dropdown-item"
                          onClick={() => {
                            setShowUserMenu(false);
                            handleQuickLinkClick();
                          }}
                        >
                          <FaBell className="text-amber-500" />
                          Notifications
                          {unreadCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>
                          )}
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
                                  onClick={() => {
                                    setShowUserMenu(false);
                                    handleQuickLinkClick();
                                  }}
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
                    onClick={handleQuickLinkClick}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 xl:px-4 py-2 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-lg text-sm xl:text-base"
                    onClick={handleQuickLinkClick}
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Auth Buttons */}
              {!auth.user && (
                <div className="lg:hidden flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 border border-[#8B4513] text-[#8B4513] rounded-lg text-xs font-medium"
                    onClick={handleQuickLinkClick}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1.5 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-lg text-xs font-medium"
                    onClick={handleQuickLinkClick}
                  >
                    Register
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
                  className={`flex items-center gap-2 transition-colors font-medium text-sm xl:text-base relative pb-1 ${isActivePath(link.path) ? 'text-[#8B4513]' : 'text-gray-700 hover:text-[#8B4513]'}`}
                  onClick={handleQuickLinkClick}
                >
                  {link.icon}
                  {link.name}
                  {isActivePath(link.path) && (
                    <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8B4513] to-[#A0522D] rounded-full"></div>
                  )}
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
                <span className="text-sm font-semibold">Safe Delivery</span>
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
                    <div className="text-xs text-amber-600 font-medium">{categories.length} Categories</div>
                  </div>

                  <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group ${activeCategory === category.name ? 'bg-white shadow-lg border border-gray-200' : 'hover:bg-white hover:shadow-md'}`}
                        onMouseEnter={() => setActiveCategory(category.name)}
                        onClick={() => handleMainCategoryClick(category)}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-sm`}>
                          <CategoryIcon name={category.icon} />
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
                <div className="flex-1 p-8 bg-white max-h-[600px] overflow-y-auto">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{activeCategoryData?.name}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleViewAllCategory(activeCategoryData)}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-lg hover:opacity-90 font-medium text-sm flex items-center gap-2 shadow-lg"
                      >
                        View All
                        <FaArrowRight className="text-xs" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-8">
                    {/* Subcategories Section */}
                    <div className="col-span-8">
                      <div className="grid grid-cols-3 gap-6">
                        {activeCategoryData?.mainSubcategories.map((subcategory: any, index: number) => (
                          <div key={index} className="space-y-4">
                            <h4 className="font-bold text-gray-900 text-lg pb-2 border-b border-gray-200">
                              {subcategory.title}
                            </h4>
                            <ul className="space-y-2.5">
                              {subcategory.items.map((item: string, idx: number) => (
                                <li key={idx}>
                                  <button
                                    onClick={() => handleSubcategoryClick(activeCategoryData, item)}
                                    className="w-full text-left text-sm text-gray-700 hover:text-amber-700 hover:font-medium flex items-center justify-between group"
                                  >
                                    <span className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-amber-500"></span>
                                      {item}
                                    </span>
                                    <FaChevronRight className="text-[10px] text-gray-400 group-hover:text-amber-500" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category Image and Promotions */}
                    <div className="col-span-4 space-y-6">
                      {/* Main Category Image */}
                      {activeCategoryData?.image && (
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
                      )}
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
                {/* <img
                  src={logoImage}
                  alt="AMMOGAM Logo"
                  className="h-8 w-auto object-contain"
                /> */}
                {/* <span className="text-xl font-bold text-amber-900">AMMOGAM</span> */}
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-amber-100 rounded-lg"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Mobile Search in Menu */}
            {/* <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(searchQuery.trim().length > 0)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />

                
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-lg border max-h-64 overflow-y-auto z-50">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={`mobile-${suggestion.type}-${suggestion.id}-${index}`}
                        type='button'
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left p-3 hover:bg-amber-50 border-b last:border-b-0 flex items-center gap-3"
                      >
                        {suggestion.type === 'category' && (
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${suggestion.color} flex items-center justify-center`}>
                            <CategoryIcon name={suggestion.icon} className="text-white text-sm" />
                          </div>
                        )}
                        {suggestion.type === 'subcategory' && (
                          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                            <FaChevronRight className="text-amber-600 text-xs" />
                          </div>
                        )}
                        {suggestion.type === 'product' && (
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            <FaShoppingBag className="text-gray-600 text-sm" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 text-sm">{suggestion.displayName}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form> */}

            {/* User Info */}
            {auth.user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border hover:bg-amber-50 transition-colors"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
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
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center py-2.5 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-lg font-medium text-sm"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
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
                    className={`flex items-center gap-3 px-3 py-3.5 rounded-lg transition-colors text-sm font-medium ${isActivePath(link.path) ? 'bg-gradient-to-r from-amber-50 to-yellow-50 text-[#8B4513] border-l-4 border-[#8B4513]' : 'text-gray-700 hover:text-[#8B4513] hover:bg-amber-50'}`}
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setIsMenuOpen(false);
                    }}
                  >
                    <div className={`${isActivePath(link.path) ? 'text-[#8B4513]' : 'text-amber-500'}`}>{link.icon}</div>
                    {link.name}
                    {link.name === 'Wishlist' && wishlistCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{wishlistCount}</span>
                    )}
                    <FaAngleRight className="ml-auto text-gray-400" />
                  </Link>
                ))}

                {auth.user && (
                  <Link
                    to="/notifications"
                    className="flex items-center gap-3 px-3 py-3.5 text-gray-700 hover:text-[#8B4513] hover:bg-amber-50 rounded-lg transition-colors text-sm font-medium"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setIsMenuOpen(false);
                    }}
                  >
                    <FaBell className="text-amber-500" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>
                    )}
                  </Link>
                )}

                <Link
                  to="/cart"
                  className="flex items-center gap-3 px-3 py-3.5 text-gray-700 hover:text-[#8B4513] hover:bg-amber-50 rounded-lg transition-colors text-sm font-medium"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
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
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                >
                  <FaRegHeart className="text-amber-500" />
                  Wishlist
                </Link>
              </div>

              {/* Categories Section */}
              <div className="mt-6 pt-4 border-t">
                <div className="text-xs font-bold text-gray-500 uppercase mb-3 px-3">Shop Categories</div>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category: any) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        handleMainCategoryClick(category);
                      }}
                      className="p-3 border rounded-lg hover:bg-amber-50 transition-colors text-center group"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.bgColor} ${category.textColor} mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                        <CategoryIcon name={category.icon} />
                      </div>
                      <div className="text-xs font-medium">{category.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* User Account Links */}
              {auth.user && (
                <div className="mt-6 pt-4 border-t">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-3 px-3">My Account</div>
                  <div className="space-y-0">
                    <Link 
                      to="/dashboard" 
                      className="mobile-nav-link" 
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setIsMenuOpen(false);
                      }}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/wishlist" 
                      className="mobile-nav-link" 
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setIsMenuOpen(false);
                      }}
                    >
                      Wishlist
                    </Link>
                    <Link 
                      to="/notifications" 
                      className="mobile-nav-link" 
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setIsMenuOpen(false);
                      }}
                    >
                      Notifications
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>
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
                              onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                setIsMenuOpen(false);
                              }}
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