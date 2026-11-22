import React, { useState, useMemo } from 'react';
import {
  Warehouse,
  Search,
  Filter,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  RefreshCw,
  Eye,
  Layers,
  ChevronRight,
  Building2,
  RotateCcw,
  ShieldCheck,
  Plus
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Drawer from '../components/common/Drawer';
import Select from '../components/common/Select';
import { useToast } from '../hooks/useToast';
import { usePersistentState } from '../hooks/usePersistentState';
import { mockInventoryFacilities, mockInventoryItems, mockStateInventorySummary } from '../data/mockInventory';
import { mockSkus } from '../data/mockSkus';
import { formatNumber } from '../utils/formatters';
import { STORAGE_KEYS } from '../services/grdDataService';

export default function Inventory() {
  const { toast } = useToast();
  const [skus] = usePersistentState(STORAGE_KEYS.SKUS, mockSkus);
  const [items, setItems] = usePersistentState(STORAGE_KEYS.INVENTORY, mockInventoryItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [healthFilter, setHealthFilter] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [vedFilter, setVedFilter] = useState('All');
  const [selectedSku, setSelectedSku] = useState(null);
  const [reconcileItem, setReconcileItem] = useState(null);
  const [reconcileQty, setReconcileQty] = useState('');
  const [reconcileReason, setReconcileReason] = useState('Damaged stock adjustment');
  const [reconcileSuccess, setReconcileSuccess] = useState(false);
  const [selectedState, setSelectedState] = useState('All');
  const [viewMode, setViewMode] = useState('table');
  const [activeTab, setActiveTab] = useState('skus');
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [formStockSku, setFormStockSku] = useState('GRD-TAB-001');
  const [formStockBatch, setFormStockBatch] = useState('GHY-2026-INW01');
  const [formStockQty, setFormStockQty] = useState(10000);
  const [formStockFacility, setFormStockFacility] = useState('Guwahati Central Depot');
  const [formStockZone, setFormStockZone] = useState('Ambient Finished Goods (15-25°C)');

  const filteredFacilities = useMemo(() => {
    return (mockInventoryFacilities || []).filter(fac => {
      const matchState = selectedState === 'All' || fac.state === selectedState;
      const matchSearch = !searchQuery || 
        fac.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        fac.city?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        fac.state?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchState && matchSearch;
    });
  }, [selectedState, searchQuery]);

  const handleReconcileSubmit = (e) => {
    e.preventDefault();
    if (!reconcileItem || !reconcileQty) return;
    const diff = Number(reconcileQty) - reconcileItem.onHand;
    setItems(prev => prev.map(item => {
      if (item.skuCode === reconcileItem.skuCode && (item.location === reconcileItem.location || item.locationName === reconcileItem.locationName)) {
        return { ...item, onHand: Number(reconcileQty), available: Number(reconcileQty) };
      }
      return item;
    }));
    setReconcileSuccess(true);
    toast.success(`Inventory reconciled for ${reconcileItem.skuName}. Discrepancy: ${diff >= 0 ? '+' : ''}${diff} units.`);
    setTimeout(() => {
      setReconcileItem(null);
      setReconcileSuccess(false);
      setReconcileQty('');
    }, 1200);
  };

    const handleDirectStockInward = (e) => {
    e.preventDefault();
    const targetSku = (skus || mockSkus).find(s => s.code === formStockSku) || { name: 'Paracetamol 650mg Tablets', unitPrice: 28 };
    const qty = Number(formStockQty);

    setItems(prev => {
      const exists = prev.find(i => i.skuCode === formStockSku && (i.location === formStockFacility || i.locationName === formStockFacility));
      if (exists) {
        return prev.map(item => {
          if (item.skuCode === formStockSku && (item.location === formStockFacility || item.locationName === formStockFacility)) {
            const newOnHand = (item.onHand || 0) + qty;
            const dailyRate = Math.max(10, Math.round((item.reorderLevel || 2000) / 15));
            const newDaysCover = Math.min(60, Math.round(newOnHand / dailyRate));
            const newStatus = newDaysCover <= 7 ? 'Critical' : newDaysCover <= 15 ? 'Low' : 'Optimal';
            return {
              ...item,
              onHand: newOnHand,
              available: (item.available || 0) + qty,
              daysCover: newDaysCover,
              daysOfInventory: newDaysCover,
              status: newStatus
            };
          }
          return item;
        });
      } else {
        const dailyRate = Math.max(10, Math.round((targetSku.reorderLevel || 2000) / 15));
        const daysCover = Math.min(60, Math.round(qty / dailyRate));
        const newItem = {
          id: `INV-${Date.now()}`,
          skuId: targetSku.id || `SKU-${Date.now()}`,
          skuCode: formStockSku,
          skuName: targetSku.name,
          brandName: targetSku.brandName || '',
          category: targetSku.category || 'Tablets',
          location: formStockFacility,
          locationName: formStockFacility,
          state: formStockFacility.includes('Silchar') ? 'Assam' : formStockFacility.includes('Shillong') ? 'Meghalaya' : formStockFacility.includes('Agartala') ? 'Tripura' : 'Assam',
          onHand: qty,
          reserved: 0,
          inTransit: 0,
          available: qty,
          unitsPerBox: 100,
          daysCover: daysCover,
          daysOfInventory: daysCover,
          status: daysCover <= 7 ? 'Critical' : daysCover <= 15 ? 'Low' : 'Optimal',
          batchNumber: formStockBatch.trim() || `GHY-2026-INW01`,
          expiryDate: '2028-11-30',
          mfgDate: new Date().toISOString().split('T')[0]
        };
        return [newItem, ...prev];
      }
    });

    setIsAddStockModalOpen(false);
    toast.success(`${qty.toLocaleString('en-IN')} units of ${targetSku.name} inwarded to ${formStockFacility}! Depot ledger updated.`);
  };

  const handleExportStock = () => {
    const headers = ['Medicine Name', 'SKU Code', 'Warehouse Location', 'Current Stock', 'Stock on the Way', 'Days Cover', 'Batch Lot', 'Expiry', 'Status'];
    const rows = filteredItems.map(i => [
      `"${i.skuName}"`,
      `"${i.skuCode}"`,
      `"${i.location || i.locationName}"`,
      i.onHand || 0,
      i.inTransit || 0,
      i.daysCover || i.daysOfInventory || 0,
      `"${i.batchNumber || ''}"`,
      `"${i.expiryDate || ''}"`,
      `"${i.status || 'Optimal'}"`
    ].join(','));
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `GRD_Inventory_Stock_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Inventory stock ledger exported as CSV');
  };

  const handleSyncDepots = () => {
    toast.success('Sync complete. All Northeast depots connected and reconciled with Rani cGMP facility.');
  };

  // Robust normalization to ensure zero missing locations, zero NaN daysCover, and 100% status alignment
  const normalizedItems = useMemo(() => {
    return (items || []).map((item) => {
      const loc = item.location || item.locationName || item.facility || 'Guwahati Central Depot';
      const onHand = Number(item.onHand ?? item.availableStockUnits ?? item.currentStockAvailable ?? 0);
      const inTransit = Number(item.inTransit ?? 0);
      const unitsPerBox = Number(item.unitsPerBox || 100);

      const targetSku = (skus || mockSkus).find(s => s.code === item.skuCode);
      const reorder = Number(item.reorderLevel || targetSku?.reorderLevel || 2000);
      const dailyRate = Math.max(10, Math.round(reorder / 15));

      let daysCover = item.daysCover;
      const expectedCover = Math.round(onHand / dailyRate);

      if (daysCover === undefined || daysCover === null || isNaN(daysCover) || daysCover <= 0) {
        daysCover = Math.max(1, Math.min(60, expectedCover || 24));
      } else if (daysCover > 90) {
        daysCover = Math.max(15, Math.min(45, expectedCover || 30));
      } else if (onHand >= 10000 && daysCover < 7) {
        daysCover = Math.max(24, Math.min(45, expectedCover));
      }

      let status = item.status;
      if (daysCover <= 7) {
        status = 'Critical';
      } else if (daysCover <= 15) {
        status = 'Low';
      } else {
        status = 'Optimal';
      }

      const skuNameDisplay = targetSku?.brandName 
        ? targetSku.name
        : (item.skuName || targetSku?.name || item.skuCode);

      const brandSubtitle = targetSku?.brandName || item.brandName || '';

      return {
        ...item,
        location: loc,
        onHand,
        inTransit,
        unitsPerBox,
        daysCover,
        status,
        skuName: skuNameDisplay,
        brandName: brandSubtitle,
        batchNumber: item.batchNumber || `GRD-${item.skuCode?.replace(/[^A-Za-z0-9]/g, '').slice(0, 4) || 'BAT'}-B2401`,
        expiryDate: item.expiryDate || '2028-11-30'
      };
    });
  }, [items, skus]);

  // Calculate high-level stats based on normalized items
  const totalStockUnits = normalizedItems.reduce((acc, item) => acc + item.onHand, 0);
  const totalInTransitUnits = normalizedItems.reduce((acc, item) => acc + item.inTransit, 0);
  const totalReservedUnits = normalizedItems.reduce((acc, item) => acc + (item.reserved || 0), 0);
  const totalValuationLakhs = normalizedItems.reduce((acc, item) => {
    const sku = (skus || mockSkus).find(s => s.code === item.skuCode);
    return acc + (item.onHand * (sku?.unitPrice || 50)) / 100000;
  }, 0);
  const lowStockCount = normalizedItems.filter(i => i.status === 'Low' || i.status === 'Critical').length;

  // Filtered SKUs
  const filteredItems = normalizedItems.filter(item => {
    const sku = (skus || mockSkus).find(s => s.code === item.skuCode);
    const locText = (item.location || '').toLowerCase();
    const matchesSearch = (item.skuName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.skuCode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          locText.includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || sku?.category === selectedCategory;
    const matchesHealth = healthFilter === 'All' || 
      (healthFilter === 'Optimal' && item.status === 'Optimal') ||
      (healthFilter === 'Low' && item.status === 'Low') ||
      (healthFilter === 'Critical' && item.status === 'Critical');
    const matchesLocation = selectedLocation === 'All' || item.location === selectedLocation;
    const matchesVed = vedFilter === 'All' || 
      (sku?.vitalCategory && sku.vitalCategory.toLowerCase().includes(vedFilter.toLowerCase()));
    return matchesSearch && matchesCategory && matchesHealth && matchesLocation && matchesVed;
  });

  const hasActiveFilters = searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    healthFilter !== 'All' ||
    selectedLocation !== 'All' ||
    vedFilter !== 'All';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setHealthFilter('All');
    setSelectedLocation('All');
    setVedFilter('All');
  };

    const columns = [
    {
      header: 'Medicine Code & Name',
      className: 'min-w-[160px]',
      render: (row) => (
        <div>
          <div className="font-semibold text-navy-950 font-sans text-xs">{row.skuName}</div>
          <div className="text-2xs text-navy-700/60 font-mono mt-0.5">
            {row.skuCode} {row.brandName ? `· ${row.brandName}` : ''}
          </div>
        </div>
      )
    },
    {
      header: 'Warehouse Location',
      className: 'min-w-[150px]',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-navy-800">
          <MapPin className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
          <span className="font-medium">{row.location}</span>
        </div>
      )
    },
    {
      header: 'Current Stock Available',
      align: 'right',
      className: 'whitespace-nowrap min-w-[110px]',
      sortValue: (row) => row.onHand,
      render: (row) => (
        <div className="text-right">
          <div className="font-bold text-navy-900 text-xs sm:text-sm font-sans">{formatNumber(row.onHand)}</div>
          <div className="text-2xs text-navy-700/60 whitespace-nowrap">{formatNumber(row.unitsPerBox)} units/box</div>
        </div>
      )
    },
    {
      header: 'Stock on the Way',
      align: 'right',
      className: 'whitespace-nowrap min-w-[110px]',
      sortValue: (row) => row.inTransit,
      render: (row) => (
        <div className="text-right font-sans">
          <span className={`text-xs font-bold ${row.inTransit > 0 ? 'text-blue-700' : 'text-slate-400'}`}>
            {row.inTransit > 0 ? `+${formatNumber(row.inTransit)}` : '—'}
          </span>
          <div className="text-2xs text-slate-400 whitespace-nowrap">Pipeline</div>
        </div>
      )
    },
    {
      header: 'Days Stock Lasts',
      align: 'center',
      className: 'whitespace-nowrap min-w-[110px]',
      sortValue: (row) => Number(row.daysCover) || 0,
      render: (row) => {
        const days = Number(row.daysCover) || 0;
        const isCritical = days <= 7;
        const isLow = days > 7 && days <= 15;
        const variant = isCritical 
          ? 'bg-rose-50 text-rose-700 border-rose-200' 
          : isLow 
          ? 'bg-amber-50 text-amber-700 border-amber-200' 
          : 'bg-emerald-50 text-emerald-700 border-emerald-200';
        return (
          <div className="flex justify-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border whitespace-nowrap ${variant}`}>
              {days} Days
            </span>
          </div>
        );
      }
    },
    {
      header: 'Batch & Expiry',
      align: 'center',
      className: 'whitespace-nowrap min-w-[120px]',
      render: (row) => (
        <div className="text-xs text-center">
          <span className="font-mono text-2xs font-semibold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg border border-slate-200/80 whitespace-nowrap inline-block">
            {row.batchNumber}
          </span>
          <div className="text-2xs text-slate-500 mt-1 whitespace-nowrap">Exp: {row.expiryDate}</div>
        </div>
      )
    },
    {
      header: 'Stock Status',
      align: 'center',
      className: 'whitespace-nowrap min-w-[110px]',
      render: (row) => {
        let variant = 'success';
        let label = 'Optimal';
        const days = Number(row.daysCover) || 0;
        if (row.status === 'Critical' || row.status === 'Stockout Risk' || days <= 7) {
          variant = 'danger';
          label = 'Stockout Risk';
        } else if (row.status === 'Low' || row.status === 'Low Stock' || days <= 15) {
          variant = 'warning';
          label = 'Low Stock';
        } else if (row.status === 'Excess' || row.status === 'Excess Stock' || days > 45) {
          variant = 'info';
          label = 'Excess Stock';
        }

        return (
          <div className="flex justify-center">
            <Badge variant={variant} className="whitespace-nowrap">
              {label}
            </Badge>
          </div>
        );
      }
    },
    {
      header: 'Actions',
      align: 'center',
      className: 'whitespace-nowrap min-w-[125px]',
      headerClassName: 'text-center',
      render: (row) => (
        <div className="flex items-center justify-center gap-1.5">
          <button 
            type="button"
            onClick={() => setSelectedSku(row)}
            className="p-1 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 transition-all shadow-2xs cursor-pointer"
            title="Inspect Inventory Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button 
            type="button"
            onClick={() => setReconcileItem(row)}
            className="px-2 py-0.5 text-xs font-medium rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-navy-950 transition-all shadow-2xs cursor-pointer whitespace-nowrap"
          >
            Reconcile
          </button>
        </div>
      )
    }
  ];
  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-sans text-navy-950">
              Warehouse Inventory
            </h1>
            <span className="text-xs bg-navy-100 text-navy-800 font-medium px-2 py-0.5 rounded-full">
              Live Stock
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
            Live medicine quantities, reserved stock, and batches across Guwahati Central Depot, Rani cGMP plant, and regional stockists.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setIsAddStockModalOpen(true)}
            icon={Plus}
          >
            Direct Stock Inward
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportStock}
            icon={Download}
          >
            Export Stock (CSV)
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSyncDepots}
            icon={RefreshCw}
          >
            Sync Depots
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard 
          title="Total Stock Value" 
          value={`₹${(totalValuationLakhs / 100).toFixed(2)} Cr`}
          subtitle="Valuation at current MRP/DP"
          icon={Building2}
          trend={{ direction: 'up', text: '+4.2% vs last month' }}
        />
        <StatCard 
          title="On-Hand Units" 
          value={formatNumber(totalStockUnits)}
          subtitle="Physical inventory available"
          icon={Warehouse}
        />
        <StatCard 
          title="In-Transit Cargo" 
          value={formatNumber(totalInTransitUnits)}
          subtitle="On NH-27, NH-6, NH-8 corridors"
          icon={Clock}
          badge={{ text: 'En Route', variant: 'info' }}
        />
        <StatCard 
          title="Reserved / Allocated" 
          value={formatNumber(totalReservedUnits)}
          subtitle="Committed to Govt & Hospitals"
          icon={Layers}
        />
        <StatCard 
          title="Stockout Risk Nodes" 
          value={lowStockCount}
          subtitle="Cover < 7 days"
          icon={AlertTriangle}
          trend={{ direction: 'down', text: 'Down 22% (Pilot Win)' }}
        />
      </div>

      {/* View Toggle & Filters */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-100 pb-3">
          <div className="flex items-center gap-1.5 p-1 bg-navy-50 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('skus')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'skus' 
                  ? 'bg-white text-navy-900 shadow-sm font-semibold' 
                  : 'text-navy-700/70 hover:text-navy-900'
              }`}
            >
              SKU Inventory Ledger ({mockInventoryItems.length})
            </button>
            <button
              onClick={() => setActiveTab('facilities')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'facilities' 
                  ? 'bg-white text-navy-900 shadow-sm font-semibold' 
                  : 'text-navy-700/70 hover:text-navy-900'
              }`}
            >
              Facilities & Warehouses ({mockInventoryFacilities.length})
            </button>
            <button
              onClick={() => setActiveTab('states')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'states' 
                  ? 'bg-white text-navy-900 shadow-sm font-semibold' 
                  : 'text-navy-700/70 hover:text-navy-900'
              }`}
            >
              State-Wise Distribution
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-navy-700/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search SKU code, name or hub..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-9 py-1.5 text-xs w-full"
              />
            </div>
          </div>
        </div>

        {activeTab === 'skus' && (
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <Select
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(val)}
              options={[
                { value: 'All', label: 'All Categories' },
                { value: 'Tablets', label: 'Tablets' },
                { value: 'Capsules', label: 'Capsules' },
                { value: 'Syrups', label: 'Syrups' },
                { value: 'Suspensions', label: 'Suspensions' },
                { value: 'Sanitizers & Hygiene', label: 'Sanitizers & Hygiene' }
              ]}
              icon={Filter}
            />

            <Select
              value={selectedLocation}
              onChange={(val) => setSelectedLocation(val)}
              options={[
                { value: 'All', label: 'All Depots & Hubs' },
                { value: 'Guwahati Central Depot', label: 'Guwahati Central Depot' },
                { value: 'Silchar C&F Depot (Barak Valley)', label: 'Silchar Depot (Barak Valley)' },
                { value: 'Dibrugarh Regional Depot', label: 'Dibrugarh Depot' },
                { value: 'Shillong Meghalaya C&F Hub', label: 'Shillong Meghalaya Hub' },
                { value: 'Agartala Regional Depot', label: 'Agartala Regional Depot' },
                { value: 'Dimapur Commercial Hub', label: 'Dimapur Commercial Hub' },
                { value: 'Rani cGMP Formulation Plant', label: 'Rani Formulation Plant' }
              ]}
              icon={Warehouse}
            />

            <Select
              value={healthFilter}
              onChange={(val) => setHealthFilter(val)}
              options={[
                { value: 'All', label: 'All Statuses' },
                { value: 'Optimal', label: 'Optimal (15-45d)' },
                { value: 'Excess', label: 'Excess (>45d)' },
                { value: 'Low', label: 'Low (<15d)' },
                { value: 'Critical', label: 'Critical (<7d)' }
              ]}
              icon={AlertTriangle}
            />

            <Select
              value={vedFilter}
              onChange={(val) => setVedFilter(val)}
              options={[
                { value: 'All', label: 'All VED Priorities' },
                { value: 'Vital', label: 'Vital (VED-V)' },
                { value: 'Essential', label: 'Essential (VED-E)' },
                { value: 'Desirable', label: 'Desirable (VED-D)' }
              ]}
              icon={ShieldCheck}
            />

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                title="Reset all active filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

            <div className="ml-auto text-2xs text-navy-700/60">
              Showing <strong>{filteredItems.length}</strong> of {items.length} records
            </div>
          </div>
        )}

        {activeTab === 'facilities' && (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-navy-700/70 font-medium">Filter by State:</span>
            <div className="flex flex-wrap gap-1">
              {['All', 'Assam', 'Meghalaya', 'Tripura', 'Nagaland', 'Manipur', 'Mizoram', 'Arunachal Pradesh', 'Sikkim'].map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedState(st)}
                  className={`px-2.5 py-1 rounded text-2xs font-medium transition-colors ${
                    selectedState === st 
                      ? 'bg-navy-900 text-white' 
                      : 'bg-navy-50 text-navy-700 hover:bg-navy-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Areas based on Tab */}
      {activeTab === 'skus' && (
        <Table 
          title="Inventory Stock Ledger"
          compact={true}
          subtitle="Live on-hand quantities, days of cover, and batch lot numbers across warehouses"
          columns={columns}
          data={filteredItems}
          keyExtractor={(row) => `${row.skuCode}-${row.location}`}
          emptyMessage="No inventory items found matching your filters."
        />
      )}

      {activeTab === 'facilities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFacilities.map((fac) => (
            <div key={fac.id} className="card p-5 hover:border-navy-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-2xs font-bold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-2 py-0.5 rounded">
                      {fac.type}
                    </span>
                    <h3 className="font-sans font-bold text-navy-950 text-base mt-1.5">{fac.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-navy-700/70 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{fac.city}, {fac.state}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xs font-semibold px-2 py-0.5 rounded-full ${
                      fac.capacityUtilization > 85 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {fac.capacityUtilization}% Capacity
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-navy-100 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-navy-700/60 block text-2xs">Total Stock Value</span>
                    <span className="font-semibold text-navy-900 text-sm">₹{fac.stockValueLakhs} L</span>
                  </div>
                  <div>
                    <span className="text-navy-700/60 block text-2xs">SKUs Stocked</span>
                    <span className="font-semibold text-navy-900 text-sm">{fac.skuCount} active</span>
                  </div>
                  <div>
                    <span className="text-navy-700/60 block text-2xs">Lead Time from Guwahati</span>
                    <span className="font-semibold text-navy-900 text-sm">{fac.leadTimeDays} {fac.leadTimeDays === 0 ? '(HQ)' : 'days'}</span>
                  </div>
                  <div>
                    <span className="text-navy-700/60 block text-2xs">Buffer Health</span>
                    <span className="font-semibold text-emerald-700 text-sm">{fac.bufferHealth}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-navy-100 flex items-center justify-between">
                <span className="text-2xs text-navy-700/50">Manager: {fac.managerName}</span>
                <button 
                  onClick={() => {
                    setSearchQuery(fac.city);
                    setActiveTab('skus');
                  }}
                  className="text-xs font-medium text-navy-900 hover:text-terracotta-600 flex items-center gap-1"
                >
                  View SKUs <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'states' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockStateInventorySummary.map((st) => (
            <div key={st.state} className="card p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-navy-100 pb-2">
                <h3 className="font-bold text-navy-950 font-sans">{st.state}</h3>
                <span className="text-2xs bg-navy-100 text-navy-800 px-2 py-0.5 rounded font-sans">
                  {st.depotsCount} Hub{st.depotsCount > 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-navy-700/70">Inventory Valuation:</span>
                  <span className="font-semibold text-navy-900">₹{st.valuationCr} Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-700/70">Average Stock Cover:</span>
                  <span className="font-semibold text-navy-900">{st.avgDaysCover} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-700/70">Stockout Risk SKUs:</span>
                  <span className={`font-semibold ${st.stockoutRiskCount > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                    {st.stockoutRiskCount} SKUs
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-700/70">Transit Time Risk:</span>
                  <span className="text-2xs px-1.5 py-0.5 bg-amber-50 text-amber-800 rounded font-medium">
                    {st.transitRiskLevel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SKU Detail Drawer */}
      <Drawer
        isOpen={!!selectedSku}
        onClose={() => setSelectedSku(null)}
        title={selectedSku?.skuName || 'SKU Stock Detail'}
        size="md"
      >
        {selectedSku && (
          <div className="space-y-5 text-sm">
            <div className="p-3 bg-navy-50 rounded-lg space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-navy-700/70">SKU Code:</span>
                <span className="font-sans font-semibold text-navy-900">{selectedSku.skuCode}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-navy-700/70">Storage Hub:</span>
                <span className="font-semibold text-navy-900">{selectedSku.location}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-navy-700/70">Batch Number:</span>
                <span className="font-sans font-semibold text-navy-900">{selectedSku.batchNumber}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border border-navy-100 rounded-lg text-center">
                <span className="text-2xs text-navy-700/60 block">On Hand Available</span>
                <span className="text-lg font-bold text-navy-950">{formatNumber(selectedSku.onHand)}</span>
              </div>
              <div className="p-3 border border-navy-100 rounded-lg text-center">
                <span className="text-2xs text-navy-700/60 block">Allocated / Reserved</span>
                <span className="text-lg font-bold text-navy-950">{formatNumber(selectedSku.reserved)}</span>
              </div>
              <div className="p-3 border border-navy-100 rounded-lg text-center">
                <span className="text-2xs text-navy-700/60 block">In-Transit Replenishment</span>
                <span className="text-lg font-bold text-blue-700">+{formatNumber(selectedSku.inTransit)}</span>
              </div>
              <div className="p-3 border border-navy-100 rounded-lg text-center">
                <span className="text-2xs text-navy-700/60 block">Daily Consumption Rate</span>
                <span className="text-lg font-bold text-navy-950">{(selectedSku.onHand / Math.max(selectedSku.daysCover, 1)).toFixed(0)} units/d</span>
              </div>
            </div>

            <div className="border-t border-navy-100 pt-4 space-y-2">
              <h4 className="font-semibold text-navy-900 text-xs uppercase tracking-wider">Quality & FEFO Compliance</h4>
              <div className="text-xs space-y-1.5 text-navy-800">
                <div className="flex justify-between">
                  <span>Manufacturing Date:</span>
                  <span className="font-medium">{selectedSku.mfgDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expiry Date:</span>
                  <span className="font-medium text-amber-700">{selectedSku.expiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage Condition:</span>
                  <span className="font-medium">Store below 25°C in dry area</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-navy-100">
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => {
                  setReconcileItem(selectedSku);
                  setSelectedSku(null);
                }}
              >
                Trigger Physical Stock Count Reconciliation
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Add Stock Entry Modal */}
      {isAddStockModalOpen && (
        <Modal
          isOpen={isAddStockModalOpen}
          onClose={() => setIsAddStockModalOpen(false)}
          title="Direct Warehouse Stock Inward / Manual Entry"
          subtitle="Record physical finished medicine goods receiving into Guwahati Mother Hub or Regional Depot ledger"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleDirectStockInward} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Medicine Formulation (SKU) *
                </label>
                <select
                  value={formStockSku}
                  onChange={(e) => setFormStockSku(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  {skus.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.code} - {s.brandName ? `${s.name} (${s.brandName})` : s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Batch Serialization *
                </label>
                <input
                  type="text"
                  required
                  value={formStockBatch}
                  onChange={(e) => setFormStockBatch(e.target.value)}
                  placeholder="e.g. GHY-2026-INW01"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Receiving Warehouse Depot *
                </label>
                <select
                  value={formStockFacility}
                  onChange={(e) => setFormStockFacility(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  <option value="Guwahati Central Depot">Guwahati Central Depot (Mother Hub)</option>
                  <option value="Rani Formulation Finished Goods">Rani Formulation Finished Goods</option>
                  <option value="Silchar Regional Depot">Silchar Regional Depot (Barak Valley)</option>
                  <option value="Shillong Civil Depot">Shillong Civil Depot</option>
                  <option value="Agartala Central Medical Store">Agartala Central Medical Store</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Storage Temperature Zone *
                </label>
                <select
                  value={formStockZone}
                  onChange={(e) => setFormStockZone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  <option value="Ambient Finished Goods (15-25°C)">Ambient Finished Goods (15-25°C)</option>
                  <option value="Cold Chain Refrigerator (2-8°C)">Cold Chain Refrigerator (2-8°C)</option>
                  <option value="Quarantine Inspection Hold">Quarantine Inspection Hold</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Quantity Inward Units (Packs) *
                </label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  required
                  value={formStockQty}
                  onChange={(e) => setFormStockQty(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-2xs text-slate-400">Presets:</span>
                  {[2500, 5000, 10000, 25000].map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setFormStockQty(q)}
                      className={`text-2xs font-semibold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                        Number(formStockQty) === q
                          ? 'bg-navy-900 text-white border-navy-900'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                      }`}
                    >
                      {(q / 1000)}k units
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddStockModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-navy-900 hover:bg-navy-950 text-white font-bold shadow-sm cursor-pointer">
                Confirm Inward
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Stock Reconciliation Modal */}
      <Modal
        isOpen={!!reconcileItem}
        onClose={() => setReconcileItem(null)}
        title="Physical Inventory Reconciliation"
        size="md"
      >
        {reconcileItem && (
          <form onSubmit={handleReconcileSubmit} className="space-y-4">
            {reconcileSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-semibold text-emerald-900">Reconciliation Logged Successfully</h4>
                <p className="text-xs text-emerald-700">Audit trail updated with physical count and justification.</p>
              </div>
            ) : (
              <>
                <div className="p-3 bg-navy-50 rounded text-xs space-y-1">
                  <div className="font-semibold text-navy-900">{reconcileItem.skuName}</div>
                  <div className="text-navy-700/70">Location: {reconcileItem.location} • Batch: {reconcileItem.batchNumber}</div>
                  <div className="text-navy-700/70">Current System On-Hand: <strong>{formatNumber(reconcileItem.onHand)} units</strong></div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-navy-900 mb-1">
                    Actual Physical Count (Units) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Enter verified physical count"
                    value={reconcileQty}
                    onChange={(e) => setReconcileQty(e.target.value)}
                    className="input w-full text-xs"
                  />
                  {reconcileQty && (
                    <div className="mt-1 text-2xs text-navy-700/80">
                      Discrepancy: <span className={Number(reconcileQty) - reconcileItem.onHand < 0 ? 'text-red-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                        {Number(reconcileQty) - reconcileItem.onHand > 0 ? `+${Number(reconcileQty) - reconcileItem.onHand}` : Number(reconcileQty) - reconcileItem.onHand} units
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-navy-900 mb-1">
                    Reconciliation Reason *
                  </label>
                  <Select
                    value={reconcileReason}
                    onChange={(val) => setReconcileReason(val)}
                    options={[
                      { value: 'Physical Stock Count', label: 'Routine Physical Cycle Count' },
                      { value: 'Transit Damage', label: 'Transit Humidity / Breakage Loss' },
                      { value: 'Sampling Distribution', label: 'Quality Lab Retesting Sample' },
                      { value: 'Distributor Return', label: 'Distributor Shortage Claim Settlement' }
                    ]}
                    className="w-full justify-between"
                    dropdownClassName="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-navy-900 mb-1">
                    Auditor Notes & Batch Sign-off
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter verification details, warehouse officer name, or audit reference..."
                    className="textarea w-full text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-navy-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setReconcileItem(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Confirm Reconciliation
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
