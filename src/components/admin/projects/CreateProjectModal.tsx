
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

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface User {
  id: string;
  full_name: string;
  username: string;
}

const CreateProjectModal = ({ isOpen, onClose, onSuccess }: CreateProjectModalProps) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'planning',
    user_id: '',
    start_date: '',
  });
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('projects')
        .insert([{
          title: formData.title,
          description: formData.description,
          status: formData.status,
          user_id: formData.user_id,
          start_date: formData.start_date || null,
        }]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Project created successfully',
      });

      setFormData({
        title: '',
        description: '',
        status: 'planning',
        user_id: '',
        start_date: '',
      });
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project',
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
          <DialogTitle className="text-webdev-silver text-xl">
            Create New Project
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-webdev-silver">
              Project Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-webdev-black border-webdev-glass-border text-webdev-silver min-h-20"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user_id" className="text-webdev-silver">
              Assign to Client *
            </Label>
            <Select
              value={formData.user_id}
              onValueChange={(value) => setFormData({ ...formData, user_id: value })}
            >
              <SelectTrigger className="bg-webdev-black border-webdev-glass-border text-webdev-silver">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent className="bg-webdev-darker-gray border-webdev-glass-border">
                {users.map((user) => (
                  <SelectItem
                    key={user.id}
                    value={user.id}
                    className="text-webdev-silver hover:bg-webdev-black"
                  >
                    {user.full_name || user.username || 'Unknown User'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-webdev-silver">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger className="bg-webdev-black border-webdev-glass-border text-webdev-silver">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-webdev-darker-gray border-webdev-glass-border">
                <SelectItem value="planning" className="text-webdev-silver hover:bg-webdev-black">
                  Planning
                </SelectItem>
                <SelectItem value="in_progress" className="text-webdev-silver hover:bg-webdev-black">
                  In Progress
                </SelectItem>
                <SelectItem value="review" className="text-webdev-silver hover:bg-webdev-black">
                  Review
                </SelectItem>
                <SelectItem value="completed" className="text-webdev-silver hover:bg-webdev-black">
                  Completed
                </SelectItem>
                <SelectItem value="on_hold" className="text-webdev-silver hover:bg-webdev-black">
                  On Hold
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="start_date" className="text-webdev-silver">
              Start Date
            </Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="bg-webdev-black border-webdev-glass-border text-webdev-silver"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-webdev-glass-border text-webdev-silver hover:bg-webdev-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.title || !formData.user_id}
              className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple hover:opacity-90 text-white"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
