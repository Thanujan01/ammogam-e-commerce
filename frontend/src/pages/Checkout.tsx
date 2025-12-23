import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';
import {
  FaTruck, FaCreditCard, FaCheckCircle,
  FaMapMarkerAlt, FaPhoneAlt, FaLock, FaShieldAlt,
  FaHome, FaUser, FaShoppingBag,
  FaList, FaReceipt, FaArrowRight, FaArrowLeft,
  FaRegCreditCard, FaRegMoneyBillAlt
} from 'react-icons/fa';

export default function Checkout() {
  const cart = useContext(CartContext)!;
  const auth = useContext(AuthContext)!;
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: auth.user?.name || '',
    address: auth.user?.address || '',
    city: '',
    phone: auth.user?.phone || '',
    postalCode: '',
    paymentMethod: 'Cash on Delivery',
    countryCode: '94' // Default country code
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
    setIsProcessing(true);
    setLoading(true);
    
    try {
      const items = cart.items.map(it => ({
        product: it.product._id,
        quantity: it.quantity,
        price: it.product.price || 0
      }));

      // Combine country code and phone number
      const fullPhoneNumber = `+${formData.countryCode} ${formData.phone}`;

      const orderData = {
        items,
        totalAmount: total,
        shippingFee: shipping,
        shippingAddress: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          phone: fullPhoneNumber, // Use combined phone number
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
      setIsProcessing(false);
    }
  }

  const steps = [
    { number: 1, title: 'Shipping', icon: <FaTruck /> },
    { number: 2, title: 'Review', icon: <FaList /> },
    { number: 3, title: 'Payment', icon: <FaRegCreditCard /> }
  ];

  // Common country codes for a worldwide website
  const countryCodes = [
    { code: '1', name: 'US/Canada' },
    { code: '44', name: 'UK' },
    { code: '61', name: 'Australia' },
    { code: '64', name: 'New Zealand' },
    { code: '81', name: 'Japan' },
    { code: '82', name: 'South Korea' },
    { code: '86', name: 'China' },
    { code: '91', name: 'India' },
    { code: '94', name: 'Sri Lanka' },
    { code: '971', name: 'UAE' },
    { code: '65', name: 'Singapore' },
    { code: '60', name: 'Malaysia' },
    { code: '33', name: 'France' },
    { code: '49', name: 'Germany' },
    { code: '34', name: 'Spain' },
    { code: '39', name: 'Italy' },
    { code: '7', name: 'Russia' },
    { code: '55', name: 'Brazil' },
    { code: '52', name: 'Mexico' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-white">
      {/* Professional Header */}
      <div className="bg-white border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg shadow-md">
                  <FaShoppingBag className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
                  <p className="text-sm text-gray-500">Complete your purchase securely</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FaShieldAlt className="text-orange-600" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">Secure Checkout</p>
                <p className="text-xs text-gray-500">256-bit SSL encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-orange-100 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-4 left-0 right-0 h-1 bg-orange-200 -z-10">
              <div 
                className="h-1 bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                style={{ width: `${(step - 1) * 50}%` }}
              ></div>
            </div>
            
            {steps.map((stepItem) => (
              <div key={stepItem.number} className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                  step > stepItem.number 
                    ? 'bg-green-500 text-white' 
                    : step === stepItem.number 
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg' 
                    : 'bg-orange-100 text-orange-400'
                }`}>
                  {step > stepItem.number ? <FaCheckCircle /> : stepItem.icon}
                </div>
                <span className={`text-sm font-medium ${
                  step >= stepItem.number ? 'text-gray-900' : 'text-orange-400'
                }`}>
                  {stepItem.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Checkout Content */}
          <div className="lg:w-2/3 space-y-8">
            {/* Step 1: Shipping Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden transition-all">
              <div className="px-8 py-6 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-xl">
                      <FaTruck className="text-orange-600 text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
                      <p className="text-sm text-gray-500">Where should we deliver your order?</p>
                    </div>
                  </div>
                  {step > 1 && (
                    <button 
                      onClick={() => setStep(1)}
                      className="text-orange-600 hover:text-orange-700 font-medium text-sm px-4 py-2 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {step === 1 && (
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-orange-500" />
                          Recipient's Full Name
                        </div>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-orange-500" />
                          Complete Address
                        </div>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House number, street name, apartment/suite"
                        rows={3}
                        className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <FaHome className="text-orange-500" />
                          City / State
                        </div>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g., Colombo"
                        className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="e.g., 10100"
                        className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <FaPhoneAlt className="text-orange-500" />
                          Contact Phone Number
                        </div>
                      </label>
                      <div className="flex gap-2">
                        <div className="relative">
                          <select
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                            className="appearance-none px-4 py-3 pr-8 rounded-lg border border-orange-300 bg-orange-50 text-orange-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          >
                            {countryCodes.map((country) => (
                              <option key={country.code} value={country.code}>
                                +{country.code} ({country.name})
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="77 123 4567"
                          className="flex-1 px-4 py-3 rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Enter your phone number without the country code
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-orange-200">
                    <Link 
                      to="/cart"
                      className="px-6 py-3 border border-orange-300 text-orange-700 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center gap-2"
                    >
                      <FaArrowLeft className="text-sm" />
                      Back to Cart
                    </Link>
                    <button
                      onClick={() => {
                        if (!formData.name || !formData.address || !formData.city || !formData.phone) {
                          alert('Please fill in all required shipping information');
                          return;
                        }
                        setStep(2);
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-orange-200 transition-all flex items-center gap-2"
                    >
                      Continue to Review
                      <FaArrowRight className="text-sm" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Review Items */}
            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden transition-all">
              <div className="px-8 py-6 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <FaList className="text-orange-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Review Your Order</h2>
                    <p className="text-sm text-gray-500">Review items and shipping details</p>
                  </div>
                </div>
              </div>

              {step === 2 && (
                <div className="p-8 space-y-8">
                  <div className="space-y-4">
                    {cart.items.map(it => (
                      <div key={it.product._id} className="flex items-center gap-4 p-4 border border-orange-200 rounded-lg hover:bg-orange-50/30 transition-colors">
                        <div className="w-20 h-20 bg-orange-100 rounded-lg overflow-hidden border border-orange-200 p-2 flex-shrink-0">
                          <img 
                            src={getImageUrl(it.product.image)} 
                            className="w-full h-full object-contain" 
                            alt={it.product.name}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{it.product.name}</h4>
                          <p className="text-sm text-orange-600">Quantity: {it.quantity}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            ${((it.product.price || 0) * it.quantity).toLocaleString()}
                          </div>
                          <div className="text-sm text-orange-600">
                            ${(it.product.price || 0).toLocaleString()} each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Details Review */}
                  <div className="bg-orange-50/50 border border-orange-200 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaTruck className="text-orange-600" />
                      Shipping Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Name</p>
                        <p className="font-medium text-gray-900">{formData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Phone</p>
                        <p className="font-medium text-gray-900">+{formData.countryCode} {formData.phone}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600 mb-1">Address</p>
                        <p className="font-medium text-gray-900">{formData.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">City</p>
                        <p className="font-medium text-gray-900">{formData.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Postal Code</p>
                        <p className="font-medium text-gray-900">{formData.postalCode}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-orange-200">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 border border-orange-300 text-orange-700 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center gap-2"
                    >
                      <FaArrowLeft className="text-sm" />
                      Back to Shipping
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-orange-200 transition-all flex items-center gap-2"
                    >
                      Proceed to Payment
                      <FaArrowRight className="text-sm" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden transition-all">
              <div className="px-8 py-6 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <FaRegCreditCard className="text-orange-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                    <p className="text-sm text-gray-500">Choose how you'd like to pay</p>
                  </div>
                </div>
              </div>

              {step === 3 && (
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cash on Delivery Option */}
                    <label className={`relative cursor-pointer transition-all ${
                      formData.paymentMethod === 'Cash on Delivery' 
                        ? 'ring-2 ring-orange-500 ring-offset-2' 
                        : 'hover:ring-1 hover:ring-orange-200'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Delivery"
                        checked={formData.paymentMethod === 'Cash on Delivery'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`p-6 border rounded-xl transition-all ${
                        formData.paymentMethod === 'Cash on Delivery' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-orange-300 hover:border-orange-400'
                      }`}>
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${
                            formData.paymentMethod === 'Cash on Delivery' 
                              ? 'bg-orange-100 text-orange-600' 
                              : 'bg-orange-50 text-orange-400'
                          }`}>
                            <FaRegMoneyBillAlt className="text-xl" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-2">Cash on Delivery</h4>
                            <p className="text-sm text-gray-600 mb-3">Pay when you receive your order</p>
                            <div className="text-xs text-orange-600">
                              No upfront payment required
                            </div>
                          </div>
                          {formData.paymentMethod === 'Cash on Delivery' && (
                            <FaCheckCircle className="text-orange-600 text-xl" />
                          )}
                        </div>
                      </div>
                    </label>

                    {/* Online Payment Option */}
                    <label className={`relative cursor-pointer transition-all ${
                      formData.paymentMethod === 'Online Payment' 
                        ? 'ring-2 ring-orange-500 ring-offset-2' 
                        : 'hover:ring-1 hover:ring-orange-200'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Online Payment"
                        checked={formData.paymentMethod === 'Online Payment'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`p-6 border rounded-xl transition-all ${
                        formData.paymentMethod === 'Online Payment' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-orange-300 hover:border-orange-400'
                      }`}>
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${
                            formData.paymentMethod === 'Online Payment' 
                              ? 'bg-orange-100 text-orange-600' 
                              : 'bg-orange-50 text-orange-400'
                          }`}>
                            <FaCreditCard className="text-xl" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-2">Card / Online Payment</h4>
                            <p className="text-sm text-gray-600 mb-3">Secure payment via Stripe</p>
                            <div className="flex items-center gap-2 opacity-70">
                              <div className="h-6 w-10 bg-orange-800 rounded-sm"></div>
                              <div className="h-6 w-10 bg-red-600 rounded-sm"></div>
                              <div className="h-6 w-10 bg-yellow-400 rounded-sm"></div>
                            </div>
                          </div>
                          {formData.paymentMethod === 'Online Payment' && (
                            <FaCheckCircle className="text-orange-600 text-xl" />
                          )}
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <FaLock className="text-orange-600 text-lg" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Secure Checkout</h5>
                        <p className="text-sm text-gray-600">
                          Your payment information is encrypted and secure. We never store your card details on our servers.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-orange-200">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 border border-orange-300 text-orange-700 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center gap-2"
                    >
                      <FaArrowLeft className="text-sm" />
                      Back to Review
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px] flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : formData.paymentMethod === 'Online Payment' ? (
                        <>
                          Pay Securely
                          <FaArrowRight className="text-sm" />
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 sticky top-6">
              {/* Summary Header */}
              <div className="px-6 py-6 border-b border-orange-100 bg-gradient-to-r from-orange-50/50 to-white">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                  <FaReceipt className="text-orange-600" />
                  Order Summary
                </h3>
              </div>

              {/* Order Items Preview */}
              <div className="px-6 py-4 border-b border-orange-100">
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cart.items.map(it => (
                    <div key={it.product._id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg overflow-hidden border border-orange-200 p-1 flex-shrink-0">
                        <img 
                          src={getImageUrl(it.product.image)} 
                          className="w-full h-full object-contain" 
                          alt={it.product.name}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{it.product.name}</h4>
                        <p className="text-xs text-orange-600">Qty: {it.quantity}</p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${((it.product.price || 0) * it.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="px-6 py-6 border-b border-orange-100 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                  <span className="font-medium text-gray-900">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">$0.00</span>
                </div>
              </div>

              {/* Total */}
              <div className="px-6 py-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">${total.toLocaleString()}</span>
                </div>

                {/* Shipping Info */}
                {step > 1 && (
                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                      <div className="flex items-start gap-3">
                        <FaMapMarkerAlt className="text-orange-500 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">Shipping to</p>
                          <p className="text-xs text-gray-600">{formData.address}</p>
                          <p className="text-xs text-gray-600">{formData.city}, {formData.postalCode}</p>
                          <p className="text-xs text-gray-600">Phone: +{formData.countryCode} {formData.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Estimate */}
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <FaTruck className="text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Estimated Delivery</p>
                    <p className="text-xs text-orange-600">3-5 business days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Info */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FaShieldAlt className="text-orange-600" />
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}