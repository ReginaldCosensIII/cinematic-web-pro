
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  start_date: string;
  last_updated: string;
  created_at: string;
}

const ProjectOverview = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
        .order('last_updated', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/20';
      case 'in_progress':
        return 'text-webdev-gradient-blue bg-blue-400/20';
      case 'planning':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'review':
        return 'text-webdev-gradient-purple bg-purple-400/20';
      case 'on_hold':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-webdev-soft-gray bg-gray-400/20';
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
              <div key={i} className="h-16 bg-webdev-darker-gray rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-2xl p-8 border border-webdev-glass-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light text-webdev-silver">Project Overview</h2>
        <span className="text-webdev-soft-gray">{projects.length} total projects</span>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-webdev-soft-gray mx-auto mb-4" />
          <p className="text-webdev-soft-gray text-lg">No projects yet</p>
          <p className="text-webdev-soft-gray/70">Your projects will appear here once they're created</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-effect rounded-xl p-6 border border-webdev-glass-border hover:border-webdev-gradient-blue/50 transition-all duration-300 group"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-medium text-webdev-silver group-hover:text-white transition-colors">
                      {project.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {formatStatus(project.status)}
                    </span>
                  </div>
                  {project.description && (
                    <p className="text-webdev-soft-gray mb-3">{project.description}</p>
                  )}
                  <div className="flex items-center gap-6 text-sm text-webdev-soft-gray">
                    {project.start_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Started {format(new Date(project.start_date), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Updated {format(new Date(project.last_updated), 'MMM d, yyyy')}</span>
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

export default ProjectOverview;
