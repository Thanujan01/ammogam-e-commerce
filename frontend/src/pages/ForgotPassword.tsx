import React, { useState } from 'react';
import { api } from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const nav = useNavigate();

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            await api.post('/auth/forgot-password', { email });
            setMessage('OTP sent to your email.');
            setTimeout(() => nav(`/reset-password?email=${encodeURIComponent(email)}`), 1500);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to send reset email.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-6">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="relative bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white p-8 text-center overflow-hidden">
                        {/* Shimmer Effect Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_linear_infinite]"></div>

                        {/* Back Button */}
                        <button
                            type="button"
                            className="absolute top-5 left-5 bg-white/20 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/30 hover:-translate-x-1 z-10 focus:outline-none focus:ring-3 focus:ring-white/40"
                            onClick={() => nav('/login')}
                            aria-label="Back to login"
                        >
                            <FaArrowLeft />
                        </button>

                        <h1 className="text-3xl font-bold mb-2 relative z-10">Forgot Password</h1>
                        <p className="text-indigo-100 opacity-90 relative z-10">Enter your email to reset your password</p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex items-start gap-3">
                                <span className="text-red-500 mt-0.5">⚠️</span>
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {message && (
                            <div className="mb-5 bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 flex items-start gap-3">
                                <span className="text-green-500 mt-0.5">✅</span>
                                <span className="text-sm">{message}</span>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white font-semibold rounded-xl hover:from-[#7a3a0f] hover:to-[#904823] transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-200 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-500"></div>
                                <div className="relative z-10">
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </div>
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition-colors duration-200">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
        @keyframes shimmer {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
