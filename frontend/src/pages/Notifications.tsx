import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { 
    FaBell, 
    FaCheckCircle, 
    FaChevronRight, 
    FaCog, 
    FaTimes, 
    FaExclamationCircle, 
    FaSearch, 
    FaChevronDown, 
    FaChevronUp,
    FaRegBell
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Notifications() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread' | 'orders' | 'system'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedNotification, setExpandedNotification] = useState<string | null>(null);

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

    const clearAll = async () => {
        try {
            await api.delete('/notifications/clear');
            setNotifications([]);
        } catch (error) {
            console.error("Failed to clear notifications", error);
        }
    };

    // Filter notifications
    const filteredNotifications = notifications.filter(notification => {
        const matchesFilter = filter === 'all' || 
            (filter === 'unread' && !notification.isRead) ||
            (filter === 'orders' && notification.type === 'order') ||
            (filter === 'system' && notification.type === 'system');
        
        const matchesSearch = !searchTerm || 
            notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.message.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesFilter && matchesSearch;
    });

    // Get notification priority
    const getNotificationPriority = (type: string) => {
        switch(type) {
            case 'alert':
            case 'security':
                return 'high';
            case 'order':
            case 'payment':
                return 'medium';
            default:
                return 'low';
        }
    };

    // Get time display
    const getTimeDisplay = (date: string) => {
        const now = new Date();
        const notificationDate = new Date(date);
        const diffMs = now.getTime() - notificationDate.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return notificationDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Toggle notification expansion
    const toggleExpand = (id: string) => {
        setExpandedNotification(expandedNotification === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
            {/* Modern Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-orange-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                                    <FaBell className="text-white text-xl" />
                                </div>
                                {notifications.filter(n => !n.isRead).length > 0 && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {notifications.filter(n => !n.isRead).length}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                                <p className="text-sm text-gray-500">Stay updated with your activity</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Quick Actions */}
                            <div className="hidden md:flex items-center gap-2">
                                <button
                                    onClick={markAllRead}
                                    disabled={!notifications.some(n => !n.isRead)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-all ${
                                        notifications.some(n => !n.isRead)
                                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <FaCheckCircle />
                                    Mark all read
                                </button>
                                <button
                                    onClick={clearAll}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                                >
                                    <FaTimes />
                                    Clear all
                                </button>
                            </div>
                            
                            {/* Settings */}
                            <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                <FaCog className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="mt-6">
                        <div className="flex items-center gap-1 border-b border-gray-200">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
                                    filter === 'all'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                All ({notifications.length})
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
                                    filter === 'unread'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Unread ({notifications.filter(n => !n.isRead).length})
                            </button>
                            <button
                                onClick={() => setFilter('orders')}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
                                    filter === 'orders'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Orders ({notifications.filter(n => n.type === 'order').length})
                            </button>
                            <button
                                onClick={() => setFilter('system')}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
                                    filter === 'system'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                System ({notifications.filter(n => n.type === 'system').length})
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-50 to-amber-100 rounded-full flex items-center justify-center">
                            <FaRegBell className="text-4xl text-orange-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {searchTerm ? 'No results found' : 'All caught up!'}
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            {searchTerm 
                                ? 'Try searching with different keywords.'
                                : 'You don\'t have any notifications at the moment. We\'ll notify you when something important happens.'
                            }
                        </p>
                        {searchTerm ? (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-sm"
                            >
                                Clear search
                            </button>
                        ) : (
                            <Link 
                                to="/products" 
                                className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-sm"
                            >
                                Browse products
                                <FaChevronRight className="text-sm" />
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Stats Summary */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3 bg-orange-50 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">{filteredNotifications.length}</div>
                                    <div className="text-sm text-gray-600">Showing</div>
                                </div>
                                <div className="text-center p-3 bg-red-50 rounded-lg">
                                    <div className="text-2xl font-bold text-red-600">
                                        {filteredNotifications.filter(n => !n.isRead).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Unread</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {filteredNotifications.filter(n => getNotificationPriority(n.type) === 'high').length}
                                    </div>
                                    <div className="text-sm text-gray-600">High Priority</div>
                                </div>
                            </div>
                        </div>

                        {/* Notifications List */}
                        {filteredNotifications.map((notification) => {
                            const isHighPriority = getNotificationPriority(notification.type) === 'high';
                            const isExpanded = expandedNotification === notification._id;

                            return (
                                <div
                                    key={notification._id}
                                    className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
                                        !notification.isRead
                                            ? 'border-orange-200 shadow-md shadow-orange-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {/* Notification Header */}
                                    <div 
                                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => toggleExpand(notification._id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Status Indicator */}
                                            <div className={`mt-1 w-3 h-3 rounded-full flex items-center justify-center ${
                                                !notification.isRead
                                                    ? 'bg-orange-500 animate-pulse'
                                                    : 'bg-gray-300'
                                            }`}>
                                                {!notification.isRead && (
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                                )}
                                            </div>

                                            {/* Icon */}
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                isHighPriority
                                                    ? 'bg-red-100 text-red-600'
                                                    : !notification.isRead
                                                    ? 'bg-orange-100 text-orange-600'
                                                    : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                {isHighPriority ? (
                                                    <FaExclamationCircle />
                                                ) : !notification.isRead ? (
                                                    <FaBell />
                                                ) : (
                                                    <FaCheckCircle />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className={`font-semibold truncate ${
                                                        !notification.isRead
                                                            ? 'text-gray-900'
                                                            : 'text-gray-700'
                                                    }`}>
                                                        {notification.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-500">
                                                            {getTimeDisplay(notification.createdAt)}
                                                        </span>
                                                        <button className="text-gray-400 hover:text-gray-600">
                                                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                <p className="text-sm text-gray-600 line-clamp-1">
                                                    {notification.message}
                                                </p>

                                                {/* Tags */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                                        notification.type === 'order'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : notification.type === 'alert'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {notification.type}
                                                    </span>
                                                    {isHighPriority && (
                                                        <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                                                            High Priority
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-1">
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            markAsRead(notification._id);
                                                        }}
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-green-600 transition-colors"
                                                        title="Mark as read"
                                                    >
                                                        <FaCheckCircle />
                                                    </button>
                                                )}
                                                {notification.orderId && (
                                                    <Link
                                                        to={`/orders/${notification.orderId}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                                                        title="View order"
                                                    >
                                                        <FaChevronRight />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div className="px-4 pb-4 border-t border-gray-100">
                                            <div className="pt-4">
                                                <p className="text-sm text-gray-600 mb-4">
                                                    {notification.message}
                                                </p>
                                                
                                                {/* Additional Details */}
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <div className="text-xs text-gray-500 mb-1">Notification ID</div>
                                                        <div className="font-medium text-gray-900">{notification._id.slice(-8)}</div>
                                                    </div>
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <div className="text-xs text-gray-500 mb-1">Created</div>
                                                        <div className="font-medium text-gray-900">
                                                            {new Date(notification.createdAt).toLocaleDateString('en-US', {
                                                                weekday: 'short',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 mt-4">
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() => markAsRead(notification._id)}
                                                            className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            <FaCheckCircle />
                                                            Mark as Read
                                                        </button>
                                                    )}
                                                    {notification.orderId && (
                                                        <Link
                                                            to={`/orders/${notification.orderId}`}
                                                            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            View Order
                                                            <FaChevronRight className="text-xs" />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Load More / Actions */}
                        <div className="flex items-center justify-between pt-6">
                            <div className="text-sm text-gray-500">
                                Showing {filteredNotifications.length} of {notifications.length} notifications
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={markAllRead}
                                    disabled={!filteredNotifications.some(n => !n.isRead)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 ${
                                        filteredNotifications.some(n => !n.isRead)
                                            ? 'bg-orange-600 text-white hover:bg-orange-700'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <FaCheckCircle />
                                    Mark all as read
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Actions Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
                <div className="flex items-center justify-between">
                    <button
                        onClick={markAllRead}
                        disabled={!notifications.some(n => !n.isRead)}
                        className={`flex-1 mx-2 py-3 text-sm font-medium rounded-lg flex items-center justify-center gap-2 ${
                            notifications.some(n => !n.isRead)
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-200 text-gray-400'
                        }`}
                    >
                        <FaCheckCircle />
                        Mark all read
                    </button>
                    <button
                        onClick={clearAll}
                        className="flex-1 mx-2 py-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg flex items-center justify-center gap-2"
                    >
                        <FaTimes />
                        Clear all
                    </button>
                </div>
            </div>
        </div>
    );
}