import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../api/api';
import { 
  FaStar, FaShoppingCart, FaHeart, FaEye, FaChevronRight,
  FaMobileAlt, FaTshirt, FaHome, FaTruck, FaCreditCard, FaUndo, FaTag, FaHeadphones, FaGamepad,
  FaCamera, FaLaptop, FaBolt, FaPalette, FaRuler, FaGift, FaCheckCircle,
  FaFire, FaGem, FaCrown, FaBatteryFull, FaCartPlus, FaTimes as FaClose,
  FaChevronRight as FaChevronRightIcon, FaCheck, FaTruck as FaShipping,
  FaShieldAlt, FaRedo, FaShareAlt, FaDownload, FaEnvelope
} from 'react-icons/fa';

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  useContext(AuthContext);

  useEffect(() => {
    api.get('/orders/my').then(r => r.data).catch(console.error);
  }, []);

  const addToCart = (product: any) => {
    setCartItems(prev => [...prev, product]);
    setRecentlyAdded(product);
    setShowCartNotification(true);
    
    // Show notification for 3 seconds
    setTimeout(() => {
      setShowCartNotification(false);
    }, 3000);
  };

  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setShowProductModal(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockProducts = [
        {
          id: 101,
          name: 'Air Pro 5 TWS Bluetooth Earphone',
          currentPrice: 'LKR861.88',
          originalPrice: 'LKR2,311.08',
          rating: 4.9,
          sold: 10000,
          badge: 'New',
          badgeIcon: <FaGem className="text-white text-xs" />,
          tags: ['Choice', 'Sale'],
          category: 'Electronics',
          subCategory: 'Audio',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
          discountPercent: 75,
          colorOptions: true,
          sizeOptions: true,
          promotions: [
            { text: 'Save LKR1,449.20', icon: <FaTag className="text-green-500" /> },
            { text: 'Bundle deals available', icon: <FaGift className="text-amber-600" /> }
          ],
          brand: 'X5Mini',
          description: 'High-quality TWS Bluetooth earphones with noise cancellation and long battery life.',
          features: [
            'Wireless Bluetooth 5.0',
            '24-hour battery life',
            'IPX5 Waterproof',
            'Noise cancellation',
            'Touch controls'
          ],
          deliveryInfo: 'Free shipping on orders over LKR5,000',
          warranty: '1-year warranty',
          returnPolicy: '30-day return policy',
          certified: true,
          certificationBadge: 'Certified Original',
          similarItems: [
            {
              id: 201,
              name: 'Bluetooth Earphone Pro',
              price: 'LKR699.99',
              image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
              rating: 4.7,
              sold: 5000
            },
            {
              id: 202,
              name: 'Wireless Earbuds Sport',
              price: 'LKR1,299.99',
              image: 'https://images.unsplash.com/photo-1585079542156-4ce2d6380d6e?w=400',
              rating: 4.5,
              sold: 3000
            },
            {
              id: 203,
              name: 'Noise Cancelling Headphones',
              price: 'LKR1,899.99',
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
              rating: 4.8,
              sold: 8000
            }
          ]
        },
        {
          id: 102,
          name: '0-4Y Elegant Baby Clothes Set',
          currentPrice: 'LKR519.21',
          originalPrice: 'LKR1,976.44',
          rating: 5.0,
          sold: 261,
          badge: 'Sale',
          badgeIcon: <FaFire className="text-white text-xs" />,
          tags: ['Choice'],
          category: 'Fashion',
          subCategory: 'Baby Clothes',
          image: 'https://images.unsplash.com/photo-1491926626787-62db157af940?w=400',
          discountPercent: 74,
          colorOptions: true,
          sizeOptions: true,
          promotions: [
            { text: 'LKR692.27 off on LKR5,199', icon: <FaTag className="text-amber-600" /> },
            { text: 'New shoppers save LKR1,457', icon: <FaGift className="text-green-500" /> }
          ],
          brand: 'Elegant Baby',
          description: 'Premium quality baby clothes set for ages 0-4 years, made with soft organic cotton.',
          features: [
            '100% Organic Cotton',
            'Hypoallergenic',
            'Easy to wash',
            'Soft and comfortable',
            'Multiple colors available'
          ],
          deliveryInfo: 'Free shipping available',
          warranty: 'No warranty',
          returnPolicy: '15-day return policy',
          certified: false,
          similarItems: [
            {
              id: 204,
              name: 'Baby Romper Set',
              price: 'LKR459.99',
              image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948d?w=400',
              rating: 4.8,
              sold: 1200
            },
            {
              id: 205,
              name: 'Kids Winter Set',
              price: 'LKR799.99',
              image: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=400',
              rating: 4.6,
              sold: 800
            }
          ]
        },
        {
          id: 103,
          name: 'Multifunctional Smart Watch',
          currentPrice: 'LKR342.67',
          originalPrice: 'LKR2,835.35',
          rating: 4.1,
          sold: 2000,
          badge: 'Trending',
          badgeIcon: <FaFire className="text-white text-xs" />,
          category: 'Electronics',
          subCategory: 'Wearables',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
          discountPercent: 88,
          colorOptions: true,
          sizeOptions: true,
          promotions: [
            { text: 'LKR692.27 off on LKR5,199', icon: <FaTag className="text-amber-600" /> },
            { text: 'New shoppers save LKR2,450', icon: <FaGift className="text-green-500" /> }
          ],
          brand: 'SMB',
          description: 'Smart watch with multiple functions including heart rate monitoring, GPS, and sleep tracking.',
          features: [
            'Heart rate monitor',
            'GPS tracking',
            'Sleep analysis',
            'Water resistant',
            '7-day battery life'
          ],
          deliveryInfo: 'Free shipping on orders over LKR3,000',
          warranty: '2-year warranty',
          returnPolicy: '30-day return policy',
          certified: true,
          certificationBadge: 'Quality Certified',
          similarItems: [
            {
              id: 206,
              name: 'Fitness Tracker Pro',
              price: 'LKR1,299.99',
              image: 'https://images.unsplash.com/photo-1579586337278-3fec9a8b3c4c?w=400',
              rating: 4.3,
              sold: 5000
            },
            {
              id: 207,
              name: 'Luxury Smart Watch',
              price: 'LKR4,999.99',
              image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400',
              rating: 4.7,
              sold: 1200
            }
          ]
        },
        {
          id: 104,
          name: '2025 E88 Pro Watch Edition',
          currentPrice: 'LKR6,242.32',
          originalPrice: 'LKR9,000.33',
          rating: 4.3,
          sold: 5000,
          badge: 'Premium',
          badgeIcon: <FaCrown className="text-white text-xs" />,
          category: 'Electronics',
          subCategory: 'Wearables',
          image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400',
          discountPercent: 31,
          colorOptions: true,
          sizeOptions: true,
          promotions: [
            { text: 'LKR692.27 off on LKR5,199', icon: <FaTag className="text-amber-600" /> },
            { text: 'New shoppers save LKR9,320', icon: <FaGift className="text-green-500" /> }
          ],
          brand: 'SMB',
          description: 'Premium smart watch with advanced features and luxury design.',
          features: [
            'Luxury design',
            'Advanced health tracking',
            'Wireless charging',
            'Premium materials',
            'Customizable watch faces'
          ],
          deliveryInfo: 'Express shipping available',
          warranty: '3-year warranty',
          returnPolicy: '60-day return policy',
          certified: true,
          certificationBadge: 'Premium Certified',
          similarItems: []
        },
        {
          id: 105,
          name: 'Smartwatch Men Sports Edition',
          currentPrice: 'LKR1,000.33',
          originalPrice: 'LKR3,000.33',
          rating: 3.6,
          sold: 50000,
          badge: 'Bestseller',
          badgeIcon: <FaCrown className="text-white text-xs" />,
          category: 'Electronics',
          subCategory: 'Wearables',
          image: 'https://images.unsplash.com/photo-1579586337278-3fec9a8b3c4c?w=400',
          discountPercent: 67,
          colorOptions: true,
          sizeOptions: true,
          promotions: [
            { text: 'Save LKR3,255.02', icon: <FaTag className="text-amber-600" /> }
          ],
          brand: 'SMB',
          description: 'Sports edition smartwatch designed for active lifestyles.',
          features: [
            'Sports tracking',
            'Water resistant (50m)',
            'Long battery life',
            'Multiple sports modes',
            'Durable design'
          ],
          deliveryInfo: 'Free standard shipping',
          warranty: '1-year warranty',
          returnPolicy: '30-day return policy',
          certified: true,
          certificationBadge: 'Sports Certified',
          similarItems: []
        },
        {
          id: 106,
          name: 'Bluetooth Game Earpods Pro',
          currentPrice: 'LKR342.67',
          originalPrice: 'LKR2,100.98',
          rating: 4.6,
          sold: 800,
          badge: 'High Power',
          badgeIcon: <FaBatteryFull className="text-white text-xs" />,
          category: 'Electronics',
          subCategory: 'Gaming',
          image: 'https://images.unsplash.com/photo-1585079542156-4ce2d6380d6e?w=400',
          discountPercent: 84,
          colorOptions: true,
          sizeOptions: false,
          promotions: [
            { text: 'LKR692.27 off on LKR5,199', icon: <FaTag className="text-amber-600" /> },
            { text: 'New shoppers save LKR1,750', icon: <FaGift className="text-green-500" /> }
          ],
          brand: 'SMB',
          description: 'Professional gaming earpods with superior sound quality.',
          features: [
            'Surround sound',
            'Noise cancellation',
            'Low latency',
            'Comfortable fit',
            'Built-in mic'
          ],
          deliveryInfo: 'Free shipping on orders over LKR2,000',
          warranty: '1-year warranty',
          returnPolicy: '30-day return policy',
          certified: true,
          certificationBadge: 'Gaming Certified',
          similarItems: []
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
  const categories = ['All', 'Electronics', 'Fashion', 'Accessories', 'Home', 'Gaming'];

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

  return (
    <div className="min-h-screen bg-gray-50 w-screen">
      {/* Cart Notification */}
      {showCartNotification && recentlyAdded && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <FaCheckCircle className="text-xl" />
            <div>
              <p className="font-semibold">Added to Cart!</p>
              <p className="text-sm">{recentlyAdded.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
                <p className="text-sm text-gray-600">Explore product information and similar items</p>
              </div>
              <button
                onClick={closeProductModal}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
              >
                <FaClose className="text-xl" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-6">
                {/* Product Main Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Left Column - Product Image */}
                  <div>
                    <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-4">
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name}
                        className="w-full h-96 object-cover"
                      />
                      {selectedProduct.badge && (
                        <div className="absolute top-4 left-4">
                          <div className="bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                            {selectedProduct.badgeIcon}
                            <span>{selectedProduct.badge}</span>
                          </div>
                        </div>
                      )}
                      {selectedProduct.discountPercent && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded">
                            -{selectedProduct.discountPercent}% OFF
                          </div>
                        </div>
                      )}
                      {/* See Preview Button */}
                      <button className="absolute bottom-4 left-4 bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 shadow-md flex items-center gap-2">
                        <FaEye className="text-gray-600" />
                        See preview
                      </button>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          addToCart(selectedProduct);
                          closeProductModal();
                        }}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                      >
                        <FaShoppingCart />
                        Add to Cart
                      </button>
                      <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <FaHeart className="text-gray-600" />
                      </button>
                      <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <FaShareAlt className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column - Product Details */}
                  <div>
                    {/* Category Tags */}
                    <div className="flex items-center gap-2 mb-4">
                      {selectedProduct.tags?.map((tag: string, index: number) => (
                        <span key={index} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                          {tag}
                        </span>
                      ))}
                      {selectedProduct.certified && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <FaCheck className="text-xs" />
                          {selectedProduct.certificationBadge || 'Certified'}
                        </span>
                      )}
                    </div>

                    {/* Product Name */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                      {selectedProduct.name}
                    </h1>

                    {/* Price Section */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-gray-900">
                          {selectedProduct.currentPrice}
                        </span>
                        {selectedProduct.originalPrice && (
                          <span className="text-lg text-gray-500 line-through">
                            {selectedProduct.originalPrice}
                          </span>
                        )}
                        {selectedProduct.discountPercent && (
                          <span className="text-sm font-bold text-red-500">
                            Save {selectedProduct.discountPercent}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Rating and Sold */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i}
                              className={`text-lg ${
                                i < Math.floor(selectedProduct.rating) 
                                  ? 'text-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium text-gray-900">
                          {selectedProduct.rating}
                        </span>
                      </div>
                      <div className="text-gray-600">
                        | {selectedProduct.sold.toLocaleString()}+ sold
                      </div>
                    </div>

                    {/* Promotions */}
                    {selectedProduct.promotions && selectedProduct.promotions.length > 0 && (
                      <div className="mb-6 space-y-3">
                        {selectedProduct.promotions.map((promo: any, index: number) => (
                          <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                            <div className="text-lg">
                              {promo.icon}
                            </div>
                            <span className="text-gray-700 font-medium">
                              {promo.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bundle Deals */}
                    <div className="mb-6">
                      <button className="text-amber-700 hover:text-amber-800 font-semibold text-lg flex items-center gap-2">
                        Bundle deals <FaChevronRightIcon className="text-sm" />
                      </button>
                    </div>

                    {/* Product Features */}
                    {selectedProduct.features && (
                      <div className="mb-6">
                        <h3 className="font-bold text-gray-900 mb-3">Features:</h3>
                        <ul className="space-y-2">
                          {selectedProduct.features.map((feature: string, index: number) => (
                            <li key={index} className="flex items-center gap-2 text-gray-700">
                              <FaCheck className="text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <FaShipping className="text-gray-500" />
                        <span className="text-sm text-gray-700">{selectedProduct.deliveryInfo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaShieldAlt className="text-gray-500" />
                        <span className="text-sm text-gray-700">{selectedProduct.warranty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaRedo className="text-gray-500" />
                        <span className="text-sm text-gray-700">{selectedProduct.returnPolicy}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Similar Items Section */}
                {selectedProduct.similarItems && selectedProduct.similarItems.length > 0 && (
                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Similar items</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {selectedProduct.similarItems.map((item: any) => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <div className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                            {item.name}
                          </div>
                          <div className="text-base font-bold text-amber-700 mb-2">
                            {item.price}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <FaStar className="text-yellow-400" />
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
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button className="text-gray-700 hover:text-gray-900 font-medium flex items-center gap-2">
                    <FaDownload />
                    Downloads
                  </button>
                  <button className="text-gray-700 hover:text-gray-900 font-medium flex items-center gap-2">
                    <FaEnvelope />
                    Email
                  </button>
                  <button className="text-gray-700 hover:text-gray-900 font-medium">
                    Select
                  </button>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={closeProductModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct);
                      closeProductModal();
                    }}
                    className="px-6 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#6B3510]"
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
      <div className="fixed bottom-8 right-8 z-40">
        <div className="relative">
          <div className="bg-amber-600 text-white p-4 rounded-full shadow-2xl cursor-pointer hover:bg-amber-700 transition-colors">
            <FaShoppingCart className="text-2xl" />
          </div>
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </div>
      </div>

      {/* Main Content - UPDATED TO MATCH HEADER WIDTH */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
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
              {/* Products Grid - 6 products per row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mb-12">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group relative"
                  >
                    {/* Quick Add Icon - Cart with Plus */}
                    <button 
                      onClick={() => addToCart(product)}
                      className="absolute top-3 right-3 z-20 bg-white/90 hover:bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-110"
                      title="Add to cart"
                    >
                      <FaCartPlus className="text-amber-600 text-lg" />
                    </button>

                    {/* Product Image - Clickable */}
                    <div 
                      className="relative h-40 overflow-hidden bg-gray-100 cursor-pointer"
                      onClick={() => openProductModal(product)}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Brand Badge */}
                      {product.badge && (
                        <div className="absolute top-2 left-2">
                          <div className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                            {product.badgeIcon}
                            <span>{product.badge}</span>
                          </div>
                        </div>
                      )}

                      {/* Discount Badge */}
                      {product.discountPercent && (
                        <div className="absolute top-2 left-2 mt-8">
                          <div className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                            -{product.discountPercent}%
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-3">
                      {/* Product Name - Clickable */}
                      <h3 
                        className="font-semibold text-gray-900 line-clamp-2 mb-2 text-xs h-8 cursor-pointer hover:text-amber-700"
                        onClick={() => openProductModal(product)}
                      >
                        {product.name}
                      </h3>

                      {/* Color and Size Options */}
                      <div className="flex items-center gap-3 mb-2">
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
                      <div className="mb-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-bold text-gray-900">
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
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i}
                              className={`text-xs ${
                                i < Math.floor(product.rating) 
                                  ? 'text-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          {product.rating} | {product.sold.toLocaleString()}+
                        </span>
                      </div>

                      {/* Promotions with Icons */}
                      {product.promotions && product.promotions.length > 0 && (
                        <div className="mb-3 space-y-1">
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
                          className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                        >
                          <FaCartPlus className="text-xs" />
                          Add
                        </button>
                      </div>
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
                        className="w-full h-32 object-cover rounded-lg mb-3 cursor-pointer"
                        onClick={() => openProductModal(product)}
                      />
                      <div 
                        className="text-xs font-semibold text-gray-900 line-clamp-2 mb-2 cursor-pointer hover:text-amber-700"
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