
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import AdminSidebar from '@/components/admin/AdminSidebar';
import HoursTable from '@/components/admin/hours/HoursTable';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';

const AdminHours = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const navigate = useNavigate();
  useEffect(() => {
    if (authLoading || adminLoading) return;
    if (!user || !isAdmin) {
      navigate(user ? '/dashboard' : '/');
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

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex gap-4 md:gap-8">
            {/* Desktop Sidebar (mobile/tablet nav lives in the header menu) */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <AdminSidebar />
            </div>

            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-light text-webdev-silver mb-2">Hours Logged</h1>
                <p className="text-sm md:text-base text-webdev-soft-gray">Monitor time tracking across all projects</p>
              </div>

              <div className="overflow-x-auto">
                <HoursTable />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminHours;
