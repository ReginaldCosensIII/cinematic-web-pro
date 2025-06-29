
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Mail, User, Building, MessageSquare, Calendar, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  project_type: string | null;
  budget: string | null;
  message: string;
  created_at: string;
  user_id: string | null;
}

const AdminSubmissions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data: submissions, isLoading, refetch } = useQuery({
    queryKey: ['admin-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContactSubmission[];
    }
  });

  const handleDeleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Submission deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast.error('Failed to delete submission');
    }
  };

  const openViewModal = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setIsViewModalOpen(true);
  };

  const getProjectTypeBadge = (projectType: string | null) => {
    if (!projectType) return <Badge variant="outline">Not Specified</Badge>;
    
    const colors = {
      'website': 'bg-blue-500',
      'webapp': 'bg-purple-500',
      'ecommerce': 'bg-green-500',
      'mobile': 'bg-orange-500',
      'consulting': 'bg-yellow-500',
      'other': 'bg-gray-500'
    };
    
    const colorClass = colors[projectType.toLowerCase() as keyof typeof colors] || 'bg-gray-500';
    
    return (
      <Badge className={`${colorClass} text-white`}>
        {projectType.charAt(0).toUpperCase() + projectType.slice(1)}
      </Badge>
    );
  };

  const getBudgetBadge = (budget: string | null) => {
    if (!budget) return <Badge variant="outline">Not Specified</Badge>;
    
    return (
      <Badge variant="outline" className="text-green-400 border-green-400">
        {budget}
      </Badge>
    );
  };

  const filteredSubmissions = submissions?.filter(submission =>
    submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.message.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const todaySubmissions = submissions?.filter(s => 
    new Date(s.created_at).toDateString() === new Date().toDateString()
  ).length || 0;

  const thisWeekSubmissions = submissions?.filter(s => {
    const submissionDate = new Date(s.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return submissionDate >= weekAgo;
  }).length || 0;

  return (
    <div className="min-h-screen bg-webdev-black">
      <div className="max-w-7xl mx-auto p-6 pt-32">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AdminSidebar />
          </div>

          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-3xl font-light text-webdev-silver mb-2">Form Submissions</h1>
              <p className="text-webdev-soft-gray">Manage contact form submissions from visitors</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="glass-effect border-webdev-glass-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-webdev-soft-gray text-sm">Total Submissions</p>
                      <p className="text-2xl font-bold text-webdev-silver">{submissions?.length || 0}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-webdev-gradient-blue" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-webdev-glass-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-webdev-soft-gray text-sm">Today</p>
                      <p className="text-2xl font-bold text-webdev-gradient-purple">{todaySubmissions}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-webdev-gradient-purple" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-webdev-glass-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-webdev-soft-gray text-sm">This Week</p>
                      <p className="text-2xl font-bold text-green-400">{thisWeekSubmissions}</p>
                    </div>
                    <Mail className="w-8 h-8 text-green-400" />
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
                          <TableHead className="text-webdev-soft-gray">Project Type</TableHead>
                          <TableHead className="text-webdev-soft-gray">Budget</TableHead>
                          <TableHead className="text-webdev-soft-gray">Submitted</TableHead>
                          <TableHead className="text-webdev-soft-gray">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSubmissions.map((submission) => (
                          <TableRow key={submission.id} className="border-webdev-glass-border hover:bg-webdev-darker-gray/20">
                            <TableCell className="text-webdev-silver font-medium">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-webdev-gradient-blue" />
                                {submission.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-webdev-silver">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-webdev-gradient-purple" />
                                <a 
                                  href={`mailto:${submission.email}`}
                                  className="hover:text-webdev-gradient-blue transition-colors"
                                >
                                  {submission.email}
                                </a>
                              </div>
                            </TableCell>
                            <TableCell className="text-webdev-silver">
                              {submission.company ? (
                                <div className="flex items-center gap-2">
                                  <Building className="w-4 h-4 text-green-400" />
                                  {submission.company}
                                </div>
                              ) : (
                                <span className="text-webdev-soft-gray">Not provided</span>
                              )}
                            </TableCell>
                            <TableCell>{getProjectTypeBadge(submission.project_type)}</TableCell>
                            <TableCell>{getBudgetBadge(submission.budget)}</TableCell>
                            <TableCell className="text-webdev-silver">
                              {new Date(submission.created_at).toLocaleDateString()} at{' '}
                              {new Date(submission.created_at).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openViewModal(submission)}
                                  className="border-webdev-glass-border hover:bg-webdev-darker-gray"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteSubmission(submission.id)}
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
                    <MessageSquare className="w-12 h-12 text-webdev-soft-gray mx-auto mb-4" />
                    <p className="text-webdev-soft-gray">No submissions found</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* View Submission Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
              <DialogContent className="glass-effect border-webdev-glass-border text-webdev-silver max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Contact Submission Details</DialogTitle>
                </DialogHeader>
                {selectedSubmission && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-webdev-silver mb-1">Name</h4>
                        <p className="text-webdev-soft-gray">{selectedSubmission.name}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-webdev-silver mb-1">Email</h4>
                        <a 
                          href={`mailto:${selectedSubmission.email}`}
                          className="text-webdev-gradient-blue hover:underline"
                        >
                          {selectedSubmission.email}
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-webdev-silver mb-1">Company</h4>
                        <p className="text-webdev-soft-gray">
                          {selectedSubmission.company || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-webdev-silver mb-1">Submitted</h4>
                        <p className="text-webdev-soft-gray">
                          {new Date(selectedSubmission.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-webdev-silver mb-1">Project Type</h4>
                        <div>{getProjectTypeBadge(selectedSubmission.project_type)}</div>
                      </div>
                      <div>
                        <h4 className="font-medium text-webdev-silver mb-1">Budget Range</h4>
                        <div>{getBudgetBadge(selectedSubmission.budget)}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-webdev-silver mb-2">Message</h4>
                      <div className="bg-webdev-darker-gray p-4 rounded-lg border border-webdev-glass-border">
                        <p className="text-webdev-soft-gray whitespace-pre-wrap">
                          {selectedSubmission.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => window.open(`mailto:${selectedSubmission.email}?subject=Re: Contact Form Submission`)}
                        className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Reply via Email
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsViewModalOpen(false)}
                        className="border-webdev-glass-border"
                      >
                        Close
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
