import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logSecurityEvent, validateSession } from '@/utils/enhancedSecurityHelpers';

export const useEnhancedSecurity = () => {
  const { user } = useAuth();

  // Track user activity for session management
  const updateActivity = useCallback(() => {
    if (user) {
      localStorage.setItem('lastActivity', new Date().toISOString());
    }
  }, [user]);

  // Check session validity
  const checkSession = useCallback(() => {
    if (!user) return true;

    const lastActivity = localStorage.getItem('lastActivity');
    if (!lastActivity) {
      updateActivity();
      return true;
    }

    return validateSession(new Date(lastActivity));
  }, [user, updateActivity]);

  // Monitor for suspicious activity
  const monitorActivity = useCallback(() => {
    // Track rapid consecutive requests (potential bot activity)
    const requestTimes = JSON.parse(localStorage.getItem('requestTimes') || '[]');
    const now = Date.now();
    
    // Keep only requests from the last minute
    const recentRequests = requestTimes.filter((time: number) => now - time < 60000);
    recentRequests.push(now);
    
    localStorage.setItem('requestTimes', JSON.stringify(recentRequests));
    
    // Alert if too many requests in short time
    if (recentRequests.length > 50) {
      logSecurityEvent({
        event_type: 'suspicious_activity',
        user_id: user?.id,
        details: { requestCount: recentRequests.length, timeWindow: '1 minute' },
        severity: 'high'
      });
    }
  }, [user]);

  // Set up activity tracking
  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Check session every 5 minutes
    const sessionCheck = setInterval(() => {
      if (!checkSession()) {
        // Force logout if session is invalid
        window.location.href = '/auth';
      }
    }, 5 * 60 * 1000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
      clearInterval(sessionCheck);
    };
  }, [user, updateActivity, checkSession]);

  // Monitor activity on each render
  useEffect(() => {
    if (user) {
      monitorActivity();
    }
  }, [user, monitorActivity]);

  return {
    updateActivity,
    checkSession,
    logSecurityEvent
  };
};
