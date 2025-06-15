"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  BookOpen,
  ExternalLink,
  Heart,
  MessageSquare,
  Share,
  Eye,
  EyeOff,
  Info,
  Star,
  BarChart3,
  Activity
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { generateChartData } from '@/lib/mock-data';
import { DetectedSignal, SIGNAL_PATTERNS } from '@/lib/signal-types';

interface EnhancedTradingChartProps {
  selectedSignal: string | null;
}

export function EnhancedTradingChart({ selectedSignal }: EnhancedTradingChartProps) {
  const [chartData, setChartData] = useState(generateChartData());
  const [isLoading, setIsLoading] = useState(false);
  const [showIndicators, setShowIndicators] = useState(true);
  const [showLevels, setShowLevels] = useState(true);
  const [selectedSignalData, setSelectedSignalData] = useState<DetectedSignal | null>(null);

  useEffect(() => {
    if (selectedSignal) {
      setIsLoading(true);
      // Simulate loading new chart data and signal details
      setTimeout(() => {
        setChartData(generateChartData());
        
        // Mock selected signal data - in real app this would come from API
        const mockSignalData: DetectedSignal = {
          id: selectedSignal,
          symbol: 'EUR/USD',
          market: 'forex',
          pattern: 'Head and Shoulders',
          direction: 'bullish',
          confidence: 87,
          entry: '1.0850',
          takeProfit: '1.0900',
          stopLoss: '1.0820',
          timeframe: '4H',
          timestamp: Date.now() - 3600000,
          patternId: 'head_shoulders',
          explanation: 'The Head and Shoulders pattern on EUR/USD 4H chart shows a strong reversal signal with clear left shoulder, head, and right shoulder formation. Volume confirmation at the neckline break supports the bullish outlook.',
          riskReward: 2.5,
          winRate: 78,
          indicators: [
            {
              name: 'RSI',
              value: 45.2,
              signal: 'neutral',
              description: 'RSI at 45.2 - Neutral territory with room for upward movement'
            },
            {
              name: 'MACD',
              value: 0.0012,
              signal: 'bullish',
              description: 'MACD above zero line indicating bullish momentum'
            },
            {
              name: 'Volume',
              value: 1.8,
              signal: 'bullish',
              description: 'Volume 80% above average confirming breakout'
            }
          ],
          keyLevels: [
            { price: 1.0850, type: 'entry', strength: 'strong' },
            { price: 1.0900, type: 'take_profit', strength: 'strong' },
            { price: 1.0820, type: 'stop_loss', strength: 'strong' }
          ],
          volume: 'high'
        };
        
        setSelectedSignalData(mockSignalData);
        setIsLoading(false);
      }, 1000);
    }
  }, [selectedSignal]);

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev];
        const lastPoint = newData[newData.length - 1];
        const newPoint = {
          ...lastPoint,
          time: lastPoint.time + 60000,
          price: lastPoint.price + (Math.random() - 0.5) * 2,
          volume: Math.random() * 1000000,
        };
        newData.push(newPoint);
        return newData.slice(-100); // Keep last 100 points
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!selectedSignal) {
    return (
      <Card className="h-full glassmorphism">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Select a Signal</h3>
              <p className="text-muted-foreground text-sm">
                Choose a signal from the feed to view detailed chart analysis and pattern breakdown
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pattern = selectedSignalData ? SIGNAL_PATTERNS[selectedSignalData.patternId] : null;

  return (
    <div className="h-full space-y-4">
      {/* Enhanced Chart Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {selectedSignalData?.symbol || 'EUR/USD'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {selectedSignalData?.pattern || 'Loading pattern...'}
            </p>
          </div>
          
          {selectedSignalData && (
            <>
              <Badge variant="outline" className={`${
                selectedSignalData.direction === 'bullish' ? 'text-green-400 border-green-400/30' :
                selectedSignalData.direction === 'bearish' ? 'text-red-400 border-red-400/30' :
                'text-blue-400 border-blue-400/30'
              }`}>
                {selectedSignalData.direction === 'bullish' ? <TrendingUp className="w-3 h-3 mr-1" /> : 
                 selectedSignalData.direction === 'bearish' ? <TrendingDown className="w-3 h-3 mr-1" /> : 
                 <Activity className="w-3 h-3 mr-1" />}
                {selectedSignalData.direction}
              </Badge>
              
              <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                {selectedSignalData.confidence}% Confidence
              </Badge>
              
              <Badge variant="outline" className="text-purple-400 border-purple-400/30">
                <Star className="w-3 h-3 mr-1" />
                {selectedSignalData.winRate}% Win Rate
              </Badge>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">Indicators</span>
            <Switch checked={showIndicators} onCheckedChange={setShowIndicators} />
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">Levels</span>
            <Switch checked={showLevels} onCheckedChange={setShowLevels} />
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add to Watchlist</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Share className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share Signal</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            TradingView
          </Button>
        </div>
      </motion.div>

      {/* Enhanced Chart Container */}
      <Card className="flex-1 glassmorphism">
        <CardContent className="p-6 h-full">
          <Tabs defaultValue="chart" className="h-full">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">Price Chart</TabsTrigger>
              <TabsTrigger value="analysis">Pattern Analysis</TabsTrigger>
              <TabsTrigger value="indicators">Indicators</TabsTrigger>
              <TabsTrigger value="education">Learn More</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart" className="h-[calc(100%-60px)]">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading chart analysis...</p>
                  </div>
                </div>
              ) : (
                <div className="h-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="time" 
                        tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                        stroke="#64748b"
                        fontSize={12}
                      />
                      <YAxis 
                        domain={['dataMin - 0.001', 'dataMax + 0.001']}
                        tickFormatter={(value) => value.toFixed(4)}
                        stroke="#64748b"
                        fontSize={12}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#priceGradient)"
                      />
                      
                      {/* Key Levels */}
                      {showLevels && selectedSignalData && (
                        <>
                          <ReferenceLine 
                            y={parseFloat(selectedSignalData.entry)} 
                            stroke="#10b981" 
                            strokeDasharray="5 5" 
                            label={{ value: "Entry", position: "topRight" }}
                          />
                          <ReferenceLine 
                            y={parseFloat(selectedSignalData.takeProfit)} 
                            stroke="#22c55e" 
                            strokeDasharray="5 5" 
                            label={{ value: "Take Profit", position: "topRight" }}
                          />
                          <ReferenceLine 
                            y={parseFloat(selectedSignalData.stopLoss)} 
                            stroke="#ef4444" 
                            strokeDasharray="5 5" 
                            label={{ value: "Stop Loss", position: "topRight" }}
                          />
                        </>
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                  
                  {/* Chart Overlay Info */}
                  {selectedSignalData && (
                    <div className="absolute top-4 left-4 space-y-2">
                      <div className="flex items-center space-x-4 text-sm bg-card/80 backdrop-blur-sm rounded p-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                          <span className="text-muted-foreground">Entry: {selectedSignalData.entry}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full" />
                          <span className="text-muted-foreground">TP: {selectedSignalData.takeProfit}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full" />
                          <span className="text-muted-foreground">SL: {selectedSignalData.stopLoss}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-muted/20 border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Signal Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedSignalData && (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Pattern:</span>
                          <p className="font-medium">{selectedSignalData.pattern}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Timeframe:</span>
                          <p className="font-medium">{selectedSignalData.timeframe}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Risk/Reward:</span>
                          <p className="font-medium text-green-400">1:{selectedSignalData.riskReward}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Volume:</span>
                          <p className="font-medium capitalize">{selectedSignalData.volume}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Win Rate:</span>
                          <p className="font-medium text-blue-400">{selectedSignalData.winRate}%</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Category:</span>
                          <p className="font-medium capitalize">{pattern?.category.replace('_', ' ')}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/20 border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pattern Strength</span>
                        <span className="text-green-400 font-medium">Strong</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Market Conditions</span>
                        <span className="text-yellow-400 font-medium">Favorable</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Volatility</span>
                        <span className="text-blue-400 font-medium">Moderate</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Confidence Level</span>
                        <span className="text-green-400 font-medium">
                          {selectedSignalData?.confidence}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-muted/20 border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">AI Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedSignalData?.explanation || 'Loading analysis...'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="indicators" className="space-y-4">
              {selectedSignalData?.indicators && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedSignalData.indicators.map((indicator, index) => (
                    <Card key={index} className="bg-muted/20 border-border/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center justify-between">
                          <span className="flex items-center">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            {indicator.name}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              indicator.signal === 'bullish' ? 'text-green-400 border-green-400/30' :
                              indicator.signal === 'bearish' ? 'text-red-400 border-red-400/30' :
                              'text-blue-400 border-blue-400/30'
                            }`}
                          >
                            {indicator.signal}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-foreground">
                            {typeof indicator.value === 'number' ? indicator.value.toFixed(4) : indicator.value}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {indicator.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="education" className="space-y-4">
              {pattern && (
                <>
                  <Card className="bg-muted/20 border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        {pattern.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {pattern.description}
                      </p>
                      
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold">Pattern Explanation:</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {pattern.explanation}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Category:</span>
                          <p className="font-medium capitalize">{pattern.category.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Historical Win Rate:</span>
                          <p className="font-medium text-green-400">{pattern.winRate}%</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Avg Risk/Reward:</span>
                          <p className="font-medium text-blue-400">1:{pattern.riskReward}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Difficulty:</span>
                          <p className="font-medium text-yellow-400">
                            {pattern.winRate > 75 ? 'Easy' : pattern.winRate > 65 ? 'Medium' : 'Hard'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Ask AI About This Pattern
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      More Educational Resources
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}