import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Truck,
  CheckCircle2,
  Search,
  Filter,
  Zap,
  MapPin
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Select from '../components/common/Select';
import { MOCK_INVENTORY_ITEMS, STATES } from '../data/mockInventory';
import { formatNumber } from '../utils/formatters';

export default function StockoutRisk() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [coverFilter, setCoverFilter] = useState('All'); // 'All', 'Critical', 'Warning', 'Low'
  const [emergencyModalItem, setEmergencyModalItem] = useState(null);
  const [emergencySuccess, setEmergencySuccess] = useState(false);
  const [sourceDepot, setSourceDepot] = useState('Guwahati Central Depot');
  const [transitCarrier, setTransitCarrier] = useState('Express Highway Corridor');

  // Filter items that have Stockout Risk or Low Stock
  const allRiskItems = MOCK_INVENTORY_ITEMS.filter(item => {
    return item.daysOfInventory <= 15 || item.status === 'Stockout Risk' || item.status === 'Low Stock';
  });

  const filteredItems = allRiskItems.filter(item => {
    const matchSearch = item.skuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.skuCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchState = selectedState === 'All States' || item.state === selectedState;
    
    let matchCover = true;
    if (coverFilter === 'Critical') matchCover = item.daysOfInventory <= 3;
    else if (coverFilter === 'Warning') matchCover = item.daysOfInventory > 3 && item.daysOfInventory <= 7;
    else if (coverFilter === 'Low') matchCover = item.daysOfInventory > 7 && item.daysOfInventory <= 15;

    return matchSearch && matchState && matchCover;
  });

  const criticalCount = allRiskItems.filter(i => i.daysOfInventory <= 3).length;
  const warningCount = allRiskItems.filter(i => i.daysOfInventory > 3 && i.daysOfInventory <= 7).length;
  const inTransitCount = allRiskItems.filter(i => i.inTransit > 0).length;

  const handleEmergencyDispatch = (e) => {
    e.preventDefault();
    setEmergencySuccess(true);
    setTimeout(() => {
      setEmergencySuccess(false);
      setEmergencyModalItem(null);
    }, 1200);
  };

  const columns = [
    {
      header: 'Medicine Name',
      accessor: 'skuCode',
      render: (row) => (
        <div>
          <span className="font-sans font-bold text-navy-950 text-xs">{row.skuCode}</span>
          <div className="font-semibold text-navy-900 text-xs truncate max-w-[200px]">{row.skuName}</div>
          <span className="text-2xs text-slate-400">{row.category}</span>
        </div>
      )
    },
    {
      header: 'Warehouse / Location',
      accessor: 'locationName',
      render: (row) => (
        <div className="text-xs">
          <div className="flex items-center gap-1 font-semibold text-slate-900">
            <MapPin className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
            <span>{row.locationName}</span>
          </div>
          <span className="text-2xs text-slate-500 pl-4">{row.state}</span>
        </div>
      )
    },
    {
      header: 'Days Left',
      accessor: 'daysOfInventory',
      className: 'whitespace-nowrap min-w-[120px] text-center',
      sortValue: (row) => row.daysOfInventory,
      render: (row) => {
        const isCrit = row.daysOfInventory <= 3;
        const isWarn = row.daysOfInventory > 3 && row.daysOfInventory <= 7;
        return (
          <div className="text-center">
            <span className={`inline-block px-2.5 py-0.5 rounded-full font-sans font-bold text-xs whitespace-nowrap border ${
              isCrit ? 'bg-rose-100 text-rose-800 border-rose-200' :
              isWarn ? 'bg-amber-100 text-amber-800 border-amber-200' :
              'bg-blue-100 text-blue-800 border-blue-200'
            }`}>
              {row.daysOfInventory} Days Left
            </span>
          </div>
        );
      }
    },
    {
      header: 'Current Stock',
      accessor: 'available',
      sortValue: (row) => row.available,
      render: (row) => (
        <div className="text-right font-sans">
          <span className="font-bold text-rose-700 text-xs">{formatNumber(row.available)}</span>
          <div className="text-2xs text-slate-400">Reserved: {formatNumber(row.reserved)}</div>
        </div>
      )
    },
    {
      header: 'Stock on the Way',
      accessor: 'inTransit',
      sortValue: (row) => row.inTransit,
      render: (row) => (
        <div className="text-right font-sans">
          <span className={`text-xs font-semibold ${row.inTransit > 0 ? 'text-blue-700' : 'text-slate-400'}`}>
            {row.inTransit > 0 ? `+${formatNumber(row.inTransit)}` : '-'}
          </span>
          <div className="text-2xs text-slate-400">{row.inTransit > 0 ? 'En route' : 'No incoming stock'}</div>
        </div>
      )
    },
    {
      header: 'Urgency',
      render: (row) => (
        <Badge variant={row.daysOfInventory <= 3 ? 'danger' : row.daysOfInventory <= 7 ? 'warning' : 'info'}>
          {row.daysOfInventory <= 3 ? 'Critical' : row.daysOfInventory <= 7 ? 'Warning' : 'Low Buffer'}
        </Badge>
      )
    },
    {
      header: 'Action',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-center">
          <Button 
            variant={row.daysOfInventory <= 3 ? 'primary' : 'outline'}
            size="xs"
            onClick={() => setEmergencyModalItem(row)}
            icon={Zap}
          >
            Dispatch Stock
          </Button>
        </div>
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
              Stockout Risk Alerts
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
              Low Stock Warnings
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
            Identify which hospitals and warehouses are running out of medicine, so you can dispatch stock before shortages happen.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Critical Low Stock (<3 Days)"
          value={`${criticalCount} Depots`}
          subtitle="Urgent restocking needed"
          icon={ShieldAlert}
          trend={{ direction: 'down', text: '-67% risk vs baseline', isGood: true }}
          badge={{ text: 'Needs Restock', variant: 'danger' }}
        />
        <StatCard
          title="Low Stock Watch (4-7 Days)"
          value={`${warningCount} Depot`}
          subtitle="Buffer safe, order planned"
          icon={AlertTriangle}
          trend={{ direction: 'neutral', text: 'Buffer maintained' }}
          badge={{ text: 'Monitoring', variant: 'warning' }}
        />
        <StatCard
          title="Medicines on the Way"
          value={`${inTransitCount} Shipments`}
          subtitle="Currently on delivery trucks"
          icon={Truck}
          trend={{ direction: 'up', text: '+4 Active Trucks' }}
          badge={{ text: 'On Road', variant: 'info' }}
        />
        <StatCard
          title="Orders Fully Delivered"
          value="96.8%"
          subtitle="Hospitals received full order"
          icon={CheckCircle2}
          trend={{ direction: 'up', text: '+12.6% over baseline' }}
          badge={{ text: 'Target Met', variant: 'success' }}
        />
      </div>

      {/* Filter Toolbar */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Select
              value={selectedState}
              onChange={(val) => setSelectedState(val)}
              options={STATES}
              icon={MapPin}
            />

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Risk Window:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                {[
                  { id: 'All', label: 'All Risks' },
                  { id: 'Critical', label: '<3 Days (Critical)' },
                  { id: 'Warning', label: '4-7 Days' },
                  { id: 'Low', label: '8-15 Days' }
                ].map(b => (
                  <button
                    key={b.id}
                    onClick={() => setCoverFilter(b.id)}
                    className={`px-2 py-1 rounded text-2xs font-semibold transition-all ${
                      coverFilter === b.id ? 'bg-white text-navy-950 shadow-2xs' : 'text-slate-600 hover:text-navy-900'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search SKU or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 py-1.5 text-xs w-full"
            />
          </div>
        </div>
      </div>

      {/* Paginated, Sortable Table */}
      <Table 
        title="Priority Restocking & Stockout Warnings"
        subtitle="Hospitals and regional depots with low stock cover needing emergency stock dispatch"
        columns={columns}
        data={filteredItems}
        keyExtractor={(row) => `${row.skuCode}-${row.locationId}`}
        exportFilename="grd_stockout_risk_report"
        pageSize={10}
        showPagination={true}
        emptyMessage="No stock points found at critical or low stock levels."
      />

      {/* Emergency Dispatch Modal */}
      <Modal
        isOpen={!!emergencyModalItem}
        onClose={() => setEmergencyModalItem(null)}
        title="Trigger Emergency Stock Transfer"
        size="md"
      >
        {emergencyModalItem && (
          <form onSubmit={handleEmergencyDispatch} className="space-y-4 text-xs">
            {emergencySuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-950 text-sm">Emergency Transfer Order Dispatched</h4>
                <p className="text-2xs text-emerald-700">Consignment prioritized for immediate express transit via Guwahati Hub.</p>
              </div>
            ) : (
              <>
                <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl text-rose-950 space-y-1">
                  <div className="font-bold text-sm">{emergencyModalItem.skuName}</div>
                  <div className="text-2xs text-rose-800">
                    Destination: <strong>{emergencyModalItem.locationName}</strong> • Current Cover: <strong>{emergencyModalItem.daysOfInventory} Days</strong>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-navy-950 mb-1">Source Dispatch Depot</label>
                  <Select
                    value={sourceDepot}
                    onChange={(val) => setSourceDepot(val)}
                    options={[
                      { value: 'Guwahati Central Depot', label: 'Guwahati Central Depot (Mother Warehouse)' },
                      { value: 'Rani cGMP Formulation Plant', label: 'Rani cGMP Formulation Plant' }
                    ]}
                    className="w-full justify-between"
                    dropdownClassName="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-navy-950 mb-1">Transfer Quantity (Units) *</label>
                    <input
                      type="number"
                      required
                      defaultValue={emergencyModalItem.reorderLevel || 2000}
                      className="input w-full font-sans text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-navy-950 mb-1">Transit Carrier Priority</label>
                    <Select
                      value={transitCarrier}
                      onChange={(val) => setTransitCarrier(val)}
                      options={[
                        { value: 'Express Highway Corridor', label: 'Express Highway Courier (24h)' },
                        { value: 'Dedicated Dedicated Container', label: 'Dedicated Container Truck' }
                      ]}
                      className="w-full justify-between"
                      dropdownClassName="w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setEmergencyModalItem(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Confirm Expedited Dispatch
                  </Button>
                </div>
              </>
            )}
          </form>
        )}
      </Modal>
    </div>
  );
}
