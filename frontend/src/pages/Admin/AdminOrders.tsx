import { useState } from 'react';
import { FiSearch, FiEye, FiX } from 'react-icons/fi';
import { ShoppingCart, CheckCircle, Truck } from 'lucide-react';
import { orders as mockOrders, orderStats, type Order } from '../../data/mockData';
import OrderStatsCard from '../../components/AdminOrders/OrderStatsCard';

export default function AdminOrders() {
  const [orderList] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const filteredOrders = orderList.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    const statusColors = {
      // pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      // processing: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      delivered: 'bg-purple-100 text-purple-700 border-purple-200',
      // cancelled: 'bg-red-100 text-red-700 border-red-200',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 text-black">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Order Management</h1>
            <p className="text-gray-400 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Track and manage all customer orders
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        <OrderStatsCard
          title="Total Orders"
          value={orderStats.totalOrders}
          icon={ShoppingCart}
          gradient="from-white to-gray-50"
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
        {/* <OrderStatsCard
          title="Pending Orders"
          value={orderStats.pendingOrders}
          icon={Package}
          gradient="from-white to-yellow-50"
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        /> */}
        <OrderStatsCard
          title="Completed Orders"
          value={orderStats.completedOrders}
          icon={CheckCircle}
          gradient="from-white to-green-50"
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <OrderStatsCard
          title="Delivered Orders"
          value={orderStats.deliveredOrders}
          icon={Truck}
          gradient="from-white to-purple-50"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order ID, customer name or email..."
              className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm transition-all"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm bg-white min-w-[200px]"
          >
            <option value="all">All Status</option>
            {/* <option value="pending">Pending</option> */}
            {/* <option value="processing">Processing</option> */}
            <option value="completed">Completed</option>
            <option value="delivered">Delivered</option>
            {/* <option value="cancelled">Cancelled</option> */}
          </select>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="px-6 py-3 border-2 border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-600 rounded-lg font-medium transition-all text-sm whitespace-nowrap"
          >
            Reset Filters
          </button>
        </div>
        <div className="mt-3 text-sm text-gray-500">
          Showing {filteredOrders.length} of {orderList.length} orders
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-900">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.customerEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(order.orderDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-green-600">${order.amount.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-all"
                    >
                      <FiEye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No orders found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* View Order Dialog */}
      {viewDialogOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Order Details</h2>
                <p className="text-orange-100 text-sm mt-1">#{selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setViewDialogOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <FiX className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    👤
                  </span>
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedOrder.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="font-bold text-green-600 text-xl">${selectedOrder.amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    📦
                  </span>
                  Order Items ({selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)} items)
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map(item => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">{item.productName}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="px-2 py-1 bg-gray-100 rounded-md">{item.category}</span>
                            <span>Qty: {item.quantity}</span>
                            <span className="font-medium text-gray-900">${item.price.toFixed(2)} each</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                          <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 border border-orange-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-700 font-medium">Subtotal</span>
                  <span className="font-semibold text-gray-900">${selectedOrder.amount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-700 font-medium">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t border-orange-300 pt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-orange-600">${selectedOrder.amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-center">
                {getStatusBadge(selectedOrder.status)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
