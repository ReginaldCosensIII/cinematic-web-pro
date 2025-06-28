
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

  console.log('AdminDashboard - Auth Loading:', authLoading);
  console.log('AdminDashboard - Admin Loading:', adminLoading);
  console.log('AdminDashboard - User:', user?.id);
  console.log('AdminDashboard - Is Admin:', isAdmin);

  useEffect(() => {
    if (!authLoading && !user) {
      console.log('AdminDashboard - No user, redirecting to auth');
      navigate('/auth');
      return;
    }

    // Only check admin status after both auth and admin loading are complete
    if (!authLoading && !adminLoading && user) {
      if (!isAdmin) {
        console.log('AdminDashboard - User is not admin, redirecting to dashboard');
        logSecurityEvent({
          event_type: 'admin_access',
          details: { 
            access_denied: true,
            user_id: user.id,
            attempted_path: '/admin'
          }
        });
        navigate('/dashboard');
      } else {
        console.log('AdminDashboard - Admin access granted');
        logSecurityEvent({
          event_type: 'admin_access',
          details: { 
            access_granted: true,
            user_id: user.id,
            path: '/admin'
          }
        });
      }
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate, logSecurityEvent]);

  // Show loading while either auth or admin status is loading
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-webdev-black flex items-center justify-center">
        <div className="text-webdev-silver">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-webdev-gradient-blue mx-auto mb-4"></div>
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated or not admin
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-24 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <AdminSidebar />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 space-y-6 md:space-y-8">
              {/* Welcome Section */}
              <div className="glass-effect rounded-2xl p-4 md:p-8 border border-webdev-glass-border">
                <h1 className="text-2xl md:text-4xl font-light text-webdev-silver mb-2">
                  Welcome <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-semibold">Admin</span>
                </h1>
                <p className="text-webdev-soft-gray text-base md:text-lg">
                  Manage users, projects, and system overview
                </p>
              </div>

              {/* Stats Cards */}
              <AdminStats />

              {/* Quick Actions */}
              <div className="glass-effect rounded-2xl p-6 border border-webdev-glass-border">
                <h2 className="text-xl font-semibold text-webdev-silver mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => navigate('/admin/users')}
                    className="glass-effect rounded-xl p-4 border border-webdev-glass-border hover:bg-webdev-darker-gray/50 transition-all duration-300 text-left"
                  >
                    <h3 className="font-medium text-webdev-silver mb-2">Manage Users</h3>
                    <p className="text-sm text-webdev-soft-gray">View and edit user profiles</p>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/admin/projects')}
                    className="glass-effect rounded-xl p-4 border border-webdev-glass-border hover:bg-webdev-darker-gray/50 transition-all duration-300 text-left"
                  >
                    <h3 className="font-medium text-webdev-silver mb-2">Create Project</h3>
                    <p className="text-sm text-webdev-soft-gray">Add new projects and milestones</p>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/admin/submissions')}
                    className="glass-effect rounded-xl p-4 border border-webdev-glass-border hover:bg-webdev-darker-gray/50 transition-all duration-300 text-left"
                  >
                    <h3 className="font-medium text-webdev-silver mb-2">View Submissions</h3>
                    <p className="text-sm text-webdev-soft-gray">Check contact form submissions</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
