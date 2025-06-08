import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { NotificationSystem } from './components/NotificationSystem';
import { useNotifications } from './hooks/useNotifications';
import { auth } from './utils/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);
  const { notifications, addNotification, removeNotification } = useNotifications();

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
      addNotification(`Welcome back, ${currentUser.name}!`, 'success');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    addNotification('Successfully logged out', 'info');
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
      <>
        <LoginForm onLogin={handleLogin} showNotification={addNotification} />
        <NotificationSystem notifications={notifications} onRemove={removeNotification} />
      </>
    );
  }

  if (userRole === 'admin') {
    return (
      <>
        <AdminDashboard onLogout={handleLogout} showNotification={addNotification} />
        <NotificationSystem notifications={notifications} onRemove={removeNotification} />
      </>
    );
  }

  if (userRole === 'student') {
    return (
      <>
        <StudentDashboard onLogout={handleLogout} showNotification={addNotification} />
        <NotificationSystem notifications={notifications} onRemove={removeNotification} />
      </>
    );
  }

  return null;
}

export default App;