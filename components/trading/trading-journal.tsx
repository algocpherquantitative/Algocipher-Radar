"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  DollarSign,
  Target,
  Plus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JournalEntry {
  id: string;
  symbol: string;
  pattern: string;
  direction: 'bullish' | 'bearish';
  entry: number;
  exit?: number;
  result?: 'win' | 'loss' | 'pending';
  pnl?: number;
  notes: string;
  rating: number;
  timestamp: number;
}

const MOCK_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    symbol: 'EUR/USD',
    pattern: 'Head and Shoulders',
    direction: 'bullish',
    entry: 1.0850,
    exit: 1.0895,
    result: 'win',
    pnl: 450,
    notes: 'Perfect execution. Pattern played out exactly as expected.',
    rating: 5,
    timestamp: Date.now() - 86400000,
  },
  {
    id: '2',
    symbol: 'BTC/USD',
    pattern: 'Triangle Breakout',
    direction: 'bullish',
    entry: 67500,
    result: 'pending',
    notes: 'Entered on breakout confirmation. Waiting for target.',
    rating: 4,
    timestamp: Date.now() - 3600000,
  },
];

export function TradingJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(MOCK_ENTRIES);
  const [newEntry, setNewEntry] = useState({
    symbol: '',
    notes: '',
    rating: 3,
  });

  const addEntry = () => {
    if (!newEntry.symbol || !newEntry.notes) return;
    
    const entry: JournalEntry = {
      id: Date.now().toString(),
      symbol: newEntry.symbol,
      pattern: 'Manual Entry',
      direction: 'bullish',
      entry: 0,
      result: 'pending',
      notes: newEntry.notes,
      rating: newEntry.rating,
      timestamp: Date.now(),
    };
    
    setEntries(prev => [entry, ...prev]);
    setNewEntry({ symbol: '', notes: '', rating: 3 });
  };

  const stats = {
    totalTrades: entries.length,
    winRate: entries.filter(e => e.result === 'win').length / entries.filter(e => e.result !== 'pending').length * 100,
    totalPnL: entries.reduce((sum, e) => sum + (e.pnl || 0), 0),
    avgRating: entries.reduce((sum, e) => sum + e.rating, 0) / entries.length,
  };

  return (
    <div className="h-full space-y-4">
      <Tabs defaultValue="entries" className="h-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="entries">Journal Entries</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="entries" className="h-[calc(100%-60px)]">
          <div className="space-y-4">
            {/* Add New Entry */}
            <Card className="bg-muted/20 border-border/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Symbol (e.g., EUR/USD)"
                    value={newEntry.symbol}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, symbol: e.target.value }))}
                    className="flex-1 bg-muted/50 border-border/50"
                  />
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setNewEntry(prev => ({ ...prev, rating }))}
                        className={`w-5 h-5 ${rating <= newEntry.rating ? 'text-yellow-400' : 'text-muted-foreground'}`}
                      >
                        <Star className="w-full h-full fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                
                <Textarea
                  placeholder="Trade notes and observations..."
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                  className="bg-muted/50 border-border/50"
                  rows={2}
                />
                
                <Button onClick={addEntry} size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Entry
                </Button>
              </CardContent>
            </Card>

            {/* Journal Entries */}
            <ScrollArea className="flex-1">
              <div className="space-y-3">
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-muted/20 border-border/50 hover:bg-muted/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-sm font-semibold text-foreground">
                                {entry.symbol}
                              </h4>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  entry.direction === 'bullish' ? 'text-green-400 border-green-400/30' : 
                                  'text-red-400 border-red-400/30'
                                }`}
                              >
                                {entry.direction === 'bullish' ? (
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                ) : (
                                  <TrendingDown className="w-3 h-3 mr-1" />
                                )}
                                {entry.direction}
                              </Badge>
                              {entry.result && (
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    entry.result === 'win' ? 'text-green-400 border-green-400/30' : 
                                    entry.result === 'loss' ? 'text-red-400 border-red-400/30' :
                                    'text-blue-400 border-blue-400/30'
                                  }`}
                                >
                                  {entry.result}
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-xs text-muted-foreground mb-2">
                              {entry.pattern}
                            </p>
                            
                            <p className="text-sm text-foreground mb-2">
                              {entry.notes}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-xs">
                                <div className="flex items-center space-x-1">
                                  <Target className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-muted-foreground">Entry:</span>
                                  <span className="text-foreground font-mono">{entry.entry}</span>
                                </div>
                                
                                {entry.exit && (
                                  <div className="flex items-center space-x-1">
                                    <span className="text-muted-foreground">Exit:</span>
                                    <span className="text-foreground font-mono">{entry.exit}</span>
                                  </div>
                                )}
                                
                                {entry.pnl && (
                                  <div className="flex items-center space-x-1">
                                    <DollarSign className="w-3 h-3 text-muted-foreground" />
                                    <span className={`font-medium ${entry.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                      {entry.pnl > 0 ? '+' : ''}{entry.pnl}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2">
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map(rating => (
                                <Star
                                  key={rating}
                                  className={`w-3 h-3 ${rating <= entry.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`}
                                />
                              ))}
                            </div>
                            
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDistanceToNow(entry.timestamp, { addSuffix: true })}</span>
                            </div>
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
        
        <TabsContent value="stats" className="h-[calc(100%-60px)]">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-muted/20 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Total Trades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.totalTrades}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/20 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Win Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {isNaN(stats.winRate) ? '0' : stats.winRate.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/20 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Total P&L
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.totalPnL >= 0 ? '+' : ''}{stats.totalPnL}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/20 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Avg Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">
                  {stats.avgRating.toFixed(1)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}