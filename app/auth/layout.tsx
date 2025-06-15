import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Algocipher Radar',
  description: 'Sign in to your Algocipher Radar account to access AI-powered trading signals',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}