
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import SecureProfileSettings from '@/components/dashboard/SecureProfileSettings';

const DashboardSettings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen theme-bg relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex gap-6 lg:gap-8">
            {/* Desktop Sidebar (mobile/tablet nav lives in the header menu) */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <DashboardSidebar />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <SecureProfileSettings user={user} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardSettings;
