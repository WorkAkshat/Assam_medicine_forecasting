import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Edit3,
  Filter,
  DollarSign,
  CheckCircle2,
  Plus
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Select from '../components/common/Select';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import { usePersistentState } from '../hooks/usePersistentState';
import { MOCK_REPLENISHMENT_RECOMMENDATIONS } from '../data/mockReplenishment';
import { MOCK_SKUS } from '../data/mockSkus';
import { formatNumber, formatCurrency } from '../utils/formatters';
import { approveReplenishmentRecommendation, STORAGE_KEYS } from '../services/grdDataService';

export default function Replenishment() {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [recommendations, setRecommendations] = usePersistentState(STORAGE_KEYS.REPLENISHMENT, MOCK_REPLENISHMENT_RECOMMENDATIONS);
  const [skus] = usePersistentState(STORAGE_KEYS.SKUS, MOCK_SKUS);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [selectedRep, setSelectedRep] = useState(null);
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editQty, setEditQty] = useState('');

  // Manual Indent Creation Modal State
  const [isCreateIndentModalOpen, setIsCreateIndentModalOpen] = useState(false);
  const [indentSku, setIndentSku] = useState('GRD-TAB-001');
  const [indentOrigin, setIndentOrigin] = useState('Guwahati Central Depot (Mother Hub)');
  const [indentDest, setIndentDest] = useState('Silchar Regional Depot');
  const [indentQty, setIndentQty] = useState(5000);
  const [indentPriority, setIndentPriority] = useState('High');
  const [indentRationale, setIndentRationale] = useState('Pre-monsoon buffer rebalancing along Barak Valley corridor');

  // Robust getters to handle mock data properties cleanly
  const getAvailableStock = (r) => r.currentAvailableStock ?? r.currentStockAtDestination ?? 0;
  const getCoverDays = (r) => r.stockoutRiskDays ?? r.currentCoverDays ?? 0;
  const getDemand30D = (r) => r.expected30DayDemand ?? r.projected30DayDemand ?? 0;
  const getLeadTime = (r) => r.estimatedLeadTimeDays ?? r.transitLeadTimeDays ?? 0;
  const getReplenishQty = (r) => r.recommendedReplenishQty ?? r.suggestedTransferQty ?? 0;
  const getTransferValue = (r) => r.totalTransferValueINR ?? (getReplenishQty(r) * (r.unitCostINR || 25));
  const getRationale = (r) => r.rationale || r.reasonExplanation || 'Demand prediction requires buffer stock replenishment.';

  const handleCreateManualIndent = (e) => {
    e.preventDefault();
    const skuObj = (skus || MOCK_SKUS).find(s => s.code === indentSku) || { name: 'Paracetamol 650mg Tablets', unitPrice: 28 };
    const newIndent = {
      id: `REP-2026-${Math.floor(100 + Math.random() * 900)}`,
      skuCode: indentSku,
      skuName: skuObj.brandName ? `${skuObj.name} (${skuObj.brandName})` : skuObj.name,
      sourceFacility: indentOrigin,
      destinationFacility: indentDest,
      currentStockAtDestination: 1200,
      currentCoverDays: indentPriority === 'Critical' ? 4 : 8,
      projected30DayDemand: Math.round(Number(indentQty) * 1.2),
      recommendedReplenishQty: Number(indentQty),
      unitCostINR: skuObj.tradePrice || skuObj.unitPrice || 35,
      totalTransferValueINR: Number(indentQty) * (skuObj.tradePrice || skuObj.unitPrice || 35),
      urgencyPriority: indentPriority,
      workflowStatus: 'Pending Review',
      rationale: indentRationale,
      transitLeadTimeDays: indentDest.includes('Silchar') || indentDest.includes('Agartala') ? 3 : 2
    };

    setRecommendations(prev => [newIndent, ...prev]);
    setIsCreateIndentModalOpen(false);
    toast.success(`Replenishment indent ${newIndent.id} created for ${indentDest}! Pending manager approval.`);
  };

  const handleApprove = (id, customQty) => {
    approveReplenishmentRecommendation({ recommendationId: id, user: currentUser });
    toast.success(`Restock approved! Inter-depot stock transfer order created in logistics manifest.`);
    setSelectedRep(null);
  };

  const handleReject = (id) => {
    setRecommendations(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          workflowStatus: 'Deferred / Rejected',
          approvalHistory: [
            ...(item.approvalHistory || []),
            { date: 'Just Now', action: 'Deferred with Justification', user: 'Dr. Abhijit Sarma' }
          ]
        };
      }
      return item;
    }));
    toast.info(`Restock indent ${id} deferred with justification.`);
    setSelectedRep(null);
  };

  const filteredItems = recommendations.filter(item => {
    const matchPri = filterPriority === 'All' || item.urgencyPriority === filterPriority;
    const matchStat = filterStatus === 'All' || item.workflowStatus.includes(filterStatus);
    return matchPri && matchStat;
  });

  const pendingCount = recommendations.filter(r => r.workflowStatus === 'Pending Review').length;
  const approvedCount = recommendations.filter(r => r.workflowStatus === 'Approved').length;
  const totalTransferValue = recommendations.reduce((acc, r) => acc + getTransferValue(r), 0);

  const tableColumns = [
    {
      header: 'Formulation & SKU',
      accessor: 'skuName',
      render: (row) => (
        <div>
          <span className="font-sans font-bold text-navy-950 text-xs">{row.skuCode}</span>
          <div className="font-semibold text-navy-900 text-xs truncate max-w-[200px]">{row.skuName}</div>
        </div>
      )
    },
    {
      header: 'Dispatch Origin ➔ Destination',
      render: (row) => (
        <div className="text-xs">
          <div className="text-slate-600 font-medium">{row.sourceFacility}</div>
          <div className="font-bold text-navy-950 flex items-center gap-1 mt-0.5">
            <ArrowRight className="w-3 h-3 text-terracotta-600" />
            <span>{row.destinationFacility}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Stock Cover & Demand',
      sortValue: (row) => row.currentCoverDays,
      render: (row) => (
        <div className="text-xs">
          <span className="font-bold text-rose-700">{row.currentCoverDays}d cover</span>
          <div className="text-2xs text-slate-500">30D Demand: {formatNumber(row.projected30DayDemand)} units</div>
        </div>
      )
    },
    {
      header: 'Recommended Transfer',
      accessor: 'suggestedTransferQty',
      sortValue: (row) => row.suggestedTransferQty,
      render: (row) => (
        <div className="text-right font-sans">
          <span className="font-bold text-emerald-700 text-sm">+{formatNumber(row.suggestedTransferQty)}</span>
          <div className="text-2xs text-slate-400">units</div>
        </div>
      )
    },
    {
      header: 'Lead Time',
      sortValue: (row) => row.transitLeadTimeDays,
      className: 'whitespace-nowrap text-center',
      render: (row) => (
        <div className="text-center font-sans text-xs">
          <span className="inline-block bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200/80 font-semibold text-2xs">
            {row.transitLeadTimeDays} Days
          </span>
        </div>
      )
    },
    {
      header: 'Priority',
      className: 'whitespace-nowrap',
      render: (row) => (
        <Badge variant={row.urgencyPriority === 'Critical' ? 'danger' : 'warning'}>
          {row.urgencyPriority}
        </Badge>
      )
    },
    {
      header: 'Approval State',
      className: 'whitespace-nowrap',
      render: (row) => (
        <Badge variant={row.workflowStatus === 'Approved' ? 'success' : row.workflowStatus === 'Pending Review' ? 'warning' : 'neutral'}>
          {row.workflowStatus}
        </Badge>
      )
    },
    {
      header: 'Actions',
      sortable: false,
      className: 'whitespace-nowrap text-right',
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-end">
          {row.workflowStatus === 'Pending Review' ? (
            <>
              <button
                onClick={() => handleApprove(row.id)}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-2xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  setSelectedRep(row);
                  setEditQty(String(row.suggestedTransferQty));
                }}
                className="p-1.5 text-slate-500 hover:text-navy-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                title="Edit quantity"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <span className="text-2xs font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Done
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans font-bold text-2xl text-navy-950">
              Stock Restocking &amp; Approvals
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Manager Approval Required
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
            Automated restocking suggestions based on current warehouse stock and predicted hospital demand. Approve or adjust quantities with one click.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            icon={Plus}
            onClick={() => setIsCreateIndentModalOpen(true)}
            className="bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs shadow-sm cursor-pointer whitespace-nowrap"
          >
            Create Restock Indent
          </Button>

          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'cards' ? 'bg-white text-navy-950 shadow-2xs font-bold' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'table' ? 'bg-white text-navy-950 shadow-2xs font-bold' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Restock Suggestions"
          value={recommendations.length}
          subtitle="Based on demand forecast"
          icon={Sparkles}
          badge={{ text: 'AI Suggested', variant: 'info' }}
        />
        <StatCard
          title="Awaiting Approval"
          value={pendingCount}
          subtitle="Requires manager sign-off"
          icon={Clock}
          trend={{ direction: 'neutral', text: 'Needs Review' }}
          badge={{ text: 'Action Needed', variant: 'warning' }}
        />
        <StatCard
          title="Approved &amp; Dispatched"
          value={approvedCount}
          subtitle="Orders released to trucks"
          icon={CheckCircle2}
          trend={{ direction: 'up', text: '100% On-Time Delivery' }}
          badge={{ text: 'Dispatched', variant: 'success' }}
        />
        <StatCard
          title="Total Restock Value"
          value={formatCurrency(totalTransferValue)}
          subtitle="Estimated invoice value"
          icon={DollarSign}
          trend={{ direction: 'up', text: 'Budget Approved' }}
          badge={{ text: 'Proposed', variant: 'info' }}
        />
      </div>

      {/* Safeguard Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-xs text-amber-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Manager Safety Control:</strong> Medicines are never dispatched automatically. Every restock recommendation requires verification and sign-off by a GRD supply chain manager before releasing dispatch instructions to the Guwahati Central Depot or Rani manufacturing plant.
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={filterPriority}
              onChange={(val) => setFilterPriority(val)}
              options={[
                { value: 'All', label: 'All Priorities' },
                { value: 'Critical', label: 'Critical Only' },
                { value: 'High', label: 'High Priority' },
                { value: 'Normal', label: 'Normal' }
              ]}
              icon={AlertTriangle}
            />

            <Select
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
              options={[
                { value: 'All', label: 'All Statuses' },
                { value: 'Pending', label: 'Pending Review' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Deferred', label: 'Deferred' }
              ]}
              icon={CheckCircle2}
            />
          </div>

          <div className="text-2xs text-slate-500">
            Showing <strong>{filteredItems.length}</strong> recommendations
          </div>
        </div>
      </div>

      {/* Views */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((rec) => {
            const isApproved = rec.workflowStatus === 'Approved';
            const isDeferred = rec.workflowStatus.includes('Deferred');
            const isPending = rec.workflowStatus === 'Pending Review';

            return (
              <div 
                key={rec.id} 
                className={`card p-5 space-y-4 transition-all ${
                  rec.urgencyPriority === 'Critical' 
                    ? 'border-rose-200/90 shadow-rose-950/5' 
                    : 'border-slate-200/90'
                }`}
              >
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-2xs font-bold text-slate-500">{rec.skuCode}</span>
                      <Badge variant={rec.urgencyPriority === 'Critical' ? 'danger' : 'warning'}>
                        {rec.urgencyPriority}
                      </Badge>
                    </div>
                    <h3 className="font-sans font-bold text-base text-navy-950 mt-1">
                      {rec.skuName}
                    </h3>
                  </div>

                  <Badge variant={isApproved ? 'success' : isPending ? 'warning' : 'neutral'}>
                    {rec.workflowStatus}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-2xs text-slate-500 font-medium block">Dispatch Origin</span>
                    <strong className="text-slate-800 text-xs">{rec.sourceFacility}</strong>
                  </div>
                  <div>
                    <span className="text-2xs text-slate-500 font-medium block">Destination Depot</span>
                    <strong className="text-navy-950 text-xs">{rec.destinationFacility}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-2xs text-slate-500 block font-medium">On-Hand</span>
                    <span className="font-sans font-bold text-rose-700">{formatNumber(getAvailableStock(rec))}</span>
                    <span className="text-3xs text-slate-400 block">({getCoverDays(rec)}d cover)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-2xs text-slate-500 block font-medium">30D Demand</span>
                    <span className="font-sans font-bold text-slate-800">{formatNumber(getDemand30D(rec))}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-2xs text-slate-500 block font-medium">Lead Time</span>
                    <span className="font-sans font-bold text-slate-800">{getLeadTime(rec)} Days</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-100">
                    <span className="text-2xs text-emerald-800 font-medium block">Reorder Units</span>
                    <span className="font-sans font-bold text-emerald-700">+{formatNumber(getReplenishQty(rec))}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                  {getRationale(rec)}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-sans">
                    Transfer Value: <strong className="text-navy-950">{formatCurrency(getTransferValue(rec))}</strong>
                  </span>

                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleReject(rec.id)}
                      >
                        Defer
                      </Button>
                      <Button
                        variant="primary"
                        size="xs"
                        onClick={() => handleApprove(rec.id)}
                        icon={Check}
                      >
                        Authorize Dispatch
                      </Button>
                    </div>
                  ) : (
                    <span className="text-2xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Table 
          title="Recommended Medicine Restock Indents"
          subtitle="Replenishment proposals calculated to prevent regional stockouts"
          columns={tableColumns}
          data={filteredItems}
          keyExtractor={(row) => row.id}
          exportFilename="grd_replenishment_indents"
          pageSize={10}
          showPagination={true}
        />
      )}

      {/* Edit Quantity Modal */}
      <Modal
        isOpen={!!selectedRep}
        onClose={() => setSelectedRep(null)}
        title="Adjust Replenishment Quantity"
        size="sm"
      >
        {selectedRep && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Modify the proposed transfer volume for <strong>{selectedRep.skuName}</strong> ({selectedRep.destinationFacility}):
            </p>
            <div>
              <label className="block font-semibold text-navy-950 mb-1">Transfer Units *</label>
              <input
                type="number"
                value={editQty}
                onChange={(e) => setEditQty(e.target.value)}
                className="input w-full font-sans text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedRep(null)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => handleApprove(selectedRep.id, editQty)}
              >
                Approve Adjusted Volume
              </Button>
            </div>
          </div>
        )}
      </Modal>
      {/* Create Manual Restock Indent Modal */}
      {isCreateIndentModalOpen && (
        <Modal
          isOpen={isCreateIndentModalOpen}
          onClose={() => setIsCreateIndentModalOpen(false)}
          title="Create Manual Stock Replenishment Indent"
          subtitle="Generate an emergency or buffer restock transfer requisition between Northeast depots"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleCreateManualIndent} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Medicine Formulation (SKU) *
                </label>
                <select
                  value={indentSku}
                  onChange={(e) => setIndentSku(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  {(skus || MOCK_SKUS).map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.code} - {s.brandName ? `${s.name} (${s.brandName})` : s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Urgency Priority *
                </label>
                <select
                  value={indentPriority}
                  onChange={(e) => setIndentPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  <option value="Critical">Critical (Stockout Imminent &lt; 5 Days)</option>
                  <option value="High">High (Surge / Weather Buffer Restock)</option>
                  <option value="Medium">Medium (Routine Safety Stock Top-up)</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Dispatch Origin Depot *
                </label>
                <select
                  value={indentOrigin}
                  onChange={(e) => setIndentOrigin(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  <option value="Guwahati Central Depot (Mother Hub)">Guwahati Central Depot (Mother Hub)</option>
                  <option value="Rani Formulation Plant (Kamrup)">Rani Formulation Plant (Kamrup)</option>
                  <option value="Tezpur Regional Buffer Hub">Tezpur Regional Buffer Hub</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Receiving Destination Depot *
                </label>
                <select
                  value={indentDest}
                  onChange={(e) => setIndentDest(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  <option value="Silchar Regional Depot">Silchar Regional Depot (Barak Valley)</option>
                  <option value="Agartala Central Medical Store">Agartala Central Medical Store (Tripura)</option>
                  <option value="Shillong Civil Depot">Shillong Civil Depot (East Khasi Hills)</option>
                  <option value="Dimapur Transit Hub">Dimapur Transit Hub (Nagaland)</option>
                  <option value="Imphal Regional Depot">Imphal Regional Depot (Manipur)</option>
                  <option value="Aizawl Civil Medical Depot">Aizawl Civil Medical Depot (Mizoram)</option>
                  <option value="Dibrugarh Regional Depot">Dibrugarh Regional Depot (Upper Assam)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Replenishment Quantity (Packs) *
                </label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  required
                  value={indentQty}
                  onChange={(e) => setIndentQty(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-2xs text-slate-400">Presets:</span>
                  {[2500, 5000, 10000, 20000].map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setIndentQty(q)}
                      className={`text-2xs font-semibold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                        Number(indentQty) === q
                          ? 'bg-navy-900 text-white border-navy-900'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                      }`}
                    >
                      {(q / 1000)}k units
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Restock Justification / Clinical Trigger *
                </label>
                <input
                  type="text"
                  required
                  value={indentRationale}
                  onChange={(e) => setIndentRationale(e.target.value)}
                  placeholder="e.g. Surge in viral respiratory cases at regional civil hospital..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {[
                    'Pre-monsoon buffer rebalancing along Barak Valley corridor',
                    'Hospital emergency pediatric respiratory surge indent',
                    'Defense base annual healthcare tender buffer allocation',
                    'Rapid depletion below 7-day safety cover threshold'
                  ].map(reason => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setIndentRationale(reason)}
                      className="text-2xs px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md cursor-pointer transition-colors"
                    >
                      + {reason.slice(0, 40)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateIndentModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-navy-900 hover:bg-navy-950 text-white font-bold shadow-sm cursor-pointer">
                Submit Restock Indent
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
