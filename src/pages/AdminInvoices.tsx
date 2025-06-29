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
  projects: {
    title: string;
  } | null;
}

const AdminInvoices = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['admin-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          projects(title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Invoice[];
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
      <Badge className={`${statusColors[status as keyof typeof statusColors]} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredInvoices = invoices?.filter(invoice =>
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.projects?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (!user) {
    return <div>Please log in to view invoices.</div>;
  }

  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto p-6">
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
                <h1 className="text-3xl font-light text-webdev-silver mb-2">Invoices</h1>
                <p className="text-webdev-soft-gray">Manage all project invoices</p>
              </div>

              {/* Search */}
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
                                    className="border-webdev-glass-border hover:bg-webdev-darker-gray"
                                  >
                                    <Download className="w-4 h-4 mr-1" />
                                    Download
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      if (confirm('Are you sure you want to delete this invoice?')) {
                                        deleteMutation.mutate(invoice.id);
                                      }
                                    }}
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
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminInvoices;
