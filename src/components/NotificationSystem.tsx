import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications, onRemove }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-600/95 border-green-500/50 text-white';
      case 'error': return 'bg-red-600/95 border-red-500/50 text-white';
      case 'warning': return 'bg-yellow-600/95 border-yellow-500/50 text-white';
      case 'info': return 'bg-teal-600/95 border-teal-500/50 text-white';
      default: return 'bg-gray-600/95 border-gray-500/50 text-white';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
          getIcon={getIcon}
          getColors={getColors}
        />
      ))}
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
  getIcon: (type: string) => React.ReactNode;
  getColors: (type: string) => string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onRemove, 
  getIcon, 
  getColors 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 50);
    
    // Auto remove after duration
    const removeTimer = setTimeout(() => {
      handleRemove();
    }, notification.duration || 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible && !isRemoving 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
        ${getColors(notification.type)}
        backdrop-blur-lg rounded-xl border shadow-2xl
        p-4 min-w-[320px] max-w-sm
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-relaxed">
            {notification.message}
          </p>
        </div>
        <button
          onClick={handleRemove}
          className="flex-shrink-0 ml-2 p-1 rounded-lg hover:bg-white/20 transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};