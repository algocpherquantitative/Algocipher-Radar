"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  LayoutDashboard,
  Activity,
  Bell,
  BookOpen,
  Star,
  Settings,
  TrendingUp,
  TrendingDown,
  Filter,
  Moon,
  Sun,
  MessageSquare,
  Target,
  BarChart3,
  Zap,
  Eye,
  EyeOff,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Save,
  HelpCircle,
  Keyboard,
  Mail,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onSignalAction?: (action: string, signalId?: string) => void;
  onFilterToggle?: (filter: string) => void;
  recentSignals?: Array<{ id: string; symbol: string; pattern: string }>;
}

interface CommandAction {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
  category: string;
  shortcut?: string;
  recent?: boolean;
}

export function CommandPalette({ 
  isOpen, 
  onClose, 
  onNavigate, 
  onSignalAction,
  onFilterToggle,
  recentSignals = []
}: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const { theme, setTheme } = useTheme();
  const [recentActions, setRecentActions] = useState<string[]>([]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const addToRecent = useCallback((actionId: string) => {
    setRecentActions(prev => {
      const filtered = prev.filter(id => id !== actionId);
      return [actionId, ...filtered].slice(0, 5);
    });
  }, []);

  const executeAction = useCallback((action: CommandAction) => {
    action.action();
    addToRecent(action.id);
    onClose();
  }, [addToRecent, onClose]);

  // Define all available commands
  const commands: CommandAction[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard',
      description: 'View main dashboard with overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      action: () => onNavigate('dashboard'),
      keywords: ['dashboard', 'home', 'main', 'overview'],
      category: 'Navigation',
      shortcut: '⌘1'
    },
    {
      id: 'nav-signals',
      label: 'Open Live Signals',
      description: 'View real-time signal feed',
      icon: <Activity className="w-4 h-4" />,
      action: () => onNavigate('signals'),
      keywords: ['signals', 'live', 'feed', 'patterns'],
      category: 'Navigation',
      shortcut: '⌘2'
    },
    {
      id: 'nav-alerts',
      label: 'View Alerts',
      description: 'Manage alert rules and notifications',
      icon: <Bell className="w-4 h-4" />,
      action: () => onNavigate('alerts'),
      keywords: ['alerts', 'notifications', 'rules'],
      category: 'Navigation',
      shortcut: '⌘3'
    },
    {
      id: 'nav-journal',
      label: 'Open Trading Journal',
      description: 'Review trade history and notes',
      icon: <BookOpen className="w-4 h-4" />,
      action: () => onNavigate('journal'),
      keywords: ['journal', 'trades', 'history', 'notes'],
      category: 'Navigation',
      shortcut: '⌘4'
    },
    {
      id: 'nav-watchlist',
      label: 'Open Watchlist',
      description: 'View saved symbols and patterns',
      icon: <Star className="w-4 h-4" />,
      action: () => onNavigate('watchlist'),
      keywords: ['watchlist', 'saved', 'favorites', 'symbols'],
      category: 'Navigation',
      shortcut: '⌘5'
    },

    // Market Search
    {
      id: 'search-eurusd',
      label: 'Search EUR/USD',
      description: 'View EUR/USD signals and charts',
      icon: <Search className="w-4 h-4" />,
      action: () => console.log('Search EUR/USD'),
      keywords: ['eurusd', 'eur', 'usd', 'forex', 'currency'],
      category: 'Market Search'
    },
    {
      id: 'search-btcusd',
      label: 'Search BTC/USD',
      description: 'View Bitcoin signals and patterns',
      icon: <Search className="w-4 h-4" />,
      action: () => console.log('Search BTC/USD'),
      keywords: ['btcusd', 'btc', 'bitcoin', 'crypto'],
      category: 'Market Search'
    },
    {
      id: 'search-gold',
      label: 'Search Gold (XAU/USD)',
      description: 'View Gold signals and analysis',
      icon: <Search className="w-4 h-4" />,
      action: () => console.log('Search Gold'),
      keywords: ['gold', 'xauusd', 'xau', 'precious', 'metals'],
      category: 'Market Search'
    },

    // Signal Actions
    {
      id: 'signal-save',
      label: 'Save Current Signal',
      description: 'Add signal to watchlist',
      icon: <Save className="w-4 h-4" />,
      action: () => onSignalAction?.('save'),
      keywords: ['save', 'bookmark', 'add', 'watchlist'],
      category: 'Signal Actions'
    },
    {
      id: 'signal-like',
      label: 'Rate Signal Positive',
      description: 'Mark signal as good',
      icon: <ThumbsUp className="w-4 h-4" />,
      action: () => onSignalAction?.('like'),
      keywords: ['like', 'positive', 'good', 'rate', 'thumbs'],
      category: 'Signal Actions'
    },
    {
      id: 'signal-dislike',
      label: 'Rate Signal Negative',
      description: 'Mark signal as poor',
      icon: <ThumbsDown className="w-4 h-4" />,
      action: () => onSignalAction?.('dislike'),
      keywords: ['dislike', 'negative', 'bad', 'rate', 'thumbs'],
      category: 'Signal Actions'
    },
    {
      id: 'signal-journal',
      label: 'Add to Journal',
      description: 'Create journal entry for signal',
      icon: <BookOpen className="w-4 h-4" />,
      action: () => onSignalAction?.('journal'),
      keywords: ['journal', 'note', 'add', 'entry', 'trade'],
      category: 'Signal Actions'
    },

    // Filters
    {
      id: 'filter-high-confidence',
      label: 'Show High Confidence Only',
      description: 'Filter signals with 80%+ confidence',
      icon: <Target className="w-4 h-4" />,
      action: () => onFilterToggle?.('high-confidence'),
      keywords: ['filter', 'confidence', 'high', '80', 'quality'],
      category: 'Filters'
    },
    {
      id: 'filter-bullish',
      label: 'Show Bullish Signals Only',
      description: 'Filter for upward trending signals',
      icon: <TrendingUp className="w-4 h-4" />,
      action: () => onFilterToggle?.('bullish'),
      keywords: ['filter', 'bullish', 'up', 'long', 'buy'],
      category: 'Filters'
    },
    {
      id: 'filter-bearish',
      label: 'Show Bearish Signals Only',
      description: 'Filter for downward trending signals',
      icon: <TrendingDown className="w-4 h-4" />,
      action: () => onFilterToggle?.('bearish'),
      keywords: ['filter', 'bearish', 'down', 'short', 'sell'],
      category: 'Filters'
    },
    {
      id: 'filter-candlestick',
      label: 'Show Candlestick Patterns',
      description: 'Filter for candlestick formations',
      icon: <BarChart3 className="w-4 h-4" />,
      action: () => onFilterToggle?.('candlestick'),
      keywords: ['filter', 'candlestick', 'candle', 'pattern', 'formation'],
      category: 'Filters'
    },
    {
      id: 'filter-clear',
      label: 'Clear All Filters',
      description: 'Reset all active filters',
      icon: <Filter className="w-4 h-4" />,
      action: () => onFilterToggle?.('clear'),
      keywords: ['clear', 'reset', 'all', 'filters', 'remove'],
      category: 'Filters'
    },

    // Settings & Theme
    {
      id: 'theme-toggle',
      label: 'Toggle Theme',
      description: `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`,
      icon: theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
      action: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
      keywords: ['theme', 'dark', 'light', 'mode', 'toggle'],
      category: 'Settings',
      shortcut: '⌘T'
    },
    {
      id: 'settings-alerts',
      label: 'Configure Alerts',
      description: 'Set up email and Telegram notifications',
      icon: <Bell className="w-4 h-4" />,
      action: () => onNavigate('alerts'),
      keywords: ['settings', 'alerts', 'notifications', 'email', 'telegram'],
      category: 'Settings'
    },
    {
      id: 'settings-main',
      label: 'Open Settings',
      description: 'Access main settings panel',
      icon: <Settings className="w-4 h-4" />,
      action: () => console.log('Open settings'),
      keywords: ['settings', 'preferences', 'config', 'options'],
      category: 'Settings',
      shortcut: '⌘,'
    },

    // Help & Documentation
    {
      id: 'help-shortcuts',
      label: 'Show Keyboard Shortcuts',
      description: 'View all available shortcuts',
      icon: <Keyboard className="w-4 h-4" />,
      action: () => console.log('Show shortcuts'),
      keywords: ['help', 'shortcuts', 'keyboard', 'hotkeys'],
      category: 'Help'
    },
    {
      id: 'help-patterns',
      label: 'Learn About Patterns',
      description: 'Educational content on trading patterns',
      icon: <HelpCircle className="w-4 h-4" />,
      action: () => console.log('Pattern education'),
      keywords: ['help', 'learn', 'patterns', 'education', 'guide'],
      category: 'Help'
    },
    {
      id: 'help-support',
      label: 'Contact Support',
      description: 'Get help from our team',
      icon: <Mail className="w-4 h-4" />,
      action: () => console.log('Contact support'),
      keywords: ['help', 'support', 'contact', 'assistance'],
      category: 'Help'
    }
  ];

  // Add recent signals as commands
  const recentSignalCommands: CommandAction[] = recentSignals.map(signal => ({
    id: `recent-${signal.id}`,
    label: `View ${signal.symbol} Signal`,
    description: signal.pattern,
    icon: <Clock className="w-4 h-4" />,
    action: () => console.log(`View signal ${signal.id}`),
    keywords: [signal.symbol.toLowerCase(), signal.pattern.toLowerCase(), 'recent', 'signal'],
    category: 'Recent Signals',
    recent: true
  }));

  const allCommands = [...commands, ...recentSignalCommands];

  // Filter commands based on search
  const filteredCommands = search
    ? allCommands.filter(cmd =>
        cmd.label.toLowerCase().includes(search.toLowerCase()) ||
        cmd.description?.toLowerCase().includes(search.toLowerCase()) ||
        cmd.keywords.some(keyword => keyword.includes(search.toLowerCase()))
      )
    : allCommands;

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandAction[]>);

  // Show recent actions if no search
  const showRecent = !search && recentActions.length > 0;
  const recentCommands = showRecent 
    ? allCommands.filter(cmd => recentActions.includes(cmd.id))
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-2xl bg-background/95 backdrop-blur-sm border-border/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Command className="rounded-lg border-0 shadow-2xl">
            <div className="flex items-center border-b border-border/50 px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <CommandInput
                placeholder="Type a command or search..."
                value={search}
                onValueChange={setSearch}
                className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0"
              />
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  ESC
                </kbd>
              </div>
            </div>

            <CommandList className="max-h-96 overflow-y-auto">
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                <div className="flex flex-col items-center space-y-2">
                  <Search className="w-8 h-8 text-muted-foreground/50" />
                  <p>No commands found</p>
                  <p className="text-xs">Try searching for signals, navigation, or settings</p>
                </div>
              </CommandEmpty>

              {/* Recent Actions */}
              {showRecent && recentCommands.length > 0 && (
                <CommandGroup heading="Recent Actions">
                  {recentCommands.map((command) => (
                    <CommandItem
                      key={command.id}
                      onSelect={() => executeAction(command)}
                      className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent/50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-muted-foreground">
                          {command.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground">
                            {command.label}
                          </div>
                          {command.description && (
                            <div className="text-xs text-muted-foreground">
                              {command.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          Recent
                        </Badge>
                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* Suggested Actions (when no search) */}
              {!search && (
                <CommandGroup heading="Suggested">
                  <CommandItem
                    onSelect={() => executeAction(commands.find(c => c.id === 'nav-signals')!)}
                    className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent/50"
                  >
                    <div className="flex items-center space-x-3">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          View Latest Signals
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Check new pattern detections
                        </div>
                      </div>
                    </div>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                      ⌘2
                    </kbd>
                  </CommandItem>
                </CommandGroup>
              )}

              {/* Grouped Commands */}
              {Object.entries(groupedCommands).map(([category, commands]) => (
                <CommandGroup key={category} heading={category}>
                  {commands.map((command) => (
                    <CommandItem
                      key={command.id}
                      onSelect={() => executeAction(command)}
                      className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent/50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-muted-foreground">
                          {command.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground">
                            {command.label}
                          </div>
                          {command.description && (
                            <div className="text-xs text-muted-foreground">
                              {command.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {command.recent && (
                          <Badge variant="outline" className="text-xs">
                            Recent
                          </Badge>
                        )}
                        {command.shortcut && (
                          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                            {command.shortcut}
                          </kbd>
                        )}
                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border/50 px-3 py-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1 font-mono text-[10px] font-medium text-muted-foreground">
                    ↑↓
                  </kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1 font-mono text-[10px] font-medium text-muted-foreground">
                    ⏎
                  </kbd>
                  <span>Select</span>
                </div>
              </div>
              <div className="text-muted-foreground/70">
                {filteredCommands.length} commands
              </div>
            </div>
          </Command>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}