import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaApple, FaArrowLeft, FaLock, FaEnvelope } from 'react-icons/fa';

export default function Login() {
  const auth = useContext(AuthContext)!;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await auth.login(email, password);
      // redirect based on role
      console.log('Logged in user:', user);
      console.log('Role:', user?.role);

      if (user?.role === 'admin') nav('/admin');
      else nav('/dashboard');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
    } finally { 
      setLoading(false); 
    }
  }

  return (
  <div className="min-h-screen w-screen flex items-center justify-center ">
      <div className="w-full max-w-md  py-10">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="relative bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white p-8 sm:p-10 text-center overflow-hidden">
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
            
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 relative z-10">Welcome Back</h1>
            <p className="text-indigo-100 opacity-90 relative z-10">Sign in to your AMMOGAM account</p>
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

            {/* Login Form */}
            <form onSubmit={submit} className="space-y-6">
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
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Form Options */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 border-2 border-gray-300 rounded accent-indigo-600 focus:ring-2 focus:ring-indigo-300 transition-colors duration-200"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      disabled={loading}
                    />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Remember me</span>
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition-colors duration-200 relative group focus:outline-none focus:ring-2 focus:ring-indigo-200 rounded"
                >
                  Forgot Password?
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </div>

              {/* Submit Button */}
               <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-4 px-6 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white font-semibold rounded-xl hover:from-[#7a3a0f] hover:to-[#904823] transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none shadow-lg hover:shadow-xl active:translate-y-0 relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-amber-200"
              >
                {/* Shimmer effect on button */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-500"></div>
                
                <div className="flex items-center justify-center gap-2 relative z-10">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    'Sign In'
                  )}
                </div>
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <span className="px-4 text-xs text-gray-500 font-medium uppercase tracking-wider">or continue with</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            {/* Social Login */}
            <div className="space-y-3 mb-6">
              <button 
                type="button" 
                className="w-full py-3.5 px-6 border-2 border-gray-300 rounded-xl bg-white text-gray-800 font-medium hover:bg-gray-50 hover:border-gray-400 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-200"
                disabled={loading}
              >
                <FaGoogle className="text-gray-600 text-lg" />
                Continue with Google
              </button>
              <button 
                type="button" 
                className="w-full py-3.5 px-6 border-2 border-blue-600 rounded-xl bg-white text-blue-600 font-medium hover:bg-blue-50 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-200"
                disabled={loading}
              >
                <FaFacebook className="text-blue-600 text-lg" />
                Continue with Facebook
              </button>
              <button 
                type="button" 
                className="w-full py-3.5 px-6 border-2 border-black rounded-xl bg-white text-black font-medium hover:bg-gray-50 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-200"
                disabled={loading}
              >
                <FaApple className="text-black text-lg" />
                Continue with Apple
              </button>
            </div>

            {/* Register Link */}
            <div className="pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account? 
                <Link 
                  to="/register" 
                  className="text-indigo-600 hover:text-indigo-800 font-semibold ml-1.5 transition-colors duration-200 relative group focus:outline-none focus:ring-2 focus:ring-indigo-200 rounded"
                >
                  Create account
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </p>
            </div>

            {/* Admin Note */}
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="text-amber-500 text-lg">💡</span>
                <p className="text-sm text-amber-800">
                  Use same login for both admin & customer. Admins must be created in DB or seeded.
                </p>
              </div>
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