import React, { useState } from 'react';
import {
  Factory,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  RotateCcw,
  Pill,
  Plus,
  RefreshCw
} from 'lucide-react';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import ExportButton from '../../components/common/ExportButton';
import Select from '../../components/common/Select';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { PLANT_PRODUCTION_BATCHES } from '../../data/mockWarehouseData';
import { MOCK_SKUS } from '../../data/mockSkus';
import { formatNumber } from '../../utils/formatters';
import { inwardBatchToGuwahati, createPlantBatch, STORAGE_KEYS } from '../../services/grdDataService';

export default function SupplyChainInward() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [batches, setBatches] = usePersistentState(STORAGE_KEYS.PLANT_BATCHES, PLANT_PRODUCTION_BATCHES);
  const [skus] = usePersistentState(STORAGE_KEYS.SKUS, MOCK_SKUS);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [qcFilter, setQcFilter] = useState('All');
  const [inwardFilter, setInwardFilter] = useState('All');
  const [formulationFilter, setFormulationFilter] = useState('All');

  // Add Batch Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formBatchNo, setFormBatchNo] = useState(`RANI-2026-B0${Math.floor(95 + Math.random() * 20)}`);
  const [formSku, setFormSku] = useState('GRD-TAB-001');
  const [formQty, setFormQty] = useState(30000);
  const [formDock, setFormDock] = useState('Dock Bay 01 (Central Staging)');
  const [formQcStatus, setFormQcStatus] = useState('Passed cGMP QA');
  const [formInspector, setFormInspector] = useState('Dr. Nilakshi Das (QA Lead)');
  const [formShelfMonths, setFormShelfMonths] = useState(24);

  const hasActiveFilters = searchQuery.trim() !== '' || 
    qcFilter !== 'All' || 
    inwardFilter !== 'All' || 
    formulationFilter !== 'All';

  const resetAllFilters = () => {
    setSearchQuery('');
    setQcFilter('All');
    setInwardFilter('All');
    setFormulationFilter('All');
  };

  const filteredBatches = batches.filter(b => {
    const matchesSearch = !searchQuery || 
      b.batchNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.medicine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.skuCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesQc = qcFilter === 'All' ||
      (qcFilter === 'Passed' && b.qcStatus?.includes('Passed')) ||
      (qcFilter === 'Pending' && !b.qcStatus?.includes('Passed'));

    const isInwarded = b.inwardStatus?.includes('Inwarded') || b.dispatchStatus?.includes('Transferred to Mother Hub');
    const matchesInward = inwardFilter === 'All' ||
      (inwardFilter === 'Inwarded' && isInwarded) ||
      (inwardFilter === 'Pending' && !isInwarded);

    const matchesFormulation = formulationFilter === 'All' ||
      (b.formulation || '').toLowerCase().includes(formulationFilter.toLowerCase()) ||
      (b.medicine || '').toLowerCase().includes(formulationFilter.toLowerCase());

    return matchesSearch && matchesQc && matchesInward && matchesFormulation;
  });

  const handleCreateProductionBatch = (e) => {
    e.preventDefault();
    const skuObj = (skus || MOCK_SKUS).find(s => s.code === formSku) || { name: 'Paracetamol 650mg Tablets', dosageForm: 'Tablets' };
    
    const mfgDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const expDate = new Date(Date.now() + formShelfMonths * 30 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newBatch = createPlantBatch({
      batchNo: formBatchNo.trim() || `RANI-2026-B0${Math.floor(95 + Math.random() * 20)}`,
      skuCode: formSku,
      medicine: skuObj.brandName ? `${skuObj.name} (${skuObj.brandName})` : skuObj.name,
      formulation: skuObj.dosageForm || 'Tablets (Strip of 10)',
      quantityPacks: Number(formQty),
      dockId: formDock,
      qcStatus: formQcStatus,
      inspector: formInspector,
      mfgDate,
      expiryDate: expDate,
      user: currentUser
    });

    setBatches(prev => [newBatch, ...prev]);
    setIsAddModalOpen(false);
    toast.success(`Production batch ${newBatch.batchNo} (${Number(formQty).toLocaleString('en-IN')} packs) registered into Rani Plant buffer!`);
    setFormBatchNo(`RANI-2026-B0${Math.floor(95 + Math.random() * 20)}`);
  };

  const handleInward = (batchNo, e) => {
    if (e) e.stopPropagation();
    const success = inwardBatchToGuwahati({ batchNo, user: currentUser });
    if (success) {
      setBatches(prev => prev.map(b => b.batchNo === batchNo ? {
        ...b,
        inwardStatus: 'Inwarded to Guwahati Depot',
        dispatchStatus: 'Transferred to Mother Hub'
      } : b));
      toast.success(`Batch ${batchNo} successfully inwarded to Guwahati Central Depot! Inventory ledger updated.`);
    }
  };

  const columns = [
    {
      header: 'Batch No & Plant',
      accessor: 'batchNo',
      className: 'whitespace-nowrap min-w-[130px]',
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-bold text-navy-950 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 whitespace-nowrap">
            {row.batchNo}
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5 whitespace-nowrap">Rani Formulation Plant</p>
        </div>
      )
    },
    {
      header: 'Medicine Formulation',
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
      header: 'Quantity Inward',
      accessor: 'quantityPacks',
      align: 'right',
      className: 'whitespace-nowrap min-w-[110px]',
      sortValue: (row) => row.quantityPacks,
      render: (row) => (
        <div className="text-right">
          <span className="text-sm font-bold text-navy-950 font-sans">
            {formatNumber(row.quantityPacks)}
          </span>
          <span className="text-xs text-slate-500 ml-1">Packs</span>
        </div>
      )
    },
    {
      header: 'Mfg / Expiry Date',
      accessor: 'mfgDate',
      align: 'center',
      className: 'whitespace-nowrap min-w-[115px]',
      render: (row) => (
        <div className="text-xs text-center">
          <p className="text-slate-700 whitespace-nowrap">Mfg: <strong>{row.mfgDate}</strong></p>
          <p className="text-slate-500 whitespace-nowrap">Exp: <strong>{row.expiryDate}</strong></p>
        </div>
      )
    },
    {
      header: 'cGMP QC Inspection',
      accessor: 'qcStatus',
      align: 'center',
      className: 'whitespace-nowrap min-w-[160px]',
      render: (row) => {
        const isPassed = row.qcStatus?.includes('Passed');
        return (
          <div className="flex flex-col items-center">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${
              isPassed 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {isPassed ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              )}
              {row.qcStatus}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">Inspector: {row.qaOfficer || row.inspector || 'PB (Pranabesh Bora)'}</p>
          </div>
        );
      }
    },
    {
      header: 'Receiving Dock & Action',
      accessor: 'inwardStatus',
      className: 'whitespace-nowrap min-w-[240px]',
      render: (row) => {
        const isInwarded = row.inwardStatus?.includes('Inwarded') || row.dispatchStatus?.includes('Transferred to Mother Hub');
        const isPassed = row.qcStatus?.includes('Passed');

        return (
          <div className="flex items-center justify-between gap-2.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
            <div>
              <span className="font-semibold text-xs text-navy-900 block whitespace-nowrap">
                {isInwarded ? 'Inwarded to Depot' : isPassed ? (row.inwardStatus || 'Staging at Dock') : 'Under QC Quarantine'}
              </span>
              <p className="text-[11px] text-slate-500 whitespace-nowrap">{row.dockId || (isPassed ? 'Bay 01' : 'QC Quarantine Bay')}</p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBatch(row);
                }}
                className="px-2 py-0.5 rounded-lg border border-slate-200 text-2xs font-semibold text-slate-600 hover:text-navy-950 hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
                title="View Certificate of Analysis (CoA)"
              >
                CoA
              </button>

              {isInwarded ? (
                <span className="text-emerald-700 font-bold text-xs flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 whitespace-nowrap">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> Inwarded
                </span>
              ) : isPassed ? (
                <Button
                  size="xs"
                  onClick={(e) => handleInward(row.batchNo, e)}
                  className="bg-navy-900 hover:bg-navy-950 text-white font-bold text-2xs cursor-pointer shadow-2xs whitespace-nowrap py-1 px-2.5"
                >
                  Inward to Depot
                </Button>
              ) : (
                <span className="text-amber-800 font-bold text-2xs flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 whitespace-nowrap" title="Awaiting microbiology QA clearance before release">
                  <Clock className="w-3 h-3 text-amber-600 shrink-0" /> QA Hold
                </span>
              )}
            </div>
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
              Rani cGMP Plant Inward Pipeline
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              cGMP Certified Production
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Real-time batch inward from GRD Pharmaceuticals formulation facility in Rani, Kamrup (Assam) into Guwahati Central Depot.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            icon={Plus}
            onClick={() => {
              setFormBatchNo(`RANI-2026-B0${Math.floor(95 + Math.random() * 20)}`);
              setIsAddModalOpen(true);
            }}
            className="bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs shadow-sm cursor-pointer whitespace-nowrap"
          >
            Log Production Batch
          </Button>
          <ExportButton label="Export Inward Ledger" data={filteredBatches} filename="inward_production_batches" />
        </div>
      </div>

      {/* Info Notice Banner */}
      <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
        <Factory className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-sm text-blue-950">Manufacturing Facility: Rani Industrial Area, Guwahati</p>
          <p className="text-blue-800 font-light mt-0.5">
            Production batches are quarantined and inspected under Schedule M / WHO-cGMP guidelines by Plant QA before dispatching 35 km to Guwahati Mother Depot. All batches include automated barcode serialization.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Select
              label="cGMP QC Status"
              value={qcFilter}
              onChange={(val) => setQcFilter(val)}
              options={[
                { value: 'All', label: 'All QC States' },
                { value: 'Passed', label: 'Passed cGMP QA (Release Ready)' },
                { value: 'Pending', label: 'Under Assay / Quarantine' }
              ]}
              icon={ShieldCheck}
            />

            <Select
              label="Depot Inward Status"
              value={inwardFilter}
              onChange={(val) => setInwardFilter(val)}
              options={[
                { value: 'All', label: 'All Inward States' },
                { value: 'Pending', label: 'Staging at Dock (Pending Inward)' },
                { value: 'Inwarded', label: 'Inwarded to Depot' }
              ]}
              icon={Clock}
            />

            <Select
              label="Formulation Type"
              value={formulationFilter}
              onChange={(val) => setFormulationFilter(val)}
              options={[
                { value: 'All', label: 'All Formulations' },
                { value: 'Tablets', label: 'Tablets' },
                { value: 'Syrup', label: 'Syrups' },
                { value: 'Handrub', label: 'Antiseptic & Suspensions' }
              ]}
              icon={Pill}
            />

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                title="Reset all batch filters"
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
                placeholder="Search batch number, SKU or formulation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 transition-all"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:inline">
              Showing {filteredBatches.length} of {batches.length}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        title="Manufacturing Production Batches"
        subtitle="Click batch row for Certificate of Analysis (CoA) and barcoding details"
        columns={columns}
        data={filteredBatches}
        keyExtractor={(row) => row.batchNo}
        compact={true}
        onRowClick={(row) => setSelectedBatch(row)}
      />

      {/* Batch Certificate Modal */}
      {selectedBatch && (
        <Modal
          isOpen={!!selectedBatch}
          onClose={() => setSelectedBatch(null)}
          title={`Certificate of Analysis (CoA): ${selectedBatch.batchNo}`}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl space-y-2.5 border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Medicine &amp; Strength:</span>
                <span className="font-bold text-slate-900">{selectedBatch.medicine}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Batch Size:</span>
                <span className="font-bold text-navy-950">{formatNumber(selectedBatch.quantityPacks)} Packs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Manufacturing Date:</span>
                <span className="font-semibold text-slate-800">{selectedBatch.mfgDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Expiry Date:</span>
                <span className="font-semibold text-slate-800">{selectedBatch.expiryDate} (24 Months Shelf Life)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Quality Release:</span>
                <span className="font-bold text-emerald-700">{selectedBatch.qcStatus}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Sign-Off Authority:</span>
                <span className="font-semibold text-navy-900">{selectedBatch.inspector} &bull; Head of Quality Assurance</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Assay, Dissolution, and Friability conform with Indian Pharmacopoeia (IP) standards.</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedBatch(null)}
                className="px-4 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-950 text-white font-semibold cursor-pointer"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Log / Inward New Manufacturing Batch Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Log New Manufacturing Production Batch"
          subtitle="Register Schedule M compliant finished goods batch from Rani Formulation Plant (Kamrup) into Receiving Dock"
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleCreateProductionBatch} className="space-y-4 text-xs">
            {/* Facility Header Badge */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Factory className="w-4 h-4 text-navy-900" />
                <span className="font-bold text-navy-950">Rani cGMP Formulation Plant</span>
                <span className="text-2xs text-slate-500">(Kamrup Rural, Assam)</span>
              </div>
              <span className="text-2xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                WHO-cGMP Schedule M
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Batch Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-2xs font-bold text-slate-600 uppercase tracking-wider">
                    Batch Serial Number *
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormBatchNo(`RANI-2026-B0${Math.floor(95 + Math.random() * 20)}`)}
                    className="text-2xs font-semibold text-terracotta-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Auto-ID
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formBatchNo}
                  onChange={(e) => setFormBatchNo(e.target.value)}
                  placeholder="e.g. RANI-2026-B095"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              {/* Medicine Formulation / SKU */}
              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Medicine Formulation (SKU) *
                </label>
                <select
                  value={formSku}
                  onChange={(e) => setFormSku(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  {(skus || MOCK_SKUS).map((sku) => (
                    <option key={sku.code} value={sku.code}>
                      {sku.code} - {sku.brandName ? `${sku.name} (${sku.brandName})` : sku.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Batch Quantity */}
              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Batch Quantity (Packs) *
                </label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  required
                  value={formQty}
                  onChange={(e) => setFormQty(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-2xs text-slate-400">Presets:</span>
                  {[15000, 30000, 45000, 60000].map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setFormQty(q)}
                      className={`text-2xs font-semibold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                        Number(formQty) === q
                          ? 'bg-navy-900 text-white border-navy-900'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                      }`}
                    >
                      {(q / 1000)}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Shelf Life (Months) */}
              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Shelf Life (Months) *
                </label>
                <select
                  value={formShelfMonths}
                  onChange={(e) => setFormShelfMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  <option value={12}>12 Months (1 Year)</option>
                  <option value={18}>18 Months (1.5 Years)</option>
                  <option value={24}>24 Months (2 Years - Standard cGMP)</option>
                  <option value={36}>36 Months (3 Years - Extended Stability)</option>
                </select>
              </div>

              {/* Receiving Dock */}
              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Receiving Dock Staging *
                </label>
                <select
                  value={formDock}
                  onChange={(e) => setFormDock(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  <option value="Dock Bay 01 (Central Staging)">Dock Bay 01 (Central Staging)</option>
                  <option value="Dock Bay 02 (Cold Chain Buffer)">Dock Bay 02 (Cold Chain Buffer - 2-8°C)</option>
                  <option value="Dock Bay 03 (Oral Suspensions & Syrups)">Dock Bay 03 (Oral Suspensions & Syrups)</option>
                  <option value="Dock Bay 04 (Hospital Emergency Reserve)">Dock Bay 04 (Hospital Emergency Reserve)</option>
                </select>
              </div>

              {/* QC Status */}
              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Schedule M Quality Release *
                </label>
                <select
                  value={formQcStatus}
                  onChange={(e) => setFormQcStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  <option value="Passed cGMP QA">Passed cGMP QA (Ready to Inward)</option>
                  <option value="Microbiology Assay in Final Stage">Microbiology Assay in Final Stage (Under QA Hold)</option>
                </select>
              </div>

              {/* Quality Inspector */}
              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  QA Sign-off Authority *
                </label>
                <input
                  type="text"
                  required
                  value={formInspector}
                  onChange={(e) => setFormInspector(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>
            </div>

            {/* Live Summary Preview Box */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-950">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Certificate of Analysis (CoA) will be auto-generated</span>
              </div>
              <p className="text-2xs text-emerald-800">
                Barcode serialization will be assigned and the batch will immediately stage at {formDock}. If cleared with Passed cGMP QA, it can be inwarded directly into Guwahati Central Depot inventory with one click.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-navy-900 hover:bg-navy-950 text-white font-bold cursor-pointer shadow-sm"
              >
                Confirm & Log Batch
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
