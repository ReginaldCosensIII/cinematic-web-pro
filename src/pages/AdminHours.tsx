
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import AdminSidebar from '@/components/admin/AdminSidebar';
import HoursTable from '@/components/admin/hours/HoursTable';

const AdminHours = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || adminLoading) {
      return;
    }

    if (!user || !isAdmin) {
      navigate(user ? '/dashboard' : '/auth');
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

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
                    Hours <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-semibold">Logged</span>
                  </h1>
                  <p className="text-webdev-soft-gray text-base md:text-lg">
                    Track and manage time entries for all projects
                  </p>
                </div>
                
                <div className="glass-effect rounded-2xl p-4 md:p-8 border border-webdev-glass-border">
                  <HoursTable />
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return null;
};

export default AdminHours;
