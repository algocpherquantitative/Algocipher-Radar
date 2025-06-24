"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  TrendingUp, 
  Target, 
  Shield, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';

interface TradingPreferencesProps {
  user: any;
}

export function TradingPreferences({ user }: TradingPreferencesProps) {
  const [riskSettings, setRiskSettings] = useState({
    riskTolerance: user.riskTolerance || 'moderate',
    maxRiskPerTrade: user.maxRiskPerTrade || 2,
    maxDailyRisk: user.maxDailyRisk || 5,
    stopLossRequired: user.stopLossRequired || true,
    takeProfitRequired: user.takeProfitRequired || true
  });

  const [signalFilters, setSignalFilters] = useState({
    minConfidence: user.minConfidence || 70,
    preferredMarkets: user.preferredMarkets || ['forex', 'crypto'],
    preferredTimeframes: user.preferredTimeframes || ['1H', '4H', '1D'],
    patternTypes: user.patternTypes || ['price_action', 'candlestick', 'chart_pattern'],
    excludeNews: user.excludeNews || false,
    onlyHighVolume: user.onlyHighVolume || false
  });

  const [tradingStyle, setTradingStyle] = useState({
    style: user.tradingStyle || 'swing',
    sessionTimes: user.sessionTimes || ['london', 'new_york'],
    autoTrading: user.autoTrading || false,
    paperTrading: user.paperTrading || true,
    journalRequired: user.journalRequired || false
  });

  const [alertSettings, setAlertSettings] = useState({
    priceAlerts: user.priceAlerts || true,
    volumeAlerts: user.volumeAlerts || false,
    newsAlerts: user.newsAlerts || true,
    technicalAlerts: user.technicalAlerts || true,
    alertFrequency: user.alertFrequency || 'immediate'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const savePreferences = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedUser = {
        ...user,
        ...riskSettings,
        ...signalFilters,
        ...tradingStyle,
        ...alertSettings
      };
      
      localStorage.setItem('user-data', JSON.stringify(updatedUser));
      setMessage({ type: 'success', text: 'Trading preferences updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update preferences.' });
    } finally {
      setIsLoading(false);
    }
  };

  const markets = [
    { id: 'forex', label: 'Forex', icon: '💱' },
    { id: 'crypto', label: 'Cryptocurrency', icon: '₿' },
    { id: 'stocks', label: 'Stocks', icon: '📈' },
    { id: 'indices', label: 'Indices', icon: '📊' },
    { id: 'commodities', label: 'Commodities', icon: '🥇' }
  ];

  const timeframes = [
    { id: '5M', label: '5 Minutes' },
    { id: '15M', label: '15 Minutes' },
    { id: '1H', label: '1 Hour' },
    { id: '4H', label: '4 Hours' },
    { id: '1D', label: '1 Day' },
    { id: '1W', label: '1 Week' }
  ];

  const patternCategories = [
    { id: 'price_action', label: 'Price Action', description: 'Support, resistance, breakouts' },
    { id: 'candlestick', label: 'Candlestick Patterns', description: 'Doji, hammer, engulfing' },
    { id: 'chart_pattern', label: 'Chart Patterns', description: 'Head & shoulders, triangles' },
    { id: 'indicator', label: 'Indicator Signals', description: 'RSI, MACD, moving averages' },
    { id: 'support_resistance', label: 'Support/Resistance', description: 'Fibonacci, pivot points' }
  ];

  const tradingSessions = [
    { id: 'sydney', label: 'Sydney', time: '22:00 - 07:00 UTC' },
    { id: 'tokyo', label: 'Tokyo', time: '00:00 - 09:00 UTC' },
    { id: 'london', label: 'London', time: '08:00 - 17:00 UTC' },
    { id: 'new_york', label: 'New York', time: '13:00 - 22:00 UTC' }
  ];

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

      {/* Risk Management */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Risk Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Risk Tolerance</Label>
            <Select 
              value={riskSettings.riskTolerance} 
              onValueChange={(value) => setRiskSettings(prev => ({ ...prev, riskTolerance: value }))}
            >
              <SelectTrigger className="bg-muted/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Conservative - Lower risk, steady returns</SelectItem>
                <SelectItem value="moderate">Moderate - Balanced risk/reward</SelectItem>
                <SelectItem value="aggressive">Aggressive - Higher risk, higher potential returns</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Max Risk Per Trade: {riskSettings.maxRiskPerTrade}%</Label>
              <Slider
                value={[riskSettings.maxRiskPerTrade]}
                onValueChange={(value) => setRiskSettings(prev => ({ ...prev, maxRiskPerTrade: value[0] }))}
                max={10}
                min={0.5}
                step={0.5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Maximum percentage of account to risk on a single trade
              </p>
            </div>

            <div className="space-y-3">
              <Label>Max Daily Risk: {riskSettings.maxDailyRisk}%</Label>
              <Slider
                value={[riskSettings.maxDailyRisk]}
                onValueChange={(value) => setRiskSettings(prev => ({ ...prev, maxDailyRisk: value[0] }))}
                max={20}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Maximum percentage of account to risk in a single day
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Require Stop Loss</Label>
                <p className="text-sm text-muted-foreground">
                  Only show signals that include stop loss levels
                </p>
              </div>
              <Switch
                checked={riskSettings.stopLossRequired}
                onCheckedChange={(checked) => setRiskSettings(prev => ({ ...prev, stopLossRequired: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Require Take Profit</Label>
                <p className="text-sm text-muted-foreground">
                  Only show signals that include take profit levels
                </p>
              </div>
              <Switch
                checked={riskSettings.takeProfitRequired}
                onCheckedChange={(checked) => setRiskSettings(prev => ({ ...prev, takeProfitRequired: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Signal Filters */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Signal Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Minimum Confidence: {signalFilters.minConfidence}%</Label>
            <Slider
              value={[signalFilters.minConfidence]}
              onValueChange={(value) => setSignalFilters(prev => ({ ...prev, minConfidence: value[0] }))}
              max={95}
              min={50}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Only show signals with confidence above this threshold
            </p>
          </div>

          <div className="space-y-3">
            <Label>Preferred Markets</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {markets.map((market) => (
                <div key={market.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={market.id}
                    checked={signalFilters.preferredMarkets.includes(market.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSignalFilters(prev => ({
                          ...prev,
                          preferredMarkets: [...prev.preferredMarkets, market.id]
                        }));
                      } else {
                        setSignalFilters(prev => ({
                          ...prev,
                          preferredMarkets: prev.preferredMarkets.filter((m: string) => m !== market.id)
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={market.id} className="text-sm">
                    {market.icon} {market.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Preferred Timeframes</Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {timeframes.map((timeframe) => (
                <div key={timeframe.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={timeframe.id}
                    checked={signalFilters.preferredTimeframes.includes(timeframe.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSignalFilters(prev => ({
                          ...prev,
                          preferredTimeframes: [...prev.preferredTimeframes, timeframe.id]
                        }));
                      } else {
                        setSignalFilters(prev => ({
                          ...prev,
                          preferredTimeframes: prev.preferredTimeframes.filter((t: string) => t !== timeframe.id)
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={timeframe.id} className="text-sm">
                    {timeframe.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Pattern Types</Label>
            <div className="space-y-3">
              {patternCategories.map((category) => (
                <div key={category.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={signalFilters.patternTypes.includes(category.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSignalFilters(prev => ({
                          ...prev,
                          patternTypes: [...prev.patternTypes, category.id]
                        }));
                      } else {
                        setSignalFilters(prev => ({
                          ...prev,
                          patternTypes: prev.patternTypes.filter((p: string) => p !== category.id)
                        }));
                      }
                    }}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <Label htmlFor={category.id} className="text-sm font-medium">
                      {category.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Exclude News Events</Label>
                <p className="text-sm text-muted-foreground">
                  Filter out signals during major news events
                </p>
              </div>
              <Switch
                checked={signalFilters.excludeNews}
                onCheckedChange={(checked) => setSignalFilters(prev => ({ ...prev, excludeNews: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>High Volume Only</Label>
                <p className="text-sm text-muted-foreground">
                  Only show signals with above-average volume
                </p>
              </div>
              <Switch
                checked={signalFilters.onlyHighVolume}
                onCheckedChange={(checked) => setSignalFilters(prev => ({ ...prev, onlyHighVolume: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Style */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Trading Style</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Trading Style</Label>
            <Select 
              value={tradingStyle.style} 
              onValueChange={(value) => setTradingStyle(prev => ({ ...prev, style: value }))}
            >
              <SelectTrigger className="bg-muted/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scalping">Scalping - Very short-term (minutes)</SelectItem>
                <SelectItem value="day">Day Trading - Intraday positions</SelectItem>
                <SelectItem value="swing">Swing Trading - Multi-day positions</SelectItem>
                <SelectItem value="position">Position Trading - Long-term positions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Preferred Trading Sessions</Label>
            <div className="space-y-3">
              {tradingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={session.id}
                      checked={tradingStyle.sessionTimes.includes(session.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setTradingStyle(prev => ({
                            ...prev,
                            sessionTimes: [...prev.sessionTimes, session.id]
                          }));
                        } else {
                          setTradingStyle(prev => ({
                            ...prev,
                            sessionTimes: prev.sessionTimes.filter((s: string) => s !== session.id)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={session.id} className="text-sm font-medium">
                      {session.label}
                    </Label>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {session.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Paper Trading Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Practice with virtual money before live trading
                </p>
              </div>
              <Switch
                checked={tradingStyle.paperTrading}
                onCheckedChange={(checked) => setTradingStyle(prev => ({ ...prev, paperTrading: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto Trading (Coming Soon)</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically execute signals based on your preferences
                </p>
              </div>
              <Switch
                checked={tradingStyle.autoTrading}
                onCheckedChange={(checked) => setTradingStyle(prev => ({ ...prev, autoTrading: checked }))}
                disabled
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Require Journal Entry</Label>
                <p className="text-sm text-muted-foreground">
                  Force journal entry for each trade taken
                </p>
              </div>
              <Switch
                checked={tradingStyle.journalRequired}
                onCheckedChange={(checked) => setTradingStyle(prev => ({ ...prev, journalRequired: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={savePreferences} disabled={isLoading} size="lg">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Saving Preferences...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Save Trading Preferences</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}