
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  event_type: 'login' | 'logout' | 'admin_access' | 'role_change' | 'failed_auth';
  user_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export const useSecurityLogger = () => {
  const { user } = useAuth();

  const logSecurityEvent = async (event: SecurityEvent) => {
    try {
      // In a production environment, you would send this to a secure logging service
      // For now, we'll log to console and could extend to send to Supabase Edge Functions
      console.log('Security Event:', {
        ...event,
        timestamp: new Date().toISOString(),
        user_id: event.user_id || user?.id,
        ip_address: event.ip_address || 'unknown',
        user_agent: event.user_agent || navigator.userAgent
      });

      // You could implement additional logging here, such as:
      // - Sending to a dedicated security logging table
      // - Sending to external security monitoring services
      // - Triggering alerts for suspicious activities
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  useEffect(() => {
    // Log successful authentication
    if (user) {
      logSecurityEvent({
        event_type: 'login',
        user_id: user.id,
        details: { email: user.email }
      });
    }
  }, [user]);

  return { logSecurityEvent };
};
