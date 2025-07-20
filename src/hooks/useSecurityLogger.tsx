
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logSecurityEvent as logToDatabase } from '@/utils/enhancedSecurityHelpers';

interface SecurityEvent {
  event_type: 'login' | 'logout' | 'admin_access' | 'role_change' | 'failed_auth' | 'suspicious_activity';
  user_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export const useSecurityLogger = () => {
  const { user } = useAuth();

  const logSecurityEvent = async (event: SecurityEvent) => {
    try {
      // Enhanced security logging with database persistence
      await logToDatabase({
        event_type: event.event_type,
        user_id: event.user_id || user?.id,
        details: event.details,
        ip_address: event.ip_address,
        user_agent: event.user_agent || navigator.userAgent,
        severity: event.severity || 'medium'
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  useEffect(() => {
    // Log successful authentication with enhanced details
    if (user) {
      logSecurityEvent({
        event_type: 'login',
        user_id: user.id,
        details: { 
          email: user.email,
          login_method: 'email',
          timestamp: new Date().toISOString()
        },
        severity: 'low'
      });
    }
  }, [user]);

  return { logSecurityEvent };
};
