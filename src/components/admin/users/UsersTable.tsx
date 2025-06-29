
import React, { useState } from 'react';
import { Search, RefreshCw, Users, UserPlus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  created_at: string;
  assigned_projects: number;
}

interface UsersTableProps {
  users: User[];
  loading: boolean;
  onUserSelect: (user: User) => void;
  onRefresh: () => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ 
  users, 
  loading, 
  onUserSelect, 
  onRefresh 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof User>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredUsers = users
    .filter(user => 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {/* Header with search and actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 text-webdev-silver">
          <Users className="w-5 h-5" />
          <span className="font-medium">
            {filteredUsers.length} {filteredUsers.length === 1 ? 'User' : 'Users'}
          </span>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-webdev-soft-gray w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver placeholder:text-webdev-soft-gray"
            />
          </div>
          <Button
            onClick={onRefresh}
            disabled={loading}
            variant="outline"
            size="icon"
            className="border-webdev-glass-border hover:bg-webdev-darker-gray"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Users table */}
      <div className="rounded-lg border border-webdev-glass-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-webdev-glass-border hover:bg-webdev-darker-gray/50">
              <TableHead 
                className="text-webdev-silver cursor-pointer hover:text-white"
                onClick={() => handleSort('full_name')}
              >
                Name {sortField === 'full_name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="text-webdev-silver cursor-pointer hover:text-white"
                onClick={() => handleSort('email')}
              >
                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="text-webdev-silver cursor-pointer hover:text-white"
                onClick={() => handleSort('role')}
              >
                Role {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="text-webdev-silver cursor-pointer hover:text-white"
                onClick={() => handleSort('created_at')}
              >
                Created {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="text-webdev-silver cursor-pointer hover:text-white"
                onClick={() => handleSort('assigned_projects')}
              >
                Projects {sortField === 'assigned_projects' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-webdev-soft-gray">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Loading users...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-webdev-soft-gray">
                  {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-webdev-glass-border hover:bg-webdev-darker-gray/50 cursor-pointer"
                  onClick={() => onUserSelect(user)}
                >
                  <TableCell className="text-webdev-silver font-medium">
                    {user.full_name || 'Unknown User'}
                  </TableCell>
                  <TableCell className="text-webdev-soft-gray">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-webdev-soft-gray">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell className="text-webdev-soft-gray">
                    {user.assigned_projects}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersTable;
