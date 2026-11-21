import React, { useState } from 'react';
import {
  CreditCard,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  Download,
  Search,
  Plus,
  FileSpreadsheet
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import { DISTRIBUTOR_PROFILE, DISTRIBUTOR_LEDGER } from '../../data/mockDistributorPortalData';
import { formatCurrency } from '../../utils/formatters';

export default function DistributorLedger() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('NEFT');
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  // Filter transactions
  const filteredLedger = DISTRIBUTOR_LEDGER.filter(item => {
    return !searchQuery || 
      item.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalDebits = DISTRIBUTOR_LEDGER.reduce((acc, curr) => acc + curr.debitAmountINR, 0);
  const totalCredits = DISTRIBUTOR_LEDGER.reduce((acc, curr) => acc + curr.creditAmountINR, 0);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!utrNumber || !paymentAmount) return;
    setPaymentSubmitted(true);
  };

  const ledgerColumns = [
    {
      header: 'Date & Voucher No',
      accessor: 'date',
      className: 'whitespace-nowrap min-w-[130px]',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-navy-950 text-xs whitespace-nowrap">{row.documentNumber}</span>
          <div className="text-2xs text-slate-500 whitespace-nowrap mt-0.5">{row.date}</div>
        </div>
      )
    },
    {
      header: 'Particulars / Description',
      accessor: 'description',
      render: (row) => (
        <div className="max-w-[280px]">
          <span className="font-semibold text-navy-900 text-xs block">{row.type}</span>
          <p className="text-2xs text-slate-500 truncate mt-0.5">{row.description}</p>
        </div>
      )
    },
    {
      header: 'Debit (Invoiced)',
      accessor: 'debitAmountINR',
      sortValue: (row) => row.debitAmountINR,
      render: (row) => (
        <div className="text-right">
          {row.debitAmountINR > 0 ? (
            <span className="font-bold text-navy-950 text-xs font-sans">
              {formatCurrency(row.debitAmountINR)}
            </span>
          ) : (
            <span className="text-slate-300">-</span>
          )}
        </div>
      )
    },
    {
      header: 'Credit (Paid)',
      accessor: 'creditAmountINR',
      sortValue: (row) => row.creditAmountINR,
      render: (row) => (
        <div className="text-right">
          {row.creditAmountINR > 0 ? (
            <span className="font-bold text-emerald-700 text-xs font-sans">
              +{formatCurrency(row.creditAmountINR)}
            </span>
          ) : (
            <span className="text-slate-300">-</span>
          )}
        </div>
      )
    },
    {
      header: 'Running Balance',
      accessor: 'balanceOutstandingINR',
      sortValue: (row) => row.balanceOutstandingINR,
      render: (row) => (
        <div className="text-right">
          <span className="font-bold text-navy-950 text-xs sm:text-sm font-sans">
            {formatCurrency(row.balanceOutstandingINR)}
          </span>
          <div className="text-2xs text-slate-400">Dr Balance</div>
        </div>
      )
    },
    {
      header: 'Status & Due Date',
      accessor: 'paymentStatus',
      render: (row) => {
        let isSettled = row.paymentStatus.toLowerCase().includes('settled') || row.paymentStatus.toLowerCase().includes('credited');
        return (
          <div>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold border ${
              isSettled 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {isSettled ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
              {row.paymentStatus}
            </span>
            {row.dueDate && (
              <span className="block text-2xs text-slate-400 mt-0.5">Due: {row.dueDate}</span>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans font-bold text-2xl text-navy-950">Credit &amp; Account Ledger</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Pragjyotish Medico Statement
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Complete billing ledger, sanctioned credit headroom, invoice debits, and NEFT/RTGS payment reconciliations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-semibold"
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," + 
                "Date,Document,Particulars,Debit,Credit,Balance,Status\n" +
                DISTRIBUTOR_LEDGER.map(l => `${l.date},${l.documentNumber},"${l.description}",${l.debitAmountINR},${l.creditAmountINR},${l.balanceOutstandingINR},${l.paymentStatus}`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `Ledger_Pragjyotish_Medico_${new Date().toISOString().slice(0,10)}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-slate-500" />
            Download Statement (CSV)
          </Button>

          <Button
            size="sm"
            className="bg-navy-900 hover:bg-navy-950 text-white text-xs font-semibold flex items-center gap-1.5"
            onClick={() => {
              setPaymentSubmitted(false);
              setUtrNumber('');
              setPaymentAmount('');
              setIsPaymentModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Notify Payment / UTR
          </Button>
        </div>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Sanctioned Credit Limit"
          value={formatCurrency(DISTRIBUTOR_PROFILE.creditLimitINR)}
          subtitle="Dhanuka Finance approved"
          icon={CreditCard}
          trend={{ direction: 'up', value: '30 Days Net' }}
        />
        <StatCard
          title="Current Outstanding"
          value={formatCurrency(DISTRIBUTOR_PROFILE.currentOutstandingINR)}
          subtitle="Total pending invoices"
          icon={Clock}
          trend={{ direction: 'neutral', value: 'Within Term' }}
        />
        <StatCard
          title="Available Credit Headroom"
          value={formatCurrency(DISTRIBUTOR_PROFILE.availableCreditINR)}
          subtitle="Ready for new indents"
          icon={CheckCircle2}
          trend={{ direction: 'up', value: '58.9% Available' }}
        />
        <StatCard
          title="Next Due Payment"
          value="₹3,18,000"
          subtitle="Due Dec 18, 2026"
          icon={Calendar}
          trend={{ direction: 'neutral', value: 'PO-1085' }}
        />
      </div>

      {/* Credit Utilization Progress Bar & Bank Details Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Credit Meter (7 Cols) */}
        <div className="md:col-span-7 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-navy-950">Credit Line Utilization</span>
            <span className="text-xs font-semibold text-slate-500">
              {((DISTRIBUTOR_PROFILE.currentOutstandingINR / DISTRIBUTOR_PROFILE.creditLimitINR) * 100).toFixed(1)}% Utilized
            </span>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
            <div 
              className="bg-navy-900 h-full transition-all"
              style={{ width: `${(DISTRIBUTOR_PROFILE.currentOutstandingINR / DISTRIBUTOR_PROFILE.creditLimitINR) * 100}%` }}
              title="Outstanding: ₹18.50 Lakhs"
            />
            <div 
              className="bg-emerald-500 h-full transition-all"
              style={{ width: `${(DISTRIBUTOR_PROFILE.availableCreditINR / DISTRIBUTOR_PROFILE.creditLimitINR) * 100}%` }}
              title="Available: ₹26.50 Lakhs"
            />
          </div>

          <div className="flex items-center justify-between text-2xs pt-1">
            <span className="flex items-center gap-1.5 text-navy-900 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-navy-900" />
              Utilized: {formatCurrency(DISTRIBUTOR_PROFILE.currentOutstandingINR)}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Available: {formatCurrency(DISTRIBUTOR_PROFILE.availableCreditINR)}
            </span>
          </div>
        </div>

        {/* NEFT / RTGS Bank Details (5 Cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-slate-50 to-slate-100/70 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-navy-950 font-bold">
            <Building2 className="w-4 h-4 text-terracotta-600" />
            <span>Remittance Bank Details (Beneficiary)</span>
          </div>
          <div className="space-y-1 text-2xs text-slate-600 pt-1">
            <p><strong>A/C Name:</strong> GRD Pharmaceuticals Limited</p>
            <p><strong>Bank:</strong> HDFC Bank, Panbazar Branch, Guwahati</p>
            <p><strong>Account Number:</strong> <span className="font-mono font-bold text-navy-900">5020002148102</span></p>
            <p><strong>IFSC Code:</strong> <span className="font-mono font-bold text-navy-900">HDFC0000184</span></p>
            <p><strong>Virtual UPI ID:</strong> <span className="font-mono font-bold text-navy-900">grdpharma.dist@hdfcbank</span></p>
          </div>
        </div>

      </div>

      {/* Ledger Table Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h3 className="font-sans font-bold text-base text-navy-950">Detailed Account Statement</h3>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search voucher, NEFT, or invoice..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 transition-all"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="mt-2">
          <Table
            columns={ledgerColumns}
            data={filteredLedger}
            keyField="id"
            searchPlaceholder=""
            rowsPerPage={8}
          />
        </div>
      </div>

      {/* Notify Payment / Submit UTR Modal */}
      {isPaymentModalOpen && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title="Submit Payment Remittance / UTR"
          subtitle="Notify Dhanuka Group finance desk of your NEFT/RTGS transaction"
          maxWidth="max-w-md"
        >
          {paymentSubmitted ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-navy-950 text-sm">Payment Advice Submitted</h4>
                <p className="text-xs text-slate-600 mt-1">
                  UTR <strong>{utrNumber}</strong> for <strong>₹{paymentAmount}</strong> has been transmitted to Accounts. Headroom will be updated upon bank clearance within 2 hours.
                </p>
              </div>
              <Button size="sm" className="bg-navy-900 text-white" onClick={() => setIsPaymentModalOpen(false)}>
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePaymentSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                  UTR / Transaction Reference Number
                </label>
                <input
                  type="text"
                  required
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. HDFC20261118091823"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="e.g. 318000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Payment Mode
                </label>
                <Select
                  value={paymentMode}
                  onChange={(val) => setPaymentMode(val)}
                  options={[
                    { value: 'NEFT', label: 'NEFT (National Electronic Funds Transfer)' },
                    { value: 'RTGS', label: 'RTGS (Real Time Gross Settlement)' },
                    { value: 'IMPS', label: 'IMPS Instant Transfer' },
                    { value: 'UPI', label: 'Corporate UPI Remittance' }
                  ]}
                  className="w-full justify-between"
                  dropdownClassName="w-full"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-2xs text-slate-500">
                Remitted to: <strong>GRD Pharmaceuticals Ltd (HDFC Panbazar · A/C 5020002148102)</strong>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsPaymentModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-navy-900 hover:bg-navy-950 text-white font-semibold">
                  Submit Payment Advice
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}

    </div>
  );
}
