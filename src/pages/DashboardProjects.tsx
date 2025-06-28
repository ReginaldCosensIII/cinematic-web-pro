
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { FolderOpen, Calendar, Clock, Target } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  start_date: string;
  last_updated: string;
}

const DashboardProjects = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('last_updated', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
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

  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <DashboardSidebar />
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              <div className="glass-effect rounded-2xl p-8 border border-webdev-glass-border">
                <div className="flex items-center gap-4 mb-8">
                  <FolderOpen className="w-8 h-8 text-webdev-gradient-blue" />
                  <h1 className="text-3xl font-light text-webdev-silver">Projects</h1>
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
                      <div key={project.id} className="glass-effect rounded-xl p-6 border border-webdev-glass-border hover:border-webdev-gradient-blue/30 transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-webdev-silver mb-2">{project.title}</h3>
                            <p className="text-webdev-soft-gray mb-4">{project.description || 'No description provided'}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)} bg-webdev-darker-gray/50`}>
                            {formatStatus(project.status)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-webdev-soft-gray">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Started: {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Updated: {new Date(project.last_updated).toLocaleDateString()}</span>
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
    </div>
  );
};

export default DashboardProjects;
