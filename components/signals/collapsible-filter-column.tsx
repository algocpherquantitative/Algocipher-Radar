"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface CollapsibleFilterColumnProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  marketFilter: string;
  setMarketFilter: (v: string) => void;
  confidenceFilter: string;
  setConfidenceFilter: (v: string) => void;
  directionFilter: string;
  setDirectionFilter: (v: string) => void;
  timeframeFilter: string;
  setTimeframeFilter: (v: string) => void;
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function CollapsibleFilterColumn({
  searchTerm, setSearchTerm,
  marketFilter, setMarketFilter,
  confidenceFilter, setConfidenceFilter,
  directionFilter, setDirectionFilter,
  timeframeFilter, setTimeframeFilter,
  categoryFilter, setCategoryFilter,
  onCollapseChange
}: CollapsibleFilterColumnProps) {
  const [open, setOpen] = useState(true);

  const handleToggle = () => {
    const newState = !open;
    setOpen(newState);
    onCollapseChange?.(newState);
  };

  if (!open) {
    return (
      <div className="flex flex-col items-center justify-start w-8 bg-card/80 border-r border-border/50 h-full pt-4">
        <Button variant="ghost" size="icon" onClick={handleToggle} className="mb-2">
          <ChevronRight className="w-5 h-5" />
        </Button>
        <Filter className="w-5 h-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <aside className="w-64 bg-card/80 border-r border-border/50 h-full flex flex-col p-4 space-y-4 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-foreground flex items-center"><Filter className="w-4 h-4 mr-2" /> Filters</span>
        <Button variant="ghost" size="icon" onClick={handleToggle}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search signals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-muted/50 border-border/50 h-8 text-sm"
        />
      </div>
      <Select value={marketFilter} onValueChange={setMarketFilter}>
        <SelectTrigger className="bg-muted/50 border-border/50 h-8 text-sm">
          <SelectValue placeholder="Market" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Markets</SelectItem>
          <SelectItem value="forex">Forex</SelectItem>
          <SelectItem value="crypto">Crypto</SelectItem>
          <SelectItem value="stocks">Stocks</SelectItem>
          <SelectItem value="indices">Indices</SelectItem>
        </SelectContent>
      </Select>
      <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
        <SelectTrigger className="bg-muted/50 border-border/50 h-8 text-sm">
          <SelectValue placeholder="Confidence" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="high">High (80%+)</SelectItem>
          <SelectItem value="medium">Medium (65-79%)</SelectItem>
          <SelectItem value="low">Low (&lt;65%)</SelectItem>
        </SelectContent>
      </Select>
      <Select value={directionFilter} onValueChange={setDirectionFilter}>
        <SelectTrigger className="bg-muted/50 border-border/50 h-8 text-sm">
          <SelectValue placeholder="Direction" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Directions</SelectItem>
          <SelectItem value="bullish">Bullish</SelectItem>
          <SelectItem value="bearish">Bearish</SelectItem>
          <SelectItem value="neutral">Neutral</SelectItem>
        </SelectContent>
      </Select>
      <Select value={timeframeFilter} onValueChange={setTimeframeFilter}>
        <SelectTrigger className="bg-muted/50 border-border/50 h-8 text-sm">
          <SelectValue placeholder="Timeframe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Timeframes</SelectItem>
          <SelectItem value="5M">5 Minutes</SelectItem>
          <SelectItem value="15M">15 Minutes</SelectItem>
          <SelectItem value="1H">1 Hour</SelectItem>
          <SelectItem value="4H">4 Hours</SelectItem>
          <SelectItem value="1D">1 Day</SelectItem>
          <SelectItem value="1W">1 Week</SelectItem>
        </SelectContent>
      </Select>
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="bg-muted/50 border-border/50 h-8 text-sm">
          <SelectValue placeholder="Signal Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="price_action">Price Action</SelectItem>
          <SelectItem value="candlestick">Candlestick</SelectItem>
          <SelectItem value="chart_pattern">Chart Pattern</SelectItem>
          <SelectItem value="indicator">Indicator</SelectItem>
          <SelectItem value="support_resistance">Support/Resistance</SelectItem>
        </SelectContent>
      </Select>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => {
          setSearchTerm('');
          setMarketFilter('all');
          setConfidenceFilter('all');
          setDirectionFilter('all');
          setTimeframeFilter('all');
          setCategoryFilter('all');
        }}
        className="h-8 text-sm mt-2"
      >
        Clear Filters
      </Button>
    </aside>
  );
} 