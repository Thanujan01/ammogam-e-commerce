import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  gradient?: string;
  iconBg?: string;
  iconColor?: string;
}

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  gradient = 'from-gray-500 to-gray-600',
  iconBg = 'bg-gray-100',
  iconColor = 'text-gray-600'
}: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl shadow-lg p-6 text-white transform transition-all hover:scale-105 hover:shadow-xl`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 text-black">
          <p className="text-gray-700 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && <p className=" text-xs mt-2">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center backdrop-blur-sm`}>
            <span className={`${iconColor} text-xl`}>
              {icon}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
