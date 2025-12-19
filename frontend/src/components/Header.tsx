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
  FaChevronRight, FaArrowRight, FaCheck, FaShippingFast,
  FaCamera, FaPaw, FaBaby, FaGlobeAsia, FaCloudSun,
  FaTools, FaPrint, FaImages
} from 'react-icons/fa';

// Placeholder images - using Unsplash URLs
const placeholderImages = {
  mobile: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  security: 'https://images.unsplash.com/photo-1585368955551-c04c20a96c4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  menfashion: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  womenfashion: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  wallets: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  jewelry: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  pet: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  baby: 'https://images.unsplash.com/photo-1533456061338-88b8f6c217cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  watches: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  srilankan: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  indian: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  climate: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  electrical: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  tshirts: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  kitchen: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  photo: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  print: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
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
  const [activeCategory, setActiveCategory] = useState<string>('Mobile accessories');
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

  // Updated categories with the provided list
  const categories = [
    { 
      name: 'Mobile accessories', 
      icon: <FaMobileAlt className="text-lg" />, 
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      image: placeholderImages.mobile,
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
      ],
      promoText: 'Up to 50% OFF on mobile accessories'
    },
    { 
      name: 'Security cameras', 
      icon: <FaCamera className="text-lg" />, 
      color: 'from-gray-500 to-gray-700',
      bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-700',
      image: placeholderImages.security,
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
        { name: 'Doorbell Camera', price: '₹8,999', discount: '15% OFF', image: '🚪' }
      ],
      promoText: 'Free installation available'
    },
    { 
      name: 'Men fashion', 
      icon: <FaTshirt className="text-lg" />, 
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-100',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-700',
      image: placeholderImages.menfashion,
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
      ],
      promoText: 'New arrivals up to 60% OFF'
    },
    { 
      name: 'Women fashion', 
      icon: <FaTshirt className="text-lg" />, 
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-100',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-700',
      image: placeholderImages.womenfashion,
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
      ],
      promoText: 'Buy 1 Get 1 Free on selected items'
    },
    { 
      name: 'Wallets', 
      icon: <FaCreditCard className="text-lg" />, 
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-100',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      image: placeholderImages.wallets,
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
      ],
      promoText: 'Premium leather wallets starting ₹799'
    },
    { 
      name: 'Fashion jewelry', 
      icon: <FaCrown className="text-lg" />, 
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-violet-100',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      image: placeholderImages.jewelry,
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
      ],
      promoText: 'Exclusive jewelry collections'
    },
    { 
      name: 'Pet friendly products', 
      icon: <FaPaw className="text-lg" />, 
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-100',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      image: placeholderImages.pet,
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
      ],
      promoText: 'Everything your pet needs'
    },
    { 
      name: 'Baby fashion & toys', 
      icon: <FaBaby className="text-lg" />, 
      color: 'from-pink-400 to-rose-500',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-100',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-600',
      image: placeholderImages.baby,
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
      ],
      promoText: 'Quality products for your little ones'
    },
    { 
      name: 'Watches', 
      icon: <FaClock className="text-lg" />, 
      color: 'from-slate-600 to-gray-700',
      bgColor: 'bg-gradient-to-br from-slate-50 to-gray-100',
      borderColor: 'border-slate-200',
      textColor: 'text-slate-700',
      image: placeholderImages.watches,
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
      ],
      promoText: 'Timeless elegance for every wrist'
    },
    { 
      name: 'Srilankan products', 
      icon: <FaGlobeAsia className="text-lg" />, 
      color: 'from-red-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-orange-100',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      image: placeholderImages.srilankan,
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
      ],
      promoText: 'Authentic Sri Lankan products'
    },
    { 
      name: 'Indian products', 
      icon: <FaGlobeAsia className="text-lg" />, 
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-amber-100',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      image: placeholderImages.indian,
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
      ],
      promoText: 'Rich Indian heritage products'
    },
    { 
      name: 'Climate dress', 
      icon: <FaCloudSun className="text-lg" />, 
      color: 'from-sky-500 to-blue-500',
      bgColor: 'bg-gradient-to-br from-sky-50 to-blue-100',
      borderColor: 'border-sky-200',
      textColor: 'text-sky-700',
      image: placeholderImages.climate,
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
      ],
      promoText: 'Dress appropriately for every season'
    },
    { 
      name: 'Shoes', 
      icon: <FaShoppingBag className="text-lg" />, 
      color: 'from-brown-500 to-amber-700',
      bgColor: 'bg-gradient-to-br from-amber-50 to-brown-100',
      borderColor: 'border-amber-200',
      textColor: 'text-brown-700',
      image: placeholderImages.shoes,
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
      ],
      promoText: 'Step in style with premium footwear'
    },
    { 
      name: 'Electrical tool & hard ware', 
      icon: <FaTools className="text-lg" />, 
      color: 'from-gray-600 to-gray-800',
      bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-800',
      image: placeholderImages.electrical,
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
      ],
      promoText: 'Professional tools for every job'
    },
    { 
      name: 'Electronics products', 
      icon: <FaLaptop className="text-lg" />, 
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-blue-100 to-indigo-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      image: placeholderImages.electronics,
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
      ],
      promoText: 'Latest electronics at best prices'
    },
    { 
      name: 'T. Shirts', 
      icon: <FaTshirt className="text-lg" />, 
      color: 'from-teal-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-teal-50 to-green-100',
      borderColor: 'border-teal-200',
      textColor: 'text-teal-700',
      image: placeholderImages.tshirts,
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
      ],
      promoText: 'Comfort meets style in every tee'
    },
    { 
      name: 'Home kitchen products', 
      icon: <FaHome className="text-lg" />, 
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-100',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      image: placeholderImages.kitchen,
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
      ],
      promoText: 'Upgrade your kitchen essentials'
    },
    { 
      name: 'Photo editing', 
      icon: <FaImages className="text-lg" />, 
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-100',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      image: placeholderImages.photo,
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
      ],
      promoText: 'Professional photo editing services'
    },
    { 
      name: 'Print out services', 
      icon: <FaPrint className="text-lg" />, 
      color: 'from-gray-500 to-black',
      bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-800',
      image: placeholderImages.print,
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
      ],
      promoText: 'High quality printing services'
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
                    <div className="text-xs text-amber-600 font-medium">{categories.length} Categories</div>
                  </div>
                  
                  <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
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
                <div className="flex-1 p-8 bg-white max-h-[600px] overflow-y-auto">
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