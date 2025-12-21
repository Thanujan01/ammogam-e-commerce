import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { FaBell, FaCheckCircle, FaCircle, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Notifications() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const markAllRead = async () => {
        try {
            await api.put('/notifications/mark-all-read');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="bg-white border-b py-8 px-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 text-xl shadow-sm">
                            <FaBell />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Notifications</h1>
                            <p className="text-gray-500 font-medium">Stay updated on your orders and account activity</p>
                        </div>
                    </div>
                    {notifications.some(n => !n.isRead) && (
                        <button
                            onClick={markAllRead}
                            className="text-amber-600 font-black text-xs uppercase tracking-widest hover:underline"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-16 text-center border border-gray-100 shadow-sm">
                        <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaBell className="text-4xl" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">All caught up!</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">You don't have any notifications right now. We'll let you know when something important happens.</p>
                        <Link to="/products" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-black transition-all shadow-lg shadow-gray-900/10">
                            Continue Shopping
                            <FaChevronRight className="text-sm" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((n) => (
                            <div
                                key={n._id}
                                onClick={() => !n.isRead && markAsRead(n._id)}
                                className={`group bg-white rounded-3xl p-6 border transition-all duration-300 flex items-start gap-4 cursor-pointer hover:shadow-xl hover:shadow-gray-200/50 ${!n.isRead ? 'border-amber-200 ring-4 ring-amber-50 shadow-sm' : 'border-gray-100 opacity-80 hover:opacity-100'}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${!n.isRead ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>
                                    {n.isRead ? <FaCheckCircle className="text-lg" /> : <FaBell className="animate-pulse" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className={`text-lg transition-colors ${!n.isRead ? 'font-black text-gray-900' : 'font-bold text-gray-600'}`}>
                                            {n.title}
                                        </h4>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap ml-4">
                                            {new Date(n.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{n.message}</p>

                                    {n.orderId && (
                                        <Link
                                            to={`/orders/${n.orderId}`}
                                            className="inline-flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-[0.2em] bg-amber-50 px-4 py-2 rounded-xl group-hover:bg-amber-100 transition-all"
                                        >
                                            View Order Details
                                            <FaChevronRight className="text-[8px] transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    )}
                                </div>
                                {!n.isRead && (
                                    <div className="p-2">
                                        <FaCircle className="text-amber-500 text-[10px]" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
