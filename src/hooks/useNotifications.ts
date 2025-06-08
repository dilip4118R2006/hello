import { useState, useCallback } from 'react';
import { Notification } from '../components/NotificationPanel';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    category: 'request' | 'approval' | 'rejection' | 'checkout' | 'return' | 'system' = 'system',
    duration: number = 0 // 0 means persistent
  ) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const notification: Notification = {
      id,
      title,
      message,
      type,
      category,
      timestamp: new Date().toISOString(),
      read: false,
      duration
    };

    setNotifications(prev => [notification, ...prev]);

    // Auto-remove if duration is set
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Predefined notification templates
  const showRequestSubmitted = useCallback((componentName: string, quantity: number) => {
    addNotification(
      'Request Submitted',
      `Your request for ${quantity}x ${componentName} has been submitted and is pending admin approval.`,
      'info',
      'request'
    );
  }, [addNotification]);

  const showRequestApproved = useCallback((componentName: string, quantity: number, adminNotes?: string) => {
    addNotification(
      'Request Approved! 🎉',
      `Your request for ${quantity}x ${componentName} has been approved. ${adminNotes || 'Please collect from the lab.'}`,
      'success',
      'approval'
    );
  }, [addNotification]);

  const showRequestRejected = useCallback((componentName: string, quantity: number, reason?: string) => {
    addNotification(
      'Request Rejected',
      `Your request for ${quantity}x ${componentName} has been rejected. ${reason || 'Please contact admin for more details.'}`,
      'error',
      'rejection'
    );
  }, [addNotification]);

  const showComponentCheckedOut = useCallback((componentName: string, quantity: number, dueDate: string) => {
    addNotification(
      'Component Checked Out',
      `You have successfully checked out ${quantity}x ${componentName}. Please return by ${new Date(dueDate).toLocaleDateString()}.`,
      'success',
      'checkout'
    );
  }, [addNotification]);

  const showComponentReturned = useCallback((componentName: string, quantity: number) => {
    addNotification(
      'Component Returned',
      `Thank you for returning ${quantity}x ${componentName}. Your borrowing record has been updated.`,
      'success',
      'return'
    );
  }, [addNotification]);

  const showDueDateReminder = useCallback((componentName: string, quantity: number, daysLeft: number) => {
    addNotification(
      'Due Date Reminder',
      `Your borrowed ${quantity}x ${componentName} is due in ${daysLeft} day(s). Please return to avoid late fees.`,
      'warning',
      'system'
    );
  }, [addNotification]);

  const showOverdueNotice = useCallback((componentName: string, quantity: number, daysOverdue: number) => {
    addNotification(
      'Overdue Notice',
      `Your ${quantity}x ${componentName} is ${daysOverdue} day(s) overdue. Please return immediately to avoid penalties.`,
      'error',
      'system'
    );
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    clearAll,
    // Template functions
    showRequestSubmitted,
    showRequestApproved,
    showRequestRejected,
    showComponentCheckedOut,
    showComponentReturned,
    showDueDateReminder,
    showOverdueNotice
  };
};