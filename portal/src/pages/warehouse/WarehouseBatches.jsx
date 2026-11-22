import React, { useState } from 'react';
import {
  ShieldCheck,
  QrCode,
  Search,
  Filter,
  MapPin,
  Printer,
  CheckCircle2,
  Plus,
  RotateCcw,
  Warehouse,
  Layers
} from 'lucide-react';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import ExportButton from '../../components/common/ExportButton';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { PLANT_PRODUCTION_BATCHES } from '../../data/mockWarehouseData';
import { MOCK_SKUS } from '../../data/mockSkus';
import { formatNumber } from '../../utils/formatters';
import { createPlantBatch, releaseBatchQA, STORAGE_KEYS } from '../../services/grdDataService';

export default function WarehouseBatches() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [batches] = usePersistentState(STORAGE_KEYS.PLANT_BATCHES, PLANT_PRODUCTION_BATCHES);
  const [skus] = usePersistentState(STORAGE_KEYS.SKUS, MOCK_SKUS);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [qcFilter, setQcFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [formulationFilter, setFormulationFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const hasActiveFilters = searchQuery.trim() !== '' ||
    qcFilter !== 'All' ||
    zoneFilter !== 'All' ||
    formulationFilter !== 'All';

  const resetAllFilters = () => {
    setSearchQuery('');
    setQcFilter('All');
    setZoneFilter('All');
    setFormulationFilter('All');
  };

  // Manufacture Batch Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formSku, setFormSku] = useState('GRD-TAB-001');
  const [formQty, setFormQty] = useState(30000);
  const [formZone, setFormZone] = useState('Ambient Finished Goods (15-25°C)');

  const filteredBatches = batches.filter(b => {
    const matchQc = qcFilter === 'All' || 
                    (qcFilter === 'Passed' && b.qcStatus.includes('Passed')) ||
                    (qcFilter === 'Quarantine' && b.qcStatus.includes('Quarantine'));
    const matchZone = zoneFilter === 'All' ||
                      (zoneFilter === 'Ambient' && b.storageZone?.toLowerCase().includes('ambient')) ||
                      (zoneFilter === 'Cold' && b.storageZone?.toLowerCase().includes('cold')) ||
                      (zoneFilter === 'Quarantine' && b.storageZone?.toLowerCase().includes('quarantine'));
    const matchFormulation = formulationFilter === 'All' ||
      (b.formulation && b.formulation.toLowerCase().includes(formulationFilter.toLowerCase()));
    const matchSearch = b.batchNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.medicine.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.skuCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.aisleLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchQc && matchZone && matchFormulation && matchSearch;
  });

  const handleReleaseQA = (batchNo) => {
    releaseBatchQA({ batchNo, user: currentUser });
    toast.success(`Batch ${batchNo} cleared Schedule M QA and released from quarantine!`);
  };

  const handleCreateBatch = (e) => {
    e.preventDefault();
    const skuObj = skus.find(s => s.code === formSku) || { name: 'Paracetamol 650mg Tablets', dosageForm: 'Tablets' };
    const newB = createPlantBatch({
      skuCode: formSku,
      medicine: skuObj.brandName ? `${skuObj.brandName} (${skuObj.name})` : skuObj.name,
      formulation: skuObj.dosageForm || 'Tablets (Strip of 10)',
      quantityPacks: Number(formQty),
      storageZone: formZone,
      user: currentUser
    });
    setIsAddModalOpen(false);
    toast.success(`Batch ${newB.batchNo} (${Number(formQty).toLocaleString('en-IN')} packs) logged into Rani Plant Finished Goods warehouse!`);
  };

  const columns = [
    {
      header: 'Batch Number',
      accessor: 'batchNo',
      className: 'whitespace-nowrap min-w-[140px]',
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-bold text-navy-950 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 whitespace-nowrap inline-block">
            {row.batchNo}
          </span>
          <p className="text-[11px] text-slate-500 font-mono mt-1 flex items-center gap-1 whitespace-nowrap">
            <QrCode className="w-3 h-3 text-slate-400" />
            {row.barcode}
          </p>
        </div>
      )
    },
    {
      header: 'Medicine & Strength',
      accessor: 'medicine',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900 text-xs">{row.medicine}</p>
          <p className="text-[11px] text-slate-500 font-mono">{row.skuCode}</p>
          <span className="text-[10px] text-slate-400">{row.formulation}</span>
        </div>
      )
    },
    {
      header: 'Plant Inventory Units',
      accessor: 'availableUnits',
      render: (row) => (
        <div>
          <span className="text-sm font-bold text-navy-950 font-sans">
            {formatNumber(row.availableUnits)}
          </span>
          <span className="text-xs text-slate-500 ml-1">Packs</span>
          <p className="text-[10px] text-slate-400">Total batch: {formatNumber(row.quantityPacks)} packs</p>
        </div>
      )
    },
    {
      header: 'Aisle & Storage Bay',
      accessor: 'aisleLocation',
      render: (row) => (
        <div>
          <span className="font-semibold text-xs text-slate-800 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-terracotta-500 shrink-0" />
            {row.aisleLocation}
          </span>
          <p className="text-[11px] text-slate-500">{row.storageZone}</p>
        </div>
      )
    },
    {
      header: 'Mfg & Expiry',
      accessor: 'mfgDate',
      render: (row) => (
        <div className="text-xs">
          <p className="text-slate-700">Mfg: <strong>{row.mfgDate}</strong></p>
          <p className="text-slate-500">Exp: <strong>{row.expiryDate}</strong></p>
        </div>
      )
    },
    {
      header: 'cGMP QA Status',
      accessor: 'qcStatus',
      render: (row) => {
        const isQuarantined = row.qcStatus.includes('Quarantine') || row.qcStatus.includes('Microbiology');

        return (
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isQuarantined 
                  ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {row.qcStatus}
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">QA Lead: {row.qaOfficer}</p>
            </div>

            {isQuarantined && (
              <Button
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReleaseQA(row.batchNo);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-2xs"
              >
                Release QA
              </Button>
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
              Plant Batch Master &amp; Barcode Serialization
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-50 text-navy-800 border border-navy-200">
              Rani cGMP Unit
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Full batch lineage, Schedule M compliance sign-offs, and pallet storage coordinates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-navy-900 hover:bg-navy-950 text-white font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Manufacture Batch</span>
          </Button>
          <ExportButton label="Export Batch Register" data={batches} filename="production_batches_register" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <Select
            value={qcFilter}
            onChange={(val) => setQcFilter(val)}
            options={[
              { value: 'All', label: 'All QA Statuses' },
              { value: 'Passed', label: 'Passed cGMP QA' },
              { value: 'Quarantine', label: 'Under Quarantine' }
            ]}
            icon={Filter}
          />

          <Select
            value={zoneFilter}
            onChange={(val) => setZoneFilter(val)}
            options={[
              { value: 'All', label: 'All Storage Zones' },
              { value: 'Ambient', label: 'Ambient Finished Goods (15-25°C)' },
              { value: 'Cold', label: 'Cold Chain Vault (2-8°C)' },
              { value: 'Quarantine', label: 'Secure Quarantine Zone' }
            ]}
            icon={Warehouse}
          />

          <Select
            value={formulationFilter}
            onChange={(val) => setFormulationFilter(val)}
            options={[
              { value: 'All', label: 'All Formulations' },
              { value: 'Tablet', label: 'Tablets' },
              { value: 'Capsule', label: 'Capsules' },
              { value: 'Syrup', label: 'Syrups' },
              { value: 'Sanitizer', label: 'Handrub & Hygiene' }
            ]}
            icon={Layers}
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
            placeholder="Search batch, SKU or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9 py-1.5 text-xs w-full"
          />
        </div>
      </div>

      {/* Table */}
      <Table
        title="Formulation Production Batches"
        subtitle="Click any batch to inspect Certificate of Analysis (CoA) and 2D barcode specification"
        columns={columns}
        data={filteredBatches}
        keyExtractor={(row) => row.batchNo}
        onRowClick={(row) => setSelectedBatch(row)}
      />

      {/* CoA & Barcode Modal */}
      {selectedBatch && (
        <Modal
          isOpen={!!selectedBatch}
          onClose={() => setSelectedBatch(null)}
          title={`Batch CoA & Serialization: ${selectedBatch.batchNo}`}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl space-y-2.5 border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Medicine &amp; Strength:</span>
                <span className="font-bold text-slate-900">{selectedBatch.medicine}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">SKU Code &amp; Formulation:</span>
                <span className="font-mono text-slate-800">{selectedBatch.skuCode} &bull; {selectedBatch.formulation}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">GS1 2D DataMatrix / Barcode:</span>
                <span className="font-mono text-navy-950 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">{selectedBatch.barcode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Pallet Coordinate:</span>
                <span className="font-semibold text-slate-900">{selectedBatch.aisleLocation}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Mfg &amp; Expiry Date:</span>
                <span className="font-semibold text-slate-800">{selectedBatch.mfgDate} &bull; {selectedBatch.expiryDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">cGMP QA Sign-off:</span>
                <span className="font-bold text-emerald-700">{selectedBatch.qcStatus} ({selectedBatch.qaOfficer})</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Assay, Dissolution, and Uniformity of Dosage Units meet Schedule M cGMP specifications.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedBatch(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-950 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print CoA &amp; Pallet Label
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Manufacture New Batch Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Log cGMP Manufacturing Batch"
          subtitle="Formulate and serialize finished goods batch at Rani Plant"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleCreateBatch} className="space-y-4 text-xs text-slate-700">
            <div>
              <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Medicine Formulation (SKU)
              </label>
              <select
                value={formSku}
                onChange={(e) => setFormSku(e.target.value)}
                className="input py-2 text-xs w-full bg-slate-50"
              >
                {skus.map(s => (
                  <option key={s.code} value={s.code}>{s.code} - {s.brandName ? `${s.brandName} (${s.name})` : s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Batch Production Quantity (Packs)
              </label>
              <input
                type="number"
                min="1000"
                step="1000"
                value={formQty}
                onChange={(e) => setFormQty(e.target.value)}
                className="input py-2 text-xs w-full"
                required
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Storage Hall &amp; Temperature Zone
              </label>
              <select
                value={formZone}
                onChange={(e) => setFormZone(e.target.value)}
                className="input py-2 text-xs w-full bg-slate-50"
              >
                <option value="Ambient Finished Goods (15-25°C)">Ambient Finished Goods (15-25°C)</option>
                <option value="Controlled Humidity Bay (<60% RH)">Controlled Humidity Bay (&lt;60% RH)</option>
                <option value="Cold Room Bay A (2-8°C)">Cold Room Bay A (2-8°C)</option>
                <option value="Flammable/Alcohol Storage Bay">Flammable/Alcohol Storage Bay</option>
              </select>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-2xs space-y-1">
              <p className="font-bold">Schedule M cGMP Verification:</p>
              <p>Batch will be generated with unique GS1-128 DataMatrix barcode and stored in Rani Finished Goods bay.</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-navy-900 hover:bg-navy-950 text-white font-bold">
                Confirm &amp; Log Batch
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}