import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import InvoiceDetailsModal from '@/components/dashboard/InvoiceDetailsModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Receipt, Calendar, DollarSign, FileText, Download, Menu, X, Eye } from 'lucide-react';
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
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
      <Badge className={`${statusColors[status as keyof typeof statusColors]} text-white text-xs`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleInvoiceClick = (invoice: Invoice) => {
    // Pass the complete invoice object with projects data
    setSelectedInvoice(invoice);
    setModalOpen(true);
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

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
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
                  <DashboardSidebar />
                </div>
              )}
              {!isMobile && <DashboardSidebar />}
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
                <h1 className="text-2xl md:text-3xl font-light text-webdev-silver mb-2">My Invoices</h1>
                <p className="text-sm md:text-base text-webdev-soft-gray">Track your project invoices and payment status</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                <Card className="glass-effect border-webdev-glass-border">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-webdev-soft-gray text-xs md:text-sm">Total</p>
                        <p className="text-lg md:text-2xl font-bold text-webdev-silver">${totalAmount.toFixed(2)}</p>
                      </div>
                      <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-webdev-gradient-blue" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-webdev-glass-border">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-webdev-soft-gray text-xs md:text-sm">Paid</p>
                        <p className="text-lg md:text-2xl font-bold text-green-400">${paidAmount.toFixed(2)}</p>
                      </div>
                      <Receipt className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-webdev-glass-border">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-webdev-soft-gray text-xs md:text-sm">Pending</p>
                        <p className="text-lg md:text-2xl font-bold text-yellow-400">${pendingAmount.toFixed(2)}</p>
                      </div>
                      <Calendar className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-webdev-glass-border">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-webdev-soft-gray text-xs md:text-sm">Overdue</p>
                        <p className="text-lg md:text-2xl font-bold text-red-400">{overdueInvoices}</p>
                      </div>
                      <FileText className="w-6 h-6 md:w-8 md:h-8 text-red-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
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
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-webdev-silver text-lg md:text-xl">Your Invoices</CardTitle>
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
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap">Project</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap">Amount</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap">Status</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap hidden md:table-cell">Issue Date</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap hidden md:table-cell">Due Date</TableHead>
                            <TableHead className="text-webdev-soft-gray text-xs md:text-sm whitespace-nowrap">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredInvoices.map((invoice) => (
                            <TableRow key={invoice.id} className="border-webdev-glass-border hover:bg-webdev-darker-gray/20">
                              <TableCell className="text-webdev-silver font-mono text-xs md:text-sm">{invoice.invoice_number}</TableCell>
                              <TableCell className="text-webdev-silver text-xs md:text-sm max-w-[100px] truncate">
                                {invoice.projects?.title || 'No Project'}
                              </TableCell>
                              <TableCell className="text-webdev-silver font-semibold text-xs md:text-sm whitespace-nowrap">
                                ${invoice.amount.toFixed(2)}
                              </TableCell>
                              <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                              <TableCell className="text-webdev-silver text-xs md:text-sm hidden md:table-cell">
                                {new Date(invoice.issue_date).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-webdev-silver text-xs md:text-sm hidden md:table-cell">
                                {new Date(invoice.due_date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="glass"
                                    onClick={() => handleInvoiceClick(invoice)}
                                  >
                                    <Eye className="w-3 h-3 md:w-4 md:h-4" />
                                    <span className="hidden md:inline">View</span>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="glass"
                                  >
                                    <Download className="w-3 h-3 md:w-4 md:h-4" />
                                    <span className="hidden md:inline">Download</span>
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
      
      {selectedInvoice && (
        <InvoiceDetailsModal
          invoice={selectedInvoice}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedInvoice(null);
          }}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default DashboardInvoices;
