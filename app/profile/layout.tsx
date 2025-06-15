import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile Settings - Algocipher Radar',
  description: 'Manage your Algocipher Radar account settings, security, and trading preferences',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}