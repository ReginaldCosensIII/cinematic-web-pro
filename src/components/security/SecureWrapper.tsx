
import React, { useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useEnhancedSecurity } from '@/hooks/useEnhancedSecurity';
import { checkPermission } from '@/utils/enhancedSecurityHelpers';

interface SecureWrapperProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  resource?: string;
  fallback?: ReactNode;
}

const SecureWrapper = ({ 
  children, 
  requireAuth = false, 
  requireAdmin = false, 
  resource,
  fallback = <div className="text-webdev-soft-gray">Access denied</div>
}: SecureWrapperProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const { logSecurityEvent } = useEnhancedSecurity();

  const loading = authLoading || (requireAdmin && adminLoading);

  useEffect(() => {
    if (!loading) {
      // Log access attempts
      if (requireAuth && !user) {
        logSecurityEvent({
          event_type: 'failed_auth',
          details: { reason: 'No authenticated user', resource },
          severity: 'medium'
        });
      }
      
      if (requireAdmin && user && !isAdmin) {
        logSecurityEvent({
          event_type: 'failed_auth',
          details: { reason: 'Insufficient privileges', resource, userId: user.id },
          severity: 'high'
        });
      }
    }
  }, [loading, user, isAdmin, requireAuth, requireAdmin, resource, logSecurityEvent]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-webdev-gradient-blue"></div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !user) {
    return fallback;
  }

  // Check admin requirement
  if (requireAdmin && (!user || !isAdmin)) {
    return fallback;
  }

  // Additional permission check
  if (user && (requireAdmin || requireAuth)) {
    const userRole = isAdmin ? 'admin' : 'user';
    const requiredRole = requireAdmin ? 'admin' : 'user';
    
    if (!checkPermission(userRole, requiredRole, resource)) {
      return fallback;
    }
  }

  return <>{children}</>;
};

export default SecureWrapper;
