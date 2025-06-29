
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Receipt, DollarSign, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  issue_date: string;
  due_date: string;
  paid_date: string | null;
  description: string | null;
  user_id: string;
  project_id: string | null;
  profiles: {
    full_name: string | null;
    username: string | null;
  } | null;
  projects: {
    title: string;
  } | null;
}

const AdminInvoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState({
    invoice_number: '',
    amount: '',
    status: 'draft',
    issue_date: '',
    due_date: '',
    description: '',
    user_id: '',
    project_id: ''
  });

  const { data: invoices, isLoading, refetch } = useQuery({
    queryKey: ['admin-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          profiles!invoices_user_id_fkey(full_name, username),
          projects(title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Invoice[];
    }
  });

  const { data: users } = useQuery({
    queryKey: ['users-for-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: projects } = useQuery({
    queryKey: ['projects-for-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, user_id');
      
      if (error) throw error;
      return data;
    }
  });

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('invoices')
        .insert({
          invoice_number: formData.invoice_number,
          amount: parseFloat(formData.amount),
          status: formData.status,
          issue_date: formData.issue_date,
          due_date: formData.due_date,
          description: formData.description || null,
          user_id: formData.user_id,
          project_id: formData.project_id || null
        });

      if (error) throw error;

      toast.success('Invoice created successfully');
      setIsCreateModalOpen(false);
      setFormData({
        invoice_number: '',
        amount: '',
        status: 'draft',
        issue_date: '',
        due_date: '',
        description: '',
        user_id: '',
        project_id: ''
      });
      refetch();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    }
  };

  const handleEditInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    try {
      const updateData: any = {
        invoice_number: formData.invoice_number,
        amount: parseFloat(formData.amount),
        status: formData.status,
        issue_date: formData.issue_date,
        due_date: formData.due_date,
        description: formData.description || null,
        user_id: formData.user_id,
        project_id: formData.project_id || null
      };

      if (formData.status === 'paid' && selectedInvoice.status !== 'paid') {
        updateData.paid_date = new Date().toISOString().split('T')[0];
      } else if (formData.status !== 'paid') {
        updateData.paid_date = null;
      }

      const { error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', selectedInvoice.id);

      if (error) throw error;

      toast.success('Invoice updated successfully');
      setIsEditModalOpen(false);
      setSelectedInvoice(null);
      refetch();
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice');
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Invoice deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
    }
  };

  const openEditModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setFormData({
      invoice_number: invoice.invoice_number,
      amount: invoice.amount.toString(),
      status: invoice.status,
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      description: invoice.description || '',
      user_id: invoice.user_id,
      project_id: invoice.project_id || ''
    });
    setIsEditModalOpen(true);
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

  return (
    <div className="min-h-screen bg-webdev-black">
      <div className="max-w-7xl mx-auto p-6 pt-32">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AdminSidebar />
          </div>

          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-3xl font-light text-webdev-silver mb-2">Invoice Management</h1>
              <p className="text-webdev-soft-gray">Manage and track all project invoices</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                      <p className="text-webdev-soft-gray text-sm">Paid Amount</p>
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
                      <p className="text-webdev-soft-gray text-sm">Pending Amount</p>
                      <p className="text-2xl font-bold text-yellow-400">${pendingAmount.toFixed(2)}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controls */}
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
              
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple hover:opacity-90">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-effect border-webdev-glass-border text-webdev-silver max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateInvoice} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="invoice_number">Invoice Number</Label>
                        <Input
                          id="invoice_number"
                          value={formData.invoice_number}
                          onChange={(e) => setFormData({...formData, invoice_number: e.target.value})}
                          className="bg-webdev-darker-gray border-webdev-glass-border"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="amount">Amount ($)</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          className="bg-webdev-darker-gray border-webdev-glass-border"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="user_id">Client</Label>
                        <Select value={formData.user_id} onValueChange={(value) => setFormData({...formData, user_id: value})}>
                          <SelectTrigger className="bg-webdev-darker-gray border-webdev-glass-border">
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                          <SelectContent>
                            {users?.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.full_name || user.username || 'Unknown User'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="project_id">Project (Optional)</Label>
                        <Select value={formData.project_id} onValueChange={(value) => setFormData({...formData, project_id: value})}>
                          <SelectTrigger className="bg-webdev-darker-gray border-webdev-glass-border">
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No Project</SelectItem>
                            {projects?.map((project) => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                          <SelectTrigger className="bg-webdev-darker-gray border-webdev-glass-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="issue_date">Issue Date</Label>
                        <Input
                          id="issue_date"
                          type="date"
                          value={formData.issue_date}
                          onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                          className="bg-webdev-darker-gray border-webdev-glass-border"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="due_date">Due Date</Label>
                        <Input
                          id="due_date"
                          type="date"
                          value={formData.due_date}
                          onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                          className="bg-webdev-darker-gray border-webdev-glass-border"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="bg-webdev-darker-gray border-webdev-glass-border"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple">
                        Create Invoice
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
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
                              {invoice.profiles?.full_name || invoice.profiles?.username || 'Unknown User'}
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
                                  onClick={() => openEditModal(invoice)}
                                  className="border-webdev-glass-border hover:bg-webdev-darker-gray"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteInvoice(invoice.id)}
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
              </CardContent>
            </Card>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="glass-effect border-webdev-glass-border text-webdev-silver max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Invoice</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEditInvoice} className="space-y-4">
                  {/* ... same form fields as create modal ... */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_invoice_number">Invoice Number</Label>
                      <Input
                        id="edit_invoice_number"
                        value={formData.invoice_number}
                        onChange={(e) => setFormData({...formData, invoice_number: e.target.value})}
                        className="bg-webdev-darker-gray border-webdev-glass-border"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_amount">Amount ($)</Label>
                      <Input
                        id="edit_amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        className="bg-webdev-darker-gray border-webdev-glass-border"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_user_id">Client</Label>
                      <Select value={formData.user_id} onValueChange={(value) => setFormData({...formData, user_id: value})}>
                        <SelectTrigger className="bg-webdev-darker-gray border-webdev-glass-border">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {users?.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.full_name || user.username || 'Unknown User'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit_project_id">Project (Optional)</Label>
                      <Select value={formData.project_id} onValueChange={(value) => setFormData({...formData, project_id: value})}>
                        <SelectTrigger className="bg-webdev-darker-gray border-webdev-glass-border">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No Project</SelectItem>
                          {projects?.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="edit_status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                        <SelectTrigger className="bg-webdev-darker-gray border-webdev-glass-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit_issue_date">Issue Date</Label>
                      <Input
                        id="edit_issue_date"
                        type="date"
                        value={formData.issue_date}
                        onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                        className="bg-webdev-darker-gray border-webdev-glass-border"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_due_date">Due Date</Label>
                      <Input
                        id="edit_due_date"
                        type="date"
                        value={formData.due_date}
                        onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                        className="bg-webdev-darker-gray border-webdev-glass-border"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit_description">Description</Label>
                    <Textarea
                      id="edit_description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="bg-webdev-darker-gray border-webdev-glass-border"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple">
                      Update Invoice
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInvoices;
