
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, FileText, Mail, Calendar, User, Building, DollarSign, Trash2, Menu, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['admin-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(submission => ({
        ...submission,
        company: submission.company || 'Not specified',
        project_type: submission.project_type || 'Not specified',
        budget: submission.budget || 'Not specified'
      })) as ContactSubmission[];
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
      queryClient.invalidateQueries({ queryKey: ['admin-submissions'] });
      toast({
        title: "Success",
        description: "Submission deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      });
    }
  });

  const filteredSubmissions = submissions?.filter((submission: ContactSubmission) =>
    submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.message.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
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

          <div className="flex gap-4 md:gap-8">
            {/* Sidebar */}
            <div className={`
              ${isMobile ? 'fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out' : 'hidden lg:block w-64 flex-shrink-0'}
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

            <div className="flex-1 min-w-0">
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-light text-webdev-silver mb-2">Form Submissions</h1>
                <p className="text-sm md:text-base text-webdev-soft-gray">Review contact form submissions and inquiries</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                <Card className="glass-effect border-webdev-glass-border">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-webdev-soft-gray text-xs md:text-sm">Total Submissions</p>
                        <p className="text-xl md:text-2xl font-bold text-webdev-silver">{submissions?.length || 0}</p>
                      </div>
                      <FileText className="w-6 h-6 md:w-8 md:h-8 text-webdev-gradient-blue" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-webdev-glass-border">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-webdev-soft-gray text-xs md:text-sm">This Month</p>
                        <p className="text-xl md:text-2xl font-bold text-webdev-silver">
                          {submissions?.filter(s => {
                            const submissionDate = new Date(s.created_at);
                            const currentDate = new Date();
                            return submissionDate.getMonth() === currentDate.getMonth() &&
                                   submissionDate.getFullYear() === currentDate.getFullYear();
                          }).length || 0}
                        </p>
                      </div>
                      <Calendar className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-webdev-glass-border">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-webdev-soft-gray text-xs md:text-sm">With Budget Info</p>
                        <p className="text-xl md:text-2xl font-bold text-webdev-silver">
                          {submissions?.filter(s => s.budget && s.budget !== 'Not specified').length || 0}
                        </p>
                      </div>
                      <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
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
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-webdev-silver text-lg md:text-xl">Contact Submissions</CardTitle>
                  <CardDescription className="text-webdev-soft-gray text-sm">
                    {filteredSubmissions.length} submission{filteredSubmissions.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 md:p-6 md:pt-0">
                  {isLoading ? (
                    <div className="space-y-4 p-4 md:p-0">
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
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap">Name</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap">Email</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap hidden md:table-cell">Company</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap hidden lg:table-cell">Project Type</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap hidden lg:table-cell">Budget</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap">Date</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredSubmissions.map((submission: ContactSubmission) => (
                            <TableRow key={submission.id} className="border-webdev-glass-border hover:bg-webdev-darker-gray/20">
                              <TableCell className="text-webdev-silver text-xs md:text-sm max-w-[120px] truncate">{submission.name}</TableCell>
                              <TableCell className="text-webdev-silver text-xs md:text-sm max-w-[150px] truncate">{submission.email}</TableCell>
                              <TableCell className="text-webdev-silver text-xs md:text-sm max-w-[120px] truncate hidden md:table-cell">
                                {submission.company}
                              </TableCell>
                              <TableCell className="text-webdev-silver text-xs md:text-sm max-w-[120px] truncate hidden lg:table-cell">
                                {submission.project_type}
                              </TableCell>
                              <TableCell className="text-webdev-silver text-xs md:text-sm hidden lg:table-cell">
                                {submission.budget}
                              </TableCell>
                              <TableCell className="text-webdev-silver text-xs md:text-sm whitespace-nowrap">
                                {new Date(submission.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1 md:gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(`mailto:${submission.email}`, '_blank')}
                                    className="border-webdev-glass-border hover:bg-webdev-darker-gray p-1 md:p-2"
                                  >
                                    <Mail className="w-3 h-3 md:w-4 md:h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      if (confirm('Are you sure you want to delete this submission?')) {
                                        deleteMutation.mutate(submission.id);
                                      }
                                    }}
                                    className="border-red-500 text-red-400 hover:bg-red-500/10 p-1 md:p-2"
                                  >
                                    <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
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
                    <div className="text-center py-8 p-4 md:p-0">
                      <FileText className="w-12 h-12 text-webdev-soft-gray mx-auto mb-4" />
                      <p className="text-webdev-soft-gray">No submissions found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminSubmissions;
