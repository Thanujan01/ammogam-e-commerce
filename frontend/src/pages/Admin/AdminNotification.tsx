import { useState } from 'react';
import { FiBell, FiFilter, FiCheck, FiTrash2, FiPackage, FiShoppingCart, FiUsers, FiSettings } from 'react-icons/fi';
import { Bell } from 'lucide-react';
import { notifications as mockNotifications, type Notification } from '../../data/mockData';

export default function AdminNotification() {
  const [notificationList, setNotificationList] = useState<Notification[]>(mockNotifications);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');

  const handleMarkAsRead = (id: string) => {
    setNotificationList(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotificationList(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotificationList(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notificationList.filter(notif => {
    const matchesType = filterType === 'all' || notif.type === filterType;
    const matchesRead =
      filterRead === 'all' ||
      (filterRead === 'unread' && !notif.read) ||
      (filterRead === 'read' && notif.read);
    return matchesType && matchesRead;
  });

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <FiShoppingCart className="w-5 h-5" />;
      case 'product':
        return <FiPackage className="w-5 h-5" />;
      case 'user':
        return <FiUsers className="w-5 h-5" />;
      case 'system':
        return <FiSettings className="w-5 h-5" />;
      default:
        return <FiBell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return 'bg-blue-100 text-blue-600';
      case 'product':
        return 'bg-purple-100 text-purple-600';
      case 'user':
        return 'bg-green-100 text-green-600';
      case 'system':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // const getPriorityBadge = (priority: Notification['priority']) => {
  //   const colors = {
  //     low: 'bg-gray-100 text-gray-700 border-gray-200',
  //     medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  //     high: 'bg-red-100 text-red-700 border-red-200',
  //   };

  //   const icons = {
  //     low: <Info className="w-3 h-3" />,
  //     medium: <AlertCircle className="w-3 h-3" />,
  //     high: <AlertCircle className="w-3 h-3" />,
  //   };

  //   return (
  //     <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${colors[priority]}`}>
  //       {icons[priority]}
  //       {priority.charAt(0).toUpperCase() + priority.slice(1)}
  //     </span>
  //   );
  // };

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

  const unreadCount = notificationList.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-indigo-100 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Stay updated with all your important notifications
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all shadow-md"
            >
              <FiCheck className="w-4 h-4" />
              Mark All as Read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 font-medium">Total</p>
              <p className="text-2xl font-bold text-gray-900">{notificationStats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiBell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 font-medium">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-white to-red-50 rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 font-medium">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">{notificationStats.high}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 font-medium">Read</p>
              <p className="text-2xl font-bold text-gray-900">{notificationList.filter(n => n.read).length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div> */}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <FiFilter className="w-5 h-5" />
            Filters:
          </div>
          <div className="flex flex-wrap gap-3 flex-1">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
            >
              <option value="all">All Types</option>
              <option value="order">Orders</option>
              <option value="product">Products</option>
              <option value="user">Users</option>
              {/* <option value="system">System</option> */}
            </select>
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
            onClick={() => {
              setFilterType('all');
              setFilterRead('all');
            }}
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
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No notifications found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your filters to see more notifications</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-sm border ${
                notification.read ? 'border-gray-200' : 'border-indigo-300 bg-indigo-50/30'
              } p-5 hover:shadow-md transition-all`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${getNotificationColor(notification.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                        {notification.title}
                        {!notification.read && (
                          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
                    </div>
                    {/* {getPriorityBadge(notification.priority)} */}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-gray-500">{formatTime(notification.time)}</p>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg text-xs font-medium transition-all"
                        >
                          <FiCheck className="w-3 h-3" />
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
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
