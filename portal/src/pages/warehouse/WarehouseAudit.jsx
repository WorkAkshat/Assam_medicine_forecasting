import React, { useState } from 'react';
import { CheckCircle2, Plus, Search } from 'lucide-react';
import Table from '../../components/common/Table';
import ExportButton from '../../components/common/ExportButton';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useToast } from '../../hooks/useToast';
import { STORAGE_KEYS } from '../../services/grdDataService';
import { CYCLE_AUDIT_LOG } from '../../data/mockWarehouseData';
import { formatNumber } from '../../utils/formatters';

export default function WarehouseAudit() {
  const { toast } = useToast();
  const [audits, setAudits] = usePersistentState(STORAGE_KEYS.WAREHOUSE_AUDITS, CYCLE_AUDIT_LOG);
  const [isLogAuditModalOpen, setIsLogAuditModalOpen] = useState(false);
  const [formSkuCode, setFormSkuCode] = useState('GRD-TAB-001');
  const [formSkuName, setFormSkuName] = useState('Paracetamol 650mg Tablets');
  const [formErpUnits, setFormErpUnits] = useState(45000);
  const [formPhysicalUnits, setFormPhysicalUnits] = useState(45000);
  const [formZone, setFormZone] = useState('Aisle A-01 / Pallet 02 (Ambient)');
  const [formInspector, setFormInspector] = useState('Pranabesh Bora (Plant QA)');

  const handleCreateAudit = (e) => {
    e.preventDefault();
    const erp = Number(formErpUnits);
    const physical = Number(formPhysicalUnits);
    const variance = physical - erp;
    const accuracy = erp > 0 ? (Math.min(physical, erp) / Math.max(physical, erp) * 100).toFixed(1) : 100;

    const newAudit = {
      auditId: `AUD-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      skuCode: formSkuCode,
      skuName: formSkuName,
      erpRecordedUnits: erp,
      physicalCountUnits: physical,
      varianceUnits: variance,
      accuracyPct: `${accuracy}%`,
      status: Math.abs(variance) === 0 ? 'Verified Match' : 'Discrepancy Logged',
      location: formZone,
      inspector: formInspector
    };

    setAudits(prev => [newAudit, ...prev]);
    setIsLogAuditModalOpen(false);
    toast.success(`Cycle audit ${newAudit.auditId} logged with ${newAudit.accuracyPct} inventory accuracy!`);
  };

  const [searchQuery, setSearchQuery] = useState('');

  const filteredAudits = audits.filter(a => 
    a.auditId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.skuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.skuCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: 'Audit ID & Date',
      accessor: 'auditId',
      className: 'whitespace-nowrap min-w-[130px]',
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-bold text-navy-950 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 whitespace-nowrap inline-block">
            {row.auditId}
          </span>
          <p className="text-[11px] text-slate-500 mt-1 whitespace-nowrap">{row.date}</p>
        </div>
      )
    },
    {
      header: 'Medicine & Formulation',
      accessor: 'skuName',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900 text-xs">{row.skuName}</p>
          <p className="text-[11px] text-slate-500 font-mono">{row.skuCode}</p>
        </div>
      )
    },
    {
      header: 'ERP System Count',
      accessor: 'erpRecordedUnits',
      render: (row) => (
        <span className="text-xs font-semibold text-slate-800">
          {formatNumber(row.erpRecordedUnits)} Packs
        </span>
      )
    },
    {
      header: 'Physical Blind Count',
      accessor: 'physicalCountUnits',
      render: (row) => (
        <span className="text-xs font-bold text-navy-950">
          {formatNumber(row.physicalCountUnits)} Packs
        </span>
      )
    },
    {
      header: 'Variance & Accuracy',
      accessor: 'variance',
      render: (row) => (
        <div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            row.variance === 0 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
              : 'bg-amber-100 text-amber-800 border border-amber-200'
          }`}>
            {row.variance === 0 ? 'Zero Variance' : `${row.variance} Packs`} ({row.accuracyPct}%)
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">{row.status}</p>
        </div>
      )
    },
    {
      header: 'Auditor & Sign-off',
      accessor: 'auditor',
      render: (row) => (
        <div className="text-xs">
          <p className="font-semibold text-navy-900">{row.auditor}</p>
          <span className="text-[10px] text-slate-400">Schedule M Compliant</span>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-sans text-navy-950">
              Cycle Count &amp; Physical Stock Reconciliation
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              99.85% Overall Plant Accuracy
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Blind physical pallet counts reconciled against ERP ledger balances per WHO-GMP requirements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            className="bg-navy-900 hover:bg-navy-950 text-white font-semibold text-xs cursor-pointer shadow-sm flex items-center gap-1.5"
            onClick={() => setIsLogAuditModalOpen(true)}
          >
            Log Cycle Count
          </Button>
          <ExportButton label="Export Audit Log" data={audits} />
        </div>
      </div>

      {/* KPI Highlight */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-medium">Reconciled Count Accuracy</p>
          <p className="text-2xl font-bold text-navy-950 font-sans">99.85%</p>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Exceeds 98.0% cGMP target
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-medium">Audited SKU Batches</p>
          <p className="text-2xl font-bold text-navy-950 font-sans">1,11,000 Packs</p>
          <p className="text-[11px] text-slate-500">Across 3 audit cycles</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-medium">Net Physical Variance</p>
          <p className="text-2xl font-bold text-navy-950 font-sans">-20 Packs</p>
          <p className="text-[11px] text-slate-500">Documented in-transit carton crush</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit ID, SKU code, or medicine..."
            className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-navy-950 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-slate-50/60 focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
        <p className="text-2xs text-slate-500 font-medium">
          Showing <span className="font-bold text-navy-950">{filteredAudits.length}</span> of {audits.length} audit records
        </p>
      </div>

      {/* Table */}
      <Table
        title="Physical Inventory Audit Log"
        subtitle="Weekly blind stock count sheets and QA reconciliations"
        columns={columns}
        data={filteredAudits}
        keyExtractor={(row) => row.auditId}
      />

      {/* Log Audit Modal */}
      {isLogAuditModalOpen && (
        <Modal
          isOpen={isLogAuditModalOpen}
          onClose={() => setIsLogAuditModalOpen(false)}
          title="Log Physical Inventory Cycle Count"
          subtitle="Record blind count verification against ERP warehouse balance under cGMP SOP"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleCreateAudit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Medicine SKU Code *
                </label>
                <select
                  value={formSkuCode}
                  onChange={(e) => {
                    setFormSkuCode(e.target.value);
                    if (e.target.value === 'GRD-TAB-001') setFormSkuName('Paracetamol 650mg Tablets');
                    if (e.target.value === 'GRD-TAB-002') setFormSkuName('Azithromycin 500mg Tablets');
                    if (e.target.value === 'GRD-TAB-003') setFormSkuName('Amoxicillin & Pot. Clavulanate');
                    if (e.target.value === 'GRD-SYR-001') setFormSkuName('Cough Syrup 100ml (CofGRD)');
                    if (e.target.value === 'GRD-HYG-001') setFormSkuName('Handuser-C® Surgical Handrub 500ml');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  <option value="GRD-TAB-001">GRD-TAB-001 - Paracetamol 650mg</option>
                  <option value="GRD-TAB-002">GRD-TAB-002 - Azithromycin 500mg</option>
                  <option value="GRD-TAB-003">GRD-TAB-003 - Amoxicillin & Pot. Clav</option>
                  <option value="GRD-SYR-001">GRD-SYR-001 - CofGRD Syrup 100ml</option>
                  <option value="GRD-HYG-001">GRD-HYG-001 - Handuser-C® 500ml</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Storage Pallet Location *
                </label>
                <input
                  type="text"
                  required
                  value={formZone}
                  onChange={(e) => setFormZone(e.target.value)}
                  placeholder="e.g. Aisle A-01 / Pallet 02"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  ERP Recorded Count (Packs) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formErpUnits}
                  onChange={(e) => setFormErpUnits(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Physical Blind Count (Packs) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formPhysicalUnits}
                  onChange={(e) => setFormPhysicalUnits(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Quality Inspector Sign-off *
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

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsLogAuditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-navy-900 hover:bg-navy-950 text-white font-bold shadow-sm cursor-pointer">
                Save Audit Record
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
