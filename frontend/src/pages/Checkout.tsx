// pages/Checkout.tsx
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
  FaRegCreditCard,
} from 'react-icons/fa';
import { SiVisa, SiMastercard, SiAmericanexpress, SiDiscover } from 'react-icons/si';
import { RiSecurePaymentLine } from 'react-icons/ri';

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
    paymentMethod: 'Online Payment', // Set default to Online Payment only
    countryCode: '94' // Default country code
  });

  // ✅ FIX: Scroll to top when component mounts
  useEffect(() => {
    // Scroll to top on initial load
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    
    // Also handle browser back/forward navigation
    const handlePopState = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // ✅ FIX: Additional scroll for smoother experience on step changes
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [step]); // Runs when step changes

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0 && !loading) {
      // Scroll to top before navigating
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      setTimeout(() => navigate('/cart'), 150);
    }
  }, [cart.items, navigate]);

  // ✅ FIX: Handle back to cart with scroll
  const handleBackToCart = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setTimeout(() => navigate('/cart'), 150);
  };

  // ✅ FIX: Handle step navigation with scroll
  const handleStepChange = (newStep: number) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setTimeout(() => setStep(newStep), 150);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const subtotal = cart.totalAmount;
  const itemCount = cart.items.reduce((s: number, i: any) => s + i.quantity, 0);
  const shipping = cart.shippingFee;
  const total = subtotal + shipping;

  // ✅ FIX: Get variation image for cart items
  const getItemImage = (item: any) => {
    // If product has variations and we have a variation ID
    if (item.product.variations && item.variationId && item.product.variations.length > 0) {
      const variation = item.product.variations.find((v: any) => v._id === item.variationId);
      if (variation && variation.images && variation.images.length > 0) {
        return variation.images[0];
      }
      if (variation && variation.image) {
        return variation.image;
      }
    }
    
    // If product has variations but no specific variation selected
    if (item.product.variations && item.product.variations.length > 0) {
      // Try to get the first variation's image
      const firstVariation = item.product.variations[0];
      if (firstVariation.images && firstVariation.images.length > 0) {
        return firstVariation.images[0];
      }
      if (firstVariation.image) {
        return firstVariation.image;
      }
    }
    
    // Fall back to main product image
    return item.product.image;
  };

  // ✅ FIX: Get variation color name
  const getItemColorName = (item: any) => {
    if (item.selectedColor) return item.selectedColor;
    
    if (item.product.variations && item.variationId && item.product.variations.length > 0) {
      const variation = item.product.variations.find((v: any) => v._id === item.variationId);
      if (variation) {
        return variation.colorName || variation.color;
      }
    }
    
    return '';
  };

  // ✅ FIX: Get variation color code
  const getItemColorCode = (item: any) => {
    if (item.selectedColorCode) return item.selectedColorCode;
    
    if (item.product.variations && item.variationId && item.product.variations.length > 0) {
      const variation = item.product.variations.find((v: any) => v._id === item.variationId);
      if (variation) {
        return variation.colorCode;
      }
    }
    
    return '#000000';
  };

  async function handlePlaceOrder() {
    setIsProcessing(true);
    setLoading(true);

    try {
      const items = cart.items.map(it => {
        const itemPrice = it.product.discount && it.product.discount > 0
          ? Math.round(it.product.price * (1 - it.product.discount / 100))
          : it.product.price;

        const itemColorName = getItemColorName(it);
        const itemColorCode = getItemColorCode(it);

        return {
          product: it.product._id,
          quantity: it.quantity,
          price: itemPrice || 0,
          color: itemColorName || undefined,
          colorCode: itemColorCode || undefined,
          variationId: it.variationId || undefined,
          shippingFee: it.product.shippingFee || 0
        };
      });

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

      // Since only Online Payment is available, always redirect to Stripe
      const sessionRes = await api.post('/payments/create-checkout-session', { orderId });
      const { url } = sessionRes.data;
      window.location.href = url;
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
    <div className="min-h-screen bg-gradient-to-b from-[#d97706]/5 to-white">
      {/* Professional Header */}
      <div className="bg-white border-b border-[#d97706]/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-3" onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                setTimeout(() => navigate('/'), 150);
              }}>
                <div className="p-2 bg-gradient-to-r from-[#d97706] to-[#b45309] rounded-lg shadow-md">
                  <FaShoppingBag className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
                  <p className="text-sm text-gray-500">Complete your purchase securely</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#d97706]/10 rounded-lg">
                <FaShieldAlt className="text-[#d97706]" />
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
      <div className="bg-white border-b border-[#d97706]/20 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-4 left-0 right-0 h-1 bg-[#d97706]/20 -z-10">
              <div
                className="h-1 bg-gradient-to-r from-[#d97706] to-[#b45309] transition-all duration-500"
                style={{ width: `${(step - 1) * 50}%` }}
              ></div>
            </div>

            {steps.map((stepItem) => (
              <div key={stepItem.number} className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${step > stepItem.number
                  ? 'bg-emerald-500 text-white'
                  : step === stepItem.number
                    ? 'bg-gradient-to-r from-[#d97706] to-[#b45309] text-white shadow-lg'
                    : 'bg-[#d97706]/10 text-[#d97706]/60'
                  }`}>
                  {step > stepItem.number ? <FaCheckCircle /> : stepItem.icon}
                </div>
                <span className={`text-sm font-medium ${step >= stepItem.number ? 'text-gray-900' : 'text-[#d97706]/60'
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
            <div className="bg-white rounded-2xl shadow-lg border border-[#d97706]/20 overflow-hidden transition-all">
              <div className="px-8 py-6 border-b border-[#d97706]/20 bg-gradient-to-r from-[#d97706]/5 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#d97706]/10 rounded-xl">
                      <FaTruck className="text-[#d97706] text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
                      <p className="text-sm text-gray-500">Where should we deliver your order?</p>
                    </div>
                  </div>
                  {step > 1 && (
                    <button
                      onClick={() => handleStepChange(1)}
                      className="text-[#d97706] hover:text-[#b45309] font-medium text-sm px-4 py-2 hover:bg-[#d97706]/10 rounded-lg transition-colors"
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
                          <FaUser className="text-[#d97706]" />
                          Recipient's Full Name
                        </div>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border border-[#d97706] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] transition-all"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-[#d97706]" />
                          Complete Address
                        </div>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House number, street name, apartment/suite"
                        rows={3}
                        className="w-full px-4 py-3 border border-[#d97706] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <FaHome className="text-[#d97706]" />
                          City / State
                        </div>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g., Colombo"
                        className="w-full px-4 py-3 border border-[#d97706] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] transition-all"
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
                        className="w-full px-4 py-3 border border-[#d97706] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] transition-all"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <FaPhoneAlt className="text-[#d97706]" />
                          Contact Phone Number
                        </div>
                      </label>
                      <div className="flex gap-2">
                        <div className="relative">
                          <select
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                            className="appearance-none px-4 py-3 pr-8 rounded-lg border border-[#d97706] bg-[#d97706]/10 text-[#d97706] font-medium focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] transition-all"
                          >
                            {countryCodes.map((country) => (
                              <option key={country.code} value={country.code}>
                                +{country.code} ({country.name})
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-[#d97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          className="flex-1 px-4 py-3 rounded-lg border border-[#d97706] focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] transition-all"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Enter your phone number without the country code
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-[#d97706]/20">
                    <button
                      onClick={handleBackToCart}
                      className="px-6 py-3 border border-[#d97706] text-[#d97706] rounded-lg font-medium hover:bg-[#d97706]/10 transition-colors flex items-center gap-2"
                    >
                      <FaArrowLeft className="text-sm" />
                      Back to Cart
                    </button>
                    <button
                      onClick={() => {
                        if (!formData.name || !formData.address || !formData.city || !formData.phone) {
                          alert('Please fill in all required shipping information');
                          return;
                        }
                        handleStepChange(2);
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-[#d97706] to-[#b45309] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#d97706]/20 transition-all flex items-center gap-2"
                    >
                      Continue to Review
                      <FaArrowRight className="text-sm" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Review Items */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#d97706]/20 overflow-hidden transition-all">
              <div className="px-8 py-6 border-b border-[#d97706]/20 bg-gradient-to-r from-[#d97706]/5 to-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#d97706]/10 rounded-xl">
                    <FaList className="text-[#d97706] text-xl" />
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
                    {cart.items.map(it => {
                      const itemImage = getItemImage(it);
                      const itemColorName = getItemColorName(it);
                      const itemColorCode = getItemColorCode(it);
                      
                      return (
                        <div key={it.product._id + (it.variationId || '')} className="flex items-center gap-4 p-4 border border-[#d97706]/20 rounded-lg hover:bg-[#d97706]/5 transition-colors">
                          <div className="w-20 h-20 bg-[#d97706]/5 rounded-lg overflow-hidden border border-[#d97706]/20 p-2 flex-shrink-0">
                            <img
                              src={getImageUrl(itemImage)}
                              className="w-full h-full object-contain"
                              alt={it.product.name}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{it.product.name}</h4>
                            {itemColorName && (
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-gray-500">Color:</span>
                                <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                                  <div
                                    className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                                    style={{ backgroundColor: itemColorCode }}
                                  />
                                  <span className="text-xs font-medium text-gray-700">{itemColorName}</span>
                                </div>
                              </div>
                            )}
                            <p className="text-sm text-[#d97706]">Quantity: {it.quantity}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              ${((it.product.discount ? Math.round(it.product.price * (1 - it.product.discount / 100)) : it.product.price) * it.quantity).toLocaleString()}
                            </div>
                            <div className="text-sm text-[#d97706]">
                              ${(it.product.discount ? Math.round(it.product.price * (1 - it.product.discount / 100)) : it.product.price).toLocaleString()} each
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Shipping Details Review */}
                  <div className="bg-[#d97706]/5 border border-[#d97706]/20 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaTruck className="text-[#d97706]" />
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

                  <div className="flex justify-between items-center pt-6 border-t border-[#d97706]/20">
                    <button
                      onClick={() => handleStepChange(1)}
                      className="px-6 py-3 border border-[#d97706] text-[#d97706] rounded-lg font-medium hover:bg-[#d97706]/10 transition-colors flex items-center gap-2"
                    >
                      <FaArrowLeft className="text-sm" />
                      Back to Shipping
                    </button>
                    <button
                      onClick={() => handleStepChange(3)}
                      className="px-8 py-3 bg-gradient-to-r from-[#d97706] to-[#b45309] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#d97706]/20 transition-all flex items-center gap-2"
                    >
                      Proceed to Payment
                      <FaArrowRight className="text-sm" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#d97706]/20 overflow-hidden transition-all">
              <div className="px-8 py-6 border-b border-[#d97706]/20 bg-gradient-to-r from-[#d97706]/5 to-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#d97706]/10 rounded-xl">
                    <FaRegCreditCard className="text-[#d97706] text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                    <p className="text-sm text-gray-500">Complete your secure payment</p>
                  </div>
                </div>
              </div>

              {step === 3 && (
                <div className="p-8 space-y-8">
                  {/* Online Payment Option - Only Option */}
                  <div className="border border-[#d97706] bg-[#d97706]/10 rounded-xl p-6 ring-2 ring-[#d97706] ring-offset-2">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white text-[#d97706] rounded-lg">
                        <FaCreditCard className="text-xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2">Secure Online Payment</h4>
                        <div className="flex items-center flex-wrap gap-3 mt-2">
                          <div className="flex items-center gap-1 bg-white p-1.5 rounded shadow-sm border border-gray-200">
                            <SiVisa className="text-blue-800 text-base" />
                          </div>
                          <div className="flex items-center gap-1 bg-white p-1.5 rounded shadow-sm border border-gray-200">
                            <SiMastercard className="text-red-600 text-base" />
                          </div>
                          <div className="flex items-center gap-1 bg-white p-1.5 rounded shadow-sm border border-gray-200">
                            <SiAmericanexpress className="text-blue-600 text-base" />
                          </div>
                          <div className="flex items-center gap-1 bg-white p-1.5 rounded shadow-sm border border-gray-200">
                            <SiDiscover className="text-orange-500 text-base" />
                          </div>
                          <div className="flex items-center gap-1 bg-gradient-to-r from-[#d97706] to-[#b45309] p-1.5 rounded shadow-sm">
                            <RiSecurePaymentLine className="text-white text-base" />
                          </div>
                        </div>
                      </div>
                      <FaCheckCircle className="text-[#d97706] text-xl" />
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-gradient-to-r from-[#d97706]/5 to-[#d97706]/10 border border-[#d97706]/20 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <FaLock className="text-[#d97706] text-lg" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Secure Checkout Process</h5>
                        <p className="text-sm text-gray-600">
                          <strong>Important:</strong> This is an online-only business. Your order will be shipped only after
                          successful payment confirmation. All transactions are protected with 256-bit SSL encryption
                          and PCI-DSS compliance. We never store your card details on our servers.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-[#d97706]/20">
                    <button
                      onClick={() => handleStepChange(2)}
                      className="px-6 py-3 border border-[#d97706] text-[#d97706] rounded-lg font-medium hover:bg-[#d97706]/10 transition-colors flex items-center gap-2"
                    >
                      <FaArrowLeft className="text-sm" />
                      Back to Review
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="px-8 py-3 bg-gradient-to-r from-[#d97706] to-[#b45309] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#d97706]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px] flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        <>
                          Pay Securely
                          <FaArrowRight className="text-sm" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg border border-[#d97706]/20 sticky top-6">
              {/* Summary Header */}
              <div className="px-6 py-6 border-b border-[#d97706]/20 bg-gradient-to-r from-[#d97706]/5 to-white">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                  <FaReceipt className="text-[#d97706]" />
                  Order Summary
                </h3>
              </div>

              {/* Order Items Preview */}
              <div className="px-6 py-4 border-b border-[#d97706]/20">
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cart.items.map(it => {
                    const itemImage = getItemImage(it);
                    const itemColorName = getItemColorName(it);
                    const itemColorCode = getItemColorCode(it);
                    
                    return (
                      <div key={it.product._id + (it.variationId || '')} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#d97706]/5 rounded-lg overflow-hidden border border-[#d97706]/20 p-1 flex-shrink-0">
                          <img
                            src={getImageUrl(itemImage)}
                            className="w-full h-full object-contain"
                            alt={it.product.name}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{it.product.name}</h4>
                          {itemColorName && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <div
                                className="w-3 h-3 rounded-full border border-gray-300"
                                style={{ backgroundColor: itemColorCode }}
                              />
                              <span className="text-xs text-gray-500">{itemColorName}</span>
                            </div>
                          )}
                          <p className="text-xs text-[#d97706]">Qty: {it.quantity}</p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ${((it.product.discount ? Math.round(it.product.price * (1 - it.product.discount / 100)) : it.product.price) * it.quantity).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="px-6 py-6 border-b border-[#d97706]/20 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                  <span className="font-medium text-gray-900">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-gray-600">Shipping</span>
                    <div className="mt-1 space-y-1">
                      {Array.from(new Set(cart.items.map(it => it.product._id))).map(productId => {
                        const item = cart.items.find(it => it.product._id === productId);
                        if (!item) return null;
                        return (
                          <div key={productId} className="text-[10px] text-gray-500 flex items-center gap-1">
                            <span className="truncate max-w-[120px]">{item.product.name}</span>:
                            <span>${(item.product.shippingFee || 0).toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <span className="font-medium text-gray-900">${shipping.toLocaleString()}</span>
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
                    <div className="p-4 bg-[#d97706]/5 rounded-lg border border-[#d97706]/20">
                      <div className="flex items-start gap-3">
                        <FaMapMarkerAlt className="text-[#d97706] mt-1" />
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

                {/* Payment Notice */}
                <div className="flex items-center gap-3 p-3 bg-[#d97706]/5 rounded-lg mb-4">
                  <FaCreditCard className="text-[#d97706]" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment Required</p>
                    <p className="text-xs text-[#d97706]">Order ships after payment confirmation</p>
                  </div>
                </div>

                {/* Delivery Estimate */}
                <div className="flex items-center gap-3 p-3 bg-[#d97706]/5 rounded-lg">
                  <FaTruck className="text-[#d97706]" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Estimated Delivery</p>
                    <p className="text-xs text-[#d97706]">3-5 business days after payment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}