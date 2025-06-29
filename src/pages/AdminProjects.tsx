
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ProjectsTable from '@/components/admin/projects/ProjectsTable';
import CreateProjectModal from '@/components/admin/projects/CreateProjectModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const AdminProjects = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h1 className="text-2xl md:text-4xl font-light text-webdev-silver mb-2">
                        Project <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-semibold">Management</span>
                      </h1>
                      <p className="text-webdev-soft-gray text-base md:text-lg">
                        Manage all projects, assignments, and tracking
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple hover:opacity-90 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Project
                    </Button>
                  </div>
                  <ProjectsTable />
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <CreateProjectModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
        
        <Footer />
      </div>
    );
  }

  return null;
};

export default AdminProjects;
