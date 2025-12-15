import type { LucideIcon } from 'lucide-react';

interface OrderStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  iconColor: string;
}

export default function OrderStatsCard({ 
  title, 
  value, 
  icon: Icon, 
  gradient,
  iconBg,
  iconColor 
}: OrderStatsCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
