import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Truck,
  Filter,
  Search,
  X
} from 'lucide-react';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import ExportButton from '../../components/common/ExportButton';
import Select from '../../components/common/Select';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { PENDING_REPLENISHMENT_APPROVALS } from '../../data/mockSupplyChainData';
import { formatNumber } from '../../utils/formatters';
import { approveReplenishmentRecommendation, logActivity, STORAGE_KEYS } from '../../services/grdDataService';

export default function SupplyChainApprovals() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [approvals, setApprovals] = usePersistentState(STORAGE_KEYS.SCM_APPROVALS, PENDING_REPLENISHMENT_APPROVALS);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [authNote, setAuthNote] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const filteredApprovals = approvals.filter(item => {
    const matchUrgency = urgencyFilter === 'All' || item.urgency === urgencyFilter;
    const matchSearch = item.destinationHub.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchUrgency && matchSearch;
  });

  const handleApprove = (approvalId, e) => {
    if (e) e.stopPropagation();
    approveReplenishmentRecommendation({ recommendationId: approvalId, user: currentUser });
    setActionSuccessMessage(`Replenishment order ${approvalId} authorized. Active stock transfer created.`);
    toast.success(`Replenishment order ${approvalId} authorized. Active stock transfer created.`);
    setSelectedApproval(null);
  };

  const handleHold = (approvalId, e) => {
    if (e) e.stopPropagation();
    setApprovals(prev => prev.map(a => a.id === approvalId ? { ...a, status: 'Held for Review' } : a));
    logActivity({
      type: 'TRANSFER',
      action: `Replenishment Held (${approvalId})`,
      details: `${currentUser?.name || 'Supply Chain Manager'} put order ${approvalId} on hold.`,
      user: currentUser
    });
    setActionSuccessMessage(`Order ${approvalId} placed on hold.`);
    toast.warning(`Order ${approvalId} placed on hold.`);
    setSelectedApproval(null);
  };

  const columns = [
    {
      header: 'Order & Destination',
      accessor: 'id',
      className: 'whitespace-nowrap min-w-[130px]',
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-bold text-navy-950 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 whitespace-nowrap inline-block">
            {row.id}
          </span>
          <p className="font-semibold text-slate-900 text-xs mt-1 whitespace-nowrap">{row.destinationHub}</p>
          <p className="text-[11px] text-slate-500 whitespace-nowrap">{row.state}</p>
        </div>
      )
    },
    {
      header: 'Medicine & Formulation',
      accessor: 'medicineName',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900 text-xs">{row.medicineName}</p>
          <p className="text-[11px] text-slate-500 font-mono">{row.skuCode}</p>
          <span className="text-[10px] text-slate-400">{row.formulation}</span>
        </div>
      )
    },
    {
      header: 'Hub Stock / Cover',
      accessor: 'daysOfCoverRemaining',
      align: 'center',
      className: 'whitespace-nowrap min-w-[130px]',
      render: (row) => (
        <div className="flex flex-col items-center">
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${
            row.daysOfCoverRemaining < 2 ? 'bg-rose-100 text-rose-800' : row.daysOfCoverRemaining < 4 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {row.daysOfCoverRemaining} Days Cover
          </span>
          <p className="text-[11px] text-slate-500 mt-1 whitespace-nowrap">{formatNumber(row.currentStockUnits)} units left</p>
          <p className="text-[10px] text-slate-400 whitespace-nowrap">Demand: {row.dailyRunRate}/day</p>
        </div>
      )
    },
    {
      header: 'Recommended Restock',
      accessor: 'recommendedQty',
      align: 'right',
      className: 'whitespace-nowrap min-w-[140px]',
      sortValue: (row) => row.recommendedQty,
      render: (row) => (
        <div className="text-right">
          <span className="text-sm font-bold text-navy-950 font-sans block">
            {formatNumber(row.recommendedQty)} units
          </span>
          <span className="text-xs text-slate-500">Dispatch Order</span>
        </div>
      )
    },
    {
      header: 'Assigned Truck',
      accessor: 'truckAssigned',
      className: 'whitespace-nowrap min-w-[130px]',
      render: (row) => (
        <div>
          <span className="font-semibold text-xs text-navy-900 whitespace-nowrap">{row.truckAssigned}</span>
          <p className="text-[11px] text-slate-500 whitespace-nowrap">{row.transporter}</p>
          <span className="text-[10px] text-slate-400 whitespace-nowrap">~{row.estimatedTransitHours}h transit</span>
        </div>
      )
    },
    {
      header: 'Status & Action',
      accessor: 'status',
      align: 'center',
      className: 'whitespace-nowrap min-w-[150px]',
      render: (row) => {
        const isApproved = row.status === 'Approved for Dispatch';
        const isHeld = row.status === 'Held for Review';

        if (isApproved) {
          return (
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 whitespace-nowrap">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Dispatched
              </span>
            </div>
          );
        }

        if (isHeld) {
          return (
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 whitespace-nowrap">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                On Hold
              </span>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-1.5 justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={(e) => handleHold(row.id, e)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium cursor-pointer whitespace-nowrap"
            >
              Hold
            </button>
            <button
              type="button"
              onClick={(e) => handleApprove(row.id, e)}
              className="px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-navy-950 text-white text-xs font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approve
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-sans text-navy-950">
              Replenishment Restock Clearance Desk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-50 text-navy-800 border border-navy-200">
              Mother Hub: Guwahati Central
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Review automated stockout-prevention dispatches to all 12 Northeast district medical stores and hospitals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton label="Export Clearance Log" />
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage('')} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">Urgency Level:</span>
          <Select
            value={urgencyFilter}
            onChange={(val) => setUrgencyFilter(val)}
            options={[
              { value: 'All', label: 'All Urgencies' },
              { value: 'Critical', label: 'Critical (<2 Days)' },
              { value: 'High', label: 'High Demand' },
              { value: 'Medium', label: 'Routine Restock' }
            ]}
            icon={Filter}
          />
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search depot, medicine or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9 py-1.5 text-xs w-full"
          />
        </div>
      </div>

      {/* Main Table */}
      <Table
        title="Pending Restock Orders"
        subtitle="Click any row to view complete demand analytics, buffer metrics, and authorization note"
        columns={columns}
        data={filteredApprovals}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => setSelectedApproval(row)}
      />

      {/* Modal */}
      {selectedApproval && (
        <Modal
          isOpen={!!selectedApproval}
          onClose={() => setSelectedApproval(null)}
          title={`Order Clearance: ${selectedApproval.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl space-y-2 border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Destination Hub:</span>
                <span className="font-bold text-slate-900">{selectedApproval.destinationHub} ({selectedApproval.state})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Medicine:</span>
                <span className="font-bold text-slate-900">{selectedApproval.medicineName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Recommended Dispatch:</span>
                <span className="font-bold text-emerald-700 text-sm">{formatNumber(selectedApproval.recommendedQty)} units</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Remaining Safety Cover:</span>
                <span className="font-bold text-rose-700">{selectedApproval.daysOfCoverRemaining} Days ({formatNumber(selectedApproval.currentStockUnits)} units left)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Logistics Carrier:</span>
                <span className="font-bold text-navy-900">{selectedApproval.transporter} &bull; {selectedApproval.truckAssigned}</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Authorization Note:
              </label>
              <textarea
                value={authNote}
                onChange={(e) => setAuthNote(e.target.value)}
                placeholder="Special handling or driver transit remarks..."
                rows={3}
                className="textarea w-full"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedApproval(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={(e) => handleHold(selectedApproval.id, e)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold cursor-pointer"
              >
                Put on Hold
              </button>
              <button
                type="button"
                onClick={(e) => handleApprove(selectedApproval.id, e)}
                className="px-4 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-950 text-white font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Authorize Dispatch
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
