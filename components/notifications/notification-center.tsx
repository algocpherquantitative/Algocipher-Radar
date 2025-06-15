"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  Settings, 
  Filter,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  CheckCircle,
  Activity,
  Zap,
  Target,
  Clock,
  User,
  Shield,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { createPortal } from 'react-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { NotificationSettings, NotificationSettingsActions } from '@/components/notifications/notification-settings';

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

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'signal',
    title: 'High Confidence Signal Detected',
    message: 'EUR/USD Head and Shoulders pattern with 87% confidence',
    timestamp: Date.now() - 300000, // 5 minutes ago
    read: false,
    priority: 'high',
    data: { symbol: 'EUR/USD', confidence: 87, pattern: 'Head and Shoulders' },
    actions: [
      { id: 'view', label: 'View Chart', type: 'primary', action: () => console.log('View chart') },
      { id: 'dismiss', label: 'Dismiss', type: 'secondary', action: () => console.log('Dismiss') }
    ]
  },
  {
    id: '2',
    type: 'alert',
    title: 'Price Alert Triggered',
    message: 'BTC/USD reached your target price of $68,000',
    timestamp: Date.now() - 900000, // 15 minutes ago
    read: false,
    priority: 'medium',
    data: { symbol: 'BTC/USD', price: 68000, type: 'target' },
    actions: [
      { id: 'trade', label: 'Open Trade', type: 'primary', action: () => console.log('Open trade') }
    ]
  },
  {
    id: '3',
    type: 'trade',
    title: 'Trade Executed Successfully',
    message: 'Long position opened on GBP/USD at 1.2634',
    timestamp: Date.now() - 1800000, // 30 minutes ago
    read: true,
    priority: 'medium',
    data: { symbol: 'GBP/USD', side: 'long', price: 1.2634 }
  },
  {
    id: '4',
    type: 'system',
    title: 'Platform Maintenance',
    message: 'Scheduled maintenance will occur tonight at 2:00 AM UTC',
    timestamp: Date.now() - 3600000, // 1 hour ago
    read: false,
    priority: 'low',
    data: { maintenanceTime: '2:00 AM UTC' }
  },
  {
    id: '5',
    type: 'security',
    title: 'New Login Detected',
    message: 'Login from Chrome on Windows in New York, US',
    timestamp: Date.now() - 7200000, // 2 hours ago
    read: true,
    priority: 'medium',
    data: { device: 'Chrome on Windows', location: 'New York, US' },
    actions: [
      { id: 'secure', label: 'Secure Account', type: 'danger', action: () => console.log('Secure account') }
    ]
  },
  {
    id: '6',
    type: 'market',
    title: 'Market News Alert',
    message: 'Federal Reserve announces interest rate decision',
    timestamp: Date.now() - 10800000, // 3 hours ago
    read: true,
    priority: 'high',
    data: { newsType: 'fed_decision' }
  }
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'signal' | 'alert' | 'trade' | 'system' | 'security' | 'market'>('all');
  const [isOpen, setIsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const resetToDefaultsRef = useRef<() => void>();

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ['signal', 'alert', 'trade', 'market'][Math.floor(Math.random() * 4)] as any,
          title: 'New Signal Detected',
          message: 'EUR/USD Triangle Breakout with 82% confidence',
          timestamp: Date.now(),
          read: false,
          priority: ['medium', 'high'][Math.floor(Math.random() * 2)] as any,
          data: { symbol: 'EUR/USD', confidence: 82 }
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 19)]); // Keep last 20
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = priority === 'critical' ? 'text-red-500' : 
                     priority === 'high' ? 'text-orange-400' :
                     priority === 'medium' ? 'text-yellow-400' : 'text-blue-400';

    switch (type) {
      case 'signal': return <TrendingUp className={`w-4 h-4 ${iconClass}`} />;
      case 'alert': return <Bell className={`w-4 h-4 ${iconClass}`} />;
      case 'trade': return <BarChart3 className={`w-4 h-4 ${iconClass}`} />;
      case 'system': return <Settings className={`w-4 h-4 ${iconClass}`} />;
      case 'security': return <Shield className={`w-4 h-4 ${iconClass}`} />;
      case 'market': return <Activity className={`w-4 h-4 ${iconClass}`} />;
      default: return <Info className={`w-4 h-4 ${iconClass}`} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500 bg-red-500/5';
      case 'high': return 'border-l-orange-400 bg-orange-400/5';
      case 'medium': return 'border-l-yellow-400 bg-yellow-400/5';
      case 'low': return 'border-l-blue-400 bg-blue-400/5';
      default: return 'border-l-gray-400 bg-gray-400/5';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const executeAction = (action: NotificationAction, notificationId: string) => {
    action.action();
    if (action.id === 'dismiss') {
      deleteNotification(notificationId);
    } else {
      markAsRead(notificationId);
    }
  };

  const getFilterCount = (filterType: string) => {
    if (filterType === 'all') return notifications.length;
    if (filterType === 'unread') return unreadCount;
    return notifications.filter(n => n.type === filterType).length;
  };

  const handleResetToDefaults = () => {
    if (resetToDefaultsRef.current) {
      resetToDefaultsRef.current();
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-8 w-8 p-0"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel rendered in portal for highest z-index */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-[99998]" 
                onClick={() => setIsOpen(false)}
              />
              {/* Notification Panel - Fixed z-index */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="fixed right-6 top-16 z-[100000] w-96 max-h-[600px] bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-2xl"
                onMouseLeave={() => setIsOpen(false)}
              >
                {/* Header */}
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
                    <div className="flex items-center space-x-2">
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={markAllAsRead}
                          className="text-xs h-6 px-2"
                        >
                          Mark all read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <Tabs value={filter} onValueChange={(value: any) => setFilter(value)}>
                    <TabsList className="grid w-full grid-cols-4 h-8">
                      <TabsTrigger value="all" className="text-xs">
                        All ({getFilterCount('all')})
                      </TabsTrigger>
                      <TabsTrigger value="unread" className="text-xs">
                        Unread ({getFilterCount('unread')})
                      </TabsTrigger>
                      <TabsTrigger value="signal" className="text-xs">
                        Signals ({getFilterCount('signal')})
                      </TabsTrigger>
                      <TabsTrigger value="alert" className="text-xs">
                        Alerts ({getFilterCount('alert')})
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Notifications List */}
                <ScrollArea className="h-96 overflow-y-auto">
                  <div className="p-2">
                    {filteredNotifications.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">No notifications</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredNotifications.map((notification, index) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`group relative p-3 rounded-lg border-l-4 transition-all duration-200 hover:bg-muted/30 cursor-pointer ${
                              getPriorityColor(notification.priority)
                            } ${!notification.read ? 'bg-muted/20' : 'bg-muted/10'}`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-0.5">
                                {getNotificationIcon(notification.type, notification.priority)}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="text-sm font-medium text-foreground mb-1">
                                      {notification.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    
                                    <div className="flex items-center space-x-2">
                                      <Badge variant="outline" className="text-xs h-4 px-1 capitalize">
                                        {notification.type}
                                      </Badge>
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs h-4 px-1 ${
                                          notification.priority === 'critical' ? 'text-red-500 border-red-500/30' :
                                          notification.priority === 'high' ? 'text-orange-400 border-orange-400/30' :
                                          notification.priority === 'medium' ? 'text-yellow-400 border-yellow-400/30' :
                                          'text-blue-400 border-blue-400/30'
                                        }`}
                                      >
                                        {notification.priority}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-1 ml-2">
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-primary rounded-full" />
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notification.id);
                                      }}
                                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {/* Action Buttons */}
                                {notification.actions && notification.actions.length > 0 && (
                                  <div className="flex space-x-2 mt-2">
                                    {notification.actions.map((action) => (
                                      <Button
                                        key={action.id}
                                        variant={action.type === 'primary' ? 'default' : 
                                                action.type === 'danger' ? 'destructive' : 'outline'}
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          executeAction(action, notification.id);
                                        }}
                                        className="h-6 text-xs px-2"
                                      >
                                        {action.label}
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-border/50">
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAll}
                        className="text-xs h-7"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Clear All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSettingsOpen(true)}
                        className="text-xs h-7"
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        Settings
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Notification Settings Drawer */}
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent side="right" className="max-w-md w-full flex flex-col p-0">
          <SheetHeader className="p-6 pb-0">
            <SheetTitle>Notification Settings</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 pt-4 pb-2">
            <NotificationSettings showActions={false} onClose={() => setSettingsOpen(false)} resetToDefaultsRef={fn => (resetToDefaultsRef.current = fn)} />
          </div>
          <div className="sticky bottom-0 left-0 w-full bg-card/95 border-t border-border/50 p-4 z-10 flex justify-between">
            <NotificationSettingsActions onClose={() => setSettingsOpen(false)} resetToDefaults={handleResetToDefaults} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}