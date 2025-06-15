"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Mail, 
  MessageSquare,
  Settings,
  Clock,
  Filter
} from 'lucide-react';

interface NotificationSettingsProps {
  onClose?: () => void;
}

export function NotificationSettings({ onClose }: NotificationSettingsProps) {
  const [settings, setSettings] = useState({
    // General Settings
    enabled: true,
    sound: true,
    vibration: true,
    volume: 50,
    
    // Notification Types
    signals: true,
    alerts: true,
    trades: true,
    system: false,
    security: true,
    market: true,
    
    // Priority Filters
    critical: true,
    high: true,
    medium: true,
    low: false,
    
    // Delivery Methods
    browser: true,
    email: true,
    telegram: false,
    webhook: false,
    
    // Timing
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00',
    
    // Advanced
    groupSimilar: true,
    maxPerHour: 10,
    autoMarkRead: false
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setSettings({
      enabled: true,
      sound: true,
      vibration: true,
      volume: 50,
      signals: true,
      alerts: true,
      trades: true,
      system: false,
      security: true,
      market: true,
      critical: true,
      high: true,
      medium: true,
      low: false,
      browser: true,
      email: true,
      telegram: false,
      webhook: false,
      quietHours: false,
      quietStart: '22:00',
      quietEnd: '08:00',
      groupSimilar: true,
      maxPerHour: 10,
      autoMarkRead: false
    });
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>General Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Master switch for all notifications
              </p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => updateSetting('enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Sound Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Play sound when notifications arrive
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {settings.sound ? (
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              )}
              <Switch
                checked={settings.sound}
                onCheckedChange={(checked) => updateSetting('sound', checked)}
                disabled={!settings.enabled}
              />
            </div>
          </div>

          {settings.sound && (
            <div className="space-y-3">
              <Label>Volume: {settings.volume}%</Label>
              <Slider
                value={[settings.volume]}
                onValueChange={(value) => updateSetting('volume', value[0])}
                max={100}
                min={0}
                step={10}
                className="w-full"
                disabled={!settings.enabled}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Vibration (Mobile)</Label>
              <p className="text-sm text-muted-foreground">
                Vibrate device for important notifications
              </p>
            </div>
            <Switch
              checked={settings.vibration}
              onCheckedChange={(checked) => updateSetting('vibration', checked)}
              disabled={!settings.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Notification Types</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'signals', label: 'Trading Signals', description: 'AI-detected pattern alerts' },
            { key: 'alerts', label: 'Price Alerts', description: 'Custom price and volume alerts' },
            { key: 'trades', label: 'Trade Updates', description: 'Order executions and position changes' },
            { key: 'market', label: 'Market News', description: 'Important market events and news' },
            { key: 'security', label: 'Security Alerts', description: 'Login attempts and security events' },
            { key: 'system', label: 'System Updates', description: 'Platform maintenance and updates' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>{item.label}</Label>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Switch
                checked={settings[item.key as keyof typeof settings] as boolean}
                onCheckedChange={(checked) => updateSetting(item.key, checked)}
                disabled={!settings.enabled}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Priority Levels */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Priority Levels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'critical', label: 'Critical', color: 'text-red-400 border-red-400/30', description: 'Urgent alerts requiring immediate attention' },
            { key: 'high', label: 'High', color: 'text-orange-400 border-orange-400/30', description: 'Important notifications' },
            { key: 'medium', label: 'Medium', color: 'text-yellow-400 border-yellow-400/30', description: 'Standard notifications' },
            { key: 'low', label: 'Low', color: 'text-blue-400 border-blue-400/30', description: 'Informational updates' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className={`${item.color} text-xs`}>
                  {item.label}
                </Badge>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <Switch
                checked={settings[item.key as keyof typeof settings] as boolean}
                onCheckedChange={(checked) => updateSetting(item.key, checked)}
                disabled={!settings.enabled}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Delivery Methods */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Delivery Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'browser', label: 'Browser Notifications', icon: Bell, description: 'Show notifications in browser' },
            { key: 'email', label: 'Email Notifications', icon: Mail, description: 'Send notifications to email' },
            { key: 'telegram', label: 'Telegram Bot', icon: MessageSquare, description: 'Send via Telegram bot' },
            { key: 'webhook', label: 'Webhook Integration', icon: Settings, description: 'Send to custom webhook URL' }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <Label>{item.label}</Label>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <Switch
                  checked={settings[item.key as keyof typeof settings] as boolean}
                  onCheckedChange={(checked) => updateSetting(item.key, checked)}
                  disabled={!settings.enabled}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Quiet Hours</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable Quiet Hours</Label>
              <p className="text-sm text-muted-foreground">
                Pause non-critical notifications during specified hours
              </p>
            </div>
            <Switch
              checked={settings.quietHours}
              onCheckedChange={(checked) => updateSetting('quietHours', checked)}
              disabled={!settings.enabled}
            />
          </div>

          {settings.quietHours && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Select 
                  value={settings.quietStart} 
                  onValueChange={(value) => updateSetting('quietStart', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <SelectItem key={hour} value={`${hour}:00`}>
                          {hour}:00
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>End Time</Label>
                <Select 
                  value={settings.quietEnd} 
                  onValueChange={(value) => updateSetting('quietEnd', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <SelectItem key={hour} value={`${hour}:00`}>
                          {hour}:00
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Group Similar Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Combine similar notifications to reduce clutter
              </p>
            </div>
            <Switch
              checked={settings.groupSimilar}
              onCheckedChange={(checked) => updateSetting('groupSimilar', checked)}
              disabled={!settings.enabled}
            />
          </div>

          <div className="space-y-3">
            <Label>Max Notifications Per Hour: {settings.maxPerHour}</Label>
            <Slider
              value={[settings.maxPerHour]}
              onValueChange={(value) => updateSetting('maxPerHour', value[0])}
              max={50}
              min={1}
              step={1}
              className="w-full"
              disabled={!settings.enabled}
            />
            <p className="text-sm text-muted-foreground">
              Limit the number of notifications to prevent spam
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Auto-mark as Read</Label>
              <p className="text-sm text-muted-foreground">
                Automatically mark notifications as read after viewing
              </p>
            </div>
            <Switch
              checked={settings.autoMarkRead}
              onCheckedChange={(checked) => updateSetting('autoMarkRead', checked)}
              disabled={!settings.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
        <div className="space-x-2">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}