import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  Title,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, Title);

interface Props {
  labels: string[];
  data: number[];
}

export default function RevenueChart({ labels, data }: Props) {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Monthly Revenue',
        data,
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        backgroundColor: 'rgba(59,130,246,0.12)', // Tailwind blue-500 12%
        borderColor: 'rgba(59,130,246,1)',
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
      title: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: true },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Monthly Revenue</h3>
          <p className="text-xs text-gray-500 mt-1">Revenue trend for this year</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl font-bold text-blue-600">${data.reduce((a, b) => a + b, 0).toLocaleString()}</p>
        </div>
      </div>
      <div className="h-64">
        <Line data={chartData} options={options as any} />
      </div>
    </div>
  );
}
