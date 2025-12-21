import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaStore, FaBuilding, FaPhone } from 'react-icons/fa';
import { api } from '../../api/api';

interface SellerRegisterFormProps {
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
}

export default function SellerRegisterForm({ onSuccess, onError }: SellerRegisterFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [businessPhone, setBusinessPhone] = useState('');
    const [taxId, setTaxId] = useState('');

    const [loading, setLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const nav = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (onSuccess) onSuccess('');
        if (onError) onError('');

        if (!termsAccepted) {
            if (onError) onError('Please accept the terms and conditions');
            return;
        }

        setLoading(true);
        try {
            const registrationData = {
                name,
                email,
                phone,
                businessName,
                businessAddress,
                businessPhone,
                taxId
            };
            console.log("FRONTEND DEBUG: Submitting Seller Registration Data:", registrationData);

            const response = await api.post('/sellers/register', registrationData);
            console.log("FRONTEND DEBUG: Registration Response:", response.data);

            if (onSuccess) onSuccess(response.data.message || 'Successfully registered. Admin will contact you soon.');
            setTimeout(() => nav('/login'), 5000);
        } catch (err: any) {
            if (onError) onError(err?.response?.data?.message || err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50/50 p-6 rounded-2xl border-2 border-blue-100 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaBuilding className="text-blue-600" />
                    Business Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name *</label>
                        <div className="relative">
                            <FaStore className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                required
                                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                placeholder="Official business name"
                                value={businessName}
                                onChange={e => setBusinessName(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Business Phone *</label>
                        <div className="relative">
                            <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                required
                                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                placeholder="+94 XX XXX XXXX"
                                value={businessPhone}
                                onChange={e => setBusinessPhone(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Registration No *</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                            placeholder="Business Registration Number"
                            value={taxId}
                            onChange={e => setTaxId(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Business Address *</label>
                        <textarea
                            required
                            rows={2}
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                            placeholder="Full physical address of your business"
                            value={businessAddress}
                            onChange={e => setBusinessAddress(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUser className="text-green-600" />
                    Owner Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Owner Full Name *</label>
                        <div className="relative">
                            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                required
                                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                                placeholder="Full name of the primary contact"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email *</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                required
                                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                                placeholder="email@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone *</label>
                        <div className="relative">
                            <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                required
                                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                                placeholder="+94 XX XXX XXXX"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-start gap-3 mt-8">
                <input
                    type="checkbox"
                    id="seller-terms"
                    className="w-5 h-5 border-2 border-gray-300 rounded accent-green-600 focus:ring-2 focus:ring-green-300 transition-colors mt-0.5"
                    checked={termsAccepted}
                    onChange={() => setTermsAccepted(!termsAccepted)}
                    disabled={loading}
                />
                <label htmlFor="seller-terms" className="text-sm text-gray-600 cursor-pointer">
                    I agree to the{' '}
                    <Link to="/terms" className="text-green-600 hover:text-green-800 font-semibold">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-green-600 hover:text-green-800 font-semibold">Privacy Policy</Link>
                    {' '}for sellers.
                </label>
            </div>

            <button
                type="submit"
                disabled={loading || !termsAccepted}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-4"
            >
                {loading ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing Application...</span>
                    </div>
                ) : (
                    'Submit Seller Registration'
                )}
            </button>
        </form>
    );
}

