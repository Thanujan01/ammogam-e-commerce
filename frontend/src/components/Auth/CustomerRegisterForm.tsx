import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaPhone, FaCheck } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';

interface CustomerRegisterFormProps {
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
}

export default function CustomerRegisterForm({ onSuccess, onError }: CustomerRegisterFormProps) {
    const auth = useContext(AuthContext)!;
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (onSuccess) onSuccess('');
        if (onError) onError('');

        if (password !== confirmPassword) {
            if (onError) onError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            if (onError) onError('Password must be at least 6 characters long');
            return;
        }

        if (!termsAccepted) {
            if (onError) onError('Please accept the terms and conditions');
            return;
        }

        setLoading(true);
        try {
            await auth.register({ name, email, password, phone });
            if (onSuccess) onSuccess('Registration successful! Redirecting...');
            navigate('/');
        } catch (err: any) {
            if (onError) onError(err?.response?.data?.message || err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }

    const getPasswordStrength = () => {
        if (password.length === 0) return { width: '0%', color: 'bg-gray-300', label: '' };
        if (password.length < 6) return { width: '33%', color: 'bg-red-500', label: 'Weak' };
        if (password.length < 10) return { width: '66%', color: 'bg-yellow-500', label: 'Medium' };
        return { width: '100%', color: 'bg-green-500', label: 'Strong' };
    };

    const strength = getPasswordStrength();

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white outline-none transition-all duration-300"
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
                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white outline-none transition-all duration-300"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Phone Field */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                    </label>
                    <div className="relative">
                        <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type="tel"
                            required
                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white outline-none transition-all duration-300"
                            placeholder="+94 XX XXX XXXX"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
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
                            className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white outline-none transition-all duration-300"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {password && (
                        <div className="mt-2">
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${strength.color} transition-all duration-300`}
                                    style={{ width: strength.width }}
                                ></div>
                            </div>
                        </div>
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
                            className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white outline-none transition-all duration-300"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {confirmPassword && (
                        <div className="mt-1 text-xs flex items-center gap-1.5">
                            <FaCheck className={`text-xs ${password === confirmPassword ? 'text-green-500' : 'text-gray-400'}`} />
                            <span className={password === confirmPassword ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                Passwords {password === confirmPassword ? 'match ✓' : 'do not match'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3 mt-6">
                <input
                    type="checkbox"
                    id="customer-terms"
                    className="w-5 h-5 border-2 border-gray-300 rounded accent-green-600 focus:ring-2 focus:ring-green-300 transition-colors mt-0.5"
                    checked={termsAccepted}
                    onChange={() => setTermsAccepted(!termsAccepted)}
                    disabled={loading}
                />
                <label htmlFor="customer-terms" className="text-sm text-gray-600 cursor-pointer">
                    I agree to the{' '}
                    <Link to="/terms" className="text-green-600 hover:text-green-800 font-semibold">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-green-600 hover:text-green-800 font-semibold">
                        Privacy Policy
                    </Link>
                </label>
            </div>

            <button
                type="submit"
                disabled={loading || !termsAccepted}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-4"
            >
                <div className="flex items-center justify-center gap-2">
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
    );
}
