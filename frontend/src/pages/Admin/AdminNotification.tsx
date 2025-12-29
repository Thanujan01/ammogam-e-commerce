import { useState, useEffect } from 'react';
import { FiBell, FiFilter, FiCheck, FiTrash2, FiShoppingCart, FiSettings, FiBriefcase, FiAlertTriangle } from 'react-icons/fi';
import { Bell } from 'lucide-react';
import { api } from '../../api/api';
import { Link } from 'react-router-dom';

export default function AdminNotification() {
  const [notificationList, setNotificationList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRead, setFilterRead] = useState<string>('all');

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

  const setNotifications = (data: any[]) => {
    // Map backend data to local structure if needed, or just use as is
    setNotificationList(data);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotificationList(prev =>
        prev.map(notif => (notif._id === id ? { ...notif, isRead: true } : notif))
      );
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotificationList(prev => prev.map(notif => ({ ...notif, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      await api.delete(`/notifications/${id}`);
      setNotificationList(prev => prev.filter(notif => notif._id !== id));
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

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
      case 'stock_alert':
        return <FiAlertTriangle className="w-5 h-5" />;
      case 'seller_registration':
        return <FiBriefcase className="w-5 h-5" />;
      case 'system':
        return <FiSettings className="w-5 h-5" />;
      default:
        return <FiBell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order':
      case 'order_status':
        return 'bg-blue-100 text-blue-600';
      case 'stock_alert':
        return 'bg-orange-100 text-orange-600';
      case 'seller_registration':
        return 'bg-purple-100 text-purple-600';
      case 'system':
        return 'bg-gray-100 text-gray-600';
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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 text-black border border-gray-100">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Admin Notifications</h1>
            <p className="text-gray-500 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Manage order alerts, stock warnings, and system updates
            </p>
          </div>
          <div className="flex gap-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary1 text-white rounded-lg font-semibold hover:bg-orange-500 transition-all shadow-md"
              >
                <FiCheck className="w-4 h-4" />
                Mark All as Read ({unreadCount})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <FiFilter className="w-5 h-5 text-indigo-500" />
            Filters:
          </div>
          <div className="flex flex-wrap gap-3 flex-1">
            <select
              value={filterRead}
              onChange={e => setFilterRead(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>
          <button
            onClick={() => setFilterRead('all')}
            className="px-4 py-2 border-2 border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-600 rounded-lg font-medium transition-all text-sm whitespace-nowrap"
          >
            Reset Filters
          </button>
        </div>
        <div className="mt-3 text-sm text-gray-500">
          Showing {filteredNotifications.length} of {notificationList.length} notifications
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Fetching live notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No notifications found</h3>
            <p className="text-gray-500 text-sm">You're all caught up! No new alerts to show.</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification._id}
              className={`bg-white rounded-xl shadow-sm border ${notification.isRead ? 'border-gray-200' : 'border-indigo-300 bg-indigo-50/30'
                } p-5 hover:shadow-md transition-all`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${getNotificationColor(notification.type)} rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm font-bold`}>
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                        {notification.title}
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-gray-500">{formatTime(notification.createdAt)}</p>
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg text-xs font-medium transition-all"
                        >
                          <FiCheck className="w-3 h-3" />
                          Mark Read
                        </button>
                      )}
                      {(notification.orderId || notification.productId) && (
                        <Link
                          to={notification.orderId ? `/admin/orders?id=${notification.orderId}` : `/admin/products?id=${notification.productId}`}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-all"
                        >
                          {notification.orderId ? 'View Order' : 'View Product'}
                        </Link>
                      )}
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-all"
                      >
                        <FiTrash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
