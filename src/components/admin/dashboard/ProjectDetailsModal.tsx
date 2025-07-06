import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, Clock, Calendar, User } from 'lucide-react';
import { formatDistance } from 'date-fns';

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

interface ProjectDetailsModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailsModal = ({ project, isOpen, onClose }: ProjectDetailsModalProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'planning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'on-hold': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-webdev-soft-gray/20 text-webdev-soft-gray border-webdev-soft-gray/30';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-webdev-darker-gray border border-webdev-glass-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-webdev-silver text-xl">{project.title}</DialogTitle>
            <Badge className={`${getStatusColor(project.status)}`}>
              {project.status}
            </Badge>
          </div>
          <DialogDescription className="text-webdev-soft-gray">
            Project details and statistics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Description */}
          <div>
            <h3 className="text-webdev-silver font-medium mb-2">Description</h3>
            <p className="text-webdev-soft-gray leading-relaxed">
              {project.description || 'No description provided'}
            </p>
          </div>

          {/* Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-effect p-4 rounded-lg border border-webdev-glass-border">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-webdev-gradient-blue" />
                <h4 className="text-webdev-silver font-medium">Client</h4>
              </div>
              <p className="text-webdev-soft-gray">
                {project.profiles?.full_name || 'Unknown Client'}
              </p>
              {project.profiles?.username && (
                <p className="text-webdev-soft-gray text-sm">
                  @{project.profiles.username}
                </p>
              )}
            </div>

            <div className="glass-effect p-4 rounded-lg border border-webdev-glass-border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-webdev-gradient-purple" />
                <h4 className="text-webdev-silver font-medium">Created</h4>
              </div>
              <p className="text-webdev-soft-gray">
                {formatDistance(new Date(project.created_at), new Date(), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Project Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-effect p-4 rounded-lg border border-webdev-glass-border text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-webdev-gradient-blue" />
              </div>
              <p className="text-2xl font-bold text-webdev-silver mb-1">
                {project.total_hours}
              </p>
              <p className="text-webdev-soft-gray text-sm">Hours Logged</p>
            </div>

            <div className="glass-effect p-4 rounded-lg border border-webdev-glass-border text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="w-5 h-5 text-webdev-gradient-purple" />
              </div>
              <p className="text-2xl font-bold text-webdev-silver mb-1">
                ${project.invoice_total}
              </p>
              <p className="text-webdev-soft-gray text-sm">Outstanding Invoices</p>
            </div>

            <div className="glass-effect p-4 rounded-lg border border-webdev-glass-border text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-webdev-gradient-blue" />
              </div>
              <p className="text-2xl font-bold text-webdev-silver mb-1">
                {project.assigned_users}
              </p>
              <p className="text-webdev-soft-gray text-sm">Assigned Users</p>
            </div>
          </div>

          {/* Additional Details */}
          <div className="pt-4 border-t border-webdev-glass-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-webdev-soft-gray">Project ID:</span>
                <p className="text-webdev-silver font-mono text-xs">{project.id}</p>
              </div>
              <div>
                <span className="text-webdev-soft-gray">Client ID:</span>
                <p className="text-webdev-silver font-mono text-xs">{project.user_id}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;