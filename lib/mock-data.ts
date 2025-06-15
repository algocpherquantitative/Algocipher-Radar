import { Signal, ChartData } from './types';
import { DetectedSignal, SIGNAL_PATTERNS } from './signal-types';
import { SignalDetector } from './signal-detector';

const SYMBOLS = ['EUR/USD', 'GBP/USD', 'BTC/USD', 'ETH/USD', 'AAPL', 'GOOGL', 'SPY', 'GOLD'];
const MARKETS = ['forex', 'crypto', 'stocks', 'indices'] as const;
const DIRECTIONS = ['bullish', 'bearish', 'neutral'] as const;
const TIMEFRAMES = ['5M', '15M', '1H', '4H', '1D'];

// Enhanced signal generation with real pattern detection
export function generateMockSignals(count: number = 15): DetectedSignal[] {
  const signals: DetectedSignal[] = [];
  
  // Generate some chart data for signal detection
  const chartData = generateChartData(100);
  const detector = new SignalDetector(chartData);
  
  // Get real detected signals
  const detectedSignals = detector.detectSignals();
  
  // Add detected signals
  signals.push(...detectedSignals.slice(0, Math.min(5, detectedSignals.length)));
  
  // Fill remaining with enhanced mock signals
  const remainingCount = count - signals.length;
  for (let i = 0; i < remainingCount; i++) {
    const patternIds = Object.keys(SIGNAL_PATTERNS);
    const patternId = patternIds[Math.floor(Math.random() * patternIds.length)];
    const pattern = SIGNAL_PATTERNS[patternId];
    
    const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    const market = MARKETS[Math.floor(Math.random() * MARKETS.length)];
    
    // Generate confidence based on pattern's historical win rate
    const baseConfidence = pattern.winRate;
    const confidence = Math.floor(baseConfidence + (Math.random() - 0.5) * 20);
    const finalConfidence = Math.max(60, Math.min(95, confidence));
    
    // Generate realistic prices based on symbol
    let basePrice = 1.0850; // Default for EUR/USD
    if (symbol.includes('BTC')) basePrice = 67000;
    else if (symbol.includes('ETH')) basePrice = 3400;
    else if (symbol === 'AAPL') basePrice = 180;
    else if (symbol === 'GOOGL') basePrice = 140;
    else if (symbol === 'SPY') basePrice = 490;
    else if (symbol === 'GOLD') basePrice = 1950;
    
    const entry = (basePrice + (Math.random() - 0.5) * basePrice * 0.02).toFixed(symbol.includes('/') ? 4 : 2);
    const riskReward = pattern.riskReward + (Math.random() - 0.5) * 0.5;
    const risk = parseFloat(entry) * 0.01; // 1% risk
    
    const takeProfit = direction === 'bullish' ? 
      (parseFloat(entry) + risk * riskReward).toFixed(symbol.includes('/') ? 4 : 2) :
      (parseFloat(entry) - risk * riskReward).toFixed(symbol.includes('/') ? 4 : 2);
    
    const stopLoss = direction === 'bullish' ? 
      (parseFloat(entry) - risk).toFixed(symbol.includes('/') ? 4 : 2) :
      (parseFloat(entry) + risk).toFixed(symbol.includes('/') ? 4 : 2);
    
    const signal: DetectedSignal = {
      id: `signal-${patternId}-${i}-${Date.now()}`,
      symbol,
      market,
      pattern: pattern.name,
      direction,
      confidence: finalConfidence,
      entry,
      takeProfit,
      stopLoss,
      timeframe: TIMEFRAMES[Math.floor(Math.random() * TIMEFRAMES.length)],
      timestamp: Date.now() - Math.random() * 3600000, // Within last hour
      patternId,
      explanation: pattern.explanation,
      riskReward: pattern.riskReward,
      winRate: pattern.winRate,
      indicators: generateMockIndicators(patternId),
      keyLevels: [
        { price: parseFloat(entry), type: 'entry', strength: 'strong' },
        { price: parseFloat(stopLoss), type: 'stop_loss', strength: 'strong' },
        { price: parseFloat(takeProfit), type: 'take_profit', strength: 'strong' }
      ],
      volume: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
    };
    
    signals.push(signal);
  }
  
  return signals.sort((a, b) => b.timestamp - a.timestamp);
}

function generateMockIndicators(patternId: string) {
  const indicators = [];
  
  // Add relevant indicators based on pattern type
  if (patternId.includes('rsi')) {
    const rsiValue = Math.random() * 100;
    indicators.push({
      name: 'RSI',
      value: rsiValue,
      signal: rsiValue > 70 ? 'bearish' : rsiValue < 30 ? 'bullish' : 'neutral',
      description: `RSI at ${rsiValue.toFixed(1)} - ${rsiValue > 70 ? 'Overbought' : rsiValue < 30 ? 'Oversold' : 'Neutral'}`
    });
  }
  
  if (patternId.includes('macd')) {
    const macdValue = (Math.random() - 0.5) * 0.01;
    indicators.push({
      name: 'MACD',
      value: macdValue,
      signal: macdValue > 0 ? 'bullish' : 'bearish',
      description: `MACD at ${macdValue.toFixed(4)} - ${macdValue > 0 ? 'Above zero' : 'Below zero'}`
    });
  }
  
  if (patternId.includes('vwap')) {
    const vwapValue = 1.0850 + (Math.random() - 0.5) * 0.01;
    const currentPrice = 1.0850 + (Math.random() - 0.5) * 0.005;
    indicators.push({
      name: 'VWAP',
      value: vwapValue,
      signal: currentPrice > vwapValue ? 'bullish' : 'bearish',
      description: `Price ${currentPrice > vwapValue ? 'above' : 'below'} VWAP (${vwapValue.toFixed(4)})`
    });
  }
  
  // Add volume indicator for most patterns
  const volumeMultiplier = Math.random() * 2 + 0.5;
  indicators.push({
    name: 'Volume',
    value: volumeMultiplier,
    signal: volumeMultiplier > 1.2 ? 'bullish' : volumeMultiplier < 0.8 ? 'bearish' : 'neutral',
    description: `Volume ${volumeMultiplier > 1.2 ? 'above' : volumeMultiplier < 0.8 ? 'below' : 'near'} average (${(volumeMultiplier * 100).toFixed(0)}%)`
  });
  
  return indicators;
}

export function generateChartData(points: number = 100): ChartData[] {
  const data: ChartData[] = [];
  let basePrice = 1.0850;
  const startTime = Date.now() - (points * 60000); // 1 minute intervals
  
  for (let i = 0; i < points; i++) {
    const time = startTime + (i * 60000);
    const volatility = 0.0005;
    const change = (Math.random() - 0.5) * volatility;
    
    basePrice = Math.max(1.0700, Math.min(1.1000, basePrice + change));
    
    const open = i === 0 ? basePrice : data[i - 1].close;
    const close = basePrice;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.random() * 1000000;
    
    data.push({
      time,
      price: close,
      volume,
      high,
      low,
      open,
      close,
    });
  }
  
  return data;
}

export function generateMarketOverview() {
  return [
    { symbol: 'EUR/USD', price: 1.0856, change: 0.0023, changePercent: 0.21, volume: '12.4B', trend: 'up' as const },
    { symbol: 'GBP/USD', price: 1.2634, change: -0.0011, changePercent: -0.09, volume: '8.7B', trend: 'down' as const },
    { symbol: 'BTC/USD', price: 67845, change: 1234, changePercent: 1.85, volume: '2.1B', trend: 'up' as const },
    { symbol: 'ETH/USD', price: 3456, change: -89, changePercent: -2.51, volume: '1.8B', trend: 'down' as const },
    { symbol: 'S&P 500', price: 4987, change: 12.4, changePercent: 0.25, volume: '45.2B', trend: 'up' as const },
    { symbol: 'NASDAQ', price: 15632, change: -23.1, changePercent: -0.15, volume: '38.9B', trend: 'down' as const },
  ];
}