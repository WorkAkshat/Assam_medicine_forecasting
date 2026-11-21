import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Check,
  X,
  Search,
  Download,
  RotateCcw,
  MapPin
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { COMMERCIAL_CREDIT_APPROVALS } from '../../data/mockSalesDirectorData';
import { formatCurrency } from '../../utils/formatters';
import { processCreditApproval, STORAGE_KEYS } from '../../services/grdDataService';

export default function SalesCreditApprovals() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [approvals, setApprovals] = usePersistentState(STORAGE_KEYS.CREDIT_APPROVALS, COMMERCIAL_CREDIT_APPROVALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [territoryFilter, setTerritoryFilter] = useState('All');
  const [scoreFilter, setScoreFilter] = useState('All');

  const [selectedApproval, setSelectedApproval] = useState(null);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState('approve'); // approve, reject, adjust
  const [directorNotes, setDirectorNotes] = useState('');

  const hasActiveFilters = searchQuery.trim() !== '' || 
    statusFilter !== 'All' || 
    territoryFilter !== 'All' || 
    scoreFilter !== 'All';

  const resetAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setTerritoryFilter('All');
    setScoreFilter('All');
  };

  const filteredApprovals = approvals.filter(item => {
    const matchesSearch = !searchQuery || 
      item.distributorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.territory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requestedOrderNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesTerritory = territoryFilter === 'All' || item.territory.includes(territoryFilter);

    const scoreNum = parseInt(item.reliabilityScore) || 90;
    const matchesScore = scoreFilter === 'All' ||
      (scoreFilter === 'GradeA' && scoreNum >= 95) ||
      (scoreFilter === 'GradeB' && scoreNum >= 90 && scoreNum < 95);

    return matchesSearch && matchesStatus && matchesTerritory && matchesScore;
  });

  const pendingApprovals = approvals.filter(a => a.status === 'Pending Approval');
  const totalPendingValue = pendingApprovals.reduce((acc, curr) => acc + (curr.requestedOrderValueINR || 0), 0);

  const handleOpenDecision = (item, type) => {
    setSelectedApproval(item);
    setDecisionType(type);
    setDirectorNotes('');
    setIsDecisionModalOpen(true);
  };

  const handleConfirmDecision = (e) => {
    e.preventDefault();
    if (!selectedApproval) return;

    processCreditApproval({
      approvalId: selectedApproval.id,
      decision: decisionType,
      directorNotes,
      user: currentUser
    });

    const isApproved = decisionType === 'approve' || decisionType === 'adjust';
    const newStatusText = isApproved ? 'Approved & Released' : 'Held for Payment';
    setApprovals(prev => prev.map(a => a.id === selectedApproval.id ? {
      ...a,
      status: newStatusText,
      directorNotes: directorNotes || (isApproved ? 'Approved by Sales Director Rupjyoti Bhattacharya' : 'Held for payment clearance')
    } : a));

    setIsDecisionModalOpen(false);
    if (decisionType === 'approve' || decisionType === 'adjust') {
      toast.success(`Order ${selectedApproval.requestedOrderNumber} for ${selectedApproval.distributorName} approved and released to warehouse!`);
    } else {
      toast.warning(`Order ${selectedApproval.requestedOrderNumber} for ${selectedApproval.distributorName} held for overdue payment.`);
    }
  };

  const approvalColumns = [
    {
      header: 'Distributor & Territory',
      accessor: 'distributorName',
      className: 'min-w-[180px]',
      render: (row) => (
        <div>
          <span className="font-bold text-navy-950 text-xs sm:text-sm font-sans">{row.distributorName}</span>
          <div className="text-2xs text-slate-500 mt-0.5">{row.territory} · {row.contactPerson}</div>
          <span className="text-2xs text-slate-400 font-mono">ID: {row.distributorId}</span>
        </div>
      )
    },
    {
      header: 'Requested Indent',
      accessor: 'requestedOrderNumber',
      className: 'whitespace-nowrap min-w-[140px]',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-navy-950 text-xs whitespace-nowrap">{row.requestedOrderNumber}</span>
          <div className="text-2xs text-slate-500 whitespace-nowrap">{row.requestedTime}</div>
          <span className="text-2xs font-semibold text-terracotta-700 whitespace-nowrap">{row.requestedAction}</span>
        </div>
      )
    },
    {
      header: 'Order Value',
      accessor: 'requestedOrderValueINR',
      align: 'right',
      className: 'whitespace-nowrap min-w-[130px]',
      sortValue: (row) => row.requestedOrderValueINR,
      render: (row) => (
        <div className="text-right">
          <span className="font-bold text-xs sm:text-sm text-navy-950 font-sans block">{formatCurrency(row.requestedOrderValueINR)}</span>
          <div className="text-2xs text-slate-400 whitespace-nowrap">Headroom: {formatCurrency(row.creditHeadroomAfterOrderINR)}</div>
        </div>
      )
    },
    {
      header: 'Credit Health & Score',
      accessor: 'reliabilityScore',
      align: 'center',
      className: 'whitespace-nowrap min-w-[140px]',
      render: (row) => (
        <div className="flex flex-col items-center">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            {row.reliabilityScore}
          </span>
          <div className="text-2xs text-slate-500 mt-1 whitespace-nowrap">Avg cycle: {row.pastPaymentDaysAvg} days</div>
        </div>
      )
    },
    {
      header: 'Approval Status',
      accessor: 'status',
      align: 'center',
      className: 'whitespace-nowrap min-w-[140px]',
      render: (row) => {
        let badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
        if (row.status.includes('Approved') || row.status.includes('Released')) {
          badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
        } else if (row.status.includes('Held')) {
          badgeColor = 'bg-slate-100 text-slate-800 border-slate-300';
        }

        return (
          <div className="flex justify-center">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${badgeColor}`}>
              {row.status}
            </span>
          </div>
        );
      }
    },
    {
      header: 'Director Action',
      align: 'center',
      sortable: false,
      className: 'whitespace-nowrap min-w-[160px]',
      render: (row) => {
        if (row.status !== 'Pending Approval') {
          return (
            <div className="flex justify-center">
              <span className="text-2xs text-slate-400 font-semibold whitespace-nowrap">Action recorded</span>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-1.5 justify-center">
            <Button
              size="sm"
              className="bg-navy-900 hover:bg-navy-950 text-white text-xs py-1 px-2.5 flex items-center gap-1 whitespace-nowrap cursor-pointer shadow-xs"
              onClick={() => handleOpenDecision(row, 'approve')}
            >
              <Check className="w-3.5 h-3.5" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs py-1 px-2 text-slate-600 hover:text-rose-600 whitespace-nowrap cursor-pointer"
              onClick={() => handleOpenDecision(row, 'reject')}
            >
              <X className="w-3.5 h-3.5" />
              Hold
            </Button>
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
            <h1 className="font-sans font-bold text-2xl text-navy-950">Distributor Credit Clearance Desk</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
              {pendingApprovals.length} Pending Actions
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Commercial credit authorization desk for release of distributor purchase orders and temporary credit line adjustments.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Download}
          className="text-xs font-semibold whitespace-nowrap self-start sm:self-auto shrink-0"
          onClick={() => {
            const csvContent = "data:text/csv;charset=utf-8," + 
              "ID,Distributor,Territory,Contact,Order_No,Order_Value_INR,Sanctioned_Limit_INR,Outstanding_INR,Headroom_INR,Reliability_Score,Status\n" +
              approvals.map(a => `"${a.id}","${a.distributorName}","${a.territory}","${a.contactPerson}","${a.requestedOrderNumber}",${a.requestedOrderValueINR},${a.sanctionedLimitINR},${a.currentOutstandingINR},${a.creditHeadroomAfterOrderINR},"${a.reliabilityScore}","${a.status}"`).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Distributor_Credit_Approvals_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          Download List (CSV)
        </Button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Pending Clearances"
          value={pendingApprovals.length}
          subtitle="Distributor purchase indents"
          icon={Clock}
          trend={{ direction: 'neutral', value: formatCurrency(totalPendingValue) }}
        />
        <StatCard
          title="Orders Released (MTD)"
          value="16 Indents"
          subtitle="Direct central depot loading"
          icon={CheckCircle2}
          trend={{ direction: 'up', value: '₹68.4 Lakhs Total' }}
        />
        <StatCard
          title="Avg Payment Reliability"
          value="94.3%"
          subtitle="Grade A channel partners"
          icon={ShieldCheck}
          trend={{ direction: 'up', value: '28-Day Cycle' }}
        />
        <StatCard
          title="Total Market Exposure"
          value="₹1.12 Crores"
          subtitle="Across 14 C&F distributors"
          icon={CreditCard}
          trend={{ direction: 'neutral', value: 'Controlled Risk' }}
        />
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Select
              label="Clearance Status"
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              options={[
                { value: 'All', label: 'All Statuses' },
                { value: 'Pending Approval', label: 'Pending Approval (Action Required)' },
                { value: 'Approved & Released', label: 'Approved & Released' },
                { value: 'Held for Payment', label: 'Held for Payment' }
              ]}
              icon={Clock}
            />

            <Select
              label="Distributor Territory"
              value={territoryFilter}
              onChange={(val) => setTerritoryFilter(val)}
              options={[
                { value: 'All', label: 'All Territories' },
                { value: 'Kamrup', label: 'Kamrup Metro (Guwahati)' },
                { value: 'Barak Valley', label: 'Barak Valley (Silchar)' },
                { value: 'Tripura', label: 'West Tripura (Agartala)' }
              ]}
              icon={MapPin}
            />

            <Select
              label="Credit Score & Grade"
              value={scoreFilter}
              onChange={(val) => setScoreFilter(val)}
              options={[
                { value: 'All', label: 'All Credit Grades' },
                { value: 'GradeA', label: 'Grade A / A+ (≥95% Score)' },
                { value: 'GradeB', label: 'Grade B+ (90-94% Score)' }
              ]}
              icon={ShieldCheck}
            />

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                title="Reset all credit approval filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative min-w-[220px] w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search distributor, PO#, or contact..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 transition-all"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:inline">
              Showing {filteredApprovals.length} of {approvals.length}
            </span>
          </div>
        </div>
      </div>

      {/* Credit Approvals Table Card */}
      <Table
        title="Active Clearance Queue"
        subtitle="Purchase orders awaiting sales director credit override and warehouse dispatch release"
        columns={approvalColumns}
        data={filteredApprovals}
        keyExtractor={(row) => row.id}
        pageSize={10}
        compact={true}
        exportable={true}
        exportFilename={`GRD_Credit_Approvals_${new Date().toISOString().split('T')[0]}`}
        emptyMessage="No distributor credit approval records found matching your active filter criteria."
      />

      {/* Decision Modal */}
      {isDecisionModalOpen && selectedApproval && (
        <Modal
          isOpen={isDecisionModalOpen}
          onClose={() => setIsDecisionModalOpen(false)}
          title={decisionType === 'approve' ? 'Approve & Release Purchase Order' : 'Hold Purchase Order Indent'}
          subtitle={`Order ${selectedApproval.requestedOrderNumber} · ${selectedApproval.distributorName}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleConfirmDecision} className="space-y-4 text-xs text-slate-700">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Value:</span>
                <strong className="text-navy-950 font-mono font-bold">{formatCurrency(selectedApproval.requestedOrderValueINR)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sanctioned Limit:</span>
                <span className="font-mono text-slate-700">{formatCurrency(selectedApproval.sanctionedLimitINR)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Outstanding:</span>
                <span className="font-mono text-slate-700">{formatCurrency(selectedApproval.currentOutstandingINR)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Remaining Headroom:</span>
                <span className="font-mono font-bold text-emerald-700">{formatCurrency(selectedApproval.creditHeadroomAfterOrderINR)}</span>
              </div>
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Sales Director Authorization Note
              </label>
              <textarea
                rows={3}
                value={directorNotes}
                onChange={(e) => setDirectorNotes(e.target.value)}
                placeholder="Add commercial approval notes (e.g. Approved under GMCH emergency allocation)..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDecisionModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className={decisionType === 'approve' ? 'bg-navy-900 hover:bg-navy-950 text-white font-bold' : 'bg-rose-600 hover:bg-rose-700 text-white font-bold'}
              >
                {decisionType === 'approve' ? 'Confirm Approval & Release' : 'Confirm Hold'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
