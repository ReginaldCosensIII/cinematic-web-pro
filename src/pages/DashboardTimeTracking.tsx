
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Clock, FolderOpen, Target } from 'lucide-react';
import { format } from 'date-fns';

interface TimeLog {
  id: string;
  project_title: string;
  milestone_title: string;
  hours_logged: number;
  status: string;
  due_date: string | null;
  completion_date: string | null;
}

const DashboardTimeTracking = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTimeLogs();
    }
  }, [user]);

  const fetchTimeLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select(`
          id,
          title,
          hours_logged,
          status,
          due_date,
          completion_date,
          projects!inner(
            id,
            title,
            user_id
          )
        `)
        .eq('projects.user_id', user?.id)
        .order('completion_date', { ascending: false });

      if (error) {
        console.error('Error fetching time logs:', error);
      } else {
        const formattedLogs = data?.map(item => ({
          id: item.id,
          project_title: item.projects.title,
          milestone_title: item.title,
          hours_logged: item.hours_logged || 0,
          status: item.status,
          due_date: item.due_date,
          completion_date: item.completion_date
        })) || [];
        
        setTimeLogs(formattedLogs);
        
        // Calculate total hours
        const total = formattedLogs.reduce((sum, log) => sum + log.hours_logged, 0);
        setTotalHours(total);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/20';
      case 'in_progress':
        return 'text-webdev-gradient-blue bg-blue-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20';
      default:
        return 'text-webdev-soft-gray bg-gray-400/20';
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
                  <Clock className="w-8 h-8 text-webdev-gradient-blue" />
                  <h1 className="text-3xl font-light text-webdev-silver">Time Tracking</h1>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="glass-effect rounded-xl p-6 border border-webdev-glass-border">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-6 h-6 text-webdev-gradient-blue" />
                      <h3 className="text-lg font-medium text-webdev-silver">Total Hours</h3>
                    </div>
                    <p className="text-3xl font-light text-white">{totalHours}</p>
                  </div>
                  
                  <div className="glass-effect rounded-xl p-6 border border-webdev-glass-border">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-6 h-6 text-webdev-gradient-purple" />
                      <h3 className="text-lg font-medium text-webdev-silver">Milestones</h3>
                    </div>
                    <p className="text-3xl font-light text-white">{timeLogs.length}</p>
                  </div>
                  
                  <div className="glass-effect rounded-xl p-6 border border-webdev-glass-border">
                    <div className="flex items-center gap-3 mb-2">
                      <FolderOpen className="w-6 h-6 text-green-400" />
                      <h3 className="text-lg font-medium text-webdev-silver">Completed</h3>
                    </div>
                    <p className="text-3xl font-light text-white">
                      {timeLogs.filter(log => log.status === 'completed').length}
                    </p>
                  </div>
                </div>

                {loadingData ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-webdev-darker-gray/50 rounded-xl"></div>
                    ))}
                  </div>
                ) : timeLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-webdev-soft-gray mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-light text-webdev-silver mb-2">No Time Logged Yet</h3>
                    <p className="text-webdev-soft-gray">
                      Time will appear here as work is completed on your projects and milestones.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-xl font-light text-webdev-silver mb-4">Logged Hours by Milestone</h2>
                    {timeLogs.map((log) => (
                      <div
                        key={log.id}
                        className="glass-effect rounded-xl p-6 border border-webdev-glass-border hover:border-webdev-gradient-blue/50 transition-all duration-300"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <FolderOpen className="w-5 h-5 text-webdev-gradient-blue" />
                              <h3 className="text-lg font-medium text-webdev-silver">
                                {log.project_title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <Target className="w-4 h-4 text-webdev-gradient-purple" />
                              <span className="text-webdev-soft-gray">{log.milestone_title}</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                                {formatStatus(log.status)}
                              </span>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-webdev-soft-gray">
                              {log.due_date && (
                                <span>Due: {format(new Date(log.due_date), 'MMM d, yyyy')}</span>
                              )}
                              {log.completion_date && (
                                <span>Completed: {format(new Date(log.completion_date), 'MMM d, yyyy')}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 justify-end lg:justify-start">
                              <Clock className="w-5 h-5 text-webdev-gradient-blue" />
                              <span className="text-2xl font-light text-white">{log.hours_logged}</span>
                              <span className="text-webdev-soft-gray">hours</span>
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
    </div>
  );
};

export default DashboardTimeTracking;
