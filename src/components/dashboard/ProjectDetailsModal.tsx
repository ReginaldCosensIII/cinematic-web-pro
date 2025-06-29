
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Target, User, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  start_date: string;
  last_updated: string;
  total_hours: number;
}

interface ProjectDetailsModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailsModal = ({ project, isOpen, onClose }: ProjectDetailsModalProps) => {
  if (!project) return null;

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

  const estimatedValue = project.total_hours * 75; // Assuming $75/hour rate

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-webdev-glass-border bg-webdev-black max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-webdev-silver text-xl md:text-2xl font-light">
            Project Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Project Header */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg md:text-xl font-medium text-webdev-silver">{project.title}</h2>
              <Badge className={`px-3 py-1 text-sm font-medium self-start sm:self-center ${getStatusColor(project.status)}`}>
                {formatStatus(project.status)}
              </Badge>
            </div>
            
            {project.description && (
              <p className="text-webdev-soft-gray leading-relaxed">{project.description}</p>
            )}
          </div>

          {/* Project Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-webdev-gradient-blue" />
                <span className="text-webdev-soft-gray text-sm">Hours Logged</span>
              </div>
              <div className="text-2xl font-semibold text-webdev-silver">
                {project.total_hours.toFixed(1)}h
              </div>
            </div>

            <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-webdev-soft-gray text-sm">Estimated Value</span>
              </div>
              <div className="text-2xl font-semibold text-webdev-silver">
                ${estimatedValue.toLocaleString()}
              </div>
            </div>

            <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-webdev-gradient-purple" />
                <span className="text-webdev-soft-gray text-sm">Start Date</span>
              </div>
              <div className="text-lg font-medium text-webdev-silver">
                {project.start_date ? format(new Date(project.start_date), 'MMM d, yyyy') : 'Not set'}
              </div>
            </div>

            <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-yellow-400" />
                <span className="text-webdev-soft-gray text-sm">Last Updated</span>
              </div>
              <div className="text-lg font-medium text-webdev-silver">
                {format(new Date(project.last_updated), 'MMM d, yyyy')}
              </div>
            </div>
          </div>

          {/* Project Timeline */}
          <div className="glass-effect rounded-xl p-6 border border-webdev-glass-border">
            <h3 className="text-lg font-medium text-webdev-silver mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-webdev-gradient-blue" />
              Project Timeline
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-webdev-gradient-blue"></div>
                <div className="flex-1">
                  <div className="text-webdev-silver font-medium">Project Started</div>
                  <div className="text-webdev-soft-gray text-sm">
                    {project.start_date ? format(new Date(project.start_date), 'MMMM d, yyyy') : 'Start date not set'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-webdev-gradient-purple"></div>
                <div className="flex-1">
                  <div className="text-webdev-silver font-medium">Current Status</div>
                  <div className="text-webdev-soft-gray text-sm">
                    {formatStatus(project.status)} - Last updated {format(new Date(project.last_updated), 'MMMM d, yyyy')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-webdev-soft-gray"></div>
                <div className="flex-1">
                  <div className="text-webdev-silver font-medium">Total Hours</div>
                  <div className="text-webdev-soft-gray text-sm">
                    {project.total_hours.toFixed(1)} hours logged across all sessions
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Project Info */}
          <div className="glass-effect rounded-xl p-6 border border-webdev-glass-border">
            <h3 className="text-lg font-medium text-webdev-silver mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-webdev-gradient-blue" />
              Project Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-webdev-soft-gray">Project ID:</span>
                <div className="text-webdev-silver font-mono mt-1">{project.id}</div>
              </div>
              <div>
                <span className="text-webdev-soft-gray">Average Hours/Day:</span>
                <div className="text-webdev-silver mt-1">
                  {project.start_date ? (
                    (project.total_hours / Math.max(1, Math.ceil((new Date().getTime() - new Date(project.start_date).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(1)
                  ) : '0'} hrs
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;
