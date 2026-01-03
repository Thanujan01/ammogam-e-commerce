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
  FaStar, FaPlus, FaMinus,
  FaCheckCircle, FaPalette,
  FaChevronRight, FaChevronLeft as FaChevronLeftIcon,
  FaWhatsapp, FaFacebook, FaLink,
  FaTruck, FaArrowRight
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
  variantType?: 'size' | 'weight' | 'none';
  sizes?: { size: string; stock: number; price: number }[];
  weights?: { weight: string; stock: number; price: number }[];
}

interface EnhancedProduct extends IProduct {
  variations?: ProductVariation[];
  hasVariations: boolean;
  defaultColor?: string;
  categoryName?: string;
  categoryId?: string; // ✅ Added categoryId
  shippingFee?: number;
  reviewCount?: number;
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
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedWeight, setSelectedWeight] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const cart = useContext(CartContext)!;
  const { user } = useContext(AuthContext)!;
  const { isInWishlist, toggleWishlist: contextToggle } = useContext(WishlistContext)!;

  // ✅ FIX: Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);

    const handlePopState = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // ✅ FIX: Additional scroll for smoother experience
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
    if (!id) return;
    setLoading(true);

    api.get(`/products/${id}`)
      .then(res => {
        const variations = res.data.colorVariants || res.data.variations || [];
        const normalizedVariations = variations.map((v: any) => ({
          ...v,
          _id: v._id || Math.random().toString(36).substr(2, 9),
          color: v.colorName || v.color,
          colorName: v.colorName || v.color,
          images: v.images || (v.image ? [v.image] : []),
        }));

        // Extract category ID from the product data
        let categoryId = '';
        if (res.data.category) {
          if (typeof res.data.category === 'string') {
            categoryId = res.data.category;
          } else if (res.data.category._id) {
            categoryId = res.data.category._id;
          }
        }

        const productData: EnhancedProduct = {
          ...res.data,
          hasVariations: normalizedVariations.length > 0,
          variations: normalizedVariations,
          categoryName: res.data.category?.name ||
            (typeof res.data.category === 'string' ? res.data.category : 'Category'),
          categoryId: categoryId, // ✅ Store categoryId
          shippingFee: res.data.shippingFee || 0,
          reviewCount: res.data.reviewCount || 0
        };

        setProduct(productData);

        // Set initial variation
        if (productData.hasVariations && productData.variations && productData.variations.length > 0) {
          const defaultVariation = productData.variations.find(v => v.color === productData.defaultColor) || productData.variations[0];
          setSelectedVariation(defaultVariation);
          setSelectedColor(defaultVariation.color);
          setSelectedImageIndex(0); // Start with first image

          if (defaultVariation.variantType === 'size' && defaultVariation.sizes?.length) {
            setSelectedSize(defaultVariation.sizes[0].size);
          }
          if (defaultVariation.variantType === 'weight' && defaultVariation.weights?.length) {
            setSelectedWeight(defaultVariation.weights[0].weight);
          }
        }
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });

    // Fetch reviews
    setReviewsLoading(true);
    api.get(`/reviews/product/${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error("Error fetching reviews:", err))
      .finally(() => setReviewsLoading(false));
  }, [id]);

  // Calculate total price with shipping
  const calculateTotalPrice = () => {
    const basePrice = getCurrentPrice();
    const discountPercent = product?.discount || 0;
    const currentPrice = discountPercent > 0 ? (basePrice * (1 - discountPercent / 100)) : basePrice;
    const subtotal = currentPrice * quantity;
    const shippingFee = product?.shippingFee || 0;

    const totalShipping = shippingFee > 0 ? shippingFee : 0;

    return {
      subtotal,
      shipping: totalShipping,
      total: subtotal + totalShipping
    };
  };

  const handleAddToCart = () => {
    if (product && selectedVariation) {
      // ✅ FIXED: Pass the selected image index to cart
      cart.addToCart(
        product,
        quantity,
        selectedVariation._id,
        selectedVariation.colorName,
        selectedVariation.colorCode,
        selectedImageIndex, // Pass the selected image index
        selectedSize,
        selectedWeight,
        basePrice
      );
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
      setSelectedImageIndex(0); // Reset to first image when color changes

      // Reset or set default size/weight for new variant
      if (variation.variantType === 'size' && variation.sizes?.length) {
        setSelectedSize(variation.sizes[0].size);
        setSelectedWeight('');
      } else if (variation.variantType === 'weight' && variation.weights?.length) {
        setSelectedWeight(variation.weights[0].weight);
        setSelectedSize('');
      } else {
        setSelectedSize('');
        setSelectedWeight('');
      }
    }
  };

  const getCurrentPrice = () => {
    let price = product?.price || 0;
    if (selectedVariation?.price) {
      price = selectedVariation.price;
    }

    // Add size/weight add-on
    if (selectedVariation?.variantType === 'size' && selectedSize) {
      const sizeOpt = selectedVariation.sizes?.find(s => s.size === selectedSize);
      if (sizeOpt) price += sizeOpt.price;
    } else if (selectedVariation?.variantType === 'weight' && selectedWeight) {
      const weightOpt = selectedVariation.weights?.find(w => w.weight === selectedWeight);
      if (weightOpt) price += weightOpt.price;
    }

    return price;
  };

  const getCurrentStock = () => {
    if (selectedVariation) {
      if (selectedVariation.variantType === 'size' && selectedSize) {
        const sizeOpt = selectedVariation.sizes?.find(s => s.size === selectedSize);
        return sizeOpt?.stock ?? 0;
      } else if (selectedVariation.variantType === 'weight' && selectedWeight) {
        const weightOpt = selectedVariation.weights?.find(w => w.weight === selectedWeight);
        return weightOpt?.stock ?? 0;
      }
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

  // Share functionality
  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowShareModal(false);
  };

  const shareOnWhatsApp = () => {
    if (!product) return;
    const message = `Check out this amazing product: ${product.name}\nPrice: $${getCurrentPrice().toLocaleString()}\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    setShowShareModal(false);
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    setShowShareModal(false);
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
  const basePrice = getCurrentPrice();
  const discountPercent = product.discount || 0;
  const currentPrice = discountPercent > 0 ? (basePrice * (1 - discountPercent / 100)) : basePrice;
  const originalPrice = discountPercent > 0 ? basePrice : null;
  const currentStock = getCurrentStock();
  const { subtotal, shipping, total } = calculateTotalPrice();

  // Get category name safely
  const getCategoryName = () => {
    if (product.categoryName) return product.categoryName;
    if (typeof product.category === 'string') return product.category;
    if (product.category?.name) return product.category.name;
    return 'Category';
  };

  // ✅ FIXED: Corrected Buy Now functionality - Clear existing items first
  const handleBuyNow = () => {
    if (currentStock > 0 && product) {
      // Clear all existing cart items and selections first
      cart.clearCart();

      // Add the current product to cart with selected image
      if (selectedVariation) {
        cart.addToCart(
          product,
          quantity,
          selectedVariation._id,
          selectedVariation.colorName,
          selectedVariation.colorCode,
          selectedImageIndex, // Pass the selected image index
          selectedSize,
          selectedWeight,
          basePrice
        );
      } else {
        cart.addToCart(product, quantity);
      }

      // Create a new Set with only this item selected
      const newSelected = new Set<string>();

      // Get the item key for the product we just added
      const itemKey = cart.getItemKey({
        product,
        quantity,
        variationId: selectedVariation?._id,
        selectedColor: selectedVariation?.colorName,
        selectedColorCode: selectedVariation?.colorCode,
        selectedSize,
        selectedWeight,
        price: basePrice
      } as any);

      newSelected.add(itemKey);

      // Update selected items in cart context
      cart.updateSelectedItems(newSelected);

      // Navigate to checkout
      window.scrollTo(0, 0);
      setTimeout(() => navigate('/checkout'), 100);
    }
  };

  // ✅ FIXED: Handle category click to navigate to products page with category filter
  const handleCategoryClick = () => {
    if (product.categoryId) {
      window.scrollTo(0, 0);
      navigate(`/products?category=${product.categoryId}`);
    } else {
      // Fallback if no categoryId, navigate to products page without filter
      window.scrollTo(0, 0);
      navigate('/products');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Share Via:</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Share via: with only 3 icons */}
              <div>
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={shareOnWhatsApp}
                    className="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors"
                    title="Share on WhatsApp"
                  >
                    <FaWhatsapp className="text-2xl text-emerald-600" />
                  </button>

                  <button
                    onClick={shareOnFacebook}
                    className="p-3 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                    title="Share on Facebook"
                  >
                    <FaFacebook className="text-2xl text-blue-600" />
                  </button>

                  <button
                    onClick={copyLink}
                    className={`p-3 rounded-full transition-colors ${copied ? 'bg-emerald-100' : 'bg-gray-100 hover:bg-gray-200'}`}
                    title={copied ? 'Link Copied!' : 'Copy URL'}
                  >
                    <FaLink className={`text-2xl ${copied ? 'text-emerald-600' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>

              {/* Product info */}
              <div className="pt-4 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600 mb-1">
                  {product.name}
                </p>
                <p className="text-xs text-gray-400">
                  {copied ? '✓ Link copied to clipboard' : 'Click icons to share'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <button
          onClick={() => {
            window.scrollTo(0, 0);
            navigate('/products');
          }}
          className="hover:text-amber-600 transition-colors"
        >
          Products
        </button>
        <FaChevronRight className="text-xs" />
        <button
          onClick={handleCategoryClick} // ✅ Fixed: Now navigates to /products?category=categoryId
          className="hover:text-amber-600 transition-colors"
        >
          {getCategoryName()}
        </button>
        <FaChevronRight className="text-xs" />
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left Column: Image Gallery */}
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

          {/* Right Column: Product Info - GRID LAYOUT */}
          <div className="p-6 md:p-8 lg:p-10">
            {/* Top Section Grid */}
            <div className="grid grid-cols-1 gap-6 mb-8">
              {/* Product Header */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Ammogam Official</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={toggleWishlist}
                      className={`p-2 rounded-full transition-all ${isInWishlist(product._id) ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500 hover:text-red-500'}`}
                      title={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <FaHeart className={isInWishlist(product._id) ? 'fill-current' : ''} />
                    </button>
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="p-2 rounded-full bg-gray-100 text-gray-500 hover:text-blue-500 transition-all"
                      title="Share"
                    >
                      <FaShareAlt />
                    </button>
                  </div>
                </div>

                {/* Product Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating?.toFixed(1) || '0.0'} • {product.reviewCount || 0} reviews
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-green-600 font-medium">
                    {product.sold || 0} sold
                  </span>
                </div>
              </div>
            </div>

            {/* Price Section Grid */}
            <div className="grid grid-cols-1 gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-baseline gap-3">
                <div>
                  <span className="text-sm text-gray-600">Price:</span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-3xl font-bold text-gray-900">
                      ${currentPrice.toLocaleString()}
                    </span>
                    {originalPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        ${Math.round(originalPrice).toLocaleString()}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Color Variations Grid */}
            {product.hasVariations && availableColors.length > 0 && (
              <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaPalette className="text-gray-600" />
                    <span className="font-medium text-gray-900">Color:</span>
                    <span className="text-gray-900 font-bold">{selectedVariation?.colorName}</span>
                  </div>
                  <span className="text-sm text-gray-500">{availableColors.length} colors available</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color.color}
                      onClick={() => handleColorSelect(color.color)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${selectedColor === color.color ? 'ring-2 ring-amber-600 bg-amber-50' : 'hover:bg-gray-100'}`}
                      title={color.name}
                    >
                      <div
                        className="w-8 h-8 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.code }}
                      />
                      <span className="text-xs text-gray-700 truncate w-full text-center">
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Options UI */}
            {selectedVariation?.variantType === 'size' && selectedVariation.sizes && selectedVariation.sizes.length > 0 && (
              <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Select Size:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedVariation.sizes.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedSize(s.size);
                        setQuantity(1);
                      }}
                      disabled={s.stock === 0}
                      className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${selectedSize === s.size
                        ? 'border-amber-600 bg-amber-50 text-amber-700'
                        : s.stock === 0
                          ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                          : 'border-gray-200 hover:border-amber-200 text-gray-700'
                        }`}
                    >
                      {s.size}
                      {s.price > 0 && <span className="ml-1 text-[10px] opacity-70">(+${s.price})</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Weight Options UI */}
            {selectedVariation?.variantType === 'weight' && selectedVariation.weights && selectedVariation.weights.length > 0 && (
              <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Select Weight:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedVariation.weights.map((w, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedWeight(w.weight);
                        setQuantity(1);
                      }}
                      disabled={w.stock === 0}
                      className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${selectedWeight === w.weight
                        ? 'border-amber-600 bg-amber-50 text-amber-700'
                        : w.stock === 0
                          ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                          : 'border-gray-200 hover:border-amber-200 text-gray-700'
                        }`}
                    >
                      {w.weight}
                      {w.price > 0 && <span className="ml-1 text-[10px] opacity-70">(+${w.price})</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Stock Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <span className="font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-gray-100 rounded-lg">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="p-3 hover:bg-gray-200 rounded-l-lg transition-colors disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <FaMinus className="text-gray-600" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(prev => (currentStock && prev >= currentStock ? prev : prev + 1))}
                      className="p-3 hover:bg-gray-200 rounded-r-lg transition-colors disabled:opacity-50"
                      disabled={currentStock !== undefined && quantity >= currentStock}
                    >
                      <FaPlus className="text-gray-600" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    {currentStock} available
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-medium text-gray-900">Shipping:</span>
                <div className="flex items-center gap-2 text-gray-700">
                  <FaTruck className="text-gray-500" />
                  <span>${product.shippingFee ? product.shippingFee.toFixed(2) : '0.00'}</span>
                  <span className="text-sm text-gray-500">• 3-5 business days</span>
                </div>
              </div>
            </div>

            {/* Total Price Grid */}
            <div className="grid grid-cols-1 gap-4 mb-8 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Subtotal:</span>
                <span className="text-lg font-bold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Shipping:</span>
                <span className="text-gray-700">${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-amber-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdded || currentStock === 0}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${isAdded
                  ? 'bg-green-500 text-white'
                  : currentStock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-amber-600 text-white hover:bg-amber-700'
                  }`}
              >
                {isAdded ? (
                  <>
                    <FaCheckCircle />
                    <span>Added to Cart</span>
                  </>
                ) : currentStock === 0 ? (
                  <span>Out of Stock</span>
                ) : (
                  <>
                    <FaShoppingCart />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={currentStock === 0}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${currentStock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-black'
                  }`}
              >
                Buy Now
              </button>
            </div>

            {/* Description Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || "This premium product offers exceptional quality and style. Crafted with attention to detail, it combines functionality with elegant design for the ultimate user experience."}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-3xl font-black text-gray-900">Ratings & Reviews</h2>
                <p className="text-gray-500 mt-2 font-medium">What our customers are saying about this product</p>
              </div>
              <div className="flex items-center gap-6 px-8 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="text-center">
                  <div className="flex items-center text-yellow-400 mt-1 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'} />
                    ))}
                  </div>
                </div>
                <div className="h-12 w-px bg-gray-200"></div>
                <div>
                  <div className="text-sm text-emerald-600 font-bold mt-1">100% Verified Purchases</div>
                </div>
              </div>
            </div>

            {reviewsLoading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Loading authentic reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 shadow-sm">
                  <FaStar className="text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No reviews yet</h3>
                <p className="text-gray-500 mt-2 max-w-sm mx-auto">Be the first to review this product after your purchase!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review: any) => (
                  <div key={review._id} className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 hover:border-amber-200 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-bold text-amber-600 shadow-sm group-hover:bg-amber-100 transition-colors">
                          {review.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{review.user?.name || 'Anonymous'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex text-yellow-400 text-[10px]">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={i < review.rating ? 'fill-current' : 'text-gray-200'} />
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        Verified
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* View All Products Button Section - Only the button */}
        <div className="mt-12 p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="text-center">
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                navigate('/products');
              }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-2xl hover:from-amber-700 hover:to-orange-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View All Products
              <FaArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Add CSS for animations */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}