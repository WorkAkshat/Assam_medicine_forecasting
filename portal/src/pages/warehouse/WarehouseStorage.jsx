import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { STORAGE_AISLE_MAP, PLANT_PRODUCTION_BATCHES } from '../../data/mockWarehouseData';
import { formatNumber } from '../../utils/formatters';

export default function WarehouseStorage() {
  const [selectedAisle, setSelectedAisle] = useState(STORAGE_AISLE_MAP[0]);

  // Find batches stored in this aisle
  const aisleBatches = PLANT_PRODUCTION_BATCHES.filter(b => 
    b.aisleLocation.toLowerCase().startsWith(selectedAisle.aisleCode.toLowerCase().replace(' ', '')) ||
    b.aisleLocation.toLowerCase().includes(selectedAisle.aisleCode.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-sans text-navy-950">
              Plant Storage Aisle &amp; Bay Layout
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-50 text-navy-800 border border-navy-200">
              Rani cGMP Finished Goods Vault
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Physical rack layout, temperature zones, and pallet allocations across plant sectors.
          </p>
        </div>
      </div>

      {/* Aisle Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STORAGE_AISLE_MAP.map((aisle) => {
          const isSelected = selectedAisle.aisleCode === aisle.aisleCode;
          const occupancyPct = Math.round((aisle.occupiedSlots / aisle.totalPalletSlots) * 100);

          return (
            <div
              key={aisle.aisleCode}
              onClick={() => setSelectedAisle(aisle)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                isSelected 
                  ? 'bg-navy-900 text-white shadow-md border-navy-950 ring-2 ring-navy-900/20' 
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold font-sans ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-navy-950'
                }`}>
                  {aisle.aisleCode}
                </span>
                <span className={`text-xs font-bold ${isSelected ? 'text-emerald-300' : 'text-slate-600'}`}>
                  {occupancyPct}% Full
                </span>
              </div>

              <div>
                <h3 className={`text-sm font-bold line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {aisle.name}
                </h3>
                <p className={`text-xs mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {aisle.occupiedSlots} of {aisle.totalPalletSlots} Pallet Slots
                </p>
              </div>

              {/* Progress */}
              <div className={`w-full rounded-full h-1.5 overflow-hidden ${isSelected ? 'bg-white/20' : 'bg-slate-100'}`}>
                <div 
                  className={`h-full rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-navy-800'}`}
                  style={{ width: `${occupancyPct}%` }}
                />
              </div>

              <p className={`text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                {aisle.tempCondition}
              </p>
            </div>
          );
        })}
      </div>

      {/* Selected Aisle Detail & Pallet Manifest */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-sans text-navy-950">
              {selectedAisle.aisleCode} &mdash; Pallet Allocation &amp; Storage Conditions
            </h2>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              {selectedAisle.name} &bull; Temperature: <strong>{selectedAisle.tempCondition}</strong> &bull; Humidity: <strong>{selectedAisle.relativeHumidity}</strong>
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {selectedAisle.fireSafetyStatus}
          </span>
        </div>

        {/* Batches in this Aisle */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
            Batches Stored in this Sector
          </h3>

          {aisleBatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aisleBatches.map((b) => (
                <div key={b.batchNo} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-navy-950 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {b.batchNo}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {b.qcStatus}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-900">{b.medicine}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{b.skuCode} &bull; {b.formulation}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 text-slate-600">
                    <span>Available: <strong>{formatNumber(b.availableUnits)} Packs</strong></span>
                    <span>Location: <strong>{b.aisleLocation}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl">
              No active batches currently allocated to this sector.
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
