"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Activity, 
  Bell, 
  BookOpen, 
  Star,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import Image from 'next/image';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { id: 'signals', label: 'Live Signals', icon: Activity, badge: '47', href: '/' },
  { id: 'alerts', label: 'Alerts', icon: Bell, badge: '3', href: '/' },
  { id: 'journal', label: 'Journal', icon: BookOpen, href: '/' },
  { id: 'watchlist', label: 'Watchlist', icon: Star, href: '/' },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();

  const handleNavigation = (item: any) => {
    if (item.id === 'settings') {
      router.push('/profile');
    } else if (item.href === '/') {
      // For dashboard items, use the onTabChange callback
      onTabChange(item.id);
    } else {
      router.push(item.href);
    }
  };

  const handleSettingsClick = () => {
    router.push('/profile');
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 60 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-card/50 backdrop-blur-sm border-r border-border/50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <div className="relative w-32 h-10">
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
            )}
          </AnimatePresence>
          
          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center w-full"
            >
              <div className="relative w-10 h-10">
                <Image
                  src="/logo icon.svg"
                  alt="Algocipher Radar"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-3 space-y-1">
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <div
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`sidebar-nav ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex items-center justify-between flex-1 overflow-hidden"
                  >
                    <span className="text-sm">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-micro h-4 px-1.5">
                        {item.badge}
                      </Badge>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border/50">
        <div
          className="sidebar-nav"
          onClick={handleSettingsClick}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}