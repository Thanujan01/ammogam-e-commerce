import { useContext, useEffect, useState, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../api/api';
import { getImageUrl } from '../utils/imageUrl';
import {
  FaBox, FaCheckCircle,
 FaChevronRight,
  FaShoppingBag, FaUserCircle, FaExclamationCircle,
  FaShoppingCart, FaCog, FaChartLine,
  FaLock, FaEdit, FaPhone, FaHome, FaEnvelope,
  FaCalendarAlt, FaUser, FaArrowRight,
  FaTruck,  FaHeart, FaFilter
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: string;
  createdAt?: string;
}

interface Order {
  _id: string;
  items: any[];
  totalAmount: number;
  status: string;
  createdAt: string;
  [key: string]: any;
}

export default function UserDashboard() {
  const { user, updateUser } = useContext(AuthContext)!;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
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
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0,
    memberSince: (user as User)?.createdAt ? new Date((user as User).createdAt!).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    }) : 'Recently'
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my');
        setOrders(res.data);
        
        // Calculate user stats
        const totalSpent = res.data.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
        const pendingOrders = res.data.filter((order: any) => 
          ['pending', 'processing', 'shipped'].includes(order.status)
        ).length;
        const completedOrders = res.data.filter((order: any) => 
          order.status === 'delivered'
        ).length;
        
        setUserStats({
          totalOrders: res.data.length,
          totalSpent,
          pendingOrders,
          completedOrders,
          memberSince: (user as User)?.createdAt ? new Date((user as User).createdAt!).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
          }) : 'Recently'
        });
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  // Filter orders based on selected status
  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') {
      return orders;
    }
    return orders.filter(order => order.status === statusFilter);
  }, [orders, statusFilter]);

  // Get count of orders for each status
  const getOrderCountByStatus = (status: string) => {
    if (status === 'all') return orders.length;
    return orders.filter(order => order.status === status).length;
  };

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

  const getStatusBadge = (status: string) => {
    const baseStyle = "px-3 py-1.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'pending': return `${baseStyle} bg-[#d97706]/10 text-[#d97706] border border-[#d97706]/20`;
      case 'processing': return `${baseStyle} bg-[#d97706]/10 text-[#d97706] border border-[#d97706]/20`;
      case 'shipped': return `${baseStyle} bg-[#d97706]/10 text-[#d97706] border border-[#d97706]/20`;
      case 'delivered': return `${baseStyle} bg-emerald-100 text-emerald-800 border border-emerald-200`;
      case 'cancelled': return `${baseStyle} bg-red-100 text-red-800 border border-red-200`;
      default: return `${baseStyle} bg-gray-100 text-gray-800 border border-gray-200`;
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setError(null);
    setSuccess(null);
    // Reset filter when switching to orders tab
    if (tabId === 'orders') {
      setStatusFilter('all');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#d97706]/5 to-white">
      {/* Header with #d97706 color */}
      <div className="bg-gradient-to-r from-[#d97706] to-[#d97706] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden shadow-lg">
                  {user?.avatar ? (
                    <img 
                      src={getImageUrl(user.avatar)} 
                      className="w-full h-full object-cover" 
                      alt="Profile" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#d97706] to-[#b45309] flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                  <FaCheckCircle className="text-white text-xs" />
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <p className="text-[#d97706]/90 text-sm mt-1">{user?.email}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Link 
                to="/cart" 
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2 text-sm transition-colors"
              >
                <FaShoppingBag className="text-sm" />
                Cart
              </Link>
              <button
                onClick={() => handleTabChange('profile')}
                className="px-4 py-2 bg-white text-[#d97706] hover:bg-[#d97706]/2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <FaEdit className="text-sm" />
                Edit Profile
              </button>
              <Link 
                to="/products" 
                className="px-4 py-2 bg-white text-[#d97706] hover:bg-[#d97706]/2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <FaShoppingCart className="text-sm" />
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg border border-[#d97706]/20 overflow-hidden">
              

              {/* Navigation */}
              <div className="p-4 space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: <FaChartLine className="w-4 h-4" /> },
                  { id: 'orders', label: 'My Orders', icon: <FaBox className="w-4 h-4" />, count: orders.length },
                  { id: 'profile', label: 'Account Settings', icon: <FaUserCircle className="w-4 h-4" /> },
                  
                  // { id: 'address', label: 'Address Book', icon: <FaMapMarkerAlt className="w-4 h-4" /> },
                  // { id: 'payment', label: 'Payment Methods', icon: <FaCreditCard className="w-4 h-4" /> },
                  
                  // { id: 'settings', label: 'Settings', icon: <FaCog className="w-4 h-4" /> },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${activeTab === tab.id
                      ? 'bg-[#d97706]/10 text-[#d97706] border-l-4 border-[#d97706]'
                      : 'text-gray-700 hover:bg-[#d97706]/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${activeTab === tab.id ? 'bg-[#d97706]/20 text-[#d97706]' : 'bg-gray-100 text-gray-600'}`}>
                        {tab.icon}
                      </div>
                      <span className="font-medium text-sm">{tab.label}</span>
                    </div>
                    {tab.count !== undefined && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${activeTab === tab.id ? 'bg-[#d97706] text-white' : 'bg-gray-200 text-gray-700'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Account Status */}
              <div className="p-6 border-t border-[#d97706]/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Account Status</span>
                  <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium">
                    Active
                  </span>
                </div>
                <div className="w-full bg-[#d97706]/10 rounded-full h-1.5">
                  <div className="bg-[#d97706] h-1.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Welcome Card */}
                <div className="bg-white rounded-xl shadow-lg border border-[#d97706]/20 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
                      <p className="text-gray-600 mt-1">Here's an overview of your account activity</p>
                    </div>
                    {/* <div className="text-sm text-[#d97706]">
                      <FaCalendarAlt className="inline mr-1" />
                      Updated just now
                    </div> */}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-[#d97706]/5 to-[#d97706]/10 border border-[#d97706]/20 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-[#d97706]/10 rounded-lg">
                          <FaBox className="text-[#d97706]" />
                        </div>
                        <div className="text-3xl font-bold text-[#d97706]">{userStats.totalOrders}</div>
                      </div>
                      <h3 className="font-semibold text-gray-700 mb-1">Total Orders</h3>
                      <p className="text-sm text-[#d97706]">All time purchases</p>
                    </div>
                    
                    {/* <div className="bg-gradient-to-r from-[#d97706]/5 to-[#d97706]/10 border border-[#d97706]/20 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-[#d97706]/10 rounded-lg">
                          <FaWallet className="text-[#d97706]" />
                        </div>
                        <div className="text-3xl font-bold text-[#d97706]">${userStats.totalSpent.toLocaleString()}</div>
                      </div>
                      <h3 className="font-semibold text-gray-700 mb-1">Total Spent</h3>
                      <p className="text-sm text-[#d97706]">Lifetime value</p>
                    </div> */}
                    
                    <div className="bg-gradient-to-r from-[#d97706]/5 to-[#d97706]/10 border border-[#d97706]/20 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-[#d97706]/10 rounded-lg">
                          <FaTruck className="text-[#d97706]" />
                        </div>
                        <div className="text-3xl font-bold text-[#d97706]">{userStats.pendingOrders}</div>
                      </div>
                      <h3 className="font-semibold text-gray-700 mb-1">Active Orders</h3>
                      <p className="text-sm text-[#d97706]">Currently processing</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-100 rounded-lg">
                          <FaCheckCircle className="text-emerald-600" />
                        </div>
                        <div className="text-3xl font-bold text-emerald-600">{userStats.completedOrders}</div>
                      </div>
                      <h3 className="font-semibold text-gray-700 mb-1">Completed</h3>
                      <p className="text-sm text-emerald-600">Delivered orders</p>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                      <button 
                        onClick={() => handleTabChange('orders')}
                        className="text-[#d97706] hover:text-[#b45309] text-sm font-medium flex items-center gap-1"
                      >
                        View all
                        <FaArrowRight className="text-xs" />
                      </button>
                    </div>
                    
                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-[#d97706]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaShoppingBag className="text-[#d97706]/60 text-xl" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h4>
                        <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                        <Link 
                          to="/products" 
                          className="inline-flex items-center gap-2 bg-[#d97706] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#b45309] transition-colors"
                        >
                          <FaShoppingCart />
                          Start Shopping
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.slice(0, 3).map((order) => (
                          <div key={order._id} className="border border-[#d97706]/20 rounded-lg p-4 hover:bg-[#d97706]/5 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-4">
                                <div className="font-medium text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</div>
                                <span className={getStatusBadge(order.status)}>
                                  {order.status}
                                </span>
                              </div>
                              <div className="text-sm text-[#d97706]">
                                <FaCalendarAlt className="inline mr-1" />
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-600">
                                {order.items.length} item{order.items.length !== 1 ? 's' : ''} • ${order.totalAmount.toLocaleString()}
                              </div>
                              <button 
                                onClick={() => handleTabChange('orders')}
                                className="text-[#d97706] hover:text-[#b45309] text-sm font-medium flex items-center gap-1"
                              >
                                View details
                                <FaChevronRight className="text-xs" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Link 
                    to="/products" 
                    className="bg-white rounded-xl shadow-lg border border-[#d97706]/20 p-6 hover:border-[#d97706] hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#d97706]/10 rounded-lg group-hover:bg-[#d97706]/20 transition-colors">
                        <FaShoppingCart className="text-[#d97706]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Continue Shopping</h4>
                        <p className="text-sm text-gray-600 mt-1">Browse products</p>
                      </div>
                    </div>
                  </Link>
                  
                  <button 
                    onClick={() => handleTabChange('wishlist')}
                    className="bg-white rounded-xl shadow-lg border border-[#d97706]/20 p-6 hover:border-[#d97706] hover:shadow-xl transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#d97706]/10 rounded-lg group-hover:bg-[#d97706]/20 transition-colors">
                        <FaHeart className="text-[#d97706]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Wishlist</h4>
                        <p className="text-sm text-gray-600 mt-1">Saved items</p>
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleTabChange('profile')}
                    className="bg-white rounded-xl shadow-lg border border-[#d97706]/20 p-6 hover:border-[#d97706] hover:shadow-xl transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#d97706]/10 rounded-lg group-hover:bg-[#d97706]/20 transition-colors">
                        <FaEdit className="text-[#d97706]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Update Profile</h4>
                        <p className="text-sm text-gray-600 mt-1">Edit your details</p>
                      </div>
                    </div>
                  </button>
                  
                  <Link 
                    to="/support" 
                    className="bg-white rounded-xl shadow-lg border border-[#d97706]/20 p-6 hover:border-[#d97706] hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#d97706]/10 rounded-lg group-hover:bg-[#d97706]/20 transition-colors">
                        <FaCog className="text-[#d97706]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Get Help</h4>
                        <p className="text-sm text-gray-600 mt-1">Contact support</p>
                      </div>
                    </div>
                  </Link>
                </div> */}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg border border-[#d97706]/20 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#d97706]/10 rounded-lg">
                        <FaBox className="text-[#d97706] text-xl" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
                        <p className="text-gray-600 mt-1">Track and manage your purchases</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* <span className="px-4 py-2 bg-[#d97706]/10 text-[#d97706] rounded-lg text-sm font-medium">
                        {filteredOrders.length} orders
                      </span> */}
                      <div className="relative">
                        <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d97706] z-10" />
                        <select 
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-[#d97706] rounded-lg bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#d97706] appearance-none cursor-pointer"
                        >
                          <option value="all">All Status ({orders.length})</option>
                          <option value="pending">Pending ({getOrderCountByStatus('pending')})</option>
                          <option value="processing">Processing ({getOrderCountByStatus('processing')})</option>
                          <option value="shipped">Shipped ({getOrderCountByStatus('shipped')})</option>
                          <option value="delivered">Delivered ({getOrderCountByStatus('delivered')})</option>
                          <option value="cancelled">Cancelled ({getOrderCountByStatus('cancelled')})</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {loading ? (
                    <div className="py-16 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-[#d97706] border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-500 font-medium">Loading orders...</p>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="py-20 text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-[#d97706]/5 to-[#d97706]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#d97706]/20">
                        <FaBox className="text-3xl text-[#d97706]/60" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {statusFilter === 'all' ? 'No orders yet' : `No ${statusFilter} orders`}
                      </h3>
                      <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        {statusFilter === 'all' 
                          ? "You haven't placed any orders yet. Start shopping to see your order history here."
                          : `You don't have any orders with "${statusFilter}" status.`
                        }
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                          to="/products" 
                          className="inline-flex items-center gap-2 bg-[#d97706] text-white px-6 py-3.5 rounded-lg font-medium hover:bg-[#b45309] transition-colors"
                        >
                          <FaShoppingCart />
                          Start Shopping
                        </Link>
                        {statusFilter !== 'all' && (
                          <button
                            onClick={() => setStatusFilter('all')}
                            className="inline-flex items-center gap-2 border border-[#d97706] text-[#d97706] px-6 py-3.5 rounded-lg font-medium hover:bg-[#d97706]/10 transition-colors"
                          >
                            <FaFilter />
                            Show All Orders
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredOrders.map((order) => (
                        <div key={order._id} className="border border-[#d97706]/20 rounded-xl overflow-hidden hover:shadow-lg transition-shadow hover:border-[#d97706]">
                          {/* Order Header */}
                          <div className="bg-gradient-to-r from-[#d97706]/5 to-[#d97706]/10 px-6 py-4 border-b border-[#d97706]/20">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div className="flex items-center gap-6">
                                <div>
                                  <div className="text-xs font-medium text-[#d97706] uppercase tracking-wider mb-1">Order #</div>
                                  <div className="font-mono font-bold text-[#d97706]">#{order._id.slice(-8).toUpperCase()}</div>
                                </div>
                                <div>
                                  <div className="text-xs font-medium text-[#d97706] uppercase tracking-wider mb-1">Date</div>
                                  <div className="font-medium text-gray-900">
                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs font-medium text-[#d97706] uppercase tracking-wider mb-1">Total</div>
                                  <div className="font-bold text-[#d97706]">${order.totalAmount.toLocaleString()}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={getStatusBadge(order.status)}>
                                  {order.status}
                                </span>
                                <Link 
                                  to={`/orders/${order._id}`}
                                  className="p-2 hover:bg-[#d97706]/10 rounded-lg transition-colors text-[#d97706] hover:text-[#b45309]"
                                >
                                  <FaChevronRight />
                                </Link>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {order.items.slice(0, 2).map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 p-3 border border-[#d97706]/10 rounded-lg hover:bg-[#d97706]/5 transition-colors">
                                  <div className="w-16 h-16 bg-[#d97706]/5 rounded-lg overflow-hidden border border-[#d97706]/10 flex-shrink-0">
                                    <img
                                      src={getImageUrl(item.product?.image)}
                                      className="w-full h-full object-contain"
                                      alt={item.product?.name}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 line-clamp-1">
                                      {item.product?.name || 'Unknown Product'}
                                    </h4>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="text-sm text-[#d97706]">Qty: {item.quantity}</span>
                                      <span className="font-medium text-[#d97706]">
                                        ${(item.price * item.quantity).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {order.items.length > 2 && (
                              <div className="mt-4 text-center">
                                <span className="text-sm text-[#d97706] font-medium px-4 py-2 bg-[#d97706]/10 rounded-full">
                                  + {order.items.length - 2} more items
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Order Footer */}
                          <div className="bg-[#d97706]/5 px-6 py-4 border-t border-[#d97706]/20">
                            <div className="flex flex-wrap gap-3">
                              <Link 
                                to={`/orders/${order._id}`}
                                className="inline-flex items-center justify-center flex-1 py-2.5 bg-[#d97706] text-white font-medium rounded-lg hover:bg-[#b45309] transition-colors"
                              >
                                View Order Details
                                <FaChevronRight className="ml-2 text-sm" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                {/* Profile Form */}
                <div className="bg-white rounded-xl shadow-lg border border-[#d97706]/20 p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-[#d97706]/10 rounded-lg">
                      <FaUserCircle className="text-[#d97706] text-xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                      <p className="text-gray-500">Update your personal details</p>
                    </div>
                  </div>

                  {success && (
                    <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-3">
                        <FaCheckCircle className="text-emerald-600" />
                        <span className="font-medium">{success}</span>
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                      <div className="flex items-center gap-3">
                        <FaExclamationCircle className="text-red-600" />
                        <span className="font-medium">{error}</span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d97706]">
                            <FaUser />
                          </div>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-[#d97706] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] transition-all bg-white"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d97706]">
                            <FaEnvelope />
                          </div>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-[#d97706] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] transition-all bg-white"
                            placeholder="Enter email address"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d97706]">
                            <FaPhone />
                          </div>
                          <input
                            type="text"
                            value={profileData.phone}
                            onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-[#d97706] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] transition-all bg-white"
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Shipping Address
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-4 text-[#d97706]">
                            <FaHome />
                          </div>
                          <textarea
                            rows={3}
                            value={profileData.address}
                            onChange={e => setProfileData({ ...profileData, address: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-[#d97706] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] transition-all bg-white resize-none"
                            placeholder="Enter your complete shipping address"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-[#d97706]/20">
                      <button
                        type="button"
                        onClick={() => handleTabChange('dashboard')}
                        className="px-6 py-3 border border-[#d97706] text-[#d97706] font-medium rounded-lg hover:bg-[#d97706]/10 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-[#d97706] text-white font-medium rounded-lg hover:bg-[#b45309] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </span>
                        ) : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Password Form */}
                <div className="bg-white rounded-xl shadow-lg border border-[#d97706]/20 p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <FaLock className="text-red-600 text-xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
                      <p className="text-gray-500">Update your password for enhanced security</p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d97706]">
                            <FaLock />
                          </div>
                          <input
                            type="password"
                            value={passwords.oldPassword}
                            onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-[#d97706] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] transition-all bg-white"
                            placeholder="Enter current password"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d97706]">
                            <FaLock />
                          </div>
                          <input
                            type="password"
                            value={passwords.newPassword}
                            onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-[#d97706] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] transition-all bg-white"
                            placeholder="Enter new password"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d97706]">
                            <FaLock />
                          </div>
                          <input
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-[#d97706] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] transition-all bg-white"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-6 border-t border-[#d97706]/20">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-[#d97706] text-white font-medium rounded-lg hover:bg-[#b45309] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Updating...
                          </span>
                        ) : 'Update Password'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' })}
                        className="px-6 py-3 border border-[#d97706] text-[#d97706] font-medium rounded-lg hover:bg-[#d97706]/10 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-xl shadow-lg border border-[#d97706]/20 p-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-[#d97706]/10 to-[#d97706]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#d97706]/20">
                  <FaHeart className="text-3xl text-[#d97706]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Your Wishlist</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  Save your favorite products here for easy access later.
                </p>
                <Link 
                  to="/products" 
                  className="inline-flex items-center gap-2 bg-[#d97706] text-white px-8 py-3.5 rounded-lg font-medium hover:bg-[#b45309] transition-colors"
                >
                  <FaShoppingCart />
                  Browse Products
                </Link>
              </div>
            )}

            {/* Other Tabs Placeholder */}
            {activeTab !== 'dashboard' && activeTab !== 'orders' && activeTab !== 'profile' && activeTab !== 'wishlist' && (
              <div className="bg-white rounded-xl shadow-lg border border-[#d97706]/20 p-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-[#d97706]/10 to-[#d97706]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#d97706]/20">
                  <FaCog className="text-3xl text-[#d97706] animate-spin" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {activeTab === 'address' && 'Address Management'}
                  {activeTab === 'payment' && 'Payment Methods'}
                  {activeTab === 'settings' && 'Settings'}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  This feature is currently under development. We're working hard to bring you an enhanced experience.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleTabChange('dashboard')}
                    className="px-6 py-3 border border-[#d97706] text-[#d97706] font-medium rounded-lg hover:bg-[#d97706]/10 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                  <Link 
                    to="/support" 
                    className="px-6 py-3 bg-[#d97706] text-white font-medium rounded-lg hover:bg-[#b45309] transition-colors"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}