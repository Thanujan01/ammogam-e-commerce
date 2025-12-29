import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaStore, FaShoppingBag, FaTimes, FaCheckCircle } from 'react-icons/fa';
import CustomerRegisterForm from '../components/Auth/CustomerRegisterForm';
import SellerRegisterForm from '../components/Auth/SellerRegisterForm';

export default function Register() {
  const [accountType, setAccountType] = useState<'customer' | 'seller'>('customer');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const nav = useNavigate();

  const handleSuccess = () => {
    // Show success modal
    setShowSuccessModal(true);
    
    // Auto-redirect to login page after 3 seconds
    setTimeout(() => {
      nav('/login');
    }, 3000);
  };

  const handleError = (msg: string) => {
    setError(msg);
    // Clear error after 5 seconds
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    // Redirect immediately when user closes modal
    nav('/login');
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
              onClick={() => nav('/')}
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

            {/* Register Form */}
            {accountType === 'customer' ? (
              <CustomerRegisterForm
                onSuccess={handleSuccess}
                onError={handleError}
              />
            ) : (
              <SellerRegisterForm
                onSuccess={handleSuccess}
                onError={handleError}
              />
            )}

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

      {/* Success Modal Popup */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform animate-slideUp overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center relative">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <FaCheckCircle className="text-white text-4xl" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
              <p className="text-green-100">Welcome to AMMOGAM</p>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-700 mb-4">Your account has been created successfully!</p>
                <div className="flex items-center justify-center gap-2 text-green-600 mb-6">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="font-medium">Redirecting to login page in 3 seconds...</p>
                </div>
                
                {/* Countdown Timer */}
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="283"
                      strokeDashoffset="283"
                      className="animate-countdown"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-green-600">3</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={closeSuccessModal}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-3 focus:ring-green-300"
                >
                  Go to Login Now
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={closeSuccessModal}
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Close modal"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>
      )}

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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes countdown {
          from {
            stroke-dashoffset: 283;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .animate-countdown {
          animation: countdown 3s linear forwards;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}