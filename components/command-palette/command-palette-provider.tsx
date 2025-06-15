"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CommandPalette } from './command-palette';

interface CommandPaletteContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextType | undefined>(undefined);

interface CommandPaletteProviderProps {
  children: ReactNode;
  onNavigate?: (tab: string) => void;
  onSignalAction?: (action: string, signalId?: string) => void;
  onFilterToggle?: (filter: string) => void;
  recentSignals?: Array<{ id: string; symbol: string; pattern: string }>;
}

export function CommandPaletteProvider({ 
  children, 
  onNavigate = () => {},
  onSignalAction = () => {},
  onFilterToggle = () => {},
  recentSignals = []
}: CommandPaletteProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <CommandPaletteContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
      <CommandPalette
        isOpen={isOpen}
        onClose={close}
        onNavigate={onNavigate}
        onSignalAction={onSignalAction}
        onFilterToggle={onFilterToggle}
        recentSignals={recentSignals}
      />
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext);
  if (context === undefined) {
    // Return a default implementation instead of throwing an error
    return {
      isOpen: false,
      open: () => {},
      close: () => {},
      toggle: () => {}
    };
  }
  return context;
}