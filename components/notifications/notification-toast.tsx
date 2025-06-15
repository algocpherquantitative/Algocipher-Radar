"use client";

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, TrendingUp, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NotificationToastProps {
  id: string;
  type: 'signal' | 'alert' | 'system' | 'trade' | 'security' | 'market';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  duration?: number;
  onClose: () => void;
  onAction?: () => void;
  actionLabel?: string;
}

export function NotificationToast({
  id,
  type,
  title,
  message,
  priority,
  duration = 5000,
  onClose,
  onAction,
  actionLabel
}: NotificationToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'signal': return <TrendingUp className="w-5 h-5" />;
      case 'alert': return <Bell className="w-5 h-5" />;
      case 'system': return <Info className="w-5 h-5" />;
      case 'trade': return <CheckCircle className="w-5 h-5" />;
      case 'security': return <AlertTriangle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-500/10 text-red-400';
      case 'high': return 'border-orange-400 bg-orange-400/10 text-orange-400';
      case 'medium': return 'border-yellow-400 bg-yellow-400/10 text-yellow-400';
      case 'low': return 'border-blue-400 bg-blue-400/10 text-blue-400';
      default: return 'border-gray-400 bg-gray-400/10 text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative w-80 p-4 rounded-lg border-l-4 bg-card/95 backdrop-blur-sm border border-border/50 shadow-lg ${getColors()}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground mb-1">
                {title}
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                {message}
              </p>
              
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs h-4 px-1 capitalize">
                  {type}
                </Badge>
                <Badge variant="outline" className={`text-xs h-4 px-1 ${getColors()}`}>
                  {priority}
                </Badge>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {onAction && actionLabel && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onAction}
                className="h-6 text-xs px-2"
              >
                {actionLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Progress bar for auto-dismiss */}
      {duration > 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          className={`absolute bottom-0 left-0 h-1 ${getColors().split(' ')[0]} rounded-bl-lg`}
        />
      )}
    </motion.div>
  );
}