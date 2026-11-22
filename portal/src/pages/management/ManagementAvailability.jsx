import React, { useState } from 'react';
import { CheckCircle2, Search } from 'lucide-react';
import Table from '../../components/common/Table';
import ExportButton from '../../components/common/ExportButton';
import { NORTHEAST_STATE_AVAILABILITY } from '../../data/mockManagementData';
import { formatNumber } from '../../utils/formatters';

export default function ManagementAvailability() {
  const [states] = useState(NORTHEAST_STATE_AVAILABILITY);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStates = states.filter(s => 
    s.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.regionalHub.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: 'Northeast State & Hub',
      accessor: 'state',
      render: (row) => (
        <div>
          <span className="font-bold text-xs text-navy-950 font-sans">
            {row.state}
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">{row.regionalHub}</p>
        </div>
      )
    },
    {
      header: 'Hospitals Served',
      accessor: 'hospitalsCovered',
      render: (row) => (
        <div>
          <span className="text-xs font-bold text-navy-900">{row.hospitalsCovered} Hospitals</span>
          <p className="text-[10px] text-slate-400">Civil &amp; District Centers</p>
        </div>
      )
    },
    {
      header: 'Availability Index',
      accessor: 'availabilityScore',
      render: (row) => (
        <div>
          <span className="text-sm font-bold text-emerald-700 font-sans">
            {row.availabilityScore}%
          </span>
          <div className="w-24 bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
            <div 
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${row.availabilityScore}%` }}
            />
          </div>
        </div>
      )
    },
    {
      header: 'Safety Stock Cover',
      accessor: 'stockDaysCover',
      render: (row) => (
        <div>
          <span className="text-xs font-semibold text-slate-800">{row.stockDaysCover} Days</span>
          <p className="text-[10px] text-slate-400">Zero Critical Stockouts</p>
        </div>
      )
    },
    {
      header: 'Monthly Demand',
      accessor: 'monthlyDemandUnits',
      render: (row) => (
        <div>
          <span className="text-xs font-bold text-slate-900">{formatNumber(row.monthlyDemandUnits)} packs</span>
          <p className="text-[10px] text-slate-400">Capital: {row.capitalInvested}</p>
        </div>
      )
    },
    {
      header: 'Supply Status',
      accessor: 'status',
      render: (row) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          {row.status}
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
              Northeast State-by-State Medicine Availability
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              8 States Monitored
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Essential medicines availability index across all Northeast government and private health facilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton label="Export Availability Register" data={NORTHEAST_STATE_AVAILABILITY} filename="northeast_availability_register" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search state or regional hub..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9 py-1.5 text-xs w-full"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Regional Average Availability: <strong className="text-navy-950">98.2%</strong>
        </span>
      </div>

      {/* Table */}
      <Table
        title="State Healthcare Availability Index"
        subtitle="Stock buffer and coverage metrics across Assam and the Seven Sister states"
        columns={columns}
        data={filteredStates}
        keyExtractor={(row) => row.state}
      />

    </div>
  );
}
