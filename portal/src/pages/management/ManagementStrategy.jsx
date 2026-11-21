import React from 'react';
import { Hospital, CheckCircle2 } from 'lucide-react';
import ExportButton from '../../components/common/ExportButton';
import { EXECUTIVE_STRATEGY_KPI } from '../../data/mockManagementData';

export default function ManagementStrategy() {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-sans text-navy-950">
              Corporate Strategy &amp; Northeast Expansion
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-50 text-navy-800 border border-navy-200">
              2026–2027 Vision
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Dhanuka Group strategic market expansion, government hospital tenders, and remote community healthcare outreach.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton label="Export Strategy Dossier" />
        </div>
      </div>

      {/* Strategic Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-medium">Government Tender Pipeline</p>
          <p className="text-2xl font-bold text-navy-950 font-sans">{EXECUTIVE_STRATEGY_KPI.quarterlyTenderPipeline}</p>
          <p className="text-[11px] text-slate-500">Active regional RFPs</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-medium">Tenders Secured (Won)</p>
          <p className="text-2xl font-bold text-navy-950 font-sans">{EXECUTIVE_STRATEGY_KPI.tendersWon}</p>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 86.9% Win Rate in Assam
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-medium">Active Doctor Prescriptions</p>
          <p className="text-2xl font-bold text-navy-950 font-sans">{EXECUTIVE_STRATEGY_KPI.activePrescriptionsAssam}</p>
          <p className="text-[11px] text-slate-500">Across 48 field MR territories</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-medium">Doctor Advocacy Share</p>
          <p className="text-2xl font-bold text-navy-950 font-sans">{EXECUTIVE_STRATEGY_KPI.doctorAdvocacyShare}</p>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> #1 in Paracetamol 650mg
          </p>
        </div>
      </div>

      {/* Strategic Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center font-bold text-sm">
            01
          </div>
          <h3 className="text-sm font-bold text-navy-950 font-sans">Tea Garden Hospital Network</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-light">
            Deploying dedicated cold-chain replenishment to 80+ tea garden health centers in Dibrugarh, Tinsukia, and Golaghat to eliminate seasonal stockouts during monsoon months.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
            02
          </div>
          <h3 className="text-sm font-bold text-navy-950 font-sans">Rani cGMP Plant Capacity Doubling</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-light">
            Commissioning Line 3 at Rani facility to increase oral solid tablet capacity by 40% and support expansion into neighboring states of Meghalaya and Tripura.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-sm">
            03
          </div>
          <h3 className="text-sm font-bold text-navy-950 font-sans">Automated AI Inventory Replication</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-light">
            Publishing NESFIC-I-09 pilot outcomes with healthcare authorities to establish Dhanuka Group's demand forecasting framework as a regional standard.
          </p>
        </div>
      </div>

    </div>
  );
}
