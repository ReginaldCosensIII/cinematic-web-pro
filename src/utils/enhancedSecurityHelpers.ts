
import { sanitizeHtml, validateEmail, sanitizeUserInput } from './securityHelpers';

// Enhanced security logging
export interface SecurityEvent {
  event_type: 'login' | 'logout' | 'admin_access' | 'role_change' | 'failed_auth' | 'suspicious_activity' | 'data_access' | 'password_changed';
  user_id?: string;
  target_user_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  timestamp?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export const logSecurityEvent = async (event: SecurityEvent): Promise<void> => {
  try {
    const enhancedEvent = {
      ...event,
      timestamp: event.timestamp || new Date().toISOString(),
      ip_address: event.ip_address || 'unknown',
      user_agent: event.user_agent || navigator.userAgent,
      severity: event.severity || 'medium'
    };

    // Log to console for development
    console.log('Enhanced Security Event:', enhancedEvent);

    // Send to database security audit log
    const { supabase } = await import('@/integrations/supabase/client');
    
    await supabase.rpc('log_security_event', {
      p_event_type: event.event_type,
      p_user_id: event.user_id,
      p_target_user_id: event.target_user_id,
      p_details: event.details,
      p_ip_address: enhancedEvent.ip_address,
      p_user_agent: enhancedEvent.user_agent
    });

    // High severity events get additional attention
    if (event.severity === 'high' || event.severity === 'critical') {
      console.warn(`${event.severity?.toUpperCase()} SEVERITY SECURITY EVENT:`, enhancedEvent);
    }
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

// Enhanced input validation with security context
export const validateAndSanitizeInput = (
  input: string,
  context: 'email' | 'text' | 'html' | 'search' | 'name',
  maxLength: number = 1000
): { isValid: boolean; sanitized: string; errors: string[] } => {
  const errors: string[] = [];
  let sanitized = input;

  // Basic length check
  if (input.length > maxLength) {
    errors.push(`Input exceeds maximum length of ${maxLength} characters`);
    sanitized = input.substring(0, maxLength);
  }

  // Context-specific validation
  switch (context) {
    case 'email':
      if (!validateEmail(input)) {
        errors.push('Invalid email format');
      }
      sanitized = sanitizeUserInput(sanitized, maxLength);
      break;
    
    case 'html':
      sanitized = sanitizeHtml(sanitized);
      break;
    
    case 'text':
    case 'search':
    case 'name':
      sanitized = sanitizeUserInput(sanitized, maxLength);
      // Additional checks for suspicious patterns
      if (/<script|javascript:|on\w+=/i.test(sanitized)) {
        errors.push('Input contains potentially malicious content');
        logSecurityEvent({
          event_type: 'suspicious_activity',
          details: { input: input.substring(0, 100), context },
          severity: 'high'
        });
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    sanitized,
    errors
  };
};

// Role-based access control helper
export const checkPermission = (
  userRole: string | null,
  requiredRole: 'admin' | 'user',
  resource?: string
): boolean => {
  if (!userRole) {
    logSecurityEvent({
      event_type: 'failed_auth',
      details: { reason: 'No user role', resource },
      severity: 'medium'
    });
    return false;
  }

  const hasPermission = userRole === 'admin' || (requiredRole === 'user' && userRole === 'user');
  
  if (!hasPermission) {
    logSecurityEvent({
      event_type: 'failed_auth',
      details: { userRole, requiredRole, resource },
      severity: 'high'
    });
  }

  return hasPermission;
};

// Data sanitization for database operations
export const sanitizeForDatabase = (data: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeUserInput(value);
    } else if (value !== null && value !== undefined) {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// Session security helpers
export const validateSession = (lastActivity: Date, maxInactiveMinutes: number = 30): boolean => {
  const now = new Date();
  const inactiveTime = (now.getTime() - lastActivity.getTime()) / (1000 * 60);
  
  if (inactiveTime > maxInactiveMinutes) {
    logSecurityEvent({
      event_type: 'logout',
      details: { reason: 'Session timeout', inactiveMinutes: inactiveTime },
      severity: 'low'
    });
    return false;
  }
  
  return true;
};
