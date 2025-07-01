
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, FolderOpen, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface TimeEntry {
  id: string;
  project_title: string;
  hours: number;
  description: string;
  date: string;
  created_at: string;
}

interface TimeEntryDetailsModalProps {
  timeEntry: TimeEntry;
  isOpen: boolean;
  onClose: () => void;
}

const TimeEntryDetailsModal = ({ timeEntry, isOpen, onClose }: TimeEntryDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-webdev-glass-border bg-webdev-black text-webdev-silver max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl sm:text-2xl font-light text-webdev-silver">
            <Clock className="w-6 h-6 text-webdev-gradient-blue" />
            Time Entry Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hours Display */}
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-light text-webdev-gradient-blue mb-2">
              {timeEntry.hours}h
            </div>
            <div className="text-webdev-soft-gray text-sm">Hours Logged</div>
          </div>

          {/* Project Information */}
          <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border">
            <div className="flex items-center gap-2 mb-2">
              <FolderOpen className="w-4 h-4 text-webdev-gradient-blue" />
              <span className="text-webdev-soft-gray text-sm">Project</span>
            </div>
            <div className="text-webdev-silver font-medium text-lg">
              {timeEntry.project_title}
            </div>
          </div>

          {/* Description */}
          {timeEntry.description && (
            <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-webdev-gradient-purple" />
                <span className="text-webdev-soft-gray text-sm">Description</span>
              </div>
              <p className="text-webdev-silver text-sm sm:text-base break-words">{timeEntry.description}</p>
            </div>
          )}

          {/* Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-webdev-gradient-blue" />
                <span className="text-webdev-soft-gray text-sm">Work Date</span>
              </div>
              <div className="text-webdev-silver font-medium">
                {format(new Date(timeEntry.date), 'MMM d, yyyy')}
              </div>
            </div>

            <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-webdev-gradient-purple" />
                <span className="text-webdev-soft-gray text-sm">Logged On</span>
              </div>
              <div className="text-webdev-silver font-medium">
                {format(new Date(timeEntry.created_at), 'MMM d, yyyy')}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border bg-webdev-gradient-blue/5">
            <div className="text-center">
              <div className="text-webdev-gradient-blue font-semibold text-lg">Time Entry Logged</div>
              <div className="text-webdev-soft-gray text-sm">
                {timeEntry.hours} hour{timeEntry.hours !== 1 ? 's' : ''} of work completed on {timeEntry.project_title}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimeEntryDetailsModal;
