
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
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import LogHoursModal from './LogHoursModal';

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

const HoursTable = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const { toast } = useToast();

  const fetchTimeEntries = async () => {
    try {
      const { data, error } = await supabase.rpc('get_admin_time_entries');

      if (error) throw error;

      setTimeEntries(data || []);
    } catch (error) {
      console.error('Error fetching time entries:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch time entries',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeEntries();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this time entry?')) return;

    try {
      const { error } = await supabase
        .from('time_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Time entry deleted successfully',
      });

      fetchTimeEntries();
    } catch (error) {
      console.error('Error deleting time entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete time entry',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
  };

  const handleModalSuccess = () => {
    fetchTimeEntries();
    handleModalClose();
  };

  const filteredEntries = timeEntries.filter(entry =>
    entry.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.project_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalHours = filteredEntries.reduce((sum, entry) => sum + Number(entry.hours), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-webdev-gradient-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-webdev-soft-gray w-4 h-4" />
          <Input
            placeholder="Search time entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
          />
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log New Hours
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Badge variant="outline" className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver">
          Total Hours: {totalHours.toFixed(2)}h
        </Badge>
        <span className="text-sm text-webdev-soft-gray">
          {filteredEntries.length} entries
        </span>
      </div>

      <div className="glass-effect rounded-xl border border-webdev-glass-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-webdev-glass-border hover:bg-webdev-darker-gray/50">
              <TableHead className="text-webdev-silver font-medium">Client Name</TableHead>
              <TableHead className="text-webdev-silver font-medium">Project Name</TableHead>
              <TableHead className="text-webdev-silver font-medium">Date</TableHead>
              <TableHead className="text-webdev-silver font-medium">Hours</TableHead>
              <TableHead className="text-webdev-silver font-medium">Description</TableHead>
              <TableHead className="text-webdev-silver font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.map((entry) => (
              <TableRow 
                key={entry.id} 
                className="border-webdev-glass-border hover:bg-webdev-darker-gray/30"
              >
                <TableCell className="text-webdev-silver font-medium">
                  {entry.client_name || 'Unknown Client'}
                </TableCell>
                <TableCell className="text-webdev-soft-gray">
                  {entry.project_title || 'Unknown Project'}
                </TableCell>
                <TableCell className="text-webdev-soft-gray">
                  {new Date(entry.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-webdev-soft-gray">
                  {Number(entry.hours).toFixed(2)}h
                </TableCell>
                <TableCell className="text-webdev-soft-gray max-w-xs truncate">
                  {entry.description || 'No description'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(entry)}
                      className="text-webdev-soft-gray hover:text-webdev-gradient-blue"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      className="text-webdev-soft-gray hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredEntries.length === 0 && (
          <div className="text-center py-8 text-webdev-soft-gray">
            {searchTerm ? 'No time entries match your search.' : 'No time entries found.'}
          </div>
        )}
      </div>

      {isModalOpen && (
        <LogHoursModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          editingEntry={editingEntry}
        />
      )}
    </div>
  );
};

export default HoursTable;
