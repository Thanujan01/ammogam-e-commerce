import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { getImageUrl } from '../utils/imageUrl';
import {
    FaBox, FaChevronLeft,
    FaMapMarkerAlt, FaPhoneAlt, FaCreditCard,
    FaExclamationCircle, FaReceipt
} from 'react-icons/fa';

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'processed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'shipped': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <FaExclamationCircle className="text-6xl text-gray-300 mb-4" />
                <h2 className="text-2xl font-black text-gray-900">Order Not Found</h2>
                <p className="text-gray-500 mb-8 text-center">We couldn't find the order you're looking for.</p>
                <button onClick={() => navigate('/dashboard')} className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold">Back to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="bg-white border-b py-6 px-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all">
                            <FaChevronLeft className="text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Order # {order._id.slice(-8).toUpperCase()}</h1>
                            <p className="text-gray-500 font-medium text-sm">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                        {order.status}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Items and Summary */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                <FaBox />
                            </div>
                            <h3 className="text-xl font-black text-gray-900">Items in Order</h3>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="py-6 flex gap-6 items-center">
                                    <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border p-2 flex-shrink-0">
                                        <img src={getImageUrl(item.product?.image)} className="w-full h-full object-contain" alt={item.product?.name} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900">{item.product?.name || 'Unknown Product'}</h4>
                                        <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                                        {item.status && (
                                            <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-gray-900">$ {(item.price * item.quantity).toLocaleString()}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">$ {item.price.toLocaleString()} ea</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-dashed border-gray-200 space-y-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-bold">$ {(order.totalAmount - (order.shippingFee || 0)).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping Fee</span>
                                <span className="font-bold">$ {(order.shippingFee || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <span className="text-lg font-black text-gray-900">Total Charged</span>
                                <span className="text-2xl font-black text-amber-700">$ {order.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Delivery and Payment Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Delivery Address</h4>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                                <FaMapMarkerAlt />
                            </div>
                            <div>
                                <p className="font-black text-gray-900 text-base mb-1">
                                    {order.shippingAddress.name}
                                </p>
                                <p className="font-bold text-gray-900 leading-tight mb-2 text-sm">
                                    {order.shippingAddress.address}
                                </p>
                                <p className="text-sm text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                                <FaPhoneAlt />
                            </div>
                            <div className="text-sm font-black text-gray-900">+94 {order.shippingAddress.phone}</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Payment Method</h4>
                        <div className="flex gap-4 mb-6">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                                <FaCreditCard />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm mb-1">{order.paymentMethod}</p>
                                <div className={`text-[10px] font-black uppercase tracking-widest ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                                    {order.paymentStatus}
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                <div className="text-xs font-bold text-gray-500 uppercase">Track History</div>
                            </div>
                            <div className="space-y-4 pl-4 border-l-2 border-gray-200 ml-1">
                                <div className="relative">
                                    <div className="absolute -left-[18px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></div>
                                    <div className="text-[10px] font-black text-emerald-600 uppercase mb-0.5">Order Placed</div>
                                    <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                                {order.status !== 'pending' && (
                                    <div className="relative">
                                        <div className="absolute -left-[18px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
                                        <div className="text-[10px] font-black text-blue-600 uppercase mb-0.5">{order.status}</div>
                                        <div className="text-xs text-gray-400">{new Date(order.updatedAt).toLocaleDateString()}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3">
                        <FaReceipt />
                        Download Invoice
                    </button>
                </div>

            </div>
        </div>
    );
}
