"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ThemeToggle } from '@/components/theme-toggle';
import { useOAuth } from '@/hooks/use-oauth';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  Chrome,
  Github,
  Apple,
  Sparkles,
  TrendingUp,
  BarChart3,
  Activity,
  CheckCircle
} from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('demo@algocipher.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithGoogle, signInWithGitHub, signInWithApple } = useOAuth();

  // Check for success message from signup
  const successMessage = searchParams.get('message');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (email === 'demo@algocipher.com' && password === 'demo123') {
        // Store auth token
        localStorage.setItem('auth-token', 'mock-jwt-token');
        localStorage.setItem('user-data', JSON.stringify({
          id: '1',
          name: 'Demo User',
          email: 'demo@algocipher.com',
          initials: 'DU',
          plan: 'Pro'
        }));
        
        router.push('/');
      } else {
        setError('Invalid email or password. Try demo@algocipher.com / demo123');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl" />
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden lg:block space-y-8"
        >
          {/* Logo */}
          <div className="space-y-4">
            <div className="relative w-48 h-12">
              {theme === 'dark' ? (
                <Image
                  src="/Light with wordmark.svg"
                  alt="Algocipher Radar"
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <Image
                  src="/Dark with wordmark.svg"
                  alt="Algocipher Radar"
                  fill
                  className="object-contain"
                  priority
                />
              )}
            </div>
            <p className="text-xl text-muted-foreground">
              AI-Powered Trading Signal Platform
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Advanced Signal Detection
            </h2>
            
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-start space-x-3"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Real-time Pattern Recognition</h3>
                  <p className="text-sm text-muted-foreground">
                    AI identifies profitable trading patterns across multiple markets
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-start space-x-3"
              >
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Advanced Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive market analysis with confidence scoring
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-start space-x-3"
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Live Signal Feed</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant notifications for high-probability trading opportunities
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">87%</div>
              <div className="text-xs text-muted-foreground">Avg Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">1,247</div>
              <div className="text-xs text-muted-foreground">Signals Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">24/7</div>
              <div className="text-xs text-muted-foreground">Market Coverage</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Sign In Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="glassmorphism shadow-2xl border-border/50">
            <CardHeader className="space-y-4 text-center">
              {/* Mobile Logo */}
              <div className="lg:hidden">
                <div className="relative w-32 h-8 mx-auto mb-2">
                  {theme === 'dark' ? (
                    <Image
                      src="/Light with wordmark.svg"
                      alt="Algocipher Radar"
                      fill
                      className="object-contain"
                      priority
                    />
                  ) : (
                    <Image
                      src="/Dark with wordmark.svg"
                      alt="Algocipher Radar"
                      fill
                      className="object-contain"
                      priority
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-foreground">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Sign in to access your trading dashboard
                </CardDescription>
              </div>

              {/* Success Message */}
              {successMessage && (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}

              {/* Demo Credentials */}
              <div className="bg-muted/30 rounded-lg p-3 text-left">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Demo Account</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Email: demo@algocipher.com</div>
                  <div>Password: demo123</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {/* Social Login */}
              <div className="space-y-3">
                <Button
                  onClick={signInWithGoogle}
                  variant="outline"
                  className="w-full bg-muted/30 hover:bg-muted/50 border-border/50"
                  disabled={isLoading}
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Continue with Google
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={signInWithGitHub}
                    className="bg-muted/30 hover:bg-muted/50 border-border/50"
                    disabled={isLoading}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                  <Button
                    variant="outline"
                    onClick={signInWithApple}
                    className="bg-muted/30 hover:bg-muted/50 border-border/50"
                    disabled={isLoading}
                  >
                    <Apple className="w-4 h-4 mr-2" />
                    Apple
                  </Button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-muted/50 border-border/50 focus:bg-muted/70"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-muted/50 border-border/50 focus:bg-muted/70"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" className="text-sm p-0 h-auto">
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                  Sign up for free
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>
              By signing in, you agree to our{' '}
              <Button variant="link" className="p-0 h-auto text-xs">
                Terms of Service
              </Button>{' '}
              and{' '}
              <Button variant="link" className="p-0 h-auto text-xs">
                Privacy Policy
              </Button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}