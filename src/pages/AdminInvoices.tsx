import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-mobile';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
  created_at: string;
  profiles: {
    full_name: string | null;
    username: string | null;
  } | null;
  projects: {
    title: string;
  } | null;
}

interface Project {
  id: string;
  title: string;
}

interface User {
  id: string;
  full_name: string | null;
  username: string | null;
}

const AdminInvoices = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [formData, setFormData] = useState({
    invoice_number: '',
    amount: '',
    status: 'draft',
    issue_date: '',
    due_date: '',
    description: '',
    project_id: '',
    user_id: ''
  });

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['admin-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          profiles(full_name, username),
          projects(title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to ensure it matches our Invoice interface
      return (data || []).map(item => ({
        ...item,
        profiles: item.profiles ? {
          full_name: item.profiles.full_name || null,
          username: item.profiles.username || null,
        } : null,
        projects: item.projects ? {
          title: item.projects.title
        } : null
      })) as Invoice[];
    }
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title')
        .order('title');

      if (error) throw error;
      return data as Project[];
    }
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .order('full_name');

      if (error) throw error;
      return data as User[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('invoices')
        .insert([{ ...data, amount: parseFloat(data.amount) }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-invoices'] });
      setCreateModalOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { error } = await supabase
        .from('invoices')
        .update({ ...data, amount: parseFloat(data.amount) })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-invoices'] });
      setEditModalOpen(false);
      setSelectedInvoice(null);
      resetForm();
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
    },
    onError: (error) => {
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
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      invoice_number: '',
      amount: '',
      status: 'draft',
      issue_date: '',
      due_date: '',
      description: '',
      project_id: '',
      user_id: ''
    });
  };

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setFormData({
      invoice_number: invoice.invoice_number,
      amount: invoice.amount.toString(),
      status: invoice.status,
      issue_date: invoice.issue_date.split('T')[0],
      due_date: invoice.due_date.split('T')[0],
      description: invoice.description || '',
      project_id: invoice.project_id || '',
      user_id: invoice.user_id
    });
    setEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (selectedInvoice) {
      updateMutation.mutate({ id: selectedInvoice.id, ...formData });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      draft: 'bg-gray-500',
      sent: 'bg-blue-500',
      paid: 'bg-green-500',
      overdue: 'bg-red-500',
      cancelled: 'bg-gray-400'
    };
    
    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors]} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredInvoices = invoices?.filter(invoice =>
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.projects?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalAmount = invoices?.reduce((sum, invoice) => sum + invoice.amount, 0) || 0;
  const paidAmount = invoices?.filter(i => i.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0) || 0;
  const pendingAmount = totalAmount - paidAmount;
  const overdueInvoices = invoices?.filter(i => i.status === 'overdue').length || 0;

  if (!user) {
    return <div>Please log in to view admin invoices.</div>;
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
              <h1 className="text-3xl font-light text-webdev-silver mb-2">Invoice Management</h1>
              <p className="text-webdev-soft-gray">Manage all client invoices and billing</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="glass-effect border-webdev-glass-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-webdev-soft-gray text-sm">Total Amount</p>
                      <p className="text-2xl font-bold text-webdev-silver">${totalAmount.toFixed(2)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-webdev-gradient-blue" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-webdev-glass-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-webdev-soft-gray text-sm">Paid</p>
                      <p className="text-2xl font-bold text-green-400">${paidAmount.toFixed(2)}</p>
                    </div>
                    <Receipt className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-webdev-glass-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-webdev-soft-gray text-sm">Pending</p>
                      <p className="text-2xl font-bold text-yellow-400">${pendingAmount.toFixed(2)}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-webdev-glass-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-webdev-soft-gray text-sm">Overdue</p>
                      <p className="text-2xl font-bold text-red-400">{overdueInvoices}</p>
                    </div>
                    <FileText className="w-8 h-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Create */}
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
              <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-webdev-gradient-blue hover:bg-webdev-gradient-blue/80">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-webdev-black border-webdev-glass-border">
                  <DialogHeader>
                    <DialogTitle className="text-webdev-silver">Create New Invoice</DialogTitle>
                    <DialogDescription className="text-webdev-soft-gray">
                      Create a new invoice for a client project.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* Form fields for creating invoice */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="invoice_number" className="text-right text-webdev-silver">
                        Invoice #
                      </Label>
                      <Input
                        id="invoice_number"
                        value={formData.invoice_number}
                        onChange={(e) => setFormData({...formData, invoice_number: e.target.value})}
                        className="col-span-3 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="user_id" className="text-right text-webdev-silver">
                        Client
                      </Label>
                      <Select value={formData.user_id} onValueChange={(value) => setFormData({...formData, user_id: value})}>
                        <SelectTrigger className="col-span-3 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent className="bg-webdev-darker-gray border-webdev-glass-border">
                          {users?.map((user) => (
                            <SelectItem key={user.id} value={user.id} className="text-webdev-silver">
                              {user.full_name || user.username || 'Unknown User'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="project_id" className="text-right text-webdev-silver">
                        Project
                      </Label>
                      <Select value={formData.project_id} onValueChange={(value) => setFormData({...formData, project_id: value})}>
                        <SelectTrigger className="col-span-3 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent className="bg-webdev-darker-gray border-webdev-glass-border">
                          {projects?.map((project) => (
                            <SelectItem key={project.id} value={project.id} className="text-webdev-silver">
                              {project.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amount" className="text-right text-webdev-silver">
                        Amount
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        className="col-span-3 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right text-webdev-silver">
                        Status
                      </Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                        <SelectTrigger className="col-span-3 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-webdev-darker-gray border-webdev-glass-border">
                          <SelectItem value="draft" className="text-webdev-silver">Draft</SelectItem>
                          <SelectItem value="sent" className="text-webdev-silver">Sent</SelectItem>
                          <SelectItem value="paid" className="text-webdev-silver">Paid</SelectItem>
                          <SelectItem value="overdue" className="text-webdev-silver">Overdue</SelectItem>
                          <SelectItem value="cancelled" className="text-webdev-silver">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="issue_date" className="text-right text-webdev-silver">
                        Issue Date
                      </Label>
                      <Input
                        id="issue_date"
                        type="date"
                        value={formData.issue_date}
                        onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                        className="col-span-3 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="due_date" className="text-right text-webdev-silver">
                        Due Date
                      </Label>
                      <Input
                        id="due_date"
                        type="date"
                        value={formData.due_date}
                        onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                        className="col-span-3 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right text-webdev-silver">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="col-span-3 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleCreate}
                      disabled={createMutation.isPending}
                      className="bg-webdev-gradient-blue hover:bg-webdev-gradient-blue/80"
                    >
                      {createMutation.isPending ? 'Creating...' : 'Create Invoice'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Invoices Table */}
            <Card className="glass-effect border-webdev-glass-border">
              <CardHeader>
                <CardTitle className="text-webdev-silver">All Invoices</CardTitle>
                <CardDescription className="text-webdev-soft-gray">
                  {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''} found
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
                          <TableHead className="text-webdev-soft-gray">Invoice #</TableHead>
                          <TableHead className="text-webdev-soft-gray">Client</TableHead>
                          <TableHead className="text-webdev-soft-gray">Project</TableHead>
                          <TableHead className="text-webdev-soft-gray">Amount</TableHead>
                          <TableHead className="text-webdev-soft-gray">Status</TableHead>
                          <TableHead className="text-webdev-soft-gray">Issue Date</TableHead>
                          <TableHead className="text-webdev-soft-gray">Due Date</TableHead>
                          <TableHead className="text-webdev-soft-gray">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInvoices.map((invoice) => (
                          <TableRow key={invoice.id} className="border-webdev-glass-border hover:bg-webdev-darker-gray/20">
                            <TableCell className="text-webdev-silver font-mono">{invoice.invoice_number}</TableCell>
                            <TableCell className="text-webdev-silver">
                              {invoice.profiles?.full_name || invoice.profiles?.username || 'Unknown'}
                            </TableCell>
                            <TableCell className="text-webdev-silver">
                              {invoice.projects?.title || 'No Project'}
                            </TableCell>
                            <TableCell className="text-webdev-silver font-semibold">
                              ${invoice.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                            <TableCell className="text-webdev-silver">
                              {new Date(invoice.issue_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-webdev-silver">
                              {new Date(invoice.due_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(invoice)}
                                  className="border-webdev-glass-border hover:bg-webdev-darker-gray"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(invoice.id)}
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

                {filteredInvoices.length === 0 && !isLoading && (
                  <div className="text-center py-8">
                    <Receipt className="w-12 h-12 text-webdev-soft-gray mx-auto mb-4" />
                    <p className="text-webdev-soft-gray">No invoices found</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Edit Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
              <DialogContent className="bg-webdev-black border-webdev-glass-border">
                <DialogHeader>
                  <DialogTitle className="text-webdev-silver">Edit Invoice</DialogTitle>
                  <DialogDescription className="text-webdev-soft-gray">
                    Update invoice details.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Same form fields as create modal */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit_invoice_number" className="text-right text-webdev-silver">
                      Invoice #
                    </Label>
                    <Input
                      id="edit_invoice_number"
                      value={formData.invoice_number}
                      onChange={(e) => setFormData({...formData, invoice_number: e.target.value})}
                      className="col-span-3 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit_user_id" className="text-right text-webdev-silver">
                      Client
                    </Label>
                    <Select value={formData.user_id} onValueChange={(value) => setFormData({...formData, user_id: value})}>
                      <SelectTrigger className="col-span-3 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent className="bg-webdev-darker-gray border-webdev-glass-border">
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id} className="text-webdev-silver">
                            {user.full_name || user.username || 'Unknown User'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit_project_id" className="text-right text-webdev-silver">
                      Project
                    </Label>
                    <Select value={formData.project_id} onValueChange={(value) => setFormData({...formData, project_id: value})}>
                      <SelectTrigger className="col-span-3 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent className="bg-webdev-darker-gray border-webdev-glass-border">
                        {projects?.map((project) => (
                          <SelectItem key={project.id} value={project.id} className="text-webdev-silver">
                            {project.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit_amount" className="text-right text-webdev-silver">
                      Amount
                    </Label>
                    <Input
                      id="edit_amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="col-span-3 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit_status" className="text-right text-webdev-silver">
                      Status
                    </Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger className="col-span-3 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-webdev-darker-gray border-webdev-glass-border">
                        <SelectItem value="draft" className="text-webdev-silver">Draft</SelectItem>
                        <SelectItem value="sent" className="text-webdev-silver">Sent</SelectItem>
                        <SelectItem value="paid" className="text-webdev-silver">Paid</SelectItem>
                        <SelectItem value="overdue" className="text-webdev-silver">Overdue</SelectItem>
                        <SelectItem value="cancelled" className="text-webdev-silver">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit_issue_date" className="text-right text-webdev-silver">
                      Issue Date
                    </Label>
                    <Input
                      id="edit_issue_date"
                      type="date"
                      value={formData.issue_date}
                      onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                      className="col-span-3 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit_due_date" className="text-right text-webdev-silver">
                      Due Date
                    </Label>
                    <Input
                      id="edit_due_date"
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                      className="col-span-3 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit_description" className="text-right text-webdev-silver">
                      Description
                    </Label>
                    <Textarea
                      id="edit_description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="col-span-3 bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleUpdate}
                    disabled={updateMutation.isPending}
                    className="bg-webdev-gradient-blue hover:bg-webdev-gradient-blue/80"
                  >
                    {updateMutation.isPending ? 'Updating...' : 'Update Invoice'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInvoices;
