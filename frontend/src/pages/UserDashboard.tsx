import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../api/api';
import { getImageUrl } from '../utils/imageUrl';
import {
  FaBox, FaCheckCircle,
  FaCreditCard, FaMapMarkerAlt, FaChevronRight,
  FaShoppingBag, FaUserCircle, FaExclamationCircle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const { user, updateUser } = useContext(AuthContext)!;
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my');
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.put('/auth/profile', profileData);
      updateUser(res.data);
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await api.put('/auth/change-password', {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      });
      setSuccess("Password changed successfully!");
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'processed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Dashboard Header */}
      <div className="bg-white border-b pt-10 pb-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-4 border-white shadow-lg overflow-hidden">
              {user?.avatar ? (
                <img src={getImageUrl(user.avatar)} className="w-full h-full object-cover" alt="User Profile" />
              ) : (
                <FaUserCircle className="text-6xl" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back, {user?.name}!</h1>
            <p className="text-gray-500 font-medium">{user?.email}</p>
          </div>
          <div className="md:ml-auto grid grid-cols-2 gap-3 sm:flex">
            <Link to="/cart" className="bg-white border text-gray-700 px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
              <FaShoppingBag className="text-sm" />
              Cart
            </Link>
            <button
              onClick={() => setActiveTab('profile')}
              className="bg-amber-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition-all"
            >
              Quick Settings
            </button>
            <Link to="/products" className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all col-span-2 sm:col-auto">
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Tabs */}
          <div className="lg:w-1/4 space-y-2">
            {[
              { id: 'orders', label: 'My Orders', icon: <FaBox /> },
              { id: 'profile', label: 'Account Settings', icon: <FaUserCircle /> },
              { id: 'address', label: 'Address Book', icon: <FaMapMarkerAlt /> },
              { id: 'payment', label: 'Payment Methods', icon: <FaCreditCard /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setError(null);
                  setSuccess(null);
                }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                  : 'text-gray-500 hover:bg-white hover:text-gray-900'
                  }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="lg:w-3/4">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Order History</h2>
                  <div className="text-sm font-bold text-gray-400">{orders.length} total orders</div>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaShoppingBag className="text-3xl" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't placed any orders yet. Start shopping to see your orders here!</p>
                    <Link to="/products" className="inline-flex items-center gap-2 bg-amber-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20">
                      Start Shopping
                      <FaChevronRight className="text-sm" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order._id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        {/* Order Header */}
                        <div className="bg-gray-50/50 px-8 py-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                          <div className="flex items-center gap-6">
                            <div>
                              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order #</div>
                              <div className="font-extrabold text-gray-900">...{order._id.slice(-8).toUpperCase()}</div>
                            </div>
                            <div>
                              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</div>
                              <div className="font-extrabold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div>
                              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</div>
                              <div className="font-black text-amber-700">$ {order.totalAmount.toLocaleString()}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </div>
                            <Link to={`/orders/${order._id}`} className="p-2 hover:bg-gray-200 rounded-xl transition-all text-gray-400 group">
                              <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-8">
                          <div className="space-y-4">
                            {order.items.slice(0, 2).map((item: any, idx: number) => (
                              <div key={idx} className="flex flex-wrap items-center gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border flex-shrink-0">
                                  <img
                                    src={getImageUrl(item.product?.image)}
                                    className="w-full h-full object-contain"
                                    alt={item.product?.name}
                                  />
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                  <h4 className="font-bold text-gray-900 text-sm">{item.product?.name || 'Unknown Product'}</h4>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <p className="text-xs text-gray-400 font-medium pl-1">+ {order.items.length - 2} more items</p>
                            )}
                          </div>
                        </div>

                        <div className="bg-gray-50/50 p-4 border-t border-gray-100">
                          <Link to={`/orders/${order._id}`} className="w-full flex items-center justify-center gap-2 py-2 text-amber-600 font-black text-xs uppercase tracking-widest hover:bg-amber-100 rounded-xl transition-all">
                            View Order Details
                            <FaChevronRight className="text-[10px]" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Profile Form */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 text-sm">
                      <FaUserCircle />
                    </span>
                    Update Profile
                  </h3>

                  {success && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl text-sm font-bold flex items-center gap-2"><FaCheckCircle /> {success}</div>}
                  {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-bold flex items-center gap-2"><FaExclamationCircle /> {error}</div>}

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                        <input
                          type="text"
                          value={profileData.phone}
                          onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Shipping Address</label>
                        <textarea
                          rows={3}
                          value={profileData.address}
                          onChange={e => setProfileData({ ...profileData, address: e.target.value })}
                          className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                        />
                      </div>
                    </div>
                    <button type="submit" disabled={loading} className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all">
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                </div>

                {/* Password Form */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 text-sm">
                      <FaExclamationCircle />
                    </span>
                    Change Password
                  </h3>

                  <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Old Password</label>
                      <input
                        type="password"
                        value={passwords.oldPassword}
                        onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })}
                        className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">New Password</label>
                      <input
                        type="password"
                        value={passwords.newPassword}
                        onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                        className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                      />
                    </div>
                    <button type="submit" disabled={loading} className="bg-amber-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-amber-700 transition-all">
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab !== 'orders' && activeTab !== 'profile' && (
              <div className="bg-white rounded-[2.5rem] p-20 text-center border border-gray-100 shadow-sm italic text-gray-400 font-medium">
                This section is coming soon...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
