
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import DashboardWelcome from '@/components/dashboard/DashboardWelcome';
import ProjectOverview from '@/components/dashboard/ProjectOverview';
import MilestonesSection from '@/components/dashboard/MilestonesSection';
import InvoicesSection from '@/components/dashboard/InvoicesSection';
import ProfileDetails from '@/components/dashboard/ProfileDetails';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen theme-bg flex items-center justify-center">
        <div className="text-webdev-silver">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen theme-bg relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-24 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex gap-6 lg:gap-8">
            {/* Desktop Sidebar (mobile/tablet nav lives in the header menu) */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <DashboardSidebar />
            </div>
            
            {/* Main Content */}
            <div className={`flex-1 min-w-0 space-y-6 md:space-y-8`}>
              <DashboardWelcome user={user} />
              <div className="overflow-x-auto">
                <ProjectOverview />
              </div>
              <div className="overflow-x-auto">
                <MilestonesSection />
              </div>
              <div className="overflow-x-auto">
                <InvoicesSection />
              </div>
              <div className="overflow-x-auto">
                <ProfileDetails user={user} />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
