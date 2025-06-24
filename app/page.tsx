"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from './landing/page';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Check authentication status
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('auth-token');
        const userData = localStorage.getItem('user-data');
        
        if (token && userData) {
          setIsAuthenticated(true);
          router.replace('/dashboard');
        } else {
          setIsAuthenticated(false);
          router.replace('/auth/signin');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        router.replace('/auth/signin');
      }
    };

    checkAuth();
  }, [router, mounted]);

  // Show loading state while checking authentication or before mounting
  if (!mounted || isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // This shouldn't be reached due to the redirect above, but just in case
  return null;
}