import { useState, useContext } from 'react';
import { FiEdit, FiSave, FiX, FiUser, FiMail, FiPhone, FiMapPin, FiLock } from 'react-icons/fi';
import { User, Shield } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';

export default function AdminProfile() {
  const auth = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: auth?.user?.name || 'Admin User',
    email: auth?.user?.email || 'admin@ammogam.com',
    phone: auth?.user?.phone || '+1 234-567-8900',
    address: auth?.user?.address || '123 Admin Street, City, Country',
    role: auth?.user?.role || 'admin',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveProfile = () => {
    // Here you would typically make an API call to update the profile
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    // Here you would typically make an API call to change the password
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Password changed successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className=" bg-white rounded-xl shadow-lg p-6 text-">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">My Profile</h1>
            <p className="tex flex items-center gap-2">
              <User className="w-4 h-4" />
              Manage your personal information and settings
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {profileData.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{profileData.name}</h2>
              <p className="text-gray-600 mb-2">{profileData.email}</p>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 rounded-full text-sm font-semibold border border-pink-200">
                <Shield className="w-4 h-4" />
                {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
              </span>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <FiMail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{profileData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FiPhone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{profileData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FiMapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{profileData.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details & Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FiUser className="w-5 h-5 text-pink-600" />
                Personal Information
              </h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary1 hover:bg-pink-700 text-white rounded-lg font-edium transition-all"
                >
                  <FiEdit className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-all"
                  >
                    <FiSave className="w-4 h-4" />
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value={profileData.role}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <textarea
                  value={profileData.address}
                  onChange={e => setProfileData({ ...profileData, address: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none disabled:bg-gray-50 disabled:text-gray-600 resize-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FiLock className="w-5 h-5 text-pink-600" />
                Change Password
              </h3>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all"
                >
                  <FiLock className="w-4 h-4" />
                  Change Password
                </button>
              )}
            </div>

            {isChangingPassword ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="flex-1 px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-all"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">
                Click "Change Password" to update your password. Make sure to use a strong password with at least 6 characters.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
