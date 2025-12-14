import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  labels: string[];
  data: number[];
}

export default function CategoryPieChart({ labels, data }: Props) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',   // blue
          'rgba(16, 185, 129, 0.8)',   // green
          'rgba(249, 115, 22, 0.8)',   // orange
          'rgba(139, 92, 246, 0.8)',   // purple
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 11,
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Sales by Category</h3>
        <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">This Month</div>
      </div>
      <div className="h-64">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}
