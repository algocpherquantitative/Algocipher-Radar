"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TrendingUp, TrendingDown, Activity, Clock, Info, Volume2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';
import { DetectedSignal } from '@/lib/signal-types';

interface EnhancedSignalCardProps {
  signal: DetectedSignal;
  onClick: () => void;
}

export function EnhancedSignalCard({ signal, onClick }: EnhancedSignalCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: (signal as any).id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`signal-card p-4 border rounded-lg bg-card/50 backdrop-blur-sm ${
        (signal as any).direction === 'bullish' ? 'border-green-500/30 bg-green-500/5' :
        (signal as any).direction === 'bearish' ? 'border-red-500/30 bg-red-500/5' :
        'border-blue-500/30 bg-blue-500/5'
      } ${isDragging ? 'opacity-50' : ''} cursor-pointer`}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-foreground">{(signal as any).symbol}</span>
          <Badge variant="outline" className="text-xs">{(signal as any).market}</Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={`text-xs ${
            (signal as any).confidence >= 80 ? 'text-green-400 border-green-400/30' :
            (signal as any).confidence >= 65 ? 'text-yellow-400 border-yellow-400/30' :
            'text-red-400 border-red-400/30'
          }`}>
            {(signal as any).confidence}%
          </Badge>
        </div>
      </div>

      {/* Pattern Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">{(signal as any).pattern}</span>
          <Badge variant="outline" className="text-xs">
            {(signal as any).direction === 'bullish' ? <TrendingUp className="w-3 h-3 mr-1" /> : 
             (signal as any).direction === 'bearish' ? <TrendingDown className="w-3 h-3 mr-1" /> : 
             <Activity className="w-3 h-3 mr-1" />}
            {(signal as any).direction}
          </Badge>
        </div>

        {/* Price Levels */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center">
            <div className="text-muted-foreground text-xs">Entry</div>
            <div className="font-mono">{(signal as any).entry}</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground text-xs">TP</div>
            <div className="font-mono text-green-400">{(signal as any).takeProfit}</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground text-xs">SL</div>
            <div className="font-mono text-red-400">{(signal as any).stopLoss}</div>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{formatDistanceToNow((signal as any).timestamp, { addSuffix: true })}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Volume2 className="w-3 h-3" />
          <span>{(signal as any).volume}</span>
        </div>
        
        <Badge variant="outline" className="text-xs">
          {(signal as any).timeframe}
        </Badge>
      </div>

      {/* Action Button */}
      <Button
        onClick={handleButtonClick}
        variant="outline"
        size="sm"
        className="w-full"
      >
        View Analysis
      </Button>
    </div>
  );
}