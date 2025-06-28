
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Receipt, Calendar, DollarSign } from 'lucide-react';

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  issue_date: string;
  due_date: string;
  paid_date: string | null;
  description: string;
}

const DashboardInvoices = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchInvoices();
    }
  }, [user]);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user?.id)
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoadingInvoices(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-400 bg-green-400/10';
      case 'sent':
        return 'text-webdev-gradient-blue bg-blue-400/10';
      case 'overdue':
        return 'text-red-400 bg-red-400/10';
      case 'cancelled':
        return 'text-webdev-soft-gray bg-gray-400/10';
      default:
        return 'text-yellow-400 bg-yellow-400/10';
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-webdev-black flex items-center justify-center">
        <div className="text-webdev-silver">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <DashboardSidebar />
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              <div className="glass-effect rounded-2xl p-8 border border-webdev-glass-border">
                <div className="flex items-center gap-4 mb-8">
                  <Receipt className="w-8 h-8 text-webdev-gradient-blue" />
                  <h1 className="text-3xl font-light text-webdev-silver">Invoices</h1>
                </div>

                {loadingInvoices ? (
                  <div className="text-center py-8">
                    <div className="text-webdev-soft-gray">Loading invoices...</div>
                  </div>
                ) : invoices.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="w-16 h-16 text-webdev-soft-gray mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-light text-webdev-silver mb-2">No Invoices Yet</h3>
                    <p className="text-webdev-soft-gray">Your invoices will appear here when they're created.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="glass-effect rounded-xl p-6 border border-webdev-glass-border hover:border-webdev-gradient-blue/30 transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h3 className="text-lg font-semibold text-webdev-silver">#{invoice.invoice_number}</h3>
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                                {formatStatus(invoice.status)}
                              </div>
                            </div>
                            <p className="text-webdev-soft-gray mb-4">{invoice.description || 'No description provided'}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-webdev-silver mb-1">${invoice.amount.toFixed(2)}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-webdev-soft-gray">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Issued: {new Date(invoice.issue_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                          </div>
                          {invoice.paid_date && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              <span>Paid: {new Date(invoice.paid_date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardInvoices;
