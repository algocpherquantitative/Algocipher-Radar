"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  buildGoogleAuthUrl, 
  buildGitHubAuthUrl, 
  buildAppleAuthUrl,
  storeOAuthState,
  generateRandomState
} from '@/lib/auth-config';

interface UseOAuthReturn {
  signInWithGoogle: () => void;
  signInWithGitHub: () => void;
  signInWithApple: () => void;
  isLoading: boolean;
  error: string | null;
}

export function useOAuth(): UseOAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signInWithGoogle = () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const state = generateRandomState();
      storeOAuthState(state);
      
      const authUrl = buildGoogleAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError('Failed to initiate Google sign in');
      setIsLoading(false);
    }
  };

  const signInWithGitHub = () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const state = generateRandomState();
      storeOAuthState(state);
      
      const authUrl = buildGitHubAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError('Failed to initiate GitHub sign in');
      setIsLoading(false);
    }
  };

  const signInWithApple = () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const state = generateRandomState();
      storeOAuthState(state);
      
      const authUrl = buildAppleAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError('Failed to initiate Apple sign in');
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    signInWithGitHub,
    signInWithApple,
    isLoading,
    error
  };
}