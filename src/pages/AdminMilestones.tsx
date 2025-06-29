import React, { useState } from 'react';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Target, Calendar, Clock, Plus, Edit, Trash2, Menu, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  completion_date: string | null;
  hours_logged: number;
  project_id: string;
  created_at: string;
  projects?: {
    title: string;
    profiles?: {
      full_name: string | null;
      username: string | null;
    } | null;
  } | null;
}

const AdminMilestones = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    project_id: '',
    due_date: '',
    status: 'pending'
  });

  const { data: milestonesData, isLoading } = useQuery({
    queryKey: ['admin-milestones'],
    queryFn: async () => {
      const { data: milestones, error } = await supabase
        .from('milestones')
        .select(`
          *,
          projects(
            title,
            profiles(full_name, username)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return milestones as Milestone[];
    }
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title');
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (milestoneData: any) => {
      const { error } = await supabase
        .from('milestones')
        .insert([{
          ...milestoneData,
          due_date: milestoneData.due_date || null
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-milestones'] });
      setShowCreateModal(false);
      setNewMilestone({
        title: '',
        description: '',
        project_id: '',
        due_date: '',
        status: 'pending'
      });
      toast({
        title: "Success",
        description: "Milestone created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create milestone",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (milestoneData: any) => {
      const { error } = await supabase
        .from('milestones')
        .update({
          title: milestoneData.title,
          description: milestoneData.description,
          status: milestoneData.status,
          due_date: milestoneData.due_date || null,
          completion_date: milestoneData.status === 'completed' ? new Date().toISOString().split('T')[0] : null
        })
        .eq('id', milestoneData.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-milestones'] });
      setEditingMilestone(null);
      toast({
        title: "Success",
        description: "Milestone updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update milestone",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-milestones'] });
      toast({
        title: "Success",
        description: "Milestone deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete milestone",
        variant: "destructive",
      });
    }
  });

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-500',
      in_progress: 'bg-blue-500',
      completed: 'bg-green-500'
    };
    
    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors]} text-white text-xs`}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const filteredMilestones = milestonesData?.filter((milestone: Milestone) =>
    milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    milestone.projects?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    milestone.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (!user) {
    return <div>Please log in to view milestones.</div>;
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
                <h1 className="text-2xl md:text-3xl font-light text-webdev-silver mb-2">Milestones</h1>
                <p className="text-sm md:text-base text-webdev-soft-gray">Manage project milestones and track progress</p>
              </div>

              {/* Search and Add Button */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-webdev-soft-gray w-4 h-4" />
                  <Input
                    placeholder="Search milestones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                  />
                </div>
                <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-webdev-gradient-blue hover:bg-webdev-gradient-blue/80 text-white shrink-0">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Milestone
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-effect border-webdev-glass-border max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-webdev-silver">Create New Milestone</DialogTitle>
                      <DialogDescription className="text-webdev-soft-gray">
                        Add a new milestone to track project progress
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-webdev-silver mb-2">Title</label>
                        <Input
                          value={newMilestone.title}
                          onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                          className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                          placeholder="Milestone title..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-webdev-silver mb-2">Project</label>
                        <select
                          value={newMilestone.project_id}
                          onChange={(e) => setNewMilestone({...newMilestone, project_id: e.target.value})}
                          className="w-full p-2 bg-webdev-darker-gray border border-webdev-glass-border rounded-md text-webdev-silver"
                        >
                          <option value="">Select Project</option>
                          {projects?.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-webdev-silver mb-2">Description</label>
                        <Input
                          value={newMilestone.description}
                          onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                          className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                          placeholder="Milestone description..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-webdev-silver mb-2">Due Date</label>
                        <Input
                          type="date"
                          value={newMilestone.due_date}
                          onChange={(e) => setNewMilestone({...newMilestone, due_date: e.target.value})}
                          className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => createMutation.mutate(newMilestone)}
                          disabled={!newMilestone.title || !newMilestone.project_id}
                          className="flex-1 bg-webdev-gradient-blue hover:bg-webdev-gradient-blue/80"
                        >
                          Create Milestone
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowCreateModal(false)}
                          className="border-webdev-glass-border hover:bg-webdev-darker-gray"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Milestones Table */}
              <Card className="glass-effect border-webdev-glass-border">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-webdev-silver text-lg md:text-xl">All Milestones</CardTitle>
                  <CardDescription className="text-webdev-soft-gray text-sm">
                    {filteredMilestones.length} milestone{filteredMilestones.length !== 1 ? 's' : ''} found
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
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap">Title</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap">Project</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap">Status</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap hidden md:table-cell">Due Date</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap hidden lg:table-cell">Hours Logged</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredMilestones.map((milestone: Milestone) => (
                            <TableRow key={milestone.id} className="border-webdev-glass-border hover:bg-webdev-darker-gray/20">
                              <TableCell className="text-webdev-silver text-xs md:text-sm max-w-[150px] truncate">
                                {milestone.title}
                              </TableCell>
                              <TableCell className="text-webdev-silver text-xs md:text-sm max-w-[150px] truncate">
                                {milestone.projects?.title || 'Unknown Project'}
                              </TableCell>
                              <TableCell>{getStatusBadge(milestone.status)}</TableCell>
                              <TableCell className="text-webdev-silver text-xs md:text-sm hidden md:table-cell">
                                {milestone.due_date ? new Date(milestone.due_date).toLocaleDateString() : 'No due date'}
                              </TableCell>
                              <TableCell className="text-webdev-silver text-xs md:text-sm hidden lg:table-cell">
                                {milestone.hours_logged || 0}h
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1 md:gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingMilestone(milestone)}
                                    className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 p-1 md:p-2"
                                  >
                                    <Edit className="w-3 h-3 md:w-4 md:h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      if (confirm('Are you sure you want to delete this milestone?')) {
                                        deleteMutation.mutate(milestone.id);
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

                  {filteredMilestones.length === 0 && !isLoading && (
                    <div className="text-center py-8 p-4 md:p-0">
                      <Target className="w-12 h-12 text-webdev-soft-gray mx-auto mb-4" />
                      <p className="text-webdev-soft-gray">No milestones found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Milestone Modal */}
      {editingMilestone && (
        <Dialog open={!!editingMilestone} onOpenChange={() => setEditingMilestone(null)}>
          <DialogContent className="glass-effect border-webdev-glass-border max-w-md">
            <DialogHeader>
              <DialogTitle className="text-webdev-silver">Edit Milestone</DialogTitle>
              <DialogDescription className="text-webdev-soft-gray">
                Update milestone details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-webdev-silver mb-2">Title</label>
                <Input
                  value={editingMilestone.title}
                  onChange={(e) => setEditingMilestone({...editingMilestone, title: e.target.value})}
                  className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-webdev-silver mb-2">Description</label>
                <Input
                  value={editingMilestone.description || ''}
                  onChange={(e) => setEditingMilestone({...editingMilestone, description: e.target.value})}
                  className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-webdev-silver mb-2">Status</label>
                <select
                  value={editingMilestone.status}
                  onChange={(e) => setEditingMilestone({...editingMilestone, status: e.target.value})}
                  className="w-full p-2 bg-webdev-darker-gray border border-webdev-glass-border rounded-md text-webdev-silver"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-webdev-silver mb-2">Due Date</label>
                <Input
                  type="date"
                  value={editingMilestone.due_date || ''}
                  onChange={(e) => setEditingMilestone({...editingMilestone, due_date: e.target.value})}
                  className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => updateMutation.mutate(editingMilestone)}
                  className="flex-1 bg-webdev-gradient-blue hover:bg-webdev-gradient-blue/80"
                >
                  Update Milestone
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingMilestone(null)}
                  className="border-webdev-glass-border hover:bg-webdev-darker-gray"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      <Footer />
    </div>
  );
};

export default AdminMilestones;
