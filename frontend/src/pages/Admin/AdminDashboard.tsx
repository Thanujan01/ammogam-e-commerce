import React from 'react';
import { stats, monthlyRevenue, salesByCategory, topProducts, lowStockProducts } from '../../data/mockData';
import DashBoardCard from '../../components/AdminDash/DashBoarCard';
import RevenueChart from '../../components/AdminDash/RevenueChart';
import CategoryPieChart from '../../components/AdminDash/CategoryPieChart';
import TopProductsChart from '../../components/AdminDash/TopProductsChart';
import LowStockAlert from '../../components/AdminDash/LowStockAlert';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
        <p className="text-blue-100">Here's what's happening with your store today</p>
      </div>

      {/* Stats Cards */}
      <DashBoardCard stats={stats} />

      {/* Revenue & Category Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart labels={monthlyRevenue.labels} data={monthlyRevenue.data} />
        </div>
        <div className="lg:col-span-1">
          <CategoryPieChart labels={salesByCategory.labels} data={salesByCategory.data} />
        </div>
      </div>

      {/* Top Products & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopProductsChart products={topProducts} />
        </div>
        <div className="lg:col-span-1">
          <LowStockAlert products={lowStockProducts} />
        </div>
      </div>
    </div>
  );
}
