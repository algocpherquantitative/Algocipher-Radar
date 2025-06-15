export interface Signal {
  id: string;
  symbol: string;
  market: 'forex' | 'crypto' | 'stocks' | 'indices';
  pattern: string;
  direction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  entry: string;
  takeProfit: string;
  stopLoss: string;
  timeframe: string;
  timestamp: number;
  indicators?: string[];
  volume?: 'low' | 'medium' | 'high';
  riskReward?: number;
}

export interface ChartData {
  time: number;
  price: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  channels: ('email' | 'telegram' | 'webhook')[];
  enabled: boolean;
  triggered: number;
}

export interface JournalEntry {
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