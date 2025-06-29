
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Project {
  id: string;
  title: string;
}

interface AssignUserModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface User {
  id: string;
  full_name: string;
  username: string;
  assigned: boolean;
}

const AssignUserModal = ({ project, isOpen, onClose, onSuccess }: AssignUserModalProps) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [originalAssignments, setOriginalAssignments] = useState<Set<string>>(new Set());
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const fetchUsersAndAssignments = async () => {
    try {
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .order('full_name');

      if (usersError) throw usersError;

      // Fetch current assignments for this project
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('project_assignments')
        .select('user_id')
        .eq('project_id', project.id);

      if (assignmentsError) throw assignmentsError;

      const assignedUserIds = new Set(assignmentsData?.map(a => a.user_id) || []);
      setOriginalAssignments(assignedUserIds);

      const usersWithAssignments = (usersData || []).map(user => ({
        ...user,
        assigned: assignedUserIds.has(user.id),
      }));

      setUsers(usersWithAssignments);
    } catch (error) {
      console.error('Error fetching users and assignments:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user data',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsersAndAssignments();
    }
  }, [isOpen, project.id]);

  const handleUserToggle = (userId: string, assigned: boolean) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, assigned } : user
    ));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const currentAssignments = new Set(users.filter(u => u.assigned).map(u => u.id));
      const toAdd = [...currentAssignments].filter(id => !originalAssignments.has(id));
      const toRemove = [...originalAssignments].filter(id => !currentAssignments.has(id));

      // Remove assignments
      if (toRemove.length > 0) {
        const { error: removeError } = await supabase
          .from('project_assignments')
          .delete()
          .eq('project_id', project.id)
          .in('user_id', toRemove);

        if (removeError) throw removeError;
      }

      // Add new assignments
      if (toAdd.length > 0) {
        const newAssignments = toAdd.map(userId => ({
          project_id: project.id,
          user_id: userId,
          assigned_by: currentUser?.id,
        }));

        const { error: addError } = await supabase
          .from('project_assignments')
          .insert(newAssignments);

        if (addError) throw addError;
      }

      toast({
        title: 'Success',
        description: 'Project assignments updated successfully',
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating assignments:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project assignments',
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
            Assign Users to Project
          </DialogTitle>
          <p className="text-webdev-soft-gray text-sm">
            {project.title}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-webdev-silver">
              Select Users to Assign
            </Label>
            <ScrollArea className="h-64 w-full rounded border border-webdev-glass-border p-2">
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2 p-2 rounded hover:bg-webdev-black/30">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={user.assigned}
                      onCheckedChange={(checked) => handleUserToggle(user.id, !!checked)}
                      className="border-webdev-glass-border"
                    />
                    <Label
                      htmlFor={`user-${user.id}`}
                      className="text-webdev-silver cursor-pointer flex-1"
                    >
                      {user.full_name || user.username || 'Unknown User'}
                    </Label>
                    {originalAssignments.has(user.id) && (
                      <Badge variant="outline" className="text-xs border-webdev-gradient-blue text-webdev-gradient-blue">
                        Currently Assigned
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
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
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple hover:opacity-90 text-white"
            >
              {loading ? 'Updating...' : 'Update Assignments'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignUserModal;
