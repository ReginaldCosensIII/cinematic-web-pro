
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MilestoneDetailsModal from '@/components/dashboard/MilestoneDetailsModal';
import { Target, Calendar, Clock, CheckCircle, Menu, X } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: string;
  due_date: string | null;
  completion_date: string | null;
  hours_logged: number;
  project_id: string;
}

interface Project {
  id: string;
  title: string;
}

const DashboardMilestones = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [projects, setProjects] = useState<{ [key: string]: Project }>({});
  const [loadingMilestones, setLoadingMilestones] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchMilestonesAndProjects();
    }
  }, [user]);

  const fetchMilestonesAndProjects = async () => {
    try {
      // First fetch user's projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, title')
        .eq('user_id', user?.id);

      if (projectsError) throw projectsError;

      const projectsMap = (projectsData || []).reduce((acc, project) => {
        acc[project.id] = project;
        return acc;
      }, {} as { [key: string]: Project });

      setProjects(projectsMap);

      // Then fetch milestones for those projects
      if (projectsData && projectsData.length > 0) {
        const projectIds = projectsData.map(p => p.id);
        const { data: milestonesData, error: milestonesError } = await supabase
          .from('milestones')
          .select('*')
          .in('project_id', projectIds)
          .order('due_date', { ascending: true });

        if (milestonesError) throw milestonesError;
        setMilestones(milestonesData || []);

        // Fetch total hours
        const { data: timeEntries, error: timeError } = await supabase
          .from('time_entries')
          .select('hours')
          .in('project_id', projectIds);

        if (timeError) throw timeError;
        const totalHours = (timeEntries || []).reduce((sum, entry) => sum + Number(entry.hours), 0);
        setTotalHours(totalHours);
      }
    } catch (error) {
      console.error('Error fetching milestones:', error);
    } finally {
      setLoadingMilestones(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10';
      case 'in_progress':
        return 'text-webdev-gradient-blue bg-blue-400/10';
      default:
        return 'text-webdev-soft-gray bg-gray-400/10';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleMilestoneClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setModalOpen(true);
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

  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
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

          <div className="flex gap-8">
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
            <div className="flex-1">
              <div className="glass-effect rounded-2xl p-8 border border-webdev-glass-border">
                <div className="flex items-center gap-4 mb-8">
                  <Target className="w-8 h-8 text-webdev-gradient-blue" />
                  <h1 className="text-3xl font-light text-webdev-silver">Milestones</h1>
                </div>

                {loadingMilestones ? (
                  <div className="text-center py-8">
                    <div className="text-webdev-soft-gray">Loading milestones...</div>
                  </div>
                ) : milestones.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 text-webdev-soft-gray mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-light text-webdev-silver mb-2">No Milestones Yet</h3>
                    <p className="text-webdev-soft-gray">Project milestones will appear here once they're created.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {milestones.map((milestone) => (
                      <div 
                        key={milestone.id} 
                        className="glass-effect rounded-xl p-6 border border-webdev-glass-border hover:border-webdev-gradient-blue/30 transition-all duration-300 cursor-pointer"
                        onClick={() => handleMilestoneClick(milestone)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h3 className="text-lg font-semibold text-webdev-silver">{milestone.title}</h3>
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(milestone.status)}`}>
                                {formatStatus(milestone.status)}
                              </div>
                            </div>
                            <p className="text-webdev-soft-gray mb-2">{milestone.description || 'No description provided'}</p>
                            <div className="text-sm text-webdev-gradient-blue">
                              Project: {projects[milestone.project_id]?.title || 'Unknown Project'}
                            </div>
                          </div>
                          {milestone.status === 'completed' && (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-webdev-soft-gray">
                          {milestone.due_date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Due: {new Date(milestone.due_date).toLocaleDateString()}</span>
                            </div>
                          )}
                          {milestone.completion_date && (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>Completed: {new Date(milestone.completion_date).toLocaleDateString()}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{milestone.hours_logged}h logged</span>
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
      
      {selectedMilestone && (
        <MilestoneDetailsModal
          milestone={selectedMilestone}
          totalHours={totalHours}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedMilestone(null);
          }}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default DashboardMilestones;
