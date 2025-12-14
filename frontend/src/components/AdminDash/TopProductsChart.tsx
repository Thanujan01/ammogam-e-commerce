import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Product {
  name: string;
  sold: number;
  revenue: number;
}

interface Props {
  products: Product[];
}

export default function TopProductsChart({ products }: Props) {
  const chartData = {
    labels: products.map(p => p.name),
    datasets: [
      {
        label: 'Units Sold',
        data: products.map(p => p.sold),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 6,
        yAxisID: 'y',
      },
      {
        label: 'Revenue ($)',
        data: products.map(p => p.revenue),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        borderRadius: 6,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.yAxisID === 'y1') {
              label += '$' + context.parsed.y.toLocaleString();
            } else {
              label += context.parsed.y + ' units';
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
        ticks: {
          callback: function(value: any) {
            return value + ' units';
          },
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: any) {
            return '$' + (value / 1000).toFixed(0) + 'K';
          },
        },
      },
    },
  };

  const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Top Products</h3>
          <p className="text-xs text-gray-500 mt-1">Best sellers this month</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">Total Sold</p>
            <p className="text-lg font-bold text-blue-600">{totalSold}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-lg font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
