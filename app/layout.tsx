"use client";

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { NotificationProvider } from '@/components/notifications/notification-provider';
import { CommandPaletteProvider } from '@/components/command-palette/command-palette-provider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Algocipher Radar - AI Trading Signal Platform</title>
        <meta name="description" content="Real-time AI-powered market pattern scanner and trading signal platform" />
        <meta name="keywords" content="trading, signals, AI, forex, crypto, stocks, technical analysis" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
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
      </body>
    </html>
  );
}