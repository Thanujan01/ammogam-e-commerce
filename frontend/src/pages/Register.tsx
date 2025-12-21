import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStore, FaShoppingBag } from 'react-icons/fa';
import CustomerRegisterForm from '../components/Auth/CustomerRegisterForm';
import SellerRegisterForm from '../components/Auth/SellerRegisterForm';

export default function Register() {
  const [accountType, setAccountType] = useState<'customer' | 'seller'>('customer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const nav = useNavigate();

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

            {/* Login Link */}
            <div className="pt-6 border-t border-gray-200 text-center mt-6">
              <p className="text-gray-600 text-sm">
                Already have an account?
                <button
                  onClick={() => nav('/login')}
                  className="text-green-600 hover:text-green-800 font-semibold ml-1.5 transition-colors bg-transparent border-none cursor-pointer"
                >
                  Sign in here
                </button>
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
