import React, { useEffect, useState } from 'react';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Receipt, Calendar, DollarSign, FileText, Download, Plus, Edit, Trash2, Menu, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  issue_date: string;
  due_date: string;
  paid_date: string | null;
  description: string | null;
  project_id: string | null;
  user_id: string;
  profiles?: {
    full_name: string;
    username: string;
  };
  projects?: {
    title: string;
  };
}

const AdminInvoices = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [newInvoice, setNewInvoice] = useState({
    invoice_number: '',
    user_id: '',
    amount: '',
    description: '',
    project_id: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const { data: invoicesData, isLoading } = useQuery({
    queryKey: ['admin-invoices'],
    queryFn: async () => {
      // Fetch invoices
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (invoicesError) throw invoicesError;

      // Fetch profiles and projects separately
      const userIds = [...new Set(invoices.map(inv => inv.user_id))];
      const projectIds = [...new Set(invoices.map(inv => inv.project_id).filter(Boolean))];

      const [profilesResult, projectsResult] = await Promise.all([
        userIds.length > 0 ? supabase
          .from('profiles')
          .select('id, full_name, username')
          .in('id', userIds) : { data: [], error: null },
        projectIds.length > 0 ? supabase
          .from('projects')
          .select('id, title')
          .in('id', projectIds) : { data: [], error: null }
      ]);

      if (profilesResult.error) throw profilesResult.error;
      if (projectsResult.error) throw projectsResult.error;

      // Map the data
      const profilesMap = (profilesResult.data || []).reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, any>);

      const projectsMap = (projectsResult.data || []).reduce((acc, project) => {
        acc[project.id] = project;
        return acc;
      }, {} as Record<string, any>);

      return invoices.map(invoice => ({
        ...invoice,
        profiles: profilesMap[invoice.user_id] || { full_name: 'Unknown', username: 'unknown' },
        projects: invoice.project_id ? projectsMap[invoice.project_id] || { title: 'Unknown Project' } : null
      }));
    },
    enabled: !!user
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username');
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title');
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const createMutation = useMutation({
    mutationFn: async (invoiceData: any) => {
      const { error } = await supabase
        .from('invoices')
        .insert([{
          ...invoiceData,
          amount: parseFloat(invoiceData.amount),
          project_id: invoiceData.project_id || null
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-invoices'] });
      setShowCreateModal(false);
      setNewInvoice({
        invoice_number: '',
        user_id: '',
        amount: '',
        description: '',
        project_id: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (invoiceData: any) => {
      const { error } = await supabase
        .from('invoices')
        .update({
          invoice_number: invoiceData.invoice_number,
          amount: parseFloat(invoiceData.amount),
          description: invoiceData.description,
          project_id: invoiceData.project_id || null,
          issue_date: invoiceData.issue_date,
          due_date: invoiceData.due_date,
          status: invoiceData.status
        })
        .eq('id', invoiceData.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-invoices'] });
      setEditingInvoice(null);
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update invoice",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-invoices'] });
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      });
    }
  });

  const getStatusBadge = (status: string) => {
    const statusColors = {
      draft: 'bg-gray-500',
      sent: 'bg-blue-500',
      paid: 'bg-green-500',
      overdue: 'bg-red-500',
      cancelled: 'bg-gray-400'
    };
    
    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors]} text-white text-xs`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredInvoices = invoicesData?.filter((invoice: Invoice) =>
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.projects?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
                <h1 className="text-2xl md:text-3xl font-light text-webdev-silver mb-2">Invoices</h1>
                <p className="text-sm md:text-base text-webdev-soft-gray">Manage all project invoices</p>
              </div>

              {/* Search and Add Button */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-webdev-soft-gray w-4 h-4" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                  />
                </div>
                <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                  <DialogTrigger asChild>
                    <Button variant="glass" className="shrink-0">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Invoice
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-effect border-webdev-glass-border max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-webdev-silver">Create New Invoice</DialogTitle>
                      <DialogDescription className="text-webdev-soft-gray">
                        Add a new invoice to the system
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-webdev-silver mb-2">Invoice Number</label>
                        <Input
                          value={newInvoice.invoice_number}
                          onChange={(e) => setNewInvoice({...newInvoice, invoice_number: e.target.value})}
                          className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                          placeholder="INV-001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-webdev-silver mb-2">User</label>
                        <select
                          value={newInvoice.user_id}
                          onChange={(e) => setNewInvoice({...newInvoice, user_id: e.target.value})}
                          className="w-full p-2 bg-webdev-darker-gray border border-webdev-glass-border rounded-md text-webdev-silver"
                        >
                          <option value="">Select User</option>
                          {users?.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.full_name || user.username}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-webdev-silver mb-2">Project (Optional)</label>
                        <select
                          value={newInvoice.project_id}
                          onChange={(e) => setNewInvoice({...newInvoice, project_id: e.target.value})}
                          className="w-full p-2 bg-webdev-darker-gray border border-webdev-glass-border rounded-md text-webdev-silver"
                        >
                          <option value="">No Project</option>
                          {projects?.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-webdev-silver mb-2">Amount</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newInvoice.amount}
                          onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                          className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-webdev-silver mb-2">Description</label>
                        <Input
                          value={newInvoice.description}
                          onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                          className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                          placeholder="Invoice description..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-webdev-silver mb-2">Issue Date</label>
                          <Input
                            type="date"
                            value={newInvoice.issue_date}
                            onChange={(e) => setNewInvoice({...newInvoice, issue_date: e.target.value})}
                            className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-webdev-silver mb-2">Due Date</label>
                          <Input
                            type="date"
                            value={newInvoice.due_date}
                            onChange={(e) => setNewInvoice({...newInvoice, due_date: e.target.value})}
                            className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => createMutation.mutate(newInvoice)}
                          disabled={!newInvoice.invoice_number || !newInvoice.user_id || !newInvoice.amount}
                          variant="glass"
                          className="flex-1"
                        >
                          Create Invoice
                        </Button>
                        <Button
                          variant="glass"
                          onClick={() => setShowCreateModal(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Invoices Table */}
              <Card className="glass-effect border-webdev-glass-border">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-webdev-silver text-lg md:text-xl">All Invoices</CardTitle>
                  <CardDescription className="text-webdev-soft-gray text-sm">
                    {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''} found
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
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap">Invoice #</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap">User</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap hidden md:table-cell">Project</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap">Amount</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap">Status</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap hidden lg:table-cell">Issue Date</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap hidden lg:table-cell">Due Date</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredInvoices.map((invoice: Invoice) => (
                            <TableRow key={invoice.id} className="border-webdev-glass-border hover:bg-webdev-darker-gray/20">
                              <TableCell className="text-webdev-silver font-mono text-xs md:text-sm">{invoice.invoice_number}</TableCell>
                              <TableCell className="text-webdev-silver text-xs md:text-sm max-w-[100px] truncate">
                                {invoice.profiles?.full_name || 'Unknown User'}
                              </TableCell>
                              <TableCell className="text-webdev-silver text-xs md:text-sm max-w-[100px] truncate hidden md:table-cell">
                                {invoice.projects?.title || 'No Project'}
                              </TableCell>
                              <TableCell className="text-webdev-silver font-semibold text-xs md:text-sm whitespace-nowrap">
                                ${invoice.amount.toFixed(2)}
                              </TableCell>
                              <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                              <TableCell className="text-webdev-silver text-xs md:text-sm hidden lg:table-cell">
                                {new Date(invoice.issue_date).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-webdev-silver text-xs md:text-sm hidden lg:table-cell">
                                {new Date(invoice.due_date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1 md:gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-webdev-glass-border hover:bg-webdev-darker-gray p-1 md:p-2"
                                  >
                                    <Download className="w-3 h-3 md:w-4 md:h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingInvoice(invoice)}
                                    className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 p-1 md:p-2"
                                  >
                                    <Edit className="w-3 h-3 md:w-4 md:h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      if (confirm('Are you sure you want to delete this invoice?')) {
                                        deleteMutation.mutate(invoice.id);
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

                  {filteredInvoices.length === 0 && !isLoading && (
                    <div className="text-center py-8 p-4 md:p-0">
                      <Receipt className="w-12 h-12 text-webdev-soft-gray mx-auto mb-4" />
                      <p className="text-webdev-soft-gray">No invoices found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <Dialog open={!!editingInvoice} onOpenChange={() => setEditingInvoice(null)}>
          <DialogContent className="glass-effect border-webdev-glass-border max-w-md">
            <DialogHeader>
              <DialogTitle className="text-webdev-silver">Edit Invoice</DialogTitle>
              <DialogDescription className="text-webdev-soft-gray">
                Update invoice details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-webdev-silver mb-2">Invoice Number</label>
                <Input
                  value={editingInvoice.invoice_number}
                  onChange={(e) => setEditingInvoice({...editingInvoice, invoice_number: e.target.value})}
                  className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-webdev-silver mb-2">Amount</label>
                <Input
                  type="number"
                  step="0.01"
                  value={editingInvoice.amount}
                  onChange={(e) => setEditingInvoice({...editingInvoice, amount: parseFloat(e.target.value)})}
                  className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-webdev-silver mb-2">Status</label>
                <select
                  value={editingInvoice.status}
                  onChange={(e) => setEditingInvoice({...editingInvoice, status: e.target.value})}
                  className="w-full p-2 bg-webdev-darker-gray border border-webdev-glass-border rounded-md text-webdev-silver"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-webdev-silver mb-2">Description</label>
                <Input
                  value={editingInvoice.description || ''}
                  onChange={(e) => setEditingInvoice({...editingInvoice, description: e.target.value})}
                  className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-webdev-silver mb-2">Issue Date</label>
                  <Input
                    type="date"
                    value={editingInvoice.issue_date}
                    onChange={(e) => setEditingInvoice({...editingInvoice, issue_date: e.target.value})}
                    className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-webdev-silver mb-2">Due Date</label>
                  <Input
                    type="date"
                    value={editingInvoice.due_date}
                    onChange={(e) => setEditingInvoice({...editingInvoice, due_date: e.target.value})}
                    className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => updateMutation.mutate(editingInvoice)}
                  variant="glass"
                  className="flex-1"
                >
                  Update Invoice
                </Button>
                <Button
                  variant="glass"
                  onClick={() => setEditingInvoice(null)}
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

export default AdminInvoices;
