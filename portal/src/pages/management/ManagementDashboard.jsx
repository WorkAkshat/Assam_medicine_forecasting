import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  DollarSign,
  Award,
  Hospital
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import ExportButton from '../../components/common/ExportButton';
import { NORTHEAST_STATE_AVAILABILITY, WORKING_CAPITAL_OPTIMIZATION, PILOT_GOVERNANCE_MILESTONES } from '../../data/mockManagementData';
import { formatNumber } from '../../utils/formatters';

export default function ManagementDashboard() {

  return (
    <div className="space-y-6">
      
      {/* Executive Boardroom Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-navy-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-56 h-56 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-terracotta-500/20 text-terracotta-300 border border-terracotta-400/30">
                Guwahati Corporate HQ &bull; Dhanuka Complex
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                NESFIC-I-09 Pilot Governance
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-white mt-1">
              Executive Briefing: Gautam R. Dhanuka
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl leading-relaxed">
              Managing Director overview of essential medicine availability across all 8 Northeast states, working capital efficiency, and Dhanuka Group healthcare impact.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 border border-emerald-400/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-300 font-medium">NE Availability Index</p>
              <p className="text-xl font-bold text-white leading-tight font-sans">98.2%</p>
              <p className="text-[10px] text-emerald-300 font-medium">+26.8% over baseline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic KPI Grid (Plain Language & Clean Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Overall Medicine Availability"
          value="98.2%"
          subtitle="Across all 8 Northeast states"
          icon={Award}
          trend={{ direction: 'up', text: '+26.8% vs Pre-Pilot' }}
          badge={{ text: 'Target Met', variant: 'success' }}
        />

        <StatCard
          title="Working Capital Saved"
          value="₹48.5 Lakhs"
          subtitle="Liberated from slow-moving stock"
          icon={DollarSign}
          trend={{ direction: 'up', text: '-57.7% dead stock' }}
          badge={{ text: 'Capital Optimized', variant: 'success' }}
        />

        <StatCard
          title="Hospitals & Civil Stores"
          value="148 Units"
          subtitle="Supplied on time across region"
          icon={Hospital}
          trend={{ direction: 'up', text: '100% NLEM compliance' }}
          badge={{ text: 'Full Coverage', variant: 'info' }}
        />

        <StatCard
          title="Institutional Tender Win Rate"
          value="86.9%"
          subtitle="₹3.65 Cr won in 2026"
          icon={TrendingUp}
          trend={{ direction: 'up', text: '#1 in Assam Antipyretics' }}
          badge={{ text: 'Market Leader', variant: 'success' }}
        />
      </div>

      {/* Northeast 8-State Availability Scorecard */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-sans text-navy-950">
                Northeast 8-State Availability Scorecard
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-50 text-navy-800 border border-navy-200">
                Regional Index: 98.2%
              </span>
            </div>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Live medicine stock cover and availability percentages across Northeast state health directorates.
            </p>
          </div>

          <ExportButton label="Export State Scorecard" data={NORTHEAST_STATE_AVAILABILITY} filename="northeast_state_availability" />
        </div>

        {/* State Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {NORTHEAST_STATE_AVAILABILITY.map((st) => (
            <div 
              key={st.state}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-navy-950 font-sans">{st.state}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {st.status}
                </span>
              </div>

              <div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-500">Availability</span>
                  <span className="font-bold text-navy-950 text-sm font-sans">{st.availabilityScore}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${st.availabilityScore}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                <div className="flex justify-between">
                  <span>Hospitals Served:</span>
                  <strong className="text-slate-800">{st.hospitalsCovered} Hospitals</strong>
                </div>
                <div className="flex justify-between">
                  <span>Stock Buffer:</span>
                  <strong className="text-slate-800">{st.stockDaysCover} Days Cover</strong>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Demand:</span>
                  <strong className="text-slate-800">{formatNumber(st.monthlyDemandUnits)} packs</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Section: Working Capital ROI & Pilot Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Working Capital Optimization Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm sm:text-base font-bold font-sans text-navy-950">
                Working Capital Optimization ROI
              </h3>
              <p className="text-xs text-slate-500 font-light">
                Direct financial savings achieved by automated demand forecasting and safety stock optimization.
              </p>
            </div>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="space-y-3">
            {WORKING_CAPITAL_OPTIMIZATION.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{item.category}</span>
                  <span className="font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {item.improvementPct} ({item.savingsAchieved})
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Baseline: <del className="text-slate-400">{item.prePilotAmount}</del></span>
                  <span>Current: <strong className="text-navy-950 font-bold">{item.currentAmount}</strong></span>
                </div>

                <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/50">
                  {item.impact}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* NESFIC-I-09 Pilot Governance Milestones */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm sm:text-base font-bold font-sans text-navy-950">
                NESFIC-I-09 Governance Roadmap
              </h3>
              <p className="text-xs text-slate-500 font-light">
                Research and operational rollout phases across Northeast regional facilities.
              </p>
            </div>
            <Building2 className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-3">
            {PILOT_GOVERNANCE_MILESTONES.map((m) => {
              const isDone = m.status.includes('Completed');

              return (
                <div key={m.id} className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-navy-950 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {m.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-800">{m.milestone}</p>
                  <p className="text-[11px] text-slate-500">{m.deliverables}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/50">
                    <span>Lead: <strong>{m.leadPartner}</strong></span>
                    <span>{m.completionDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
