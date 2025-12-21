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
  FaCreditCard, FaClock
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


// Product Grid Section
const ProductGridSection = ({ filteredProducts, addToCart, openProductModal, title = "Featured Products", description = "Discover our handpicked selection", toggleWishlist, isFav }: any) => {

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
        ))}
      </div>
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
          <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-5">
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
                    ? 'bg-amber-600 text-white shadow-md transform scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-amber-50 hover:text-amber-700 hover:shadow-sm'
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide px-1">
          {categories.map((category: any, index: number) => {
            const isSelected = selectedCategory === category.id;
            const colors = getCategoryColor(index, isSelected);

            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`group flex-shrink-0 w-36 transition-all duration-300 ${isSelected ? 'transform -translate-y-2' : ''}`}
              >
                <div className={`flex flex-col items-center justify-center p-4 rounded-xl h-full w-full transition-all duration-300 ${colors.bg} ${isSelected ? 'shadow-xl' : 'hover:shadow-lg'}`}>
                  <div className={`relative w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${colors.icon}`}>
                    <div className="text-2xl text-white">
                      {category.icon}
                    </div>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <FaCheck className="text-white text-xs" />
                      </div>
                    )}
                  </div>
                  <h3 className={`text-sm font-semibold text-center mb-1 line-clamp-2 ${isSelected ? 'text-blue-900' : 'text-gray-800'}`}>
                    {category.name}
                  </h3>
                  <div className={`text-xs px-3 py-1 rounded-full ${isSelected ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>
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
    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Active Filters:</span>
          </div>
          <div className="flex items-center gap-2">
            {selectedCategory && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2">
                <span>Category: {categoryName}</span>
                <button onClick={() => onClearFilters('category')} className="text-blue-600 hover:text-blue-800">×</button>
              </span>
            )}
            {selectedSubcategory && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2">
                <span>Subcategory: {subcategoryName}</span>
                <button onClick={() => onClearFilters('subcategory')} className="text-blue-600 hover:text-blue-800">×</button>
              </span>
            )}
          </div>
        </div>
        <button onClick={() => onClearFilters('all')} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Clear all</button>
      </div>
    </div>
  );
};

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(searchParams.get('subcategory'));
  const cart = useContext(CartContext)!;
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();
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
          badgeIcon: p.badge === 'New' ? <FaGem className="text-white text-xs" /> : p.badge === 'Sale' ? <FaFire className="text-white text-xs" /> : p.badge === 'Bestseller' ? <FaCrown className="text-white text-xs" /> : null,
          categoryName: p.category ? (typeof p.category === 'string' ? p.category : p.category.name) : 'Uncategorized',
          image: getImageUrl(p.image)
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

  useEffect(() => {
    if (allProducts.length === 0) return;

    let productsToShow = allProducts;
    if (selectedCategory) {
      const targetCat = categories.find(c => c.id === selectedCategory);
      if (targetCat) {
        productsToShow = productsToShow.filter(p => p.categoryName === targetCat.name);
      }
    }
    if (selectedSubcategory) {
      productsToShow = productsToShow.filter(p => p.subCategory === selectedSubcategory);
    }
    setFilteredProducts(productsToShow);
  }, [selectedCategory, selectedSubcategory, allProducts, categories]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(selectedSubcategory === subcategoryId ? null : subcategoryId);
  };

  const handleClearFilters = (type: 'category' | 'subcategory' | 'all') => {
    if (type === 'all' || type === 'category') {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setSelectedSubcategory(null);
    }
  };

  const addToCart = (product: any) => { cart.addToCart(product); alert("Added to cart"); };
  const openProductModal = (product: any) => { navigate(`/products/${product.id}`); };

  const handleToggleWishlist = async (productId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    await contextToggle(productId);
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8 text-center">Loading products...</div>;

  const currentCategory = categories.find(c => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {selectedSubcategory || (currentCategory ? currentCategory.name + ' Products' : 'Shop by Category')}
        </h1>
        <p className="text-gray-600 mb-6">Discover amazing products curated just for you</p>
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

      {selectedCategory && !selectedSubcategory ? (
        <>
          {currentCategory?.mainSubcategories.map((ms: any, idx: number) => {
            const subProducts = allProducts.filter(p =>
              p.categoryName === currentCategory.name && ms.items.includes(p.subCategory)
            );
            if (subProducts.length === 0) return null;
            return (
              <ProductGridSection
                key={idx}
                filteredProducts={subProducts}
                title={ms.title}
                addToCart={addToCart}
                openProductModal={openProductModal}
                description={`Explore ${ms.title}`}
                toggleWishlist={handleToggleWishlist}
                isFav={(id: string) => isInWishlist(id)}
              />
            );
          })}
          {filteredProducts.length === 0 && <p className="text-center py-12 text-gray-500">No products found.</p>}
        </>
      ) : (
        <ProductGridSection
          filteredProducts={filteredProducts}
          addToCart={addToCart}
          openProductModal={openProductModal}
          title={selectedSubcategory ? `${selectedSubcategory} Products` : 'Featured Products'}
          toggleWishlist={handleToggleWishlist}
          isFav={(id: string) => isInWishlist(id)}
        />
      )}
    </div>
  );
}