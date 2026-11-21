import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  X,
  Building2,
  RotateCcw
} from 'lucide-react';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import ExportButton from '../../components/common/ExportButton';
import Select from '../../components/common/Select';
import { useToast } from '../../hooks/useToast';
import { usePersistentState } from '../../hooks/usePersistentState';
import { INTER_DEPOT_TRANSFERS } from '../../data/mockSupplyChainData';
import { MOCK_SKUS } from '../../data/mockSkus';
import { formatNumber } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import { completeInterDepotTransfer, STORAGE_KEYS } from '../../services/grdDataService';

const NORTHEAST_DEPOTS = [
  'Guwahati Central Depot',
  'Silchar Regional Depot',
  'Dibrugarh Regional Depot',
  'Shillong Transit Hub',
  'Agartala Central Medical Store',
  'Dimapur Commercial Depot',
  'Tezpur Regional Hub',
  'Imphal Valley Distribution Hub',
  'Aizawl Hill Depot',
  'Rani cGMP Formulation Plant'
];

const CARRIER_OPTIONS = [
  { name: 'Brahmaputra Fast Freight', vehicle: 'AS-01-M-9022', desc: 'Secure Container Truck' },
  { name: 'Northeast Cold Chain Logistics', vehicle: 'AS-01-GC-4482', desc: 'Refrigerated Reefer (2°C - 8°C)' },
  { name: 'Barak Express Logistics', vehicle: 'TR-01-A-8921', desc: 'Heavy Duty 16-Wheeler' },
  { name: 'Khasi Hills Cargo Direct', vehicle: 'ML-05-B-1120', desc: 'Hill Terrain Express Carrier' }
];

const REASON_PRESETS = [
  'Surge in hospital fever cases in Barak Valley; stockout risk averted',
  'Pre-monsoon buffer rebalancing along NH-8 corridor',
  'Winter cold respiratory surge in East Khasi Hills',
  'Emergency hospital flood buffer restocking (SMCH / GMCH)',
  'Prevent imminent stockout at district civil hospital'
];

export default function SupplyChainTransfers() {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [transfers, setTransfers] = usePersistentState(STORAGE_KEYS.TRANSFERS, INTER_DEPOT_TRANSFERS);
  const [isNewTransferModalOpen, setIsNewTransferModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [destinationFilter, setDestinationFilter] = useState('All');

  const hasActiveFilters = searchQuery.trim() !== '' || statusFilter !== 'All' || destinationFilter !== 'All';

  const resetAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setDestinationFilter('All');
  };

  // Form state
  const [source, setSource] = useState('Guwahati Central Depot');
  const [dest, setDest] = useState('Silchar Regional Depot');
  const [selectedSkuCode, setSelectedSkuCode] = useState('GRD-TAB-001');
  const [qty, setQty] = useState(5000);
  const [selectedCarrierIdx, setSelectedCarrierIdx] = useState(0);
  const [transferStatus, setTransferStatus] = useState('In Transit');
  const [reason, setReason] = useState('Surge in hospital fever cases in Barak Valley; stockout risk averted');

  const filteredTransfers = transfers.filter(t => {
    const matchesSearch = t.transferId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.sourceDepot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destinationDepot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.medicine.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || t.status.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesDest = destinationFilter === 'All' || t.destinationDepot.includes(destinationFilter);

    return matchesSearch && matchesStatus && matchesDest;
  });

  const handleCreateTransfer = (e) => {
    e.preventDefault();
    if (source === dest) {
      toast.error('Origin depot and Destination depot cannot be the same!');
      return;
    }

    const selectedSku = MOCK_SKUS.find(s => s.code === selectedSkuCode) || MOCK_SKUS[0];
    const carrier = CARRIER_OPTIONS[selectedCarrierIdx];

    const newTrf = {
      transferId: `TRF-2026-0${transfers.length + 44}`,
      sourceDepot: source,
      destinationDepot: dest,
      skuCode: selectedSku.code,
      medicine: selectedSku.name,
      quantityUnits: Number(qty),
      reason: reason,
      transporter: carrier.name,
      vehicleNo: carrier.vehicle,
      status: transferStatus,
      departureTime: 'Today Just Now',
      estimatedArrival: transferStatus === 'In Transit' ? 'Tomorrow 6:00 AM' : 'Tomorrow 2:00 PM'
    };

    setTransfers(prev => [newTrf, ...prev]);
    setIsNewTransferModalOpen(false);
    toast.success(`Inter-depot transfer order ${newTrf.transferId} created! Loading docket issued.`);
    setSuccessMsg(`Inter-depot transfer order ${newTrf.transferId} (${selectedSku.brandName} · ${formatNumber(qty)} units) created and assigned to ${carrier.name}!`);
    setTimeout(() => setSuccessMsg(''), 5500);
  };

  const handleCompleteTransfer = (transferId) => {
    const success = completeInterDepotTransfer({ transferId, user: currentUser });
    if (success) {
      setTransfers(prev => prev.map(t => t.transferId === transferId ? {
        ...t,
        status: 'Delivered & Inwarded'
      } : t));
      toast.success(`Transfer ${transferId} confirmed delivered! Destination depot inventory updated.`);
      setSuccessMsg(`Transfer ${transferId} confirmed delivered & inwarded to destination depot.`);
      setTimeout(() => setSuccessMsg(''), 4500);
    }
  };

  const columns = [
    {
      header: 'Transfer ID',
      accessor: 'transferId',
      className: 'whitespace-nowrap min-w-[115px]',
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-bold text-navy-950 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 whitespace-nowrap inline-block">
            {row.transferId}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">{row.departureTime}</p>
        </div>
      )
    },
    {
      header: 'Route (Source → Destination)',
      accessor: 'sourceDepot',
      className: 'min-w-[210px]',
      render: (row) => (
        <div>
          <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
            <span className="text-slate-600 whitespace-nowrap">{row.sourceDepot}</span>
            <span className="text-terracotta-600 font-bold shrink-0">→</span>
            <span className="text-navy-950 font-bold whitespace-nowrap">{row.destinationDepot}</span>
          </p>
          <p className="text-[11px] text-slate-500 italic mt-0.5">{row.reason}</p>
        </div>
      )
    },
    {
      header: 'Medicine & Formulation',
      accessor: 'medicine',
      className: 'min-w-[160px]',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900 text-xs">{row.medicine}</p>
          <p className="text-[11px] text-slate-500 font-mono">{row.skuCode}</p>
        </div>
      )
    },
    {
      header: 'Quantity Transferred',
      accessor: 'quantityUnits',
      align: 'right',
      className: 'whitespace-nowrap min-w-[115px]',
      sortValue: (row) => row.quantityUnits,
      render: (row) => (
        <div className="text-right">
          <span className="text-sm font-bold text-navy-950 font-sans">
            {formatNumber(row.quantityUnits)}
          </span>
          <span className="text-xs text-slate-500 ml-1">units</span>
        </div>
      )
    },
    {
      header: 'Carrier & Vehicle',
      accessor: 'vehicleNo',
      className: 'whitespace-nowrap min-w-[130px]',
      render: (row) => (
        <div>
          <span className="font-semibold text-xs text-navy-900 whitespace-nowrap">{row.vehicleNo}</span>
          <p className="text-[11px] text-slate-500 whitespace-nowrap">{row.transporter}</p>
        </div>
      )
    },
    {
      header: 'Transit Status & Inward',
      accessor: 'status',
      className: 'whitespace-nowrap min-w-[165px]',
      render: (row) => {
        const isTransit = row.status === 'In Transit';

        return (
          <div className="flex items-center justify-between gap-2.5 whitespace-nowrap">
            <div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${
                isTransit ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {isTransit ? <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" /> : <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                {row.status}
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">ETA: {row.estimatedArrival}</p>
            </div>

            {isTransit && (
              <button
                type="button"
                onClick={() => handleCompleteTransfer(row.transferId)}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-2xs cursor-pointer shadow-xs whitespace-nowrap shrink-0"
              >
                Inward
              </button>
            )}
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
              Inter-Depot Stock Reallocation &amp; Transfers
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-50 text-navy-800 border border-navy-200">
              Guwahati Operations Desk
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Reallocate safety stock between Northeast hubs to avert regional stockouts during surges or weather delays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsNewTransferModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-950 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-terracotta-400" />
            New Stock Reallocation
          </button>
          <ExportButton label="Export Transfer Manifest" />
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <Select
            label="Destination Depot"
            value={destinationFilter}
            onChange={(val) => setDestinationFilter(val)}
            options={[
              { value: 'All', label: 'All Destinations' },
              { value: 'Silchar', label: 'Silchar Regional Depot' },
              { value: 'Dibrugarh', label: 'Dibrugarh Regional Depot' },
              { value: 'Shillong', label: 'Shillong Transit Hub' },
              { value: 'Agartala', label: 'Agartala Central Godown' },
              { value: 'Dimapur', label: 'Dimapur Depot' }
            ]}
            icon={Building2}
          />

          <Select
            label="Transfer Status"
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'In Transit', label: 'In Transit (On Road)' },
              { value: 'Delivered', label: 'Delivered (Received)' },
              { value: 'Scheduled', label: 'Scheduled (Staged)' }
            ]}
            icon={Clock}
          />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transfer ID, depot or medicine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 py-1.5 text-xs w-full"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
            Showing {filteredTransfers.length} of {transfers.length}
          </span>
        </div>
      </div>

      {/* Table */}
      <Table
        title="Active Inter-Depot Stock Transfers"
        subtitle="Live movement of safety buffers across Northeast healthcare corridors"
        columns={columns}
        data={filteredTransfers}
        keyExtractor={(row) => row.transferId}
        compact={true}
      />

      {/* New Transfer Modal */}
      {isNewTransferModalOpen && (
        <Modal
          isOpen={isNewTransferModalOpen}
          onClose={() => setIsNewTransferModalOpen(false)}
          title="Create & Authorize Inter-Depot Stock Transfer"
          subtitle="Rebalance safety buffers between Northeast depots to avert hospital stockouts"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleCreateTransfer} className="space-y-4 text-xs">
            {/* Depots: Origin & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Source Depot (Origin):
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="input py-1.5 text-xs w-full bg-white"
                  required
                >
                  {NORTHEAST_DEPOTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Destination Depot (Target):
                </label>
                <select
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                  className="input py-1.5 text-xs w-full bg-white"
                  required
                >
                  {NORTHEAST_DEPOTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Medicine Formulation & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Medicine &amp; SKU:
                </label>
                <select
                  value={selectedSkuCode}
                  onChange={(e) => setSelectedSkuCode(e.target.value)}
                  className="input py-1.5 text-xs w-full bg-white"
                  required
                >
                  {MOCK_SKUS.map((sku) => (
                    <option key={sku.code} value={sku.code}>
                      {sku.brandName} · {sku.name} ({sku.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-semibold">Quantity (Units / Packs):</label>
                  <div className="flex items-center gap-1">
                    {[2500, 5000, 10000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setQty(preset)}
                        className="text-3xs font-semibold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                      >
                        +{preset / 1000}k
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="input py-1.5 text-xs w-full"
                  required
                />
              </div>
            </div>

            {/* Transporter & Dispatch Timing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Assigned Transporter &amp; Vehicle:
                </label>
                <select
                  value={selectedCarrierIdx}
                  onChange={(e) => setSelectedCarrierIdx(Number(e.target.value))}
                  className="input py-1.5 text-xs w-full bg-white"
                >
                  {CARRIER_OPTIONS.map((c, idx) => (
                    <option key={c.name} value={idx}>
                      {c.name} ({c.vehicle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Transfer Dispatch Status:
                </label>
                <select
                  value={transferStatus}
                  onChange={(e) => setTransferStatus(e.target.value)}
                  className="input py-1.5 text-xs w-full bg-white"
                >
                  <option value="In Transit">In Transit (Dispatched Immediately)</option>
                  <option value="Scheduled">Scheduled (Staged for Evening Departure)</option>
                </select>
              </div>
            </div>

            {/* Reallocation Reason */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Reallocation Reason / Clinical Urgency:
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Prevent imminent stockout at district civil hospital..."
                className="input py-1.5 text-xs w-full mb-1.5"
                required
              />
              <div className="flex flex-wrap gap-1">
                {REASON_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReason(p)}
                    className="text-3xs text-left px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 truncate max-w-full cursor-pointer transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Summary Route Preview Card */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-2xs text-slate-500 font-semibold">
                <span>Summary Route Preview</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {transferStatus}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-navy-950">
                <span className="truncate">{source}</span>
                <ArrowLeftRight className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
                <span className="truncate">{dest}</span>
              </div>
              <p className="text-2xs text-slate-600">
                Carrying <strong>{formatNumber(qty)} units</strong> of {MOCK_SKUS.find(s => s.code === selectedSkuCode)?.brandName || 'Formulation'} via <strong>{CARRIER_OPTIONS[selectedCarrierIdx]?.name}</strong> ({CARRIER_OPTIONS[selectedCarrierIdx]?.vehicle})
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsNewTransferModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Authorize &amp; Issue Transfer Docket
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
