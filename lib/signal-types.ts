export interface SignalPattern {
  id: string;
  name: string;
  category: 'price_action' | 'candlestick' | 'chart_pattern' | 'indicator' | 'support_resistance';
  description: string;
  explanation: string;
  riskReward: number;
  winRate: number;
  icon: string;
}

export interface DetectedSignal extends Signal {
  patternId: string;
  explanation: string;
  overlayData?: any;
  indicators?: IndicatorData[];
  keyLevels?: KeyLevel[];
  riskReward: number;
  winRate: number;
}

export interface IndicatorData {
  name: string;
  value: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  description: string;
}

export interface KeyLevel {
  price: number;
  type: 'support' | 'resistance' | 'entry' | 'stop_loss' | 'take_profit';
  strength: 'weak' | 'medium' | 'strong';
}

export const SIGNAL_PATTERNS: Record<string, SignalPattern> = {
  // Price Action Signals
  'breakout_resistance': {
    id: 'breakout_resistance',
    name: 'Resistance Breakout',
    category: 'price_action',
    description: 'Price breaks above key resistance with volume',
    explanation: 'Strong bullish signal when price closes above resistance level with increased volume, indicating potential upward momentum.',
    riskReward: 2.5,
    winRate: 72,
    icon: 'TrendingUp'
  },
  'support_bounce': {
    id: 'support_bounce',
    name: 'Support Bounce',
    category: 'price_action',
    description: 'Price bounces from key support level',
    explanation: 'Bullish reversal signal when price finds support at a key level and shows signs of rejection with strong buying pressure.',
    riskReward: 2.0,
    winRate: 68,
    icon: 'ArrowUp'
  },
  'fair_value_gap': {
    id: 'fair_value_gap',
    name: 'Fair Value Gap Fill',
    category: 'price_action',
    description: 'Price returns to fill imbalance gap',
    explanation: 'Market inefficiency being corrected as price returns to fill a gap left by rapid price movement.',
    riskReward: 1.8,
    winRate: 65,
    icon: 'Gap'
  },

  // Candlestick Patterns
  'bullish_engulfing': {
    id: 'bullish_engulfing',
    name: 'Bullish Engulfing',
    category: 'candlestick',
    description: 'Large bullish candle engulfs previous bearish candle',
    explanation: 'Strong reversal pattern where bulls completely overwhelm bears, engulfing the previous candle entirely.',
    riskReward: 2.2,
    winRate: 74,
    icon: 'Candle'
  },
  'bearish_engulfing': {
    id: 'bearish_engulfing',
    name: 'Bearish Engulfing',
    category: 'candlestick',
    description: 'Large bearish candle engulfs previous bullish candle',
    explanation: 'Strong reversal pattern where bears completely overwhelm bulls, engulfing the previous candle entirely.',
    riskReward: 2.2,
    winRate: 74,
    icon: 'Candle'
  },
  'hammer': {
    id: 'hammer',
    name: 'Hammer',
    category: 'candlestick',
    description: 'Bullish reversal with long lower shadow',
    explanation: 'Bullish reversal pattern showing rejection of lower prices with a long lower wick and small body.',
    riskReward: 2.0,
    winRate: 69,
    icon: 'Hammer'
  },
  'shooting_star': {
    id: 'shooting_star',
    name: 'Shooting Star',
    category: 'candlestick',
    description: 'Bearish reversal with long upper shadow',
    explanation: 'Bearish reversal pattern showing rejection of higher prices with a long upper wick and small body.',
    riskReward: 2.0,
    winRate: 69,
    icon: 'Star'
  },

  // Chart Patterns
  'head_shoulders': {
    id: 'head_shoulders',
    name: 'Head and Shoulders',
    category: 'chart_pattern',
    description: 'Three peaks with middle peak highest',
    explanation: 'Classic reversal pattern with three peaks where the middle peak (head) is higher than the shoulders, indicating trend reversal.',
    riskReward: 2.8,
    winRate: 78,
    icon: 'Activity'
  },
  'double_top': {
    id: 'double_top',
    name: 'Double Top',
    category: 'chart_pattern',
    description: 'Two peaks at similar levels indicating reversal',
    explanation: 'Bearish reversal pattern formed by two peaks at approximately the same level, showing resistance and potential downward move.',
    riskReward: 2.5,
    winRate: 71,
    icon: 'Mountain'
  },
  'ascending_triangle': {
    id: 'ascending_triangle',
    name: 'Ascending Triangle',
    category: 'chart_pattern',
    description: 'Horizontal resistance with rising support',
    explanation: 'Bullish continuation pattern with flat resistance and rising support, typically breaks upward.',
    riskReward: 2.3,
    winRate: 73,
    icon: 'Triangle'
  },
  'flag_pattern': {
    id: 'flag_pattern',
    name: 'Bull Flag',
    category: 'chart_pattern',
    description: 'Brief consolidation after strong move',
    explanation: 'Bullish continuation pattern showing brief pause in uptrend before resuming higher.',
    riskReward: 2.1,
    winRate: 76,
    icon: 'Flag'
  },

  // Indicator Signals
  'rsi_oversold': {
    id: 'rsi_oversold',
    name: 'RSI Oversold Bounce',
    category: 'indicator',
    description: 'RSI below 30 with bullish divergence',
    explanation: 'RSI showing oversold conditions with price making lower lows while RSI makes higher lows, indicating potential reversal.',
    riskReward: 2.0,
    winRate: 67,
    icon: 'TrendingUp'
  },
  'macd_bullish_cross': {
    id: 'macd_bullish_cross',
    name: 'MACD Bullish Cross',
    category: 'indicator',
    description: 'MACD line crosses above signal line',
    explanation: 'Bullish momentum signal when MACD line crosses above the signal line, indicating potential upward price movement.',
    riskReward: 1.9,
    winRate: 64,
    icon: 'Activity'
  },
  'golden_cross': {
    id: 'golden_cross',
    name: 'Golden Cross',
    category: 'indicator',
    description: '50 MA crosses above 200 MA',
    explanation: 'Strong bullish signal when short-term moving average crosses above long-term moving average.',
    riskReward: 3.2,
    winRate: 81,
    icon: 'Cross'
  },
  'vwap_reclaim': {
    id: 'vwap_reclaim',
    name: 'VWAP Reclaim',
    category: 'indicator',
    description: 'Price reclaims VWAP with volume',
    explanation: 'Bullish signal when price moves back above VWAP (Volume Weighted Average Price) with strong volume confirmation.',
    riskReward: 1.8,
    winRate: 63,
    icon: 'BarChart3'
  },

  // Support/Resistance & Fibonacci
  'fib_618_bounce': {
    id: 'fib_618_bounce',
    name: 'Fibonacci 61.8% Bounce',
    category: 'support_resistance',
    description: 'Price bounces from 61.8% retracement',
    explanation: 'Strong support level at the golden ratio (61.8%) Fibonacci retracement, often acts as key reversal point.',
    riskReward: 2.4,
    winRate: 75,
    icon: 'Target'
  },
  'break_retest': {
    id: 'break_retest',
    name: 'Break and Retest',
    category: 'support_resistance',
    description: 'Breakout followed by successful retest',
    explanation: 'Confirmation pattern where price breaks a level, retests it as new support/resistance, and continues in breakout direction.',
    riskReward: 2.6,
    winRate: 77,
    icon: 'RefreshCw'
  },
  'psychological_level': {
    id: 'psychological_level',
    name: 'Psychological Level',
    category: 'support_resistance',
    description: 'Reaction at round number levels',
    explanation: 'Price reaction at psychologically significant round numbers (e.g., 2000, 30000) where traders often place orders.',
    riskReward: 1.7,
    winRate: 61,
    icon: 'Hash'
  }
};