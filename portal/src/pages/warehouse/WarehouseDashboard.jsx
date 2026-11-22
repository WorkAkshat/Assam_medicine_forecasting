import React, { useState } from 'react';
import {
  Factory,
  Boxes,
  Truck,
  ShieldCheck,
  QrCode,
  FileText,
  Clock,
  CheckCircle2,
  MapPin,
  Building2,
  X
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { PLANT_PRODUCTION_BATCHES, PLANT_DOCK_DISPATCHES, STORAGE_AISLE_MAP } from '../../data/mockWarehouseData';
import { formatNumber } from '../../utils/formatters';
import { usePersistentState } from '../../hooks/usePersistentState';
import { STORAGE_KEYS } from '../../services/grdDataService';

export default function WarehouseDashboard() {
  const [dispatches, setDispatches] = usePersistentState(STORAGE_KEYS.DOCK_DISPATCHES, PLANT_DOCK_DISPATCHES);
  const [batches] = usePersistentState(STORAGE_KEYS.PLANT_BATCHES, PLANT_PRODUCTION_BATCHES);
  const [selectedGatePass, setSelectedGatePass] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Dynamic calculations
  const totalPlantPacks = batches.reduce((acc, b) => acc + (b.quantityPacks || 0), 0);
  const batchesAwaitingDispatch = batches.filter(b => b.dispatchStatus?.includes('Staging') || b.dispatchStatus?.includes('Ready')).length;
  const quarantineCount = batches.filter(b => b.qcStatus?.includes('Quarantine')).length;
  const activeDocksCount = new Set(dispatches.map(d => d.dockId)).size || 3;

  const handleIssueGatePass = (gatePassId, e) => {
    if (e) e.stopPropagation();
    setDispatches(prev => prev.map(d => 
      d.gatePassId === gatePassId 
        ? { ...d, gateStatus: 'Gate Pass Signed & Cleared', loadingStatus: 'Ready for Main Gate Exit' } 
        : d
    ));
    setSuccessMsg(`Gate pass ${gatePassId} issued! Driver authorized for security barrier clearance.`);
    setSelectedGatePass(null);
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  return (
    <div className="space-y-6">
      
      {/* Executive Operational Plant Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-navy-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                Rani cGMP Formulation Plant
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                Kamrup, Assam
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-white mt-1">
              Welcome back, Pranabesh Bora
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl leading-relaxed">
              Supervising plant finished goods inventory, barcode serialization scanning, and dispatch dock clearance to Guwahati Central Mother Depot and Northeast hospitals.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 border border-emerald-400/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-300 font-medium">Inventory Accuracy</p>
              <p className="text-lg font-bold text-white leading-tight">99.85%</p>
              <p className="text-[10px] text-emerald-300 font-medium">Schedule M cGMP Compliant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards Grid (Plain Language & Clean Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Finished Goods in Plant"
          value={formatNumber(totalPlantPacks)}
          subtitle="Packs ready across active SKUs"
          icon={Boxes}
          trend={{ direction: 'up', text: '+42,000 packs made today' }}
          badge={{ text: 'In Stock', variant: 'success' }}
        />

        <StatCard
          title="Batches Awaiting Dispatch"
          value={`${batchesAwaitingDispatch} Batches`}
          subtitle="Staged for loading at docks"
          icon={Factory}
          trend={{ direction: 'up', text: 'Trucks loading now' }}
          badge={{ text: 'Dock Ready', variant: 'info' }}
        />

        <StatCard
          title="Loading Docks Active"
          value={`${activeDocksCount} Docks Active`}
          subtitle="Loading bays in operation"
          icon={Truck}
          trend={{ direction: 'up', text: 'All fork-lifts active' }}
          badge={{ text: 'Operational', variant: 'success' }}
        />

        <StatCard
          title="QC Quarantine Holding"
          value={`${quarantineCount} ${quarantineCount === 1 ? 'Batch' : 'Batches'}`}
          subtitle="Awaiting laboratory sign-off"
          icon={Clock}
          trend={{ direction: quarantineCount === 0 ? 'up' : 'neutral', text: quarantineCount === 0 ? 'All cleared' : 'Release pending' }}
          badge={{ text: quarantineCount === 0 ? 'Cleared' : 'Testing', variant: quarantineCount === 0 ? 'success' : 'warning' }}
        />
      </div>

      {/* Loading Docks & Truck Dispatch Clearance Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-sans text-navy-950">
                Plant Loading Bays &amp; Gate Pass Clearance
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-navy-50 text-navy-800 border border-navy-200">
                Plant Dock Operations
              </span>
            </div>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Live truck loading status at Rani Plant bays. Authorize digital gate pass for security checkpoint clearance.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              3 Trucks Scheduled Today
            </span>
          </div>
        </div>

        {/* Dock Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {dispatches.map((dock) => {
            const isCleared = dock.gateStatus.includes('Cleared') || dock.gateStatus.includes('Signed');

            return (
              <div 
                key={dock.gatePassId}
                onClick={() => setSelectedGatePass(dock)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                  isCleared 
                    ? 'bg-emerald-50/30 border-emerald-200 hover:border-emerald-300' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-900 text-white">
                    {dock.dockId}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {dock.gatePassId}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{dock.destination}</h3>
                  <p className="text-xs text-slate-500">{dock.distanceKm} km transit via NH-27</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Truck Assigned:</span>
                    <span className="font-semibold text-slate-800">{dock.vehicleNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Carrier:</span>
                    <span className="text-slate-700">{dock.transporter}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Driver &amp; Mobile:</span>
                    <span className="text-slate-800">{dock.driverName} ({dock.driverPhone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Consignment:</span>
                    <span className="font-semibold text-navy-950">{formatNumber(dock.totalPacks)} packs ({dock.totalCartons} cartons)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400">Departure</p>
                    <p className="text-xs font-bold text-slate-800">{dock.departureTime}</p>
                  </div>

                  {!isCleared ? (
                    <button
                      type="button"
                      onClick={(e) => handleIssueGatePass(dock.gatePassId, e)}
                      className="px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-950 text-white text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-terracotta-400" />
                      Sign Gate Pass
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Pass Issued
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Production Batches Staged in Plant */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-sans text-navy-950">
              Plant Finished Medicine Batches
            </h2>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Formulation batches stored across Rani Plant aisles. Serialized barcodes verified under cGMP.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing {PLANT_PRODUCTION_BATCHES.length} Batches
          </span>
        </div>

        <div className="space-y-3">
          {PLANT_PRODUCTION_BATCHES.map((batch) => {
            const isQuarantined = batch.qcStatus.includes('Quarantine') || batch.qcStatus.includes('Microbiology');

            return (
              <div 
                key={batch.batchNo}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-navy-950 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {batch.batchNo}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {batch.medicine}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      ({batch.skuCode})
                    </span>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isQuarantined 
                        ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {batch.qcStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-navy-950 font-sans">
                      {formatNumber(batch.availableUnits)}{' '}
                      <span className="text-[11px] font-normal text-slate-500">Packs Available</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-y-1 text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-terracotta-500 shrink-0" />
                      <strong>{batch.aisleLocation}</strong> ({batch.storageZone})
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <QrCode className="w-3 h-3 text-slate-400" />
                      Barcode: {batch.barcode}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span>Mfg: {batch.mfgDate}</span>
                    <span>&bull;</span>
                    <span>Exp: {batch.expiryDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Storage Aisle Capacity Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-sans text-navy-950">
              Rani Warehouse Storage Aisle &amp; Temperature Zones
            </h2>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Floor capacity, humidity, and temperature conditions across plant storage sectors.
            </p>
          </div>
          <Building2 className="w-5 h-5 text-slate-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STORAGE_AISLE_MAP.map((aisle, idx) => {
            const occupancyPct = Math.round((aisle.occupiedSlots / aisle.totalPalletSlots) * 100);

            return (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-navy-950 font-sans">{aisle.aisleCode}</span>
                  <span className="text-xs font-bold text-slate-700">{occupancyPct}% Full</span>
                </div>

                <p className="text-xs font-semibold text-slate-800 line-clamp-1">{aisle.name}</p>

                {/* Progress */}
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-navy-800 rounded-full"
                    style={{ width: `${occupancyPct}%` }}
                  />
                </div>

                <div className="space-y-1 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  <p>Slots: <strong>{aisle.occupiedSlots} / {aisle.totalPalletSlots} Pallets</strong></p>
                  <p>Temp: <strong className="text-slate-700">{aisle.tempCondition}</strong></p>
                  <p>Safety: <strong className="text-emerald-700">{aisle.fireSafetyStatus}</strong></p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gate Pass Print / Inspection Modal */}
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
                <span className="text-slate-500">Driver Contact:</span>
                <span className="font-semibold text-slate-800">{selectedGatePass.driverName} ({selectedGatePass.driverPhone})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Consignment:</span>
                <span className="font-bold text-emerald-700">{formatNumber(selectedGatePass.totalPacks)} Packs ({selectedGatePass.totalCartons} Cartons)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Pre-Loading Quality Check:</span>
                <span className="font-semibold text-emerald-800">{selectedGatePass.temperatureCheck}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Scheduled Departure:</span>
                <span className="font-bold text-slate-900">{selectedGatePass.departureTime}</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Authorized by Pranabesh Bora (Warehouse Controller). Plant Security is authorized to lift boom barrier upon barcode scan of this gate pass.
              </span>
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
                Sign &amp; Release Gate Pass
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
