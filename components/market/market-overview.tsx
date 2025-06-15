"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Target, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TradingSessionClocks } from './trading-session-clocks';

export function MarketOverview() {
  const [activeSignals, setActiveSignals] = useState(47);
  const [totalSignals, setTotalSignals] = useState(1247);
  const [accuracy, setAccuracy] = useState(87.3);

  return (
    <div className="space-y-3">
      {/* Trading Sessions & Signal Overview - Compact Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trading Sessions - Left Container */}
        <Card className="glassmorphism">
          <CardContent className="p-3">
            <TradingSessionClocks />
          </CardContent>
        </Card>

        {/* Signal Overview - Right Container */}
        <Card className="glassmorphism">
          <CardContent className="p-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Signal Overview</h3>
                <Badge variant="outline" className="text-green-400 border-green-400/30 text-xs h-5">
                  <Activity className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-muted/20 rounded-md p-2 border border-border/30"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Activity className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-muted-foreground">Live</span>
                  </div>
                  <div className="text-lg font-bold text-green-400">{activeSignals}</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-muted/20 rounded-md p-2 border border-border/30"
                >
                  <div className="flex items-center justify-between mb-1">
                    <BarChart3 className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-muted-foreground">24h</span>
                  </div>
                  <div className="text-lg font-bold text-blue-400">{totalSignals}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-muted/20 rounded-md p-2 border border-border/30"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Target className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-muted-foreground">Avg</span>
                  </div>
                  <div className="text-lg font-bold text-purple-400">{accuracy}%</div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-muted/20 rounded-md p-2 border border-border/30"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">High</span>
                  </div>
                  <div className="text-lg font-bold text-yellow-400">92</div>
                  <div className="text-xs text-muted-foreground">Confidence</div>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}