import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';
import {
  FaTrash, FaPlus, FaMinus, FaArrowLeft,
  FaShoppingCart, FaShieldAlt, FaCreditCard, FaBox,
  FaLock, FaTag, FaUser
} from 'react-icons/fa';

export default function CartPage() {
  const cart = useContext(CartContext)!;
  const auth = useContext(AuthContext)!;
  const navigate = useNavigate();

  const subtotal = cart.totalAmount;
  const itemCount = cart.items.reduce((s: number, i: any) => s + i.quantity, 0);
  const shipping = cart.shippingFee;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#d97706]/5 to-white">
      {/* Professional Header */}
      <div className="bg-white border-b border-[#d97706]/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-[#d97706] to-[#b45309] rounded-lg shadow-md">
                <FaShoppingCart className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-sm text-gray-500">
                  {cart.items.length === 0
                    ? 'Your cart is currently empty'
                    : `${itemCount} items in your cart`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/products"
                className="px-6 py-2.5 border border-[#d97706]/30 text-[#d97706] rounded-lg font-medium hover:bg-[#d97706]/10 transition-colors flex items-center gap-2 shadow-sm"
              >
                <FaArrowLeft className="text-sm" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        {cart.items.length === 0 ? (
          // Empty Cart State
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-[#d97706]/20 p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-[#d97706]/5 to-[#d97706]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#d97706]/20">
                <FaShoppingCart className="text-4xl text-[#d97706]/60" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Browse our premium selection and add items to your cart to get started with your order.
              </p>
              <button
                onClick={() => navigate('/products')}
                className="px-8 py-3.5 bg-gradient-to-r from-[#d97706] to-[#b45309] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#d97706]/20 transition-all flex items-center gap-3 mx-auto shadow-md"
              >
                <FaShoppingCart />
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:w-2/3 space-y-8">
              {/* Cart Items Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-[#d97706]/20 overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-gradient-to-r from-[#d97706]/5 to-[#d97706]/10 border-b border-[#d97706]/20">
                  <div className="col-span-6">
                    <span className="text-sm font-medium text-[#d97706] uppercase tracking-wider">Product</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-sm font-medium text-[#d97706] uppercase tracking-wider">Price</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-sm font-medium text-[#d97706] uppercase tracking-wider">Quantity</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-medium text-[#d97706] uppercase tracking-wider">Total</span>
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-[#d97706]/10">
                  {cart.items.map((it: any) => (
                    <div key={it.product._id + (it.variationId || '')} className="p-6 hover:bg-[#d97706]/5 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {/* Product Info */}
                        <div className="col-span-6 flex items-center gap-6">
                          <div
                            onClick={() => navigate(`/products/${it.product._id}`)}
                            className="w-24 h-24 bg-[#d97706]/5 rounded-xl border border-[#d97706]/20 overflow-hidden flex items-center justify-center p-3 cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <img
                              src={getImageUrl(it.product.image)}
                              alt={it.product.name}
                              className="w-full h-full object-contain hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3
                              onClick={() => navigate(`/products/${it.product._id}`)}
                              className="font-bold text-gray-900 mb-2 hover:text-[#d97706] cursor-pointer transition-colors"
                            >
                              {it.product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{it.product.description}</p>
                            {/* Display selected color if available */}
                            {it.selectedColor && (
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs text-gray-500">Color:</span>
                                <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                                  <div
                                    className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                                    style={{ backgroundColor: it.selectedColorCode || '#000' }}
                                  />
                                  <span className="text-xs font-medium text-gray-700">{it.selectedColor}</span>
                                </div>
                              </div>
                            )}
                            <button
                              onClick={() => cart.removeFromCart(it.product._id, it.variationId)}
                              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-2 transition-colors"
                            >
                              <FaTrash className="text-xs" />
                              Remove Item
                            </button>
                          </div>
                        </div>

                        {/* Price (Desktop) */}
                        <div className="hidden md:block col-span-2 text-center">
                          <div className="text-lg font-bold text-gray-900">
                            ${(it.product.discount ? Math.round(it.product.price * (1 - it.product.discount / 100)) : it.product.price).toLocaleString()}
                          </div>
                          {it.product.discount > 0 && (
                            <div className="text-xs text-gray-400 line-through">
                              ${it.product.price.toLocaleString()}
                            </div>
                          )}
                          <div className="text-sm text-[#d97706]">per unit</div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="col-span-2">
                          <div className="flex items-center justify-center">
                            <div className="flex items-center border border-[#d97706] rounded-lg">
                              <button
                                onClick={() => cart.updateQty(it.product._id, Math.max(1, it.quantity - 1), it.variationId)}
                                className="w-10 h-10 flex items-center justify-center text-[#d97706] hover:bg-[#d97706]/10 rounded-l-lg transition-colors"
                              >
                                <FaMinus className="text-sm" />
                              </button>
                              <div className="w-12 h-10 flex items-center justify-center border-x border-[#d97706] bg-white font-medium text-[#d97706]">
                                {it.quantity}
                              </div>
                              <button
                                onClick={() => cart.updateQty(it.product._id, it.quantity + 1, it.variationId)}
                                className="w-10 h-10 flex items-center justify-center text-[#d97706] hover:bg-[#d97706]/10 rounded-r-lg transition-colors"
                              >
                                <FaPlus className="text-sm" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="col-span-2 text-right">
                          <div className="text-xl font-bold text-gray-900 mb-1">
                            ${((it.product.discount ? Math.round(it.product.price * (1 - it.product.discount / 100)) : it.product.price) * it.quantity).toLocaleString()}
                          </div>
                          <div className="text-sm text-[#d97706]">
                            ${(it.product.discount ? Math.round(it.product.price * (1 - it.product.discount / 100)) : it.product.price).toLocaleString()} × {it.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>



              {/* Security & Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-[#d97706]/20 p-4 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-[#d97706]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaLock className="text-[#d97706]" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Secure Payment</h4>
                  <p className="text-xs text-[#d97706]">256-bit SSL encryption</p>
                </div>
                <div className="bg-white rounded-xl border border-[#d97706]/20 p-4 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-[#d97706]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaBox className="text-[#d97706]" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Easy Returns</h4>
                  <p className="text-xs text-[#d97706]">30-day return policy</p>
                </div>
                <div className="bg-white rounded-xl border border-[#d97706]/20 p-4 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-[#d97706]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaShieldAlt className="text-[#d97706]" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Quality Guarantee</h4>
                  <p className="text-xs text-[#d97706]">Premium products only</p>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-lg border border-[#d97706]/20 sticky top-6">
                {/* Order Summary Header */}
                <div className="px-6 py-6 border-b border-[#d97706]/20 bg-gradient-to-r from-[#d97706]/5 to-[#d97706]/10">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                    <FaShoppingCart className="text-[#d97706]" />
                    Order Summary
                  </h3>
                </div>

                {/* Order Details */}
                <div className="p-6 space-y-6">
                  {/* Items List Preview */}
                  <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                    {cart.items.map((it: any) => (
                      <div key={it.product._id + (it.variationId || '')} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#d97706]/5 rounded-lg border border-[#d97706]/20 overflow-hidden flex-shrink-0">
                          <img
                            src={getImageUrl(it.product.image)}
                            alt={it.product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{it.product.name}</p>
                          {it.selectedColor && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <div
                                className="w-3 h-3 rounded-full border border-gray-300"
                                style={{ backgroundColor: it.selectedColorCode || '#000' }}
                              />
                              <span className="text-xs text-gray-500">{it.selectedColor}</span>
                            </div>
                          )}
                          <p className="text-xs text-[#d97706]">Qty: {it.quantity}</p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ${((it.product.discount ? Math.round(it.product.price * (1 - it.product.discount / 100)) : it.product.price) * it.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between relative group">
                      <span className="text-gray-600 border-b border-dotted border-gray-400 cursor-help">Shipping</span>
                      <span className={`font-medium ${shipping === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                        {shipping === 0 ? 'FREE' : `$${shipping.toLocaleString()}`}
                      </span>

                      {/* Shipping Calculation Breakdown Tooltip/Dropdown */}
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#d97706]/20 p-4 z-20 hidden group-hover:block transition-all">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 border-b border-[#d97706]/10 pb-2">
                          Shipping Breakdown
                        </h4>
                        <div className="space-y-2">
                          {Array.from(new Set(cart.items.map((it: any) => it.product._id))).map((productId: any) => {
                            const item = cart.items.find((it: any) => it.product._id === productId)!;
                            const fee = (item.product.shippingFee || 0);
                            return (
                              <div key={productId} className="flex justify-between items-center text-xs">
                                <span className="text-gray-600 truncate max-w-[140px]">{item.product.name}</span>
                                <span className={'text-gray-900 font-medium'}>
                                  ${fee.toLocaleString()}
                                </span>
                              </div>
                            );
                          })}
                          <div className="pt-2 mt-2 border-t border-[#d97706]/10">
                            <div className="flex justify-between items-center text-xs font-bold text-gray-900">
                              <span>Total Shipping</span>
                              <span>${shipping.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#d97706]/10 text-[10px] text-gray-400 text-center">
                          * Charged once per unique product
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-[#d97706]/20 pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-gray-900">${total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Checkout Buttons */}
                  <div className="space-y-4">
                    {!auth.user ? (
                      <button
                        onClick={() => navigate('/login?redirect=/cart')}
                        className="w-full bg-gradient-to-r from-[#d97706] to-[#b45309] text-white py-3.5 rounded-lg font-medium hover:shadow-lg hover:shadow-[#d97706]/20 transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <FaUser />
                        Sign In to Checkout
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/checkout')}
                        className="w-full bg-gradient-to-r from-[#d97706] to-[#b45309] text-white py-3.5 rounded-lg font-medium hover:shadow-lg hover:shadow-[#d97706]/20 transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <FaCreditCard />
                        Proceed to Checkout
                      </button>
                    )}
                    <Link
                      to="/products"
                      className="w-full border border-[#d97706] text-[#d97706] py-3.5 rounded-lg font-medium hover:bg-[#d97706]/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaShoppingCart />
                      Continue Shopping
                    </Link>
                  </div>

                  {/* Security Badge */}
                  <div className="pt-6 border-t border-[#d97706]/20">
                    <div className="flex items-center justify-center gap-3">
                      <div className="p-2 bg-[#d97706]/10 rounded-lg">
                        <FaLock className="text-[#d97706]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Secure Checkout</p>
                        <p className="text-xs text-[#d97706]">Your payment information is protected</p>
                      </div>
                    </div>
                  </div>

                  {/* Clear Cart Button */}
                  <div className="text-center pt-4">
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to clear your cart?')) {
                          cart.clearCart();
                        }
                      }}
                      className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors flex items-center gap-2 mx-auto"
                    >
                      <FaTrash />
                      Clear Shopping Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Support Info */}
              <div className="mt-6 bg-white rounded-2xl border border-[#d97706]/20 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#d97706]/10 rounded-lg">
                    <FaTag className="text-[#d97706]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Have a Promo Code?</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Enter your promo code at checkout to save on your order.
                    </p>
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      className="w-full px-4 py-2.5 border border-[#d97706] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706]"
                    />
                    <button className="w-full mt-3 bg-gradient-to-r from-[#d97706]/5 to-[#d97706]/10 border border-[#d97706] text-[#d97706] py-2.5 rounded-lg font-medium hover:bg-[#d97706]/20 transition-colors">
                      Apply Code
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}