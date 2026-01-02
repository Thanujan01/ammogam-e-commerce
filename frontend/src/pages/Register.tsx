import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaStore, FaShoppingBag,  } from 'react-icons/fa';
import CustomerRegisterForm from '../components/Auth/CustomerRegisterForm';
import SellerRegisterForm from '../components/Auth/SellerRegisterForm';

export default function Register() {
  const [accountType, setAccountType] = useState<'customer' | 'seller'>('customer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const nav = useNavigate();

  const handleBackClick = () => {
    // Navigate to home page
    nav('/');
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl">
        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-white/20">

          {/* Card Header with Gradient */}
          <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 sm:p-10 text-center overflow-hidden">
            {/* Shimmer Effect Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_linear_infinite]"></div>

            {/* Back Button */}
            <button
                          type="button"
                          className="absolute top-5 left-5 bg-white/20 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/30 hover:-translate-x-1 z-10 focus:outline-none focus:ring-3 focus:ring-white/40"
                          onClick={handleBackClick} // This will work for both desktop and mobile
                          aria-label="Back to home"
                        >
                          <FaArrowLeft />
                        </button>

            <h1 className="text-3xl sm:text-4xl font-bold mb-2 relative z-10">Join AMMOGAM</h1>
            <p className="text-green-100 opacity-90 relative z-10">Create your account to start {accountType === 'seller' ? 'selling' : 'shopping'}</p>
          </div>

          {/* Card Content */}
          <div className="p-6 sm:p-8 md:p-10">
            {/* Account Type Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Choose Account Type</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setAccountType('customer')}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${accountType === 'customer'
                    ? 'border-green-500 bg-green-50 shadow-lg'
                    : 'border-gray-200 hover:border-green-300'
                    }`}
                >
                  <FaShoppingBag className={`text-4xl mx-auto mb-3 ${accountType === 'customer' ? 'text-green-600' : 'text-gray-400'}`} />
                  <h4 className="font-semibold text-gray-800">Customer</h4>
                  <p className="text-sm text-gray-600 mt-1">Shop products</p>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('seller')}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${accountType === 'seller'
                    ? 'border-green-500 bg-green-50 shadow-lg'
                    : 'border-gray-200 hover:border-green-300'
                    }`}
                >
                  <FaStore className={`text-4xl mx-auto mb-3 ${accountType === 'seller' ? 'text-green-600' : 'text-gray-400'}`} />
                  <h4 className="font-semibold text-gray-800">Seller</h4>
                  <p className="text-sm text-gray-600 mt-1">Sell products</p>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex items-start gap-3 animate-[shake_0.5s_ease]">
                <span className="text-red-500 mt-0.5">⚠️</span>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-5 bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 flex items-start gap-3">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* Register Form */}
            {accountType === 'customer' ? (
              <CustomerRegisterForm
                onSuccess={(msg) => setSuccess(msg)}
                onError={(msg) => setError(msg)}
              />
            ) : (
              <SellerRegisterForm
                onSuccess={(msg) => setSuccess(msg)}
                onError={(msg) => setError(msg)}
              />
            )}

            {/* Terms and Privacy Information Section */}
            <div className="mt-8 space-y-6">
              {/* Security Information */}
              {/* <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-blue-100 rounded-lg">
                    <FaLock className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">Secure Registration</h4>
                    <p className="text-sm text-blue-700">
                      Your information is protected with industry-standard encryption. 
                      We never share your personal data with third parties without your consent.
                    </p>
                  </div>
                </div>
              </div> */}

              {/* Terms and Conditions Section */}
              {/* <div className="p-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2.5 bg-amber-100 rounded-lg">
                    <FaFileContract className="text-amber-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">Terms & Conditions</h4>
                    <p className="text-sm text-amber-700">
                      By creating an account, you agree to our platform policies and guidelines.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 ml-12">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <p className="text-sm text-amber-800">
                      Read our full{' '}
                      <Link 
                        to="/terms" 
                        className="font-semibold text-amber-700 hover:text-amber-900 underline hover:no-underline transition-colors duration-200"
                        target="_blank"
                      >
                        Terms & Conditions
                      </Link>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <p className="text-sm text-amber-800">
                      Review our{' '}
                      <Link 
                        to="/privacy" 
                        className="font-semibold text-amber-700 hover:text-amber-900 underline hover:no-underline transition-colors duration-200"
                        target="_blank"
                      >
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <p className="text-sm text-amber-800">
                      {accountType === 'seller' 
                        ? 'Understand seller responsibilities and commission structure'
                        : 'Learn about buyer rights and purchase protections'}
                    </p>
                  </div>
                </div>
              </div> */}

              {/* Account Responsibilities */}
              {/* <div className="p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-emerald-100 rounded-lg">
                    <FaShieldAlt className="text-emerald-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-800 mb-1">Account Responsibilities</h4>
                    <p className="text-sm text-emerald-700">
                      {accountType === 'seller' 
                        ? 'As a seller, you are responsible for accurate product listings, timely order fulfillment, and customer support.'
                        : 'As a customer, you are responsible for providing accurate information and maintaining account security.'}
                    </p>
                    <p className="text-xs text-emerald-600 mt-2">
                      Violation of platform policies may result in account suspension or termination.
                    </p>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Login Link */}
            <div className="pt-6 border-t border-gray-200 text-center mt-6">
              <p className="text-gray-600 text-sm">
                Already have an account?
                <button
                  onClick={() => nav('/login')}
                  className="text-green-600 hover:text-green-800 font-semibold ml-1.5 transition-colors bg-transparent border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-200 rounded"
                >
                  Sign in here
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-3">
                By creating an account, you acknowledge that you have read and agree to our{' '}
                <Link 
                  to="/terms" 
                  className="text-green-600 hover:text-green-800 font-medium underline hover:no-underline"
                  target="_blank"
                >
                  Terms
                </Link>{' '}
                and{' '}
                <Link 
                  to="/privacy" 
                  className="text-green-600 hover:text-green-800 font-medium underline hover:no-underline"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}