import type { LucideIcon } from 'lucide-react';
// import { FiDownload } from 'react-icons/fi';

interface ReportCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  iconColor: string;
  // onDownload: () => void;
}

export default function ReportCard({
  title,
  value,
  icon: Icon,
  gradient,
  iconBg,
  iconColor,
}: ReportCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all`}>
      <div className="flex items-start justify-between mb-2">
        <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>
        {/* <button
          onClick={onDownload}
          className="p-2.5 bg-white/80 hover:bg-white border border-gray-200 rounded-lg transition-all group"
          title="Download Report"
        >
          <FiDownload className="w-4 h-4 text-gray-700 group-hover:text-indigo-600 transition-colors" />
        </button> */}
      </div>
      <h3 className="text-sm font-semibold text-gray-600 mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
