import React, { useState } from 'react';
import {
  Pill,
  Search,
  Filter,
  Plus,
  Layers,
  ShieldCheck,
  DollarSign,
  Eye,
  Edit2,
  Trash2,
  Activity,
  ThermometerSnowflake,
  Boxes,
  Truck,
  RotateCcw
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Drawer from '../components/common/Drawer';
import Modal from '../components/common/Modal';
import Select from '../components/common/Select';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import { usePersistentState } from '../hooks/usePersistentState';
import { MOCK_SKUS, CATEGORIES } from '../data/mockSkus';
import { formatNumber } from '../utils/formatters';
import {
  registerMasterSku,
  updateMasterSku,
  deleteMasterSku,
  STORAGE_KEYS
} from '../services/grdDataService';

const INITIAL_FORM = {
  code: '',
  brandName: '',
  name: '',
  category: 'Tablets',
  therapeuticClass: 'Analgesic & Antipyretic',
  dosageForm: 'Film-coated Tablet',
  packSize: '10 x 10 Blister',
  hsnCode: '30049099',
  gstRate: 12,
  vitalCategory: 'Essential (VED-E)',
  shelfLifeMonths: 24,
  storageCondition: 'Store below 25°C in dry place',
  isColdChain: false,
  costPrice: 22,
  tradePrice: 45,
  mrp: 65,
  minStock: 1000,
  maxStock: 8000,
  reorderLevel: 2500,
  fastMoving: true,
  description: ''
};

export default function Skus() {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [skus, setSkus] = usePersistentState(STORAGE_KEYS.SKUS, MOCK_SKUS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vedFilter, setVedFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [coldChainFilter, setColdChainFilter] = useState('All');
  const [fastMovingOnly, setFastMovingOnly] = useState(false);
  const [selectedSku, setSelectedSku] = useState(null);

  const hasActiveFilters = searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    vedFilter !== 'All' ||
    statusFilter !== 'Active' ||
    coldChainFilter !== 'All' ||
    fastMovingOnly;

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setVedFilter('All');
    setStatusFilter('Active');
    setColdChainFilter('All');
    setFastMovingOnly(false);
  };

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSkuId, setEditingSkuId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirmSku, setDeleteConfirmSku] = useState(null);

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setFormErrors({});
    setIsEditing(false);
    setEditingSkuId(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    const prefixMap = {
      'Tablets': 'TAB',
      'Capsules': 'CAP',
      'Syrups': 'SYR',
      'Suspensions & Hygiene': 'HYG',
      'Injections': 'INJ',
      'Ointments': 'ONT'
    };
    const prefix = prefixMap['Tablets'] || 'MED';
    const nextNum = skus.filter(s => s.code?.includes(`GRD-${prefix}`)).length + 1;
    setFormData({
      ...INITIAL_FORM,
      code: `GRD-${prefix}-${String(nextNum).padStart(3, '0')}`
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sku) => {
    setIsEditing(true);
    setEditingSkuId(sku.id || sku.code);
    setFormErrors({});
    setFormData({
      code: sku.code || '',
      brandName: sku.brandName || '',
      name: sku.name || '',
      category: sku.category || 'Tablets',
      therapeuticClass: sku.therapeuticClass || 'Analgesic & Antipyretic',
      dosageForm: sku.dosageForm || 'Film-coated Tablet',
      packSize: sku.packSize || '10 x 10 Blister',
      hsnCode: sku.hsnCode || '30049099',
      gstRate: sku.gstRate || 12,
      vitalCategory: sku.vitalCategory || 'Essential (VED-E)',
      shelfLifeMonths: sku.shelfLifeMonths || 24,
      storageCondition: sku.storageCondition || 'Store below 25°C in dry place',
      isColdChain: sku.isColdChain || false,
      costPrice: sku.costPrice || 22,
      tradePrice: sku.tradePrice || 45,
      mrp: sku.mrp || 65,
      minStock: sku.minStock || 1000,
      maxStock: sku.maxStock || 8000,
      reorderLevel: sku.reorderLevel || 2500,
      fastMoving: sku.fastMoving ?? true,
      description: sku.description || ''
    });
    setIsModalOpen(true);
  };

  // Auto-generate code
  const handleAutoGenerateSkuCode = () => {
    const prefixMap = {
      'Tablets': 'TAB',
      'Capsules': 'CAP',
      'Syrups': 'SYR',
      'Suspensions & Hygiene': 'HYG',
      'Injections': 'INJ',
      'Ointments': 'ONT'
    };
    const prefix = prefixMap[formData.category] || 'MED';
    const nextNum = skus.filter(s => s.code?.includes(`GRD-${prefix}`)).length + 1;
    const generated = `GRD-${prefix}-${String(nextNum).padStart(3, '0')}`;
    setFormData(prev => ({ ...prev, code: generated }));
    setFormErrors(prev => ({ ...prev, code: null }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.code?.trim()) {
      errors.code = 'Medicine / SKU Code is required.';
    } else if (!isEditing) {
      const dup = skus.find(s => s.code?.toLowerCase() === formData.code.trim().toLowerCase());
      if (dup) errors.code = `Code "${formData.code}" already exists in Master Formulary!`;
    }

    if (!formData.brandName?.trim()) errors.brandName = 'Commercial Brand Name is required.';
    if (!formData.name?.trim()) errors.name = 'Generic Medicine Name & Strength is required.';
    if (!formData.packSize?.trim()) errors.packSize = 'Pack size specification required.';
    if (Number(formData.tradePrice) <= 0) errors.tradePrice = 'Trade Price must be > 0.';
    if (Number(formData.mrp) <= 0) errors.mrp = 'MRP must be > 0.';
    if (Number(formData.mrp) < Number(formData.tradePrice)) {
      errors.mrp = 'MRP cannot be less than Distributor Trade Price.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please correct the validation errors before saving.');
      return;
    }

    try {
      if (isEditing) {
        updateMasterSku({
          skuId: editingSkuId,
          skuData: formData,
          user: currentUser
        });
        setSkus(prev => prev.map(s => (s.id === editingSkuId || s.code === formData.code) ? { ...s, ...formData } : s));
        toast.success(`Medicine ${formData.brandName} (${formData.code}) updated successfully!`);
      } else {
        const created = registerMasterSku({
          skuData: formData,
          user: currentUser
        });
        setSkus(prev => [created || { ...formData, id: `SKU-${Date.now()}` }, ...prev]);
        toast.success(`Medicine ${formData.brandName} (${formData.code}) registered into Master Formulary!`);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err.message || 'Operation failed.');
    }
  };

  const handleConfirmArchive = () => {
    if (!deleteConfirmSku) return;
    try {
      const res = deleteMasterSku({
        skuId: deleteConfirmSku.id,
        skuCode: deleteConfirmSku.code,
        user: currentUser
      });

      // Synchronously update local React state so row is removed from table instantly
      setSkus(prev => prev.filter(s => s.id !== deleteConfirmSku.id && s.code !== deleteConfirmSku.code));

      if (res.archived) {
        toast.warning(`Formulation ${deleteConfirmSku.brandName || deleteConfirmSku.code} archived. Historical batches and orders preserved.`);
      } else {
        toast.success(`Formulation ${deleteConfirmSku.code} permanently deleted from Formulary.`);
      }
      setDeleteConfirmSku(null);
    } catch (err) {
      toast.error(err.message || 'Error archiving formulation');
    }
  };

  // Filtered SKUs
  const filteredSkus = skus.filter(sku => {
    // Status filter
    const isArchived = sku.activeStatus?.includes('Archived');
    if (statusFilter === 'Active' && isArchived) return false;
    if (statusFilter === 'Archived' && !isArchived) return false;

    const matchesSearch = !searchQuery ||
      sku.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sku.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sku.brandName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'All' || sku.category === selectedCategory;
    const matchesVed = vedFilter === 'All' ||
      (vedFilter === 'Vital' && sku.vitalCategory?.includes('VED-V')) ||
      (vedFilter === 'Essential' && sku.vitalCategory?.includes('VED-E')) ||
      (vedFilter === 'Desirable' && sku.vitalCategory?.includes('VED-D'));

    const matchesColdChain = coldChainFilter === 'All' ||
      (coldChainFilter === 'Cold Chain' && sku.isColdChain === true) ||
      (coldChainFilter === 'Ambient' && sku.isColdChain !== true);

    const matchesFast = !fastMovingOnly || sku.fastMoving === true;

    return matchesSearch && matchesCat && matchesVed && matchesColdChain && matchesFast;
  });

  // Dynamic statistics
  const totalSkusCount = skus.filter(s => !s.activeStatus?.includes('Archived')).length;
  const vitalCount = skus.filter(s => s.vitalCategory?.includes('VED-V') && !s.activeStatus?.includes('Archived')).length;
  const essentialCount = skus.filter(s => s.vitalCategory?.includes('VED-E') && !s.activeStatus?.includes('Archived')).length;
  const avgMargin = (
    skus.reduce((acc, s) => {
      const margin = s.mrp > 0 ? ((s.mrp - (s.costPrice || s.tradePrice * 0.7)) / s.mrp) * 100 : 35;
      return acc + margin;
    }, 0) / (skus.length || 1)
  ).toFixed(1);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['SKU Code', 'Brand Name', 'Generic Formulation', 'Category', 'Pack Size', 'Trade Price', 'MRP', 'Min Stock', 'Max Stock', 'Shelf Life (M)', 'VED Priority'];
    const rows = filteredSkus.map(s => [
      `"${s.code}"`,
      `"${s.brandName || ''}"`,
      `"${s.name}"`,
      `"${s.category}"`,
      `"${s.packSize || ''}"`,
      s.tradePrice,
      s.mrp,
      s.minStock,
      s.maxStock,
      s.shelfLifeMonths,
      `"${s.vitalCategory || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GRD_Master_Formulary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Formulary master list exported to CSV.');
  };

  const columns = [
    {
      header: 'Medicine Code & Brand',
      accessor: 'code',
      className: 'whitespace-nowrap min-w-[140px]',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-navy-950 text-xs whitespace-nowrap">{row.code}</span>
          <div className="text-xs font-bold text-terracotta-700 whitespace-nowrap">{row.brandName}</div>
        </div>
      )
    },
    {
      header: 'Generic Medicine Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-semibold text-navy-900 text-xs">{row.name}</div>
          <div className="text-xs text-slate-500 font-light">{row.dosageForm}</div>
        </div>
      )
    },
    {
      header: 'Type & Pack Size',
      accessor: 'category',
      className: 'whitespace-nowrap',
      render: (row) => (
        <div>
          <span className="text-xs font-medium text-slate-800">{row.category}</span>
          <div className="text-xs text-slate-500 font-light">{row.packSize}</div>
        </div>
      )
    },
    {
      header: 'Distributor Price & MRP',
      accessor: 'tradePrice',
      align: 'right',
      className: 'whitespace-nowrap',
      sortValue: (row) => row.tradePrice,
      render: (row) => (
        <div className="text-right font-sans">
          <div className="font-bold text-navy-950 text-xs">₹{Number(row.tradePrice).toFixed(2)}</div>
          <div className="text-xs text-slate-400">MRP: ₹{Number(row.mrp).toFixed(2)}</div>
        </div>
      )
    },
    {
      header: 'Min / Max Safe Stock',
      align: 'center',
      className: 'whitespace-nowrap',
      sortValue: (row) => row.minStock,
      render: (row) => (
        <div className="text-center font-sans text-xs">
          <span className="text-slate-600">{formatNumber(row.minStock)}</span>
          <span className="text-slate-300 mx-1">/</span>
          <span className="text-slate-900 font-semibold">{formatNumber(row.maxStock)}</span>
        </div>
      )
    },
    {
      header: 'Shelf Life',
      accessor: 'shelfLifeMonths',
      align: 'center',
      className: 'whitespace-nowrap',
      sortValue: (row) => row.shelfLifeMonths,
      render: (row) => (
        <div className="text-center font-sans text-xs">
          <span className="inline-block bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200/80 font-semibold text-2xs">
            {row.shelfLifeMonths} Months
          </span>
        </div>
      )
    },
    {
      header: 'Priority Level',
      accessor: 'vitalCategory',
      align: 'center',
      className: 'whitespace-nowrap',
      render: (row) => {
        const isVital = row.vitalCategory?.includes('VED-V');
        const isEssential = row.vitalCategory?.includes('VED-E');
        return (
          <Badge variant={isVital ? 'danger' : isEssential ? 'info' : 'neutral'}>
            {row.vitalCategory?.split(' ')[0] || 'Essential'}
          </Badge>
        );
      }
    },
    {
      header: 'Actions',
      align: 'center',
      sortable: false,
      className: 'whitespace-nowrap',
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-center">
          <Button
            variant="outline"
            size="xs"
            onClick={() => setSelectedSku(row)}
            icon={Eye}
            title="Inspect Formulary Details"
          >
            Inspect
          </Button>
          <Button
            variant="ghost"
            size="xs"
            className="text-navy-900 hover:text-navy-950 hover:bg-slate-100 p-1.5"
            onClick={() => handleOpenEditModal(row)}
            icon={Edit2}
            title="Edit Formulation"
          />
          <Button
            variant="ghost"
            size="xs"
            className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1.5"
            onClick={() => setDeleteConfirmSku(row)}
            icon={Trash2}
            title="Archive Medicine"
          />
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
              Medicines (SKUs)
            </h1>
            <span className="text-xs bg-navy-100 text-navy-800 font-semibold px-2 py-0.5 rounded-full">
              Formulary Master
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
            Browse, search, and manage all pharmaceutical formulations, pricing schedules, safety stock limits, and clinical details.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAddModal}
            icon={Plus}
            className="shadow-sm bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold cursor-pointer"
          >
            Add New Medicine
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Medicines"
          value={totalSkusCount}
          subtitle="Active medicines in catalog"
          icon={Pill}
          trend={{ direction: 'up', text: '+18.4% YoY Growth' }}
          badge={{ text: 'Active Formulations', variant: 'info' }}
        />
        <StatCard
          title="Vital Medicines (Life-Saving)"
          value={vitalCount}
          subtitle="Zero-stockout SLA"
          icon={Activity}
          badge={{ text: 'High Priority', variant: 'danger' }}
        />
        <StatCard
          title="Essential Medicines"
          value={essentialCount}
          subtitle="Hospital tenders & standard care"
          icon={Layers}
          trend={{ direction: 'up', text: 'Daily replenishment' }}
          badge={{ text: 'Essential', variant: 'info' }}
        />
        <StatCard
          title="Average Selling Price"
          value={`₹${(skus.reduce((a, b) => a + (b.tradePrice || 0), 0) / (skus.length || 1)).toFixed(1)}`}
          subtitle="Average trade price"
          icon={DollarSign}
          trend={{ direction: 'up', text: `+${avgMargin}% Gross Margin` }}
          badge={{ text: 'Healthy Margin', variant: 'success' }}
        />
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 text-xs">
        {/* Top Tier: Primary Search & Quick Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search code, generic or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-navy-900 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80 transition-colors">
              <input
                type="checkbox"
                checked={fastMovingOnly}
                onChange={(e) => setFastMovingOnly(e.target.checked)}
                className="rounded text-navy-900 focus:ring-navy-900 border-slate-300 w-3.5 h-3.5 cursor-pointer"
              />
              <span>Fast-Moving Only</span>
            </label>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                title="Reset all active filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            <span className="text-2xs font-semibold text-slate-400 border-l border-slate-200 pl-3 hidden sm:inline">
              Showing <span className="font-bold text-navy-900">{filteredSkus.length}</span> of {skus.length} medicines
            </span>
          </div>
        </div>

        {/* Bottom Tier: Specification Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-slate-100">
          <div className="relative flex-1 sm:flex-none min-w-[135px]">
            <Filter className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-7 sm:pl-8 pr-6 sm:pr-7 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-[11px] sm:text-xs font-medium focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 sm:flex-none min-w-[130px]">
            <ShieldCheck className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={vedFilter}
              onChange={(e) => setVedFilter(e.target.value)}
              className="w-full pl-7 sm:pl-8 pr-6 sm:pr-7 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-[11px] sm:text-xs font-medium focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
            >
              <option value="All">All VED Tiers</option>
              <option value="Vital">Vital (Life-Saving)</option>
              <option value="Essential">Essential (Standard)</option>
              <option value="Desirable">Desirable (Elective)</option>
            </select>
          </div>

          <div className="relative flex-1 sm:flex-none min-w-[135px]">
            <Activity className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-7 sm:pl-8 pr-6 sm:pr-7 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-[11px] sm:text-xs font-medium focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
            >
              <option value="Active">Active Formulations</option>
              <option value="Archived">Archived / Discontinued</option>
              <option value="All">All Statuses</option>
            </select>
          </div>

          <div className="relative flex-1 sm:flex-none min-w-[125px]">
            <ThermometerSnowflake className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={coldChainFilter}
              onChange={(e) => setColdChainFilter(e.target.value)}
              className="w-full pl-7 sm:pl-8 pr-6 sm:pr-7 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-[11px] sm:text-xs font-medium focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
            >
              <option value="All">All Storage</option>
              <option value="Cold Chain">Cold Chain (2°C - 8°C)</option>
              <option value="Ambient">Ambient (&lt;25°C)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <Table
        title="Medicine Formulary List"
        subtitle="Registered pharmaceuticals, price schedules, and warehouse buffer thresholds"
        columns={columns}
        data={filteredSkus}
        keyExtractor={(row) => row.code || row.id}
        pageSize={10}
        exportable={true}
        exportFilename={`GRD_Medicines_Formulary_${new Date().toISOString().split('T')[0]}`}
        emptyMessage="No medicines found matching the selected search or filters."
      />

      {/* Add / Edit Medicine Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={isEditing ? `Edit Medicine Formulation (${formData.code})` : "Add New Medicine"}
          subtitle={isEditing ? "Update formulary specifications, pricing, or safety buffer limits" : "Register a new pharmaceutical formulation into the GRD Master Formulary"}
          maxWidth="max-w-3xl"
        >
          <form onSubmit={handleSubmitForm} className="space-y-4 text-xs text-slate-700">

            {/* Section 1: Molecule & Brand */}
            <div>
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-terracotta-600" />
                1. General Formulation & Brand Identification
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-2xs font-bold text-slate-500 uppercase">SKU / Medicine Code *</label>
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={handleAutoGenerateSkuCode}
                        className="text-2xs text-terracotta-600 hover:text-terracotta-700 font-semibold"
                      >
                        Auto-Gen
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    disabled={isEditing}
                    placeholder="e.g. GRD-TAB-010"
                    value={formData.code}
                    onChange={(e) => {
                      setFormData({ ...formData, code: e.target.value.toUpperCase() });
                      setFormErrors(prev => ({ ...prev, code: null }));
                    }}
                    className={`input py-2 text-xs w-full uppercase font-mono ${formErrors.code ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {formErrors.code && <p className="text-2xs text-rose-600 mt-1">{formErrors.code}</p>}
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Commercial Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DoloGRD-650"
                    value={formData.brandName}
                    onChange={(e) => {
                      setFormData({ ...formData, brandName: e.target.value });
                      setFormErrors(prev => ({ ...prev, brandName: null }));
                    }}
                    className={`input py-2 text-xs w-full ${formErrors.brandName ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {formErrors.brandName && <p className="text-2xs text-rose-600 mt-1">{formErrors.brandName}</p>}
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input py-2 text-xs w-full bg-slate-50"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Generic Medicine Name & Strength *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paracetamol 650mg Tablets IP"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setFormErrors(prev => ({ ...prev, name: null }));
                    }}
                    className={`input py-2 text-xs w-full ${formErrors.name ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {formErrors.name && <p className="text-2xs text-rose-600 mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Therapeutic Class</label>
                  <input
                    type="text"
                    placeholder="e.g. Analgesic, Broad Spectrum Antibiotic"
                    value={formData.therapeuticClass}
                    onChange={(e) => setFormData({ ...formData, therapeuticClass: e.target.value })}
                    className="input py-2 text-xs w-full"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Packaging & Clinical Specs */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5 text-navy-700" />
                2. Packaging, Storage & Clinical Priority
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Dosage Form</label>
                  <input
                    type="text"
                    placeholder="e.g. Film-coated Tablet"
                    value={formData.dosageForm}
                    onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                    className="input py-2 text-xs w-full"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Pack Size *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10 x 10 Blister"
                    value={formData.packSize}
                    onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                    className="input py-2 text-xs w-full"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Shelf Life (Months)</label>
                  <input
                    type="number"
                    min="6"
                    max="60"
                    value={formData.shelfLifeMonths}
                    onChange={(e) => setFormData({ ...formData, shelfLifeMonths: Number(e.target.value) })}
                    className="input py-2 text-xs w-full"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">VED Priority Tier</label>
                  <select
                    value={formData.vitalCategory}
                    onChange={(e) => setFormData({ ...formData, vitalCategory: e.target.value })}
                    className="input py-2 text-xs w-full bg-slate-50"
                  >
                    <option value="Vital (VED-V)">Vital (Life-Saving, Zero Stockout)</option>
                    <option value="Essential (VED-E)">Essential (Standard Formulary)</option>
                    <option value="Desirable (VED-D)">Desirable (Elective Support)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isColdChain}
                    onChange={(e) => setFormData({ ...formData, isColdChain: e.target.checked })}
                    className="rounded text-navy-900 focus:ring-navy-900 border-slate-300"
                  />
                  <span className="flex items-center gap-1">
                    <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-600" />
                    Cold Chain Storage Required (2°C – 8°C)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.fastMoving}
                    onChange={(e) => setFormData({ ...formData, fastMoving: e.target.checked })}
                    className="rounded text-navy-900 focus:ring-navy-900 border-slate-300"
                  />
                  <span>Fast-Moving Formulation</span>
                </label>
              </div>
            </div>

            {/* Section 3: Commercial Pricing & Margins */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                3. Commercial Pricing Schedule
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                    className="input py-2 text-xs w-full"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Distributor Trade Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={formData.tradePrice}
                    onChange={(e) => setFormData({ ...formData, tradePrice: parseFloat(e.target.value) || 0 })}
                    className={`input py-2 text-xs w-full ${formErrors.tradePrice ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {formErrors.tradePrice && <p className="text-2xs text-rose-600 mt-1">{formErrors.tradePrice}</p>}
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: parseFloat(e.target.value) || 0 })}
                    className={`input py-2 text-xs w-full ${formErrors.mrp ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {formErrors.mrp && <p className="text-2xs text-rose-600 mt-1">{formErrors.mrp}</p>}
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">GST Rate (%)</label>
                  <select
                    value={formData.gstRate}
                    onChange={(e) => setFormData({ ...formData, gstRate: Number(e.target.value) })}
                    className="input py-2 text-xs w-full bg-slate-50"
                  >
                    <option value={12}>12% (Standard Pharmaceuticals)</option>
                    <option value={5}>5% (Essential Drugs & IV Fluids)</option>
                    <option value={18}>18% (Disinfectants & Hygiene)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Supply Chain Buffer Thresholds */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                4. Warehouse Inventory Safe Stock Limits
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Safety Stock (Min Units)</label>
                  <input
                    type="number"
                    min="100"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value, 10) || 0 })}
                    className="input py-2 text-xs w-full"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Reorder Level (ROL Units)</label>
                  <input
                    type="number"
                    min="100"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value, 10) || 0 })}
                    className="input py-2 text-xs w-full"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Max Depot Capacity (Units)</label>
                  <input
                    type="number"
                    min="100"
                    value={formData.maxStock}
                    onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value, 10) || 0 })}
                    className="input py-2 text-xs w-full"
                  />
                </div>
              </div>
            </div>

            {/* Sticky Action Footer - Always Pinned & Visible at Bottom */}
            <div className="sticky -bottom-4 sm:-bottom-6 bg-white/95 backdrop-blur-md pt-3 pb-1 -mx-4 px-4 sm:-mx-6 sm:px-6 border-t border-slate-200 flex items-center justify-end gap-2.5 z-20 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold px-5 shadow-sm cursor-pointer"
              >
                {isEditing ? 'Save Changes' : 'Register Formulation'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Drawer: Detailed Clinical & Stock View */}
      <Drawer
        isOpen={!!selectedSku}
        onClose={() => setSelectedSku(null)}
        title={selectedSku ? `${selectedSku.brandName || selectedSku.code} - Details` : ''}
        subtitle={selectedSku ? `${selectedSku.name} (${selectedSku.code})` : ''}
        width="w-full sm:w-[500px]"
      >
        {selectedSku && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-2xs text-slate-400 font-bold uppercase">Formulary Status</span>
                <p className="font-bold text-navy-950 text-sm">{selectedSku.activeStatus || 'Active'}</p>
              </div>
              <Badge variant={selectedSku.vitalCategory?.includes('VED-V') ? 'danger' : 'info'}>
                {selectedSku.vitalCategory || 'Essential'}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <span className="text-2xs text-slate-400 font-bold">MRP</span>
                <p className="font-bold text-navy-950 text-sm mt-0.5">₹{Number(selectedSku.mrp).toFixed(2)}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <span className="text-2xs text-slate-400 font-bold">TRADE PRICE</span>
                <p className="font-bold text-terracotta-700 text-sm mt-0.5">₹{Number(selectedSku.tradePrice).toFixed(2)}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <span className="text-2xs text-slate-400 font-bold">COST PRICE</span>
                <p className="font-bold text-slate-700 text-sm mt-0.5">₹{Number(selectedSku.costPrice || 22).toFixed(2)}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
              <span className="text-2xs text-slate-400 font-bold uppercase">Packaging & Storage</span>
              <p><strong>Category:</strong> {selectedSku.category}</p>
              <p><strong>Pack Specification:</strong> {selectedSku.packSize}</p>
              <p><strong>Dosage Form:</strong> {selectedSku.dosageForm}</p>
              <p><strong>Shelf Life:</strong> {selectedSku.shelfLifeMonths} Months</p>
              <p><strong>Storage Condition:</strong> {selectedSku.storageCondition || 'Store in dry place below 25°C'}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
              <span className="text-2xs text-slate-400 font-bold uppercase">Warehouse Buffer Rules</span>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div>
                  <span className="text-2xs text-slate-500">Safety Stock</span>
                  <p className="font-bold text-navy-950">{formatNumber(selectedSku.minStock)}</p>
                </div>
                <div>
                  <span className="text-2xs text-slate-500">Reorder Level</span>
                  <p className="font-bold text-navy-950">{formatNumber(selectedSku.reorderLevel)}</p>
                </div>
                <div>
                  <span className="text-2xs text-slate-500">Depot Max</span>
                  <p className="font-bold text-navy-950">{formatNumber(selectedSku.maxStock)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                className="w-1/2"
                onClick={() => {
                  setSelectedSku(null);
                  handleOpenEditModal(selectedSku);
                }}
                icon={Edit2}
              >
                Edit Formulation
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-1/2 text-rose-600 hover:bg-rose-50 border-rose-200"
                onClick={() => {
                  setDeleteConfirmSku(selectedSku);
                  setSelectedSku(null);
                }}
                icon={Trash2}
              >
                Archive
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Archive Confirmation Modal */}
      {deleteConfirmSku && (
        <Modal
          isOpen={!!deleteConfirmSku}
          onClose={() => setDeleteConfirmSku(null)}
          title="Confirm Formulation Archive"
          subtitle={`Archive ${deleteConfirmSku.brandName || deleteConfirmSku.code} from active prescribing`}
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs text-slate-600">
            <p>
              Are you sure you want to archive <strong>{deleteConfirmSku.brandName || deleteConfirmSku.code}</strong>?
            </p>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-2xs space-y-1">
              <p className="font-bold">cGMP Regulatory Record Retention:</p>
              <p>If this formulation has active manufacturing batches or distributor orders, historical records are preserved and the item is marked as Archived / Discontinued.</p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <Button variant="outline" size="sm" onClick={() => setDeleteConfirmSku(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmArchive}>
                Confirm Archive
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
