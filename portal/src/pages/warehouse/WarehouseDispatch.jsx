import React, { useState } from 'react';
import {
  Truck,
  FileText,
  CheckCircle2,
  MapPin,
  Clock,
  Search,
  Phone,
  X,
  Filter,
  RotateCcw,
  Plus
} from 'lucide-react';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import ExportButton from '../../components/common/ExportButton';
import Select from '../../components/common/Select';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { PLANT_DOCK_DISPATCHES } from '../../data/mockWarehouseData';
import { MOCK_ORDERS } from '../../data/mockOrders';
import { formatNumber } from '../../utils/formatters';
import { dispatchOrder, logActivity, STORAGE_KEYS } from '../../services/grdDataService';

export default function WarehouseDispatch() {
  const [isCreateGatePassOpen, setIsCreateGatePassOpen] = useState(false);
  const [formGatePassId, setFormGatePassId] = useState(`GP-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [formOrderPo, setFormOrderPo] = useState('GRD-PO-GHY-1084');
  const [formDest, setFormDest] = useState('Guwahati Central Depot (Mother Hub)');
  const [formCarrier, setFormCarrier] = useState('Brahmaputra Fast Freight');
  const [formVehicle, setFormVehicle] = useState('AS-01-GC-4482');
  const [formDriver, setFormDriver] = useState('Dilip Kalita');
  const [formPhone, setFormPhone] = useState('+91 94350 44910');
  const [formPackages, setFormPackages] = useState('320 Cartons (15,000 Packs)');
  const [formDockBay, setFormDockBay] = useState('Dock Bay 01 - Finished Goods');

  const handleCreateGatePass = (e) => {
    e.preventDefault();
    const newPass = {
      gatePassId: formGatePassId.trim() || `GP-2026-${Math.floor(100 + Math.random() * 900)}`,
      orderId: formOrderPo,
      destination: formDest,
      transporter: formCarrier,
      vehicleNo: formVehicle.trim().toUpperCase(),
      driverName: formDriver,
      driverPhone: formPhone,
      packages: formPackages,
      dockBay: formDockBay,
      loadingStatus: 'Loading Completed - Staged at Bay',
      gateStatus: 'Gate Pass Signed & Cleared',
      verifiedBy: currentUser?.name || 'Pranabesh Bora',
      dispatchTime: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    };

    setDispatches(prev => [newPass, ...prev]);
    setIsCreateGatePassOpen(false);
    setSuccessMsg(`Gate Pass ${newPass.gatePassId} issued for vehicle ${newPass.vehicleNo}! Ready for gate security exit.`);
    toast.success(`Gate Pass ${newPass.gatePassId} issued for vehicle ${newPass.vehicleNo}! Ready for gate security exit.`);
    setFormGatePassId(`GP-2026-${Math.floor(100 + Math.random() * 900)}`);
  };
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [dispatches, setDispatches] = usePersistentState(STORAGE_KEYS.DOCK_DISPATCHES, PLANT_DOCK_DISPATCHES);
  const [orders] = usePersistentState(STORAGE_KEYS.ORDERS, MOCK_ORDERS);
  const [selectedGatePass, setSelectedGatePass] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('All');
  const [dockStatusFilter, setDockStatusFilter] = useState('All');
  const [successMsg, setSuccessMsg] = useState('');

  const hasActiveFilters = searchQuery.trim() !== '' ||
    destinationFilter !== 'All' ||
    dockStatusFilter !== 'All';

  const resetAllFilters = () => {
    setSearchQuery('');
    setDestinationFilter('All');
    setDockStatusFilter('All');
  };

  // Orders approved and ready for warehouse dispatch
  const readyOrders = orders.filter(o => o.status === 'Approved');

  const filteredDispatches = dispatches.filter(d => {
    const matchSearch = d.gatePassId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.driverName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDest = destinationFilter === 'All' || d.destination.includes(destinationFilter);
    const matchStatus = dockStatusFilter === 'All' ||
      (dockStatusFilter === 'Cleared' && d.gateStatus.includes('Cleared')) ||
      (dockStatusFilter === 'Loading' && d.loadingStatus.includes('Loading')) ||
      (dockStatusFilter === 'Staged' && d.loadingStatus.includes('Staged'));
    return matchSearch && matchDest && matchStatus;
  });

  const handleIssueGatePass = (gatePassId, e) => {
    if (e) e.stopPropagation();
    setDispatches(prev => prev.map(d =>
      d.gatePassId === gatePassId
        ? { ...d, gateStatus: 'Gate Pass Signed & Cleared', loadingStatus: 'Ready for Main Gate Exit' }
        : d
    ));
    logActivity({
      type: 'ORDER',
      action: `Gate Pass Signed (${gatePassId})`,
      details: `Gate pass signed by ${currentUser?.name || 'Warehouse Controller'}. Security exit barrier unlocked.`,
      user: currentUser
    });
    toast.success(`Gate pass ${gatePassId} released! Driver authorized for security barrier clearance.`);
    setSelectedGatePass(null);
  };

  const handleDispatchApprovedOrder = (order) => {
    const success = dispatchOrder({
      orderId: order.id,
      vehicleNo: 'AS-01-LC-4492',
      transporter: 'Assam Bengal Roadways (Express Fleet)',
      user: currentUser
    });
    if (success) {
      toast.success(`Order ${order.orderNumber} successfully dispatched via dock bay! Inventory deducted from depot.`);
    }
  };

  const columns = [
    {
      header: 'Gate Pass ID & Dock',
      accessor: 'gatePassId',
      className: 'whitespace-nowrap min-w-[140px]',
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-bold text-navy-950 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 whitespace-nowrap inline-block">
            {row.gatePassId}
          </span>
          <p className="text-xs font-bold text-navy-900 mt-1 whitespace-nowrap">{row.dockId}</p>
        </div>
      )
    },
    {
      header: 'Destination & Corridor',
      accessor: 'destination',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900 text-xs">{row.destination}</p>
          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-terracotta-500 shrink-0" />
            {row.distanceKm} km transit via NH-27
          </p>
        </div>
      )
    },
    {
      header: 'Vehicle & Transporter',
      accessor: 'vehicleNo',
      render: (row) => (
        <div>
          <span className="font-semibold text-xs text-navy-900">{row.vehicleNo}</span>
          <p className="text-[11px] text-slate-500">{row.transporter}</p>
        </div>
      )
    },
    {
      header: 'Driver & Contact',
      accessor: 'driverName',
      render: (row) => (
        <div>
          <p className="font-semibold text-xs text-slate-800">{row.driverName}</p>
          <a href={`tel:${row.driverPhone}`} className="text-[11px] text-slate-500 hover:text-navy-900 flex items-center gap-1">
            <Phone className="w-3 h-3 text-slate-400" />
            {row.driverPhone}
          </a>
        </div>
      )
    },
    {
      header: 'Consignment Size',
      accessor: 'totalPacks',
      render: (row) => (
        <div>
          <span className="text-sm font-bold text-navy-950 font-sans">
            {formatNumber(row.totalPacks)}
          </span>
          <span className="text-xs text-slate-500 ml-1">Packs</span>
          <p className="text-[10px] text-slate-400">{row.totalCartons} Master Cartons</p>
        </div>
      )
    },
    {
      header: 'Gate Clearance Status',
      accessor: 'gateStatus',
      render: (row) => {
        const isCleared = row.gateStatus.includes('Cleared') || row.gateStatus.includes('Signed');

        return (
          <div>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${isCleared ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
              {isCleared ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-amber-600" />}
              {row.gateStatus}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">{row.departureTime}</p>
          </div>
        );
      }
    },
    {
      header: 'Action',
      accessor: 'gatePassId',
      render: (row) => {
        const isCleared = row.gateStatus.includes('Cleared') || row.gateStatus.includes('Signed');

        if (isCleared) {
          return (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Passed
            </span>
          );
        }

        return (
          <button
            type="button"
            onClick={(e) => handleIssueGatePass(row.gatePassId, e)}
            className="px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-navy-950 text-white text-xs font-semibold cursor-pointer shadow-xs flex items-center gap-1"
          >
            <FileText className="w-3 h-3 text-terracotta-400" />
            Sign Pass
          </button>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-sans text-navy-950">
              Plant Loading Bays &amp; Truck Clearance Desk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-50 text-navy-800 border border-navy-200">
              Rani Dispatch Office
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Loading dock assignments, vehicle pre-loading quality inspections, and digital gate pass authorization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            icon={Plus}
            onClick={() => setIsCreateGatePassOpen(true)}
            className="bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs shadow-sm cursor-pointer whitespace-nowrap"
          >
            Issue Dispatch Gate Pass
          </Button>
          <ExportButton label="Export Gate Log" data={dispatches} filename="dock_dispatch_gate_log" />
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <Select
            value={destinationFilter}
            onChange={(val) => setDestinationFilter(val)}
            options={[
              { value: 'All', label: 'All Destinations' },
              { value: 'Guwahati Central Depot', label: 'Guwahati Central Depot' },
              { value: 'Silchar Regional Depot', label: 'Silchar Regional Depot' },
              { value: 'Guwahati Mother Hub', label: 'Guwahati Mother Hub' }
            ]}
            icon={MapPin}
          />

          <Select
            value={dockStatusFilter}
            onChange={(val) => setDockStatusFilter(val)}
            options={[
              { value: 'All', label: 'All Dock Statuses' },
              { value: 'Cleared', label: 'Gate Pass Cleared' },
              { value: 'Loading', label: 'Forklift Loading' },
              { value: 'Staged', label: 'Staged on Pallets' }
            ]}
            icon={Filter}
          />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search gate pass, vehicle, or driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9 py-1.5 text-xs w-full"
          />
        </div>
      </div>

      {/* Approved Orders Queued for Dock Loading */}
      {readyOrders.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Truck className="w-5 h-5 text-amber-600" />
              <h3 className="font-sans font-bold text-sm text-navy-950">
                Approved Orders Awaiting Loading &amp; Dispatch ({readyOrders.length})
              </h3>
            </div>
            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Pick &amp; Pack Stage
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {readyOrders.map(order => (
              <div key={order.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-navy-950">{order.orderNumber}</span>
                    <span className="text-2xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Approved
                    </span>
                  </div>
                  <p className="font-semibold text-xs text-slate-800 mt-1">{order.customerName}</p>
                  <p className="text-2xs text-slate-500">{order.customerLocation} · {formatNumber(order.totalQuantity)} units</p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-navy-900">₹{order.totalAmountINR?.toLocaleString('en-IN')}</span>
                  <Button
                    size="xs"
                    onClick={() => handleDispatchApprovedOrder(order)}
                    className="bg-navy-900 hover:bg-navy-950 text-white font-bold text-2xs"
                  >
                    Load &amp; Dispatch Truck
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <Table
        title="Dock Dispatch & Gate Pass Register"
        subtitle="Click any row to inspect complete vehicle manifest and driver sign-off"
        columns={columns}
        data={filteredDispatches}
        keyExtractor={(row) => row.gatePassId}
        onRowClick={(row) => setSelectedGatePass(row)}
      />

      {/* Gate Pass Modal */}
      {selectedGatePass && (
        <Modal
          isOpen={!!selectedGatePass}
          onClose={() => setSelectedGatePass(null)}
          title={`Digital Gate Pass: ${selectedGatePass.gatePassId}`}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Destination:</span>
                <span className="font-bold text-slate-900">{selectedGatePass.destination}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Carrier / Truck:</span>
                <span className="font-bold text-navy-900">{selectedGatePass.transporter} &bull; {selectedGatePass.vehicleNo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Driver &amp; Mobile:</span>
                <span className="font-semibold text-slate-800">{selectedGatePass.driverName} ({selectedGatePass.driverPhone})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Consignment:</span>
                <span className="font-bold text-emerald-700">{formatNumber(selectedGatePass.totalPacks)} Packs ({selectedGatePass.totalCartons} Cartons)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Inspection Note:</span>
                <span className="font-semibold text-emerald-800">{selectedGatePass.temperatureCheck}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedGatePass(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={(e) => handleIssueGatePass(selectedGatePass.gatePassId, e)}
                className="px-4 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-950 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Authorize Gate Pass
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create New Dispatch Gate Pass Modal */}
      {isCreateGatePassOpen && (
        <Modal
          isOpen={isCreateGatePassOpen}
          onClose={() => setIsCreateGatePassOpen(false)}
          title="Issue Manufacturing Dock Gate Pass"
          subtitle="Generate Schedule M compliant transport gate authorization for commercial or inter-depot consignment"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleCreateGatePass} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Gate Pass Serial ID *
                </label>
                <input
                  type="text"
                  required
                  value={formGatePassId}
                  onChange={(e) => setFormGatePassId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Order PO Reference *
                </label>
                <input
                  type="text"
                  required
                  value={formOrderPo}
                  onChange={(e) => setFormOrderPo(e.target.value)}
                  placeholder="e.g. GRD-PO-GHY-1084"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Destination Warehouse / Depot *
                </label>
                <input
                  type="text"
                  required
                  value={formDest}
                  onChange={(e) => setFormDest(e.target.value)}
                  placeholder="e.g. Guwahati Central Depot (Mother Hub)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Loading Dock Bay *
                </label>
                <select
                  value={formDockBay}
                  onChange={(e) => setFormDockBay(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  <option value="Dock Bay 01 - Finished Goods">Dock Bay 01 - Finished Goods</option>
                  <option value="Dock Bay 02 - Inter-Depot Fleet">Dock Bay 02 - Inter-Depot Fleet</option>
                  <option value="Dock Bay 03 - Sanitizer / Flammable">Dock Bay 03 - Sanitizer / Flammable</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Transporter / Fleet Agency *
                </label>
                <input
                  type="text"
                  required
                  value={formCarrier}
                  onChange={(e) => setFormCarrier(e.target.value)}
                  placeholder="e.g. Brahmaputra Fast Freight"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Vehicle Registration Number *
                </label>
                <input
                  type="text"
                  required
                  value={formVehicle}
                  onChange={(e) => setFormVehicle(e.target.value)}
                  placeholder="e.g. AS-01-GC-4482"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Assigned Driver Name *
                </label>
                <input
                  type="text"
                  required
                  value={formDriver}
                  onChange={(e) => setFormDriver(e.target.value)}
                  placeholder="e.g. Dilip Kalita"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Driver Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="e.g. +91 94350 44910"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Packages &amp; Units Consigned *
              </label>
              <input
                type="text"
                required
                value={formPackages}
                onChange={(e) => setFormPackages(e.target.value)}
                placeholder="e.g. 320 Cartons (15,000 Packs)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateGatePassOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-navy-900 hover:bg-navy-950 text-white font-bold">
                Authorize &amp; Print Gate Pass
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}