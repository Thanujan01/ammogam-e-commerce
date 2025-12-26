import { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { WishlistContext } from '../contexts/WishlistContext';
import { getImageUrl } from '../utils/imageUrl';

import {
  FaCrown, FaHome, FaShoppingBag,
  FaMobileAlt, FaLaptop, FaTshirt,
  FaFire, FaCheck, FaCamera, FaPaw, FaBaby,
  FaGlobeAsia, FaCloudSun, FaTools, FaPrint,
  FaImages, FaDog, FaBaby as FaBabyIcon, FaWallet,
  FaStar, FaCartPlus, FaGem, FaFilter, FaHeart,
  FaCreditCard, FaClock, FaChevronRight,
  FaBox, FaLayerGroup
} from 'react-icons/fa';

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

// Product Card Component
const ProductCard = ({ product, addToCart, openProductModal, toggleWishlist, isFav, showCategoryBadge = false }: any) => {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group relative">
      {/* Category Badge */}


      {/* Brand Badge */}
      {product.badge && !showCategoryBadge && (
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
          <div className="bg-amber-600 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg flex items-center gap-0.5 sm:gap-1">
            {product.badgeIcon}
            <span className="text-xs">{product.badge}</span>
          </div>
        </div>
      )}

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

        {/* Discount Badge */}
        {product.discountPercent && (
          <div className={`absolute ${showCategoryBadge ? 'top-10' : 'top-2'} left-2 mt-6 sm:mt-8`}>
            <div className="bg-red-500 text-white text-xs font-bold px-1 sm:px-1.5 py-0.5 rounded">
              -{product.discountPercent}%
            </div>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-md transition-all duration-300 group-hover:scale-110"
          title="Add to wishlist"
        >
          <FaHeart className={`text-sm sm:text-base ${isFav && isFav(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-2 sm:p-3">
        <h3
          className="font-semibold text-gray-900 line-clamp-2 mb-1.5 sm:mb-2 text-xs sm:text-sm h-8 sm:h-10 cursor-pointer hover:text-amber-700"
          onClick={() => openProductModal(product)}
        >
          {product.name}
        </h3>

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

        <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`text-[10px] sm:text-xs ${i < Math.floor(product.rating || 4.5) ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-[10px] sm:text-xs text-gray-600">
            ({product.sold || 0} sold)
          </span>
        </div>
      </div>
    </div>
  );
};

// Product Grid Section
const ProductGridSection = ({ filteredProducts, addToCart, openProductModal, title = "Featured Products", description = "Discover our handpicked selection", toggleWishlist, isFav, categories, showCategoryBadge = false }: any) => {
  return (
    <div className="mb-12">
      {/* Products Grid Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 mb-8 sm:mb-12">
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
    <div className="mb-12 related-products-section">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Related Products</h3>
          <p className="text-gray-600 text-sm">You might also like these products</p>
        </div>
        {!showAllRelated && products.length > 6 && (
          <button
            onClick={onViewAll}
            className="text-amber-700 hover:text-amber-800 font-medium flex items-center text-sm bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-lg transition-all duration-300"
          >
            View all ({products.length}) <FaChevronRight className="ml-1" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
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
        <div className="text-center mt-6">
          <button
            onClick={() => {
              const relatedSection = document.querySelector('.related-products-section');
              if (relatedSection) {
                relatedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="text-gray-600 hover:text-gray-800 font-medium flex items-center text-sm bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-300 mx-auto"
          >
            Show Less <FaChevronRight className="ml-1 rotate-90" />
          </button>
        </div>
      )}
    </div>
  );
};

// All Products Section
const AllProductsSection = ({ products, categories, addToCart, openProductModal, toggleWishlist, isFav, onViewAll, showAllProducts }: any) => {
  if (!products || products.length === 0) return null;

  // Show all products or just 12 initially
  const displayProducts = showAllProducts ? products : products.slice(0, 12);

  return (
    <div className="mb-12 all-products-section">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
            <FaLayerGroup className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">All Products</h3>
            <p className="text-gray-600 text-sm">Browse our complete collection of {products.length} products</p>
          </div>
        </div>
        {!showAllProducts && products.length > 12 && (
          <button
            onClick={onViewAll}
            className="text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 font-medium flex items-center text-sm px-5 py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FaBox className="mr-2" />
            View All Products ({products.length})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
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

      {/* Show "Show Less" button when all products are displayed */}
      {showAllProducts && products.length > 12 && (
        <div className="text-center mt-8">
          <button
            onClick={() => {
              const allProductsSection = document.querySelector('.all-products-section');
              if (allProductsSection) {
                allProductsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="text-gray-600 hover:text-gray-800 font-medium flex items-center text-sm bg-gray-50 hover:bg-gray-100 px-5 py-2.5 rounded-lg transition-all duration-300"
          >
            <FaChevronRight className="mr-2 rotate-90" />
            Show Less Products
          </button>
        </div>
      )}
    </div>
  );
};

// Subcategories Section (only visible when a category is selected)
const SubcategoriesSection = ({ categories, selectedCategory, selectedSubcategory, onSubcategorySelect }: any) => {
  if (!selectedCategory) return null;

  const category = categories.find((cat: any) => cat.id === selectedCategory);
  if (!category || !category.mainSubcategories) return null;

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

  const categoryColor = getCategoryColor(category.color || 'blue');

  return (
    <div className="mb-10 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {category.name} Sections
          </h2>
          <p className="text-gray-600">Explore {category.name} by section</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.mainSubcategories.map((ms: any, idx: number) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-5 hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className={`w-2 h-6 rounded-full ${categoryColor}`}></div>
              {ms.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {ms.items.map((item: string, i: number) => (
                <button
                  key={i}
                  onClick={() => onSubcategorySelect(item)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedSubcategory === item
                    ? 'bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-md transform scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-700 hover:shadow-sm'
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Professional categories display
const ProfessionalCategories = ({ categories, selectedCategory, onCategorySelect }: any) => {
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
            const isSelected = selectedCategory === category.id;
            const colors = getCategoryColor(index, isSelected);

            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`group flex-shrink-0 w-40 transition-all duration-300 ${isSelected ? 'transform -translate-y-2' : ''}`}
              >
                <div className={`flex flex-col items-center justify-center p-5 rounded-xl h-full w-full transition-all duration-300 ${colors.bg} ${isSelected ? 'shadow-xl' : 'hover:shadow-lg'}`}>
                  <div className={`relative w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${colors.icon}`}>
                    <div className="text-2xl text-white">
                      {category.icon}
                    </div>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <FaCheck className="text-white text-xs" />
                      </div>
                    )}
                  </div>
                  <h3 className={`text-sm font-bold text-center mb-2 line-clamp-2 ${isSelected ? 'text-blue-900' : 'text-gray-800'}`}>
                    {category.name}
                  </h3>
                  <div className={`text-xs px-3 py-1 rounded-full font-medium ${isSelected ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>
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

// Active filters display
const ActiveFilters = ({ selectedCategory, selectedSubcategory, onClearFilters, categories }: any) => {
  if (!selectedCategory && !selectedSubcategory) return null;

  const categoryName = selectedCategory ? categories.find((cat: any) => cat.id === selectedCategory)?.name : null;
  const subcategoryName = selectedSubcategory;

  return (
    <div className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Active Filters:</span>
          </div>
          <div className="flex items-center gap-2">
            {selectedCategory && (
              <span className="px-3 py-1.5 bg-white border border-blue-200 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm">
                <span>Category: {categoryName}</span>
                <button onClick={() => onClearFilters('category')} className="text-blue-600 hover:text-blue-800 w-5 h-5 flex items-center justify-center hover:bg-blue-100 rounded-full">×</button>
              </span>
            )}
            {selectedSubcategory && (
              <span className="px-3 py-1.5 bg-white border border-blue-200 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm">
                <span>Subcategory: {subcategoryName}</span>
                <button onClick={() => onClearFilters('subcategory')} className="text-blue-600 hover:text-blue-800 w-5 h-5 flex items-center justify-center hover:bg-blue-100 rounded-full">×</button>
              </span>
            )}
          </div>
        </div>
        <button onClick={() => onClearFilters('all')} className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-all duration-300">Clear all filters</button>
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

  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [showAllRelated, setShowAllRelated] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const cart = useContext(CartContext)!;
  const { user } = useContext(AuthContext)!;
  const { toggleWishlist: contextToggle, isInWishlist } = useContext(WishlistContext)!;

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
          icon: <CategoryIcon name={dbCat.icon} />,
          iconName: dbCat.icon,
          image: dbCat.image || '',
          items: `${dbCat.subCategories?.length || 0} Items`,
          mainSubcategories: dbCat.mainSubcategories || [],
          color: dbCat.color || 'blue'
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
          rating: p.rating || 4.5,
          sold: p.sold || 0,
          // Make sure subCategory field exists
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

  const handleCategorySelect = (categoryId: string) => {
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

    setShowAllRelated(false);
    setShowAllProducts(false);
    setSearchParams(params);
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    const params = new URLSearchParams(searchParams);

    if (selectedCategory) {
      params.set('category', selectedCategory);
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
    const params = new URLSearchParams();

    if (type === 'all' || type === 'category') {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else if (type === 'subcategory') {
      setSelectedSubcategory(null);
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

  const addToCart = (product: any) => {
    cart.addToCart(product);
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in flex items-center gap-2';
    notification.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      Added to cart!
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const openProductModal = (product: any) => {
    navigate(`/products/${product.id}`);
  };

  const handleToggleWishlist = async (productId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    await contextToggle(productId);
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-center">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
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
    <div className="max-w-7xl mx-auto px-4 py-8">
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

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {selectedSubcategory
                ? `${selectedSubcategory} Products`
                : (currentCategory
                  ? `${currentCategory?.name} Collection`
                  : 'Premium Products Collection'
                )
              }
            </h1>
            <p className="text-gray-600">
              {/* {selectedSubcategory 
                ? `Discover amazing ${selectedSubcategory} products with premium quality` 
                : (currentCategory 
                  ? `Explore our curated ${currentCategory?.name} collection` 
                  : `Browse our collection of ${allProducts.length} premium products across ${categories.length} categories`
                )
              } */}
            </p>
          </div>
          {!selectedCategory && (
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
              <FaBox className="text-blue-500" />
              <span>Total Products: <span className="font-bold text-gray-700">{allProducts.length}</span></span>
            </div>
          )}
        </div>
      </div>

      <ActiveFilters
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        onClearFilters={handleClearFilters}
        categories={categories}
      />

      <ProfessionalCategories
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      <SubcategoriesSection
        categories={categories}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        onSubcategorySelect={handleSubcategorySelect}
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
      <div className="all-products-section mt-12 pt-8 border-t border-gray-200">
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