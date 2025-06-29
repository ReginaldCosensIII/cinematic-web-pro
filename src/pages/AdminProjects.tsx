
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ProjectsTable from '@/components/admin/projects/ProjectsTable';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';

const AdminProjects = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_projects_data');
      if (error) throw error;
      return data;
    }
  });

  if (!user) {
    return <div>Please log in to view projects.</div>;
  }

  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Mobile Sidebar Toggle */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="fixed top-24 left-4 z-50 glass-effect rounded-xl p-3 border border-webdev-glass-border lg:hidden"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-webdev-silver" />
              ) : (
                <Menu className="w-5 h-5 text-webdev-silver" />
              )}
            </button>
          )}

          <div className="flex gap-4 md:gap-8">
            {/* Sidebar */}
            <div className={`
              ${isMobile ? 'fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out' : 'hidden lg:block w-64 flex-shrink-0'}
              ${sidebarOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'}
            `}>
              {isMobile && (
                <div className="pt-24">
                  <AdminSidebar />
                </div>
              )}
              {!isMobile && <AdminSidebar />}
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobile && sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-light text-webdev-silver mb-2">Projects</h1>
                <p className="text-sm md:text-base text-webdev-soft-gray">Manage all system projects and assignments</p>
              </div>

              <div className="overflow-x-auto">
                <ProjectsTable projects={projects || []} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminProjects;
