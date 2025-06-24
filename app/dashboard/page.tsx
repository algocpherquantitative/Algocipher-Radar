"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/dashboard/top-bar';
import { SignalFeed } from '@/components/signals/signal-feed';
import { MarketOverview } from '@/components/market/market-overview';
import { EnhancedTradingChart } from '@/components/charts/enhanced-trading-chart';
import { AlertCenter } from '@/components/alerts/alert-center';
import { TradingJournal } from '@/components/trading/trading-journal';
import { CommandPaletteProvider } from '@/components/command-palette/command-palette-provider';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { TrendingUp, Zap, Activity, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CollapsibleFilterColumn } from '@/components/signals/collapsible-filter-column';
import { generateMockSignals } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import type { DetectedSignal } from '@/lib/signal-types';

export default function DashboardPage() {
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const router = useRouter();

  // Filter state (lifted up)
  const [searchTerm, setSearchTerm] = useState('');
  const [marketFilter, setMarketFilter] = useState('all');
  const [confidenceFilter, setConfidenceFilter] = useState('all');
  const [directionFilter, setDirectionFilter] = useState('all');
  const [timeframeFilter, setTimeframeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Signals state for the signals tab
  const [signals, setSignals] = useState<DetectedSignal[]>(generateMockSignals());

  // Mock recent signals for command palette
  const recentSignals = [
    { id: 'signal-1', symbol: 'EUR/USD', pattern: 'Head and Shoulders' },
    { id: 'signal-2', symbol: 'BTC/USD', pattern: 'Triangle Breakout' },
    { id: 'signal-3', symbol: 'GOLD', pattern: 'Support Bounce' },
  ];

  useEffect(() => {
    setMounted(true);
    // Check authentication
    const checkAuth = () => {
      const token = localStorage.getItem('auth-token');
      const userData = localStorage.getItem('user-data');
      
      if (!token || !userData) {
        router.replace('/auth/signin');
        return;
      }
      
      // Enhanced loading simulation
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    // Simulate real-time signal updates (copy from SignalFeed)
    const interval = setInterval(() => {
      setSignals((prev: DetectedSignal[]) => {
        const newSignals = [...prev];
        // Randomly update some signals
        const randomIndex = Math.floor(Math.random() * newSignals.length);
        if (newSignals[randomIndex]) {
          const original = newSignals[randomIndex];
          newSignals[randomIndex] = {
            ...original,
            confidence: Math.max(60, Math.min(95, (original as any).confidence + (Math.random() - 0.5) * 10)),
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

  // Filtering logic for signals tab
  const filteredSignals = signals.filter(signal => {
    if (searchTerm && !(
      (signal as any).symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((signal as any).patternId && (signal as any).patternId.toLowerCase().includes(searchTerm.toLowerCase()))
    )) return false;
    if (marketFilter !== 'all' && (signal as any).market !== marketFilter) return false;
    if (confidenceFilter !== 'all') {
      const minConfidence = confidenceFilter === 'high' ? 80 : confidenceFilter === 'medium' ? 65 : 0;
      const maxConfidence = confidenceFilter === 'high' ? 100 : confidenceFilter === 'medium' ? 79 : 64;
      if ((signal as any).confidence < minConfidence || (signal as any).confidence > maxConfidence) return false;
    }
    if (categoryFilter !== 'all') {
      const pattern = (signal as any).patternId || '';
      switch (categoryFilter) {
        case 'price_action':
          if (!(pattern.includes('breakout') || pattern.includes('support') || pattern.includes('gap'))) return false;
          break;
        case 'candlestick':
          if (!(pattern.includes('engulfing') || pattern.includes('hammer') || pattern.includes('star'))) return false;
          break;
        case 'chart_pattern':
          if (!(pattern.includes('head') || pattern.includes('double') || pattern.includes('triangle') || pattern.includes('flag'))) return false;
          break;
        case 'indicator':
          if (!(pattern.includes('rsi') || pattern.includes('macd') || pattern.includes('cross') || pattern.includes('vwap'))) return false;
          break;
        case 'support_resistance':
          if (!(pattern.includes('fib') || pattern.includes('retest') || pattern.includes('psychological'))) return false;
          break;
        default:
          break;
      }
    }
    if (directionFilter !== 'all' && (signal as any).direction !== directionFilter) return false;
    if (timeframeFilter !== 'all' && (signal as any).timeframe !== timeframeFilter) return false;
    return true;
  });

  const avgConfidence = filteredSignals.length > 0 ? Math.round(filteredSignals.reduce((sum, s) => sum + (s as any).confidence, 0) / filteredSignals.length) : 0;
  const highConfidenceCount = filteredSignals.filter(s => (s as any).confidence >= 80).length;

  const handleSignalAction = (action: string, signalId?: string) => {
    console.log(`Signal action: ${action}`, signalId);
    // Implement signal actions here
    switch (action) {
      case 'save':
        console.log('Saving signal to watchlist');
        break;
      case 'like':
        console.log('Rating signal positive');
        break;
      case 'dislike':
        console.log('Rating signal negative');
        break;
      case 'journal':
        console.log('Adding signal to journal');
        setActiveTab('journal');
        break;
    }
  };

  const handleFilterToggle = (filter: string) => {
    console.log(`Toggling filter: ${filter}`);
    // Implement filter logic here
    switch (filter) {
      case 'high-confidence':
        console.log('Showing high confidence signals only');
        break;
      case 'bullish':
        console.log('Showing bullish signals only');
        break;
      case 'bearish':
        console.log('Showing bearish signals only');
        break;
      case 'candlestick':
        console.log('Showing candlestick patterns only');
        break;
      case 'clear':
        console.log('Clearing all filters');
        break;
    }
  };

  const handleFilterCollapse = (collapsed: boolean) => {
    setIsFilterCollapsed(collapsed);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          {/* Brand Text with Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-3"
          >
            <div className="relative w-64 h-16 mx-auto">
              {mounted && resolvedTheme === 'dark' ? (
                <Image
                  src="/Light with wordmark.svg"
                  alt="Algocipher Radar"
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <Image
                  src="/Dark with wordmark.svg"
                  alt="Algocipher Radar"
                  fill
                  className="object-contain"
                  priority
                />
              )}
            </div>
            <p className="text-muted-foreground text-lg">AI Signal Detection Platform</p>
          </motion.div>

          {/* Loading Progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <span>Loading trading signals...</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-primary to-green-400"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="h-full flex flex-col space-y-4">
            {/* Compact Market Overview */}
            <div className="flex-shrink-0">
              <MarketOverview />
            </div>
            {/* Main Trading Interface - Full Height */}
            <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border border-border/50 bg-card/20 backdrop-blur-sm">
              {/* Filter and Signals Panel Group */}
              <ResizablePanel defaultSize={isFilterCollapsed ? 8 : 50} minSize={8}>
                <div className="h-full flex">
                    <CollapsibleFilterColumn
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      marketFilter={marketFilter}
                      setMarketFilter={setMarketFilter}
                      confidenceFilter={confidenceFilter}
                      setConfidenceFilter={setConfidenceFilter}
                      directionFilter={directionFilter}
                      setDirectionFilter={setDirectionFilter}
                      timeframeFilter={timeframeFilter}
                      setTimeframeFilter={setTimeframeFilter}
                      categoryFilter={categoryFilter}
                      setCategoryFilter={setCategoryFilter}
                      onCollapseChange={handleFilterCollapse}
                    />
                  {/* Signals Panel */}
                  <div className="flex-1 h-full p-4 flex flex-col">
                      <div className="mb-3 flex-shrink-0">
                        <h2 className="text-lg font-semibold text-foreground flex items-center">
                          <Zap className="w-5 h-5 mr-2 text-primary" />
                          Live Trading Signals
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          AI-detected patterns with confidence scoring
                        </p>
                      </div>
                      <div className="flex-1 min-h-0">
                        <SignalFeed
                          onSignalSelect={setSelectedSignal}
                          hideFilters
                          searchTerm={searchTerm}
                          marketFilter={marketFilter}
                          confidenceFilter={confidenceFilter}
                          directionFilter={directionFilter}
                          timeframeFilter={timeframeFilter}
                          categoryFilter={categoryFilter}
                        />
                      </div>
                    </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              {/* Chart Panel */}
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full p-4">
                  <EnhancedTradingChart selectedSignal={selectedSignal} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        );
      
      case 'signals':
        return (
          <div className="h-full flex flex-col space-y-4">
            {/* Header above the main container */}
            <div className="px-6 pt-6 pb-2">
              <div className="mb-1 flex items-center">
                <Activity className="w-7 h-7 mr-2 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Live Signals</h1>
              </div>
              <div className="text-muted-foreground text-lg mb-3">Real-time AI-powered pattern detection across global markets</div>
              {/* Stats badges */}
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-green-400 border-green-400/30">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {filteredSignals.length} Signals
                </Badge>
                <Badge variant="outline" className={
                  avgConfidence >= 80
                    ? "text-green-400 border-green-400/30"
                    : avgConfidence >= 65
                    ? "text-yellow-400 border-yellow-400/30"
                    : "text-red-400 border-red-400/30"
                }>
                  {Math.round(avgConfidence)}% Avg Confidence
                </Badge>
                <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
                  {highConfidenceCount} High Confidence
                </Badge>
              </div>
            </div>
            {/* Main Trading Interface - Full Height for Live Signals */}
            <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border border-border/50 bg-card/20 backdrop-blur-sm">
              {/* Filter and Signals Panel Group */}
              <ResizablePanel defaultSize={isFilterCollapsed ? 8 : 50} minSize={8}>
                <div className="h-full flex">
                <CollapsibleFilterColumn
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  marketFilter={marketFilter}
                  setMarketFilter={setMarketFilter}
                  confidenceFilter={confidenceFilter}
                  setConfidenceFilter={setConfidenceFilter}
                  directionFilter={directionFilter}
                  setDirectionFilter={setDirectionFilter}
                  timeframeFilter={timeframeFilter}
                  setTimeframeFilter={setTimeframeFilter}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                    onCollapseChange={handleFilterCollapse}
                />
              {/* Signals Panel */}
                  <div className="flex-1 h-full p-4 flex flex-col">
                    {/* Remove the header from here */}
                  <div className="flex-1 min-h-0">
                    <SignalFeed
                      onSignalSelect={setSelectedSignal}
                      hideFilters
                      searchTerm={searchTerm}
                      marketFilter={marketFilter}
                      confidenceFilter={confidenceFilter}
                      directionFilter={directionFilter}
                      timeframeFilter={timeframeFilter}
                      categoryFilter={categoryFilter}
                        signals={filteredSignals}
                    />
                    </div>
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              {/* Chart Panel */}
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full p-4">
                  <EnhancedTradingChart selectedSignal={selectedSignal} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        );
      
      case 'alerts':
        return (
          <div className="h-full">
            <AlertCenter />
          </div>
        );
      
      case 'journal':
        return (
          <div className="h-full">
            <TradingJournal />
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Feature Coming Soon</h3>
                <p className="text-muted-foreground text-sm">
                  This feature is under development and will be available soon.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <CommandPaletteProvider
      onNavigate={setActiveTab}
      onSignalAction={handleSignalAction}
      onFilterToggle={handleFilterToggle}
      recentSignals={recentSignals}
    >
      <div className="h-screen bg-background flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 flex flex-col min-w-0 h-screen">
          <div className="flex-shrink-0">
            <TopBar />
          </div>
          
          <main className="flex-1 p-6 overflow-hidden">
            {renderMainContent()}
          </main>
        </div>
      </div>
    </CommandPaletteProvider>
  );
}