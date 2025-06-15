"use client";

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowRight, TrendingUp, Zap, Shield, BarChart3, Activity, Star, CheckCircle, Play, Users, Globe, Target, Sparkles, ChevronDown, Menu, X, Brain, Cpu, Eye, Layers, Gauge, Clock, DollarSign, TrendingDown, Triangle, Hammer, Candy as CandleIcon, Mountain, Flag, RefreshCw, Hash, Cross, ArrowUp } from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [currentMetric, setCurrentMetric] = useState(0);
  const { theme } = useTheme();
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroY = useTransform(scrollYProgress, [0, 0.3], ['0%', '30%']);

  // Performance metrics carousel
  const performanceMetrics = [
    { label: "Signal Accuracy", value: "87.3%", change: "+2.1%", trend: "up" },
    { label: "Avg Monthly Return", value: "24.7%", change: "+5.2%", trend: "up" },
    { label: "Win Rate", value: "78.9%", change: "+1.8%", trend: "up" },
    { label: "Risk-Adjusted Return", value: "2.34", change: "+0.15", trend: "up" },
    { label: "Max Drawdown", value: "8.2%", change: "-1.3%", trend: "down" },
    { label: "Sharpe Ratio", value: "1.89", change: "+0.12", trend: "up" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % performanceMetrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [performanceMetrics.length]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'patterns', 'performance', 'how-it-works', 'pricing', 'testimonials'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pattern catalog data
  const patternCategories = [
    {
      title: "Price Action",
      count: 15,
      icon: <Zap className="w-6 h-6" />,
      patterns: [
        { name: "Resistance Breakout", icon: <ArrowUp className="w-4 h-4" />, accuracy: "89%" },
        { name: "Support Bounce", icon: <TrendingUp className="w-4 h-4" />, accuracy: "84%" },
        { name: "Fair Value Gap", icon: <Layers className="w-4 h-4" />, accuracy: "76%" }
      ],
      gradient: "from-yellow-400/20 to-orange-500/20"
    },
    {
      title: "Candlestick",
      count: 12,
      icon: <CandleIcon className="w-6 h-6" />,
      patterns: [
        { name: "Bullish Engulfing", icon: <CandleIcon className="w-4 h-4" />, accuracy: "82%" },
        { name: "Hammer", icon: <Hammer className="w-4 h-4" />, accuracy: "79%" },
        { name: "Shooting Star", icon: <Star className="w-4 h-4" />, accuracy: "77%" }
      ],
      gradient: "from-green-400/20 to-emerald-500/20"
    },
    {
      title: "Chart Patterns",
      count: 18,
      icon: <Activity className="w-6 h-6" />,
      patterns: [
        { name: "Head & Shoulders", icon: <Mountain className="w-4 h-4" />, accuracy: "91%" },
        { name: "Triangle", icon: <Triangle className="w-4 h-4" />, accuracy: "85%" },
        { name: "Flag Pattern", icon: <Flag className="w-4 h-4" />, accuracy: "83%" }
      ],
      gradient: "from-blue-400/20 to-purple-500/20"
    },
    {
      title: "Indicators",
      count: 10,
      icon: <BarChart3 className="w-6 h-6" />,
      patterns: [
        { name: "RSI Divergence", icon: <TrendingDown className="w-4 h-4" />, accuracy: "73%" },
        { name: "MACD Cross", icon: <Cross className="w-4 h-4" />, accuracy: "68%" },
        { name: "Golden Cross", icon: <Cross className="w-4 h-4" />, accuracy: "89%" }
      ],
      gradient: "from-pink-400/20 to-red-500/20"
    }
  ];

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Pattern Recognition",
      description: "Advanced neural networks identify profitable patterns across multiple timeframes with institutional-grade accuracy.",
      stats: "87% accuracy",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Detection",
      description: "Lightning-fast signal generation with sub-second latency across global markets 24/7.",
      stats: "<100ms latency",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Risk Management",
      description: "Automated risk controls with dynamic position sizing and intelligent stop-loss placement.",
      stats: "Max 2% risk",
      gradient: "from-green-400 to-emerald-500"
    },
    {
      icon: <Gauge className="w-8 h-8" />,
      title: "Performance Analytics",
      description: "Comprehensive tracking with detailed performance metrics and portfolio optimization insights.",
      stats: "24.7% avg return",
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Market Coverage",
      description: "Trade across Forex, Crypto, Stocks, and Commodities with unified signal detection algorithms.",
      stats: "4 asset classes",
      gradient: "from-indigo-400 to-purple-500"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Market Surveillance",
      description: "Continuous monitoring of market conditions with adaptive algorithms that evolve with market dynamics.",
      stats: "24/7 monitoring",
      gradient: "from-teal-400 to-blue-500"
    }
  ];

  const stats = [
    { value: "87.3%", label: "Signal Accuracy", icon: <Target className="w-6 h-6" />, trend: "+2.1%" },
    { value: "50K+", label: "Active Traders", icon: <Users className="w-6 h-6" />, trend: "+15%" },
    { value: "24/7", label: "Market Coverage", icon: <Globe className="w-6 h-6" />, trend: "100%" },
    { value: "1.2M+", label: "Signals Generated", icon: <TrendingUp className="w-6 h-6" />, trend: "+23%" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Quantitative Trader",
      company: "Goldman Sachs",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      content: "The AI pattern recognition is phenomenal. We've integrated Algocipher into our institutional strategies with remarkable results. The accuracy is consistently above our internal benchmarks.",
      rating: 5,
      metrics: { return: "+34.2%", period: "6 months" }
    },
    {
      name: "Marcus Rodriguez",
      role: "Portfolio Manager",
      company: "Bridgewater Associates",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      content: "Algocipher's risk management features are game-changing. The automated position sizing and dynamic stop-losses have significantly improved our risk-adjusted returns.",
      rating: 5,
      metrics: { return: "+28.7%", period: "8 months" }
    },
    {
      name: "Emily Watson",
      role: "Algorithmic Trader",
      company: "Two Sigma",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      content: "The multi-market coverage and real-time detection capabilities are unmatched. We're seeing consistent alpha generation across all asset classes we trade.",
      rating: 5,
      metrics: { return: "+41.5%", period: "12 months" }
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      description: "Perfect for learning and testing",
      features: [
        "10 signals per day",
        "Basic pattern recognition",
        "Email notifications",
        "Community access",
        "Mobile app access",
        "Basic analytics"
      ],
      cta: "Start Free",
      popular: false,
      limits: "Limited to 3 markets"
    },
    {
      name: "Professional",
      price: "$49",
      period: "month",
      description: "For serious traders and small funds",
      features: [
        "Unlimited signals",
        "Advanced AI patterns",
        "Real-time alerts",
        "Multi-channel notifications",
        "Advanced analytics",
        "Risk management tools",
        "API access",
        "Priority support"
      ],
      cta: "Start 14-Day Trial",
      popular: true,
      limits: "All markets included"
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "month",
      description: "For institutions and large funds",
      features: [
        "Everything in Professional",
        "Custom AI models",
        "White-label solution",
        "Dedicated infrastructure",
        "Custom integrations",
        "24/7 phone support",
        "On-premise deployment",
        "SLA guarantees"
      ],
      cta: "Contact Sales",
      popular: false,
      limits: "Custom solutions available"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="relative w-32 h-8">
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
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Patterns', 'Performance', 'Pricing'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="hidden md:flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/auth/signin')}
                  className="text-sm"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push('/auth/signup')}
                  className="text-sm bg-primary hover:bg-primary/90"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50"
            >
              <div className="px-4 py-6 space-y-4">
                {['Features', 'Patterns', 'Performance', 'Pricing'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-4 space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/auth/signin')}
                    className="w-full"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => router.push('/auth/signup')}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section with Grid */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-30">
          <motion.div
            style={{ y: backgroundY }}
            className="absolute inset-0"
          >
            {/* Grid Pattern */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(var(--primary-rgb, 59, 130, 246), 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(var(--primary-rgb, 59, 130, 246), 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }} />
            
            {/* Floating Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </motion.div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ y: heroY }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Trading Intelligence</span>
                <Badge variant="secondary" className="text-xs">Live</Badge>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              >
                <span className="bg-gradient-to-r from-foreground via-primary to-green-400 bg-clip-text text-transparent">
                  Trade with
                </span>
                <br />
                <span className="text-foreground">AI Precision</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg"
              >
                Advanced pattern recognition across global markets. Get institutional-grade signals with 87% accuracy and real-time risk management.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-8"
              >
                <Button
                  size="lg"
                  onClick={() => router.push('/auth/signup')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:bg-muted/50 transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex items-center space-x-6 text-sm text-muted-foreground"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>14-day free trial</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Performance Metrics Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              {/* Main Performance Card */}
              <div className="relative">
                <Card className="glassmorphism border-primary/20 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">Live Performance</h3>
                        <p className="text-sm text-muted-foreground">Real-time trading metrics</p>
                      </div>
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    </div>

                    {/* Animated Metric Display */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentMetric}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-6"
                      >
                        <div className="text-4xl font-bold text-primary mb-2">
                          {performanceMetrics[currentMetric].value}
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {performanceMetrics[currentMetric].label}
                        </div>
                        <div className={`text-xs font-medium ${
                          performanceMetrics[currentMetric].trend === 'up' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {performanceMetrics[currentMetric].change} this month
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Mini Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {stats.slice(0, 4).map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                          className="text-center p-3 bg-muted/20 rounded-lg"
                        >
                          <div className="flex items-center justify-center mb-2">
                            <div className="text-primary">{stat.icon}</div>
                          </div>
                          <div className="text-lg font-bold text-foreground">{stat.value}</div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                          <div className="text-xs text-green-400 font-medium">{stat.trend}</div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full blur-sm"
                />
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400/20 rounded-full blur-sm"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center space-y-2 text-muted-foreground"
          >
            <span className="text-sm">Explore features</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Core Features</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Built for
              <span className="bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent"> professional traders</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every feature designed to give you the edge in today's competitive markets
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">{feature.icon}</div>
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-primary border-primary/30">
                        {feature.stats}
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pattern Catalog Section */}
      <section id="patterns" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Pattern Recognition</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">55+ Trading Patterns</span>
              <br />detected automatically
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI recognizes the most profitable patterns across all major categories with institutional-grade accuracy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {patternCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className={`h-full bg-gradient-to-br ${category.gradient} border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <div className="text-primary">{category.icon}</div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.count} patterns
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-4 text-foreground">
                      {category.title}
                    </h3>
                    
                    <div className="space-y-3">
                      {category.patterns.map((pattern, patternIndex) => (
                        <div key={pattern.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="text-muted-foreground">{pattern.icon}</div>
                            <span className="text-foreground">{pattern.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs text-green-400 border-green-400/30">
                            {pattern.accuracy}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="ghost" className="w-full mt-4 text-primary hover:bg-primary/10">
                      View All Patterns
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics Section */}
      <section id="performance" className="py-24 bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Live Performance</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Proven results with
              <span className="bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent"> real money</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Track record of consistent performance across all market conditions
            </p>
          </motion.div>

          {/* Performance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {performanceMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="glassmorphism border-border/50 hover:border-primary/30 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {metric.value}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {metric.label}
                    </div>
                    <div className={`text-xs font-medium flex items-center justify-center space-x-1 ${
                      metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{metric.change}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-8 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl px-8 py-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">Audited Results</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">Real-time Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Verified by CPA</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Start trading in
              <span className="bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent"> under 2 minutes</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Simple setup, powerful results. Our AI does the heavy lifting while you focus on execution.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect & Configure",
                description: "Link your trading account or start with paper trading. Set your risk preferences and notification channels in under 60 seconds.",
                icon: <Cpu className="w-8 h-8" />,
                time: "< 1 min"
              },
              {
                step: "02",
                title: "AI Analyzes Markets",
                description: "Our neural networks continuously scan global markets, identifying high-probability patterns across 55+ signal types.",
                icon: <Brain className="w-8 h-8" />,
                time: "24/7"
              },
              {
                step: "03",
                title: "Execute with Confidence",
                description: "Receive instant alerts with entry points, stop losses, and take profits. Track performance with detailed analytics.",
                icon: <Target className="w-8 h-8" />,
                time: "Real-time"
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                {/* Connection Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-0" />
                )}
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                    <div className="text-primary">{step.icon}</div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  <Badge variant="outline" className="text-primary border-primary/30">
                    <Clock className="w-3 h-3 mr-1" />
                    {step.time}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Scale with
              <span className="bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent"> your success</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From individual traders to institutional funds. Start free, upgrade when you're ready.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`relative ${plan.popular ? 'scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <Card className={`h-full ${plan.popular ? 'border-primary/50 shadow-2xl bg-primary/5' : 'border-border/50'} backdrop-blur-sm hover:shadow-xl transition-all duration-300`}>
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">/{plan.period}</span>
                      </div>
                      <p className="text-muted-foreground mb-2">{plan.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {plan.limits}
                      </Badge>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => router.push('/auth/signup')}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Money Back Guarantee */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-6 py-3">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium text-green-400">30-day money-back guarantee</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Trusted by
              <span className="bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent"> top traders</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See what institutional traders and fund managers say about our platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                          <div className="text-xs text-primary">{testimonial.company}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/20 rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Performance:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-green-400 font-medium">{testimonial.metrics.return}</span>
                          <span className="text-muted-foreground">in {testimonial.metrics.period}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 via-green-500/10 to-blue-500/10 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(var(--primary-rgb, 59, 130, 246), 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(var(--primary-rgb, 59, 130, 246), 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to trade with
              <span className="bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent"> AI precision?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 50,000+ traders using AI to make smarter decisions. Start your free trial today and see the difference institutional-grade technology makes.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <Button
                size="lg"
                onClick={() => router.push('/auth/signup')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/auth/signin')}
                className="px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:bg-muted/50 transition-all duration-300"
              >
                Sign In
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="relative w-40 h-10">
                {theme === 'dark' ? (
                  <Image
                    src="/Light with wordmark.svg"
                    alt="Algocipher Radar"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <Image
                    src="/Dark with wordmark.svg"
                    alt="Algocipher Radar"
                    fill
                    className="object-contain"
                  />
                )}
              </div>
              <p className="text-muted-foreground text-sm">
                AI-powered trading signals for institutional and retail traders worldwide.
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-muted-foreground">Live since 2024</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#patterns" className="hover:text-foreground transition-colors">Pattern Catalog</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Press Kit</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Trading Academy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">System Status</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2024 Algocipher Radar. All rights reserved. Trading involves risk.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Discord</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.942 5.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-7.737zM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}