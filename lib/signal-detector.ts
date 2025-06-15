import { SIGNAL_PATTERNS, DetectedSignal, IndicatorData, KeyLevel } from './signal-types';
import { Signal } from './types';

export class SignalDetector {
  private ohlcData: any[];
  private indicators: Map<string, number[]> = new Map();

  constructor(ohlcData: any[]) {
    this.ohlcData = ohlcData;
    this.calculateIndicators();
  }

  private calculateIndicators() {
    // Calculate RSI
    const rsi = this.calculateRSI(this.ohlcData, 14);
    this.indicators.set('rsi', rsi);

    // Calculate MACD
    const macd = this.calculateMACD(this.ohlcData);
    this.indicators.set('macd', macd.macd);
    this.indicators.set('macd_signal', macd.signal);

    // Calculate Moving Averages
    const sma20 = this.calculateSMA(this.ohlcData, 20);
    const sma50 = this.calculateSMA(this.ohlcData, 50);
    const sma200 = this.calculateSMA(this.ohlcData, 200);
    this.indicators.set('sma20', sma20);
    this.indicators.set('sma50', sma50);
    this.indicators.set('sma200', sma200);

    // Calculate VWAP
    const vwap = this.calculateVWAP(this.ohlcData);
    this.indicators.set('vwap', vwap);
  }

  public detectSignals(): DetectedSignal[] {
    const signals: DetectedSignal[] = [];

    // Detect each signal type
    signals.push(...this.detectPriceActionSignals());
    signals.push(...this.detectCandlestickPatterns());
    signals.push(...this.detectChartPatterns());
    signals.push(...this.detectIndicatorSignals());
    signals.push(...this.detectSupportResistanceSignals());

    return signals.filter(signal => signal.confidence >= 60); // Only return high-confidence signals
  }

  private detectPriceActionSignals(): DetectedSignal[] {
    const signals: DetectedSignal[] = [];
    const current = this.ohlcData[this.ohlcData.length - 1];
    const previous = this.ohlcData[this.ohlcData.length - 2];

    // Resistance Breakout
    const resistance = this.findResistanceLevel();
    if (resistance && current.close > resistance && current.volume > this.getAverageVolume() * 1.5) {
      signals.push(this.createSignal('breakout_resistance', 'bullish', current.close, 85));
    }

    // Support Bounce
    const support = this.findSupportLevel();
    if (support && current.low <= support * 1.002 && current.close > current.open) {
      signals.push(this.createSignal('support_bounce', 'bullish', current.close, 78));
    }

    return signals;
  }

  private detectCandlestickPatterns(): DetectedSignal[] {
    const signals: DetectedSignal[] = [];
    const current = this.ohlcData[this.ohlcData.length - 1];
    const previous = this.ohlcData[this.ohlcData.length - 2];

    // Bullish Engulfing
    if (this.isBullishEngulfing(previous, current)) {
      signals.push(this.createSignal('bullish_engulfing', 'bullish', current.close, 82));
    }

    // Bearish Engulfing
    if (this.isBearishEngulfing(previous, current)) {
      signals.push(this.createSignal('bearish_engulfing', 'bearish', current.close, 82));
    }

    // Hammer
    if (this.isHammer(current)) {
      signals.push(this.createSignal('hammer', 'bullish', current.close, 75));
    }

    // Shooting Star
    if (this.isShootingStar(current)) {
      signals.push(this.createSignal('shooting_star', 'bearish', current.close, 75));
    }

    return signals;
  }

  private detectChartPatterns(): DetectedSignal[] {
    const signals: DetectedSignal[] = [];

    // Head and Shoulders (simplified detection)
    if (this.isHeadAndShoulders()) {
      const current = this.ohlcData[this.ohlcData.length - 1];
      signals.push(this.createSignal('head_shoulders', 'bearish', current.close, 87));
    }

    // Double Top
    if (this.isDoubleTop()) {
      const current = this.ohlcData[this.ohlcData.length - 1];
      signals.push(this.createSignal('double_top', 'bearish', current.close, 79));
    }

    // Ascending Triangle
    if (this.isAscendingTriangle()) {
      const current = this.ohlcData[this.ohlcData.length - 1];
      signals.push(this.createSignal('ascending_triangle', 'bullish', current.close, 81));
    }

    return signals;
  }

  private detectIndicatorSignals(): DetectedSignal[] {
    const signals: DetectedSignal[] = [];
    const rsi = this.indicators.get('rsi') || [];
    const macd = this.indicators.get('macd') || [];
    const macdSignal = this.indicators.get('macd_signal') || [];
    const sma50 = this.indicators.get('sma50') || [];
    const sma200 = this.indicators.get('sma200') || [];
    const vwap = this.indicators.get('vwap') || [];

    const current = this.ohlcData[this.ohlcData.length - 1];
    const currentRSI = rsi[rsi.length - 1];
    const currentMACD = macd[macd.length - 1];
    const currentSignal = macdSignal[macdSignal.length - 1];

    // RSI Oversold with Divergence
    if (currentRSI < 30 && this.hasRSIBullishDivergence()) {
      signals.push(this.createSignal('rsi_oversold', 'bullish', current.close, 73));
    }

    // MACD Bullish Cross
    if (currentMACD > currentSignal && macd[macd.length - 2] <= macdSignal[macdSignal.length - 2]) {
      signals.push(this.createSignal('macd_bullish_cross', 'bullish', current.close, 68));
    }

    // Golden Cross
    if (sma50[sma50.length - 1] > sma200[sma200.length - 1] && 
        sma50[sma50.length - 2] <= sma200[sma200.length - 2]) {
      signals.push(this.createSignal('golden_cross', 'bullish', current.close, 89));
    }

    // VWAP Reclaim
    if (current.close > vwap[vwap.length - 1] && 
        this.ohlcData[this.ohlcData.length - 2].close <= vwap[vwap.length - 2] &&
        current.volume > this.getAverageVolume() * 1.2) {
      signals.push(this.createSignal('vwap_reclaim', 'bullish', current.close, 71));
    }

    return signals;
  }

  private detectSupportResistanceSignals(): DetectedSignal[] {
    const signals: DetectedSignal[] = [];
    const current = this.ohlcData[this.ohlcData.length - 1];

    // Fibonacci 61.8% Bounce
    const fibLevel = this.getFibonacci618Level();
    if (fibLevel && Math.abs(current.low - fibLevel) / fibLevel < 0.005 && current.close > current.open) {
      signals.push(this.createSignal('fib_618_bounce', 'bullish', current.close, 83));
    }

    // Break and Retest
    if (this.isBreakAndRetest()) {
      signals.push(this.createSignal('break_retest', 'bullish', current.close, 85));
    }

    // Psychological Level
    if (this.isPsychologicalLevel(current.close)) {
      const direction = current.close > current.open ? 'bullish' : 'bearish';
      signals.push(this.createSignal('psychological_level', direction, current.close, 65));
    }

    return signals;
  }

  private createSignal(patternId: string, direction: 'bullish' | 'bearish' | 'neutral', price: number, confidence: number): DetectedSignal {
    const pattern = SIGNAL_PATTERNS[patternId];
    const symbol = 'EUR/USD'; // This would come from the data source
    const atr = this.calculateATR(20);
    
    const stopLoss = direction === 'bullish' ? 
      (price - atr * 1.5).toFixed(4) : 
      (price + atr * 1.5).toFixed(4);
    
    const takeProfit = direction === 'bullish' ? 
      (price + atr * pattern.riskReward).toFixed(4) : 
      (price - atr * pattern.riskReward).toFixed(4);

    return {
      id: `${patternId}-${Date.now()}`,
      symbol,
      market: 'forex' as const,
      pattern: pattern.name,
      direction,
      confidence,
      entry: price.toFixed(4),
      takeProfit,
      stopLoss,
      timeframe: '1H',
      timestamp: Date.now(),
      patternId,
      explanation: pattern.explanation,
      riskReward: pattern.riskReward,
      winRate: pattern.winRate,
      indicators: this.getRelevantIndicators(patternId),
      keyLevels: this.getKeyLevels(price, parseFloat(stopLoss), parseFloat(takeProfit)),
      volume: this.getVolumeSignal()
    };
  }

  // Technical Analysis Helper Methods
  private calculateRSI(data: any[], period: number): number[] {
    const rsi: number[] = [];
    const gains: number[] = [];
    const losses: number[] = [];

    for (let i = 1; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }

    for (let i = period - 1; i < gains.length; i++) {
      const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b) / period;
      const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b) / period;
      const rs = avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }

    return rsi;
  }

  private calculateMACD(data: any[]): { macd: number[], signal: number[] } {
    const ema12 = this.calculateEMA(data, 12);
    const ema26 = this.calculateEMA(data, 26);
    const macd = ema12.map((val, i) => val - ema26[i]);
    const signal = this.calculateEMAFromArray(macd, 9);

    return { macd, signal };
  }

  private calculateEMA(data: any[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    ema[0] = data[0].close;

    for (let i = 1; i < data.length; i++) {
      ema[i] = (data[i].close * multiplier) + (ema[i - 1] * (1 - multiplier));
    }

    return ema;
  }

  private calculateEMAFromArray(data: number[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    ema[0] = data[0];

    for (let i = 1; i < data.length; i++) {
      ema[i] = (data[i] * multiplier) + (ema[i - 1] * (1 - multiplier));
    }

    return ema;
  }

  private calculateSMA(data: any[], period: number): number[] {
    const sma: number[] = [];
    
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val.close, 0);
      sma.push(sum / period);
    }

    return sma;
  }

  private calculateVWAP(data: any[]): number[] {
    const vwap: number[] = [];
    let cumulativeTPV = 0;
    let cumulativeVolume = 0;

    for (let i = 0; i < data.length; i++) {
      const typicalPrice = (data[i].high + data[i].low + data[i].close) / 3;
      cumulativeTPV += typicalPrice * data[i].volume;
      cumulativeVolume += data[i].volume;
      vwap.push(cumulativeTPV / cumulativeVolume);
    }

    return vwap;
  }

  private calculateATR(period: number): number {
    const tr: number[] = [];
    
    for (let i = 1; i < this.ohlcData.length; i++) {
      const current = this.ohlcData[i];
      const previous = this.ohlcData[i - 1];
      
      const tr1 = current.high - current.low;
      const tr2 = Math.abs(current.high - previous.close);
      const tr3 = Math.abs(current.low - previous.close);
      
      tr.push(Math.max(tr1, tr2, tr3));
    }

    const recentTR = tr.slice(-period);
    return recentTR.reduce((a, b) => a + b) / recentTR.length;
  }

  // Pattern Recognition Methods
  private isBullishEngulfing(prev: any, curr: any): boolean {
    return prev.close < prev.open && // Previous candle is bearish
           curr.close > curr.open && // Current candle is bullish
           curr.open < prev.close && // Current opens below previous close
           curr.close > prev.open;   // Current closes above previous open
  }

  private isBearishEngulfing(prev: any, curr: any): boolean {
    return prev.close > prev.open && // Previous candle is bullish
           curr.close < curr.open && // Current candle is bearish
           curr.open > prev.close && // Current opens above previous close
           curr.close < prev.open;   // Current closes below previous open
  }

  private isHammer(candle: any): boolean {
    const body = Math.abs(candle.close - candle.open);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    
    return lowerShadow > body * 2 && upperShadow < body * 0.5;
  }

  private isShootingStar(candle: any): boolean {
    const body = Math.abs(candle.close - candle.open);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    
    return upperShadow > body * 2 && lowerShadow < body * 0.5;
  }

  private isHeadAndShoulders(): boolean {
    // Simplified H&S detection - would need more sophisticated logic in production
    const recentHighs = this.ohlcData.slice(-20).map(d => d.high);
    const maxHigh = Math.max(...recentHighs);
    const maxIndex = recentHighs.lastIndexOf(maxHigh);
    
    // Check for shoulder patterns around the head
    return maxIndex > 5 && maxIndex < 15;
  }

  private isDoubleTop(): boolean {
    const recentHighs = this.ohlcData.slice(-30).map(d => d.high);
    const peaks = this.findPeaks(recentHighs);
    
    if (peaks.length >= 2) {
      const lastTwo = peaks.slice(-2);
      const diff = Math.abs(lastTwo[0] - lastTwo[1]) / Math.max(lastTwo[0], lastTwo[1]);
      return diff < 0.02; // Within 2% of each other
    }
    
    return false;
  }

  private isAscendingTriangle(): boolean {
    // Simplified ascending triangle detection
    const recentData = this.ohlcData.slice(-20);
    const highs = recentData.map(d => d.high);
    const lows = recentData.map(d => d.low);
    
    // Check if highs are relatively flat and lows are rising
    const highsFlat = this.isRelativelyFlat(highs);
    const lowsRising = this.isRising(lows);
    
    return highsFlat && lowsRising;
  }

  // Helper Methods
  private findPeaks(data: number[]): number[] {
    const peaks: number[] = [];
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
        peaks.push(data[i]);
      }
    }
    return peaks;
  }

  private isRelativelyFlat(data: number[]): boolean {
    const max = Math.max(...data);
    const min = Math.min(...data);
    return (max - min) / max < 0.03; // Within 3%
  }

  private isRising(data: number[]): boolean {
    const first = data.slice(0, 5).reduce((a, b) => a + b) / 5;
    const last = data.slice(-5).reduce((a, b) => a + b) / 5;
    return last > first * 1.02; // At least 2% higher
  }

  private findResistanceLevel(): number | null {
    const highs = this.ohlcData.slice(-50).map(d => d.high);
    const peaks = this.findPeaks(highs);
    return peaks.length > 0 ? Math.max(...peaks) : null;
  }

  private findSupportLevel(): number | null {
    const lows = this.ohlcData.slice(-50).map(d => d.low);
    const troughs: number[] = [];
    
    for (let i = 1; i < lows.length - 1; i++) {
      if (lows[i] < lows[i - 1] && lows[i] < lows[i + 1]) {
        troughs.push(lows[i]);
      }
    }
    
    return troughs.length > 0 ? Math.min(...troughs) : null;
  }

  private getAverageVolume(): number {
    const recentVolumes = this.ohlcData.slice(-20).map(d => d.volume);
    return recentVolumes.reduce((a, b) => a + b) / recentVolumes.length;
  }

  private hasRSIBullishDivergence(): boolean {
    // Simplified divergence detection
    const rsi = this.indicators.get('rsi') || [];
    const prices = this.ohlcData.map(d => d.low);
    
    if (rsi.length < 10 || prices.length < 10) return false;
    
    const recentRSI = rsi.slice(-10);
    const recentPrices = prices.slice(-10);
    
    // Check if price is making lower lows while RSI makes higher lows
    const priceLL = Math.min(...recentPrices.slice(-5)) < Math.min(...recentPrices.slice(0, 5));
    const rsiHL = Math.min(...recentRSI.slice(-5)) > Math.min(...recentRSI.slice(0, 5));
    
    return priceLL && rsiHL;
  }

  private getFibonacci618Level(): number | null {
    const recentData = this.ohlcData.slice(-100);
    const high = Math.max(...recentData.map(d => d.high));
    const low = Math.min(...recentData.map(d => d.low));
    
    return low + (high - low) * 0.618;
  }

  private isBreakAndRetest(): boolean {
    // Simplified break and retest detection
    const recentData = this.ohlcData.slice(-20);
    const resistance = this.findResistanceLevel();
    
    if (!resistance) return false;
    
    // Check if we broke above resistance and are now retesting
    const brokeAbove = recentData.some(d => d.close > resistance);
    const current = recentData[recentData.length - 1];
    const retesting = Math.abs(current.low - resistance) / resistance < 0.01;
    
    return brokeAbove && retesting;
  }

  private isPsychologicalLevel(price: number): boolean {
    const roundNumbers = [1.0000, 1.1000, 1.2000, 1.3000, 30000, 40000, 50000, 2000, 3000, 4000];
    return roundNumbers.some(level => Math.abs(price - level) / level < 0.005);
  }

  private getRelevantIndicators(patternId: string): IndicatorData[] {
    const indicators: IndicatorData[] = [];
    const rsi = this.indicators.get('rsi') || [];
    const macd = this.indicators.get('macd') || [];
    const vwap = this.indicators.get('vwap') || [];
    
    const currentRSI = rsi[rsi.length - 1];
    const currentMACD = macd[macd.length - 1];
    const currentVWAP = vwap[vwap.length - 1];
    const currentPrice = this.ohlcData[this.ohlcData.length - 1].close;

    if (patternId.includes('rsi') || currentRSI) {
      indicators.push({
        name: 'RSI',
        value: currentRSI,
        signal: currentRSI > 70 ? 'bearish' : currentRSI < 30 ? 'bullish' : 'neutral',
        description: `RSI at ${currentRSI.toFixed(1)} - ${currentRSI > 70 ? 'Overbought' : currentRSI < 30 ? 'Oversold' : 'Neutral'}`
      });
    }

    if (patternId.includes('macd') || currentMACD) {
      indicators.push({
        name: 'MACD',
        value: currentMACD,
        signal: currentMACD > 0 ? 'bullish' : 'bearish',
        description: `MACD at ${currentMACD.toFixed(4)} - ${currentMACD > 0 ? 'Above zero' : 'Below zero'}`
      });
    }

    if (patternId.includes('vwap') || currentVWAP) {
      indicators.push({
        name: 'VWAP',
        value: currentVWAP,
        signal: currentPrice > currentVWAP ? 'bullish' : 'bearish',
        description: `Price ${currentPrice > currentVWAP ? 'above' : 'below'} VWAP (${currentVWAP.toFixed(4)})`
      });
    }

    return indicators;
  }

  private getKeyLevels(entry: number, stopLoss: number, takeProfit: number): KeyLevel[] {
    return [
      { price: entry, type: 'entry', strength: 'strong' },
      { price: stopLoss, type: 'stop_loss', strength: 'strong' },
      { price: takeProfit, type: 'take_profit', strength: 'strong' }
    ];
  }

  private getVolumeSignal(): 'low' | 'medium' | 'high' {
    const current = this.ohlcData[this.ohlcData.length - 1];
    const avgVolume = this.getAverageVolume();
    
    if (current.volume > avgVolume * 1.5) return 'high';
    if (current.volume > avgVolume * 0.8) return 'medium';
    return 'low';
  }
}