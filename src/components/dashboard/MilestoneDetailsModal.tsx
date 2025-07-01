
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Target, Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
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

interface MilestoneDetailsModalProps {
  milestone: Milestone;
  totalHours: number;
  isOpen: boolean;
  onClose: () => void;
}

const MilestoneDetailsModal = ({ milestone, totalHours, isOpen, onClose }: MilestoneDetailsModalProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-400" />;
      case 'in_progress':
        return <Clock className="w-6 h-6 text-webdev-gradient-blue" />;
      case 'pending':
        return <Target className="w-6 h-6 text-webdev-soft-gray" />;
      default:
        return <AlertCircle className="w-6 h-6 text-yellow-400" />;
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-webdev-glass-border bg-webdev-black text-webdev-silver max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl sm:text-2xl font-light text-webdev-silver">
            {getStatusIcon(milestone.status)}
            {milestone.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex justify-start">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(milestone.status)}`}>
              {formatStatus(milestone.status)}
            </span>
          </div>

          {/* Description */}
          {milestone.description && (
            <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border">
              <h3 className="text-webdev-silver font-medium mb-2">Description</h3>
              <p className="text-webdev-soft-gray text-sm sm:text-base break-words">{milestone.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {milestone.due_date && (
              <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-webdev-gradient-blue" />
                  <span className="text-webdev-soft-gray text-sm">Due Date</span>
                </div>
                <div className="text-webdev-silver font-medium">
                  {format(new Date(milestone.due_date), 'MMM d, yyyy')}
                </div>
              </div>
            )}

            {milestone.hours_logged > 0 && (
              <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-webdev-gradient-purple" />
                  <span className="text-webdev-soft-gray text-sm">Hours Logged</span>
                </div>
                <div className="text-webdev-gradient-purple font-medium text-lg">
                  {milestone.hours_logged}h
                </div>
              </div>
            )}

            {milestone.completion_date && (
              <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border sm:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-webdev-soft-gray text-sm">Completed On</span>
                </div>
                <div className="text-green-400 font-medium">
                  {format(new Date(milestone.completion_date), 'MMM d, yyyy')}
                </div>
              </div>
            )}
          </div>

          {/* Total Hours Summary */}
          <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border bg-webdev-gradient-blue/5">
            <div className="text-center">
              <div className="text-webdev-gradient-blue font-semibold text-lg">{totalHours.toFixed(1)}h</div>
              <div className="text-webdev-soft-gray text-sm">Total Project Hours</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MilestoneDetailsModal;
