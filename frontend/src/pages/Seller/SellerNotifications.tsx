import { useState, useEffect } from 'react';
import { FiBell, FiFilter, FiCheck, FiShoppingCart, FiBox } from 'react-icons/fi';
import { Bell } from 'lucide-react';
import { api } from '../../api/api';

interface Notification {
    _id: string;
    recipient: string;
    title: string;
    message: string;
    type: 'order' | 'product' | 'system' | 'user' | 'order_status';
    isRead: boolean;
    createdAt: string;
    orderId?: string;
}

export default function SellerNotifications() {
    const [notificationList, setNotificationList] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterRead, setFilterRead] = useState<string>('all');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotificationList(res.data);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotificationList(prev =>
                prev.map(notif => (notif._id === id ? { ...notif, isRead: true } : notif))
            );
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await api.put('/notifications/mark-all-read');
            setNotificationList(prev => prev.map(notif => ({ ...notif, isRead: true })));
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    //   const handleDelete = async (id: string) => {
    //       // Backend doesn't strictly have delete endpoint in list provided, but assuming we can add if needed.
    //       // For now, let's just omit or if user wants delete, we need backend support.
    //       // The prompt didn't strictly ask for delete, just "get message". 
    //       // But AdminNotification has delete. Let's assume we might need it, but I won't implement API call if route doesn't exist.
    //       // Route list shows only GET / and PUT read. No DELETE.
    //       // So I will comment out Delete or handle locally only? No, real apps need API.
    //       // I'll skip Delete button for now to avoid errors, or just show it but maybe it does nothing.
    //   };

    const filteredNotifications = notificationList.filter(notif => {
        const matchesRead =
            filterRead === 'all' ||
            (filterRead === 'unread' && !notif.isRead) ||
            (filterRead === 'read' && notif.isRead);
        return matchesRead;
    });

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'order':
            case 'order_status':
                return <FiShoppingCart className="w-5 h-5" />;
            case 'product':
                return <FiBox className="w-5 h-5" />;
            default:
                return <FiBell className="w-5 h-5" />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'order':
            case 'order_status':
                return 'bg-blue-100 text-blue-600';
            case 'product':
                return 'bg-purple-100 text-purple-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const formatTime = (time: string) => {
        const date = new Date(time);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const unreadCount = notificationList.filter(n => !n.isRead).length;

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading notifications...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <Bell className="text-orange-600" />
                            Notifications
                        </h1>
                        <p className="text-gray-500 font-medium mt-2">New orders, status updates and system messages</p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 text-sm"
                        >
                            <FiCheck className="w-4 h-4" />
                            Mark All as Read
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-700 font-bold text-sm uppercase tracking-wide">
                        <FiFilter /> Filter:
                    </div>
                    <select
                        value={filterRead}
                        onChange={e => setFilterRead(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none text-sm bg-gray-50 font-medium"
                    >
                        <option value="all">All notifications</option>
                        <option value="unread">Unread Only</option>
                        <option value="read">Read Only</option>
                    </select>
                </div>

                <div className="space-y-3">
                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <FiBell className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No notifications found</h3>
                            <p className="text-gray-400 text-sm">You're all caught up!</p>
                        </div>
                    ) : (
                        filteredNotifications.map(notification => (
                            <div
                                key={notification._id}
                                className={`rounded-2xl border p-5 transition-all ${notification.isRead
                                    ? 'bg-white border-gray-100'
                                    : 'bg-indigo-50/40 border-indigo-100 shadow-sm'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 ${getNotificationColor(notification.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`font-bold text-gray-900 text-sm mb-1 ${!notification.isRead ? 'text-indigo-900' : ''}`}>
                                                {notification.title}
                                            </h3>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                                                {formatTime(notification.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">{notification.message}</p>

                                        {!notification.isRead && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification._id)}
                                                className="mt-3 text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                            >
                                                Mark as read <FiCheck />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
