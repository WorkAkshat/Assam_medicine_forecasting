import React, { useState } from 'react';
import {
  Archive,
  TrendingDown,
  RefreshCw,
  Filter,
  Search,
  DollarSign,
  MapPin,
  CheckCircle2,
  Truck
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Select from '../components/common/Select';
import { usePersistentState } from '../hooks/usePersistentState';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { MOCK_INVENTORY_ITEMS, STATES } from '../data/mockInventory';
import { mockSkus } from '../data/mockSkus';
import { INTER_DEPOT_TRANSFERS } from '../data/mockSupplyChainData';
import { formatNumber, formatCurrency } from '../utils/formatters';
import { STORAGE_KEYS, getStoredData, setStoredData, logActivity } from '../services/grdDataService';

export default function ExcessInventory() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [inventory, setInventory] = usePersistentState(STORAGE_KEYS.INVENTORY, MOCK_INVENTORY_ITEMS);
  const [skus] = usePersistentState(STORAGE_KEYS.SKUS, mockSkus);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [agingFilter, setAgingFilter] = useState('All');
  
  // Redistribution Modal state
  const [redistributeItem, setRedistributeItem] = useState(null);
  const [destinationHub, setDestinationHub] = useState('Guwahati Central Depot');
  const [transportMode, setTransportMode] = useState('Consolidated Regular Cargo');
  const [transferUnits, setTransferUnits] = useState(100);
  const [redistributeSuccess, setRedistributeSuccess] = useState(false);

  // Filter items categorized strictly as Excess Stock or holding 45+ days of inventory cover
  const excessItems = inventory.filter(item => {
    const isExcess = item.status === 'Excess Stock' || item.daysOfInventory >= 45;
    const matchSearch = (item.skuName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (item.skuCode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (item.locationName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchState = selectedState === 'All States' || item.state === selectedState;
    
    let matchAging = true;
    if (agingFilter === '>90') matchAging = item.daysOfInventory > 90;
    else if (agingFilter === '60-90') matchAging = item.daysOfInventory >= 60 && item.daysOfInventory <= 90;
    else if (agingFilter === '45-60') matchAging = item.daysOfInventory >= 45 && item.daysOfInventory < 60;

    return isExcess && matchSearch && matchState && matchAging;
  });

  // Calculate tied up money specifically from the surplus quantity (above reorderLevel)
  const totalSurplusLocked = excessItems.reduce((acc, item) => {
    const sku = skus.find(s => s.code === item.skuCode || s.code === item.skuId);
    const surplus = Math.max(0, item.available - (item.reorderLevel || 1000));
    return acc + (surplus * (sku?.tradePrice || 45));
  }, 0);

  const handleOpenRedistribute = (item) => {
    setRedistributeItem(item);
    const recommended = Math.round((item.available - (item.reorderLevel || 1000)) * 0.7) || 100;
    setTransferUnits(Math.max(50, recommended));
    setRedistributeSuccess(false);
  };

  const handleRedistribute = (e) => {
    e.preventDefault();
    if (!redistributeItem) return;

    const qty = Number(transferUnits) || 100;
    const transferId = `TRF-REDIST-${Date.now().toString().slice(-4)}`;

    // 1. Add record to Inter-Depot Transfers
    const transfers = getStoredData(STORAGE_KEYS.TRANSFERS, INTER_DEPOT_TRANSFERS);
    const newTransfer = {
      transferId,
      sourceDepot: redistributeItem.locationName,
      destinationDepot: destinationHub,
      skuCode: redistributeItem.skuCode,
      medicine: redistributeItem.skuName,
      quantityUnits: qty,
      reason: `Surplus stock reallocation (${redistributeItem.daysOfInventory} days holding cover)`,
      transporter: transportMode === 'Express Inter-Depot Van' ? 'Assam Fast Express Van' : 'Brahmaputra Fast Freight',
      vehicleNo: 'AS-01-GC-9941',
      status: 'In Transit',
      departureTime: 'Today 03:30 PM',
      estimatedArrival: 'Tomorrow 09:30 AM'
    };
    setStoredData(STORAGE_KEYS.TRANSFERS, [newTransfer, ...transfers]);

    // 2. Update Inventory: deduct available at source, add inTransit at destination
    const updatedInventory = inventory.map(item => {
      if (item.skuCode === redistributeItem.skuCode || item.skuId === redistributeItem.skuCode) {
        if (item.locationName === redistributeItem.locationName || item.locationId === redistributeItem.locationId) {
          const newAvail = Math.max(0, item.available - qty);
          return {
            ...item,
            available: newAvail,
            onHand: Math.max(0, item.onHand - qty),
            daysOfInventory: Math.max(20, Math.round(item.daysOfInventory * 0.6))
          };
        }
        if (item.locationName === destinationHub || item.locationName?.includes(destinationHub.split(' ')[0])) {
          return {
            ...item,
            inTransit: (item.inTransit || 0) + qty
          };
        }
      }
      return item;
    });
    setStoredData(STORAGE_KEYS.INVENTORY, updatedInventory);
    setInventory(updatedInventory);

    // 3. Log to activity history
    logActivity({
      type: 'TRANSFER',
      action: `Surplus Reallocated (${transferId})`,
      details: `${qty.toLocaleString('en-IN')} units of ${redistributeItem.skuName} transferred from ${redistributeItem.locationName} to ${destinationHub}.`,
      user: currentUser
    });

    setRedistributeSuccess(true);
    toast.success(`Transfer PO ${transferId} created! ${qty.toLocaleString('en-IN')} units queued for reallocation.`);

    setTimeout(() => {
      setRedistributeSuccess(false);
      setRedistributeItem(null);
    }, 1500);
  };

  const columns = [
    {
      header: 'Medicine & Formulation',
      accessor: 'skuName',
      render: (row) => (
        <div>
          <span className="font-sans font-bold text-navy-950 text-xs">{row.skuCode}</span>
          <div className="font-semibold text-navy-900 text-xs">{row.skuName}</div>
          <span className="text-2xs text-slate-400">{row.category}</span>
        </div>
      )
    },
    {
      header: 'Holding Depot & State',
      accessor: 'locationName',
      render: (row) => (
        <div className="text-xs">
          <div className="flex items-center gap-1 font-semibold text-slate-900">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{row.locationName}</span>
          </div>
          <span className="text-2xs text-slate-500 pl-4">{row.state}</span>
        </div>
      )
    },
    {
      header: 'Days of Stock',
      accessor: 'daysOfInventory',
      align: 'center',
      className: 'whitespace-nowrap min-w-[120px]',
      sortValue: (row) => row.daysOfInventory,
      render: (row) => {
        const isDead = row.daysOfInventory > 90;
        const isSlow = row.daysOfInventory >= 60 && row.daysOfInventory <= 90;
        return (
          <div className="text-center font-sans">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${
              isDead ? 'bg-rose-100 text-rose-800 border border-rose-200' :
              isSlow ? 'bg-amber-100 text-amber-800 border border-amber-200' :
              'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              {row.daysOfInventory} Days
            </span>
          </div>
        );
      }
    },
    {
      header: 'Surplus Quantity',
      align: 'right',
      className: 'whitespace-nowrap',
      sortValue: (row) => Math.max(0, row.available - (row.reorderLevel || 1000)),
      render: (row) => {
        const surplus = Math.max(0, row.available - (row.reorderLevel || 1000));
        return (
          <div className="text-right font-sans">
            <span className="font-bold text-navy-950 text-xs">+{formatNumber(surplus)} Units</span>
            <div className="text-2xs text-slate-400">Total: {formatNumber(row.available)} | Target: {formatNumber(row.reorderLevel || 1000)}</div>
          </div>
        );
      }
    },
    {
      header: 'Tied-Up Money',
      align: 'right',
      className: 'whitespace-nowrap',
      sortValue: (row) => {
        const sku = skus.find(s => s.code === row.skuCode || s.code === row.skuId);
        const surplus = Math.max(0, row.available - (row.reorderLevel || 1000));
        return surplus * (sku?.tradePrice || 45);
      },
      render: (row) => {
        const sku = skus.find(s => s.code === row.skuCode || s.code === row.skuId);
        const surplus = Math.max(0, row.available - (row.reorderLevel || 1000));
        const lockedINR = surplus * (sku?.tradePrice || 45);
        return (
          <div className="text-right font-sans">
            <span className="font-bold text-terracotta-700 text-xs">{formatCurrency(lockedINR)}</span>
            <div className="text-2xs text-slate-400">Holding: {formatCurrency(lockedINR * 0.02)}/mo</div>
          </div>
        );
      }
    },
    {
      header: 'Aging Category',
      render: (row) => {
        if (row.daysOfInventory > 90) {
          return <Badge variant="danger">&gt;90 Days (Dead Stock)</Badge>;
        }
        if (row.daysOfInventory >= 60) {
          return <Badge variant="warning">60–90 Days (Slow)</Badge>;
        }
        return <Badge variant="info">45–60 Days (Surplus)</Badge>;
      }
    },
    {
      header: 'Action',
      align: 'center',
      sortable: false,
      className: 'whitespace-nowrap',
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-center">
          <Button 
            variant="outline" 
            size="xs"
            onClick={() => handleOpenRedistribute(row)}
            icon={RefreshCw}
            className="cursor-pointer hover:bg-slate-50"
          >
            Transfer Stock
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
              Excess &amp; Slow-Moving Stock
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              Capital Savings
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
            Find warehouses carrying surplus medicines (&gt;45 days cover) and transfer them to depots facing shortages, freeing up tied-up money.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Tied-Up Money in Surplus"
          value={formatCurrency(totalSurplusLocked)}
          subtitle="Value of stock above safe limits"
          icon={DollarSign}
          trend={{ direction: 'down', text: 'Down 47.0% vs Baseline', isGood: true }}
          badge={{ text: 'Capital Saved', variant: 'success' }}
        />
        <StatCard
          title="Surplus Stock Batches"
          value={excessItems.length}
          subtitle="Items with >45 days cover"
          icon={Archive}
          trend={{ direction: 'down', text: '-8 Batches vs Last Month', isGood: true }}
          badge={{ text: 'Identified', variant: 'warning' }}
        />
        <StatCard
          title="Monthly Holding Cost"
          value={formatCurrency(totalSurplusLocked * 0.02)}
          subtitle="2% monthly warehouse holding cost"
          icon={TrendingDown}
          trend={{ direction: 'down', text: 'Down ₹4,800/mo', isGood: true }}
          badge={{ text: '2% / Month', variant: 'warning' }}
        />
        <StatCard
          title="Saved via Depot Transfers"
          value="₹12.4 Lakhs"
          subtitle="Stock redistributed to needy clinics"
          icon={RefreshCw}
          trend={{ direction: 'up', text: '+18 Inter-depot transfers', isGood: true }}
          badge={{ text: 'Active', variant: 'info' }}
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
              <span className="text-slate-500 font-medium">Aging Window:</span>
              <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                {[
                  { id: 'All', label: 'All Excess Stock' },
                  { id: '45-60', label: '45–60 Days (Surplus)' },
                  { id: '60-90', label: '60–90 Days (Slow)' },
                  { id: '>90', label: '>90 Days (Dead Stock Risk)' }
                ].map(b => (
                  <button
                    key={b.id}
                    onClick={() => setAgingFilter(b.id)}
                    className={`px-2.5 py-1 rounded text-2xs font-semibold transition-all cursor-pointer ${
                      agingFilter === b.id ? 'bg-white text-navy-950 shadow-2xs' : 'text-slate-600 hover:text-navy-900'
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
              placeholder="Search formulation or depot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 py-1.5 text-xs w-full"
            />
          </div>
        </div>
      </div>

      {/* Paginated, Sortable Table */}
      <Table 
        title="Surplus Medicine Depots"
        subtitle="Warehouses holding more than 45 days of safety stock recommended for reallocation"
        columns={columns}
        data={excessItems}
        keyExtractor={(row) => `${row.skuCode}-${row.locationId}`}
        exportFilename="grd_excess_inventory_audit"
        pageSize={10}
        showPagination={true}
        emptyMessage="No excess or slow-moving stock found matching your criteria."
      />

      {/* Inter-Depot Redistribution Modal */}
      {redistributeItem && (
        <Modal
          isOpen={!!redistributeItem}
          onClose={() => {
            setRedistributeItem(null);
            setRedistributeSuccess(false);
          }}
          title="Inter-Depot Redistribution Proposal"
          subtitle={`Reallocate surplus units from ${redistributeItem.locationName}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleRedistribute} className="space-y-4 text-xs text-slate-700">
            {redistributeSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-950 text-sm">Transfer Order Queued for Authorization</h4>
                <p className="text-2xs text-emerald-700">
                  {transferUnits} units allocated to move from {redistributeItem.locationName} to {destinationHub}.
                </p>
              </div>
            ) : (
              <>
                <div className="p-3 bg-navy-50 rounded-xl text-navy-900 space-y-1 border border-navy-100">
                  <div className="font-bold text-sm text-navy-950">{redistributeItem.skuName}</div>
                  <div className="text-2xs text-slate-600 flex items-center justify-between">
                    <span>Code: <strong>{redistributeItem.skuCode}</strong></span>
                    <span>Holding: <strong>{redistributeItem.daysOfInventory} days cover</strong></span>
                  </div>
                  <div className="text-2xs text-slate-500">
                    Source Facility: <strong>{redistributeItem.locationName}</strong> ({redistributeItem.state})
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-navy-950 mb-1">Recommended Destination Hub *</label>
                  <select
                    value={destinationHub}
                    onChange={(e) => setDestinationHub(e.target.value)}
                    className="input py-2 text-xs w-full bg-slate-50"
                  >
                    <option value="Guwahati Central Depot">Guwahati Central Depot (Fast hospital indent turnover)</option>
                    <option value="Silchar C&F Depot">Silchar C&F Depot (SMCH stockout prevention)</option>
                    <option value="Dibrugarh Hub">Dibrugarh Hub (AMCH tender fulfillment)</option>
                    <option value="Agartala Regional Depot">Agartala Regional Depot (Tripura Hub)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-navy-950 mb-1">Transfer Units *</label>
                    <input
                      type="number"
                      required
                      min="10"
                      max={redistributeItem.available}
                      value={transferUnits}
                      onChange={(e) => setTransferUnits(parseInt(e.target.value, 10) || 0)}
                      className="input w-full font-sans text-xs py-2"
                    />
                    <span className="text-2xs text-slate-400 mt-0.5 block">
                      Max Available: {formatNumber(redistributeItem.available)}
                    </span>
                  </div>
                  <div>
                    <label className="block font-semibold text-navy-950 mb-1">Transport Mode</label>
                    <select
                      value={transportMode}
                      onChange={(e) => setTransportMode(e.target.value)}
                      className="input w-full text-xs py-2 bg-slate-50"
                    >
                      <option value="Consolidated Regular Cargo">Consolidated Regular Cargo</option>
                      <option value="Express Inter-Depot Van">Express Inter-Depot Van</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-2xs space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-amber-700" />
                    Inter-Depot Rebalancing Advantage:
                  </p>
                  <p>Moving surplus stock to deficit state depots frees up working capital and prevents stock expiry without needing new plant manufacturing.</p>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setRedistributeItem(null);
                      setRedistributeSuccess(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    size="sm"
                    className="bg-navy-900 hover:bg-navy-950 text-white font-bold"
                  >
                    Generate Redistribution PO
                  </Button>
                </div>
              </>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
}
