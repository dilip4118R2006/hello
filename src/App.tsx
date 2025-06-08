import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { NotificationPanel } from './components/NotificationPanel';
import { useNotifications } from './hooks/useNotifications';
import { auth } from './utils/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);
  const { 
    notifications, 
    addNotification, 
    removeNotification, 
    markAsRead, 
    clearAll,
    showRequestSubmitted,
    showRequestApproved,
    showRequestRejected,
    showComponentCheckedOut,
    showComponentReturned,
    showDueDateReminder,
    showOverdueNotice
  } = useNotifications();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
      setIsAuthenticated(true);
      setUserRole(currentUser.role);
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
      setIsAuthenticated(true);
      setUserRole(currentUser.role);
      addNotification(
        'Welcome Back!',
        `Successfully logged in as ${currentUser.name}`,
        'success',
        'system',
        5000
      );
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    addNotification(
      'Logged Out',
      'You have been successfully logged out',
      'info',
      'system',
      3000
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative">
        <LoginForm onLogin={handleLogin} showNotification={addNotification} />
        {/* Notification Panel for login page */}
        <div className="fixed top-4 right-4 z-50">
          <NotificationPanel 
            notifications={notifications} 
            onRemove={removeNotification}
            onMarkAsRead={markAsRead}
            onClearAll={clearAll}
          />
        </div>
      </div>
    );
  }

  const notificationHandlers = {
    showRequestSubmitted,
    showRequestApproved,
    showRequestRejected,
    showComponentCheckedOut,
    showComponentReturned,
    showDueDateReminder,
    showOverdueNotice,
    addNotification
  };

  if (userRole === 'admin') {
    return (
      <div className="relative">
        <AdminDashboard 
          onLogout={handleLogout} 
          notificationHandlers={notificationHandlers}
        />
        {/* Notification Panel in header */}
        <div className="fixed top-4 right-4 z-50">
          <NotificationPanel 
            notifications={notifications} 
            onRemove={removeNotification}
            onMarkAsRead={markAsRead}
            onClearAll={clearAll}
          />
        </div>
      </div>
    );
  }

  if (userRole === 'student') {
    return (
      <div className="relative">
        <StudentDashboard 
          onLogout={handleLogout} 
          notificationHandlers={notificationHandlers}
        />
        {/* Notification Panel in header */}
        <div className="fixed top-4 right-4 z-50">
          <NotificationPanel 
            notifications={notifications} 
            onRemove={removeNotification}
            onMarkAsRead={markAsRead}
            onClearAll={clearAll}
          />
        </div>
      </div>
    );
  }

  return null;
}

export default App;