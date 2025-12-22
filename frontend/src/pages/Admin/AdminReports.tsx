import { useState, useEffect } from 'react';
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
import { api } from '../../api/api';
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
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // State for filtering
  const [viewMode, setViewMode] = useState<'yearly' | 'monthly'>('yearly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  useEffect(() => {
    fetchReports();
    // Real-time updates every 30 seconds
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, [viewMode, selectedYear, selectedMonth]); // Auto-refetch on filter change

  const fetchReports = async () => {
    try {
      let query = '';
      if (viewMode === 'yearly') {
        query = `type=yearly&date=${selectedYear}`;
      } else {
        query = `type=monthly&date=${selectedMonth}`;
      }

      const res = await api.get(`/admin/stats?${query}`);
      setStats(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setLoading(false);
    }
  };

  const handleDownloadReport = (reportType: string) => {
    alert(`Downloading ${reportType} report...`);
    // In a real application, this would generate and download a PDF or Excel file
  };





  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Monthly Revenue Chart
  const revenueChartData = {
    labels: stats?.monthlyRevenue?.labels || [],
    datasets: [
      {
        label: 'Revenue ($)',
        data: stats?.monthlyRevenue?.data || [],
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
    labels: stats?.salesByCategory?.labels || [],
    datasets: [
      {
        label: 'Sales',
        data: stats?.salesByCategory?.data || [],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(147, 51, 234)',
          'rgb(236, 72, 153)',
          'rgb(251, 146, 60)',
          'rgb(16, 185, 129)',
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
    labels: stats?.topProducts?.map((p: any) => p.name.substring(0, 15) + (p.name.length > 15 ? '...' : '')) || [],
    datasets: [
      {
        label: 'Units Sold',
        data: stats?.topProducts?.map((p: any) => p.unitsSold) || [],
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
    labels: stats?.monthlyOrders?.labels || [],
    datasets: [
      {
        label: 'Orders',
        data: stats?.monthlyOrders?.data || [],
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
              Real-time insights into your business performance (Auto-updates every 30s)
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'yearly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Yearly View
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'monthly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Monthly View
            </button>
          </div>

          <div className="flex items-center gap-4">
            {viewMode === 'yearly' ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Select Year:</span>
                <input
                  type="number"
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white min-w-[140px]"
                  placeholder="YYYY"
                  min="2000"
                  max="2100"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Select Month:</span>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard
          title="Sales Report (Total Orders)"
          value={(stats?.totalOrders || 0).toLocaleString()}
          icon={TrendingUp}
          gradient="from-white to-blue-50"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          onDownload={() => handleDownloadReport('Sales')}
        />
        <ReportCard
          title="Revenue Report"
          value={`$${(stats?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          gradient="from-white to-green-50"
          iconBg="bg-green-100"
          iconColor="text-green-600"
          onDownload={() => handleDownloadReport('Revenue')}
        />
        <ReportCard
          title="Product Report"
          value={stats?.totalProducts || 0}
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
            {viewMode === 'yearly' ? `Monthly Revenue (${selectedYear})` : `Daily Revenue (${selectedMonth})`}
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
            {viewMode === 'yearly' ? `Orders Trend (${selectedYear})` : `Orders Trend (${selectedMonth})`}
          </h3>
          <div className="h-[300px]">
            <Line data={ordersTrendChartData} options={ordersTrendChartOptions} />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-indigo-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Performance Summary ({viewMode === 'yearly' ? selectedYear : selectedMonth})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg  shadow-md p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Sales (Orders)</p>
            <p className="text-2xl font-bold text-gray-900">{(stats?.totalOrders || 0).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg  shadow-md p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">${(stats?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white rounded-lg  shadow-md p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{(stats?.totalProducts || 0).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg  shadow-md p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
            <p className="text-2xl font-bold text-gray-900">${(stats?.averageOrderValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
