// pages/Checkout.tsx
import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';
import {
  FaTruck, FaCreditCard, FaCheckCircle,
  FaMapMarkerAlt, FaPhoneAlt, FaLock, 
  FaHome, FaUser, FaShoppingBag,
  FaList, FaReceipt, FaArrowRight, FaArrowLeft,
  FaRegCreditCard, FaTimes,
} from 'react-icons/fa';
import { SiVisa, SiMastercard, SiAmericanexpress, SiDiscover } from 'react-icons/si';
import { RiSecurePaymentLine } from 'react-icons/ri';

// Use the actual CartItem type from CartContext instead of redefining
interface CartItemVariation {
  _id: string;
  colorName?: string;
  color?: string;
  colorCode?: string;
  images?: string[];
  image?: string;
}

interface CartItemProduct {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  shippingFee?: number;
  image?: string; // Changed to optional string
  variations?: CartItemVariation[];
}

interface CartItem {
  product: CartItemProduct;
  variationId?: string;
  quantity: number;
  selectedColor?: string;
  selectedColorCode?: string;
  selectedImageIndex?: number;  // ✅ ADDED: Selected image index
}

// Country data with validation rules
const countries = [
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', digits: 9, example: '745869521', pattern: /^[1-9][0-9]{8}$/ },
  { code: 'IN', name: 'India', dialCode: '+91', digits: 10, example: '9876543210', pattern: /^[6-9][0-9]{9}$/ },
  { code: 'US', name: 'USA/Canada', dialCode: '+1', digits: 10, example: '4112336985', pattern: /^[2-9][0-9]{9}$/ },
  { code: 'GB', name: 'UK', dialCode: '+44', digits: 10, example: '2079460958', pattern: /^[1-9][0-9]{9}$/ },
  { code: 'AU', name: 'Australia', dialCode: '+61', digits: 9, example: '412345678', pattern: /^[4-5][0-9]{8}$/ },
];

export default function Checkout() {
  const cart = useContext(CartContext)!;
  const auth = useContext(AuthContext)!;
  const navigate = useNavigate();

  // Cast selectedCartItems to CartItem[] to fix type issues
  const selectedCartItems = cart.selectedCartItems as unknown as CartItem[];
  const subtotal = cart.selectedTotalAmount;
  const itemCount = cart.selectedItemsCount;
  const shipping = cart.selectedShippingFee;
  const total = subtotal + shipping;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [touchedFields, setTouchedFields] = useState<{[key: string]: boolean}>({});

  const [formData, setFormData] = useState({
    name: auth.user?.name || '',
    address: auth.user?.address || '',
    city: '',
    phone: '',
    postalCode: '',
    paymentMethod: 'Online Payment',
    countryCode: 'LK' // Default to Sri Lanka
  });

  // Get current country object
  const currentCountry = countries.find(c => c.code === formData.countryCode) || countries[0];

  // ✅ FIX: Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    
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
  }, [step]);

  // ✅ FIXED: Added loading dependency
  useEffect(() => {
    if (selectedCartItems.length === 0 && !loading) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      setTimeout(() => navigate('/cart'), 150);
    }
  }, [selectedCartItems.length, navigate, loading]);

  // Validation functions
  const validateName = (value: string) => {
    if (!value.trim()) return 'Name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateAddress = (value: string) => {
    if (!value.trim()) return 'Address is required';
    if (value.trim().length < 10) return 'Please enter a complete address';
    return '';
  };

  const validateCity = (value: string) => {
    if (!value.trim()) return 'City is required';
    
    // Only allow letters, spaces, and hyphens
    const cityRegex = /^[A-Za-z\s\-]+$/;
    if (!cityRegex.test(value)) return 'City can only contain letters, spaces, and hyphens';
    
    if (value.trim().length < 2) return 'City must be at least 2 characters';
    return '';
  };

  const validatePhone = (value: string, countryCode: string) => {
    if (!value.trim()) return 'Phone number is required';
    
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    const country = countries.find(c => c.code === countryCode);
    if (!country) return 'Please select a valid country';
    
    // Check digit length
    if (digitsOnly.length !== country.digits) {
      return `${country.name} numbers should be ${country.digits} digits`;
    }
    
    // Check pattern
    if (!country.pattern.test(digitsOnly)) {
      return `Invalid ${country.name} phone number`;
    }
    
    return '';
  };

  const validatePostalCode = (value: string) => {
    if (!value.trim()) return '';
    if (value.trim().length < 3) return 'Postal code is too short';
    return '';
  };

  const validateForm = () => {
    const errors = {
      name: validateName(formData.name),
      address: validateAddress(formData.address),
      city: validateCity(formData.city),
      phone: validatePhone(formData.phone, formData.countryCode),
      postalCode: validatePostalCode(formData.postalCode),
    };
    
    setFormErrors(errors);
    setTouchedFields({
      name: true,
      address: true,
      city: true,
      phone: true,
      postalCode: true,
    });
    
    return !Object.values(errors).some(error => error);
  };

  const handleBackToCart = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setTimeout(() => navigate('/cart'), 150);
  };

  const handleStepChange = (newStep: number) => {
    if (newStep === 2) {
      if (!validateForm()) {
        alert('Please fix the errors in the form before proceeding');
        return;
      }
    }
    
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setTimeout(() => setStep(newStep), 150);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for city field - only allow letters, spaces, and hyphens
    if (name === 'city') {
      // Allow only letters, spaces, and hyphens
      const filteredValue = value.replace(/[^A-Za-z\s\-]/g, '');
      setFormData({ ...formData, [name]: filteredValue });
    } 
    // Special handling for phone field - only allow digits
    else if (name === 'phone') {
      // Allow only digits
      const filteredValue = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: filteredValue });
    } 
    // When country changes, clear phone validation
    else if (name === 'countryCode') {
      setFormData({ ...formData, [name]: value, phone: '' });
      setFormErrors({...formErrors, phone: ''});
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({...formErrors, [name]: ''});
    }
  };

  const handleBlur = (field: string) => {
    setTouchedFields({...touchedFields, [field]: true});
    
    // Validate the field
    let error = '';
    switch (field) {
      case 'name':
        error = validateName(formData.name);
        break;
      case 'address':
        error = validateAddress(formData.address);
        break;
      case 'city':
        error = validateCity(formData.city);
        break;
      case 'phone':
        error = validatePhone(formData.phone, formData.countryCode);
        break;
      case 'postalCode':
        error = validatePostalCode(formData.postalCode);
        break;
    }
    
    setFormErrors({...formErrors, [field]: error});
  };

  // ✅ FIX: Get variation image for cart items with selectedImageIndex
  const getItemImage = (item: CartItem) => {
    if (!item?.product) return '';
    
    // ✅ FIXED: First check if we have a selected image index
    if (item.selectedImageIndex !== undefined && item.selectedImageIndex !== null) {
      if (item.product.variations && item.variationId && item.product.variations.length > 0) {
        const variation = item.product.variations.find((v: CartItemVariation) => v._id === item.variationId);
        if (variation && variation.images && variation.images.length > 0) {
          // Use the selected image index, fallback to 0 if out of bounds
          const index = Math.min(item.selectedImageIndex, variation.images.length - 1);
          return variation.images[index];
        }
        if (variation && variation.image) {
          return variation.image;
        }
      }
    }
    
    // If no selected image index or variation not found, use the old logic
    if (item.product.variations && item.variationId && item.product.variations.length > 0) {
      const variation = item.product.variations.find((v: CartItemVariation) => v._id === item.variationId);
      if (variation && variation.images && variation.images.length > 0) {
        return variation.images[0];
      }
      if (variation && variation.image) {
        return variation.image;
      }
    }
    
    if (item.product.variations && item.product.variations.length > 0) {
      const firstVariation = item.product.variations[0];
      if (firstVariation.images && firstVariation.images.length > 0) {
        return firstVariation.images[0];
      }
      if (firstVariation.image) {
        return firstVariation.image;
      }
    }
    
    return item.product.image || '';
  };

  // ✅ FIX: Get variation color name with defensive checks
  const getItemColorName = (item: CartItem) => {
    if (item.selectedColor) return item.selectedColor;
    
    if (item.product.variations && item.variationId && item.product.variations.length > 0) {
      const variation = item.product.variations.find((v: CartItemVariation) => v._id === item.variationId);
      if (variation) {
        return variation.colorName || variation.color || '';
      }
    }
    
    return '';
  };

  // ✅ FIX: Get variation color code with defensive checks
  const getItemColorCode = (item: CartItem) => {
    if (item.selectedColorCode) return item.selectedColorCode;
    
    if (item.product.variations && item.variationId && item.product.variations.length > 0) {
      const variation = item.product.variations.find((v: CartItemVariation) => v._id === item.variationId);
      if (variation && variation.colorCode) {
        return variation.colorCode;
      }
    }
    
    return '#000000';
  };

  async function handlePlaceOrder() {
    setIsProcessing(true);
    setLoading(true);

    try {
      // Final validation before API call
      if (!validateForm()) {
        alert('Please fix the errors in the form before placing your order');
        setIsProcessing(false);
        setLoading(false);
        return;
      }

      // Use selectedCartItems
      const items = selectedCartItems.map(it => {
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
          shippingFee: it.product.shippingFee || 0,
          selectedImageIndex: it.selectedImageIndex || 0  // ✅ ADDED: Include selected image index in order
        };
      });

      const fullPhoneNumber = `${currentCountry.dialCode}${formData.phone}`;

      const orderData = {
        items,
        totalAmount: total,
        shippingFee: shipping,
        shippingAddress: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          phone: fullPhoneNumber,
          postalCode: formData.postalCode,
          country: currentCountry.name,
          countryCode: currentCountry.dialCode
        },
        paymentMethod: formData.paymentMethod
      };

      const res = await api.post('/orders', orderData);
      const orderId = res.data._id;
      
      // Clear only selected items from cart after successful order creation
      selectedCartItems.forEach(it => {
        cart.removeFromCart(it.product._id, it.variationId);
      });

      const sessionRes = await api.post('/payments/create-checkout-session', { orderId });
      const { url } = sessionRes.data;
      window.location.href = url;
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err.message || 'An error occurred while placing your order');
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
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-[#d97706]/20 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between relative">
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
              <div className="px-4 sm:px-8 py-6 border-b border-[#d97706]/20 bg-gradient-to-r from-[#d97706]/5 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#d97706]/10 rounded-xl">
                      <FaTruck className="text-[#d97706] text-xl" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">Shipping Information</h2>
                      <p className="text-xs sm:text-sm text-gray-500">Where should we deliver your order?</p>
                    </div>
                  </div>
                  {step > 1 && (
                    <button
                      onClick={() => handleStepChange(1)}
                      className="text-[#d97706] hover:text-[#b45309] font-medium text-sm px-3 sm:px-4 py-2 hover:bg-[#d97706]/10 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {step === 1 && (
                <div className="p-4 sm:p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Name Field */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-[#d97706]" />
                          <span className="text-xs sm:text-sm">Recipient's Full Name *</span>
                        </div>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('name')}
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-3 text-sm sm:text-base border rounded-lg focus:outline-none transition-all ${
                          touchedFields.name && formErrors.name 
                            ? 'border-red-500 focus:ring-2 focus:ring-red-100' 
                            : 'border-[#d97706] focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706]'
                        }`}
                        aria-label="Recipient's full name"
                      />
                      {touchedFields.name && formErrors.name && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <FaTimes className="text-xs" />
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Address Field */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-[#d97706]" />
                          <span className="text-xs sm:text-sm">Complete Address *</span>
                        </div>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        onBlur={() => handleBlur('address')}
                        placeholder="House number, street name, apartment/suite"
                        rows={3}
                        className={`w-full px-4 py-3 text-sm sm:text-base border rounded-lg focus:outline-none transition-all resize-none ${
                          touchedFields.address && formErrors.address 
                            ? 'border-red-500 focus:ring-2 focus:ring-red-100' 
                            : 'border-[#d97706] focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706]'
                        }`}
                        aria-label="Complete shipping address"
                      />
                      {touchedFields.address && formErrors.address && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <FaTimes className="text-xs" />
                          {formErrors.address}
                        </p>
                      )}
                    </div>

                    {/* City Field - Only letters, spaces, and hyphens */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <FaHome className="text-[#d97706]" />
                          <span className="text-xs sm:text-sm">City / State *</span>
                        </div>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        onBlur={() => handleBlur('city')}
                        placeholder="e.g., Colombo or New York"
                        className={`w-full px-4 py-3 text-sm sm:text-base border rounded-lg focus:outline-none transition-all ${
                          touchedFields.city && formErrors.city 
                            ? 'border-red-500 focus:ring-2 focus:ring-red-100' 
                            : 'border-[#d97706] focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706]'
                        }`}
                        aria-label="City or state"
                      />
                      {touchedFields.city && formErrors.city && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <FaTimes className="text-xs" />
                          {formErrors.city}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Only letters, spaces, and hyphens allowed
                      </p>
                    </div>

                    {/* Postal Code Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-xs sm:text-sm">Postal Code</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        onBlur={() => handleBlur('postalCode')}
                        placeholder="e.g., 10100"
                        className={`w-full px-4 py-3 text-sm sm:text-base border rounded-lg focus:outline-none transition-all ${
                          touchedFields.postalCode && formErrors.postalCode 
                            ? 'border-red-500 focus:ring-2 focus:ring-red-100' 
                            : 'border-[#d97706] focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706]'
                        }`}
                        aria-label="Postal code"
                      />
                      {touchedFields.postalCode && formErrors.postalCode && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <FaTimes className="text-xs" />
                          {formErrors.postalCode}
                        </p>
                      )}
                    </div>

                    {/* Phone Number Section */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <FaPhoneAlt className="text-[#d97706]" />
                          <span className="text-xs sm:text-sm">Contact Phone Number *</span>
                        </div>
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        {/* Country Selector */}
                        <div className="relative w-full sm:w-[350px]">
                          <select
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                            className="w-full text-sm sm:text-base appearance-none px-4 py-3 pr-10 rounded-lg border border-[#d97706] bg-[#FBF9F6FF]/10 text-[#0C0C0CFF] font-medium focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] transition-all"
                            aria-label="Country code"
                          >
                            {countries.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.dialCode} ({country.name})
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-[#d97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        
                        {/* Phone Number Input */}
                        <div className="flex-1">
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={() => handleBlur('phone')}
                            placeholder={`e.g., ${currentCountry.example}`}
                            className={`w-full text-sm sm:text-base px-4 py-3 rounded-lg border focus:outline-none transition-all ${
                              touchedFields.phone && formErrors.phone 
                                ? 'border-red-500 focus:ring-2 focus:ring-red-100' 
                                : 'border-[#d97706] focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706]'
                            }`}
                            aria-label="Phone number"
                          />
                          {touchedFields.phone && formErrors.phone ? (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                              <FaTimes className="text-xs" />
                              {formErrors.phone}
                            </p>
                          ) : (
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-xs text-gray-500">
                                Enter without country code
                              </p>
                              <span className="text-xs text-gray-400">
                                {formData.phone.length}/{currentCountry.digits} digits
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Country Information */}
                      <div className="mt-2 p-2 bg-[#d97706]/5 rounded-lg border border-[#d97706]/20">
                        <div className="text-xs text-gray-600 flex items-center gap-2">
                          <span className="font-medium">Format:</span>
                          <span>{currentCountry.dialCode} {currentCountry.example} ({currentCountry.digits} digits)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buttons for Step 1 - Responsive */}
                  <div className="pt-6 border-t border-[#d97706]/20">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <button
                        onClick={handleBackToCart}
                        className="w-full md:w-auto px-4 sm:px-6 py-3 text-sm sm:text-base border border-[#d97706] text-[#d97706] rounded-lg font-medium hover:bg-[#d97706]/10 transition-colors flex items-center justify-center gap-2"
                        aria-label="Back to cart"
                      >
                        <FaArrowLeft className="text-sm" />
                        Back to Cart
                      </button>
                      <button
                        onClick={() => handleStepChange(2)}
                        className="w-full md:w-auto px-4 sm:px-8 py-3 text-sm sm:text-base bg-gradient-to-r from-[#d97706] to-[#b45309] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#d97706]/20 transition-all flex items-center justify-center gap-2"
                        aria-label="Continue to review order"
                      >
                        Continue to Review
                        <FaArrowRight className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Review Items - FIXED RESPONSIVE DESIGN */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#d97706]/20 overflow-hidden transition-all">
              <div className="px-4 sm:px-8 py-6 border-b border-[#d97706]/20 bg-gradient-to-r from-[#d97706]/5 to-white">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-[#d97706]/10 rounded-xl">
                    <FaList className="text-[#d97706] text-lg sm:text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Review Your Order</h2>
                    <p className="text-xs sm:text-sm text-gray-500">Review items and shipping details</p>
                  </div>
                </div>
              </div>

              {step === 2 && (
                <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
                  <div className="space-y-4">
                    {selectedCartItems.map(it => {
                      const itemImage = getItemImage(it);
                      const itemColorName = getItemColorName(it);
                      const itemColorCode = getItemColorCode(it);
                      
                      return (
                        <div key={it.product._id + (it.variationId || '')} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 border border-[#d97706]/20 rounded-lg hover:bg-[#d97706]/5 transition-colors">
                          {/* Product Image - Mobile: Full width, Desktop: Fixed */}
                          <div className="flex items-center gap-3 sm:gap-4 sm:flex-shrink-0">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#d97706]/5 rounded-lg overflow-hidden border border-[#d97706]/20 p-2">
                              <img
                                src={getImageUrl(itemImage)}
                                className="w-full h-full object-contain"
                                alt={it.product.name}
                                loading="lazy"
                              />
                            </div>
                            
                            {/* Product Info - Mobile: Stacked, Desktop: Inline */}
                            <div className="flex-1 sm:hidden">
                              <h4 className="font-medium text-gray-900 text-sm sm:text-base mb-1">{it.product.name}</h4>
                              {itemColorName && (
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs text-gray-500">Color:</span>
                                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                                    <div
                                      className="w-3 h-3 rounded-full border border-gray-300 shadow-sm"
                                      style={{ backgroundColor: itemColorCode }}
                                    />
                                    <span className="text-xs font-medium text-gray-700">{itemColorName}</span>
                                  </div>
                                </div>
                              )}
                              <p className="text-xs sm:text-sm text-[#d97706]">Quantity: {it.quantity}</p>
                            </div>
                          </div>
                          
                          {/* Desktop Product Info */}
                          <div className="hidden sm:block flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-base mb-1">{it.product.name}</h4>
                            {itemColorName && (
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-gray-500">Color:</span>
                                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                                  <div
                                    className="w-3 h-3 rounded-full border border-gray-300 shadow-sm"
                                    style={{ backgroundColor: itemColorCode }}
                                  />
                                  <span className="text-xs font-medium text-gray-700">{itemColorName}</span>
                                </div>
                              </div>
                            )}
                            <p className="text-sm text-[#d97706]">Quantity: {it.quantity}</p>
                          </div>
                          
                          {/* Price Section - Mobile: Full width with flex, Desktop: Fixed */}
                          <div className="flex justify-between items-center sm:block sm:text-right mt-2 sm:mt-0">
                            <div className="sm:hidden">
                              <span className="text-xs text-gray-500">Price:</span>
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-sm sm:text-base">
                                ${((it.product.discount ? Math.round(it.product.price * (1 - it.product.discount / 100)) : it.product.price) * it.quantity).toLocaleString()}
                              </div>
                              <div className="text-xs sm:text-sm text-[#d97706]">
                                ${(it.product.discount ? Math.round(it.product.price * (1 - it.product.discount / 100)) : it.product.price).toLocaleString()} each
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Shipping Details Review */}
                  <div className="bg-[#d97706]/5 border border-[#d97706]/20 rounded-xl p-4 sm:p-6">
                    <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                      <FaTruck className="text-[#d97706] text-sm sm:text-base" />
                      Shipping Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Name</p>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{formData.name}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Phone</p>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{currentCountry.dialCode} {formData.phone}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Address</p>
                        <p className="font-medium text-gray-900 text-sm sm:text-base break-words">{formData.address}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">City</p>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{formData.city}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Postal Code</p>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{formData.postalCode || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Country</p>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{currentCountry.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Buttons for Step 2 - Responsive */}
                  <div className="pt-6 border-t border-[#d97706]/20">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 sm:gap-4">
                      <button
                        onClick={() => handleStepChange(1)}
                        className="w-full md:w-auto px-4 sm:px-6 py-3 text-sm sm:text-base border border-[#d97706] text-[#d97706] rounded-lg font-medium hover:bg-[#d97706]/10 transition-colors flex items-center justify-center gap-2"
                        aria-label="Back to shipping information"
                      >
                        <FaArrowLeft className="text-sm" />
                        Back to Shipping
                      </button>
                      <button
                        onClick={() => handleStepChange(3)}
                        className="w-full md:w-auto px-4 sm:px-8 py-3 text-sm sm:text-base bg-gradient-to-r from-[#d97706] to-[#b45309] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#d97706]/20 transition-all flex items-center justify-center gap-2"
                        aria-label="Proceed to payment"
                      >
                        Proceed to Payment
                        <FaArrowRight className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#d97706]/20 overflow-hidden transition-all">
              <div className="px-4 sm:px-8 py-6 border-b border-[#d97706]/20 bg-gradient-to-r from-[#d97706]/5 to-white">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-[#d97706]/10 rounded-xl">
                    <FaRegCreditCard className="text-[#d97706] text-lg sm:text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Payment Method</h2>
                    <p className="text-xs sm:text-sm text-gray-500">Complete your secure payment</p>
                  </div>
                </div>
              </div>

              {step === 3 && (
                <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
                  {/* Online Payment Option - Only Option */}
                  <div className="border border-[#d97706] bg-[#d97706]/10 rounded-xl p-4 sm:p-6 ring-2 ring-[#d97706] ring-offset-2">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-white text-[#d97706] rounded-lg flex-shrink-0">
                        <FaCreditCard className="text-lg sm:text-xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-2">Secure Online Payment</h4>
                        <div className="flex items-center flex-wrap gap-2 sm:gap-3 mt-2">
                          <div className="flex items-center gap-1 bg-white p-1 sm:p-1.5 rounded shadow-sm border border-gray-200">
                            <SiVisa className="text-blue-800 text-sm sm:text-base" />
                          </div>
                          <div className="flex items-center gap-1 bg-white p-1 sm:p-1.5 rounded shadow-sm border border-gray-200">
                            <SiMastercard className="text-red-600 text-sm sm:text-base" />
                          </div>
                          <div className="flex items-center gap-1 bg-white p-1 sm:p-1.5 rounded shadow-sm border border-gray-200">
                            <SiAmericanexpress className="text-blue-600 text-sm sm:text-base" />
                          </div>
                          <div className="flex items-center gap-1 bg-white p-1 sm:p-1.5 rounded shadow-sm border border-gray-200">
                            <SiDiscover className="text-orange-500 text-sm sm:text-base" />
                          </div>
                          <div className="flex items-center gap-1 bg-gradient-to-r from-[#d97706] to-[#b45309] p-1 sm:p-1.5 rounded shadow-sm">
                            <RiSecurePaymentLine className="text-white text-sm sm:text-base" />
                          </div>
                        </div>
                      </div>
                      <FaCheckCircle className="text-[#d97706] text-lg sm:text-xl flex-shrink-0" />
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-gradient-to-r from-[#d97706]/5 to-[#d97706]/10 border border-[#d97706]/20 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                        <FaLock className="text-[#d97706] text-base sm:text-lg" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 text-sm sm:text-base mb-2">Secure Checkout Process</h5>
                        <p className="text-xs sm:text-sm text-gray-600">
                          <strong>Important:</strong> This is an online-only business. Your order will be shipped only after
                          successful payment confirmation. All transactions are protected with 256-bit SSL encryption
                          and PCI-DSS compliance. We never store your card details on our servers.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Buttons for Step 3 - Responsive */}
                  <div className="pt-6 border-t border-[#d97706]/20">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 sm:gap-4">
                      <button
                        onClick={() => handleStepChange(2)}
                        className="w-full md:w-auto px-4 sm:px-6 py-3 text-sm sm:text-base border border-[#d97706] text-[#d97706] rounded-lg font-medium hover:bg-[#d97706]/10 transition-colors flex items-center justify-center gap-2"
                        aria-label="Back to review order"
                      >
                        <FaArrowLeft className="text-sm" />
                        Back to Review
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={loading || isProcessing}
                        className="w-full md:w-auto px-4 sm:px-8 py-3 text-sm sm:text-base bg-gradient-to-r from-[#d97706] to-[#b45309] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#d97706]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        aria-label={loading ? "Processing payment" : "Place order and proceed to payment"}
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
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg border border-[#d97706]/20 sticky top-6">
              {/* Summary Header */}
              <div className="px-4 sm:px-6 py-6 border-b border-[#d97706]/20 bg-gradient-to-r from-[#d97706]/5 to-white">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-3">
                  <FaReceipt className="text-[#d97706] text-sm sm:text-base" />
                  Order Summary
                </h3>
              </div>

              {/* Order Items Preview */}
              <div className="px-4 sm:px-6 py-4 border-b border-[#d97706]/20">
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedCartItems.map(it => {
                    const itemImage = getItemImage(it);
                    const itemColorName = getItemColorName(it);
                    const itemColorCode = getItemColorCode(it);
                    
                    return (
                      <div key={it.product._id + (it.variationId || '')} className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#d97706]/5 rounded-lg overflow-hidden border border-[#d97706]/20 p-1 flex-shrink-0">
                          <img
                            src={getImageUrl(itemImage)}
                            className="w-full h-full object-contain"
                            alt={it.product.name}
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-medium text-gray-900 truncate">{it.product.name}</h4>
                          {itemColorName && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <div
                                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-gray-300"
                                style={{ backgroundColor: itemColorCode }}
                              />
                              <span className="text-xs text-gray-500 truncate">{itemColorName}</span>
                            </div>
                          )}
                          <p className="text-xs text-[#d97706]">Qty: {it.quantity}</p>
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-gray-900">
                          ${((it.product.discount ? Math.round(it.product.price * (1 - it.product.discount / 100)) : it.product.price) * it.quantity).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-[#d97706]/20 space-y-3 sm:space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm sm:text-base text-gray-600">Subtotal ({itemCount} items)</span>
                  <span className="text-sm sm:text-base font-medium text-gray-900">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base text-gray-600">Shipping</span>
                    <div className="mt-1 space-y-1">
                      {Array.from(new Set(selectedCartItems.map(it => it.product._id))).map(productId => {                        
                        const item = selectedCartItems.find(it => it.product._id === productId);
                        if (!item) return null;
                        return (
                          <div key={productId} className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                            <span className="truncate max-w-[120px]">{item.product.name}</span>:
                            <span>${(item.product.shippingFee || 0).toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-900">${shipping.toLocaleString()}</span>
                </div>
              </div>

              {/* Total */}
              <div className="px-4 sm:px-6 py-4 sm:py-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <span className="text-base sm:text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">${total.toLocaleString()}</span>
                </div>

                {/* Shipping Info */}
                {step > 1 && (
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="p-3 sm:p-4 bg-[#d97706]/5 rounded-lg border border-[#d97706]/20">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <FaMapMarkerAlt className="text-[#d97706] mt-0.5 text-sm sm:text-base" />
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-900 mb-1">Shipping to</p>
                          <p className="text-xs text-gray-600 truncate">{formData.address}</p>
                          <p className="text-xs text-gray-600">{formData.city}, {formData.postalCode}</p>
                          <p className="text-xs text-gray-600">Phone: {currentCountry.dialCode} {formData.phone}</p>
                          <p className="text-xs text-gray-600">Country: {currentCountry.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Notice */}
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-[#d97706]/5 rounded-lg mb-3 sm:mb-4">
                  <FaCreditCard className="text-[#d97706] text-sm sm:text-base" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">Payment Required</p>
                    <p className="text-xs text-[#d97706]">Order ships after payment confirmation</p>
                  </div>
                </div>

                {/* Delivery Estimate */}
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-[#d97706]/5 rounded-lg">
                  <FaTruck className="text-[#d97706] text-sm sm:text-base" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">Estimated Delivery</p>
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