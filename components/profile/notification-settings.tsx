"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Webhook,
  CheckCircle,
  AlertCircle,
  Volume2,
  VolumeX,
  Clock
} from 'lucide-react';

interface NotificationSettingsProps {
  user: any;
}

export function NotificationSettings({ user }: NotificationSettingsProps) {
  const [emailSettings, setEmailSettings] = useState({
    signalAlerts: user.emailSignalAlerts || true,
    tradingUpdates: user.emailTradingUpdates || true,
    marketNews: user.emailMarketNews || false,
    accountSecurity: user.emailAccountSecurity || true,
    weeklyReports: user.emailWeeklyReports || true,
    productUpdates: user.emailProductUpdates || false
  });

  const [pushSettings, setPushSettings] = useState({
    enabled: user.pushNotifications || false,
    highConfidenceSignals: user.pushHighConfidence || true,
    priceAlerts: user.pushPriceAlerts || true,
    tradingReminders: user.pushTradingReminders || false
  });

  const [telegramSettings, setTelegramSettings] = useState({
    enabled: user.telegramEnabled || false,
    botToken: user.telegramBotToken || '',
    chatId: user.telegramChatId || '',
    signalTypes: user.telegramSignalTypes || ['high-confidence']
  });

  const [webhookSettings, setWebhookSettings] = useState({
    enabled: user.webhookEnabled || false,
    url: user.webhookUrl || '',
    secret: user.webhookSecret || '',
    events: user.webhookEvents || ['signal-detected']
  });

  const [quietHours, setQuietHours] = useState({
    enabled: user.quietHoursEnabled || false,
    startTime: user.quietHoursStart || '22:00',
    endTime: user.quietHoursEnd || '08:00',
    timezone: user.timezone || 'UTC'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleEmailSettingChange = (setting: string, value: boolean) => {
    setEmailSettings(prev => ({ ...prev, [setting]: value }));
    saveSettings();
  };

  const handlePushSettingChange = (setting: string, value: boolean) => {
    setPushSettings(prev => ({ ...prev, [setting]: value }));
    saveSettings();
  };

  const saveSettings = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessage({ type: 'success', text: 'Notification settings updated!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings.' });
    }
  };

  const testTelegramConnection = async () => {
    if (!telegramSettings.botToken || !telegramSettings.chatId) {
      setMessage({ type: 'error', text: 'Please enter both bot token and chat ID.' });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage({ type: 'success', text: 'Telegram connection test successful!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to connect to Telegram. Please check your settings.' });
    } finally {
      setIsLoading(false);
    }
  };

  const testWebhook = async () => {
    if (!webhookSettings.url) {
      setMessage({ type: 'error', text: 'Please enter a webhook URL.' });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage({ type: 'success', text: 'Webhook test successful!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Webhook test failed. Please check your URL.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert className={message.type === 'success' ? 'border-green-500/50 bg-green-500/10' : ''} variant={message.type === 'error' ? 'destructive' : 'default'}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription className={message.type === 'success' ? 'text-green-700 dark:text-green-400' : ''}>
              {message.text}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Email Notifications */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Email Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Signal Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when new high-confidence signals are detected
                </p>
              </div>
              <Switch
                checked={emailSettings.signalAlerts}
                onCheckedChange={(checked) => handleEmailSettingChange('signalAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Trading Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Updates on your trading performance and portfolio
                </p>
              </div>
              <Switch
                checked={emailSettings.tradingUpdates}
                onCheckedChange={(checked) => handleEmailSettingChange('tradingUpdates', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Market News</Label>
                <p className="text-sm text-muted-foreground">
                  Important market news and analysis
                </p>
              </div>
              <Switch
                checked={emailSettings.marketNews}
                onCheckedChange={(checked) => handleEmailSettingChange('marketNews', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Account Security</Label>
                <p className="text-sm text-muted-foreground">
                  Login alerts and security notifications
                </p>
              </div>
              <Switch
                checked={emailSettings.accountSecurity}
                onCheckedChange={(checked) => handleEmailSettingChange('accountSecurity', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Weekly summary of your trading activity
                </p>
              </div>
              <Switch
                checked={emailSettings.weeklyReports}
                onCheckedChange={(checked) => handleEmailSettingChange('weeklyReports', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Product Updates</Label>
                <p className="text-sm text-muted-foreground">
                  New features and platform improvements
                </p>
              </div>
              <Switch
                checked={emailSettings.productUpdates}
                onCheckedChange={(checked) => handleEmailSettingChange('productUpdates', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Push Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive browser notifications for important events
              </p>
            </div>
            <Switch
              checked={pushSettings.enabled}
              onCheckedChange={(checked) => handlePushSettingChange('enabled', checked)}
            />
          </div>

          {pushSettings.enabled && (
            <div className="space-y-4 pl-4 border-l-2 border-border/50">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>High Confidence Signals</Label>
                  <p className="text-sm text-muted-foreground">
                    Signals with 80%+ confidence
                  </p>
                </div>
                <Switch
                  checked={pushSettings.highConfidenceSignals}
                  onCheckedChange={(checked) => handlePushSettingChange('highConfidenceSignals', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Price Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    When watchlist items hit target prices
                  </p>
                </div>
                <Switch
                  checked={pushSettings.priceAlerts}
                  onCheckedChange={(checked) => handlePushSettingChange('priceAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Trading Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Reminders to check your positions
                  </p>
                </div>
                <Switch
                  checked={pushSettings.tradingReminders}
                  onCheckedChange={(checked) => handlePushSettingChange('tradingReminders', checked)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Telegram Integration */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Telegram Integration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable Telegram Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive signals directly in Telegram
              </p>
            </div>
            <Switch
              checked={telegramSettings.enabled}
              onCheckedChange={(checked) => setTelegramSettings(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          {telegramSettings.enabled && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="botToken">Bot Token</Label>
                <Input
                  id="botToken"
                  type="password"
                  value={telegramSettings.botToken}
                  onChange={(e) => setTelegramSettings(prev => ({ ...prev, botToken: e.target.value }))}
                  placeholder="Enter your Telegram bot token"
                  className="bg-muted/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chatId">Chat ID</Label>
                <Input
                  id="chatId"
                  value={telegramSettings.chatId}
                  onChange={(e) => setTelegramSettings(prev => ({ ...prev, chatId: e.target.value }))}
                  placeholder="Enter your chat ID"
                  className="bg-muted/50 border-border/50"
                />
              </div>

              <Button onClick={testTelegramConnection} disabled={isLoading} variant="outline">
                {isLoading ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Webhook Integration */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Webhook className="w-5 h-5" />
            <span>Webhook Integration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable Webhooks</Label>
              <p className="text-sm text-muted-foreground">
                Send signals to your custom endpoint
              </p>
            </div>
            <Switch
              checked={webhookSettings.enabled}
              onCheckedChange={(checked) => setWebhookSettings(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          {webhookSettings.enabled && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  type="url"
                  value={webhookSettings.url}
                  onChange={(e) => setWebhookSettings(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://your-webhook-url.com/signals"
                  className="bg-muted/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookSecret">Secret Key (Optional)</Label>
                <Input
                  id="webhookSecret"
                  type="password"
                  value={webhookSettings.secret}
                  onChange={(e) => setWebhookSettings(prev => ({ ...prev, secret: e.target.value }))}
                  placeholder="Enter secret for webhook verification"
                  className="bg-muted/50 border-border/50"
                />
              </div>

              <Button onClick={testWebhook} disabled={isLoading} variant="outline">
                {isLoading ? 'Testing...' : 'Test Webhook'}
              </Button>
            </div>
          )}
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
                Pause notifications during specified hours
              </p>
            </div>
            <Switch
              checked={quietHours.enabled}
              onCheckedChange={(checked) => setQuietHours(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          {quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={quietHours.startTime}
                  onChange={(e) => setQuietHours(prev => ({ ...prev, startTime: e.target.value }))}
                  className="bg-muted/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={quietHours.endTime}
                  onChange={(e) => setQuietHours(prev => ({ ...prev, endTime: e.target.value }))}
                  className="bg-muted/50 border-border/50"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}