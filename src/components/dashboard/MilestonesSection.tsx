
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Target, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

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
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMilestones();
    }
  }, [user]);

  const fetchMilestones = async () => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Error fetching milestones:', error);
      } else {
        const milestoneData = data || [];
        setMilestones(milestoneData);
        
        // Calculate total hours
        const total = milestoneData.reduce((sum, milestone) => sum + (milestone.hours_logged || 0), 0);
        setTotalHours(total);
      }
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
      <div className="glass-effect rounded-2xl p-8 border border-webdev-glass-border">
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
    <div className="glass-effect rounded-2xl p-8 border border-webdev-glass-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light text-webdev-silver">Milestones & Time Tracking</h2>
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <div className="text-webdev-gradient-blue font-semibold">{totalHours.toFixed(1)}h</div>
            <div className="text-webdev-soft-gray">Total Hours</div>
          </div>
          <div className="text-center">
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
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="glass-effect rounded-xl p-6 border border-webdev-glass-border hover:border-webdev-gradient-blue/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">
                    {getStatusIcon(milestone.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-webdev-silver">{milestone.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                        {formatStatus(milestone.status)}
                      </span>
                    </div>
                    {milestone.description && (
                      <p className="text-webdev-soft-gray mb-3">{milestone.description}</p>
                    )}
                    <div className="flex items-center gap-6 text-sm text-webdev-soft-gray">
                      {milestone.due_date && (
                        <span>Due: {format(new Date(milestone.due_date), 'MMM d, yyyy')}</span>
                      )}
                      {milestone.hours_logged > 0 && (
                        <span className="text-webdev-gradient-blue font-medium">
                          {milestone.hours_logged}h logged
                        </span>
                      )}
                      {milestone.completion_date && (
                        <span className="text-green-400">
                          Completed: {format(new Date(milestone.completion_date), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MilestonesSection;
