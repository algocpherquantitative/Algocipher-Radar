"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Clock, Globe, TrendingUp, Activity } from 'lucide-react';

interface TradingSession {
  id: string;
  name: string;
  city: string;
  timezone: string;
  openTime: string;
  closeTime: string;
  flag: string;
  color: string;
  description: string;
}

const TRADING_SESSIONS: TradingSession[] = [
  {
    id: 'sydney',
    name: 'Sydney',
    city: 'Sydney',
    timezone: 'Australia/Sydney',
    openTime: '21:00',
    closeTime: '06:00',
    flag: '🇦🇺',
    color: 'text-blue-400',
    description: 'Asia-Pacific'
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    city: 'Tokyo',
    timezone: 'Asia/Tokyo',
    openTime: '23:00',
    closeTime: '08:00',
    flag: '🇯🇵',
    color: 'text-red-400',
    description: 'Asian Session'
  },
  {
    id: 'london',
    name: 'London',
    city: 'London',
    timezone: 'Europe/London',
    openTime: '07:00',
    closeTime: '16:00',
    flag: '🇬🇧',
    color: 'text-green-400',
    description: 'European Session'
  },
  {
    id: 'new_york',
    name: 'New York',
    city: 'New York',
    timezone: 'America/New_York',
    openTime: '12:00',
    closeTime: '21:00',
    flag: '🇺🇸',
    color: 'text-yellow-400',
    description: 'American Session'
  }
];

interface SessionTime {
  session: TradingSession;
  localTime: string;
  isOpen: boolean;
  opensIn?: string;
  closesIn?: string;
  volume: 'low' | 'medium' | 'high';
}

export function TradingSessionClocks() {
  const [sessionTimes, setSessionTimes] = useState<SessionTime[]>([]);
  const [currentUTC, setCurrentUTC] = useState(new Date());

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setCurrentUTC(now);
      
      const times = TRADING_SESSIONS.map(session => {
        // Get current time in session's timezone
        const sessionTime = new Intl.DateTimeFormat('en-US', {
          timeZone: session.timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).format(now);

        // Calculate if market is open (using UTC times)
        const isOpen = isMarketOpen(session, now);
        
        // Calculate time until open/close
        const { opensIn, closesIn } = getTimeUntilOpenClose(session, now);
        
        // Determine volume based on session overlaps
        const volume = getSessionVolume(session, now);

        return {
          session,
          localTime: sessionTime,
          isOpen,
          opensIn,
          closesIn,
          volume
        };
      });

      setSessionTimes(times);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const isMarketOpen = (session: TradingSession, now: Date): boolean => {
    const utcHour = now.getUTCHours();
    const utcMinute = now.getUTCMinutes();
    const currentTime = utcHour * 60 + utcMinute;

    const [openHour, openMinute] = session.openTime.split(':').map(Number);
    const [closeHour, closeMinute] = session.closeTime.split(':').map(Number);
    
    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;

    // Handle sessions that cross midnight
    if (openTime > closeTime) {
      return currentTime >= openTime || currentTime < closeTime;
    } else {
      return currentTime >= openTime && currentTime < closeTime;
    }
  };

  const getTimeUntilOpenClose = (session: TradingSession, now: Date) => {
    const utcHour = now.getUTCHours();
    const utcMinute = now.getUTCMinutes();
    const currentTime = utcHour * 60 + utcMinute;

    const [openHour, openMinute] = session.openTime.split(':').map(Number);
    const [closeHour, closeMinute] = session.closeTime.split(':').map(Number);
    
    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;

    let opensIn: string | undefined;
    let closesIn: string | undefined;

    if (isMarketOpen(session, now)) {
      // Market is open, calculate time until close
      let timeUntilClose;
      if (openTime > closeTime) {
        // Session crosses midnight
        if (currentTime >= openTime) {
          timeUntilClose = (24 * 60) - currentTime + closeTime;
        } else {
          timeUntilClose = closeTime - currentTime;
        }
      } else {
        timeUntilClose = closeTime - currentTime;
      }
      
      const hours = Math.floor(timeUntilClose / 60);
      const minutes = timeUntilClose % 60;
      closesIn = `${hours}h ${minutes}m`;
    } else {
      // Market is closed, calculate time until open
      let timeUntilOpen;
      if (openTime > closeTime) {
        // Session crosses midnight
        if (currentTime < closeTime) {
          timeUntilOpen = openTime - currentTime;
        } else {
          timeUntilOpen = (24 * 60) - currentTime + openTime;
        }
      } else {
        if (currentTime < openTime) {
          timeUntilOpen = openTime - currentTime;
        } else {
          timeUntilOpen = (24 * 60) - currentTime + openTime;
        }
      }
      
      const hours = Math.floor(timeUntilOpen / 60);
      const minutes = timeUntilOpen % 60;
      opensIn = `${hours}h ${minutes}m`;
    }

    return { opensIn, closesIn };
  };

  const getSessionVolume = (session: TradingSession, now: Date): 'low' | 'medium' | 'high' => {
    const openSessions = TRADING_SESSIONS.filter(s => isMarketOpen(s, now));
    
    // High volume during overlaps
    if (openSessions.length >= 2) {
      // London-New York overlap (highest volume)
      if (openSessions.some(s => s.id === 'london') && openSessions.some(s => s.id === 'new_york')) {
        return 'high';
      }
      // Tokyo-London overlap
      if (openSessions.some(s => s.id === 'tokyo') && openSessions.some(s => s.id === 'london')) {
        return 'high';
      }
      return 'medium';
    }
    
    // Medium volume for major sessions
    if (session.id === 'london' || session.id === 'new_york') {
      return 'medium';
    }
    
    return 'low';
  };

  const getActiveSessionsCount = () => {
    return sessionTimes.filter(st => st.isOpen).length;
  };

  const getNextMajorEvent = () => {
    const events = sessionTimes
      .filter(st => st.opensIn || st.closesIn)
      .map(st => ({
        session: st.session.name,
        event: st.opensIn ? 'opens' : 'closes',
        time: st.opensIn || st.closesIn || '',
        timeInMinutes: parseTimeToMinutes(st.opensIn || st.closesIn || '')
      }))
      .sort((a, b) => a.timeInMinutes - b.timeInMinutes);

    return events[0];
  };

  const parseTimeToMinutes = (timeStr: string): number => {
    const match = timeStr.match(/(\d+)h (\d+)m/);
    if (match) {
      return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return 0;
  };

  const nextEvent = getNextMajorEvent();

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Globe className="w-3 h-3 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Trading Sessions</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs h-4 px-2">
            {getActiveSessionsCount()} Active
          </Badge>
          <div className="text-xs text-muted-foreground">
            UTC: {currentUTC.toLocaleTimeString('en-US', { 
              hour12: false, 
              timeZone: 'UTC',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>

      {/* Next Major Event */}
      {nextEvent && (
        <div className="bg-muted/20 rounded-md p-2 text-center border border-border/30">
          <div className="text-xs text-muted-foreground">Next Event</div>
          <div className="text-sm font-medium text-foreground">
            {nextEvent.session} {nextEvent.event} in {nextEvent.time}
          </div>
        </div>
      )}

      {/* Session Clocks Grid - Compact */}
      <div className="grid grid-cols-2 gap-2">
        {sessionTimes.map((sessionTime, index) => (
          <motion.div
            key={sessionTime.session.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`relative p-2 rounded-md border transition-all duration-200 ${
              sessionTime.isOpen 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-muted/20 border-border/30'
            }`}
          >
            {/* Session Header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1">
                <span className="text-xs">{sessionTime.session.flag}</span>
                <div>
                  <div className="text-xs font-semibold text-foreground">
                    {sessionTime.session.name}
                  </div>
                </div>
              </div>
              
              {sessionTime.isOpen && (
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>

            {/* Local Time */}
            <div className="space-y-1">
              <div className={`text-sm font-mono font-bold ${sessionTime.session.color}`}>
                {sessionTime.localTime}
              </div>
              
              <div className="text-xs text-muted-foreground">
                {sessionTime.session.openTime}-{sessionTime.session.closeTime} UTC
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between mt-1">
              <Badge 
                variant="outline" 
                className={`text-xs h-3 px-1 ${
                  sessionTime.isOpen 
                    ? 'text-green-400 border-green-400/30' 
                    : 'text-muted-foreground border-border/50'
                }`}
              >
                {sessionTime.isOpen ? 'OPEN' : 'CLOSED'}
              </Badge>
            </div>

            {/* Session Overlap Indicator */}
            {sessionTime.isOpen && sessionTime.volume === 'high' && (
              <div className="absolute -top-1 -right-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-1 h-1 text-yellow-900" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}