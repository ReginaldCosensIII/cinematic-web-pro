import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Users, DollarSign, Clock } from 'lucide-react';
import ProjectDetailsModal from './ProjectDetailsModal';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    username: string;
  };
  total_hours: number;
  invoice_total: number;
  assigned_users: number;
}

const AdminProjectOverview = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['admin-projects-overview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_admin_projects_data');
      
      if (error) throw error;
      return data as Project[];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'planning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'on-hold': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-webdev-soft-gray/20 text-webdev-soft-gray border-webdev-soft-gray/30';
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-effect border-webdev-glass-border">
        <CardHeader>
          <CardTitle className="text-webdev-silver">Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-webdev-soft-gray">Loading projects...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="glass-effect border-webdev-glass-border">
        <CardHeader>
          <CardTitle className="text-webdev-silver flex items-center gap-2">
            <Users className="w-5 h-5" />
            Recent Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.slice(0, 5).map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 rounded-lg bg-webdev-darker-gray/30 border border-webdev-glass-border hover:bg-webdev-darker-gray/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-webdev-silver font-medium">{project.title}</h3>
                    <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-webdev-soft-gray text-sm mb-2 line-clamp-1">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-webdev-soft-gray">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {project.profiles?.full_name || 'Unknown Client'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {project.total_hours}h logged
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      ${project.invoice_total}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProject(project)}
                    className="text-webdev-soft-gray hover:text-webdev-silver"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-8 text-webdev-soft-gray">
                No projects found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
};

export default AdminProjectOverview;