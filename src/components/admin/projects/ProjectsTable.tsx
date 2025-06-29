
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Search, User } from 'lucide-react';
import EditProjectModal from './EditProjectModal';
import AssignUserModal from './AssignUserModal';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
    username: string;
  };
  total_hours: number;
  invoice_total: number;
  assigned_users: number;
}

const ProjectsTable = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [assigningProject, setAssigningProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_admin_projects_data');

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch projects',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });

      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      planning: 'bg-yellow-500/20 text-yellow-400',
      in_progress: 'bg-blue-500/20 text-blue-400',
      review: 'bg-purple-500/20 text-purple-400',
      completed: 'bg-green-500/20 text-green-400',
      on_hold: 'bg-red-500/20 text-red-400',
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-500/20 text-gray-400'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-webdev-gradient-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-webdev-soft-gray w-4 h-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
          />
        </div>
      </div>

      <div className="glass-effect rounded-xl border border-webdev-glass-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-webdev-glass-border hover:bg-webdev-darker-gray/50">
              <TableHead className="text-webdev-silver font-medium">Project Name</TableHead>
              <TableHead className="text-webdev-silver font-medium">Owner</TableHead>
              <TableHead className="text-webdev-silver font-medium">Status</TableHead>
              <TableHead className="text-webdev-silver font-medium">Hours Logged</TableHead>
              <TableHead className="text-webdev-silver font-medium">Invoice Total</TableHead>
              <TableHead className="text-webdev-silver font-medium">Assigned Users</TableHead>
              <TableHead className="text-webdev-silver font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow 
                key={project.id} 
                className="border-webdev-glass-border hover:bg-webdev-darker-gray/30"
              >
                <TableCell className="text-webdev-silver">
                  <div>
                    <div className="font-medium">{project.title}</div>
                    {project.description && (
                      <div className="text-sm text-webdev-soft-gray truncate max-w-xs">
                        {project.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-webdev-soft-gray">
                  {project.profiles?.full_name || project.profiles?.username || 'N/A'}
                </TableCell>
                <TableCell>
                  {getStatusBadge(project.status)}
                </TableCell>
                <TableCell className="text-webdev-soft-gray">
                  {project.total_hours || 0} hrs
                </TableCell>
                <TableCell className="text-webdev-soft-gray">
                  ${(project.invoice_total || 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-webdev-soft-gray">
                  {project.assigned_users || 0}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAssigningProject(project)}
                      className="text-webdev-soft-gray hover:text-webdev-gradient-blue"
                    >
                      <User className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingProject(project)}
                      className="text-webdev-soft-gray hover:text-webdev-gradient-blue"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-webdev-soft-gray hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredProjects.length === 0 && (
          <div className="text-center py-8 text-webdev-soft-gray">
            {searchTerm ? 'No projects match your search.' : 'No projects found.'}
          </div>
        )}
      </div>

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          onSuccess={fetchProjects}
        />
      )}

      {assigningProject && (
        <AssignUserModal
          project={assigningProject}
          isOpen={!!assigningProject}
          onClose={() => setAssigningProject(null)}
          onSuccess={fetchProjects}
        />
      )}
    </div>
  );
};

export default ProjectsTable;
