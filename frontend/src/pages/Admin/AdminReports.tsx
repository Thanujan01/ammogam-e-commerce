import { useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { BarChart3, TrendingUp, DollarSign, Package } from 'lucide-react';
import { reportData } from '../../data/mockData';
import ReportCard from '../../components/Reports/ReportCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminReports() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('all');

  const handleDownloadReport = (reportType: string) => {
    alert(`Downloading ${reportType} report...`);
    // In a real application, this would generate and download a PDF or Excel file
  };

  const years = ['2024', '2023', '2022', '2021'];
  const months = [
    'all',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Monthly Revenue Chart
  const revenueChartData = {
    labels: reportData.revenueByMonth.labels,
    datasets: [
      {
        label: 'Revenue ($)',
        data: reportData.revenueByMonth.data,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => '$' + value.toLocaleString(),
        },
      },
    },
  };

  // Sales by Category Chart
  const categoryChartData = {
    labels: ['CCTV Cameras', 'Dome Cameras', 'Wireless Cameras', 'Accessories'],
    datasets: [
      {
        label: 'Sales',
        data: [4200, 3200, 2500, 1400],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(251, 146, 60, 0.8)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(147, 51, 234)',
          'rgb(236, 72, 153)',
          'rgb(251, 146, 60)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
      },
    },
  };

  // Top Selling Products Chart
  const topProductsChartData = {
    labels: reportData.topSellingProducts.map(p => p.name),
    datasets: [
      {
        label: 'Units Sold',
        data: reportData.topSellingProducts.map(p => p.sales),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
      },
    ],
  };

  const topProductsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  // Orders Trend Chart
  const ordersTrendChartData = {
    labels: reportData.ordersTrendByMonth.labels,
    datasets: [
      {
        label: 'Orders',
        data: reportData.ordersTrendByMonth.data,
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      },
    ],
  };

  const ordersTrendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 text-black">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Business Reports & Analytics</h1>
            <p className="text-gray-400 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Comprehensive insights into your business performance
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-gray-700 font-semibold">Filter By:</div>
          <div className="flex flex-wrap gap-3 flex-1">
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white min-w-[140px]"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  Year: {year}
                </option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white min-w-[160px]"
            >
              {months.map(month => (
                <option key={month} value={month}>
                  {month === 'all' ? 'All Months' : month}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard
          title="Sales Report"
          value={reportData.yearlyStats.totalSales.toLocaleString()}
          icon={TrendingUp}
          gradient="from-white to-blue-50"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          onDownload={() => handleDownloadReport('Sales')}
        />
        <ReportCard
          title="Revenue Report"
          value={`$${reportData.yearlyStats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          gradient="from-white to-green-50"
          iconBg="bg-green-100"
          iconColor="text-green-600"
          onDownload={() => handleDownloadReport('Revenue')}
        />
        <ReportCard
          title="Product Report"
          value={reportData.yearlyStats.totalProducts}
          icon={Package}
          gradient="from-white to-purple-50"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          onDownload={() => handleDownloadReport('Product')}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-indigo-600" />
            </div>
            Monthly Revenue
          </h3>
          <div className="h-[300px]">
            <Line data={revenueChartData} options={revenueChartOptions} />
          </div>
        </div>

        {/* Sales by Category Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            Sales by Category
          </h3>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut data={categoryChartData} options={categoryChartOptions} />
          </div>
        </div>

        {/* Top Selling Products Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            Top Selling Products
          </h3>
          <div className="h-[300px]">
            <Bar data={topProductsChartData} options={topProductsChartOptions} />
          </div>
        </div>

        {/* Orders Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </div>
            Orders Trend (12 Months)
          </h3>
          <div className="h-[300px]">
            <Line data={ordersTrendChartData} options={ordersTrendChartOptions} />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-sm border border-indigo-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Year Summary ({selectedYear})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Sales</p>
            <p className="text-2xl font-bold text-gray-900">{reportData.yearlyStats.totalSales.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">${reportData.yearlyStats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{reportData.yearlyStats.totalProducts}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
            <p className="text-2xl font-bold text-gray-900">${reportData.yearlyStats.averageOrderValue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
