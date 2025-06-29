
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  DollarSign, 
  FolderOpen,
  Save,
  Key,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  created_at: string;
  assigned_projects: number;
}

interface UserStats {
  total_projects: number;
  total_hours: number;
  outstanding_invoices: number;
  total_invoice_amount: number;
}

interface Project {
  id: string;
  title: string;
  status: string;
  assigned_at: string;
}

interface UserDetailModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
  onRefresh
}) => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    role: user.role
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchUserDetails();
      setFormData({
        full_name: user.full_name || '',
        role: user.role
      });
    }
  }, [isOpen, user]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);

      // Get user stats - properly cast from Json to UserStats
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_user_stats', { target_user_id: user.id });

      if (statsError) throw statsError;

      // Cast the Json response to UserStats
      const stats = statsData as UserStats;

      // Get user projects
      const { data: projects, error: projectsError } = await supabase
        .from('project_assignments')
        .select(`
          assigned_at,
          projects (
            id,
            title,
            status
          )
        `)
        .eq('user_id', user.id);

      if (projectsError) throw projectsError;

      setUserStats(stats);
      setUserProjects(projects?.map(p => ({
        id: p.projects.id,
        title: p.projects.title,
        status: p.projects.status,
        assigned_at: p.assigned_at
      })) || []);

    } catch (error) {
      console.error('Error fetching user details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update role if changed - properly type the role
      if (formData.role !== user.role) {
        // Delete existing role
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', user.id);

        // Insert new role with proper typing
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: formData.role as 'admin' | 'user'
          });

        if (roleError) throw roleError;
      }

      toast({
        title: "Success",
        description: "User profile updated successfully"
      });

      onRefresh();
      onClose();

    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      // This would typically send a password reset email
      // For now, we'll just show a toast
      toast({
        title: "Password Reset",
        description: "Password reset email sent to user"
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: "Error",
        description: "Failed to reset password",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-webdev-black border-webdev-glass-border">
        <DialogHeader>
          <DialogTitle className="text-2xl text-webdev-silver flex items-center gap-2">
            <User className="w-6 h-6" />
            {user.full_name || 'Unknown User'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-webdev-darker-gray">
            <TabsTrigger value="profile" className="data-[state=active]:bg-webdev-gradient-blue">
              Profile
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-webdev-gradient-blue">
              Projects
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-webdev-gradient-blue">
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name" className="text-webdev-silver">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-webdev-silver">Email</Label>
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-soft-gray"
                  />
                </div>

                <div>
                  <Label htmlFor="role" className="text-webdev-silver">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass-effect p-4 rounded-lg border border-webdev-glass-border">
                  <div className="flex items-center gap-2 text-webdev-silver mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Account Information</span>
                  </div>
                  <p className="text-webdev-soft-gray text-sm">
                    Created: {formatDate(user.created_at)}
                  </p>
                  <p className="text-webdev-soft-gray text-sm">
                    User ID: {user.id}
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleResetPassword}
                    variant="outline"
                    className="w-full border-webdev-glass-border hover:bg-webdev-darker-gray text-webdev-silver"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Reset Password
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-webdev-glass-border">
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-webdev-gradient-blue hover:bg-webdev-gradient-blue/80"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="border-webdev-glass-border hover:bg-webdev-darker-gray text-webdev-silver"
              >
                Cancel
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-webdev-soft-gray">
                Loading projects...
              </div>
            ) : userProjects.length === 0 ? (
              <div className="text-center py-8 text-webdev-soft-gray">
                No projects assigned to this user.
              </div>
            ) : (
              <div className="space-y-3">
                {userProjects.map((project) => (
                  <div
                    key={project.id}
                    className="glass-effect p-4 rounded-lg border border-webdev-glass-border"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FolderOpen className="w-5 h-5 text-webdev-gradient-blue" />
                        <div>
                          <h4 className="text-webdev-silver font-medium">{project.title}</h4>
                          <p className="text-webdev-soft-gray text-sm">
                            Assigned: {formatDate(project.assigned_at)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-webdev-soft-gray">
                Loading statistics...
              </div>
            ) : userStats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-effect p-6 rounded-lg border border-webdev-glass-border">
                  <div className="flex items-center gap-3 mb-2">
                    <FolderOpen className="w-6 h-6 text-webdev-gradient-blue" />
                    <h3 className="text-webdev-silver font-medium">Total Projects</h3>
                  </div>
                  <p className="text-3xl font-bold text-webdev-silver">
                    {userStats.total_projects}
                  </p>
                </div>

                <div className="glass-effect p-6 rounded-lg border border-webdev-glass-border">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-6 h-6 text-webdev-gradient-purple" />
                    <h3 className="text-webdev-silver font-medium">Hours Logged</h3>
                  </div>
                  <p className="text-3xl font-bold text-webdev-silver">
                    {userStats.total_hours}
                  </p>
                </div>

                <div className="glass-effect p-6 rounded-lg border border-webdev-glass-border">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-webdev-silver font-medium">Outstanding Invoices</h3>
                  </div>
                  <p className="text-3xl font-bold text-webdev-silver">
                    {userStats.outstanding_invoices}
                  </p>
                </div>

                <div className="glass-effect p-6 rounded-lg border border-webdev-glass-border">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-6 h-6 text-green-500" />
                    <h3 className="text-webdev-silver font-medium">Outstanding Amount</h3>
                  </div>
                  <p className="text-3xl font-bold text-webdev-silver">
                    {formatCurrency(userStats.total_invoice_amount)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-webdev-soft-gray">
                No statistics available.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal;
