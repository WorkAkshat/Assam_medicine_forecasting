import React, { useState } from 'react';
import { Target, ShieldCheck, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import ExportButton from '../components/common/ExportButton';
import {
  PILOT_METADATA,
  PILOT_KPIS,
  PILOT_TIMELINE_WEEKS,
  PILOT_MILESTONES
} from '../data/mockPilotData';

export default function PilotMonitoring() {
  const [activeTab, setActiveTab] = useState('kpis'); // 'kpis' | 'timeline' | 'milestones' | 'governance'

  return (
    <div className="space-y-6">
      
      {/* Header & Challenge Metadata */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans font-bold text-2xl text-navy-950">
              Assam Pilot &amp; NESFIC-I-09 Goals
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-sans font-bold bg-terracotta-100 text-terracotta-800 border border-terracotta-200">
              NESFIC-I-09
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            16-Week Pilot Deployment &amp; Impact Measurement for GR Dhanuka Group across Assam healthcare network.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ExportButton label="Export CSV" />
        </div>
      </div>

      {/* Pilot Overview Banner - Clean Light Theme */}
      <div className="portal-card p-5 bg-white border border-slate-200/90 text-slate-800 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-xs">
          
          <div className="space-y-1">
            <span className="text-2xs font-sans font-semibold text-slate-500">Pilot Timeline</span>
            <p className="text-lg font-bold text-navy-950 font-sans">
              Week {PILOT_METADATA.currentWeek} <span className="text-xs font-normal text-slate-500">/ 16 Weeks</span>
            </p>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
              <div 
                className="bg-terracotta-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${PILOT_METADATA.progressPercentage}%` }}
              />
            </div>
            <span className="text-[10px] text-terracotta-600 font-medium block">{PILOT_METADATA.progressPercentage}% Time Completed</span>
          </div>

          <div className="md:pl-4 space-y-1 pt-3 md:pt-0">
            <span className="text-2xs font-sans font-semibold text-slate-500">Geographic Coverage</span>
            <p className="font-bold text-navy-950">Assam Valley &amp; Barak Corridor</p>
            <p className="text-[11px] text-slate-500 font-light">
              Guwahati, Rani, Dibrugarh &amp; Silchar
            </p>
          </div>

          <div className="md:pl-4 space-y-1 pt-3 md:pt-0">
            <span className="text-2xs font-sans font-semibold text-slate-500">Pilot Scope</span>
            <p className="font-bold text-navy-950">{PILOT_METADATA.pilotSkusCount} Essential Medicines</p>
            <p className="text-[11px] text-slate-500 font-light">
              6 Certified Stockists &bull; 3 State Medical Colleges
            </p>
          </div>

          <div className="md:pl-4 space-y-1 pt-3 md:pt-0">
            <span className="text-2xs font-sans font-semibold text-slate-500">Governance &amp; Review</span>
            <p className="font-bold text-emerald-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Bi-Weekly Steering Committee</span>
            </p>
            <p className="text-[11px] text-slate-500 font-light">
              Next Review: Nov 25, 2026
            </p>
          </div>

        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('kpis')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeTab === 'kpis' ? 'bg-navy-900 text-white shadow-sm' : 'text-slate-600 hover:text-navy-900'
          }`}
        >
          5 Mandated Targets
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeTab === 'timeline' ? 'bg-navy-900 text-white shadow-sm' : 'text-slate-600 hover:text-navy-900'
          }`}
        >
          Weekly Progress Trends
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('milestones')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeTab === 'milestones' ? 'bg-navy-900 text-white shadow-sm' : 'text-slate-600 hover:text-navy-900'
          }`}
        >
          Phase Milestones
        </button>
      </div>

      {/* TAB 1: 5 MANDATED KPIS */}
      {activeTab === 'kpis' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PILOT_KPIS.map((kpi) => (
              <div key={kpi.id} className="portal-card p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                    <span className="font-sans text-[10px] font-bold text-terracotta-700 bg-terracotta-50 px-2 py-0.5 rounded-md">
                      {kpi.id}
                    </span>
                    <Badge status={kpi.targetStatus} />
                  </div>

                  <h3 className="font-sans font-bold text-base text-navy-950 mt-2 leading-snug">
                    {kpi.metric}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-light mt-0.5">
                    Target Requirement: <strong className="text-slate-700">{kpi.challengeTarget}</strong>
                  </p>
                </div>

                {/* Metric Comparative Grid */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Baseline</span>
                    <span className="font-semibold text-slate-700 text-xs sm:text-sm">
                      {kpi.baselineValue}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Target Goal</span>
                    <span className="font-semibold text-navy-900 text-xs sm:text-sm">
                      {kpi.targetGoalValue}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-600 block font-sans font-bold">Current Pilot</span>
                    <span className="font-bold text-emerald-700 text-xs sm:text-sm">
                      {kpi.currentActualValue}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 font-light bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                  {kpi.notes}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4 text-blue-700" />
              <span>Independent Validation &amp; Verification Protocol</span>
            </div>
            <p className="font-light text-blue-800 leading-relaxed">
              In accordance with NESFIC-I-09 guidelines, pilot results are measured against audited 12-month historical baselines (2025–2026). Pilot data is validated in field sessions across selected stockists in Guwahati, Dibrugarh, and Silchar. Final commercial scale-up decisions are evaluated upon Week 16 audit sign-off.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: WEEK-BY-WEEK TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="portal-card p-5 space-y-4">
          <div>
            <h3 className="font-sans font-bold text-base text-navy-950">
              Week-by-Week Improvement Trajectory
            </h3>
            <p className="text-xs text-slate-500 font-light">
              Measuring forecast accuracy, stockout incidence reduction, and service level (OTIF) across pilot weeks
            </p>
          </div>

          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={PILOT_TIMELINE_WEEKS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={{ stroke: '#CBD5E1' }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

                <Line 
                  type="monotone" 
                  dataKey="forecastAccuracy" 
                  name="Forecast Accuracy (%)" 
                  stroke="#1B365D" 
                  strokeWidth={2.5} 
                  dot={{ r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="serviceLevel" 
                  name="Order Fulfilment Service Level (OTIF %)" 
                  stroke="#C85A2E" 
                  strokeWidth={2.5} 
                  dot={{ r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="stockoutRate" 
                  name="Stock-Out Incidence (% of SKU-days)" 
                  stroke="#E11D48" 
                  strokeWidth={2} 
                  strokeDasharray="4 4"
                  dot={{ r: 3 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs pt-2 border-t border-slate-100">
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400">BASELINE ACCURACY</span>
              <p className="font-bold text-navy-950 text-sm">64.2%</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-emerald-600 font-bold">CURRENT ACCURACY</span>
              <p className="font-bold text-emerald-700 text-sm">79.4%</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400">BASELINE STOCKOUT</span>
              <p className="font-bold text-navy-950 text-sm">18.5%</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-emerald-600 font-bold">CURRENT STOCKOUT</span>
              <p className="font-bold text-emerald-700 text-sm">12.1%</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MILESTONES */}
      {activeTab === 'milestones' && (
        <div className="space-y-3">
          {PILOT_MILESTONES.map((ms) => (
            <div key={ms.id} className="portal-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge status={ms.status} />
                  <span className="text-xs font-sans text-slate-400">{ms.duration}</span>
                </div>
                <h4 className="font-sans font-bold text-base text-navy-950">{ms.name}</h4>
                <p className="text-xs text-slate-600 font-light max-w-2xl">{ms.deliverables}</p>
              </div>

              <div className="text-right text-xs shrink-0">
                <span className="text-[11px] text-slate-400 block">Milestone Target</span>
                <span className="font-semibold text-navy-950">{ms.completionDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
