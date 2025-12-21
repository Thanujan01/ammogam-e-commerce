import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';
import {
  FaTruck, FaCreditCard, FaCheckCircle, FaChevronRight,
  FaMapMarkerAlt, FaPhoneAlt, FaLock,
  FaHome, FaMoneyBillWave, FaUser
} from 'react-icons/fa';

export default function Checkout() {
  const cart = useContext(CartContext)!;
  const auth = useContext(AuthContext)!;
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: auth.user?.name || '',
    address: auth.user?.address || '',
    city: '',
    phone: auth.user?.phone || '',
    postalCode: '',
    paymentMethod: 'Cash on Delivery'
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0 && !loading) {
      navigate('/cart');
    }
  }, [cart.items, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const subtotal = cart.totalAmount;
  const itemCount = cart.items.reduce((s: number, i: any) => s + i.quantity, 0);
  const shipping = subtotal > cart.freeShippingThreshold ? 0 : cart.shippingFee + (Math.max(0, itemCount - 1) * cart.feePerAdditionalItem);
  const total = subtotal + shipping;

  async function handlePlaceOrder() {
    setLoading(true);
    try {
      const items = cart.items.map(it => ({
        product: it.product._id,
        quantity: it.quantity,
        price: it.product.price || 0
      }));

      const orderData = {
        items,
        totalAmount: total,
        shippingFee: shipping,
        shippingAddress: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          phone: formData.phone,
          postalCode: formData.postalCode
        },
        paymentMethod: formData.paymentMethod
      };

      const res = await api.post('/orders', orderData);
      const orderId = res.data._id;

      if (formData.paymentMethod === 'Online Payment') {
        const sessionRes = await api.post('/payments/create-checkout-session', { orderId });
        const { url } = sessionRes.data;
        window.location.href = url;
      } else {
        // Cash on delivery
        cart.clearCart();
        navigate(`/order-success/${orderId}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Checkout Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-900 font-black text-xl">
            <span className="text-amber-600">AMMOGAM</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase tracking-widest hidden sm:inline">Checkout</span>
          </Link>
          <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
            <span className={step >= 1 ? 'text-amber-600' : ''}>Shipping</span>
            <FaChevronRight className="text-[10px]" />
            <span className={step >= 2 ? 'text-amber-600' : ''}>Review</span>
            <FaChevronRight className="text-[10px]" />
            <span className={step >= 3 ? 'text-amber-600' : ''}>Payment</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <FaLock className="text-xs" />
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Secure Transaction</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Checkout Area */}
          <div className="lg:w-2/3 space-y-6">

            {/* Step 1: Shipping Information */}
            <div className={`bg-white rounded-3xl shadow-sm border ${step === 1 ? 'border-amber-200 ring-4 ring-amber-50' : 'border-gray-100'} overflow-hidden transition-all duration-300`}>
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 1 ? 'bg-amber-600 text-white' : 'bg-green-100 text-green-600'}`}>
                    {step > 1 ? <FaCheckCircle /> : '1'}
                  </div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Shipping Information</h2>
                </div>
                {step > 1 && (
                  <button onClick={() => setStep(1)} className="text-amber-600 font-bold text-sm hover:underline">Edit</button>
                )}
              </div>

              {step === 1 && (
                <div className="p-6 sm:p-8 space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2">
                      <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                        <FaUser className="text-amber-600" />
                        Recipient's Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                        <FaMapMarkerAlt className="text-amber-600" />
                        Complete Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House No, Street Name, Apartment/Suite"
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                        <FaHome className="text-amber-600" />
                        City / State
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Colombo"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                        <FaTruck className="text-amber-600" />
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="e.g. 10100"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                        <FaPhoneAlt className="text-amber-600" />
                        Contact Phone
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-500 font-bold">+94</span>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="77 123 4567"
                          className="w-full px-4 py-3 rounded-r-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!formData.name || !formData.address || !formData.city || !formData.phone) {
                        alert('Please fill in all required fields');
                        return;
                      }
                      setStep(2);
                    }}
                    className="w-full bg-amber-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/30 flex items-center justify-center gap-3"
                  >
                    Continue to Review
                    <FaChevronRight className="text-sm" />
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Review Items */}
            <div className={`bg-white rounded-3xl shadow-sm border ${step === 2 ? 'border-amber-200 ring-4 ring-amber-50' : 'border-gray-100'} overflow-hidden transition-all duration-300`}>
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 2 ? 'bg-amber-600 text-white' : step > 2 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {step > 2 ? <FaCheckCircle /> : '2'}
                  </div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Review Order Items</h2>
                </div>
              </div>

              {step === 2 && (
                <div className="p-6 sm:p-8 space-y-6 animate-fadeIn">
                  <div className="divide-y divide-gray-100">
                    {cart.items.map(it => (
                      <div key={it.product._id} className="py-4 flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border p-1">
                          <img src={getImageUrl(it.product.image)} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 truncate">{it.product.name}</h4>
                          <p className="text-xs text-gray-500">Qty: {it.quantity}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">$ {((it.product.price || 0) * it.quantity).toLocaleString()}</div>
                          <div className="text-[10px] text-gray-400 tracking-tighter">$ {(it.product.price || 0).toLocaleString()} ea</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep(3)}
                    className="w-full bg-amber-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/30 flex items-center justify-center gap-3"
                  >
                    Proceed to Payment
                    <FaChevronRight className="text-sm" />
                  </button>
                  <button onClick={() => setStep(1)} className="w-full text-gray-500 font-bold text-sm">Back to Shipping</button>
                </div>
              )}
            </div>

            {/* Step 3: Payment Method */}
            <div className={`bg-white rounded-3xl shadow-sm border ${step === 3 ? 'border-amber-200 ring-4 ring-amber-50' : 'border-gray-100'} overflow-hidden transition-all duration-300`}>
              <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 3 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  3
                </div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Select Payment Method</h2>
              </div>

              {step === 3 && (
                <div className="p-6 sm:p-8 space-y-6 animate-fadeIn">
                  <div className="space-y-4">
                    <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'Cash on Delivery' ? 'border-amber-600 bg-amber-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Delivery"
                        checked={formData.paymentMethod === 'Cash on Delivery'}
                        onChange={handleChange}
                        className="w-5 h-5 accent-amber-600"
                      />
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-amber-600 text-2xl">
                        <FaMoneyBillWave />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-extrabold text-gray-900">Cash on Delivery</h4>
                        <p className="text-xs text-gray-500">Pay when your order reaches your doorstep</p>
                      </div>
                    </label>

                    <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'Online Payment' ? 'border-amber-600 bg-amber-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Online Payment"
                        checked={formData.paymentMethod === 'Online Payment'}
                        onChange={handleChange}
                        className="w-5 h-5 accent-amber-600"
                      />
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 text-2xl">
                        <FaCreditCard />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-extrabold text-gray-900">Card / Online Payment</h4>
                        <p className="text-xs text-gray-500">Credit Card, Debit Card, or Bank Transfer</p>
                      </div>
                      <div className="hidden sm:flex gap-1 opacity-50 grayscale">
                        <div className="h-4 w-7 bg-blue-800 rounded-sm"></div>
                        <div className="h-4 w-7 bg-red-600 rounded-sm"></div>
                      </div>
                    </label>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 items-start">
                    <FaLock className="text-amber-600 mt-1" />
                    <p className="text-xs text-amber-900/70 font-medium leading-relaxed">
                      By placing this order, you agree to our Terms of Service and Privacy Policy. AMMOGAM uses industry-standard encryption to protect your data during checkout.
                    </p>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full bg-amber-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-amber-700 transition-all shadow-xl shadow-amber-600/30 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                        <span>Processing Request...</span>
                      </div>
                    ) : (
                      <>
                        {formData.paymentMethod === 'Online Payment' ? 'Pay Now via Stripe' : 'Complete Order'}
                        <FaCheckCircle />
                      </>
                    )}
                  </button>
                  <button onClick={() => setStep(2)} className="w-full text-gray-500 font-bold text-sm">Back to Review</button>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Order Summary Stick Box */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sticky top-24">
              <h3 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-bold text-gray-900">$ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    Shipping {shipping === 0 && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">FREE</span>}
                  </span>
                  <span className={`font-bold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {shipping === 0 ? '$ 0' : `$ ${shipping.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-dashed border-gray-200 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total to Pay</span>
                  <span className="text-3xl font-black text-gray-900">
                    $ {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Delivery info summary block */}
              {step > 1 && (
                <div className="bg-gray-50 rounded-2xl p-4 space-y-3 mb-6 animate-fadeIn">
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-gray-400 mt-1" />
                    <div className="text-xs">
                      <div className="font-black text-gray-900 uppercase">Deliver to</div>
                      <div className="text-gray-600">{formData.address}, {formData.city}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaPhoneAlt className="text-gray-400 mt-1" />
                    <div className="text-xs">
                      <div className="font-black text-gray-900 uppercase">Phone</div>
                      <div className="text-gray-600">+94 {formData.phone}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FaTruck className="text-amber-500" />
                  <span className="text-xs text-gray-600 font-medium">Expected delivery in 3-5 days</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
