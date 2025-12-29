import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiEye, FiX, FiCheckCircle, FiTruck, FiClock, FiAlertCircle, FiSettings } from 'react-icons/fi';
import { ShoppingBag } from 'lucide-react';
import { api } from '../../api/api';
import { getImageUrl } from '../../utils/imageUrl';

export default function SellerOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get('/orders/seller/all');
            setOrders(res.data);
        } catch (error) {
            console.error("Failed to fetch seller orders", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-select order if ID is in URL
    useEffect(() => {
        const orderId = searchParams.get('id');
        if (orderId && orders.length > 0) {
            const order = orders.find(o => o._id === orderId);
            if (order) {
                setSelectedOrder(order);
                setViewDialogOpen(true);
            }
        }
    }, [searchParams, orders]);

    const handleUpdateItemStatus = async (orderId: string, productId: string, newStatus: string) => {
        try {
            setUpdateLoading(true);
            await api.put('/orders/item-status', { orderId, productId, status: newStatus });

            // Update local state without fetching all again
            setOrders(prev => prev.map(o => {
                if (o._id === orderId) {
                    return {
                        ...o,
                        items: o.items.map((it: any) =>
                            it.product._id === productId ? { ...it, status: newStatus } : it
                        )
                    };
                }
                return o;
            }));

            // Update selected order if open
            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder((prev: any) => ({
                    ...prev,
                    items: prev.items.map((it: any) =>
                        it.product._id === productId ? { ...it, status: newStatus } : it
                    )
                }));
            }
        } catch (error) {
            console.error("Failed to update item status", error);
            alert("Failed to update status");
        } finally {
            setUpdateLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        const orderId = order._id.toUpperCase();
        const customerName = order.user?.name?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();

        const matchesSearch = orderId.includes(query) || customerName.includes(query);
        // For status filter, check if ANY of the items match or the order itself matches
        // But seller cares about their own item status
        const matchesStatus = statusFilter === 'all' || order.items.some((it: any) => it.status === statusFilter);

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

    // Stats for the seller
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.items.some((it: any) => it.status === 'pending')).length,
        shipped: orders.filter(o => o.items.some((it: any) => it.status === 'shipped')).length,
        revenue: orders.reduce((acc, o) =>
            acc + o.items.reduce((sum: number, it: any) => sum + (it.price * it.quantity) + (it.shippingFee || 0), 0), 0
        )
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <ShoppingBag className="text-orange-600" />
                            Order Management
                        </h1>
                        <p className="text-gray-500 mt-2">Manage orders for your products and update fulfillment status</p>
                    </div>
                    <div className="flex items-center gap-3 bg-primary1 p-2 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-600 font-bold">
                            {stats.total}
                        </div>
                        <div className="pr-4">
                            <p className="text-xs font-semibold text-white">Total Orders</p>
                            <p className="text-sm text-white">Assigned View</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">To Process</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                    </div>
                    <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                        <FiClock className="text-2xl" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">Shipped</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.shipped}</p>
                    </div>
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <FiTruck className="text-2xl" />
                    </div>
                </div>
                {/* <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">Success Rate</h3>
                        <p className="text-3xl font-bold text-gray-900">98%</p>
                    </div>
                    <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                        <FiCheckCircle className="text-2xl" />
                    </div>
                </div> */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">My Revenue</h3>
                        <p className="text-3xl font-bold text-gray-900">$ {stats.revenue.toLocaleString()}</p>
                    </div>
                    <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                        <span className="text-2xl font-bold">$</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer Name..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500 transition-all outline-none text-sm"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="px-6 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500 transition-all outline-none text-sm font-semibold text-gray-700 min-w-[200px]"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="all">Every Status</option>
                    <option value="pending">Pending</option>
                    <option value="processed">Processed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <button
                    onClick={fetchOrders}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 transition-colors"
                >
                    <FiSettings className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                                <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                                <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase">Products</th>
                                <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase">Income</th>
                                <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase">Item Status</th>
                                <th className="px-8 py-5 text-center text-xs font-semibold text-gray-600 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-gray-500 text-sm">Fetching your orders...</p>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                                            <FiAlertCircle className="text-4xl" />
                                        </div>
                                        <h3 className="text-gray-900 font-bold">No orders found</h3>
                                        <p className="text-gray-500 text-sm mt-1">When customers buy your products, they will appear here.</p>
                                    </td>
                                </tr>
                            ) : filteredOrders.map(order => (
                                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <span className="font-semibold text-gray-900 text-sm">#{order._id.slice(-8).toUpperCase()}</span>
                                        <div className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-semibold text-gray-900 text-sm">{order.user?.name || 'Customer'}</p>
                                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex -space-x-3 overflow-hidden">
                                            {order.items.map((item: any, i: number) => (
                                                <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-white border border-gray-100 overflow-hidden shadow-sm" title={item.product?.name}>
                                                    <img src={getImageUrl(item.product?.image)} className="h-full w-full object-contain p-1" />
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs font-semibold text-gray-500 mt-2">{order.items.length} items</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-semibold text-emerald-600 text-sm">
                                            $ {order.items.reduce((s: number, it: any) => s + (it.price * it.quantity) + (it.shippingFee || 0), 0).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        {/* Status of the first item as a summary or show multi-status badge */}
                                        <div className="flex flex-col gap-1">
                                            {order.items.slice(0, 1).map((it: any, i: number) => (
                                                <span key={i} className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border w-fit ${getStatusBadge(it.status)}`}>
                                                    {it.status}
                                                </span>
                                            ))}
                                            {order.items.length > 1 && <span className="text-xs text-gray-500">+{order.items.length - 1} more</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <button
                                            onClick={() => { setSelectedOrder(order); setViewDialogOpen(true); }}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary1 text-white rounded-xl text-xs font-semibold hover:bg-orange-500 transition-all shadow-md active:scale-95"
                                        >
                                            <FiEye />
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Dialog */}
            {viewDialogOpen && selectedOrder && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col border border-white">
                        <div className="bg-primary1 px-8 py-6 flex items-center justify-between text-white">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-3">
                                    Order Details
                                    <span className="text-white">#{selectedOrder._id.slice(-8).toUpperCase()}</span>
                                </h2>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-2 text-xs text-white">
                                        <FiClock className="text-orange-500" />
                                        {new Date(selectedOrder.createdAt).toLocaleString()}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-white border-l border-gray-800 pl-4">
                                        <FiTruck className="text-white" />
                                        {selectedOrder.items.length} Products
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewDialogOpen(false)}
                                className="w-12 h-12 flex items-center justify-center bg-white hover:bg-orange-500 rounded-2xl transition-all"
                            >
                                <FiX className="text-xl text-gray-900 hover:text-white" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/30">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Side: Order Items and Information */}
                                <div className="space-y-6">
                                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-6">Fulfillment Items</h4>
                                        <div className="space-y-6">
                                            {selectedOrder.items.map((item: any) => (
                                                <div key={item._id} className="space-y-4 p-4 rounded-[1.5rem] border border-gray-50 bg-gray-50/50">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 bg-white rounded-2xl border border-gray-100 flex-shrink-0 p-2">
                                                            <img src={getImageUrl(item.product?.image)} className="w-full h-full object-contain" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="font-semibold text-gray-900 text-sm truncate">{item.product?.name}</h5>
                                                            {item.color && (
                                                                <div className="flex items-center gap-1.5 mt-1">
                                                                    <div
                                                                        className="w-3 h-3 rounded-full border border-gray-300"
                                                                        style={{ backgroundColor: item.colorCode || '#000' }}
                                                                    />
                                                                    <span className="text-xs text-gray-500">{item.color}</span>
                                                                </div>
                                                            )}
                                                            <p className="text-xs text-gray-500">
                                                                Qty: {item.quantity} × $ {item.price.toLocaleString()}
                                                                {item.shippingFee > 0 && (
                                                                    <span className="ml-1 text-[#d97706] font-medium">
                                                                        (+ $ {item.shippingFee.toLocaleString()} Shipping)
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-semibold text-gray-900 text-sm">$ {(item.price * item.quantity).toLocaleString()}</div>
                                                            <div className={`text-xs font-semibold capitalize mt-1 ${getStatusBadge(item.status).split(' ')[1]}`}>
                                                                {item.status}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="pt-4 border-t border-gray-200">
                                                        <p className="text-xs font-semibold text-gray-600 mb-3">Update This Item's Status</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {['pending', 'processed', 'shipped', 'delivered', 'cancelled'].map(s => (
                                                                <button
                                                                    key={s}
                                                                    disabled={updateLoading}
                                                                    onClick={() => handleUpdateItemStatus(selectedOrder._id, item.product?._id, s)}
                                                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${item.status === s ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'bg-white border border-gray-200 text-gray-500 hover:border-orange-500 hover:text-orange-600'}`}
                                                                >
                                                                    {s}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Customer and Summary */}
                                <div className="space-y-6">
                                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-6">Delivery Details</h4>
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shadow-inner">
                                                <FiTruck className="text-xl" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-base">{selectedOrder.shippingAddress.name}</p>
                                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                                    {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}<br />
                                                    Postal Code: {selectedOrder.shippingAddress.postalCode || 'N/A'}<br />
                                                    Phone: <span className="text-gray-900 font-semibold">+94 {selectedOrder.shippingAddress.phone}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-primary1 rounded-[2rem] p-6 text-white relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                            <h5 className="text-sm font-semibold text-white mb-4">Earnings Summary</h5>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-white font-medium">Items Subtotal</span>
                                                    <span className="font-bold">$ {selectedOrder.items.reduce((s: number, it: any) => s + (it.price * it.quantity), 0).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-white font-medium">Delivery Revenue</span>
                                                    <span className="font-bold">$ {selectedOrder.items.reduce((s: number, it: any) => s + (it.shippingFee || 0), 0).toLocaleString()}</span>
                                                </div>
                                                <div className="pt-4 border-t border-white/20 flex justify-between items-end">
                                                    <span className="text-xs font-bold uppercase text-white/80">Total Earnings</span>
                                                    <span className="text-3xl font-black text-white">$ {(
                                                        selectedOrder.items.reduce((s: number, it: any) => s + (it.price * it.quantity), 0) +
                                                        selectedOrder.items.reduce((s: number, it: any) => s + (it.shippingFee || 0), 0)
                                                    ).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0">
                                                <FiAlertCircle className="text-xl" />
                                            </div>
                                            <div className="text-amber-900">
                                                <p className="font-semibold text-sm">Seller Responsibilities</p>
                                                <p className="text-xs leading-relaxed mt-1 opacity-80">
                                                    Please ensure items are packed securely and shipped within 48 hours of order confirmation. Update the status regularly to keep the customer informed.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-white border-t border-gray-100 flex items-center justify-end gap-4">
                            <button
                                onClick={() => setViewDialogOpen(false)}
                                className="px-10 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-semibold text-sm transition-all shadow-sm active:scale-95"
                            >
                                Close Details
                            </button>
                            <button
                                onClick={() => handlePrintLabel(selectedOrder)}
                                className="px-10 py-4 bg-primary1 hover:bg-orange-500 text-white rounded-2xl font-semibold text-sm transition-all shadow-xl shadow-gray-900/20 active:scale-95 flex items-center gap-2"
                            >
                                <FiCheckCircle className="text-green-500" />
                                Print Shipping Label
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const handlePrintLabel = (order: any) => {
    const labelHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Shipping Label - ${order._id.slice(-8).toUpperCase()}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', Courier, monospace; padding: 20px; background: #fff; }
          .label-container { 
            max-width: 400px; 
            margin: 0 auto; 
            border: 2px solid #000; 
            padding: 20px; 
            page-break-inside: avoid;
          }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; text-transform: uppercase; }
          .subtitle { font-size: 12px; margin-top: 5px; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 10px; text-transform: uppercase; color: #666; margin-bottom: 5px; border-bottom: 1px dotted #000; }
          .address { font-size: 14px; line-height: 1.4; font-weight: bold; }
          .order-info { display: flex; justify-content: space-between; margin-bottom: 20px; border: 1px solid #000; padding: 10px; }
          .info-item { text-align: center; }
          .info-label { font-size: 10px; text-transform: uppercase; color: #666; }
          .info-value { font-size: 16px; font-weight: bold; }
          .items-list { margin-top: 10px; border-top: 2px solid #000; pt-2; }
          .item { display: flex; justify-content: space-between; font-size: 12px; padding: 5px 0; border-bottom: 1px dotted #ccc; }
          .footer { text-align: center; margin-top: 20px; font-size: 10px; border-top: 1px solid #000; padding-top: 10px; }
          .tracking { text-align: center; margin: 20px 0; border: 2px dashed #000; padding: 10px; }
          @media print {
            body { padding: 0; }
            .label-container { border: none; }
          }
        </style>
      </head>
      <body>
        <div class="label-container">
          <div class="header">
            <div class="title">PRIORITY SHIP</div>
            <div class="subtitle">AMMOGAM MARKETPLACE</div>
          </div>

          <div class="section">
            <div class="section-title">SHIP TO:</div>
            <div class="address">
              ${order.shippingAddress.name.toUpperCase()}<br>
              ${order.shippingAddress.address.toUpperCase()}<br>
              ${order.shippingAddress.city.toUpperCase()}${order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ''}<br>
              TEL: ${order.shippingAddress.phone}
            </div>
          </div>

          <div class="order-info">
            <div class="info-item">
              <div class="info-label">ORDER #</div>
              <div class="info-value">${order._id.slice(-8).toUpperCase()}</div>
            </div>
            <div class="info-item">
              <div class="info-label">DATE</div>
              <div class="info-value">${new Date().toLocaleDateString()}</div>
            </div>
            <div class="info-item">
              <div class="info-label">WEIGHT</div>
              <div class="info-value">0.5 KG</div>
            </div>
          </div>

          <div class="section">
             <div class="section-title">CONTENT DESCRIPTION:</div>
             <div class="items-list">
                ${order.items.map((item: any) => `
                  <div class="item">
                    <span>${item.product?.name.toUpperCase()} (x${item.quantity}) ${item.color ? `[${item.color.toUpperCase()}]` : ''}</span>
                    <span>$ ${(item.price * item.quantity).toLocaleString()} ${item.shippingFee > 0 ? ` (+ $ ${item.shippingFee})` : ''}</span>
                  </div>
                `).join('')}
             </div>
          </div>

          <div class="tracking">
              TRACKING NUMBER PLACEHOLDER
              <br>
              ||||||||||||||||||||||||||||||||||||
          </div>

          <div class="footer">
            AMMOGAM E-COMMERCE LOGISTICS<br>
            Thank you for shopping with us!
          </div>
        </div>
        <script>
            window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(labelHTML);
        printWindow.document.close();
    }
};
