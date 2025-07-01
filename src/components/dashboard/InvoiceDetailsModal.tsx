
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Receipt, AlertTriangle, CheckCircle2, Clock, Calendar } from 'lucide-react';
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
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
}

const InvoiceDetailsModal = ({ invoice, isOpen, onClose }: InvoiceDetailsModalProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="w-6 h-6 text-green-400" />;
      case 'overdue':
        return <AlertTriangle className="w-6 h-6 text-red-400" />;
      case 'sent':
        return <Clock className="w-6 h-6 text-webdev-gradient-blue" />;
      case 'draft':
        return <Receipt className="w-6 h-6 text-webdev-soft-gray" />;
      default:
        return <Receipt className="w-6 h-6 text-webdev-soft-gray" />;
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-webdev-glass-border bg-webdev-black text-webdev-silver max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl sm:text-2xl font-light text-webdev-silver">
            {getStatusIcon(invoice.status)}
            Invoice #{invoice.invoice_number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Amount */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
              {formatStatus(invoice.status)}
            </span>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold text-webdev-silver">
                {formatCurrency(invoice.amount)}
              </div>
              {invoice.status === 'overdue' && (
                <div className="text-red-400 text-sm font-medium">Overdue</div>
              )}
            </div>
          </div>

          {/* Description */}
          {invoice.description && (
            <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border">
              <h3 className="text-webdev-silver font-medium mb-2">Description</h3>
              <p className="text-webdev-soft-gray text-sm sm:text-base break-words">{invoice.description}</p>
            </div>
          )}

          {/* Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-webdev-gradient-blue" />
                <span className="text-webdev-soft-gray text-sm">Issue Date</span>
              </div>
              <div className="text-webdev-silver font-medium">
                {format(new Date(invoice.issue_date), 'MMM d, yyyy')}
              </div>
            </div>

            <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-webdev-gradient-purple" />
                <span className="text-webdev-soft-gray text-sm">Due Date</span>
              </div>
              <div className="text-webdev-silver font-medium">
                {format(new Date(invoice.due_date), 'MMM d, yyyy')}
              </div>
            </div>

            {invoice.paid_date && (
              <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border sm:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-webdev-soft-gray text-sm">Paid On</span>
                </div>
                <div className="text-green-400 font-medium">
                  {format(new Date(invoice.paid_date), 'MMM d, yyyy')}
                </div>
              </div>
            )}
          </div>

          {/* Payment Status Summary */}
          <div className={`glass-effect rounded-xl p-4 border border-webdev-glass-border ${
            invoice.status === 'paid' ? 'bg-green-400/5' : 'bg-webdev-gradient-blue/5'
          }`}>
            <div className="text-center">
              <div className={`font-semibold text-lg ${
                invoice.status === 'paid' ? 'text-green-400' : 'text-webdev-gradient-blue'
              }`}>
                {invoice.status === 'paid' ? 'Payment Received' : 'Payment Pending'}
              </div>
              <div className="text-webdev-soft-gray text-sm">
                {invoice.status === 'paid' 
                  ? 'This invoice has been fully paid' 
                  : 'This invoice is awaiting payment'
                }
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetailsModal;
