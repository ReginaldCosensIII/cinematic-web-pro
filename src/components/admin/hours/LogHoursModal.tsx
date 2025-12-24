
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TimeEntry {
  id: string;
  date: string;
  hours: number;
  description: string;
  project_id: string;
  project_title: string;
  client_name: string;
  client_id: string;
  created_at: string;
}

interface Client {
  id: string;
  full_name: string;
}

interface Project {
  id: string;
  title: string;
  user_id: string;
}

interface LogHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingEntry?: TimeEntry | null;
}

const LogHoursModal = ({ isOpen, onClose, onSuccess, editingEntry }: LogHoursModalProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchClients();
      if (editingEntry) {
        setSelectedClientId(editingEntry.client_id);
        setSelectedProjectId(editingEntry.project_id);
        setDate(editingEntry.date);
        setHours(editingEntry.hours.toString());
        setDescription(editingEntry.description || '');
      } else {
        resetForm();
      }
    }
  }, [isOpen, editingEntry]);

  useEffect(() => {
    if (selectedClientId) {
      fetchProjectsForClient(selectedClientId);
    } else {
      setProjects([]);
      setSelectedProjectId('');
    }
  }, [selectedClientId]);

  const resetForm = () => {
    setSelectedClientId('');
    setSelectedProjectId('');
    setDate(new Date().toISOString().split('T')[0]);
    setHours('');
    setDescription('');
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch clients',
        variant: 'destructive',
      });
    }
  };

  const fetchProjectsForClient = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, user_id')
        .eq('user_id', clientId)
        .order('title');

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch projects',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProjectId || !date || !hours) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const timeEntryData = {
        user_id: selectedClientId,
        project_id: selectedProjectId,
        date,
        hours: parseFloat(hours),
        description: description.trim() || null,
      };

      if (editingEntry) {
        const { error } = await supabase
          .from('time_entries')
          .update(timeEntryData)
          .eq('id', editingEntry.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Time entry updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('time_entries')
          .insert([timeEntryData]);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Time entry logged successfully',
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving time entry:', error);
      toast({
        title: 'Error',
        description: `Failed to ${editingEntry ? 'update' : 'log'} time entry`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editingEntry ? 'Edit Time Entry' : 'Log New Hours'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client" className="text-webdev-silver">
              Client <span className="text-red-400">*</span>
            </Label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger className="bg-webdev-black border-webdev-glass-border text-webdev-silver">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent className="bg-webdev-darker-gray border-webdev-glass-border">
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id} className="text-webdev-silver">
                    {client.full_name || 'Unknown Client'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project" className="text-webdev-silver">
              Project <span className="text-red-400">*</span>
            </Label>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId} disabled={!selectedClientId}>
              <SelectTrigger className="bg-webdev-black border-webdev-glass-border text-webdev-silver">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent className="bg-webdev-darker-gray border-webdev-glass-border">
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id} className="text-webdev-silver">
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-webdev-silver">
              Date <span className="text-red-400">*</span>
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-webdev-black border-webdev-glass-border text-webdev-silver"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours" className="text-webdev-silver">
              Hours Worked <span className="text-red-400">*</span>
            </Label>
            <Input
              id="hours"
              type="number"
              step="0.25"
              min="0"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g., 2.5"
              className="bg-webdev-black border-webdev-glass-border text-webdev-silver"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-webdev-silver">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes about the work done..."
              className="bg-webdev-black border-webdev-glass-border text-webdev-silver resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="glass"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              variant="glass"
            >
              {loading ? 'Saving...' : editingEntry ? 'Update Entry' : 'Log Hours'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LogHoursModal;
