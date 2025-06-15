import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Google Sign In - Algocipher Radar',
  description: 'Completing Google authentication for Algocipher Radar',
};

export default function GoogleCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}