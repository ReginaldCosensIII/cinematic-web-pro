
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import AdminSidebar from '@/components/admin/AdminSidebar';
import UsersTable from '@/components/admin/users/UsersTable';
import UserDetailModal from '@/components/admin/users/UserDetailModal';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  created_at: string;
  assigned_projects: number;
}

const AdminUsers = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (authLoading || adminLoading) return;
    
    if (!user || !isAdmin) {
      navigate(user ? '/dashboard' : '/auth');
      return;
    }

    fetchUsers();
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get all profiles with their roles and project assignments
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          created_at
        `);

      if (profilesError) throw profilesError;

      // Get user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Get project assignments count
      const { data: assignments, error: assignmentsError } = await supabase
        .from('project_assignments')
        .select('user_id');

      if (assignmentsError) throw assignmentsError;

      // Get user emails from auth metadata (we'll need to fetch this differently)
      // For now, we'll use a placeholder and enhance this later
      const usersData: User[] = profiles?.map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.id);
        const userAssignments = assignments?.filter(a => a.user_id === profile.id);
        
        return {
          id: profile.id,
          email: 'user@example.com', // This would need to be fetched from auth.users in a real scenario
          full_name: profile.full_name || 'Unknown User',
          role: userRole?.role || 'user',
          created_at: profile.created_at,
          assigned_projects: userAssignments?.length || 0
        };
      }) || [];

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-webdev-black flex items-center justify-center">
        <div className="text-webdev-silver">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-webdev-gradient-blue mx-auto mb-4"></div>
          Verifying permissions...
        </div>
      </div>
    );
  }

  // Only render if user is admin
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-24 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex gap-8">
            <div className="hidden lg:block w-64 flex-shrink-0">
              <AdminSidebar />
            </div>
            <div className="flex-1 space-y-6 md:space-y-8">
              <div className="glass-effect rounded-2xl p-4 md:p-8 border border-webdev-glass-border">
                <h1 className="text-2xl md:text-4xl font-light text-webdev-silver mb-2">
                  User <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-semibold">Management</span>
                </h1>
                <p className="text-webdev-soft-gray text-base md:text-lg">
                  Manage users, roles, and project assignments
                </p>
              </div>
              
              <div className="glass-effect rounded-2xl p-4 md:p-8 border border-webdev-glass-border">
                <UsersTable 
                  users={users}
                  loading={loading}
                  onUserSelect={setSelectedUser}
                  onRefresh={fetchUsers}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onRefresh={fetchUsers}
        />
      )}
    </div>
  );
};

export default AdminUsers;
