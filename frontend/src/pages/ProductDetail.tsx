// pages/ProductDetail.tsx
import { useEffect, useState, useContext, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import type { IProduct } from '../types';
import { CartContext } from '../contexts/CartContext';
import { WishlistContext } from '../contexts/WishlistContext';
import { getImageUrl } from '../utils/imageUrl';
import {
  FaShoppingCart, FaHeart, FaShareAlt, 
  FaTruck, FaStar, FaPlus, FaMinus,
  FaCheckCircle, FaPalette,
  FaChevronRight, FaChevronLeft as FaChevronLeftIcon,
  FaCheck, FaSyncAlt
} from 'react-icons/fa';

interface ProductVariation {
  _id: string;
  color: string;
  colorName: string;
  colorCode: string;
  images: string[];
  stock: number;
  price?: number;
  sku?: string;
}

interface EnhancedProduct extends IProduct {
  variations?: ProductVariation[];
  hasVariations: boolean;
  defaultColor?: string;
  categoryName?: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<EnhancedProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [showAllColors, setShowAllColors] = useState(false);
  
  const cart = useContext(CartContext)!;
  const { user } = useContext(AuthContext)!;
  const { isInWishlist, toggleWishlist: contextToggle } = useContext(WishlistContext)!;

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    api.get(`/products/${id}`)
      .then(res => {
        const productData: EnhancedProduct = {
          ...res.data,
          hasVariations: res.data.variations && res.data.variations.length > 0,
          variations: res.data.variations || [],
          categoryName: res.data.category?.name || 
                       (typeof res.data.category === 'string' ? res.data.category : 'Category')
        };
        
        setProduct(productData);
        
        // Set initial variation
        if (productData.hasVariations && productData.variations && productData.variations.length > 0) {
          const defaultVariation = productData.variations.find(v => v.color === productData.defaultColor) || productData.variations[0];
          setSelectedVariation(defaultVariation);
          setSelectedColor(defaultVariation.color);
        }
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product && selectedVariation) {
      cart.addToCart(product, quantity, selectedVariation._id, selectedVariation.colorName, selectedVariation.colorCode);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 3000);
    } else if (product) {
      cart.addToCart(product, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 3000);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!product) return;
    await contextToggle(product._id);
  };

  const handleColorSelect = (color: string) => {
    if (!product?.variations) return;
    
    const variation = product.variations.find(v => v.color === color);
    if (variation) {
      setSelectedVariation(variation);
      setSelectedColor(color);
      setSelectedImageIndex(0);
    }
  };

  const getCurrentPrice = () => {
    if (selectedVariation?.price) {
      return selectedVariation.price;
    }
    return product?.price || 0;
  };

  const getCurrentStock = () => {
    if (selectedVariation?.stock !== undefined) {
      return selectedVariation.stock;
    }
    return product?.stock || 0;
  };

  const getCurrentImages = () => {
    if (selectedVariation?.images && selectedVariation.images.length > 0) {
      return selectedVariation.images;
    }
    return product?.image ? [product.image] : [];
  };

  const availableColors = useMemo(() => {
    if (!product?.variations) return [];
    return product.variations.map(v => ({
      color: v.color,
      name: v.colorName,
      code: v.colorCode,
      stock: v.stock
    }));
  }, [product]);

  const displayedColors = showAllColors ? availableColors : availableColors.slice(0, 8);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 text-amber-600 hover:text-amber-700 font-semibold"
        >
          Back to products
        </button>
      </div>
    );
  }

  const currentImages = getCurrentImages();
  const currentPrice = getCurrentPrice();
  const currentStock = getCurrentStock();
  const discountPercent = product.discount || 0;
  const originalPrice = discountPercent > 0 ? (currentPrice / (1 - discountPercent / 100)) : null;

  // Get category name safely
  const getCategoryName = () => {
    if (product.categoryName) return product.categoryName;
    if (typeof product.category === 'string') return product.category;
    if (product.category?.name) return product.category.name;
    return 'Category';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <button
          onClick={() => navigate('/products')}
          className="hover:text-amber-600 transition-colors"
        >
          Products
        </button>
        <FaChevronRight className="text-xs" />
        <button
          onClick={() => navigate(`/products?category=${product.categoryId || ''}`)}
          className="hover:text-amber-600 transition-colors"
        >
          {getCategoryName()}
        </button>
        <FaChevronRight className="text-xs" />
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image Gallery Section */}
          <div className="p-6 md:p-8 bg-gray-50">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Thumbnail Images */}
              <div className="lg:w-20 flex lg:flex-col gap-3 order-2 lg:order-1 overflow-x-auto lg:overflow-y-auto scrollbar-hide">
                {currentImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 lg:w-full lg:h-20 rounded-lg overflow-hidden border-2 ${selectedImageIndex === index ? 'border-amber-600' : 'border-transparent'}`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${product.name} - View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="relative flex-1 order-1 lg:order-2">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-lg group">
                  <img
                    src={getImageUrl(currentImages[selectedImageIndex])}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Badges */}
                  {discountPercent > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      -{discountPercent}% OFF
                    </div>
                  )}
                  {product.badge && (
                    <div className="absolute top-4 right-4 bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {product.badge}
                    </div>
                  )}
                  
                  {/* Image Navigation */}
                  {currentImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : currentImages.length - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                      >
                        <FaChevronLeftIcon className="text-gray-700" />
                      </button>
                      <button
                        onClick={() => setSelectedImageIndex(prev => prev < currentImages.length - 1 ? prev + 1 : 0)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                      >
                        <FaChevronRight className="text-gray-700" />
                      </button>
                    </>
                  )}
                </div>
                
                {/* Image Counter */}
                {currentImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {currentImages.length}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="p-6 md:p-8 lg:p-10 flex flex-col">
            {/* Header with Actions */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="inline-flex items-center gap-2 text-amber-600 font-bold uppercase tracking-wider text-sm">
                  <FaSyncAlt /> Multiple Colors Available
                </span>
                {product.brand && (
                  <div className="text-gray-500 text-sm mt-1">Brand: {product.brand}</div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={toggleWishlist}
                  className={`p-3 rounded-full transition-all shadow-sm hover:shadow-md ${isInWishlist(product._id) ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                  title={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <FaHeart />
                </button>
                <button className="p-3 rounded-full bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all shadow-sm hover:shadow-md" title="Share">
                  <FaShareAlt />
                </button>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating and Sales */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(product.rating || 4.5) ? 'fill-current' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="text-gray-700 font-medium">{product.rating || 4.5}</span>
              </div>
              <span className="text-gray-500 border-l border-gray-200 pl-6">
                {product.sold || 124} Units Sold
              </span>
            </div>

            {/* Color Variations Section */}
            {product.hasVariations && availableColors.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FaPalette className="text-amber-600 text-xl" />
                    <h3 className="text-lg font-bold text-gray-900">Available Colors</h3>
                    <span className="text-sm text-gray-500">({availableColors.length} colors)</span>
                  </div>
                  {availableColors.length > 8 && (
                    <button
                      onClick={() => setShowAllColors(!showAllColors)}
                      className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                    >
                      {showAllColors ? 'Show Less' : `Show All ${availableColors.length} Colors`}
                    </button>
                  )}
                </div>
                
                {/* Color Swatches */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 mb-4">
                  {displayedColors.map((color) => (
                    <button
                      key={color.color}
                      onClick={() => handleColorSelect(color.color)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all relative ${selectedColor === color.color ? 'ring-2 ring-amber-600 bg-amber-50' : 'hover:bg-gray-50'}`}
                    >
                      <div
                        className="w-10 h-10 rounded-full border-2 border-gray-200 shadow-md"
                        style={{ backgroundColor: color.code }}
                        title={color.name}
                      />
                      <div className="text-xs text-center">
                        <div className="font-medium text-gray-900 truncate w-full">{color.name}</div>
                        <div className="text-gray-500 text-xs mt-1">
                          {color.stock > 0 ? `${color.stock} in stock` : 'Out of stock'}
                        </div>
                      </div>
                      {selectedColor === color.color && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center">
                          <FaCheck className="text-white text-xs" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Selected Color Info */}
                {selectedVariation && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-amber-600"
                          style={{ backgroundColor: selectedVariation.colorCode }}
                        />
                        <div>
                          <div className="font-bold text-gray-900">Selected: {selectedVariation.colorName}</div>
                          <div className="text-sm text-gray-600">SKU: {selectedVariation.sku || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        Stock: <span className={`font-bold ${selectedVariation.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedVariation.stock > 0 ? `${selectedVariation.stock} available` : 'Out of stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Price Section */}
            <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-amber-50 rounded-2xl">
              <div className="flex items-baseline gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Price</div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-black text-gray-900">
                      Rs {currentPrice.toLocaleString()}
                    </span>
                    {originalPrice && (
                      <span className="text-xl text-gray-400 line-through">
                        Rs {Math.round(originalPrice).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                {discountPercent > 0 && (
                  <div className="ml-auto">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Save {discountPercent}%
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || "This premium product offers exceptional quality and style. Crafted with attention to detail, it combines functionality with elegant design for the ultimate user experience."}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8 p-6 border border-gray-200 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-gray-900 text-lg">Quantity</span>
                <span className="text-sm text-gray-500">
                  Max: {currentStock} pieces
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-3 w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                    disabled={quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span className="w-16 text-center font-bold text-xl">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => (currentStock && prev >= currentStock ? prev : prev + 1))}
                    className="p-3 w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                    disabled={currentStock !== undefined && quantity >= currentStock}
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="flex-1 text-sm text-gray-600">
                  {currentStock > 10 ? (
                    <span className="text-green-600 font-medium">In stock • Ready to ship</span>
                  ) : currentStock > 0 ? (
                    <span className="text-amber-600 font-medium">Only {currentStock} left • Order soon</span>
                  ) : (
                    <span className="text-red-600 font-medium">Out of stock • Check back later</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={isAdded || currentStock === 0}
                className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black text-lg transition-all duration-300 transform ${isAdded
                  ? 'bg-green-500 text-white'
                  : currentStock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-amber-600 text-white hover:bg-amber-700 hover:-translate-y-1 shadow-lg shadow-amber-600/30'
                  }`}
              >
                {isAdded ? (
                  <>
                    <FaCheckCircle className="text-xl animate-bounce" />
                    <span>Added to Cart</span>
                  </>
                ) : currentStock === 0 ? (
                  <span>Out of Stock</span>
                ) : (
                  <>
                    <FaShoppingCart className="text-xl" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  if (currentStock > 0 && product) {
                    if (selectedVariation) {
                      cart.addToCart(product, quantity, selectedVariation._id, selectedVariation.colorName, selectedVariation.colorCode);
                    } else {
                      cart.addToCart(product, quantity);
                    }
                    navigate('/cart');
                  }
                }}
                disabled={currentStock === 0}
                className={`flex-1 px-8 py-5 rounded-2xl font-black text-lg transition-all hover:-translate-y-1 shadow-lg ${currentStock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-black shadow-gray-900/20'
                  }`}
              >
                Buy Now
              </button>
            </div>

           
          </div>
        </div>

        {/* Additional Info Tabs */}
        <div className="border-t border-gray-200 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Specifications</h3>
                <div className="space-y-3">
                  {product.specifications?.map((spec: any, index: number) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{spec.key}</span>
                      <span className="font-medium text-gray-900">{spec.value}</span>
                    </div>
                  )) || (
                    <>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Material</span>
                        <span className="font-medium text-gray-900">Premium Quality</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Dimensions</span>
                        <span className="font-medium text-gray-900">Standard Size</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Weight</span>
                        <span className="font-medium text-gray-900">Lightweight</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FaTruck className="text-amber-600 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Express Shipping</div>
                      <div className="text-sm text-gray-600">3-5 business days • Rs 9.99</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaTruck className="text-amber-600 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Standard Shipping</div>
                      <div className="text-sm text-gray-600">7-10 business days • Rs 4.99</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaTruck className="text-amber-600 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Free Shipping</div>
                      <div className="text-sm text-gray-600">Orders over $100 • 5-8 business days</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
            <p className="text-gray-600">You might also like these items</p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2"
          >
            View All Products
            <FaChevronRight />
          </button>
        </div>
        {/* Related products would be fetched and displayed here */}
      </div>
    </div>
  );
}