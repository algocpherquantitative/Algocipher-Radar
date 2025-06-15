"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Webhook, 
  Settings, 
  Plus,
  Trash2,
  Edit
} from 'lucide-react';

interface AlertRule {
  id: string;
  name: string;
  condition: string;
  channels: string[];
  enabled: boolean;
  triggered: number;
}

const MOCK_ALERTS: AlertRule[] = [
  {
    id: '1',
    name: 'High Confidence Signals',
    condition: 'Confidence > 85%',
    channels: ['email', 'telegram'],
    enabled: true,
    triggered: 12
  },
  {
    id: '2',
    name: 'EUR/USD Patterns',
    condition: 'Symbol = EUR/USD',
    channels: ['webhook'],
    enabled: true,
    triggered: 5
  },
  {
    id: '3',
    name: 'Crypto Breakouts',
    condition: 'Market = Crypto & Pattern = Breakout',
    channels: ['telegram'],
    enabled: false,
    triggered: 0
  }
];

export function AlertCenter() {
  const [alerts, setAlerts] = useState<AlertRule[]>(MOCK_ALERTS);
  const [newAlertName, setNewAlertName] = useState('');

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <div className="h-full space-y-4">
      <Tabs defaultValue="rules" className="h-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rules" className="h-[calc(100%-60px)]">
          <div className="space-y-4">
            {/* Add New Alert */}
            <Card className="bg-muted/20 border-border/50">
              <CardContent className="p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="New alert rule name..."
                    value={newAlertName}
                    onChange={(e) => setNewAlertName(e.target.value)}
                    className="flex-1 bg-muted/50 border-border/50"
                  />
                  <Button size="sm" className="shrink-0">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Alert Rules List */}
            <ScrollArea className="flex-1">
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-muted/20 border-border/50 hover:bg-muted/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-foreground mb-1">
                              {alert.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              {alert.condition}
                            </p>
                            <div className="flex items-center space-x-2">
                              {alert.channels.map(channel => (
                                <Badge key={channel} variant="outline" className="text-xs">
                                  {channel === 'email' && <Mail className="w-3 h-3 mr-1" />}
                                  {channel === 'telegram' && <MessageSquare className="w-3 h-3 mr-1" />}
                                  {channel === 'webhook' && <Webhook className="w-3 h-3 mr-1" />}
                                  {channel}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={alert.enabled}
                              onCheckedChange={() => toggleAlert(alert.id)}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            Triggered {alert.triggered} times
                          </div>
                          
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteAlert(alert.id)}
                            >
                              <Trash2 className="w-3 h-3 text-red-400" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="h-[calc(100%-60px)]">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {/* Email Settings */}
              <Card className="bg-muted/20 border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Enable email alerts</span>
                    <Switch defaultChecked />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email Address</label>
                    <Input 
                      type="email" 
                      placeholder="your@email.com"
                      className="mt-1 bg-muted/50 border-border/50"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Telegram Settings */}
              <Card className="bg-muted/20 border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Telegram Bot
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Enable Telegram alerts</span>
                    <Switch defaultChecked />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Bot Token</label>
                    <Input 
                      type="password" 
                      placeholder="Enter bot token..."
                      className="mt-1 bg-muted/50 border-border/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Chat ID</label>
                    <Input 
                      placeholder="Enter chat ID..."
                      className="mt-1 bg-muted/50 border-border/50"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    Test Connection
                  </Button>
                </CardContent>
              </Card>

              {/* Webhook Settings */}
              <Card className="bg-muted/20 border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Webhook className="w-4 h-4 mr-2" />
                    Webhook Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Enable webhook alerts</span>
                    <Switch />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Webhook URL</label>
                    <Input 
                      placeholder="https://your-webhook-url.com"
                      className="mt-1 bg-muted/50 border-border/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Secret Key (Optional)</label>
                    <Input 
                      type="password"
                      placeholder="Enter secret key..."
                      className="mt-1 bg-muted/50 border-border/50"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}