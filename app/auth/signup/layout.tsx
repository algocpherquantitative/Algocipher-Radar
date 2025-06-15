import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Algocipher Radar',
  description: 'Create your Algocipher Radar account to access AI-powered trading signals and advanced market analysis',
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}