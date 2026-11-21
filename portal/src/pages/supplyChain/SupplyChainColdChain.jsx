import React, { useState } from 'react';
import {
  ThermometerSnowflake,
  Truck,
  MapPin,
  Phone,
  CheckCircle2
} from 'lucide-react';
import Table from '../../components/common/Table';
import ExportButton from '../../components/common/ExportButton';
import { COLD_CHAIN_MONITORS } from '../../data/mockSupplyChainData';

export default function SupplyChainColdChain() {
  const [monitors, setMonitors] = useState(COLD_CHAIN_MONITORS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMonitors = monitors.filter(m => 
    m.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.skuLoaded.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: 'Refrigerated Vehicle',
      accessor: 'vehicleNo',
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-bold text-navy-950 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {row.vehicleNo}
          </span>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Truck className="w-3 h-3 text-slate-400" />
            Carrier Dedicated GPS
          </p>
        </div>
      )
    },
    {
      header: 'Route & Corridor',
      accessor: 'route',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900 text-xs">{row.route}</p>
          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-terracotta-500 shrink-0" />
            {row.gpsLocation}
          </p>
        </div>
      )
    },
    {
      header: 'Medicine Consignment',
      accessor: 'skuLoaded',
      render: (row) => (
        <span className="text-xs font-medium text-slate-800">
          {row.skuLoaded}
        </span>
      )
    },
    {
      header: 'Active Temperature',
      accessor: 'currentTemp',
      render: (row) => (
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-600" />
            {row.currentTemp}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">Target: {row.targetRange}</p>
        </div>
      )
    },
    {
      header: 'Telemetry & Safety',
      accessor: 'status',
      render: (row) => (
        <div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Temp Compliant
          </span>
          <p className="text-[10px] text-slate-400">Ping: {row.lastPing}</p>
        </div>
      )
    },
    {
      header: 'Driver & Comms',
      accessor: 'driverPhone',
      render: (row) => (
        <a 
          href={`tel:${row.driverPhone}`}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-navy-950 transition-colors"
        >
          <Phone className="w-3 h-3 text-slate-500" />
          {row.driverPhone}
        </a>
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
              Cold Chain &amp; Hill Transit Telemetry
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
              Live Sensor Feed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Continuous IoT temperature and GPS tracking for temperature-sensitive pharmaceuticals traversing Northeast highway corridors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton label="Export Transit Sensor Data" />
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-medium">Active Refrigerated Trucks</p>
          <p className="text-2xl font-bold text-navy-950 font-sans">{monitors.length} Active</p>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> All GPS links connected
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-medium">Temperature Compliance Rate</p>
          <p className="text-2xl font-bold text-navy-950 font-sans">99.1%</p>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Zero thermal excursions logged
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 font-medium">Monitored Routes</p>
          <p className="text-2xl font-bold text-navy-950 font-sans">NH-27, NH-6, NH-8</p>
          <p className="text-[11px] text-slate-500">Barak Valley, Meghalaya, Tripura</p>
        </div>
      </div>

      {/* Table */}
      <Table
        title="Live Truck Sensor Transmissions"
        subtitle="Real-time telematics from digital temperature data loggers inside insulated containers"
        columns={columns}
        data={filteredMonitors}
        keyExtractor={(row) => row.vehicleNo}
      />

    </div>
  );
}
