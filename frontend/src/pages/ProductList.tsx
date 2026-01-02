import { useEffect, useState, useContext, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { WishlistContext } from '../contexts/WishlistContext';
import { getImageUrl } from '../utils/imageUrl';

import {
  FaCrown, FaHome, FaShoppingBag,
  FaMobileAlt, FaLaptop, FaTshirt,
  FaFire, FaCamera, FaPaw, FaBaby,
  FaGlobeAsia, FaCloudSun, FaTools, FaPrint,
  FaImages, FaDog, FaBaby as FaBabyIcon, FaWallet,
  FaStar, FaCartPlus, FaGem, FaFilter, FaHeart,
  FaCreditCard, FaClock, FaChevronRight,
  FaBox, FaLayerGroup, FaChevronDown, FaChevronUp,
  FaAngleRight, FaAngleLeft,
} from 'react-icons/fa';

// Import the addToRecentlyViewed function from Home.tsx
import { addToRecentlyViewed } from './Home';

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

// Product Card Component - Mobile optimized
const ProductCard = ({ product, addToCart, openProductModal, toggleWishlist, isFav, showCategoryBadge = false }: any) => {
  const isOutOfStock = product.stock <= 0;
  
  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group relative">
      {/* Brand Badge - Mobile: smaller, Desktop: regular */}
      {product.badge && !showCategoryBadge && !isOutOfStock && (
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
          <div className="bg-amber-600 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg flex items-center gap-0.5 sm:gap-1">
            {product.badgeIcon && <span className="hidden sm:inline">{product.badgeIcon}</span>}
            <span>{product.badge}</span>
          </div>
        </div>
      )}

      {/* Quick Add Icon - Gray for out of stock, amber for in stock */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          addToCart(product);
        }}
        disabled={isOutOfStock}
        className={`absolute top-2 sm:top-3 right-2 sm:right-3 z-20 rounded-full p-1 sm:p-1.5 sm:p-2 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-110 ${isOutOfStock 
          ? 'bg-gray-200 cursor-not-allowed' 
          : 'bg-white/90 hover:bg-white'}`}
        title={isOutOfStock ? "Out of stock" : "Add to cart"}
      >
        <FaCartPlus className={`text-sm sm:text-base sm:text-lg ${isOutOfStock ? 'text-gray-400' : 'text-amber-600'}`} />
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

        {/* Discount Badge - Mobile: smaller - Only show if not out of stock */}
        {product.discountPercent && !isOutOfStock && (
          <div className={`absolute ${showCategoryBadge ? 'top-10' : 'top-2'} left-2 mt-6 sm:mt-8`}>
            <div className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1 sm:px-1.5 py-0.5 rounded">
              -{product.discountPercent}%
            </div>
          </div>
        )}

        {/* Wishlist Button - Gray for out of stock */}
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            if (!isOutOfStock) toggleWishlist(product.id); 
          }}
          disabled={isOutOfStock}
          className={`absolute top-2 sm:top-3 left-2 sm:left-3 z-10 w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md hover:shadow-md transition-all duration-300 group-hover:scale-110 ${isOutOfStock 
            ? 'bg-gray-200 cursor-not-allowed' 
            : 'bg-white/90 hover:bg-white'}`}
          title={isOutOfStock ? "Out of stock" : "Add to wishlist"}
        >
          <FaHeart className={`text-xs sm:text-base ${isOutOfStock 
            ? 'text-gray-400' 
            : isFav && isFav(product.id) 
              ? 'text-red-500' 
              : 'text-gray-400 hover:text-red-500'}`} 
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-2 sm:p-3">
        <h3
          className={`font-semibold line-clamp-2 mb-1.5 sm:mb-2 text-xs sm:text-sm h-8 sm:h-10 cursor-pointer ${isOutOfStock 
            ? 'text-gray-500' 
            : 'text-gray-900 hover:text-amber-700'}`}
          onClick={() => openProductModal(product)}
        >
          {product.name}
        </h3>

        <div className="mb-1.5 sm:mb-2">
          {/* Seller Name - Mobile: smaller icon */}
          <div className="text-[10px] sm:text-xs text-gray-500 mb-1 flex items-center gap-1">
            <FaHome className="text-gray-400 text-[10px] sm:text-xs" />
            <span className="truncate max-w-[120px] sm:max-w-[150px]">
              {product.seller?.businessName || "Ammogam Official"}
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span className={`text-sm sm:text-base font-bold ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}>
              {product.currentPrice}
            </span>
            {product.originalPrice && !isOutOfStock && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                {product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Rating - Only show if not out of stock */}
        {!isOutOfStock && (
          <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-[10px] sm:text-xs ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-gray-600">
              ({product.sold || 0} sold)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Product Grid Section
const ProductGridSection = ({ filteredProducts, addToCart, openProductModal, title = "Featured Products", description = "Discover our handpicked selection", toggleWishlist, isFav, categories, showCategoryBadge = false }: any) => {
  return (
    <div className="mb-8 sm:mb-12">
      {/* Products Grid Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600 text-xs sm:text-sm">{description}</p>
        </div>
      </div>

      {/* Products Grid - Mobile: 2 columns, Desktop: responsive */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mb-6 sm:mb-12">
        {filteredProducts.map((product: any) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
            openProductModal={openProductModal}
            toggleWishlist={toggleWishlist}
            isFav={isFav}
            categories={categories}
            showCategoryBadge={showCategoryBadge}
          />
        ))}
      </div>
    </div>
  );
};

// Related Products Section
const RelatedProductsSection = ({ products, categories, addToCart, openProductModal, toggleWishlist, isFav, onViewAll, showAllRelated }: any) => {
  if (!products || products.length === 0) return null;

  // Determine which products to display based on showAllRelated state
  const displayProducts = showAllRelated ? products : products.slice(0, 6);

  return (
    <div className="mb-8 sm:mb-12 related-products-section">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Related Products</h3>
          <p className="text-gray-600 text-xs sm:text-sm">You might also like these products</p>
        </div>
        {!showAllRelated && products.length > 6 && (
          <button
            onClick={onViewAll}
            className="text-[#e1630d] hover:text-[#c1550b] font-medium flex items-center text-xs sm:text-sm bg-orange-50 hover:bg-orange-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-300"
          >
            <span className="hidden sm:inline">View all</span>
            <span className="sm:hidden">All</span>
            ({products.length}) <FaChevronRight className="ml-1 text-xs" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {displayProducts.map((product: any) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
            openProductModal={openProductModal}
            toggleWishlist={toggleWishlist}
            isFav={isFav}
            categories={categories}
            showCategoryBadge={true}
          />
        ))}
      </div>

      {/* Show "Show Less" button when all related products are displayed */}
      {showAllRelated && products.length > 6 && (
        <div className="text-center mt-4 sm:mt-6">
          <button
            onClick={() => {
              const relatedSection = document.querySelector('.related-products-section');
              if (relatedSection) {
                relatedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="text-gray-600 hover:text-gray-800 font-medium flex items-center text-xs sm:text-sm bg-gray-50 hover:bg-gray-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 mx-auto"
          >
            Show Less <FaChevronRight className="ml-1 rotate-90" />
          </button>
        </div>
      )}
    </div>
  );
};

// All Products Section - Mobile optimized with small icon
const AllProductsSection = ({ products, categories, addToCart, openProductModal, toggleWishlist, isFav, onViewAll, showAllProducts }: any) => {
  if (!products || products.length === 0) return null;

  // Show all products or just 12 initially
  const displayProducts = showAllProducts ? products : products.slice(0, 12);

  return (
    <div className="mb-8 sm:mb-12 all-products-section">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile: Smaller icon, Desktop: Regular */}
          <div className="bg-[#e1630d] p-1.5 sm:p-2 rounded-lg">
            <FaLayerGroup className="text-white text-sm sm:text-lg" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">All Products</h3>
            <p className="text-gray-600 text-xs sm:text-sm">Browse our complete collection of {products.length} products</p>
          </div>
        </div>
        {!showAllProducts && products.length > 12 && (
          <button
            onClick={onViewAll}
            className="text-white bg-[#e1630d] hover:bg-[#c1550b] font-medium flex items-center text-xs sm:text-sm px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {/* Mobile: Smaller icon and text, Desktop: Full */}
            <FaBox className="mr-1 sm:mr-2 text-xs sm:text-sm" />
            <span className="hidden sm:inline">View All Products</span>
            <span className="sm:hidden">View All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {displayProducts.map((product: any) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
            openProductModal={openProductModal}
            toggleWishlist={toggleWishlist}
            isFav={isFav}
            categories={categories}
            showCategoryBadge={true}
          />
        ))}
      </div>

      {/* Show "Show Less" button when all products are displayed - Mobile optimized */}
      {showAllProducts && products.length > 12 && (
        <div className="text-center mt-4 sm:mt-8">
          <button
            onClick={() => {
              const allProductsSection = document.querySelector('.all-products-section');
              if (allProductsSection) {
                allProductsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="text-gray-600 hover:text-gray-800 font-medium flex items-center text-xs sm:text-sm bg-gray-50 hover:bg-gray-100 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg transition-all duration-300 mx-auto"
          >
            <FaChevronRight className="mr-1 sm:mr-2 rotate-90" />
            <span className="hidden sm:inline">Show Less Products</span>
            <span className="sm:hidden">Show Less</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Color palette for different categories
const getCategoryColor = (categoryName: string, isSelected: boolean) => {
  if (isSelected) {
    return {
      bg: 'bg-[#e1630d]',
      border: 'border-[#e1630d]',
      text: 'text-white',
      iconBg: 'bg-white/20',
      iconColor: 'text-white'
    };
  }

  // Default colors for unselected categories
  const colors = [
    { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-700', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-700', iconBg: 'bg-pink-100', iconColor: 'text-pink-600' },
    { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-700', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
    { bg: 'bg-teal-50', border: 'border-teal-100', text: 'text-teal-700', iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
    { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
    { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-700', iconBg: 'bg-rose-100', iconColor: 'text-rose-600' },
    { bg: 'bg-cyan-50', border: 'border-cyan-100', text: 'text-cyan-700', iconBg: 'bg-cyan-100', iconColor: 'text-cyan-600' },
    { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    { bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-700', iconBg: 'bg-violet-100', iconColor: 'text-violet-600' },
    { bg: 'bg-fuchsia-50', border: 'border-fuchsia-100', text: 'text-fuchsia-700', iconBg: 'bg-fuchsia-100', iconColor: 'text-fuchsia-600' },
    { bg: 'bg-sky-50', border: 'border-sky-100', text: 'text-sky-700', iconBg: 'bg-sky-100', iconColor: 'text-sky-600' },
    { bg: 'bg-lime-50', border: 'border-lime-100', text: 'text-lime-700', iconBg: 'bg-lime-100', iconColor: 'text-lime-600' },
    { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-700', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
  ];

  // Create a simple hash from category name to get consistent color
  const hash = categoryName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = hash % colors.length;
  
  return colors[colorIndex];
};

// Main Categories Horizontal Scroll - Different sizes for mobile and desktop
const MainCategories = ({ categories, selectedCategory, onCategorySelect }: any) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Shop by Category</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="hidden sm:flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-300"
          >
            <FaAngleLeft className="text-gray-600" />
          </button>
          <button
            onClick={scrollRight}
            className="hidden sm:flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-300"
          >
            <FaAngleRight className="text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="relative">
        {/* Scroll buttons for mobile */}
        <div className="sm:hidden absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
          <button
            onClick={scrollLeft}
            className="w-8 h-8 bg-white/90 shadow-md rounded-full flex items-center justify-center"
          >
            <FaAngleLeft className="text-gray-600 text-sm" />
          </button>
        </div>
        
        <div className="sm:hidden absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
          <button
            onClick={scrollRight}
            className="w-8 h-8 bg-white/90 shadow-md rounded-full flex items-center justify-center"
          >
            <FaAngleRight className="text-gray-600 text-sm" />
          </button>
        </div>

        {/* Categories Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 px-1"
        >
          {/* All Category - Different sizes for mobile and desktop */}
          <button
            onClick={() => onCategorySelect(null)}
            onMouseEnter={() => setHoveredCategory('all')}
            onMouseLeave={() => setHoveredCategory(null)}
            className={`flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 border-2 w-8 h-8 sm:w-32 sm:h-32 shadow-sm hover:shadow-md relative ${selectedCategory === null 
              ? 'bg-[#e1630d] border-[#e1630d] text-white shadow-md' 
              : 'bg-orange-50 border-orange-100 hover:bg-orange-100 text-orange-700'}`}
          >
            <div className={`rounded-full flex items-center justify-center sm:mb-3 w-8 h-8 sm:w-14 sm:h-14 ${selectedCategory === null ? 'bg-white/20' : 'bg-orange-100'}`}>
              <FaBox className={`text-base sm:text-xl ${selectedCategory === null ? 'text-white' : 'text-orange-600'}`} />
            </div>
            
            {/* Category name - Only visible on desktop */}
            <span className="hidden sm:block text-xs font-semibold text-center">All</span>
            
            {/* Mobile tooltip - Shows category name on hover */}
            {hoveredCategory === 'all' && (
              <div className="sm:hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
                All
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
              </div>
            )}
          </button>

          {/* Other Categories - Different sizes for mobile and desktop */}
          {categories.map((category: any) => {
            const isSelected = selectedCategory === category.id;
            const colors = getCategoryColor(category.name, isSelected);
            const isHovered = hoveredCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 border-2 w-10 h-10 sm:w-32 sm:h-32 shadow-sm hover:shadow-md relative ${colors.bg} ${colors.border} ${colors.text}`}
              >
                <div className={`rounded-full flex items-center justify-center sm:mb-3  sm:w-14 sm:h-14 ${colors.iconBg}`}>
                  <CategoryIcon name={category.iconName} className={`text-base sm:text-xl ${colors.iconColor}`} />
                </div>
                
                {/* Category name - Only visible on desktop */}
                <span className="hidden sm:block text-xs font-semibold text-center line-clamp-2">
                  {category.name}
                </span>
                
                {/* Mobile tooltip - Shows category name on hover */}
                {isHovered && (
                  <div className="sm:hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 max-w-[120px] text-center">
                    {category.name}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Subcategory Dropdown - Orange theme
const SubcategoryDropdown = ({ categories, selectedCategory, selectedSubcategory, onSubcategorySelect, showAllSubcategories = false, setShowAllSubcategories }: any) => {
  if (!selectedCategory) return null;

  const category = categories.find((cat: any) => cat.id === selectedCategory);
  if (!category) return null;

  // Get all subcategories from mainSubcategories
  const allSubcategories: string[] = [];
  if (category.mainSubcategories) {
    category.mainSubcategories.forEach((ms: any) => {
      if (ms.items && Array.isArray(ms.items)) {
        allSubcategories.push(...ms.items);
      }
    });
  }

  // Remove duplicates and limit to 10 initially
  const uniqueSubcategories = [...new Set(allSubcategories)];
  const displaySubcategories = showAllSubcategories ? uniqueSubcategories : uniqueSubcategories.slice(0, 10);

  if (uniqueSubcategories.length === 0) return null;

  return (
    <div className="mb-4 sm:mb-6 bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Browse by Subcategory</h3>
          <p className="text-gray-600 text-xs sm:text-sm">Select a subcategory to filter products</p>
        </div>
        
        {/* Dropdown for mobile */}
       <div className="sm:hidden relative w-full">
          <select
            value={selectedSubcategory || ""}
            onChange={(e) => onSubcategorySelect(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm"
          >
            <option value="">All Subcategories</option>
            {displaySubcategories.map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat}
              </option>
            ))}
            {!showAllSubcategories && uniqueSubcategories.length > 10 && (
              <option value="__view_all__">View All ({uniqueSubcategories.length})</option>
            )}
          </select>
        </div>
      </div>

      {/* Horizontal subcategories for desktop and tablets */}
      <div className="hidden sm:block">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSubcategorySelect(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${!selectedSubcategory 
              ? 'bg-[#e1630d] text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All
          </button>
          
          {displaySubcategories.map((subcat) => (
            <button
              key={subcat}
              onClick={() => onSubcategorySelect(subcat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${selectedSubcategory === subcat 
                ? 'bg-[#e1630d] text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {subcat}
            </button>
          ))}
          
          {/* View All / Show Less button */}
          {uniqueSubcategories.length > 10 && (
            <button
              onClick={() => setShowAllSubcategories && setShowAllSubcategories(!showAllSubcategories)}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-orange-50 text-[#e1630d] hover:bg-orange-100 transition-all duration-300 flex items-center gap-2"
            >
              {showAllSubcategories ? (
                <>
                  Show Less <FaChevronUp className="text-xs" />
                </>
              ) : (
                <>
                  View All ({uniqueSubcategories.length}) <FaChevronDown className="text-xs" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Active filters display - Mobile optimized
const ActiveFilters = ({ selectedCategory, selectedSubcategory, onClearFilters, categories }: any) => {
  if (!selectedCategory && !selectedSubcategory) return null;

  const categoryName = selectedCategory ? categories.find((cat: any) => cat.id === selectedCategory)?.name : null;
  const subcategoryName = selectedSubcategory;

  return (
    <div className="mb-4 sm:mb-6 bg-orange-50 border border-orange-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <FaFilter className="text-[#e1630d] text-sm sm:text-base" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">Active Filters:</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {selectedCategory && (
              <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-white border border-orange-200 text-orange-800 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 shadow-sm">
                <span className="hidden sm:inline">Category: </span>
                <span>{categoryName}</span>
                <button onClick={() => onClearFilters('category')} className="text-[#e1630d] hover:text-[#c1550b] w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center hover:bg-orange-100 rounded-full text-xs">×</button>
              </span>
            )}
            {selectedSubcategory && (
              <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-white border border-orange-200 text-orange-800 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 shadow-sm">
                <span className="hidden sm:inline">Subcategory: </span>
                <span>{subcategoryName}</span>
                <button onClick={() => onClearFilters('subcategory')} className="text-[#e1630d] hover:text-[#c1550b] w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center hover:bg-orange-100 rounded-full text-xs">×</button>
              </span>
            )}
          </div>
        </div>
        <button onClick={() => onClearFilters('all')} className="text-xs sm:text-sm text-[#e1630d] hover:text-[#c1550b] font-medium px-2 py-1 sm:px-3 sm:py-1.5 hover:bg-orange-50 rounded-lg transition-all duration-300 self-end sm:self-auto">Clear all filters</button>
      </div>
    </div>
  );
};

// Hero Banner for Category - Single image with category name overlay
const CategoryHeroBanner = ({ selectedCategory, categories }: any) => {
  // Single hero banner image for all categories
  const heroImage = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
  
  let title = "All Products";
  let description = "Discover amazing products";

  if (selectedCategory) {
    const category = categories.find((cat: any) => cat.id === selectedCategory);
    if (category) {
      title = `${category.name} Collection`;
    }
  }

  return (
    <div className="mb-6 sm:mb-8 rounded-lg sm:rounded-xl overflow-hidden relative">
      <img 
        src={heroImage}
        alt={`${title} Banner`}
        className="w-full h-48 sm:h-64 md:h-80 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex flex-col justify-center p-6 sm:p-10 md:p-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
          {title}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl">
          {description}
        </p>
      </div>
    </div>
  );
};

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get parameters from URL
  const categoryParam = searchParams.get('category');
  const subcategoryParam = searchParams.get('subcategory');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(subcategoryParam);
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [showAllRelated, setShowAllRelated] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const cart = useContext(CartContext)!;
  const { user } = useContext(AuthContext)!;
  const { toggleWishlist: contextToggle, isInWishlist } = useContext(WishlistContext)!;

  // ✅ FIX: Scroll to top when component mounts
  useEffect(() => {
    // Scroll to top on initial load
    window.scrollTo(0, 0);
    
    // Also handle browser back/forward navigation
    const handlePopState = () => {
      window.scrollTo(0, 0);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // ✅ FIX: Also scroll to top when the page refreshes or when navigating to this page
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);

        const dbCategories = categoriesRes.data;
        const mergedCategories = dbCategories.map((dbCat: any) => ({
          ...dbCat,
          id: dbCat._id,
          name: dbCat.name,
          iconName: dbCat.icon, // Store icon name separately
          image: dbCat.image || '',
          items: `${dbCat.subCategories?.length || 0} Items`,
          mainSubcategories: dbCat.mainSubcategories || [],
          color: dbCat.color || 'orange'
        }));
        setCategories(mergedCategories);

        const dbProducts = productsRes.data.map((p: any) => ({
          ...p,
          id: p._id,
          currentPrice: `$ ${(p.price || 0).toFixed(2)}`,
          originalPrice: (p.discount > 0 && p.price) ? `$ ${(p.price / (1 - p.discount / 100)).toFixed(2)}` : null,
          discountPercent: p.discount || 0,
          badgeIcon: p.badge === 'New' ? <FaGem className="text-white text-xs" /> : p.badge === 'Sale' ? <FaFire className="text-white text-xs" /> : p.badge === 'Bestseller' ? <FaCrown className="text-white text-xs" /> : null,
          badge: p.badge,
          categoryName: p.category ? (typeof p.category === 'string' ? p.category : p.category.name) : 'Uncategorized',
          categoryId: p.category ? (typeof p.category === 'string' ? '' : p.category._id) : '',
          image: getImageUrl(p.image),
          rating: p.rating || 0,
          sold: p.sold || 0,
          stock: p.stock || 0,
          subCategory: p.subCategory || ''
        }));
        setAllProducts(dbProducts);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Update state when URL parameters change
  useEffect(() => {
    if (categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
    if (subcategoryParam !== selectedSubcategory) {
      setSelectedSubcategory(subcategoryParam);
    }
  }, [categoryParam, subcategoryParam]);

  useEffect(() => {
    if (allProducts.length === 0 || categories.length === 0) return;

    let productsToShow = [];
    let relatedToShow = [];

    if (selectedCategory) {
      const targetCat = categories.find(c => c.id === selectedCategory);
      if (targetCat) {
        if (selectedSubcategory) {
          // When subcategory is selected: Show products from that subcategory
          productsToShow = allProducts.filter(p =>
            p.categoryId === selectedCategory &&
            p.subCategory === selectedSubcategory
          );

          // Related Products: Show products from SAME category but DIFFERENT subcategories
          relatedToShow = allProducts.filter(p =>
            p.categoryId === selectedCategory &&
            p.subCategory !== selectedSubcategory
          );
        } else {
          // When only category is selected (no subcategory): Show ALL products from that category
          productsToShow = allProducts.filter(p => p.categoryId === selectedCategory);

          // Related Products: Show products from OTHER categories
          relatedToShow = allProducts.filter(p => p.categoryId !== selectedCategory);
        }
      }
    } else {
      // No category selected: Show first 12 products as featured
      productsToShow = allProducts.slice(0, 12);

      // Related Products: Show random products from all categories
      const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
      relatedToShow = shuffled.slice(0, 12);
    }

    setFilteredProducts(productsToShow);
    setRelatedProducts(relatedToShow);
  }, [selectedCategory, selectedSubcategory, allProducts, categories]);

  const handleCategorySelect = (categoryId: string | null) => {
    // ✅ FIX: Scroll to top when category changes
    window.scrollTo(0, 0);
    
    const params = new URLSearchParams(searchParams);

    if (categoryId && selectedCategory !== categoryId) {
      params.set('category', categoryId);
      params.delete('subcategory');
      setSelectedCategory(categoryId);
      setSelectedSubcategory(null);
    } else {
      params.delete('category');
      params.delete('subcategory');
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    }

    setShowAllSubcategories(false);
    setShowAllRelated(false);
    setShowAllProducts(false);
    setSearchParams(params);
  };

  const handleSubcategorySelect = (subcategoryId: string | null) => {
    // ✅ FIX: Scroll to top when subcategory changes
    window.scrollTo(0, 0);
    
    const params = new URLSearchParams(searchParams);

    if (selectedCategory) {
      params.set('category', selectedCategory);
    }

    if (subcategoryId === "__view_all__") {
      setShowAllSubcategories(true);
      return;
    }

    if (subcategoryId && selectedSubcategory !== subcategoryId) {
      params.set('subcategory', subcategoryId);
      setSelectedSubcategory(subcategoryId);
    } else {
      params.delete('subcategory');
      setSelectedSubcategory(null);
    }

    setShowAllRelated(false);
    setShowAllProducts(false);
    setSearchParams(params);
  };

  const handleClearFilters = (type: 'category' | 'subcategory' | 'all') => {
    // ✅ FIX: Scroll to top when clearing filters
    window.scrollTo(0, 0);
    
    const params = new URLSearchParams();

    if (type === 'all' || type === 'category') {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setShowAllSubcategories(false);
    } else if (type === 'subcategory') {
      setSelectedSubcategory(null);
      setShowAllSubcategories(false);
      if (selectedCategory) {
        params.set('category', selectedCategory);
      }
    }

    setShowAllRelated(false);
    setShowAllProducts(false);
    setSearchParams(params);
  };

  // Handle View All click for Related Products - Shows all related products
  const handleViewAllRelated = () => {
    setShowAllRelated(true);
    setTimeout(() => {
      const relatedSection = document.querySelector('.related-products-section');
      if (relatedSection) {
        relatedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle View All click for All Products - Shows all products from database
  const handleViewAllProducts = () => {
    setShowAllProducts(true);
    setTimeout(() => {
      const allProductsSection = document.querySelector('.all-products-section');
      if (allProductsSection) {
        allProductsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // ✅ FIXED: Check stock before adding to cart
  const addToCart = (product: any) => {
    // Check if product is in stock
    if (product.stock <= 0) {
      // Show out of stock message
      alert('This product is currently out of stock.');
      return;
    }
    
    cart.addToCart(product);
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-lg z-50 animate-fade-in flex items-center gap-2';
    notification.innerHTML = `
      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span class="text-xs sm:text-sm">Added to cart!</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const openProductModal = (product: any) => {
    // ✅ FIX: Scroll to top before navigating to product detail
    window.scrollTo(0, 0);
    
    // ✅ IMPORTANT: Add product to recently viewed
    addToRecentlyViewed(product);
    
    // Navigate to product detail page
    navigate(`/products/${product.id}`);
  };

  const handleToggleWishlist = async (productId: string) => {
    if (!user) {
      // ✅ FIX: Scroll to top before navigating to login
      window.scrollTo(0, 0);
      navigate('/login');
      return;
    }
    
    // Find the product to check stock
    const product = allProducts.find(p => p.id === productId);
    if (product && product.stock <= 0) {
      alert('This product is out of stock and cannot be added to wishlist.');
      return;
    }
    
    await contextToggle(productId);
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 text-center">
      <div className="animate-pulse">
        <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4 mx-auto mb-3 sm:mb-4"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6 sm:mb-8"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 sm:h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );

  const currentCategory = categories.find(c => c.id === selectedCategory);

  // Determine section title and description based on state
  const getSectionTitle = () => {
    if (selectedSubcategory) {
      return `${selectedSubcategory} Products`;
    } else if (selectedCategory) {
      return `${currentCategory?.name} Products`;
    } else {
      return 'Featured Products';
    }
  };

  const getSectionDescription = () => {
    if (selectedSubcategory) {
      return `Discover our handpicked ${selectedSubcategory} selection of ${filteredProducts.length} premium products`;
    } else if (selectedCategory) {
      return `Explore our curated ${currentCategory?.name} collection of ${filteredProducts.length} premium products`;
    } else {
      return 'Discover our handpicked selection of premium products';
    }
  };

  // Check if we should show related products section
  const shouldShowRelatedProducts = () => {
    return relatedProducts.length > 0 && (selectedCategory || selectedSubcategory);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>

      {/* Header Section - Mobile optimized */}
      {/* <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {selectedCategory 
            ? `${currentCategory?.name} Products`
            : 'All Products'
          }
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          {selectedCategory 
            ? `Browse our  ${currentCategory?.name.toLowerCase()} collection` 
            : `Discover amazing products`
          }
        </p>
      </div> */}

      {/* 1. Main Categories Horizontal Scroll */}
      <MainCategories
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* 2. Category Hero Banner (Single Image with Text Overlay) */}
      <CategoryHeroBanner
        selectedCategory={selectedCategory}
        categories={categories}
      />

      {/* 3. Subcategory Dropdown/Horizontal Filter */}
      <SubcategoryDropdown
        categories={categories}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        onSubcategorySelect={handleSubcategorySelect}
        showAllSubcategories={showAllSubcategories}
        setShowAllSubcategories={setShowAllSubcategories}
      />

      {/* Active Filters Display */}
      <ActiveFilters
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        onClearFilters={handleClearFilters}
        categories={categories}
      />

      {/* Featured Products Section */}
      <ProductGridSection
        filteredProducts={filteredProducts}
        addToCart={addToCart}
        openProductModal={openProductModal}
        title={getSectionTitle()}
        description={getSectionDescription()}
        toggleWishlist={handleToggleWishlist}
        isFav={(id: string) => isInWishlist(id)}
        categories={categories}
      />

      {/* Related Products Section (only when category/subcategory is selected) */}
      {shouldShowRelatedProducts() && (
        <RelatedProductsSection
          products={relatedProducts}
          categories={categories}
          addToCart={addToCart}
          openProductModal={openProductModal}
          toggleWishlist={handleToggleWishlist}
          isFav={(id: string) => isInWishlist(id)}
          onViewAll={handleViewAllRelated}
          showAllRelated={showAllRelated}
        />
      )}

      {/* All Products Section - Always visible at the bottom */}
      <div className="all-products-section mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
        <AllProductsSection
          products={allProducts}
          categories={categories}
          addToCart={addToCart}
          openProductModal={openProductModal}
          toggleWishlist={handleToggleWishlist}
          isFav={(id: string) => isInWishlist(id)}
          onViewAll={handleViewAllProducts}
          showAllProducts={showAllProducts}
        />
      </div>
    </div>
  );
}