
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ProjectsTable from '@/components/admin/projects/ProjectsTable';
import CreateProjectModal from '@/components/admin/projects/CreateProjectModal';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminProjects = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return null;
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
              <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-light text-webdev-silver mb-2">Projects</h1>
                  <p className="text-sm md:text-base text-webdev-soft-gray">Manage all system projects and assignments</p>
                </div>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  variant="glass"
                  className="shrink-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </div>

              <div className="overflow-x-auto">
                <ProjectsTable />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default AdminProjects;
