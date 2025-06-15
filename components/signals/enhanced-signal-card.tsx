"use client";

import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TrendingUp, TrendingDown, Target, Clock, Activity, Triangle, Zap, BarChart3, Info, Star, Volume2, Hash, RefreshCw, Mountain, Flag, Cross, ArrowUp, Hammer, Candy as Candle, Map as Gap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';
import { DetectedSignal } from '@/lib/signal-types';

interface EnhancedSignalCardProps {
  signal: DetectedSignal;
  onClick: () => void;
}

const PATTERN_ICONS: Record<string, React.ReactNode> = {
  // Price Action
  'Resistance Breakout': <TrendingUp className="w-3 h-3" />,
  'Support Bounce': <ArrowUp className="w-3 h-3" />,
  'Fair Value Gap Fill': <Gap className="w-3 h-3" />,
  
  // Candlestick Patterns
  'Bullish Engulfing': <Candle className="w-3 h-3" />,
  'Bearish Engulfing': <Candle className="w-3 h-3" />,
  'Hammer': <Hammer className="w-3 h-3" />,
  'Shooting Star': <Star className="w-3 h-3" />,
  
  // Chart Patterns
  'Head and Shoulders': <Activity className="w-3 h-3" />,
  'Double Top': <Mountain className="w-3 h-3" />,
  'Ascending Triangle': <Triangle className="w-3 h-3" />,
  'Bull Flag': <Flag className="w-3 h-3" />,
  
  // Indicator Signals
  'RSI Oversold Bounce': <TrendingUp className="w-3 h-3" />,
  'MACD Bullish Cross': <Activity className="w-3 h-3" />,
  'Golden Cross': <Cross className="w-3 h-3" />,
  'VWAP Reclaim': <BarChart3 className="w-3 h-3" />,
  
  // Support/Resistance
  'Fibonacci 61.8% Bounce': <Target className="w-3 h-3" />,
  'Break and Retest': <RefreshCw className="w-3 h-3" />,
  'Psychological Level': <Hash className="w-3 h-3" />,
  
  // Default
  'default': <Activity className="w-3 h-3" />
};

export function EnhancedSignalCard({ signal, onClick }: EnhancedSignalCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: signal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400 bg-green-500/10 border-green-500/30';
    if (confidence >= 65) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-red-400 bg-red-500/10 border-red-500/30';
  };

  const getDirectionColor = (direction: string) => {
    if (direction === 'bullish') return 'text-green-400 border-green-400/30';
    if (direction === 'bearish') return 'text-red-400 border-red-400/30';
    return 'text-blue-400 border-blue-400/30';
  };

  const getVolumeColor = (volume: string) => {
    if (volume === 'high') return 'text-green-400';
    if (volume === 'medium') return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskRewardColor = (rr: number) => {
    if (rr >= 2.5) return 'text-green-400';
    if (rr >= 2.0) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      whileHover={{ scale: isDragging ? 1 : 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`signal-card ${signal.direction} ${isDragging ? 'opacity-50' : ''} cursor-pointer`}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-1.5">
          <div className={`signal-indicator ${signal.direction}`} />
          <div>
            <h4 className="text-sm font-semibold text-foreground">{signal.symbol}</h4>
            <p className="text-micro text-muted-foreground">{signal.market}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge 
                  variant="outline" 
                  className={`text-micro h-4 px-1 ${getConfidenceColor(signal.confidence)}`}
                >
                  {signal.confidence}%
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <p>Confidence: {signal.confidence}%</p>
                  <p>Historical Win Rate: {signal.winRate}%</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className={`text-micro h-4 px-1 ${getRiskRewardColor(signal.riskReward)}`}>
                  1:{signal.riskReward.toFixed(1)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Risk:Reward Ratio</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Pattern Info */}
      <div className="space-y-1.5 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            {PATTERN_ICONS[signal.pattern] || PATTERN_ICONS['default']}
            <span className="text-sm font-medium text-foreground">{signal.pattern}</span>
          </div>
          <Badge 
            variant="outline" 
            className={`text-micro h-4 px-1 ${getDirectionColor(signal.direction)}`}
          >
            {signal.direction === 'bullish' ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : 
             signal.direction === 'bearish' ? <TrendingDown className="w-2.5 h-2.5 mr-0.5" /> : 
             <Activity className="w-2.5 h-2.5 mr-0.5" />}
            {signal.direction}
          </Badge>
        </div>

        {/* Price Levels */}
        <div className="grid grid-cols-3 gap-1 text-micro">
          <div className="flex flex-col items-center space-y-0.5">
            <span className="text-muted-foreground">Entry</span>
            <span className="text-foreground font-mono text-tiny">{signal.entry}</span>
          </div>
          <div className="flex flex-col items-center space-y-0.5">
            <span className="text-muted-foreground">TP</span>
            <span className="text-green-400 font-mono text-tiny">{signal.takeProfit}</span>
          </div>
          <div className="flex flex-col items-center space-y-0.5">
            <span className="text-muted-foreground">SL</span>
            <span className="text-red-400 font-mono text-tiny">{signal.stopLoss}</span>
          </div>
        </div>

        {/* Indicators */}
        {signal.indicators && signal.indicators.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {signal.indicators.slice(0, 2).map((indicator, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge 
                      variant="outline" 
                      className={`text-micro h-4 px-1 ${
                        indicator.signal === 'bullish' ? 'text-green-400 border-green-400/30' :
                        indicator.signal === 'bearish' ? 'text-red-400 border-red-400/30' :
                        'text-blue-400 border-blue-400/30'
                      }`}
                    >
                      {indicator.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{indicator.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        )}

        {/* Bottom Info */}
        <div className="flex items-center justify-between text-micro">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Clock className="w-2.5 h-2.5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {formatDistanceToNow(signal.timestamp, { addSuffix: true })}
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Volume2 className={`w-2.5 h-2.5 ${getVolumeColor(signal.volume)}`} />
              <span className={getVolumeColor(signal.volume)}>
                {signal.volume}
              </span>
            </div>
          </div>
          
          <Badge variant="outline" className="text-micro h-4 px-1">
            {signal.timeframe}
          </Badge>
        </div>
      </div>

      {/* Explanation Preview */}
      <div className="mb-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-start space-x-1 p-1.5 bg-muted/20 rounded text-micro">
                <Info className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-muted-foreground line-clamp-2 leading-tight">
                  {signal.explanation}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">{signal.explanation}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Action Button */}
      <Button
        onClick={handleButtonClick}
        variant="outline"
        size="sm"
        className="w-full h-7 text-micro bg-muted/30 hover:bg-muted/50 border-border/50 hover:border-primary/50 transition-colors"
      >
        View Analysis
      </Button>
    </motion.div>
  );
}