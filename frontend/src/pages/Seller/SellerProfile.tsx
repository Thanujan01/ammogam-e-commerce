import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiLock, FiSave, FiMapPin, FiCreditCard } from 'react-icons/fi';
import { Building, UserCircle } from 'lucide-react';
import { api } from '../../api/api';

export default function SellerProfile() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Contact Info State
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Bank Details State
    const [bankName, setBankName] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [branchName, setBranchName] = useState('');

    // Password State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/sellers/profile');
            setProfile(data);
            setEmail(data.email || '');
            setPhone(data.phone || '');
            setBankName(data.bankName || '');
            setAccountHolderName(data.accountHolderName || '');
            setAccountNumber(data.accountNumber || '');
            setIfscCode(data.ifscCode || '');
            setBranchName(data.branchName || '');
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            setSaving(true);
            await api.put('/sellers/profile', {
                email,
                phone,
                bankName,
                accountHolderName,
                accountNumber,
                ifscCode,
                branchName
            });
            alert('Profile updated successfully!');
            await fetchProfile();
        } catch (error: any) {
            alert(error?.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            alert('Please fill all password fields');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            alert('New password must be at least 6 characters');
            return;
        }

        try {
            setSaving(true);
            await api.post('/sellers/profile/change-password', {
                oldPassword,
                newPassword
            });
            alert('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            alert(error?.response?.data?.message || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <UserCircle className="text-primary1" />
                            Seller Profile
                        </h1>
                        <p className="text-gray-500 mt-2">Manage your account settings and business information</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Business Details (Read-Only) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <h2 className="text-sm font-semibold text-gray-700 mb-6">Business Details (Read-Only)</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-2">Business Name</label>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <Building className="text-gray-400 w-4 h-4" />
                                    <span className="text-gray-700">{profile?.businessName || 'N/A'}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-2">Business Address</label>
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <FiMapPin className="text-gray-400 mt-1" />
                                    <span className="text-gray-700 text-sm leading-relaxed">{profile?.businessAddress || 'N/A'}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-2">Tax ID</label>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <FiCreditCard className="text-gray-400" />
                                    <span className="font-mono font-semibold text-gray-700">{profile?.taxId || 'N/A'}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-2">Owner Name</label>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <FiUser className="text-gray-400" />
                                    <span className="text-gray-700">{profile?.name || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editable Sections */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Contact Information */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <h2 className="text-sm font-semibold text-gray-700 mb-6">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-2">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary1 focus:ring-2 focus:ring-primary1/20 outline-none transition-all"
                                        placeholder="seller@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-2">Phone Number</label>
                                <div className="relative">
                                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary1 focus:ring-2 focus:ring-primary1/20 outline-none transition-all"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-md p-8">
                        <h2 className="text-sm font-bold text-primary1 mb-6">Bank Account Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-2">Bank Name</label>
                                <input
                                    type="text"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl focus:border-primary1 focus:ring-2 focus:ring-primary1/20 outline-none transition-all"
                                    placeholder="e.g., State Bank"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-2">Account Holder Name</label>
                                <input
                                    type="text"
                                    value={accountHolderName}
                                    onChange={(e) => setAccountHolderName(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl focus:border-primary1 focus:ring-2 focus:ring-primary1/20 outline-none transition-all"
                                    placeholder="Full name as per bank"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-2">Account Number</label>
                                <input
                                    type="text"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl focus:border-primary1 focus:ring-2 focus:ring-primary1/20 outline-none transition-all font-mono font-semibold"
                                    placeholder="1234567890"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-2">IFSC Code</label>
                                <input
                                    type="text"
                                    value={ifscCode}
                                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                                    className="w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl focus:border-primary1 focus:ring-2 focus:ring-primary1/20 outline-none transition-all font-mono font-semibold uppercase"
                                    placeholder="ABCD0123456"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs font-semibold text-gray-600 block mb-2">Branch Name</label>
                                <input
                                    type="text"
                                    value={branchName}
                                    onChange={(e) => setBranchName(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl focus:border-primary1 focus:ring-2 focus:ring-primary1/20 outline-none transition-all"
                                    placeholder="e.g., Main Branch, Downtown"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Profile Button */}
                    <button
                        onClick={handleUpdateProfile}
                        disabled={saving}
                        className="w-full bg-primary1 hover:bg-orange-500 text-white py-4 rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        <FiSave className="text-xl" />
                        {saving ? 'Saving...' : 'Save Profile Changes'}
                    </button>

                    {/* Change Password */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                        <h2 className="text-sm font-semibold text-gray-700 mb-6">Change Password</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-2">Current Password</label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary1 focus:ring-2 focus:ring-primary1/20 outline-none transition-all"
                                        placeholder="Enter current password"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-2">New Password</label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary1 focus:ring-2 focus:ring-primary1/20 outline-none transition-all"
                                        placeholder="Enter new password"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary1 focus:ring-2 focus:ring-primary1/20 outline-none transition-all"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleChangePassword}
                                disabled={saving}
                                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-500 text-white py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FiLock />
                                {saving ? 'Updating...' : 'Change Password'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
