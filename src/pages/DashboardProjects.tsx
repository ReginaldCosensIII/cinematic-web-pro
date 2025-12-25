
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ProjectDetailsModal from '@/components/dashboard/ProjectDetailsModal';
import { FolderOpen, Calendar, Clock, Target, Menu, X } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  start_date: string;
  last_updated: string;
  total_hours: number;
}

const DashboardProjects = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects with hours for user:', user?.id);
      
      // First get projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('last_updated', { ascending: false });

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        return;
      }

      // Then get time entries for each project and calculate total hours
      const projectsWithHours = await Promise.all(
        (projectsData || []).map(async (project) => {
          const { data: timeEntries, error: timeError } = await supabase
            .from('time_entries')
            .select('hours')
            .eq('project_id', project.id);

          if (timeError) {
            console.error('Error fetching time entries for project:', project.id, timeError);
          }

          const totalHours = (timeEntries || []).reduce((sum, entry) => sum + Number(entry.hours), 0);
          
          console.log(`Project ${project.title} has ${totalHours} total hours from ${timeEntries?.length || 0} entries`);

          return {
            ...project,
            total_hours: totalHours
          };
        })
      );

      console.log('Projects with hours:', projectsWithHours);
      setProjects(projectsWithHours);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'in_progress':
        return 'text-webdev-gradient-blue';
      case 'on_hold':
        return 'text-yellow-400';
      case 'review':
        return 'text-webdev-gradient-purple';
      default:
        return 'text-webdev-soft-gray';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-webdev-black flex items-center justify-center">
        <div className="text-webdev-silver">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-24 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex gap-4 lg:gap-8">
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

            {/* Sidebar */}
            <div className={`
              ${isMobile ? 'fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out' : 'hidden lg:block w-64 flex-shrink-0'}
              ${sidebarOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'}
            `}>
              {isMobile && (
                <div className="pt-24">
                  <DashboardSidebar />
                </div>
              )}
              {!isMobile && <DashboardSidebar />}
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobile && sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            {/* Main Content */}
            <div className={`flex-1 min-w-0 ${isMobile ? 'ml-0' : ''}`}>
              <div className="glass-effect rounded-2xl p-4 md:p-8 border border-webdev-glass-border">
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                  <FolderOpen className="w-6 md:w-8 h-6 md:h-8 text-webdev-gradient-blue flex-shrink-0" />
                  <h1 className="text-2xl md:text-3xl font-light text-webdev-silver">Projects</h1>
                </div>

                {loadingProjects ? (
                  <div className="text-center py-8">
                    <div className="text-webdev-soft-gray">Loading projects...</div>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderOpen className="w-16 h-16 text-webdev-soft-gray mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-light text-webdev-silver mb-2">No Projects Yet</h3>
                    <p className="text-webdev-soft-gray">Your projects will appear here once they're created.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div 
                        key={project.id} 
                        className="glass-effect rounded-xl p-4 sm:p-6 border border-webdev-glass-border hover:border-webdev-gradient-blue/30 transition-all duration-300 cursor-pointer group"
                        onClick={() => handleProjectClick(project)}
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg sm:text-xl font-semibold text-webdev-silver mb-2 group-hover:text-white transition-colors break-words">
                                {project.title}
                              </h3>
                              <p className="text-webdev-soft-gray mb-4 text-sm sm:text-base break-words">
                                {project.description || 'No description provided'}
                              </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)} bg-webdev-darker-gray/50 self-start flex-shrink-0`}>
                              {formatStatus(project.status)}
                            </div>
                          </div>
                        
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm text-webdev-soft-gray">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">Started: {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">Updated: {new Date(project.last_updated).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-webdev-gradient-blue flex-shrink-0" />
                              <span className="text-webdev-gradient-blue font-medium whitespace-nowrap">
                                {project.total_hours.toFixed(1)}h logged
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <ProjectDetailsModal
        project={selectedProject}
        isOpen={modalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default DashboardProjects;
