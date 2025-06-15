"use client";

import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  Activity,
  Triangle,
  Zap,
  BarChart3
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';
import { Signal } from '@/lib/types';

interface SignalCardProps {
  signal: Signal;
  onClick: () => void;
}

const PATTERN_ICONS: Record<string, React.ReactNode> = {
  'Head and Shoulders': <Activity className="w-3 h-3" />,
  'Double Top': <BarChart3 className="w-3 h-3" />,
  'Triangle': <Triangle className="w-3 h-3" />,
  'Flag': <TrendingUp className="w-3 h-3" />,
  'Wedge': <Triangle className="w-3 h-3" />,
  'Pin Bar': <BarChart3 className="w-3 h-3" />,
  'Engulfing': <Activity className="w-3 h-3" />,
  'Hammer': <BarChart3 className="w-3 h-3" />,
  'RSI Divergence': <TrendingDown className="w-3 h-3" />,
  'MACD Cross': <Activity className="w-3 h-3" />,
};

export function SignalCard({ signal, onClick }: SignalCardProps) {
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
    if (direction === 'bullish') return 'text-green-400';
    if (direction === 'bearish') return 'text-red-400';
    return 'text-blue-400';
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      whileHover={{ scale: isDragging ? 1 : 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`signal-card ${signal.direction} ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-1.5">
          <div className={`signal-indicator ${signal.direction}`} />
          <div>
            <h4 className="text-sm font-semibold text-foreground">{signal.symbol}</h4>
            <p className="text-micro text-muted-foreground">{signal.market}</p>
          </div>
        </div>
        
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
              <p>Confidence Score: {signal.confidence}%</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-1.5 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            {PATTERN_ICONS[signal.pattern] || <Activity className="w-3 h-3" />}
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

        <div className="grid grid-cols-2 gap-1.5 text-micro">
          <div className="flex items-center space-x-1">
            <Target className="w-2.5 h-2.5 text-muted-foreground" />
            <span className="text-muted-foreground">Entry:</span>
            <span className="text-foreground font-mono">{signal.entry}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-2.5 h-2.5 text-muted-foreground" />
            <span className="text-muted-foreground">TP:</span>
            <span className="text-green-400 font-mono">{signal.takeProfit}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-micro">
          <div className="flex items-center space-x-1">
            <Clock className="w-2.5 h-2.5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDistanceToNow(signal.timestamp, { addSuffix: true })}
            </span>
          </div>
          <Badge variant="outline" className="text-micro h-4 px-1">
            {signal.timeframe}
          </Badge>
        </div>
      </div>

      <Button
        onClick={onClick}
        variant="outline"
        size="sm"
        className="w-full h-7 text-micro bg-muted/30 hover:bg-muted/50 border-border/50"
      >
        View Chart
      </Button>
    </motion.div>
  );
}