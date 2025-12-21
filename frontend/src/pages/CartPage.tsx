import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';
import {
  FaTrash, FaPlus, FaMinus, FaArrowLeft,
  FaShoppingCart, FaShieldAlt, FaTruck,
  FaCheckCircle
} from 'react-icons/fa';

export default function CartPage() {
  const cart = useContext(CartContext)!;
  const auth = useContext(AuthContext)!;
  const navigate = useNavigate();

  const subtotal = cart.totalAmount;
  const itemCount = cart.items.reduce((s: number, i: any) => s + i.quantity, 0);
  const shipping = subtotal > cart.freeShippingThreshold ? 0 : cart.shippingFee + (Math.max(0, itemCount - 1) * cart.feePerAdditionalItem);
  const total = subtotal + shipping;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <FaShoppingCart className="text-amber-600" />
              Your Shopping Cart
            </h1>
            <p className="text-gray-600 mt-1">
              {cart.items.length === 0
                ? 'Your cart is currently empty'
                : `You have ${cart.items.length} unique items in your cart`}
            </p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-2 text-amber-600 font-bold hover:text-amber-700 transition-colors group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Link>
        </div>

        {cart.items.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-12 text-center max-w-2xl mx-auto animate-fadeIn">
            <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
              <FaShoppingCart className="text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty!</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Browse our selection of premium items and find something you'll love.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-amber-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/30 active:scale-95"
            >
              Start Shopping Now
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Items List */}
            <div className="lg:w-2/3 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-500 uppercase tracking-widest">
                  <div className="col-span-6">Product Details</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {cart.items.map((it: any) => (
                    <div key={it.product._id} className="p-4 md:p-6 hover:bg-gray-50/50 transition-colors animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {/* Product Info */}
                        <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-xl border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-2 group cursor-pointer" onClick={() => navigate(`/products/${it.product._id}`)}>
                            <img
                              src={getImageUrl(it.product.image)}
                              alt={it.product.name}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3
                              className="font-bold text-gray-900 truncate hover:text-amber-700 cursor-pointer transition-colors"
                              onClick={() => navigate(`/products/${it.product._id}`)}
                            >
                              {it.product.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{it.product.description}</p>
                            <button
                              onClick={() => cart.removeFromCart(it.product._id)}
                              className="mt-2 text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1.5 transition-colors"
                            >
                              <FaTrash />
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Price (Desktop) */}
                        <div className="hidden md:block col-span-2 text-center font-bold text-gray-700">
                          $ {(it.product.price || 0).toLocaleString()}
                        </div>

                        {/* Quantity controls */}
                        <div className="col-span-1 md:col-span-2 flex justify-center">
                          <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                            <button
                              onClick={() => cart.updateQty(it.product._id, Math.max(1, it.quantity - 1))}
                              className="p-1.5 w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-gray-600 transition-all active:scale-95"
                            >
                              <FaMinus className="text-xs" />
                            </button>
                            <span className="w-8 text-center font-bold text-sm tracking-tighter">{it.quantity}</span>
                            <button
                              onClick={() => cart.updateQty(it.product._id, it.quantity + 1)}
                              className="p-1.5 w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-gray-600 transition-all active:scale-95"
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>
                        </div>

                        {/* Total per item */}
                        <div className="col-span-1 md:col-span-2 text-right">
                          <div className="md:hidden flex justify-between items-center mb-2 px-2 border-b border-gray-100 pb-2">
                            <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">Pricing Breakdown</span>
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="text-xs text-gray-500 mb-1">
                              $ {(it.product.price || 0).toLocaleString()} × {it.quantity} {it.quantity === 1 ? 'unit' : 'units'}
                            </span>
                            <span className="text-xl font-black text-amber-900">
                              $ {((it.product.price || 0) * it.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Free Shipping Alert */}
              {subtotal < cart.freeShippingThreshold && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4 text-blue-800 animate-pulse-slow">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                    <FaTruck />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Add $ {(cart.freeShippingThreshold - subtotal).toLocaleString()} more for FREE shipping!</p>
                    <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full transition-all duration-500"
                        style={{ width: `${(subtotal / cart.freeShippingThreshold) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Summary Panel */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sticky top-24">
                <h3 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.items.reduce((s: number, i: any) => s + i.quantity, 0)} items)</span>
                    <span className="font-bold text-gray-900">$ {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1.5">
                      Shipping Fee
                      {shipping === 0 && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">FREE</span>}
                    </span>
                    <span className={`font-bold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {shipping === 0 ? '$ 0' : `$ ${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Taxes</span>
                    <span className="font-bold text-gray-900">Calculated at checkout</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-dashed border-gray-200 mb-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Amount</span>
                      <div className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
                        <FaCheckCircle className="text-[10px]" />
                        Inclusive of all duties
                      </div>
                    </div>
                    <span className="text-3xl font-black text-gray-900">
                      $ {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {!auth.user ? (
                  <button
                    onClick={() => navigate('/login?redirect=/cart')}
                    className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black transition-all shadow-xl shadow-gray-900/30 hover:-translate-y-1 mb-6 flex items-center justify-center gap-3 active:scale-95"
                  >
                    Login to Checkout
                    <FaShoppingCart />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-amber-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-amber-700 transition-all shadow-xl shadow-amber-600/30 hover:-translate-y-1 mb-6 flex items-center justify-center gap-3 active:scale-95"
                  >
                    Checkout Now
                    <FaShoppingCart />
                  </button>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FaShieldAlt className="text-gray-400" />
                    <span className="text-xs text-gray-500">Secure 256-bit SSL encrypted checkout</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FaTruck className="text-gray-400" />
                    <span className="text-xs text-gray-500">Island-wide delivery within 3-5 days</span>
                  </div>
                </div>

                <div className="mt-8 text-center pt-6 border-t border-gray-100">
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear your entire cart?')) {
                        cart.clearCart();
                      }
                    }}
                    className="text-gray-400 hover:text-red-500 text-xs font-bold transition-colors flex items-center gap-2 mx-auto"
                  >
                    <FaTrash />
                    Clear Shopping Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
