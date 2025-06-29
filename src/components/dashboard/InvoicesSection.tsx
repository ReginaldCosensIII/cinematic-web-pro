
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Receipt, DollarSign, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import InvoiceDetailsModal from './InvoiceDetailsModal';

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  issue_date: string;
  due_date: string;
  paid_date: string | null;
  description: string;
  project_id: string | null;
}

const InvoicesSection = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();

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
        .order('issue_date', { ascending: false });

      if (error) {
        console.error('Error fetching invoices:', error);
      } else {
        setInvoices(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'overdue':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'sent':
        return <Clock className="w-5 h-5 text-webdev-gradient-blue" />;
      case 'draft':
        return <Receipt className="w-5 h-5 text-webdev-soft-gray" />;
      default:
        return <Receipt className="w-5 h-5 text-webdev-soft-gray" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-400 bg-green-400/20';
      case 'overdue':
        return 'text-red-400 bg-red-400/20';
      case 'sent':
        return 'text-webdev-gradient-blue bg-blue-400/20';
      case 'draft':
        return 'text-webdev-soft-gray bg-gray-400/20';
      default:
        return 'text-webdev-soft-gray bg-gray-400/20';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="glass-effect rounded-2xl p-4 sm:p-8 border border-webdev-glass-border">
        <div className="animate-pulse">
          <div className="h-6 bg-webdev-darker-gray rounded mb-4 w-48"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-webdev-darker-gray rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const outstandingAmount = totalAmount - paidAmount;

  return (
    <>
      <div 
        className="glass-effect rounded-2xl p-4 sm:p-8 border border-webdev-glass-border hover:border-webdev-gradient-blue/50 transition-all duration-300 cursor-pointer group"
        onClick={() => setModalOpen(true)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
          <h2 className="text-xl sm:text-2xl font-light text-webdev-silver group-hover:text-white transition-colors">Invoices & Payments</h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm">
            <div className="text-center sm:text-left">
              <div className="text-green-400 font-semibold">{formatCurrency(paidAmount)}</div>
              <div className="text-webdev-soft-gray">Paid</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-webdev-gradient-blue font-semibold">{formatCurrency(outstandingAmount)}</div>
              <div className="text-webdev-soft-gray">Outstanding</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-webdev-silver font-semibold">{formatCurrency(totalAmount)}</div>
              <div className="text-webdev-soft-gray">Total</div>
            </div>
          </div>
        </div>

        {invoices.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-webdev-soft-gray mx-auto mb-4" />
            <p className="text-webdev-soft-gray text-lg">No invoices yet</p>
            <p className="text-webdev-soft-gray/70">Your invoices and payment history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.slice(0, 3).map((invoice) => (
              <div
                key={invoice.id}
                className="glass-effect rounded-xl p-4 sm:p-6 border border-webdev-glass-border"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div>
                      {getStatusIcon(invoice.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-lg font-medium text-webdev-silver break-words">
                          Invoice #{invoice.invoice_number}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)} self-start flex-shrink-0`}>
                          {formatStatus(invoice.status)}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-webdev-soft-gray">
                        <span className="truncate">Issued: {format(new Date(invoice.issue_date), 'MMM d, yyyy')}</span>
                        <span className="truncate">Due: {format(new Date(invoice.due_date), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl sm:text-2xl font-semibold text-webdev-silver">
                      {formatCurrency(invoice.amount)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {invoices.length > 3 && (
              <div className="text-center text-webdev-soft-gray text-sm">
                Click to view all {invoices.length} invoices
              </div>
            )}
          </div>
        )}
      </div>
      
      <InvoiceDetailsModal
        invoices={invoices}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default InvoicesSection;
