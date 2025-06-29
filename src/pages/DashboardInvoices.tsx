
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Receipt, Calendar, DollarSign, FileText, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

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

const DashboardInvoices = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['user-invoices', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          projects(title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Invoice[];
    },
    enabled: !!user?.id
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

  const totalAmount = invoices?.reduce((sum, invoice) => sum + invoice.amount, 0) || 0;
  const paidAmount = invoices?.filter(i => i.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0) || 0;
  const pendingAmount = totalAmount - paidAmount;
  const overdueInvoices = invoices?.filter(i => i.status === 'overdue').length || 0;

  if (!user) {
    return <div>Please log in to view your invoices.</div>;
  }

  return (
    <div className="min-h-screen bg-webdev-black">
      <div className="max-w-7xl mx-auto p-6 pt-32">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <DashboardSidebar />
          </div>

          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-3xl font-light text-webdev-silver mb-2">My Invoices</h1>
              <p className="text-webdev-soft-gray">Track your project invoices and payment status</p>
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
                <CardTitle className="text-webdev-silver">Your Invoices</CardTitle>
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
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-webdev-glass-border hover:bg-webdev-darker-gray"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
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
    </div>
  );
};

export default DashboardInvoices;
