import React, { useState } from 'react';
import { api } from '../api/api';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ResetPassword() {
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const nav = useNavigate();

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault();

        if (!email) {
            setError("Invalid session. Please try again.");
            return;
        }

        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        setError('');
        setMessage('');
        setLoading(true);

        try {
            await api.post('/auth/verify-otp', { email, otp });
            setIsVerified(true);
            setMessage('OTP Verified. Please set your new password.');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Invalid or expired OTP.');
        } finally {
            setLoading(false);
        }
    }

    async function handleReset(e: React.FormEvent) {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError('');
        setMessage('');
        setLoading(true);

        try {
            await api.post('/auth/reset-password', { email, otp, password });
            setMessage('Password reset successfully. Redirecting to login...');
            setTimeout(() => nav('/login'), 2000);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to reset password.');
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

                        <h1 className="text-3xl font-bold mb-2 relative z-10">Reset Password</h1>
                        <p className="text-indigo-100 opacity-90 relative z-10">
                            {isVerified ? 'Set your new password' : 'Enter OTP sent to your email'}
                        </p>
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

                        {!isVerified ? (
                            <form onSubmit={handleVerify} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">OTP Code</label>
                                    <div className="relative">
                                        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed tracking-widest text-center text-lg font-bold"
                                            placeholder="------"
                                            value={otp}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 6) setOtp(val);
                                            }}
                                            disabled={loading}
                                        />
                                    </div>
                                    <p className="text-xs text-center text-gray-500 mt-2">Enter the 6-digit code sent to {email}</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className="w-full py-4 px-6 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white font-semibold rounded-xl hover:from-[#7a3a0f] hover:to-[#904823] transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-200 relative overflow-hidden"
                                >
                                    <div className="relative z-10">
                                        {loading ? 'Verifying...' : 'Verify OTP'}
                                    </div>
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleReset} className="space-y-6 animate-fade-in-up">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                    <div className="relative">
                                        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="New password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={loading}
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                        <input
                                            type="password"
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                        {loading ? 'Resetting...' : 'Reset Password'}
                                    </div>
                                </button>
                            </form>
                        )}
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
