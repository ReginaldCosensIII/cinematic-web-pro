
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Target, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import MilestoneDetailsModal from './MilestoneDetailsModal';

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: string;
  due_date: string;
  completion_date: string;
  hours_logged: number;
  project_id: string;
}

const MilestonesSection = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalHours, setTotalHours] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMilestonesAndHours();
    }
  }, [user]);

  const fetchMilestonesAndHours = async () => {
    try {
      // Fetch milestones for user's projects
      const { data: milestonesData, error: milestonesError } = await supabase
        .from('milestones')
        .select(`
          *,
          projects!inner(
            user_id
          )
        `)
        .eq('projects.user_id', user?.id)
        .order('due_date', { ascending: true });

      if (milestonesError) {
        console.error('Error fetching milestones:', milestonesError);
      }

      // Fetch total hours from time_entries for user's projects
      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', user?.id);

      let totalHours = 0;
      if (projects && projects.length > 0) {
        const projectIds = projects.map(p => p.id);
        const { data: timeEntries, error: timeError } = await supabase
          .from('time_entries')
          .select('hours')
          .in('project_id', projectIds);

        if (timeError) {
          console.error('Error fetching time entries:', timeError);
        } else {
          totalHours = (timeEntries || []).reduce((sum, entry) => sum + Number(entry.hours), 0);
        }
      }

      const milestoneData = milestonesData || [];
      setMilestones(milestoneData);
      setTotalHours(totalHours);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-webdev-gradient-blue" />;
      case 'pending':
        return <Target className="w-5 h-5 text-webdev-soft-gray" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/20';
      case 'in_progress':
        return 'text-webdev-gradient-blue bg-blue-400/20';
      case 'pending':
        return 'text-webdev-soft-gray bg-gray-400/20';
      default:
        return 'text-yellow-400 bg-yellow-400/20';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="glass-effect rounded-2xl p-4 sm:p-8 border border-webdev-glass-border">
        <div className="animate-pulse">
          <div className="h-6 bg-webdev-darker-gray rounded mb-4 w-48"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-webdev-darker-gray rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const completionRate = milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0;

  return (
    <>
      <div 
        className="glass-effect rounded-2xl p-4 sm:p-8 border border-webdev-glass-border hover:border-webdev-gradient-blue/50 transition-all duration-300 cursor-pointer group"
        onClick={() => setModalOpen(true)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
          <h2 className="text-xl sm:text-2xl font-light text-webdev-silver group-hover:text-white transition-colors">Milestones & Time Tracking</h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-sm">
            <div className="text-center sm:text-left">
              <div className="text-webdev-gradient-blue font-semibold">{totalHours.toFixed(1)}h</div>
              <div className="text-webdev-soft-gray">Total Hours</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-webdev-gradient-purple font-semibold">{completionRate.toFixed(0)}%</div>
              <div className="text-webdev-soft-gray">Complete</div>
            </div>
          </div>
        </div>

        {milestones.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-webdev-soft-gray mx-auto mb-4" />
            <p className="text-webdev-soft-gray text-lg">No milestones yet</p>
            <p className="text-webdev-soft-gray/70">Project milestones will appear here as they're created</p>
          </div>
        ) : (
          <div className="space-y-4">
            {milestones.slice(0, 3).map((milestone) => (
              <div
                key={milestone.id}
                className="glass-effect rounded-xl p-4 sm:p-6 border border-webdev-glass-border"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="mt-1 flex-shrink-0">
                      {getStatusIcon(milestone.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-lg font-medium text-webdev-silver break-words">{milestone.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)} self-start flex-shrink-0`}>
                          {formatStatus(milestone.status)}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-webdev-soft-gray">
                        {milestone.due_date && (
                          <span className="truncate">Due: {format(new Date(milestone.due_date), 'MMM d, yyyy')}</span>
                        )}
                        {milestone.hours_logged > 0 && (
                          <span className="text-webdev-gradient-blue font-medium whitespace-nowrap">
                            {milestone.hours_logged}h logged
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {milestones.length > 3 && (
              <div className="text-center text-webdev-soft-gray text-sm">
                Click to view all {milestones.length} milestones
              </div>
            )}
          </div>
        )}
      </div>
      
      <MilestoneDetailsModal
        milestones={milestones}
        totalHours={totalHours}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default MilestonesSection;
