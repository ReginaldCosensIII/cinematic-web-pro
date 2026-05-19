
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ProjectsTable from '@/components/admin/projects/ProjectsTable';
import CreateProjectModal from '@/components/admin/projects/CreateProjectModal';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminProjects = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);

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

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default AdminProjects;
