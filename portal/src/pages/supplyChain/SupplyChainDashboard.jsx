import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Truck,
  ThermometerSnowflake,
  Building2,
  Factory,
  X
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import {
  PENDING_REPLENISHMENT_APPROVALS,
  DEPOT_CAPACITY_SUMMARY,
  RANI_PLANT_INWARD_BATCHES,
  INTER_DEPOT_TRANSFERS
} from '../../data/mockSupplyChainData';
import { PLANT_PRODUCTION_BATCHES } from '../../data/mockWarehouseData';
import { formatNumber } from '../../utils/formatters';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { approveReplenishmentRecommendation, logActivity, STORAGE_KEYS } from '../../services/grdDataService';

export default function SupplyChainDashboard() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [approvals, setApprovals] = usePersistentState(STORAGE_KEYS.SCM_APPROVALS, PENDING_REPLENISHMENT_APPROVALS);
  const [transfers] = usePersistentState(STORAGE_KEYS.TRANSFERS, INTER_DEPOT_TRANSFERS);
  const [batches] = usePersistentState(STORAGE_KEYS.PLANT_BATCHES, PLANT_PRODUCTION_BATCHES);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [authNote, setAuthNote] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const pendingCount = approvals.filter(a => a.status === 'Pending Approval').length;
  const criticalCount = approvals.filter(a => a.status === 'Pending Approval' && a.urgency === 'Critical').length;
  const activeTransfersCount = transfers.filter(t => t.status === 'In Transit').length;
  const inwardBatchesCount = batches.filter(b => b.inwardStatus?.includes('Staging') || b.inwardStatus?.includes('Rani')).length;

  const handleApprove = (approvalId, e) => {
    if (e) e.stopPropagation();
    approveReplenishmentRecommendation({ recommendationId: approvalId, user: currentUser });
    setActionSuccessMessage(`Order ${approvalId} approved! Truck dispatch order generated for warehouse dock.`);
    toast.success(`Order ${approvalId} approved! Truck dispatch order generated for warehouse dock.`);
    setSelectedApproval(null);
  };

  const handleReject = (approvalId, e) => {
    if (e) e.stopPropagation();
    setApprovals(prev => prev.map(a => a.id === approvalId ? { ...a, status: 'Held for Review', heldAt: 'Just Now' } : a));
    logActivity({
      type: 'TRANSFER',
      action: `Replenishment Order Held (${approvalId})`,
      details: `Order ${approvalId} held for review by Dr. Abhijit Sarma.`,
      user: currentUser
    });
    setActionSuccessMessage(`Order ${approvalId} placed on hold.`);
    toast.warning(`Order ${approvalId} placed on hold.`);
    setSelectedApproval(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Executive Operational Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-navy-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                Guwahati Central Depot (Hub 01)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                Operations Live
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-white mt-1">
              Welcome back, Dr. Abhijit Sarma
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl leading-relaxed">
              Monitoring medicine stock buffers, approving automated restocking for 12 Northeast hubs, and coordinating inward batches from Rani cGMP Formulation Plant.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 border border-emerald-400/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-300 font-medium">Depot Fill Rate</p>
              <p className="text-lg font-bold text-white leading-tight">94.2%</p>
              <p className="text-[10px] text-emerald-300 font-medium">+1.8% vs last week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage('')} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards Grid (Simple Language & Clean Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Pending Restock Orders"
          value={`${pendingCount} Orders`}
          subtitle={`${criticalCount} need urgent dispatch`}
          icon={Clock}
          trend={{ direction: 'up', text: `${criticalCount} Urgent orders` }}
          badge={{ text: 'Action Needed', variant: 'danger' }}
        />

        <StatCard
          title="Active Medicine Shipments"
          value={`${activeTransfersCount} Trucks`}
          subtitle="All GPS pings on time"
          icon={Truck}
          trend={{ direction: 'up', text: `${activeTransfersCount} on road now` }}
          badge={{ text: 'On Route', variant: 'info' }}
        />

        <StatCard
          title="Rani Plant Inward Batches"
          value={`${inwardBatchesCount} ${inwardBatchesCount === 1 ? 'Batch' : 'Batches'}`}
          subtitle="Finished lots awaiting inward"
          icon={Factory}
          trend={{ direction: 'up', text: '100% Passed QC' }}
          badge={{ text: 'cGMP Verified', variant: 'success' }}
        />

        <StatCard
          title="Cold Chain Temperature"
          value="99.1%"
          subtitle="All refrigerated trucks 2-8°C"
          icon={ThermometerSnowflake}
          trend={{ direction: 'up', text: 'Safe temperature' }}
          badge={{ text: 'Compliant', variant: 'success' }}
        />
      </div>

      {/* Restock Approvals Clearance Desk */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-sans text-navy-950">
                Automated Restock Approval Desk
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                {pendingCount} Pending
              </span>
            </div>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Review AI-recommended restock quantities for Northeast regional depots and authorize immediate truck dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Source:</span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
              Guwahati Central Depot
            </span>
          </div>
        </div>

        {/* Approval Cards List */}
        <div className="space-y-3">
          {approvals.map((req) => {
            const isApproved = req.status === 'Approved for Dispatch';
            const isHeld = req.status === 'Held for Review';

            return (
              <div 
                key={req.id}
                onClick={() => setSelectedApproval(req)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isApproved 
                    ? 'bg-emerald-50/40 border-emerald-200/80 hover:bg-emerald-50/70' 
                    : isHeld
                    ? 'bg-amber-50/40 border-amber-200/80 hover:bg-amber-50/70'
                    : req.urgency === 'Critical'
                    ? 'bg-white border-rose-200 hover:border-rose-300 hover:shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-navy-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {req.id}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {req.destinationHub}
                      </span>
                      <span className="text-xs text-slate-500">
                        ({req.state})
                      </span>
                      
                      {req.urgency === 'Critical' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          Critical Stockout Risk ({req.daysOfCoverRemaining} Days Left)
                        </span>
                      )}
                      {req.urgency === 'High' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          High Demand ({req.daysOfCoverRemaining} Days Left)
                        </span>
                      )}
                      {req.urgency === 'Medium' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          Routine Restock ({req.daysOfCoverRemaining} Days Left)
                        </span>
                      )}

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isApproved 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                          : isHeld
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <div>
                        <span className="font-semibold text-slate-900">{req.medicineName}</span>
                        <span className="text-slate-400 ml-1">({req.skuCode})</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Current Depot Stock:</span>{' '}
                        <span className="font-semibold text-slate-800">{formatNumber(req.currentStockUnits)} units</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Daily Demand:</span>{' '}
                        <span className="font-semibold text-slate-800">{formatNumber(req.dailyRunRate)} units/day</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Assigned Truck:</span>{' '}
                        <span className="font-semibold text-navy-900">{req.truckAssigned}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 font-light italic">
                      Reason: {req.urgencyReason}
                    </p>
                  </div>

                  {/* Recommended Quantity & Action Buttons */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-right">
                      <p className="text-[11px] text-slate-400 font-medium">Recommended Restock</p>
                      <p className="text-base sm:text-lg font-bold text-navy-950 font-sans">
                        {formatNumber(req.recommendedQty)}{' '}
                        <span className="text-xs font-normal text-slate-500">units</span>
                      </p>
                    </div>

                    {!isApproved && !isHeld ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleReject(req.id, e)}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-all cursor-pointer"
                        >
                          Hold
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleApprove(req.id, e)}
                          className="px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-950 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Approve
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {isApproved ? 'Dispatched' : 'On Hold'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Depot Capacity & Rani Inward Batches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Depot Capacity Summary */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm sm:text-base font-bold font-sans text-navy-950">
                Northeast Depot Storage &amp; Space
              </h3>
              <p className="text-xs text-slate-500 font-light">
                Pallet space and cold room capacity across primary and secondary hubs.
              </p>
            </div>
            <Building2 className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-3">
            {DEPOT_CAPACITY_SUMMARY.map((hub, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{hub.hubName}</p>
                    <p className="text-[11px] text-slate-500">{hub.state} &bull; {hub.type}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      hub.status === 'High Load' 
                        ? 'bg-amber-100 text-amber-800' 
                        : hub.status === 'Near Full'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {hub.status}
                    </span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{hub.utilizationPct}% Full</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      hub.utilizationPct > 88 ? 'bg-rose-500' : hub.utilizationPct > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${hub.utilizationPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Pallets: {hub.usedPallets} / {hub.totalPallets} used</span>
                  <span>Cold Room: {hub.coldStorageUsed} / {hub.coldStorageUnits} units</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rani cGMP Formulation Plant Inward Pipeline */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm sm:text-base font-bold font-sans text-navy-950">
                Rani Formulation Plant Inward Batches
              </h3>
              <p className="text-xs text-slate-500 font-light">
                Finished medicine production batches from Rani cGMP Plant into Guwahati Central Depot.
              </p>
            </div>
            <Factory className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-3">
            {RANI_PLANT_INWARD_BATCHES.map((batch, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-navy-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {batch.batchNo}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {batch.qcStatus}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">{batch.medicine}</p>
                  <p className="text-[11px] text-slate-500">{batch.skuCode} &bull; {formatNumber(batch.quantityPacks)} Packs</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  <span>Status: <strong className="text-navy-900">{batch.inwardStatus}</strong></span>
                  <span>Inspector: {batch.inspector}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Detail & Decision Modal */}
      {selectedApproval && (
        <Modal
          isOpen={!!selectedApproval}
          onClose={() => setSelectedApproval(null)}
          title={`Restock Authorization: ${selectedApproval.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl space-y-2 border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Destination Hub:</span>
                <span className="font-bold text-slate-900">{selectedApproval.destinationHub} ({selectedApproval.state})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Medicine &amp; Formulation:</span>
                <span className="font-bold text-slate-900">{selectedApproval.medicineName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Recommended Restock:</span>
                <span className="font-bold text-emerald-700 text-sm">{formatNumber(selectedApproval.recommendedQty)} units</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Stock Left at Hub:</span>
                <span className="font-bold text-rose-700">{selectedApproval.daysOfCoverRemaining} Days ({formatNumber(selectedApproval.currentStockUnits)} units)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Assigned Transporter &amp; Truck:</span>
                <span className="font-bold text-navy-900">{selectedApproval.transporter} &bull; {selectedApproval.truckAssigned}</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Authorization Note / Special Instructions:
              </label>
              <textarea
                value={authNote}
                onChange={(e) => setAuthNote(e.target.value)}
                placeholder="e.g. Ensure cold chain monitoring active throughout Meghalaya hill route..."
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
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => handleReject(selectedApproval.id, e)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold cursor-pointer"
              >
                Put on Hold
              </button>
              <button
                type="button"
                onClick={(e) => handleApprove(selectedApproval.id, e)}
                className="px-4 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-950 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Authorize &amp; Dispatch
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
