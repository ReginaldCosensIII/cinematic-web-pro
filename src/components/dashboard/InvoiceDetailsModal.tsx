
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Receipt, DollarSign, AlertTriangle, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';

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

interface InvoiceDetailsModalProps {
  invoices: Invoice[];
  isOpen: boolean;
  onClose: () => void;
}

const InvoiceDetailsModal = ({ invoices, isOpen, onClose }: InvoiceDetailsModalProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'sent':
        return <Clock className="w-4 h-4 text-webdev-gradient-blue" />;
      case 'draft':
        return <Receipt className="w-4 h-4 text-webdev-soft-gray" />;
      default:
        return <Receipt className="w-4 h-4 text-webdev-soft-gray" />;
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

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const outstandingAmount = totalAmount - paidAmount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-webdev-glass-border bg-webdev-black text-webdev-silver max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl sm:text-2xl font-light text-webdev-silver">
            <Receipt className="w-6 h-6 text-webdev-gradient-blue" />
            Invoices & Payments
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border text-center">
              <div className="text-green-400 font-semibold text-lg">{formatCurrency(paidAmount)}</div>
              <div className="text-webdev-soft-gray text-sm">Paid</div>
            </div>
            <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border text-center">
              <div className="text-webdev-gradient-blue font-semibold text-lg">{formatCurrency(outstandingAmount)}</div>
              <div className="text-webdev-soft-gray text-sm">Outstanding</div>
            </div>
            <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border text-center">
              <div className="text-webdev-silver font-semibold text-lg">{formatCurrency(totalAmount)}</div>
              <div className="text-webdev-soft-gray text-sm">Total</div>
            </div>
          </div>

          {/* Invoices List */}
          <div className="space-y-4">
            {invoices.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="w-12 h-12 text-webdev-soft-gray mx-auto mb-4 opacity-50" />
                <p className="text-webdev-soft-gray text-lg">No invoices yet</p>
                <p className="text-webdev-soft-gray/70">Your invoices will appear here once they're created</p>
              </div>
            ) : (
              invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="glass-effect rounded-xl p-4 sm:p-6 border border-webdev-glass-border hover:border-webdev-gradient-blue/50 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getStatusIcon(invoice.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="text-lg font-medium text-webdev-silver break-words">
                            Invoice #{invoice.invoice_number}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)} self-start`}>
                            {formatStatus(invoice.status)}
                          </span>
                        </div>
                        {invoice.description && (
                          <p className="text-webdev-soft-gray mb-3 text-sm sm:text-base break-words">{invoice.description}</p>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-webdev-soft-gray">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">Issued: {format(new Date(invoice.issue_date), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">Due: {format(new Date(invoice.due_date), 'MMM d, yyyy')}</span>
                          </div>
                          {invoice.paid_date && (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <span className="text-green-400 truncate">
                                Paid: {format(new Date(invoice.paid_date), 'MMM d, yyyy')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl sm:text-2xl font-semibold text-webdev-silver">
                        {formatCurrency(invoice.amount)}
                      </div>
                      {invoice.status === 'overdue' && (
                        <div className="text-red-400 text-sm font-medium">Overdue</div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetailsModal;
