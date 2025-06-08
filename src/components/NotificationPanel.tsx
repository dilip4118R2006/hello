import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, AlertTriangle, Clock, Package, UserCheck, UserX } from 'lucide-react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  category: 'request' | 'approval' | 'rejection' | 'checkout' | 'return' | 'system';
  timestamp: string;
  read: boolean;
  duration?: number;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
  notifications, 
  onRemove, 
  onMarkAsRead,
  onClearAll 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (unreadCount > 0) {
      setHasNewNotifications(true);
    }
  }, [unreadCount]);

  const handleTogglePanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen && hasNewNotifications) {
      setHasNewNotifications(false);
    }
  };

  const getIcon = (type: string, category: string) => {
    switch (category) {
      case 'request': return <Clock className="w-5 h-5" />;
      case 'approval': return <CheckCircle className="w-5 h-5" />;
      case 'rejection': return <UserX className="w-5 h-5" />;
      case 'checkout': return <Package className="w-5 h-5" />;
      case 'return': return <UserCheck className="w-5 h-5" />;
      default:
        switch (type) {
          case 'success': return <CheckCircle className="w-5 h-5" />;
          case 'error': return <AlertCircle className="w-5 h-5" />;
          case 'warning': return <AlertTriangle className="w-5 h-5" />;
          case 'info': return <Info className="w-5 h-5" />;
          default: return <Info className="w-5 h-5" />;
        }
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-600/20 border-green-500/30 text-green-300';
      case 'error': return 'bg-red-600/20 border-red-500/30 text-red-300';
      case 'warning': return 'bg-yellow-600/20 border-yellow-500/30 text-yellow-300';
      case 'info': return 'bg-blue-600/20 border-blue-500/30 text-blue-300';
      default: return 'bg-gray-600/20 border-gray-500/30 text-gray-300';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <button
        onClick={handleTogglePanel}
        className="relative p-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl border border-gray-600/50 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Bell className="w-6 h-6 text-gray-300" />
        {unreadCount > 0 && (
          <>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
            {hasNewNotifications && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
            )}
          </>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute top-full right-0 mt-2 w-96 max-h-[600px] bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <div>
                <h3 className="text-xl font-bold text-white">Notifications</h3>
                <p className="text-sm text-gray-400">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {notifications.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-xs text-gray-400 hover:text-white px-3 py-1 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[500px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                    <Info className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-center font-medium">No notifications yet</p>
                  <p className="text-gray-500 text-sm text-center mt-1">
                    You'll see updates about your requests here
                  </p>
                </div>
              ) : (
                <div className="p-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`
                        relative p-4 mb-2 rounded-xl border transition-all duration-200 cursor-pointer
                        ${notification.read 
                          ? 'bg-gray-700/30 border-gray-600/30 opacity-75' 
                          : 'bg-gray-700/50 border-gray-600/50 hover:bg-gray-600/50'
                        }
                      `}
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      {!notification.read && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getColors(notification.type)}`}>
                          {getIcon(notification.type, notification.category)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-semibold text-white truncate">
                              {notification.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemove(notification.id);
                              }}
                              className="ml-2 p-1 hover:bg-gray-600/50 rounded transition-colors flex-shrink-0"
                            >
                              <X className="w-3 h-3 text-gray-400" />
                            </button>
                          </div>
                          
                          <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.timestamp)}
                            </span>
                            <span className={`
                              text-xs px-2 py-1 rounded-full font-medium
                              ${getColors(notification.type)}
                            `}>
                              {notification.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};