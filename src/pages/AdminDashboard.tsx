import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useSecurityLogger } from '@/hooks/useSecurityLogger';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminStats from '@/components/admin/AdminStats';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const { logSecurityEvent } = useSecurityLogger();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until both auth and admin checks are complete
    if (authLoading || adminLoading) {
      return;
    }

    // If there's no user, or if the user is not an admin, redirect
    if (!user || !isAdmin) {
      if (user) { // Log only if a non-admin user tried to access
          logSecurityEvent({
            event_type: 'admin_access',
            details: {
              access_denied: true,
              user_id: user.id,
              attempted_path: '/admin'
            }
          });
      }
      navigate(user ? '/dashboard' : '/auth');
    } else {
        // Log successful admin access
        logSecurityEvent({
          event_type: 'admin_access',
          details: { 
            access_granted: true,
            user_id: user.id,
            path: '/admin'
          }
        });
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate, logSecurityEvent]);

  // Unified loading state
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-webdev-black flex items-center justify-center">
        <div className="text-webdev-silver">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-webdev-gradient-blue mx-auto mb-4"></div>
          Verifying permissions...
        </div>
      </div>
    );
  }

  // Only render the dashboard if the user is an admin
  if (user && isAdmin) {
    return (
      <div className="min-h-screen bg-webdev-black relative overflow-hidden">
        <SmokeBackground />
        <Header />
        
        <main className="relative z-10 pt-24 md:pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex gap-8">
              <div className="hidden lg:block w-64 flex-shrink-0">
                <AdminSidebar />
              </div>
              <div className="flex-1 space-y-6 md:space-y-8">
                <div className="glass-effect rounded-2xl p-4 md:p-8 border border-webdev-glass-border">
                  <h1 className="text-2xl md:text-4xl font-light text-webdev-silver mb-2">
                    Welcome <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-semibold">Admin</span>
                  </h1>
                  <p className="text-webdev-soft-gray text-base md:text-lg">
                    Manage users, projects, and system overview
                  </p>
                </div>
                <AdminStats />
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // In the brief moment before redirection, render nothing.
  return null;
};

export default AdminDashboard;