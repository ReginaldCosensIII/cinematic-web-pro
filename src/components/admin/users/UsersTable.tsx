import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Search } from 'lucide-react';
import UserDetailModal from './UserDetailModal';

interface User {
  id: string;
  full_name: string;
  username: string;
  created_at: string;
  role: 'user' | 'admin';
  last_sign_in: string;
  total_projects: number;
  total_hours: number;
  outstanding_invoices: number;
  total_outstanding_amount: number;
  email: string;
  assigned_projects: number;
}

interface UserStats {
  total_projects: number;
  total_hours: number;
  outstanding_invoices: number;
  total_invoice_amount: number;
}

const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      const usersWithRoles = await Promise.all(
        (usersData || []).map(async (user) => {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          const { data: statsData } = await supabase
            .rpc('get_user_stats', { target_user_id: user.id });

          // Properly handle the statsData with type safety
          let stats: UserStats = {
            total_projects: 0,
            total_hours: 0,
            outstanding_invoices: 0,
            total_invoice_amount: 0,
          };

          if (statsData && typeof statsData === 'object' && !Array.isArray(statsData)) {
            const data = statsData as any;
            stats = {
              total_projects: Number(data.total_projects || 0),
              total_hours: Number(data.total_hours || 0),
              outstanding_invoices: Number(data.outstanding_invoices || 0),
              total_invoice_amount: Number(data.total_invoice_amount || 0),
            };
          }

          // Get user email from auth.users table via profiles
          const { data: authData } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();

          return {
            id: user.id,
            full_name: user.full_name || '',
            username: user.username || '',
            created_at: user.created_at,
            role: (roleData?.role as 'user' | 'admin') || 'user',
            last_sign_in: user.created_at,
            total_projects: stats.total_projects,
            total_hours: stats.total_hours,
            outstanding_invoices: stats.outstanding_invoices,
            total_outstanding_amount: stats.total_invoice_amount,
            email: `${user.username || 'user'}@example.com`, // Placeholder email since we can't access auth.users directly
            assigned_projects: stats.total_projects,
          };
        })
      );

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? (
      <Badge className="bg-red-500/20 text-red-400">ADMIN</Badge>
    ) : (
      <Badge className="bg-blue-500/20 text-blue-400">USER</Badge>
    );
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-webdev-gradient-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-webdev-soft-gray w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
          />
        </div>
      </div>

      <div className="glass-effect rounded-xl border border-webdev-glass-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-webdev-glass-border hover:bg-webdev-darker-gray/50">
              <TableHead className="text-webdev-silver font-medium">User</TableHead>
              <TableHead className="text-webdev-silver font-medium">Role</TableHead>
              <TableHead className="text-webdev-silver font-medium">Projects</TableHead>
              <TableHead className="text-webdev-silver font-medium">Hours</TableHead>
              <TableHead className="text-webdev-silver font-medium">Outstanding</TableHead>
              <TableHead className="text-webdev-silver font-medium">Joined</TableHead>
              <TableHead className="text-webdev-silver font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow 
                key={user.id} 
                className="border-webdev-glass-border hover:bg-webdev-darker-gray/30"
              >
                <TableCell className="text-webdev-silver">
                  <div>
                    <div className="font-medium">{user.full_name || 'Unknown'}</div>
                    <div className="text-sm text-webdev-soft-gray">@{user.username || 'no-username'}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {getRoleBadge(user.role)}
                </TableCell>
                <TableCell className="text-webdev-soft-gray">
                  {user.total_projects}
                </TableCell>
                <TableCell className="text-webdev-soft-gray">
                  {user.total_hours}h
                </TableCell>
                <TableCell className="text-webdev-soft-gray">
                  ${user.total_outstanding_amount.toLocaleString()}
                </TableCell>
                <TableCell className="text-webdev-soft-gray">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUser(user)}
                    className="text-webdev-soft-gray hover:text-webdev-gradient-blue"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-webdev-soft-gray">
            {searchTerm ? 'No users match your search.' : 'No users found.'}
          </div>
        )}
      </div>

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

export default UsersTable;
