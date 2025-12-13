import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaArrowLeft, FaCheck } from 'react-icons/fa';

export default function Register() {
  const auth = useContext(AuthContext)!;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    
    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!termsAccepted) {
      setError('Please accept the terms and conditions');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    try {
      await auth.register({ name, email, password });
      nav('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  // Password strength calculation
  const getPasswordStrength = () => {
    if (password.length === 0) return { width: '0%', color: 'bg-gray-300', label: '' };
    if (password.length < 6) return { width: '33%', color: 'bg-red-500', label: 'Weak' };
    if (password.length < 10) return { width: '66%', color: 'bg-yellow-500', label: 'Medium' };
    return { width: '100%', color: 'bg-green-500', label: 'Strong' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 pt-32 md:pt-20">
      <div className="w-full max-w-[500px]">
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
            <p className="text-green-100 opacity-90 relative z-10">Create your account to start shopping</p>
          </div>

          {/* Card Content */}
          <div className="p-6 sm:p-8 md:p-10">
            {/* Error Message */}
            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex items-start gap-3 animate-[shake_0.5s_ease]">
                <span className="text-red-500 mt-0.5">⚠️</span>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={submit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input 
                    type="text" 
                    required 
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your full name" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input 
                    type="email" 
                    required 
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Create a strong password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-200"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {password && (
                  <>
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: strength.width }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-gray-600 flex items-center gap-1.5">
                      <FaCheck className={`text-xs ${password.length >= 6 ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className={password.length >= 6 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                        At least 6 characters {password.length >= 6 && '✓'}
                      </span>
                      {strength.label && (
                        <span className="ml-auto font-medium">
                          Strength: <span className={strength.color.replace('bg-', 'text-')}>{strength.label}</span>
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    required 
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Confirm your password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {confirmPassword && (
                  <div className="mt-1 text-xs flex items-center gap-1.5">
                    <FaCheck className={`text-xs ${password === confirmPassword ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={password === confirmPassword ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      Passwords {password === confirmPassword ? 'match ✓' : 'do not match'}
                    </span>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3 mt-4">
                <div className="relative flex-shrink-0">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 border-2 border-gray-300 rounded accent-green-600 focus:ring-2 focus:ring-green-300 transition-colors duration-200 mt-0.5"
                    checked={termsAccepted}
                    onChange={() => setTermsAccepted(!termsAccepted)}
                    disabled={loading}
                    id="terms"
                  />
                </div>
                <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                  I agree to the{' '}
                  <Link 
                    to="/terms" 
                    className="text-green-600 hover:text-green-800 font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-200 rounded"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link 
                    to="/privacy" 
                    className="text-green-600 hover:text-green-800 font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-200 rounded"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading || !termsAccepted} 
                className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none shadow-lg hover:shadow-xl active:translate-y-0 relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-green-200 mt-4"
              >
                {/* Shimmer effect on button */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-500"></div>
                
                <div className="flex items-center justify-center gap-2 relative z-10">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    'Create Account'
                  )}
                </div>
              </button>
            </form>

            {/* Login Link */}
            <div className="pt-6 border-t border-gray-200 text-center mt-6">
              <p className="text-gray-600 text-sm">
                Already have an account? 
                <Link 
                  to="/login" 
                  className="text-green-600 hover:text-green-800 font-semibold ml-1.5 transition-colors duration-200 relative group focus:outline-none focus:ring-2 focus:ring-green-200 rounded"
                >
                  Sign in here
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add these animations to your global CSS or Tailwind config */}
      <style>{`
        @keyframes shimmer {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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