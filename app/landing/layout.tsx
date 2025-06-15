import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Algocipher Radar - AI-Powered Trading Signal Platform',
  description: 'Discover profitable trading opportunities with advanced AI pattern recognition. Get real-time signals across Forex, Crypto, and Stock markets with institutional-grade accuracy.',
  keywords: 'AI trading, trading signals, pattern recognition, forex, crypto, stocks, algorithmic trading, technical analysis',
  openGraph: {
    title: 'Algocipher Radar - AI-Powered Trading Signal Platform',
    description: 'Discover profitable trading opportunities with advanced AI pattern recognition.',
    type: 'website',
    url: 'https://algocipher-radar.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Algocipher Radar - AI-Powered Trading Signal Platform',
    description: 'Discover profitable trading opportunities with advanced AI pattern recognition.',
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}