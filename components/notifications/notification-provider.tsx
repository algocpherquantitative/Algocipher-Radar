"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: number;
}

interface Notification {
  id: string;
  type: 'signal' | 'alert' | 'system' | 'trade' | 'security' | 'market';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  data?: any;
  actions?: NotificationAction[];
}

interface NotificationAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  action: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep last 50

    // Show toast notification
    const toastMessage = `${notification.title}: ${notification.message}`;
    
    switch (notification.priority) {
      case 'critical':
        toast.error(toastMessage, {
          duration: 10000,
          action: {
            label: 'View',
            onClick: () => console.log('View notification'),
          },
        });
        break;
      case 'high':
        toast.warning(toastMessage, {
          duration: 8000,
          action: {
            label: 'View',
            onClick: () => console.log('View notification'),
          },
        });
        break;
      case 'medium':
        toast.info(toastMessage, {
          duration: 5000,
        });
        break;
      case 'low':
        toast(toastMessage, {
          duration: 3000,
        });
        break;
    }

    // Play notification sound (if enabled)
    if (typeof window !== 'undefined' && notification.priority !== 'low') {
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {
          // Ignore audio play errors (user interaction required)
        });
      } catch (error) {
        // Ignore audio errors
      }
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Simulate real-time notifications for demo
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.2) { // 20% chance every 15 seconds
        const signalTypes = ['signal', 'alert', 'trade', 'market'] as const;
        const priorities = ['medium', 'high'] as const;
        
        const type = signalTypes[Math.floor(Math.random() * signalTypes.length)];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        
        const messages = {
          signal: [
            'New high-confidence signal detected on EUR/USD',
            'Triangle breakout pattern identified on BTC/USD',
            'Support bounce signal on GBP/USD with 85% confidence'
          ],
          alert: [
            'Price alert triggered: BTC/USD reached $68,000',
            'Volume spike detected on EUR/USD',
            'Resistance level broken on AAPL'
          ],
          trade: [
            'Trade executed: Long position opened on EUR/USD',
            'Stop loss triggered on GBP/USD position',
            'Take profit reached on BTC/USD trade'
          ],
          market: [
            'Federal Reserve announces interest rate decision',
            'ECB monetary policy meeting scheduled',
            'Major economic data release: NFP report'
          ]
        };

        const typeMessages = messages[type];
        const message = typeMessages[Math.floor(Math.random() * typeMessages.length)];

        addNotification({
          type,
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Update`,
          message,
          read: false,
          priority,
          data: { 
            symbol: ['EUR/USD', 'BTC/USD', 'GBP/USD', 'AAPL'][Math.floor(Math.random() * 4)],
            confidence: Math.floor(Math.random() * 20) + 75
          }
        });
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}