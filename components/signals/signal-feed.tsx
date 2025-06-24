"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Zap, Activity, Candy as Candle, BarChart3, Target, TrendingUp } from 'lucide-react';
import { EnhancedSignalCard } from './enhanced-signal-card';
import { generateMockSignals } from '@/lib/mock-data';
import { DetectedSignal } from '@/lib/signal-types';

interface SignalFeedProps {
  onSignalSelect: (signalId: string) => void;
  hideFilters?: boolean;
  searchTerm: string;
  marketFilter: string;
  confidenceFilter: string;
  directionFilter: string;
  timeframeFilter: string;
  categoryFilter: string;
  signals?: DetectedSignal[];
}

export function SignalFeed({
  onSignalSelect,
  hideFilters = false,
  searchTerm,
  marketFilter,
  confidenceFilter,
  directionFilter,
  timeframeFilter,
  categoryFilter,
  signals: externalSignals
}: SignalFeedProps) {
  const [signals, setSignals] = useState<DetectedSignal[]>(generateMockSignals());
  const [filteredSignals, setFilteredSignals] = useState(signals);
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (externalSignals) {
      setFilteredSignals(externalSignals);
      return;
    }
    // Simulate real-time signal updates
    const interval = setInterval(() => {
      setSignals(prev => {
        const newSignals = [...prev];
        
        // Randomly update some signals
        const randomIndex = Math.floor(Math.random() * newSignals.length);
        if (newSignals[randomIndex]) {
          newSignals[randomIndex] = {
            ...newSignals[randomIndex],
            confidence: Math.max(60, Math.min(95, (newSignals[randomIndex] as any).confidence + (Math.random() - 0.5) * 10)),
            timestamp: Date.now() - Math.random() * 60000,
          } as DetectedSignal;
        }
        
        // Occasionally add new signals
        if (Math.random() < 0.3) {
          const newSignal = generateMockSignals(1)[0];
          newSignals.unshift(newSignal);
          return newSignals.slice(0, 25); // Keep only latest 25
        }
        
        return newSignals;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = signals;

    if (searchTerm) {
      filtered = filtered.filter(signal =>
        (signal as any).symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (signal as any).pattern.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (marketFilter !== 'all') {
      filtered = filtered.filter(signal => (signal as any).market === marketFilter);
    }

    if (confidenceFilter !== 'all') {
      const minConfidence = confidenceFilter === 'high' ? 80 : confidenceFilter === 'medium' ? 65 : 0;
      const maxConfidence = confidenceFilter === 'high' ? 100 : confidenceFilter === 'medium' ? 79 : 64;
      filtered = filtered.filter(signal => (signal as any).confidence >= minConfidence && (signal as any).confidence <= maxConfidence);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(signal => {
        const pattern = (signal as any).patternId || '';
        switch (categoryFilter) {
          case 'price_action':
            return pattern.includes('breakout') || pattern.includes('support') || pattern.includes('gap');
          case 'candlestick':
            return pattern.includes('engulfing') || pattern.includes('hammer') || pattern.includes('star');
          case 'chart_pattern':
            return pattern.includes('head') || pattern.includes('double') || pattern.includes('triangle') || pattern.includes('flag');
          case 'indicator':
            return pattern.includes('rsi') || pattern.includes('macd') || pattern.includes('cross') || pattern.includes('vwap');
          case 'support_resistance':
            return pattern.includes('fib') || pattern.includes('retest') || pattern.includes('psychological');
          default:
            return true;
        }
      });
    }

    if (directionFilter !== 'all') {
      filtered = filtered.filter(signal => (signal as any).direction === directionFilter);
    }

    if (timeframeFilter !== 'all') {
      filtered = filtered.filter(signal => (signal as any).timeframe === timeframeFilter);
    }

    setFilteredSignals(filtered);
  }, [signals, searchTerm, marketFilter, confidenceFilter, categoryFilter, directionFilter, timeframeFilter]);

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFilteredSignals((items) => {
        const oldIndex = items.findIndex(item => (item as any).id === active.id);
        const newIndex = items.findIndex(item => (item as any).id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handleSignalClick = (signalId: string) => {
    setSelectedSignalId(signalId);
    onSignalSelect(signalId);
  };

  const categoryStats = {
    price_action: filteredSignals.filter(s => s.patternId?.includes('breakout') || s.patternId?.includes('support') || s.patternId?.includes('gap')).length,
    candlestick: filteredSignals.filter(s => s.patternId?.includes('engulfing') || s.patternId?.includes('hammer') || s.patternId?.includes('star')).length,
    chart_pattern: filteredSignals.filter(s => s.patternId?.includes('head') || s.patternId?.includes('double') || s.patternId?.includes('triangle') || s.patternId?.includes('flag')).length,
    indicator: filteredSignals.filter(s => s.patternId?.includes('rsi') || s.patternId?.includes('macd') || s.patternId?.includes('cross') || s.patternId?.includes('vwap')).length,
    support_resistance: filteredSignals.filter(s => s.patternId?.includes('fib') || s.patternId?.includes('retest') || s.patternId?.includes('psychological')).length,
  };

  const highConfidenceSignals = filteredSignals.filter(s => (s as any).confidence >= 80);
  const avgConfidence = filteredSignals.length > 0 ? 
    Math.round(filteredSignals.reduce((sum, s) => sum + (s as any).confidence, 0) / filteredSignals.length) : 0;

  // If externalSignals is provided, use it directly for rendering and skip all internal filtering logic
  const signalsToRender = externalSignals ? externalSignals : filteredSignals;

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Signal Stats Header */}
      {!externalSignals && (
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-green-400 border-green-400/30">
            <TrendingUp className="w-3 h-3 mr-1" />
            {filteredSignals.length} Signals
          </Badge>
          <Badge variant="outline" className="text-blue-400 border-blue-400/30">
            {avgConfidence}% Avg Confidence
          </Badge>
          <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
            {highConfidenceSignals.length} High Confidence
          </Badge>
        </div>
      </div>
      )}

      {/* Enhanced Filters */}
      {/* Filter controls are now only rendered in the filter column. */}

      {/* Enhanced Signal Cards */}
      <ScrollArea className="flex-1">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={signalsToRender.map(s => (s as any).id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3 pr-2">
              <AnimatePresence>
                {signalsToRender.map((signal, index) => (
                  <motion.div
                    key={(signal as any).id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.03 }}
                    className={selectedSignalId === (signal as any).id ? 'ring-2 ring-primary/50 rounded-lg' : ''}
                  >
                    <EnhancedSignalCard
                      signal={signal}
                      onClick={() => handleSignalClick((signal as any).id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {signalsToRender.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Signals Found</h3>
                  <p className="text-muted-foreground text-sm">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </ScrollArea>
    </div>
  );
}