
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
  milestones: Milestone[];
  totalHours: number;
  isOpen: boolean;
  onClose: () => void;
}

const MilestoneDetailsModal = ({ milestones, totalHours, isOpen, onClose }: MilestoneDetailsModalProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-webdev-gradient-blue" />;
      case 'pending':
        return <Target className="w-4 h-4 text-webdev-soft-gray" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
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

  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const completionRate = milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-webdev-glass-border bg-webdev-black text-webdev-silver max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl sm:text-2xl font-light text-webdev-silver">
            <Target className="w-6 h-6 text-webdev-gradient-blue" />
            Milestones & Time Tracking
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border text-center">
              <div className="text-webdev-gradient-blue font-semibold text-lg">{totalHours.toFixed(1)}h</div>
              <div className="text-webdev-soft-gray text-sm">Total Hours</div>
            </div>
            <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border text-center">
              <div className="text-webdev-gradient-purple font-semibold text-lg">{completionRate.toFixed(0)}%</div>
              <div className="text-webdev-soft-gray text-sm">Complete</div>
            </div>
          </div>

          {/* Milestones List */}
          <div className="space-y-4">
            {milestones.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-webdev-soft-gray mx-auto mb-4 opacity-50" />
                <p className="text-webdev-soft-gray text-lg">No milestones yet</p>
                <p className="text-webdev-soft-gray/70">Project milestones will appear here as they're created</p>
              </div>
            ) : (
              milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="glass-effect rounded-xl p-4 sm:p-6 border border-webdev-glass-border hover:border-webdev-gradient-blue/50 transition-all duration-300"
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
                        {milestone.description && (
                          <p className="text-webdev-soft-gray mb-3 text-sm sm:text-base break-words">{milestone.description}</p>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-webdev-soft-gray">
                          {milestone.due_date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">Due: {format(new Date(milestone.due_date), 'MMM d, yyyy')}</span>
                            </div>
                          )}
                          {milestone.hours_logged > 0 && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-webdev-gradient-blue flex-shrink-0" />
                              <span className="text-webdev-gradient-blue font-medium whitespace-nowrap">
                                {milestone.hours_logged}h logged
                              </span>
                            </div>
                          )}
                          {milestone.completion_date && (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <span className="text-green-400 truncate">
                                Completed: {format(new Date(milestone.completion_date), 'MMM d, yyyy')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MilestoneDetailsModal;
