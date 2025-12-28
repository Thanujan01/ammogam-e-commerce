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
  FaCheck, FaSyncAlt, FaWhatsapp, FaFacebook, FaLink,
  FaTruck, FaBox // Added shipping icons
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
  shippingFee?: number; // Added shippingFee to product interface
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const cart = useContext(CartContext)!;
  const { user } = useContext(AuthContext)!;
  const { isInWishlist, toggleWishlist: contextToggle } = useContext(WishlistContext)!;

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

        const productData: EnhancedProduct = {
          ...res.data,
          hasVariations: normalizedVariations.length > 0,
          variations: normalizedVariations,
          categoryName: res.data.category?.name ||
            (typeof res.data.category === 'string' ? res.data.category : 'Category'),
          shippingFee: res.data.shippingFee || 0 // Ensure shippingFee is included
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
    
    // Apply shipping fee logic: only charge shipping once per product (regardless of quantity)
    const totalShipping = shippingFee > 0 ? shippingFee : 0;
    
    return {
      subtotal,
      shipping: totalShipping,
      total: subtotal + totalShipping
    };
  };

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
    const message = `Check out this amazing product: ${product.name}\nPrice: Rs ${getCurrentPrice().toLocaleString()}\n${window.location.href}`;
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
                <button
                  onClick={() => setShowShareModal(true)}
                  className="p-3 rounded-full bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all shadow-sm hover:shadow-md"
                  title="Share"
                >
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
                    <FaStar key={i} className={i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="text-gray-700 font-medium">{product.rating || 0}</span>
              </div>
              <span className="text-gray-500 border-l border-gray-200 pl-6">
                {product.sold || 0} Units Sold
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
                      $ {currentPrice.toLocaleString()}
                    </span>
                    {originalPrice && (
                      <span className="text-xl text-gray-400 line-through">
                        $ {Math.round(originalPrice).toLocaleString()}
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

            {/* Shipping Information Section */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="flex items-start gap-3">
                <FaTruck className="text-blue-600 text-lg mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900 text-sm">Shipping Information</span>
                    <span className="text-sm font-medium text-blue-700">
                      ${product.shippingFee ? product.shippingFee.toFixed(2) : '0.00'}
                    </span>
                  </div>
                  {/* <p className="text-xs text-gray-600">
                    {product.shippingFee ? (
                      <>Shipping fee: <span className="font-medium text-blue-600">${product.shippingFee.toFixed(2)}</span> per order (charged only once regardless of quantity)</>
                    ) : (
                      <span className="text-green-600 font-medium">Free Shipping</span>
                    )}
                  </p> */}
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            {/* <div className="mb-6 bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Price Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Unit Price</span>
                  <span className="font-medium">${currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{quantity} × ${currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <FaTruck className="text-blue-500" />
                    Shipping
                  </span>
                  <span className={`font-medium ${shipping > 0 ? 'text-blue-600' : 'text-green-600'}`}>
                    {shipping > 0 ? `$${shipping.toFixed(2)}` : 'FREE'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-900">Estimated Total</span>
                  <span className="text-2xl font-black text-amber-700">${total.toFixed(2)}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  *Shipping charged once per product regardless of quantity
                </div>
              </div>
            </div> */}

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
                Buy Now (${total.toFixed(2)})
              </button>
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
    </div>
  );
}