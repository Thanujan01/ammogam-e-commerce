import { useState, useEffect } from 'react';
import { FiSearch, FiEye, FiX, FiCheckCircle, FiTruck, FiClock, FiAlertCircle, FiDownload } from 'react-icons/fi';
import { ShoppingCart } from 'lucide-react';
import { api } from '../../api/api';
import { getImageUrl } from '../../utils/imageUrl';
import OrderStatsCard from '../../components/AdminOrders/OrderStatsCard';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = (order: any) => {
    // Create invoice HTML
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice - Order #${order._id.slice(-8).toUpperCase()}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Arial', sans-serif; padding: 40px; background: #f5f5f5; }
          .invoice { max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
          .company { font-size: 28px; font-weight: bold; color: #2563eb; }
          .invoice-title { font-size: 36px; font-weight: bold; color: #1e293b; }
          .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .info-box { flex: 1; }
          .info-box h3 { font-size: 12px; color: #64748b; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 1px; }
          .info-box p { margin: 5px 0; color: #334155; }
          .table { width: 100%; border-collapse: collapse; margin: 30px 0; }
          .table th { background: #f1f5f9; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #475569; border-bottom: 2px solid #e2e8f0; }
          .table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #334155; }
          .table tr:last-child td { border-bottom: none; }
          .totals { margin-top: 30px; text-align: right; }
          .totals-row { display: flex; justify-content: flex-end; padding: 8px 0; }
          .totals-label { width: 200px; text-align: right; padding-right: 20px; color: #64748b; }
          .totals-value { width: 150px; text-align: right; font-weight: bold; color: #1e293b; }
          .total-final { font-size: 20px; color: #2563eb; border-top: 2px solid #e2e8f0; padding-top: 10px; margin-top: 10px; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
          .status-pending { background: #fef3c7; color: #92400e; }
          .status-processing { background: #dbeafe; color: #1e40af; }
          .status-shipped { background: #e0e7ff; color: #4338ca; }
          .status-delivered { background: #d1fae5; color: #065f46; }
          .status-cancelled { background: #fee2e2; color: #991b1b; }
          @media print {
            body { padding: 0; background: white; }
            .invoice { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div>
              <div class="company">AMMOGAM</div>
              <p style="color: #64748b; margin-top: 5px;">E-Commerce Platform</p>
            </div>
            <div style="text-align: right;">
              <div class="invoice-title">INVOICE</div>
              <p style="color: #64748b; margin-top: 5px;">Order #${order._id.slice(-8).toUpperCase()}</p>
              <p style="color: #64748b; margin-top: 5px;">${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div class="info-section">
            <div class="info-box">
              <h3>Customer Details</h3>
              <p><strong>${order.user?.name || 'N/A'}</strong></p>
              <p>${order.user?.email || 'N/A'}</p>
              <p>${order.user?.phone || 'N/A'}</p>
            </div>
            <div class="info-box">
              <h3>Delivery Address</h3>
              <p>${order.shippingAddress?.address || 'N/A'}</p>
              <p>${order.shippingAddress?.city || ''}, ${order.shippingAddress?.zip || ''}</p>
              <p>Phone: ${order.shippingAddress?.phone || 'N/A'}</p>
            </div>
            <div class="info-box" style="text-align: right;">
              <h3>Order Status</h3>
              <span class="status-badge status-${order.status}">${order.status.toUpperCase()}</span>
              <p style="margin-top: 10px; color: #64748b;">Payment: ${order.paymentMethod || 'N/A'}</p>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((item: any) => `
                <tr>
                  <td>
                    <strong>${item.product?.name || 'Product'}</strong>
                    ${item.product?.seller ? `<br><span style="font-size: 11px; color: #64748b;">Seller: ${item.product.seller.businessName || item.product.seller.name}</span>` : ''}
                  </td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">$${item.price.toLocaleString()}</td>
                  <td style="text-align: right;">$${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <div class="totals-label">Subtotal:</div>
              <div class="totals-value">$${(order.storeTotal || order.totalAmount).toLocaleString()}</div>
            </div>
            <div class="totals-row total-final">
              <div class="totals-label">Total Amount:</div>
              <div class="totals-value">$${(order.storeTotal || order.totalAmount).toLocaleString()}</div>
            </div>
          </div>

          <div class="footer">
            <p><strong>Thank you for your business!</strong></p>
            <p style="margin-top: 10px;">For any queries, please contact us at support@ammogam.com</p>
            <p style="margin-top: 5px;">This is a computer-generated invoice and does not require a signature.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create a blob and download
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${order._id.slice(-8).toUpperCase()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Also open in new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdateLoading(true);
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      await fetchOrders(); // Refresh list
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    } finally {
      setUpdateLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const orderId = order._id.toUpperCase();
    const customerName = order.user?.name?.toLowerCase() || '';
    const customerEmail = order.user?.email?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    const matchesSearch = orderId.includes(query) || customerName.includes(query) || customerEmail.includes(query);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'processed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.reduce((s, o) => s + (o.storeTotal || 0), 0)
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 text-black">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2 tracking-tight">Order Management</h1>
            <p className="text-gray-400 flex items-center gap-2 text-sm font-medium">
              <ShoppingCart className="w-4 h-4 text-orange-500" />
              Manage customer orders, track payments and update statuses
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <OrderStatsCard
          title="Total Orders"
          value={orderStats.total}
          icon={ShoppingCart as any}
          gradient="from-white to-gray-50"
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
        <OrderStatsCard
          title="Pending"
          value={orderStats.pending}
          icon={FiClock as any}
          gradient="from-white to-amber-50"
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />
        <OrderStatsCard
          title="Delivered"
          value={orderStats.delivered}
          icon={FiCheckCircle as any}
          gradient="from-white to-emerald-50"
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <OrderStatsCard
          title="Total Revenue"
          value={`$ ${orderStats.revenue.toLocaleString()}`}
          icon={FiTruck as any}
          gradient="from-white to-blue-50"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Order ID, name or email..."
              className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none text-sm transition-all bg-gray-50/50"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none text-sm bg-white min-w-[200px]"
          >
            <option value="all">Every Status</option>
            <option value="pending">Pending</option>
            <option value="processed">Processed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading orders...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <FiAlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-gray-900 font-bold">No orders matched found</h3>
                    <p className="text-gray-400 text-sm">Refine your filters and try again</p>
                  </td>
                </tr>
              ) : filteredOrders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-gray-900 text-sm">#{order._id.slice(-8).toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{order.user?.name || 'Guest'}</p>
                      <p className="text-xs text-gray-500">{order.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-black text-gray-900">$ {(order.storeTotal || order.totalAmount).toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => { setSelectedOrder(order); setViewDialogOpen(true); }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                      <FiEye className="w-3.5 h-3.5" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewDialogOpen && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col border border-white">
            <div className="bg-slate-900 px-8 py-6 flex items-center justify-between text-white">
              <div>
                <h2 className="text-xl font-black tracking-tight">Order # {selectedOrder._id.toUpperCase()}</h2>
                <div className="flex gap-4 mt-2">
                  <span className="text-xs font-bold text-slate-400 capitalize flex items-center gap-2">
                    <FiClock /> {new Date(selectedOrder.createdAt).toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FiTruck /> {selectedOrder.paymentMethod}
                  </span>
                </div>
              </div>
              <button onClick={() => setViewDialogOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Customer Details</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center font-bold text-slate-900 border border-slate-100">
                          {selectedOrder.user?.name?.charAt(0) || 'G'}
                        </div>
                        <div>
                          <div className="font-black text-gray-900">{selectedOrder.user?.name || 'Guest User'}</div>
                          <div className="text-xs text-gray-500">{selectedOrder.user?.email || 'No email provided'}</div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-slate-200">
                        <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Delivery Address</div>
                        <div className="text-sm text-slate-600 font-medium leading-relaxed">
                          {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}<br />
                          {selectedOrder.shippingAddress.postalCode && <span>Zip: {selectedOrder.shippingAddress.postalCode}</span>}
                        </div>
                        <div className="mt-2 text-sm font-black text-slate-900">
                          +94 {selectedOrder.shippingAddress.phone}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Order Logic</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">Current Status</span>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="pt-4 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Change Status</label>
                        <div className="flex flex-wrap gap-2">
                          {['pending', 'processed', 'shipped', 'delivered', 'cancelled'].map(s => (
                            <button
                              key={s}
                              disabled={updateLoading}
                              onClick={() => handleUpdateStatus(selectedOrder._id, s)}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${selectedOrder.status === s ? 'bg-orange-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500 hover:border-orange-500 hover:text-orange-600'}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Cart Items</h4>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {selectedOrder.items.map((item: any) => (
                        <div key={item._id} className="flex items-center gap-4 group">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 group-hover:border-orange-200 transition-colors">
                            <img src={getImageUrl(item.product?.image)} className="w-full h-full object-contain p-2" alt={item.product?.name} />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-slate-900 text-sm">{item.product?.name}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.quantity} × $ {item.price.toLocaleString()}</div>
                          </div>
                          <div className="text-right font-black text-slate-900 text-sm">
                            $ {(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-dashed border-slate-200 space-y-3">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                        <span>Store Subtotal</span>
                        <span>$ {(selectedOrder.storeTotal || selectedOrder.totalAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-black text-slate-900">
                        <span>Store Total</span>
                        <span className="text-orange-600">$ {(selectedOrder.storeTotal || selectedOrder.totalAmount).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
              <button onClick={() => setViewDialogOpen(false)} className="px-8 py-3 bg-white border border-slate-200 rounded-2xl font-black text-sm text-slate-600 hover:bg-slate-100 transition-all">
                Close Window
              </button>
              <button
                onClick={() => downloadInvoice(selectedOrder)}
                className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center gap-2"
              >
                <FiDownload />
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
