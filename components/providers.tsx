"use client";

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { NotificationProvider } from '@/components/notifications/notification-provider';
import { CommandPaletteProvider } from '@/components/command-palette/command-palette-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <NotificationProvider>
        <CommandPaletteProvider
          onNavigate={(tab: string) => {
            // Handle navigation - this will be overridden by page-specific providers
            console.log('Global navigation:', tab);
          }}
          onSignalAction={(action: string, signalId?: string) => {
            console.log('Global signal action:', action, signalId);
          }}
          onFilterToggle={(filter: string) => {
            console.log('Global filter toggle:', filter);
          }}
          recentSignals={[]}
        >
          {children}
          <Toaster 
            theme="dark"
            position="top-right"
            expand={true}
            richColors
            closeButton
          />
        </CommandPaletteProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
} 