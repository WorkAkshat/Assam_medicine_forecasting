import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Table from '../../components/common/Table';
import ExportButton from '../../components/common/ExportButton';
import { WORKING_CAPITAL_OPTIMIZATION } from '../../data/mockManagementData';

export default function ManagementFinancials() {
  const columns = [
    {
      header: 'Optimization Category',
      accessor: 'category',
      render: (row) => (
        <div>
          <span className="font-bold text-xs text-navy-950 font-sans">{row.category}</span>
          <p className="text-[11px] text-slate-500 mt-0.5">{row.impact}</p>
        </div>
      )
    },
    {
      header: 'Pre-Pilot Baseline',
      accessor: 'prePilotAmount',
      render: (row) => (
        <span className="text-xs text-slate-500 line-through">
          {row.prePilotAmount}
        </span>
      )
    },
    {
      header: 'Current Optimized Level',
      accessor: 'currentAmount',
      render: (row) => (
        <span className="text-xs font-bold text-navy-950">
          {row.currentAmount}
        </span>
      )
    },
    {
      header: 'Total Capital Saved',
      accessor: 'savingsAchieved',
      render: (row) => (
        <div>
          <span className="text-sm font-bold text-emerald-700 font-sans">
            {row.savingsAchieved}
          </span>
          <p className="text-[10px] text-emerald-600 font-semibold">{row.improvementPct} Reduction</p>
        </div>
      )
    },
    {
      header: 'Impact Status',
      accessor: 'improvementPct',
      render: (row) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Verified Savings
        </span>
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
              Working Capital Optimization &amp; Holding ROI
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              ₹48.5L Capital Liberated
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Dhanuka Group executive audit of working capital freed from excess buffer stock into revenue-generating formulations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton label="Export Financial ROI Audit" data={WORKING_CAPITAL_OPTIMIZATION} filename="working_capital_optimization" />
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-medium">Excess Inventory Reduction</p>
          <p className="text-2xl font-bold text-navy-950 font-sans">₹48.5 Lakhs</p>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> -57.7% slower-moving inventory
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-medium">Stockout Losses Prevented</p>
          <p className="text-2xl font-bold text-navy-950 font-sans">₹36.4 Lakhs/mo</p>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> -95.3% hospital lost revenue
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-medium">Holding Cost Savings</p>
          <p className="text-2xl font-bold text-navy-950 font-sans">₹7.4 Lakhs/mo</p>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Optimized pallet space
          </p>
        </div>
      </div>

      {/* Table */}
      <Table
        title="Working Capital Savings Ledger"
        subtitle="Financial impact breakdown across inventory carrying categories"
        columns={columns}
        data={WORKING_CAPITAL_OPTIMIZATION}
        keyExtractor={(row) => row.category}
      />

    </div>
  );
}
