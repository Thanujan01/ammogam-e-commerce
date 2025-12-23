import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { getImageUrl } from '../utils/imageUrl';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { WishlistContext } from '../contexts/WishlistContext';
import {
  FaStar, FaShoppingCart, FaHeart, FaEye, FaChevronRight,
  FaMobileAlt, FaCamera, FaDog, FaBaby,
  FaGem, FaGlobeAsia,   FaTools,
  FaLaptop, FaPrint,
  FaTag,
  FaRuler, FaCheckCircle,
  FaFire, FaCrown, FaCartPlus, FaTimes as FaClose,
  FaChevronRight as FaChevronRightIcon, FaCheck, FaTruck as FaShipping,
  FaShieldAlt, FaRedo, FaShareAlt, FaDownload, FaEnvelope, FaWallet,
  FaTshirt as FaTShirt, FaPalette as FaPaletteIcon, FaHome,
  FaImages, FaCreditCard, FaClock, FaCloudSun, 
  FaPaw, FaBaby as FaBabyIcon, FaShoppingBag
} from 'react-icons/fa';

const CategoryIcon = ({ name, className }: { name: string; className?: string }) => {
  const icons: any = {
    FaMobileAlt: FaMobileAlt,
    FaCamera: FaCamera,
    FaTshirt: FaTShirt,
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

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const cart = useContext(CartContext)!;
  const { user } = useContext(AuthContext)!;
  const { toggleWishlist: contextToggle, isInWishlist } = useContext(WishlistContext)!;
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);

        // Process categories
        const dbCategories = categoriesRes.data;
        const mergedCategories = dbCategories.map((dbCat: any) => ({
          ...dbCat,
          id: dbCat._id,
          name: dbCat.name,
          icon: <CategoryIcon name={dbCat.icon} />,
          iconName: dbCat.icon,
          image: dbCat.image || '',
          items: `${dbCat.subCategories?.length || 0} Items`,
          mainSubcategories: dbCat.mainSubcategories || [],
          color: dbCat.color || 'blue'
        }));
        setCategories(mergedCategories);

        // Process products
        const dbProducts = productsRes.data.map((p: any) => ({
          ...p,
          id: p._id,
          name: p.name,
          currentPrice: `$ ${(p.price || 0).toFixed(2)}`,
          originalPrice: (p.discount > 0 && p.price) ? `$ ${(p.price / (1 - p.discount / 100)).toFixed(2)}` : null,
          rating: p.rating || 0,
          sold: p.sold || 0,
          badge: p.badge,
          badgeIcon: p.badge === 'New' ? <FaGem className="text-white text-xs" /> : p.badge === 'Sale' ? <FaFire className="text-white text-xs" /> : p.badge === 'Bestseller' ? <FaCrown className="text-white text-xs" /> : null,
          tags: p.discount > 0 ? ['Choice', 'Sale'] : ['Choice'],
          category: p.category ? (typeof p.category === 'string' ? p.category : p.category.name) : 'Uncategorized',
          categoryId: p.category ? (typeof p.category === 'string' ? '' : p.category._id) : '',
          subCategory: p.subCategory || '',
          image: getImageUrl(p.image),
          discountPercent: p.discount,
          colorOptions: true,
          sizeOptions: true,
          promotions: [
            { text: p.discount > 0 ? `Save ${p.discount}%` : 'Free Shipping', icon: <FaTag className="text-green-500" /> },
          ],
          brand: p.brand,
          description: p.description,
          features: [
            'High quality material',
            'Durable and long lasting',
            'Warranty included'
          ],
          deliveryInfo: 'Free shipping on orders over $ 100',
          warranty: '1-year warranty',
          returnPolicy: '30-day return policy',
          certified: true,
          similarItems: []
        }));

        setProducts(dbProducts);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const addToCart = (product: any) => {
    cart.addToCart(product);
    setRecentlyAdded(product);
    setShowCartNotification(true);

    setTimeout(() => {
      setShowCartNotification(false);
    }, 3000);
  };

  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setShowProductModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    document.body.style.overflow = 'auto';
  };

  const handleToggleWishlist = async (productId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    await contextToggle(productId);
  };

  // Handle View All button click - Navigate to products page
  const handleViewAllProducts = () => {
    navigate('/products');
  };

  // Handle category click to navigate to products page
  const handleCategorySelect = (categoryId: string) => {
    navigate(`/products?category=${categoryId}`);
  };

  // Professional categories display component from ProductList.tsx
  const ProfessionalCategories = () => {
    const uniqueColors = [
      ['from-blue-50 to-cyan-50', 'border-blue-200', 'from-blue-600 to-cyan-600'],
      ['from-pink-50 to-rose-50', 'border-pink-200', 'from-pink-600 to-rose-600'],
      ['from-orange-50 to-amber-50', 'border-orange-200', 'from-orange-600 to-amber-600'],
      ['from-purple-50 to-violet-50', 'border-purple-200', 'from-purple-600 to-violet-600'],
      ['from-green-50 to-emerald-50', 'border-green-200', 'from-green-600 to-emerald-600'],
    ];

    const getCategoryColor = (index: number, isSelected: boolean) => {
      const colorIndex = index % uniqueColors.length;
      const [bgGradient, borderColor, iconGradient] = uniqueColors[colorIndex];

      return {
        bg: isSelected
          ? `bg-gradient-to-br ${bgGradient} border-2 ${borderColor.replace('200', '500')} shadow-lg`
          : `bg-gradient-to-br ${bgGradient}/80 border hover:${borderColor.replace('200', '300')} hover:shadow-md`,
        icon: isSelected
          ? `bg-gradient-to-br ${iconGradient} shadow-lg scale-110`
          : `bg-gradient-to-br ${iconGradient.replace('600', '500')}`
      };
    };

    return (
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {categories.length} Categories
          </span>
        </div>
        <div className="relative">
          <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide px-1">
            {categories.map((category: any, index: number) => {
              const colors = getCategoryColor(index, false);

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="group flex-shrink-0 w-40 transition-all duration-300 hover:transform hover:-translate-y-2"
                >
                  <div className={`flex flex-col items-center justify-center p-5 rounded-xl h-full w-full transition-all duration-300 ${colors.bg} hover:shadow-xl`}>
                    <div className={`relative w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${colors.icon}`}>
                      <div className="text-2xl text-white">
                        {category.icon}
                      </div>
                      <div className="absolute -top-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <FaChevronRight className="text-white text-xs" />
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-center mb-2 line-clamp-2 text-gray-800 group-hover:text-blue-900">
                      {category.name}
                    </h3>
                    <div className="text-xs px-3 py-1 rounded-full font-medium bg-gray-100 text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-800">
                      {category.items}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Get first 12 products for featured section
  const featuredProducts = products.slice(0, 12);

  // Filter featured products by category when category is selected
  const filteredFeaturedProducts = activeCategory === 'All'
    ? featuredProducts
    : featuredProducts.filter(product => product.category === activeCategory);

  // Categories from your WhatsApp image with item counts from your design
  const categoryFilters = [
    'All',
    'Mobile accessories',
    'Security cameras',
    'Men fashion',
    'Women fashion',
    'Wallets',
    'Fashion jewelry',
    'Pet friendly products',
    'Baby fashion & toys',
    'Watches',
    'Srilankan products',
    'Indian products',
    'Climate dress',
    'Shoes',
    'Electrical tool & hard ware',
    'Electronics products',
    'T. Shirts',
    'Home kitchen products',
    'Photo editing',
    'Print out services'
  ];

  return (
    <div className="min-h-screen w-screen bg-gray-50">
      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        /* Smooth scrolling */
        .scroll-smooth {
          scroll-behavior: smooth;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>

      {/* Cart Notification */}
      {showCartNotification && recentlyAdded && (
        <div className={`fixed ${isMobile ? 'top-20 left-4 right-4' : 'top-4 right-4'} z-50 animate-fade-in`}>
          <div className="bg-green-500 text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <FaCheckCircle className="text-lg sm:text-xl" />
            <div className="flex-1">
              <p className="font-semibold text-sm sm:text-base">Added to Cart!</p>
              <p className="text-xs sm:text-sm truncate">{recentlyAdded.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-75">
          <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-3 sm:p-6 border-b border-gray-200">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Product Details</h2>
                <p className="text-xs sm:text-sm text-gray-600">Explore product information and similar items</p>
              </div>
              <button
                onClick={closeProductModal}
                className="text-gray-500 hover:text-gray-700 p-1 sm:p-2 rounded-full hover:bg-gray-100"
              >
                <FaClose className="text-lg sm:text-xl" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-80px)]">
              <div className="p-3 sm:p-6">
                {/* Product Main Info */}
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 mb-6 sm:mb-8">
                  {/* Left Column - Product Image */}
                  <div className="lg:w-1/2">
                    <div className="relative bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-48 sm:h-72 md:h-96 object-cover"
                      />
                      {selectedProduct.badge && (
                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                          <div className="bg-amber-600 text-white text-xs sm:text-sm font-bold px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg flex items-center gap-1 sm:gap-2">
                            {selectedProduct.badgeIcon}
                            <span>{selectedProduct.badge}</span>
                          </div>
                        </div>
                      )}
                      {selectedProduct.discountPercent && (
                        <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                          <div className="bg-red-500 text-white text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded">
                            -{selectedProduct.discountPercent}% OFF
                          </div>
                        </div>
                      )}
                      {/* See Preview Button */}
                      <button className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white text-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-gray-50 shadow-md flex items-center gap-1 sm:gap-2 text-sm">
                        <FaEye className="text-gray-600" />
                        See preview
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={() => {
                          addToCart(selectedProduct);
                          closeProductModal();
                        }}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                      >
                        <FaShoppingCart />
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => handleToggleWishlist(selectedProduct.id)}
                        className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <FaHeart className={`text-gray-600 text-sm sm:text-base ${isInWishlist(selectedProduct.id) ? 'text-red-500' : ''}`} />
                      </button>
                      <button className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <FaShareAlt className="text-gray-600 text-sm sm:text-base" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column - Product Details */}
                  <div className="lg:w-1/2">
                    {/* Category Tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                      {selectedProduct.tags?.map((tag: string, index: number) => (
                        <span key={index} className="bg-amber-100 text-amber-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                          {tag}
                        </span>
                      ))}
                      {selectedProduct.certified && (
                        <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1">
                          <FaCheck className="text-xs" />
                          {selectedProduct.certificationBadge || 'Certified'}
                        </span>
                      )}
                    </div>

                    {/* Product Name */}
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {selectedProduct.name}
                    </h1>

                    {/* Price Section */}
                    <div className="mb-4 sm:mb-6">
                      <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                        <span className="text-xl sm:text-3xl font-bold text-gray-900">
                          {selectedProduct.currentPrice}
                        </span>
                        {selectedProduct.originalPrice && (
                          <span className="text-sm sm:text-lg text-gray-500 line-through">
                            {selectedProduct.originalPrice}
                          </span>
                        )}
                        {selectedProduct.discountPercent && (
                          <span className="text-xs sm:text-sm font-bold text-red-500">
                            Save {selectedProduct.discountPercent}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Rating and Sold */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`text-sm sm:text-lg ${i < Math.floor(selectedProduct.rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          {selectedProduct.rating}
                        </span>
                      </div>
                      <div className="text-gray-600 text-sm">
                        | {selectedProduct.sold.toLocaleString()}+ sold
                      </div>
                    </div>

                    {/* Promotions */}
                    {selectedProduct.promotions && selectedProduct.promotions.length > 0 && (
                      <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-3">
                        {selectedProduct.promotions.map((promo: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 sm:gap-3 bg-gray-50 p-2 sm:p-3 rounded-lg">
                            <div className="text-base sm:text-lg">
                              {promo.icon}
                            </div>
                            <span className="text-gray-700 font-medium text-xs sm:text-sm">
                              {promo.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bundle Deals */}
                    <div className="mb-4 sm:mb-6">
                      <button className="text-amber-700 hover:text-amber-800 font-semibold text-base sm:text-lg flex items-center gap-1 sm:gap-2">
                        Bundle deals <FaChevronRightIcon className="text-xs sm:text-sm" />
                      </button>
                    </div>

                    {/* Product Features */}
                    {selectedProduct.features && (
                      <div className="mb-4 sm:mb-6">
                        <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Features:</h3>
                        <ul className="space-y-1 sm:space-y-2">
                          {selectedProduct.features.map((feature: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700 text-xs sm:text-sm">
                              <FaCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <FaShipping className="text-gray-500 text-sm sm:text-base" />
                        <span className="text-xs sm:text-sm text-gray-700">{selectedProduct.deliveryInfo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaShieldAlt className="text-gray-500 text-sm sm:text-base" />
                        <span className="text-xs sm:text-sm text-gray-700">{selectedProduct.warranty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaRedo className="text-gray-500 text-sm sm:text-base" />
                        <span className="text-xs sm:text-sm text-gray-700">{selectedProduct.returnPolicy}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Similar Items Section */}
                {selectedProduct.similarItems && selectedProduct.similarItems.length > 0 && (
                  <div className="border-t border-gray-200 pt-4 sm:pt-8">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Similar items</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
                      {selectedProduct.similarItems.map((item: any) => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-2 sm:p-3 hover:shadow-md transition-shadow">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-20 sm:h-32 object-cover rounded-lg mb-2 sm:mb-3"
                          />
                          <div className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 mb-1 sm:mb-2">
                            {item.name}
                          </div>
                          <div className="text-sm sm:text-base font-bold text-amber-700 mb-1 sm:mb-2">
                            {item.price}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <FaStar className="text-yellow-400 text-xs" />
                              {item.rating}
                            </div>
                            <span>{item.sold} sold</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
                  <button className="text-gray-700 hover:text-gray-900 font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
                    <FaDownload className="text-xs sm:text-sm" />
                    Downloads
                  </button>
                  <button className="text-gray-700 hover:text-gray-900 font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
                    <FaEnvelope className="text-xs sm:text-sm" />
                    Email
                  </button>
                  <button className="text-gray-700 hover:text-gray-900 font-medium text-xs sm:text-sm whitespace-nowrap">
                    Select
                  </button>
                </div>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    onClick={closeProductModal}
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      closeProductModal();
                    }}
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#6B3510] text-sm sm:text-base"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Icon */}
      <div className={`fixed ${isMobile ? 'bottom-6 right-6' : 'bottom-8 right-8'} z-40`}>
        <div className="relative">
          <div className="bg-amber-600 text-white p-3 sm:p-4 rounded-full shadow-2xl cursor-pointer hover:bg-amber-700 transition-colors" onClick={() => navigate('/cart')}>
            <FaShoppingCart className="text-xl sm:text-2xl" />
          </div>
          {cart.items.length > 0 && (
            <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
              {cart.items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        {/* Header Section */}
       

        {/* Professional Categories Section - SAME AS PRODUCTLIST */}
        <ProfessionalCategories />

        {/* Hero Banner */}
        <div className="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl">
          <div className="relative h-64 sm:h-80 md:h-96 bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4 sm:px-8 md:px-12 max-w-3xl mx-auto">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm sm:text-base font-medium mb-3 sm:mb-4">
                  Limited Time Offer
                </span>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4">
                  Summer Sale
                </h1>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
                  Up to 70% Off
                </h2>
                <p className="text-white/90 text-base sm:text-xl mb-5 sm:mb-6 max-w-2xl mx-auto">
                  Discover amazing deals on electronics, fashion, and more
                </p>
                <button 
                  onClick={handleViewAllProducts}
                  className="bg-white text-amber-700 px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-base sm:text-lg"
                >
                  Shop Now
                </button>
              </div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-l from-amber-700/30 to-transparent z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=800"
                alt="Summer Sale"
                className="w-full h-full object-cover opacity-70"
              />
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-600 text-sm mt-1">
                Showing {filteredFeaturedProducts.length} of {products.length}+ premium products
              </p>
            </div>
            <button 
              onClick={handleViewAllProducts}
              className="text-amber-700 hover:text-amber-800 font-medium flex items-center text-sm sm:text-base"
            >
              View all <FaChevronRight className="ml-1" />
            </button>
          </div>

          {/* Category Filter - Horizontal scrolling with hidden scrollbar */}
          <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 sm:pb-3 px-1 justify-center sm:justify-start scrollbar-hide">
            {categoryFilters.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full whitespace-nowrap transition-all duration-300 text-xs sm:text-sm ${activeCategory === category
                  ? 'bg-[#8B4513] text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-amber-300'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20 sm:py-40">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <>
              {/* Products Grid - Only shows first 12 products */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 mb-8 sm:mb-12">
                {filteredFeaturedProducts.map((product) => (
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
                        onClick={(e) => { e.stopPropagation(); handleToggleWishlist(product.id); }}
                        className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-md transition-all duration-300 group-hover:scale-110"
                        title="Add to wishlist"
                      >
                        <FaHeart className={`text-sm sm:text-base ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
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
                            <FaPaletteIcon className="text-xs text-gray-500" />
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

              {/* View All Products CTA */}
              <div className="text-center mb-8 sm:mb-12">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                  <div className="max-w-2xl mx-auto">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                      Want to see more products?
                    </h3>
                    
                    <button 
                      onClick={handleViewAllProducts}
                      className="text-amber-700 hover:text-amber-800 font-medium flex items-center text-sm sm:text-base mx-auto"
                    >
                      See all products <FaChevronRight className="ml-1 sm:ml-2" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Promotional Banner */}
              <div className="mb-8 sm:mb-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl sm:rounded-2xl p-4 sm:p-8 md:p-12 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full -translate-y-16 sm:-translate-y-32 translate-x-16 sm:translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/10 rounded-full -translate-x-12 sm:-translate-x-24 translate-y-12 sm:translate-y-24"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-6 md:mb-0 md:max-w-lg text-center md:text-left">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Flash Sale Ends Soon!</h2>
                    <p className="text-sm sm:text-lg mb-4 sm:mb-6 text-white/90">Limited time offers on selected items. Don't miss out!</p>
                    <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 justify-center md:justify-start">
                      <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3">
                        <div className="text-lg sm:text-2xl font-bold">02</div>
                        <div className="text-xs sm:text-sm mt-1">Hours</div>
                      </div>
                      <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3">
                        <div className="text-lg sm:text-2xl font-bold">45</div>
                        <div className="text-xs sm:text-sm mt-1">Minutes</div>
                      </div>
                      <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3">
                        <div className="text-lg sm:text-2xl font-bold">18</div>
                        <div className="text-xs sm:text-sm mt-1">Seconds</div>
                      </div>
                    </div>
                    <div className="flex justify-center md:justify-start">
                      <button 
                        onClick={handleViewAllProducts}
                        className="bg-white text-amber-600 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg text-sm sm:text-base"
                      >
                        Shop Flash Sale
                      </button>
                    </div>
                  </div>
                  <div className="w-48 sm:w-64 md:w-80 mt-6 md:mt-0">
                    <img
                      src="https://images.unsplash.com/photo-1606788075767-20b25ec7eac5?w=400"
                      alt="Flash Sale"
                      className="w-full h-auto rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl"
                    />
                  </div>
                </div>
              </div>

              {/* Recently Viewed */}
              <div className="mb-8 sm:mb-12">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Recently Viewed</h2>
                    <p className="text-gray-600 text-sm mt-1">Based on your browsing history</p>
                  </div>
                  <button 
                    onClick={handleViewAllProducts}
                    className="text-amber-700 hover:text-amber-800 font-medium flex items-center text-sm sm:text-base"
                  >
                    See all <FaChevronRight className="ml-1" />
                  </button>
                </div>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {featuredProducts.slice(0, 6).map((product) => (
                    <div key={product.id} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-2 sm:p-4 hover:shadow-lg transition-shadow hover:border-amber-200">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-24 sm:h-32 object-cover rounded-lg mb-2 sm:mb-3 cursor-pointer"
                        onClick={() => openProductModal(product)}
                      />
                      <div
                        className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1.5 sm:mb-2 cursor-pointer hover:text-amber-700"
                        onClick={() => openProductModal(product)}
                      >
                        {product.name}
                      </div>
                      <div className="text-sm font-bold text-amber-700">{product.currentPrice}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}