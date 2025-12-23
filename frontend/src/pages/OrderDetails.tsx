import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { getImageUrl } from '../utils/imageUrl';
import {
    FaBox, FaChevronLeft, FaChevronRight,
    FaPhoneAlt, FaCreditCard,
    FaExclamationCircle, FaReceipt, FaTruck,
    FaCheckCircle, FaClock, FaPrint, FaShareAlt,
    FaDownload, FaCopy, FaShoppingBag, FaCalendarAlt,
    FaUser, FaHome, FaCreditCard as FaCard, FaTag
} from 'react-icons/fa';

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/orders/${id}`);
                setOrder(res.data);
            } catch (error) {
                console.error("Failed to fetch order", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const getStatusColor = (status: string) => {
        const colors = {
            pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: <FaClock className="text-amber-600" /> },
            processing: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: <FaBox className="text-blue-600" /> },
            shipped: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: <FaTruck className="text-indigo-600" /> },
            delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: <FaCheckCircle className="text-emerald-600" /> },
            cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: <FaExclamationCircle className="text-red-600" /> },
        };
        return colors[status as keyof typeof colors] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: <FaBox className="text-gray-600" /> };
    };

    const getStatusSteps = (status: string) => {
        const steps = [
            { id: 1, name: 'Order Placed', status: 'completed', icon: <FaShoppingBag className="text-xs" /> },
            { id: 2, name: 'Payment Confirmed', status: order?.paymentStatus === 'paid' ? 'completed' : 'pending', icon: <FaCreditCard className="text-xs" /> },
            { id: 3, name: 'Processing', status: ['processing', 'shipped', 'delivered'].includes(status) ? 'completed' : 'pending', icon: <FaBox className="text-xs" /> },
            { id: 4, name: 'Shipped', status: ['shipped', 'delivered'].includes(status) ? 'completed' : 'pending', icon: <FaTruck className="text-xs" /> },
            { id: 5, name: 'Delivered', status: status === 'delivered' ? 'completed' : 'pending', icon: <FaCheckCircle className="text-xs" /> },
        ];
        return steps;
    };

    const copyOrderId = () => {
        navigator.clipboard.writeText(order?._id || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-amber-200 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6">
                <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-200">
                    <FaExclamationCircle className="text-4xl text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Order Not Found</h2>
                <p className="text-gray-500 mb-8 max-w-md text-center">
                    We couldn't find the order you're looking for. It may have been deleted or the link is incorrect.
                </p>
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const statusColor = getStatusColor(order.status);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => navigate(-1)}
                                className="p-3 hover:bg-amber-50 rounded-xl transition-all group"
                            >
                                <FaChevronLeft className="text-gray-600 group-hover:text-amber-600" />
                            </button>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${statusColor.bg} ${statusColor.text} ${statusColor.border} flex items-center gap-2`}>
                                        {statusColor.icon}
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <FaCalendarAlt className="text-gray-400" />
                                        {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                    <button 
                                        onClick={copyOrderId}
                                        className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2 transition-colors"
                                    >
                                        <FaCopy className="text-xs" />
                                        {copied ? 'Copied!' : 'Copy ID'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                                <FaShareAlt />
                                Share
                            </button>
                            <button className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
                                <FaPrint />
                                Print
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Order Items & Summary */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Progress */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <div className="p-2.5 bg-amber-100 rounded-lg">
                                    <FaTruck className="text-amber-600" />
                                </div>
                                Order Progress
                            </h2>
                            
                            <div className="relative">
                                {/* Progress Line */}
                                <div className="absolute left-0 top-8 h-1 w-full bg-gray-200">
                                    <div 
                                        className="h-1 bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                                        style={{ 
                                            width: order.status === 'pending' ? '20%' : 
                                                   order.status === 'processing' ? '40%' : 
                                                   order.status === 'shipped' ? '80%' : '100%' 
                                        }}
                                    ></div>
                                </div>
                                
                                {/* Steps */}
                                <div className="flex justify-between relative z-10">
                                    {getStatusSteps(order.status).map((step) => (
                                        <div key={step.id} className="flex flex-col items-center">
                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 border-4 transition-all duration-300 ${
                                                step.status === 'completed' 
                                                    ? 'bg-emerald-100 border-emerald-300 text-emerald-600' 
                                                    : 'bg-white border-gray-300 text-gray-400'
                                            }`}>
                                                {step.icon}
                                            </div>
                                            <div className="text-center">
                                                <p className={`text-sm font-medium ${step.status === 'completed' ? 'text-emerald-700' : 'text-gray-500'}`}>
                                                    {step.name}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">Step {step.id}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-100 rounded-lg">
                                        <FaShoppingBag className="text-blue-600" />
                                    </div>
                                    Order Items ({order.items.length})
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex gap-6">
                                            <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200 p-3 flex-shrink-0">
                                                <img 
                                                    src={getImageUrl(item.product?.image)} 
                                                    className="w-full h-full object-contain" 
                                                    alt={item.product?.name} 
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-lg mb-2">
                                                            {item.product?.name || 'Unknown Product'}
                                                        </h3>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <span className="flex items-center gap-2">
                                                                <FaTag className="text-gray-400" />
                                                                SKU: {item.product?.sku || 'N/A'}
                                                            </span>
                                                            <span>•</span>
                                                            <span>Quantity: {item.quantity}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-gray-900">
                                                            ${(item.price * item.quantity).toLocaleString()}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ${item.price.toLocaleString()} each
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {item.status && (
                                                    <div className="mt-4">
                                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(item.status).bg} ${getStatusColor(item.status).text} ${getStatusColor(item.status).border}`}>
                                                            {getStatusColor(item.status).icon}
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary & Details */}
                    <div className="space-y-8">
                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <div className="p-2.5 bg-emerald-100 rounded-lg">
                                    <FaReceipt className="text-emerald-600" />
                                </div>
                                Order Summary
                            </h2>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">
                                        ${(order.totalAmount - (order.shippingFee || 0)).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium text-gray-900">
                                        ${(order.shippingFee || 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium text-gray-900">
                                        $0.00
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                    <span className="text-2xl font-bold text-amber-700">
                                        ${order.totalAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <button className="w-full mt-6 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3.5 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-3">
                                <FaDownload />
                                Download Invoice
                            </button>
                        </div>

                        {/* Customer Information */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <div className="p-2.5 bg-blue-100 rounded-lg">
                                    <FaUser className="text-blue-600" />
                                </div>
                                Customer Information
                            </h2>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="p-3 bg-amber-50 rounded-lg">
                                        <FaUser className="text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Customer Name</p>
                                        <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="p-3 bg-amber-50 rounded-lg">
                                        <FaHome className="text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
                                        <p className="font-medium text-gray-900 leading-tight">
                                            {order.shippingAddress.address}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="p-3 bg-amber-50 rounded-lg">
                                        <FaPhoneAlt className="text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                                        <p className="font-medium text-gray-900">+94 {order.shippingAddress.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <div className="p-2.5 bg-emerald-100 rounded-lg">
                                    <FaCard className="text-emerald-600" />
                                </div>
                                Payment Information
                            </h2>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Payment Method</span>
                                    <span className="font-medium text-gray-900">{order.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Payment Status</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        order.paymentStatus === 'paid' 
                                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                                    }`}>
                                        {order.paymentStatus.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Transaction ID</span>
                                    <span className="font-mono text-sm text-gray-900">{order._id.slice(-12)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Support & Help */}
                        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl border border-amber-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-3">Need Help?</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                If you have any questions about your order, our support team is here to help.
                            </p>
                            <button className="w-full bg-white text-amber-700 border border-amber-300 py-2.5 rounded-lg font-medium hover:bg-amber-50 transition-colors">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="bg-white border-t border-gray-200 py-6">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="text-sm text-gray-500">
                            Order ID: <span className="font-mono text-gray-900">{order._id}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => navigate('/orders')}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                View All Orders
                                <FaChevronRight className="text-sm" />
                            </button>
                            <button 
                                onClick={() => navigate('/products')}
                                className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                Continue Shopping
                                <FaShoppingBag className="text-sm" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}