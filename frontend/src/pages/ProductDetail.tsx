import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import type { IProduct } from '../types';
import { CartContext } from '../contexts/CartContext';
import { WishlistContext } from '../contexts/WishlistContext';
import { getImageUrl } from '../utils/imageUrl';
import {
  FaShoppingCart, FaHeart, FaShareAlt, FaShieldAlt,
  FaTruck, FaUndo, FaStar, FaPlus, FaMinus,
  FaCheckCircle, FaChevronLeft
} from 'react-icons/fa';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const cart = useContext(CartContext)!;
  const { user } = useContext(AuthContext)!;
  const { isInWishlist, toggleWishlist: contextToggle } = useContext(WishlistContext)!;

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
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

  const discountPercent = product.discount || 0;
  const originalPrice = discountPercent > 0 ? (product.price / (1 - discountPercent / 100)) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs / Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors"
      >
        <FaChevronLeft className="text-sm" />
        <span>Back to products</span>
      </button>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="p-4 md:p-8 bg-gray-50 flex items-center justify-center">
            <div className="relative group w-full aspect-square max-w-lg overflow-hidden rounded-2xl bg-white shadow-sm">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
              />
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{discountPercent}% OFF
                </div>
              )}
              {product.badge && (
                <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {product.badge}
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="p-6 md:p-12 lg:p-16 flex flex-col">
            <div className="mb-2 flex justify-between items-start">
              <span className="text-amber-600 font-bold uppercase tracking-wider text-sm">
                {product.brand || 'Premium Quality'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={toggleWishlist}
                  className={`p-3 rounded-full transition-all shadow-sm ${id && isInWishlist(id) ? 'bg-red-500 text-white' : 'bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                >
                  <FaHeart />
                </button>
                <button className="p-3 rounded-full bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all shadow-sm">
                  <FaShareAlt />
                </button>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(product.rating || 4.5) ? 'fill-current' : 'text-gray-300'} />
                ))}
              </div>
              <span className="text-gray-500 text-sm font-medium border-l border-gray-200 pl-4">
                {product.sold || 124} Units Sold
              </span>
            </div>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-black text-gray-900">
                $ {product.price.toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  $ {Math.round(originalPrice).toLocaleString()}
                </span>
              )}
            </div>

            <div className="space-y-6 flex-1">
              <p className="text-gray-600 leading-bold text-lg">
                {product.description || "Indulge in the perfect blend of style and functionality. This premium item is crafted with the finest materials to ensure lasting durability and exceptional performance in your daily life."}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-6 py-4 border-y border-gray-100">
                <span className="font-bold text-gray-900">Quantity</span>
                <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-2 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                  >
                    <FaMinus />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => (product.stock && prev >= product.stock ? prev : prev + 1))}
                    className="p-2 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                  >
                    <FaPlus />
                  </button>
                </div>
                {product.stock && (
                  <span className="text-sm text-gray-500">{product.stock} pieces available</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black text-lg transition-all duration-300 transform ${isAdded
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-amber-600 text-white hover:bg-amber-700 hover:-translate-y-1 shadow-lg shadow-amber-600/30'
                    }`}
                >
                  {isAdded ? (
                    <>
                      <FaCheckCircle className="text-xl animate-bounce" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <FaShoppingCart className="text-xl" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    cart.addToCart(product, quantity);
                    navigate('/cart');
                  }}
                  className="flex-1 px-8 py-5 rounded-2xl font-black text-lg bg-gray-900 text-white hover:bg-black transition-all hover:-translate-y-1 shadow-lg shadow-gray-900/20"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Features / Benefits */}
            <div className="grid grid-cols-2 gap-4 mt-12 bg-gray-50 p-6 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm text-amber-600">
                  <FaTruck />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-gray-900 uppercase">Express</div>
                  <div className="text-gray-500">Fast Shipping</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm text-amber-600">
                  <FaShieldAlt />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-gray-900 uppercase">Secure</div>
                  <div className="text-gray-500">100% Payment</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm text-amber-600">
                  <FaUndo />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-gray-900 uppercase">Returns</div>
                  <div className="text-gray-500">30 Day Policy</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm text-amber-600">
                  <FaStar />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-gray-900 uppercase">Premium</div>
                  <div className="text-gray-500">Top Rated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
