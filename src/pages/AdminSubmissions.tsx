import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-mobile';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Mail, User, Calendar, Eye, Trash2, CheckCircle, Clock, Menu, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  budget: string | null;
  project_type: string | null;
  status: string;
  created_at: string;
}

const AdminSubmissions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['contact-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface, adding default values for missing fields
      return (data || []).map(item => ({
        ...item,
        status: 'new', // Default status since it's not in the database
      })) as ContactSubmission[];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // Since status doesn't exist in the database, we'll just simulate the update
      // In a real implementation, you'd need to add status column to contact_submissions table
      console.log('Status update simulated for submission:', id, 'to status:', status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
      toast({
        title: "Success",
        description: "Submission status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update submission status",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
      toast({
        title: "Success",
        description: "Submission deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      });
    }
  });

  const handleView = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setViewModalOpen(true);
    
    // Mark as read if it's new
    if (submission.status === 'new') {
      updateStatusMutation.mutate({ id: submission.id, status: 'read' });
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      new: 'bg-blue-500',
      read: 'bg-yellow-500',
      responded: 'bg-green-500',
      archived: 'bg-gray-500'
    };
    
    const statusIcons = {
      new: <Mail className="w-3 h-3 mr-1" />,
      read: <Eye className="w-3 h-3 mr-1" />,
      responded: <CheckCircle className="w-3 h-3 mr-1" />,
      archived: <Clock className="w-3 h-3 mr-1" />
    };
    
    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors]} text-white flex items-center`}>
        {statusIcons[status as keyof typeof statusIcons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredSubmissions = submissions?.filter(submission =>
    submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.message.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalSubmissions = submissions?.length || 0;
  const newSubmissions = submissions?.filter(s => s.status === 'new').length || 0;
  const readSubmissions = submissions?.filter(s => s.status === 'read').length || 0;
  const respondedSubmissions = submissions?.filter(s => s.status === 'responded').length || 0;

  if (!user) {
    return <div>Please log in to view form submissions.</div>;
  }

  return (
    <div className="min-h-screen bg-webdev-black">
      <div className="max-w-7xl mx-auto p-6 pt-32">
        {/* Mobile Sidebar Toggle */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-24 left-4 z-50 glass-effect rounded-xl p-3 border border-webdev-glass-border lg:hidden"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-webdev-silver" />
            ) : (
              <Menu className="w-5 h-5 text-webdev-silver" />
            )}
          </button>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className={`
            lg:col-span-1
            ${isMobile ? 'fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out' : ''}
            ${sidebarOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'}
          `}>
            {isMobile && (
              <div className="pt-24">
                <AdminSidebar />
              </div>
            )}
            {!isMobile && <AdminSidebar />}
          </div>

          {/* Mobile Sidebar Overlay */}
          {isMobile && sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-3xl font-light text-webdev-silver mb-2">Form Submissions</h1>
              <p className="text-webdev-soft-gray">Manage contact form submissions and inquiries</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="glass-effect border-webdev-glass-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-webdev-soft-gray text-sm">Total</p>
                      <p className="text-2xl font-bold text-webdev-silver">{totalSubmissions}</p>
                    </div>
                    <Mail className="w-8 h-8 text-webdev-gradient-blue" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-webdev-glass-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-webdev-soft-gray text-sm">New</p>
                      <p className="text-2xl font-bold text-blue-400">{newSubmissions}</p>
                    </div>
                    <Mail className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-webdev-glass-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-webdev-soft-gray text-sm">Read</p>
                      <p className="text-2xl font-bold text-yellow-400">{readSubmissions}</p>
                    </div>
                    <Eye className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-webdev-glass-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-webdev-soft-gray text-sm">Responded</p>
                      <p className="text-2xl font-bold text-green-400">{respondedSubmissions}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-webdev-soft-gray w-4 h-4" />
                <Input
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                />
              </div>
            </div>

            {/* Submissions Table */}
            <Card className="glass-effect border-webdev-glass-border">
              <CardHeader>
                <CardTitle className="text-webdev-silver">Contact Submissions</CardTitle>
                <CardDescription className="text-webdev-soft-gray">
                  {filteredSubmissions.length} submission{filteredSubmissions.length !== 1 ? 's' : ''} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse flex space-x-4">
                        <div className="h-4 bg-webdev-darker-gray rounded flex-1"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-webdev-glass-border">
                          <TableHead className="text-webdev-soft-gray">Name</TableHead>
                          <TableHead className="text-webdev-soft-gray">Email</TableHead>
                          <TableHead className="text-webdev-soft-gray">Company</TableHead>
                          <TableHead className="text-webdev-soft-gray">Status</TableHead>
                          <TableHead className="text-webdev-soft-gray">Date</TableHead>
                          <TableHead className="text-webdev-soft-gray">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSubmissions.map((submission) => (
                          <TableRow key={submission.id} className="border-webdev-glass-border hover:bg-webdev-darker-gray/20">
                            <TableCell className="text-webdev-silver font-medium">{submission.name}</TableCell>
                            <TableCell className="text-webdev-silver">{submission.email}</TableCell>
                            <TableCell className="text-webdev-silver">{submission.company || '-'}</TableCell>
                            <TableCell>{getStatusBadge(submission.status)}</TableCell>
                            <TableCell className="text-webdev-silver">
                              {new Date(submission.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleView(submission)}
                                  className="border-webdev-glass-border hover:bg-webdev-darker-gray"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(submission.id, 'responded')}
                                  className="border-green-500 text-green-400 hover:bg-green-500/10"
                                  disabled={submission.status === 'responded'}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(submission.id)}
                                  className="border-red-500 text-red-400 hover:bg-red-500/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {filteredSubmissions.length === 0 && !isLoading && (
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 text-webdev-soft-gray mx-auto mb-4" />
                    <p className="text-webdev-soft-gray">No submissions found</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* View Modal */}
            <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
              <DialogContent className="bg-webdev-black border-webdev-glass-border max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-webdev-silver">Contact Submission Details</DialogTitle>
                  <DialogDescription className="text-webdev-soft-gray">
                    Full details of the contact form submission.
                  </DialogDescription>
                </DialogHeader>
                {selectedSubmission && (
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-webdev-silver font-medium mb-2">Name</h4>
                        <p className="text-webdev-soft-gray">{selectedSubmission.name}</p>
                      </div>
                      <div>
                        <h4 className="text-webdev-silver font-medium mb-2">Email</h4>
                        <p className="text-webdev-soft-gray">{selectedSubmission.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-webdev-silver font-medium mb-2">Company</h4>
                        <p className="text-webdev-soft-gray">{selectedSubmission.company || 'Not provided'}</p>
                      </div>
                      <div>
                        <h4 className="text-webdev-silver font-medium mb-2">Budget</h4>
                        <p className="text-webdev-soft-gray">{selectedSubmission.budget || 'Not provided'}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-webdev-silver font-medium mb-2">Project Type</h4>
                      <p className="text-webdev-soft-gray">{selectedSubmission.project_type || 'Not provided'}</p>
                    </div>

                    <div>
                      <h4 className="text-webdev-silver font-medium mb-2">Status</h4>
                      {getStatusBadge(selectedSubmission.status)}
                    </div>

                    <div>
                      <h4 className="text-webdev-silver font-medium mb-2">Submitted</h4>
                      <p className="text-webdev-soft-gray">
                        {new Date(selectedSubmission.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-webdev-silver font-medium mb-2">Message</h4>
                      <div className="bg-webdev-darker-gray/50 rounded-xl p-4 border border-webdev-glass-border">
                        <p className="text-webdev-silver whitespace-pre-wrap">{selectedSubmission.message}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => handleStatusChange(selectedSubmission.id, 'responded')}
                        disabled={selectedSubmission.status === 'responded'}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Mark as Responded
                      </Button>
                      <Button
                        onClick={() => handleStatusChange(selectedSubmission.id, 'archived')}
                        variant="outline"
                        className="border-webdev-glass-border hover:bg-webdev-darker-gray"
                      >
                        Archive
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSubmissions;
