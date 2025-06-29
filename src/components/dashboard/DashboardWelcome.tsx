
import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardWelcomeProps {
  user: User;
}

interface DashboardStats {
  totalProjects: number;
  totalHours: number;
  completionRate: number;
}

const DashboardWelcome = ({ user }: DashboardWelcomeProps) => {
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalHours: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id);

      if (projectsError) throw projectsError;

      // Fetch time entries for user's projects
      const projectIds = (projects || []).map(p => p.id);
      let totalHours = 0;

      if (projectIds.length > 0) {
        const { data: timeEntries, error: timeError } = await supabase
          .from('time_entries')
          .select('hours')
          .in('project_id', projectIds);

        if (timeError) throw timeError;
        totalHours = (timeEntries || []).reduce((sum, entry) => sum + Number(entry.hours), 0);
      }

      // Fetch milestones for completion rate
      const { data: milestones, error: milestonesError } = await supabase
        .from('milestones')
        .select(`
          *,
          projects!inner(
            user_id
          )
        `)
        .eq('projects.user_id', user?.id);

      if (milestonesError) throw milestonesError;

      const totalProjects = projects?.length || 0;
      
      // Calculate completion rate
      const completedMilestones = milestones?.filter(m => m.status === 'completed').length || 0;
      const totalMilestones = milestones?.length || 0;
      const completionRate = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

      setStats({
        totalProjects,
        totalHours,
        completionRate
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-4 md:p-8 border border-webdev-glass-border">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-light text-webdev-silver mb-2">
            Welcome back, <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-semibold">{userName}</span>
          </h1>
          <p className="text-webdev-soft-gray text-base md:text-lg">
            Here's what's happening with your projects
          </p>
        </div>
        
        {loading ? (
          <div className="flex gap-4 overflow-x-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[120px] glass-effect rounded-xl p-4 border border-webdev-glass-border animate-pulse">
                <div className="w-6 h-6 bg-webdev-darker-gray rounded mx-auto mb-2"></div>
                <div className="h-3 bg-webdev-darker-gray rounded mb-2"></div>
                <div className="h-5 bg-webdev-darker-gray rounded"></div>
              </div>
            ))}
          </div>
        ) : (stats.totalProjects > 0 || stats.totalHours > 0) ? (
          <div className="flex gap-4 overflow-x-auto">
            <div className="min-w-[120px] glass-effect rounded-xl p-4 border border-webdev-glass-border text-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-webdev-gradient-blue mx-auto mb-2" />
              <div className="text-sm text-webdev-soft-gray">Projects</div>
              <div className="text-lg font-semibold text-webdev-silver">{stats.totalProjects}</div>
            </div>
            
            <div className="min-w-[120px] glass-effect rounded-xl p-4 border border-webdev-glass-border text-center flex-shrink-0">
              <Clock className="w-6 h-6 text-webdev-gradient-purple mx-auto mb-2" />
              <div className="text-sm text-webdev-soft-gray">Hours Logged</div>
              <div className="text-lg font-semibold text-webdev-silver">{stats.totalHours.toFixed(1)}h</div>
            </div>
            
            <div className="min-w-[120px] glass-effect rounded-xl p-4 border border-webdev-glass-border text-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-sm text-webdev-soft-gray">Completion</div>
              <div className="text-lg font-semibold text-webdev-silver">{stats.completionRate}%</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DashboardWelcome;
