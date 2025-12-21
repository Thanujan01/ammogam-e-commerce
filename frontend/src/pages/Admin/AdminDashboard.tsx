import { useState, useEffect } from 'react';
import { api } from '../../api/api';
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, Store, Truck } from 'lucide-react';

import RevenueChart from '../../components/AdminDash/RevenueChart';
import CategoryPieChart from '../../components/AdminDash/CategoryPieChart';
import TopProductsChart from '../../components/AdminDash/TopProductsChart';
import LowStockAlert from '../../components/AdminDash/LowStockAlert';
import OrderStatsCard from '../../components/AdminOrders/OrderStatsCard';


export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch admin stats', error);
    } finally {
      setLoading(false);
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-[2rem] shadow-xl p-8 text-white">
        <h1 className="text-3xl md:text-4xl font-black mb-2">Welcome back, Admin! 👋</h1>
        <p className="text-blue-100 font-medium">Here's what's happening with your store today</p>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-blue-100">Live updates every 30 seconds</span>
        </div>
      </div>

      {/* Revenue Breakdown Section */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-[2rem] shadow-lg p-8">
        <h2 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-wider flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-emerald-600" />
          Revenue Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-emerald-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Admin Revenue</p>
            <p className="text-3xl font-black text-emerald-600">$ {(stats?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-xs text-gray-500 mt-2">Own products + 5% commission</p>
          </div>

          {/* Admin Product Revenue Card */}
          <OrderStatsCard
            title="Admin Product Revenue"
            value={`$ ${(stats?.adminProductRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={Truck}
            gradient="from-white to-blue-50"
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />

          <div className="bg-white p-6 rounded-2xl shadow-md border border-purple-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Commission Earned (5%)</p>
            <p className="text-3xl font-black text-purple-600">$ {(stats?.adminCommissionFromSellers || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-xs text-gray-500 mt-2">From seller products</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Seller Payout (95%)</p>
            <p className="text-3xl font-black text-orange-600">$ {(stats?.sellerPayoutAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-xs text-gray-500 mt-2">To be distributed</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Products</p>
              <p className="text-3xl font-black text-gray-900">{stats?.totalProducts || 0}</p>
              <p className="text-xs text-gray-500 mt-2">{stats?.adminProducts || 0} admin, {stats?.sellerProducts || 0} seller</p>
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Package className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Orders</p>
              <p className="text-3xl font-black text-gray-900">{stats?.totalOrders || 0}</p>
              <p className="text-xs text-gray-500 mt-2">{stats?.pendingOrders || 0} pending</p>
            </div>
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-7 h-7 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Customers</p>
              <p className="text-3xl font-black text-gray-900">{stats?.totalCustomers || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Registered users</p>
            </div>
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Active Sellers</p>
              <p className="text-3xl font-black text-gray-900">{stats?.totalSellers || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Approved merchants</p>
            </div>
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
              <Store className="w-7 h-7 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Seller Revenue Breakdown */}
      {stats?.sellerProductRevenue > 0 && (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-wider flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Seller Product Revenue
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Total Seller Sales</p>
              <p className="text-3xl font-black text-blue-700">$ {(stats?.sellerProductRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
              <p className="text-xs font-black text-purple-600 uppercase tracking-widest mb-2">Your Commission (5%)</p>
              <p className="text-3xl font-black text-purple-700">$ {(stats?.adminCommissionFromSellers || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
              <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-2">Seller Earnings (95%)</p>
              <p className="text-3xl font-black text-green-700">$ {(stats?.sellerPayoutAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      )}

      {/* Revenue & Category Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart
            labels={stats?.monthlyRevenue?.labels || []}
            data={stats?.monthlyRevenue?.data || []}
          />
        </div>
        <div className="lg:col-span-1">
          <CategoryPieChart
            labels={stats?.salesByCategory?.labels || []}
            data={stats?.salesByCategory?.data || []}
          />
        </div>
      </div>

      {/* Top Products & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopProductsChart products={stats?.topProducts || []} />
        </div>
        <div className="lg:col-span-1">
          <LowStockAlert products={stats?.lowStockProducts || []} />
        </div>
      </div>
    </div>
  );
}
