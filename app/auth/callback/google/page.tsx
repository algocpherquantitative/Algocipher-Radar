"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { verifyOAuthState } from '@/lib/auth-config';

function GoogleCallbackContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`Google OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received from Google');
        }

        if (!state || !verifyOAuthState(state)) {
          throw new Error('Invalid OAuth state parameter');
        }

        // Simulate Google OAuth token exchange
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock successful Google authentication
        const mockGoogleUser = {
          id: 'google-' + Date.now(),
          name: 'Google User',
          email: 'user@gmail.com',
          initials: 'GU',
          plan: 'Free',
          provider: 'google',
          avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
        };

        // Store user data
        localStorage.setItem('auth-token', 'google-oauth-token-' + Date.now());
        localStorage.setItem('user-data', JSON.stringify(mockGoogleUser));

        setStatus('success');
        setMessage('Successfully signed in with Google! Redirecting to dashboard...');

        // Redirect to dashboard after success
        setTimeout(() => {
          router.push('/');
        }, 2000);

      } catch (error) {
        console.error('Google OAuth callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    };

    handleGoogleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glassmorphism shadow-2xl border-border/50">
          <CardContent className="p-8 text-center space-y-6">
            {status === 'loading' && (
              <>
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Completing Google Sign In
                  </h2>
                  <p className="text-muted-foreground">
                    Please wait while we verify your Google account...
                  </p>
                </div>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    {message}
                  </AlertDescription>
                </Alert>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Button 
                    onClick={() => router.push('/auth/signin')}
                    className="w-full"
                  >
                    Back to Sign In
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/auth/signup')}
                    className="w-full"
                  >
                    Try Sign Up Instead
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}