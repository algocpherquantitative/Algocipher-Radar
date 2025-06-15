"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  BookOpen,
  ExternalLink,
  Heart,
  MessageSquare,
  Share
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { generateChartData } from '@/lib/mock-data';

interface TradingChartProps {
  selectedSignal: string | null;
}

export function TradingChart({ selectedSignal }: TradingChartProps) {
  const [chartData, setChartData] = useState(generateChartData());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedSignal) {
      setIsLoading(true);
      // Simulate loading new chart data
      setTimeout(() => {
        setChartData(generateChartData());
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
    }, 2000);

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
                Choose a signal from the feed to view detailed chart analysis
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full space-y-4">
      {/* Chart Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">EUR/USD</h2>
            <p className="text-sm text-muted-foreground">Head and Shoulders Pattern</p>
          </div>
          <Badge variant="outline" className="text-green-400 border-green-400/30">
            <TrendingUp className="w-3 h-3 mr-1" />
            Bullish
          </Badge>
          <Badge variant="outline" className="text-blue-400 border-blue-400/30">
            87% Confidence
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
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
            Open in TradingView
          </Button>
        </div>
      </motion.div>

      {/* Chart Container */}
      <Card className="flex-1 glassmorphism">
        <CardContent className="p-6 h-full">
          <Tabs defaultValue="chart" className="h-full">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">Price Chart</TabsTrigger>
              <TabsTrigger value="analysis">Pattern Analysis</TabsTrigger>
              <TabsTrigger value="education">Learn More</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart" className="h-[calc(100%-60px)]">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading chart data...</p>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
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
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#3b82f6' }}
                      />
                      <ReferenceLine y={1.0850} stroke="#10b981" strokeDasharray="5 5" label="Entry" />
                      <ReferenceLine y={1.0900} stroke="#22c55e" strokeDasharray="5 5" label="Take Profit" />
                      <ReferenceLine y={1.0820} stroke="#ef4444" strokeDasharray="5 5" label="Stop Loss" />
                    </LineChart>
                  </ResponsiveContainer>
                  
                  {/* Chart Overlay Info */}
                  <div className="absolute top-6 left-6 space-y-2">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-muted-foreground">Entry: 1.0850</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full" />
                        <span className="text-muted-foreground">TP: 1.0900</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <span className="text-muted-foreground">SL: 1.0820</span>
                      </div>
                    </div>
                  </div>
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
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Pattern:</span>
                        <p className="font-medium">Head and Shoulders</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Timeframe:</span>
                        <p className="font-medium">4H</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Risk/Reward:</span>
                        <p className="font-medium text-green-400">1:2.5</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Volume:</span>
                        <p className="font-medium">High</p>
                      </div>
                    </div>
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
                    The Head and Shoulders pattern on EUR/USD 4H chart shows a strong reversal signal with clear left shoulder, 
                    head, and right shoulder formation. Volume confirmation at the neckline break supports the bullish outlook. 
                    The 87% confidence score reflects strong technical alignment with RSI showing bullish divergence and MACD 
                    crossing above the signal line.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="education" className="space-y-4">
              <Card className="bg-muted/20 border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Head and Shoulders Pattern
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    The Head and Shoulders pattern is one of the most reliable reversal patterns in technical analysis.
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Key Characteristics:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Three peaks with the middle peak (head) being the highest</li>
                      <li>• Two shoulders of approximately equal height</li>
                      <li>• A neckline connecting the two troughs</li>
                      <li>• Volume typically decreases during pattern formation</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Trading Rules:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Enter on neckline break with volume confirmation</li>
                      <li>• Set stop loss above the right shoulder</li>
                      <li>• Target equals neckline to head distance</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask AI
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  More Resources
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}