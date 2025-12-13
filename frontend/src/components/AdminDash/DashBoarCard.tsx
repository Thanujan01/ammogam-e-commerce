import React from 'react';
import StatCard from './StatCard';
import { Users, ShoppingCart, Package, DollarSign } from 'lucide-react';

export default function DashBoardCard({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Users" 
        value={stats.users.toLocaleString()} 
        icon={<Users className="w-6 h-6" />}
        gradient="from-blue-500 to-blue-600"
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard 
        title="Total Orders" 
        value={stats.orders.toLocaleString()} 
        icon={<ShoppingCart className="w-6 h-6" />}
        gradient="from-green-500 to-green-600"
        iconBg="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard 
        title="Products" 
        value={stats.products.toLocaleString()} 
        icon={<Package className="w-6 h-6" />}
        gradient="from-purple-500 to-purple-600"
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
      />
      <StatCard 
        title="Revenue" 
        value={`$${stats.revenue.toLocaleString()}`} 
        icon={<DollarSign className="w-6 h-6" />}
        gradient="from-orange-500 to-orange-600"
        iconBg="bg-orange-100"
        iconColor="text-orange-600"
      />
    </div>
  );
}
