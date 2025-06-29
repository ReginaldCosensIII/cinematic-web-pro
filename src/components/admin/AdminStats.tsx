
import React, { useEffect, useState } from 'react';
import { User, FolderOpen, Clock, Receipt } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AdminStatsData {
  totalUsers: number;
  activeProjects: number;
  totalHours: number;
  pendingInvoices: number;
}

const AdminStats = () => {
  const [stats, setStats] = useState<AdminStatsData>({
    totalUsers: 0,
    activeProjects: 0,
    totalHours: 0,
    pendingInvoices: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total users
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id');

      // Get active projects
      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .in('status', ['planning', 'in_progress']);

      // Get total hours from time_entries table
      const { data: timeEntries } = await supabase
        .from('time_entries')
        .select('hours');

      // Get pending invoices
      const { data: invoices } = await supabase
        .from('invoices')
        .select('id')
        .in('status', ['draft', 'sent']);

      const totalHours = (timeEntries || []).reduce((sum, entry) => 
        sum + Number(entry.hours), 0);

      setStats({
        totalUsers: profiles?.length || 0,
        activeProjects: projects?.length || 0,
        totalHours: Number(totalHours),
        pendingInvoices: invoices?.length || 0
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: User,
      color: 'text-webdev-gradient-blue'
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: FolderOpen,
      color: 'text-webdev-gradient-purple'
    },
    {
      title: 'Total Hours',
      value: `${stats.totalHours.toFixed(1)}h`,
      icon: Clock,
      color: 'text-green-400'
    },
    {
      title: 'Pending Invoices',
      value: stats.pendingInvoices,
      icon: Receipt,
      color: 'text-yellow-400'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-effect rounded-xl p-6 border border-webdev-glass-border animate-pulse">
            <div className="w-8 h-8 bg-webdev-darker-gray rounded mb-4"></div>
            <div className="h-4 bg-webdev-darker-gray rounded mb-2"></div>
            <div className="h-6 bg-webdev-darker-gray rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div key={card.title} className="glass-effect rounded-xl p-6 border border-webdev-glass-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-webdev-soft-gray text-sm font-medium">{card.title}</p>
                <p className="text-2xl font-bold text-webdev-silver mt-1">{card.value}</p>
              </div>
              <IconComponent className={`w-8 h-8 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStats;
