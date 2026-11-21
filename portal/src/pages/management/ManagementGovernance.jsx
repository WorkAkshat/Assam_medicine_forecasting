import React from 'react';
import { CheckCircle2, Calendar } from 'lucide-react';
import Table from '../../components/common/Table';
import ExportButton from '../../components/common/ExportButton';
import { PILOT_GOVERNANCE_MILESTONES } from '../../data/mockManagementData';

export default function ManagementGovernance() {
  const columns = [
    {
      header: 'Phase ID & Milestone',
      accessor: 'id',
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-bold text-navy-950 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {row.id}
          </span>
          <p className="font-bold text-xs text-slate-900 mt-1">{row.milestone}</p>
        </div>
      )
    },
    {
      header: 'Lead Partner',
      accessor: 'leadPartner',
      render: (row) => (
        <span className="text-xs font-semibold text-slate-800">
          {row.leadPartner}
        </span>
      )
    },
    {
      header: 'Target Date',
      accessor: 'targetDate',
      render: (row) => (
        <span className="text-xs font-mono text-slate-700">
          {row.targetDate}
        </span>
      )
    },
    {
      header: 'Operational Status',
      accessor: 'status',
      render: (row) => {
        const isDone = row.status.includes('Completed');

        return (
          <div>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isDone ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Calendar className="w-3.5 h-3.5 text-blue-600" />}
              {row.status}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">{row.completionDate}</p>
          </div>
        );
      }
    },
    {
      header: 'Deliverables & Impact',
      accessor: 'deliverables',
      render: (row) => (
        <p className="text-xs text-slate-600 max-w-sm">
          {row.deliverables}
        </p>
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
              NESFIC-I-09 Pilot Governance Roadmap
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-50 text-navy-800 border border-navy-200">
              Multi-State Research Pilot
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Institutional oversight and phase-by-phase rollout across Northeast medical distribution facilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton label="Export Governance Briefing" />
        </div>
      </div>

      {/* Overview Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
        <h2 className="text-sm font-bold text-navy-950 font-sans">
          Pilot Title: Improving Medicine Demand Forecasting and Inventory Availability Across Northeast India
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed font-light">
          An operational decision-support deployment connecting the Dhanuka Group Rani cGMP formulation facility to the Guwahati Central Mother Depot and 12 Northeast distribution nodes. Objective: eliminate stockouts of vital life-saving medicines and reduce regional supply vulnerability during monsoon weather disruptions.
        </p>
      </div>

      {/* Table */}
      <Table
        title="Implementation Milestones Register"
        subtitle="Tracking delivery timelines, operational sign-offs, and hospital impact"
        columns={columns}
        data={PILOT_GOVERNANCE_MILESTONES}
        keyExtractor={(row) => row.id}
      />

    </div>
  );
}
