"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Command, Settings, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { NotificationCenter } from '@/components/notifications/notification-center';
import { useCommandPalette } from '@/components/command-palette/command-palette-provider';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function TopBar() {
  const { open } = useCommandPalette();
  const router = useRouter();
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Mock user data - in a real app this would come from auth context
  const user = {
    name: 'Demo User',
    email: 'demo@algocipher.com',
    initials: 'DU',
    plan: 'Pro'
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    
    // Simulate sign out process
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear any stored auth data
      localStorage.removeItem('auth-token');
      sessionStorage.clear();
      
      // Redirect to sign in page
      router.push('/auth/signin');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
      setShowSignOutDialog(false);
    }
  };

  const handleSettings = () => {
    router.push('/profile');
  };

  return (
    <>
      <div className="h-14 bg-card/30 backdrop-blur-sm border-b border-border/50 px-4 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
            <Input
              placeholder="Search markets, patterns... (⌘K)"
              onClick={open}
              className="pl-8 h-8 text-sm bg-muted/50 border-border/50 focus:bg-muted/70 cursor-pointer"
              readOnly
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <Command className="w-2.5 h-2.5" />
                K
              </kbd>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          {/* Enhanced Notification Center */}
          <NotificationCenter />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-micro bg-primary/20 text-primary font-medium">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
              </Button>  
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setShowSignOutDialog(true)}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Sign Out Confirmation Dialog */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent>
          <div className="flex flex-col space-y-2 text-center sm:text-left">
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out of your account? You'll need to sign in again to access your dashboard.
            </AlertDialogDescription>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSigningOut}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isSigningOut ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing out...</span>
                </div>
              ) : (
                'Sign Out'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}