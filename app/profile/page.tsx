"use client";

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/dashboard/top-bar';
import { ProfileSettings } from '@/components/profile/profile-settings';
import { SecuritySettings } from '@/components/profile/security-settings';
import { NotificationSettings } from '@/components/profile/notification-settings';
import { TradingPreferences } from '@/components/profile/trading-preferences';
import { BillingSettings } from '@/components/profile/billing-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Shield, 
  Bell, 
  TrendingUp, 
  CreditCard,
  Activity,
  Crown
} from 'lucide-react';

function ProfileContent() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for tab parameter in URL
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    // Check authentication and load user data
    const checkAuth = () => {
      const token = localStorage.getItem('auth-token');
      const userData = localStorage.getItem('user-data');
      
      if (!token || !userData) {
        router.push('/auth/signin');
        return;
      }
      
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/auth/signin');
        return;
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleSidebarNavigation = (tab: string) => {
    if (tab === 'dashboard') {
      router.push('/');
    }
    // For other tabs, we stay on the profile page since sidebar is just for navigation context
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'trading', label: 'Trading', icon: TrendingUp },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar activeTab="settings" onTabChange={handleSidebarNavigation} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                    <p className="text-muted-foreground">
                      Manage your account, security, and trading preferences
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-primary border-primary/30">
                      <Crown className="w-3 h-3 mr-1" />
                      {user.plan} Plan
                    </Badge>
                    <Badge variant="outline" className="text-green-400 border-green-400/30">
                      <Activity className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
              </motion.div>

              {/* Settings Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-5 h-12">
                    {tabItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <TabsTrigger 
                          key={item.id} 
                          value={item.id}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <Icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{item.label}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  <TabsContent value="profile" className="space-y-6">
                    <ProfileSettings user={user} onUserUpdate={setUser} />
                  </TabsContent>

                  <TabsContent value="security" className="space-y-6">
                    <SecuritySettings user={user} />
                  </TabsContent>

                  <TabsContent value="notifications" className="space-y-6">
                    <NotificationSettings user={user} />
                  </TabsContent>

                  <TabsContent value="trading" className="space-y-6">
                    <TradingPreferences user={user} />
                  </TabsContent>

                  <TabsContent value="billing" className="space-y-6">
                    <BillingSettings user={user} />
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}