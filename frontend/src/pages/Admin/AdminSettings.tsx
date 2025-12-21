import { useState, useEffect } from 'react';
import { api } from '../../api/api';
import { FaTruck, FaSave, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

export default function AdminSettings() {
    const [settings, setSettings] = useState({ shippingFee: 0, freeShippingThreshold: 0, feePerAdditionalItem: 0 });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            setSettings(res.data);
        } catch (error) {
            console.error("Failed to fetch settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: '', type: '' });
        try {
            const res = await api.put('/settings', settings);
            setSettings(res.data);
            setMessage({ text: 'Settings updated successfully!', type: 'success' });
        } catch (error: any) {
            console.error("Failed to update settings", error);
            setMessage({ text: error.response?.data?.message || 'Failed to update settings', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-black">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                        <FaTruck className="text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Store Settings</h1>
                        <p className="text-gray-500 text-sm">Configure shipping fees and delivery thresholds</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Base Shipping Fee ($)</label>
                            <input
                                type="number"
                                value={settings.shippingFee}
                                onChange={e => setSettings({ ...settings, shippingFee: Number(e.target.value) })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                                placeholder="350"
                            />
                            <p className="text-xs text-gray-400">Standard delivery charge applied to all orders below the threshold.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Fee Per Additional Item ($)</label>
                            <input
                                type="number"
                                value={settings.feePerAdditionalItem || 0}
                                onChange={e => setSettings({ ...settings, feePerAdditionalItem: Number(e.target.value) })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                                placeholder="0"
                            />
                            <p className="text-xs text-gray-400">Added for each unique item beyond the first. Set to 0 for flat fee.</p>
                        </div>

                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Free Shipping Threshold ($)</label>
                            <input
                                type="number"
                                value={settings.freeShippingThreshold}
                                onChange={e => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                                placeholder="5000"
                            />
                            <p className="text-xs text-gray-400">Order amount required to qualify for free delivery.</p>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                            {message.text}
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : (
                                <>
                                    <FaSave />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Preview Section */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                <h3 className="text-sm font-black text-orange-800 uppercase tracking-widest mb-4">Customer Experience Preview</h3>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                        <FaTruck />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">
                            Orders above $ {settings.freeShippingThreshold.toLocaleString()} get FREE shipping!
                        </p>
                        <p className="text-xs text-gray-500">
                            Below this, a flat fee of $ {settings.shippingFee.toLocaleString()} applies.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
