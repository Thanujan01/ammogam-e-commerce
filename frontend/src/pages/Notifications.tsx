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
    FaRegBell,
    FaFilter
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
        <div className="min-h-screen bg-gray-50">
            {/* Professional Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#d97706] to-[#b45309] rounded-lg flex items-center justify-center shadow-sm">
                                    <FaBell className="text-white text-lg" />
                                </div>
                                {notifications.filter(n => !n.isRead).length > 0 && (
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                                        {notifications.filter(n => !n.isRead).length}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Notifications Center</h1>
                                <p className="text-sm text-gray-600 mt-1">Stay updated with your account activities</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={markAllRead}
                                disabled={!notifications.some(n => !n.isRead)}
                                className={`px-4 py-2.5 text-sm font-medium rounded-lg flex items-center gap-2 transition-all ${
                                    notifications.some(n => !n.isRead)
                                        ? 'bg-[#d97706] text-white hover:bg-[#b45309] shadow-sm'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <FaCheckCircle />
                                Mark All Read
                            </button>
                            <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                <FaCog className="text-gray-600 text-sm" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filter Bar */}
                <div className="mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Search Bar */}
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="text"
                                    placeholder="Search notifications..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] focus:bg-white"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <FaTimes className="text-sm" />
                                    </button>
                                )}
                            </div>

                            {/* Filter Tabs */}
                            <div className="flex items-center gap-2">
                                <FaFilter className="text-gray-400 text-sm" />
                                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setFilter('all')}
                                        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'all' ? 'bg-white shadow-sm text-[#d97706]' : 'text-gray-600 hover:text-gray-900'}`}
                                    >
                                        All ({notifications.length})
                                    </button>
                                    <button
                                        onClick={() => setFilter('unread')}
                                        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'unread' ? 'bg-white shadow-sm text-[#d97706]' : 'text-gray-600 hover:text-gray-900'}`}
                                    >
                                        Unread ({notifications.filter(n => !n.isRead).length})
                                    </button>
                                    <button
                                        onClick={() => setFilter('orders')}
                                        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'orders' ? 'bg-white shadow-sm text-[#d97706]' : 'text-gray-600 hover:text-gray-900'}`}
                                    >
                                        Orders ({notifications.filter(n => n.type === 'order').length})
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                {filteredNotifications.length > 0 && (
                    <div className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">{filteredNotifications.length}</div>
                                        <div className="text-sm text-gray-600 mt-1">Total Notifications</div>
                                    </div>
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <FaBell className="text-blue-600" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {filteredNotifications.filter(n => !n.isRead).length}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">Unread</div>
                                    </div>
                                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                                        <FaExclamationCircle className="text-red-600" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {filteredNotifications.filter(n => n.type === 'order').length}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">Order Updates</div>
                                    </div>
                                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                        <FaCheckCircle className="text-green-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <FaRegBell className="text-3xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            {searchTerm ? 'No notifications found' : 'No notifications yet'}
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {searchTerm 
                                ? 'Try searching with different keywords or clear your search.'
                                : 'When you receive notifications, they\'ll appear here.'
                            }
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            {searchTerm ? (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="px-5 py-2.5 bg-[#d97706] text-white rounded-lg font-medium hover:bg-[#b45309] transition-colors shadow-sm"
                                >
                                    Clear Search
                                </button>
                            ) : (
                                <Link 
                                    to="/products" 
                                    className="px-5 py-2.5 bg-[#d97706] text-white rounded-lg font-medium hover:bg-[#b45309] transition-colors shadow-sm flex items-center justify-center gap-2"
                                >
                                    Browse Products
                                    <FaChevronRight className="text-xs" />
                                </Link>
                            )}
                            <button
                                onClick={() => setFilter('all')}
                                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                View All Notifications
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Notifications List */}
                        {filteredNotifications.map((notification) => {
                            const isHighPriority = getNotificationPriority(notification.type) === 'high';
                            const isExpanded = expandedNotification === notification._id;

                            return (
                                <div
                                    key={notification._id}
                                    className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                                        !notification.isRead
                                            ? 'border-[#d97706] shadow-sm'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {/* Notification Header */}
                                    <div 
                                        className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => toggleExpand(notification._id)}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Status Indicator */}
                                            <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-2 ${
                                                !notification.isRead
                                                    ? 'bg-[#d97706] animate-pulse'
                                                    : 'bg-gray-300'
                                            }`} />

                                            {/* Icon */}
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                isHighPriority
                                                    ? 'bg-red-50 text-red-600'
                                                    : !notification.isRead
                                                    ? 'bg-[#d97706]/10 text-[#d97706]'
                                                    : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                {isHighPriority ? (
                                                    <FaExclamationCircle className="text-lg" />
                                                ) : !notification.isRead ? (
                                                    <FaBell className="text-lg" />
                                                ) : (
                                                    <FaCheckCircle className="text-lg" />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                                                    <h4 className={`font-semibold truncate ${
                                                        !notification.isRead
                                                            ? 'text-gray-900'
                                                            : 'text-gray-700'
                                                    }`}>
                                                        {notification.title}
                                                    </h4>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                                            {getTimeDisplay(notification.createdAt)}
                                                        </span>
                                                        <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                                                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                <p className="text-sm text-gray-600 line-clamp-1 mb-3">
                                                    {notification.message}
                                                </p>

                                                {/* Tags and Actions */}
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs px-2.5 py-1 rounded-full ${
                                                            notification.type === 'order'
                                                                ? 'bg-blue-50 text-blue-700'
                                                                : notification.type === 'alert'
                                                                ? 'bg-red-50 text-red-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                                                        </span>
                                                        {isHighPriority && (
                                                            <span className="text-xs px-2.5 py-1 bg-red-50 text-red-700 rounded-full">
                                                                High Priority
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        {!notification.isRead && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    markAsRead(notification._id);
                                                                }}
                                                                className="text-xs px-3 py-1 bg-[#d97706] text-white rounded hover:bg-[#b45309] transition-colors flex items-center gap-1"
                                                            >
                                                                <FaCheckCircle className="text-xs" />
                                                                Mark Read
                                                            </button>
                                                        )}
                                                        {notification.orderId && (
                                                            <Link
                                                                to={`/orders/${notification.orderId}`}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
                                                            >
                                                                View Order
                                                                <FaChevronRight className="text-xs" />
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div className="px-5 pb-5 border-t border-gray-100">
                                            <div className="pt-4">
                                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                
                                                {/* Additional Details */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <div className="text-xs text-gray-500 mb-1">Notification ID</div>
                                                        <div className="text-sm font-medium text-gray-900 font-mono">{notification._id.slice(-8)}</div>
                                                    </div>
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <div className="text-xs text-gray-500 mb-1">Created Time</div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {new Date(notification.createdAt).toLocaleString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() => markAsRead(notification._id)}
                                                            className="flex-1 bg-[#d97706] text-white py-2.5 rounded-lg font-medium hover:bg-[#b45309] transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            <FaCheckCircle />
                                                            Mark as Read
                                                        </button>
                                                    )}
                                                    {notification.orderId && (
                                                        <Link
                                                            to={`/orders/${notification.orderId}`}
                                                            className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            View Order Details
                                                            <FaChevronRight className="text-xs" />
                                                        </Link>
                                                    )}
                                                    <button
                                                        onClick={() => setExpandedNotification(null)}
                                                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Footer Actions */}
                        <div className="pt-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-gray-600">
                                    Showing <span className="font-semibold text-gray-900">{filteredNotifications.length}</span> of{' '}
                                    <span className="font-semibold text-gray-900">{notifications.length}</span> notifications
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={clearAll}
                                        className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                                    >
                                        <FaTimes />
                                        Clear All
                                    </button>
                                    <button
                                        onClick={markAllRead}
                                        disabled={!filteredNotifications.some(n => !n.isRead)}
                                        className={`px-4 py-2.5 text-sm font-medium rounded-lg flex items-center gap-2 ${
                                            filteredNotifications.some(n => !n.isRead)
                                                ? 'bg-[#d97706] text-white hover:bg-[#b45309]'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <FaCheckCircle />
                                        Mark All as Read
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}