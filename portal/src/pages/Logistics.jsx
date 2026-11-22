import React, { useState, useMemo } from 'react';
import {
  Truck,
  MapPin,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  Phone,
  Compass,
  RotateCcw,
  Building2,
  Plus,
  RefreshCw
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Select from '../components/common/Select';
import { MOCK_CORRIDORS, MOCK_IN_TRANSIT_SHIPMENTS } from '../data/mockLogistics';
import { formatCurrency } from '../utils/formatters';
import { usePersistentState } from '../hooks/usePersistentState';
import { useToast } from '../hooks/useToast';
import { STORAGE_KEYS } from '../services/grdDataService';

export default function Logistics() {
  const { toast } = useToast();
  const [rawShipments, setRawShipments] = usePersistentState(STORAGE_KEYS.LOGISTICS_SHIPMENTS, MOCK_IN_TRANSIT_SHIPMENTS);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [formTrackingNo, setFormTrackingNo] = useState(`TRK-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [formTransporter, setFormTransporter] = useState('Brahmaputra Fast Freight');
  const [formVehicle, setFormVehicle] = useState('AS-01-GC-9284');
  const [formDriver, setFormDriver] = useState('Bikash Talukdar');
  const [formPhone, setFormPhone] = useState('+91 94351 90812');
  const [formOrigin, setFormOrigin] = useState('Guwahati Central Depot');
  const [formDest, setFormDest] = useState('Silchar Regional Depot');
  const [formCargo, setFormCargo] = useState('DoloGRD-650 & CofGRD Winter Flu Buffer (12,000 Packs)');
  const [formValue, setFormValue] = useState(480000);
  const [formEta, setFormEta] = useState('Tomorrow 07:00 AM');
  const [formTempMode, setFormTempMode] = useState('Ambient Ventilated (15-25°C)');

  const handleCreateShipment = (e) => {
    e.preventDefault();
    const newShipment = {
      id: `SHP-${Date.now()}`,
      trackingNumber: formTrackingNo.trim() || `TRK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      transporterName: formTransporter,
      vehicleNumber: formVehicle.trim().toUpperCase(),
      driverName: formDriver,
      driverPhone: formPhone,
      originDepot: formOrigin,
      destinationDepot: formDest,
      cargoSummary: formCargo,
      cargoValueINR: Number(formValue),
      estimatedDelivery: formEta,
      currentLocationLandmark: `${formOrigin} — Dock Departure Cleared`,
      delayFactorReason: '',
      status: 'On Schedule',
      temperatureStatus: formTempMode.includes('Cold') ? 'Active +4.2°C Cold Chain' : 'Ambient Monitored',
      dispatchedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    };

    setRawShipments(prev => [newShipment, ...prev]);
    setIsDispatchModalOpen(false);
    toast.success(`Consignment ${newShipment.trackingNumber} dispatched via ${formTransporter} to ${formDest}! Live GPS tracking initiated.`);
    setFormTrackingNo(`TRK-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  };
  const [activeTab, setActiveTab] = useState('shipments'); // 'shipments' | 'corridors'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [destinationFilter, setDestinationFilter] = useState('All');
  const [corridorRiskFilter, setCorridorRiskFilter] = useState('All');
  const [corridorSearch, setCorridorSearch] = useState('');
  const [selectedDriverShipment, setSelectedDriverShipment] = useState(null);

  const hasActiveShipmentFilters = searchQuery.trim() !== '' || 
    statusFilter !== 'All' || 
    destinationFilter !== 'All';

  const resetShipmentFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setDestinationFilter('All');
  };

  const hasActiveCorridorFilters = corridorSearch.trim() !== '' || corridorRiskFilter !== 'All';

  const resetCorridorFilters = () => {
    setCorridorSearch('');
    setCorridorRiskFilter('All');
  };

  // Normalize shipments so all field names are robustly supported
  const shipments = useMemo(() => 
    rawShipments.map(s => ({
      ...s,
      cargoValueINR: s.cargoValueINR || s.shipmentValueINR || 250000,
      cargoSummary: s.cargoSummary || s.cargoDescription || 'Pharmaceutical consignment',
      originDepot: s.originDepot || s.origin || 'Guwahati Central Depot',
      destinationDepot: s.destinationDepot || s.destination || 'Regional Depot',
      estimatedDelivery: s.estimatedDelivery || s.estimatedArrival || 'On Schedule',
      currentLocationLandmark: s.currentLocationLandmark || s.currentLocation || 'In Transit',
      delayFactorReason: s.delayFactorReason || s.delayReason || '',
      driverName: s.driverName || 'Designated Fleet Captain',
      driverPhone: s.driverPhone || '+91 94351 90812'
    })), [rawShipments]);

  const corridors = useMemo(() =>
    MOCK_CORRIDORS.map(c => ({
      ...c,
      typicalTransitHours: c.typicalTransitHours || Math.round(c.currentAvgTransitDays * 24),
      monsoonDelayRisk: c.monsoonDelayRisk || (c.riskLevel.includes('Critical') ? 'Critical' : c.riskLevel.includes('High') ? 'High' : 'Normal'),
      recommendedSafetyStockBufferDays: c.recommendedSafetyStockBufferDays || (c.riskLevel.includes('High') ? 3 : c.riskLevel.includes('Critical') ? 4 : 1),
      status: c.status || c.roadCondition || 'Normal Flow',
      highwayCode: c.highwayCode || (c.name.match(/\(([^)]+)\)/)?.[1] || 'NH-27'),
      distanceKm: c.distanceKm || 350
    })), []);

  const filteredShipments = shipments.filter((s) => {
    const matchSearch = s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.transporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.destinationDepot.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStat = statusFilter === 'All' || s.status.includes(statusFilter);
    const matchDest = destinationFilter === 'All' || s.destinationDepot.includes(destinationFilter);
    return matchSearch && matchStat && matchDest;
  });

  const filteredCorridors = corridors.filter(c => {
    const matchSearch = !corridorSearch ||
      c.name.toLowerCase().includes(corridorSearch.toLowerCase()) ||
      c.origin.toLowerCase().includes(corridorSearch.toLowerCase()) ||
      c.destination.toLowerCase().includes(corridorSearch.toLowerCase()) ||
      c.highwayCode.toLowerCase().includes(corridorSearch.toLowerCase());
    
    const matchRisk = corridorRiskFilter === 'All' || c.riskLevel.includes(corridorRiskFilter);
    return matchSearch && matchRisk;
  });

  const delayedCount = shipments.filter(s => s.status.includes('Delayed') || s.status.includes('Delay')).length;
  const totalCargoValue = shipments.reduce((a, s) => a + s.cargoValueINR, 0);

  const shipmentColumns = [
    {
      header: 'Tracking # & Transporter',
      accessor: 'trackingNumber',
      className: 'whitespace-nowrap min-w-[140px]',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-navy-950 text-xs whitespace-nowrap">{row.trackingNumber}</span>
          <div className="font-semibold text-slate-800 text-xs whitespace-nowrap">{row.transporterName}</div>
          <span className="text-2xs font-mono text-slate-400 whitespace-nowrap">{row.vehicleNumber}</span>
        </div>
      )
    },
    {
      header: 'Route & Destination',
      accessor: 'destinationDepot',
      render: (row) => (
        <div className="text-xs">
          <div className="text-slate-500 text-2xs font-medium">From: {row.originDepot}</div>
          <div className="font-bold text-navy-950 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
            <span>{row.destinationDepot}</span>
          </div>
          <span className="text-2xs text-slate-400">ETA: {row.estimatedDelivery}</span>
        </div>
      )
    },
    {
      header: 'Cargo & Value',
      accessor: 'cargoValueINR',
      sortValue: (row) => row.cargoValueINR,
      render: (row) => (
        <div className="font-sans">
          <span className="font-bold text-navy-950 text-xs">{formatCurrency(row.cargoValueINR)}</span>
          <div className="text-2xs text-slate-500 font-sans mt-0.5 leading-snug">{row.cargoSummary}</div>
        </div>
      )
    },
    {
      header: 'Current GPS Landmark',
      accessor: 'currentLocationLandmark',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
          <Compass className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>{row.currentLocationLandmark}</span>
        </div>
      )
    },
    {
      header: 'Status & Delay Reason',
      accessor: 'status',
      render: (row) => (
        <div>
          <Badge variant={row.status.includes('Delayed') ? 'danger' : 'info'}>
            {row.status}
          </Badge>
          {row.delayFactorReason && (
            <div className="text-3xs text-rose-700 font-semibold mt-1 max-w-[260px] leading-tight">
              {row.delayFactorReason}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Driver Desk',
      align: 'center',
      sortable: false,
      className: 'whitespace-nowrap',
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-center">
          <Button 
            variant="outline" 
            size="xs"
            onClick={() => setSelectedDriverShipment(row)}
            icon={Phone}
          >
            Contact
          </Button>
        </div>
      )
    }
  ];

  const corridorColumns = [
    {
      header: 'Highway Corridor & NH #',
      accessor: 'name',
      render: (row) => (
        <div>
          <span className="font-bold text-navy-950 text-xs">{row.name}</span>
          <div className="text-2xs font-sans font-bold text-terracotta-700">{row.highwayCode} • {row.distanceKm} km</div>
        </div>
      )
    },
    {
      header: 'Corridor Route',
      accessor: 'origin',
      render: (row) => (
        <span className="text-xs text-slate-700">{row.origin} ➔ {row.destination}</span>
      )
    },
    {
      header: 'Avg Transit Time',
      accessor: 'typicalTransitHours',
      align: 'center',
      className: 'whitespace-nowrap',
      sortValue: (row) => row.typicalTransitHours,
      render: (row) => (
        <div className="text-center font-sans text-xs">
          <span className="font-bold text-navy-950">{row.typicalTransitHours} Hours</span>
          <div className="text-2xs text-slate-400">({(row.typicalTransitHours / 24).toFixed(1)} Days)</div>
        </div>
      )
    },
    {
      header: 'Monsoon Delay Risk',
      accessor: 'monsoonDelayRisk',
      render: (row) => (
        <Badge variant={row.monsoonDelayRisk === 'Critical' ? 'danger' : row.monsoonDelayRisk === 'High' ? 'warning' : 'success'}>
          {row.monsoonDelayRisk} Risk
        </Badge>
      )
    },
    {
      header: 'Dynamic Buffer Added',
      accessor: 'recommendedSafetyStockBufferDays',
      align: 'center',
      className: 'whitespace-nowrap',
      sortValue: (row) => row.recommendedSafetyStockBufferDays,
      render: (row) => (
        <div className="text-center font-sans font-bold text-xs text-terracotta-700">
          +{row.recommendedSafetyStockBufferDays} Days Buffer
        </div>
      )
    },
    {
      header: 'Corridor Traffic Flow',
      accessor: 'status',
      render: (row) => (
        <Badge variant={row.status.includes('Normal') ? 'success' : row.status.includes('Minor') ? 'warning' : 'danger'}>
          {row.status}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans font-bold text-2xl text-navy-950">
              Transit &amp; Logistics Tracking
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              Live GPS &amp; Delivery
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
            Track live medicine delivery trucks, road conditions on NH-27 / NH-6, and delivery times across Northeast states.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            icon={Plus}
            onClick={() => setIsDispatchModalOpen(true)}
            className="bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs shadow-sm cursor-pointer whitespace-nowrap"
          >
            Dispatch Consignment
          </Button>
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('shipments')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'shipments' ? 'bg-white text-navy-950 shadow-2xs font-bold' : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Live Delivery Trucks ({MOCK_IN_TRANSIT_SHIPMENTS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('corridors')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'corridors' ? 'bg-white text-navy-950 shadow-2xs font-bold' : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Highway Corridors ({MOCK_CORRIDORS.length})
          </button>
        </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Active Consignments"
          value={`${MOCK_IN_TRANSIT_SHIPMENTS.length} Highway Trucks`}
          subtitle={`Cargo Value: ${formatCurrency(totalCargoValue)}`}
          icon={Truck}
          badge={{ text: 'GPS Tracked', variant: 'info' }}
        />
        <StatCard
          title="Delayed Shipments"
          value={`${delayedCount} Shipments`}
          subtitle="NH-6 & NH-29 hill terrain alerts"
          icon={AlertTriangle}
          badge={{ text: 'High Alert', variant: 'danger' }}
        />
        <StatCard
          title="Average NE Transit Time"
          value="3.8 Days"
          subtitle="Network average lead time"
          icon={Clock}
          trend={{ direction: 'down', text: '-0.6d vs Baseline', isGood: true }}
          badge={{ text: 'Buffer Optimized', variant: 'success' }}
        />
        <StatCard
          title="Corridor Health Index"
          value="84.2%"
          subtitle="4 of 6 corridors clear flow"
          icon={CheckCircle2}
          badge={{ text: 'Winter Routing', variant: 'neutral' }}
        />
      </div>

      {/* TAB 1: SHIPMENTS */}
      {activeTab === 'shipments' && (
        <div className="space-y-4">
          <div className="card p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <Select
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
                options={[
                  { value: 'All', label: 'All Consignment States' },
                  { value: 'In Transit', label: 'In Transit (Normal)' },
                  { value: 'Delayed', label: 'Delayed / Blocked' }
                ]}
                icon={Filter}
              />

              <Select
                value={destinationFilter}
                onChange={(val) => setDestinationFilter(val)}
                options={[
                  { value: 'All', label: 'All Regional Depots' },
                  { value: 'Silchar', label: 'Silchar C&F Depot' },
                  { value: 'Dibrugarh', label: 'Dibrugarh Regional Depot' },
                  { value: 'Shillong', label: 'Shillong Meghalaya C&F' },
                  { value: 'Imphal', label: 'Imphal Valley Hub' },
                  { value: 'Agartala', label: 'Agartala Regional Depot' }
                ]}
                icon={Building2}
              />

              {hasActiveShipmentFilters && (
                <button
                  type="button"
                  onClick={resetShipmentFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                  title="Reset all shipment filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tracking #, vehicle, or cargo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-9 py-1.5 text-xs w-full"
                />
              </div>
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:inline">
                Showing {filteredShipments.length} of {shipments.length}
              </span>
            </div>
          </div>

          <Table 
            title="Active Delivery Trucks & Shipments"
            subtitle="Real-time GPS tracking and transit status across Northeast routes"
            columns={shipmentColumns}
            data={filteredShipments}
            keyExtractor={(row) => row.id}
            exportFilename="grd_live_shipments_telematics"
            pageSize={10}
            showPagination={true}
          />
        </div>
      )}

      {/* TAB 2: CORRIDORS */}
      {activeTab === 'corridors' && (
        <div className="space-y-4">
          <div className="card p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <Select
                value={corridorRiskFilter}
                onChange={(val) => setCorridorRiskFilter(val)}
                options={[
                  { value: 'All', label: 'All Corridor Risk Levels' },
                  { value: 'Normal', label: 'Normal Flow (Clear)' },
                  { value: 'High', label: 'High Delay Risk (Monsoon / Ghat)' },
                  { value: 'Critical', label: 'Critical Blockage Alert' }
                ]}
                icon={AlertTriangle}
              />

              {hasActiveCorridorFilters && (
                <button
                  type="button"
                  onClick={resetCorridorFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                  title="Reset corridor filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search corridor name, highway, or depot..."
                  value={corridorSearch}
                  onChange={(e) => setCorridorSearch(e.target.value)}
                  className="input pl-9 py-1.5 text-xs w-full"
                />
              </div>
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:inline">
                Showing {filteredCorridors.length} of {corridors.length}
              </span>
            </div>
          </div>

          <Table 
            title="Northeast Highway Corridors & Transit Times"
            subtitle="Key transit routes, weather delay risks, and dynamic safety buffer recommendations"
            columns={corridorColumns}
            data={filteredCorridors}
            keyExtractor={(row) => row.id}
            exportFilename="grd_northeast_highway_corridors"
            pageSize={10}
            showPagination={true}
          />
        </div>
      )}

      
      {/* Dispatch New Consignment Modal */}
      {isDispatchModalOpen && (
        <Modal
          isOpen={isDispatchModalOpen}
          onClose={() => setIsDispatchModalOpen(false)}
          title="Dispatch New Medicine Consignment"
          subtitle="Authorize transport fleet dispatch and initiate satellite GPS telematics across Northeast transit corridors"
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleCreateShipment} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-2xs font-bold text-slate-600 uppercase tracking-wider">
                    Tracking Waybill # *
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormTrackingNo(`TRK-2026-${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="text-2xs font-semibold text-terracotta-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Auto-ID
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formTrackingNo}
                  onChange={(e) => setFormTrackingNo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Transporter Partner *
                </label>
                <select
                  value={formTransporter}
                  onChange={(e) => setFormTransporter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  <option value="Brahmaputra Fast Freight">Brahmaputra Fast Freight (Dedicated Fleet)</option>
                  <option value="Northeast Cold Chain Logistics">Northeast Cold Chain Logistics (Reefer)</option>
                  <option value="Barak Express Logistics">Barak Express Logistics (Silchar Highway)</option>
                  <option value="Khasi Hills Cargo Direct">Khasi Hills Cargo Direct (Shillong)</option>
                  <option value="Tripura Frontier Transport">Tripura Frontier Transport (Agartala NH-8)</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Vehicle Number (Vahan Reg) *
                </label>
                <input
                  type="text"
                  required
                  value={formVehicle}
                  onChange={(e) => setFormVehicle(e.target.value)}
                  placeholder="e.g. AS-01-GC-9284"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Driver Name & Phone *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={formDriver}
                    onChange={(e) => setFormDriver(e.target.value)}
                    placeholder="Driver name"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  />
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+91 94351 ..."
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Dispatch Origin Depot *
                </label>
                <select
                  value={formOrigin}
                  onChange={(e) => setFormOrigin(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  <option value="Guwahati Central Depot">Guwahati Central Depot (Mother Hub)</option>
                  <option value="Rani Formulation Plant">Rani Formulation Plant (Kamrup)</option>
                  <option value="Tezpur Regional Buffer Hub">Tezpur Regional Buffer Hub</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Destination Receiving Depot *
                </label>
                <select
                  value={formDest}
                  onChange={(e) => setFormDest(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  <option value="Silchar Regional Depot">Silchar Regional Depot (Barak Valley)</option>
                  <option value="Agartala Central Medical Store">Agartala Central Medical Store (Tripura)</option>
                  <option value="Shillong Civil Depot">Shillong Civil Depot (East Khasi Hills)</option>
                  <option value="Dimapur Transit Hub">Dimapur Transit Hub (Nagaland)</option>
                  <option value="Imphal Regional Depot">Imphal Regional Depot (Manipur)</option>
                  <option value="Aizawl Civil Medical Depot">Aizawl Civil Medical Depot (Mizoram)</option>
                  <option value="Dibrugarh Regional Depot">Dibrugarh Regional Depot (Upper Assam)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Cargo Description & Quantity *
                </label>
                <input
                  type="text"
                  required
                  value={formCargo}
                  onChange={(e) => setFormCargo(e.target.value)}
                  placeholder="e.g. DoloGRD-650 & CofGRD Winter Flu Buffer (12,000 Packs)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Consignment Cargo Value (INR) *
                </label>
                <input
                  type="number"
                  min="10000"
                  step="5000"
                  required
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Estimated Delivery (ETA) *
                </label>
                <input
                  type="text"
                  required
                  value={formEta}
                  onChange={(e) => setFormEta(e.target.value)}
                  placeholder="e.g. Tomorrow 07:00 AM"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Cold Chain / Storage Protocol *
                </label>
                <select
                  value={formTempMode}
                  onChange={(e) => setFormTempMode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  <option value="Ambient Ventilated (15-25°C)">Ambient Ventilated (15-25°C)</option>
                  <option value="Cold Chain Reefer (+2 to +8°C)">Cold Chain Reefer (+2 to +8°C Live GPS Sensor)</option>
                  <option value="Controlled Dry Pharma Cargo">Controlled Dry Pharma Cargo</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDispatchModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-navy-900 hover:bg-navy-950 text-white font-bold shadow-sm cursor-pointer">
                Authorize Dispatch &amp; Track
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Contact Driver Modal */}
      <Modal
        isOpen={!!selectedDriverShipment}
        onClose={() => setSelectedDriverShipment(null)}
        title="Driver Telematics & Direct Line"
        size="sm"
      >
        {selectedDriverShipment && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
              <div className="font-bold text-navy-950 text-sm">{selectedDriverShipment.driverName}</div>
              <div className="text-slate-600 font-sans">Vehicle: {selectedDriverShipment.vehicleNumber}</div>
              <div className="text-slate-600">Carrier: {selectedDriverShipment.transporterName}</div>
              <div className="text-slate-600">Last GPS Fix: <strong>{selectedDriverShipment.currentLocationLandmark}</strong></div>
            </div>

            <div className="pt-2 space-y-2">
              <a
                href={`tel:${selectedDriverShipment.driverPhone}`}
                className="w-full py-2.5 rounded-xl bg-navy-900 hover:bg-navy-950 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Driver: {selectedDriverShipment.driverPhone}</span>
              </a>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setSelectedDriverShipment(null)}
              >
                Close Desk
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
