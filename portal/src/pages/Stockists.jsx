import React, { useState } from 'react';
import {
  Users,
  Search,
  MapPin,
  Phone,
  RefreshCw,
  CheckCircle2,
  Store,
  Building2,
  Eye,
  Download,
  Wifi,
  Plus,
  Edit2,
  Trash2,
  CreditCard,
  RotateCcw,
  ShieldCheck
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
import { MOCK_STOCKISTS } from '../data/mockStockists';
import { MOCK_DISTRIBUTORS } from '../data/mockDistributors';

import { formatCurrency, formatNumber } from '../utils/formatters';
import { logActivity } from '../services/grdDataService';

const INITIAL_STOCKIST_FORM = {
  name: '',
  code: '',
  mappedDistributorId: 'DIST-001',
  mappedDistributorName: 'Pragjyotish Medico & Trade Agencies',
  tier: 'Tier 1 Stockist',
  state: 'Assam',
  city: 'Guwahati',
  location: '',
  contactPerson: '',
  phone: '+91 ',
  monthlyTurnoverINR: 500000,
  currentStockValueINR: 250000,
  mappedRetailersCount: 25,
  mappedHospitalsCount: 3,
  orderFrequency: 'Twice Weekly',
  stockoutIncidencePct: 4.5,
  inventorySyncStatus: 'Live POS Connected',
  activeStatus: 'Active'
};

export default function Stockists() {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [stockists, setStockists] = usePersistentState('grd_stockists_master', MOCK_STOCKISTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [distributorFilter, setDistributorFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [selectedStockist, setSelectedStockist] = useState(null);

  const hasActiveFilters = searchQuery.trim() !== '' ||
    stateFilter !== 'All' ||
    distributorFilter !== 'All' ||
    riskFilter !== 'All';

  const resetAllFilters = () => {
    setSearchQuery('');
    setStateFilter('All');
    setDistributorFilter('All');
    setRiskFilter('All');
  };

  // Add / Edit Stockist Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_STOCKIST_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirmStockist, setDeleteConfirmStockist] = useState(null);

  // Auto-generate unique Stockist code
  const handleAutoGenerateCode = (cityVal) => {
    const cityCode = (cityVal || formData.city || 'GHY').substring(0, 3).toUpperCase();
    const nextNum = stockists.length + 1;
    const generated = `GRD-STK-${cityCode}-${String(nextNum).padStart(3, '0')}`;
    setFormData(prev => ({ ...prev, code: generated }));
    setFormErrors(prev => ({ ...prev, code: null }));
  };

  const resetForm = () => {
    setFormData(INITIAL_STOCKIST_FORM);
    setFormErrors({});
    setIsEditing(false);
    setEditingId(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    const nextNum = stockists.length + 1;
    setFormData({
      ...INITIAL_STOCKIST_FORM,
      code: `GRD-STK-GHY-${String(nextNum).padStart(3, '0')}`
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (stk) => {
    setIsEditing(true);
    setEditingId(stk.id);
    setFormErrors({});
    setFormData({
      name: stk.name || '',
      code: stk.code || '',
      mappedDistributorId: stk.mappedDistributorId || 'DIST-001',
      mappedDistributorName: stk.mappedDistributorName || 'Pragjyotish Medico & Trade Agencies',
      tier: stk.tier || 'Tier 1 Stockist',
      state: stk.state || 'Assam',
      city: stk.city || (stk.location ? stk.location.split(',')[1]?.trim() : 'Guwahati'),
      location: stk.location || '',
      contactPerson: stk.contactPerson || '',
      phone: stk.phone || '+91 ',
      monthlyTurnoverINR: stk.monthlyTurnoverINR || 500000,
      currentStockValueINR: stk.currentStockValueINR || 250000,
      mappedRetailersCount: stk.mappedRetailersCount || 25,
      mappedHospitalsCount: stk.mappedHospitalsCount || 3,
      orderFrequency: stk.orderFrequency || 'Twice Weekly',
      stockoutIncidencePct: stk.stockoutIncidencePct || 4.5,
      inventorySyncStatus: stk.inventorySyncStatus || 'Live POS Connected',
      activeStatus: stk.activeStatus || 'Active'
    });
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = 'Stockist Agency Name is required.';
    if (!formData.code?.trim()) {
      errors.code = 'Stockist Code is required.';
    } else if (!isEditing) {
      const exists = stockists.some(s => s.code?.toLowerCase() === formData.code.trim().toLowerCase());
      if (exists) errors.code = `Code "${formData.code}" is already assigned to an existing stockist!`;
    }
    if (!formData.location?.trim()) errors.location = 'Specific town/street address is required.';
    if (!formData.contactPerson?.trim()) errors.contactPerson = 'Contact Officer name is required.';
    if (!formData.phone?.trim() || formData.phone.length < 8) errors.phone = 'Valid 10-digit mobile number required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitStockist = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the validation errors before saving.');
      return;
    }

    if (isEditing) {
      const updated = stockists.map(s => s.id === editingId ? {
        ...s,
        ...formData,
        id: editingId
      } : s);
      setStockists(updated);
      logActivity({
        type: 'CUSTOMER',
        action: `Stockist Profile Updated (${formData.code})`,
        details: `Updated details for ${formData.name} (${formData.location}).`,
        user: currentUser
      });
      toast.success(`Stockist ${formData.name} updated successfully!`);
    } else {
      const newStockist = {
        ...formData,
        id: `STK-${String(stockists.length + 1).padStart(3, '0')}`,
        inventorySyncStatus: 'Synced Just Now'
      };
      setStockists([newStockist, ...stockists]);
      logActivity({
        type: 'CUSTOMER',
        action: `New Stockist Enrolled (${newStockist.code})`,
        details: `Registered ${newStockist.name} mapped to ${newStockist.mappedDistributorName}.`,
        user: currentUser
      });
      toast.success(`Stockist ${newStockist.name} successfully registered and mapped to ${newStockist.mappedDistributorName}!`);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmStockist) return;
    setStockists(stockists.filter(s => s.id !== deleteConfirmStockist.id));
    logActivity({
      type: 'CUSTOMER',
      action: `Stockist Discontinued (${deleteConfirmStockist.code})`,
      details: `${deleteConfirmStockist.name} removed from active stockist roster.`,
      user: currentUser
    });
    toast.warning(`Stockist ${deleteConfirmStockist.name} removed from network.`);
    setDeleteConfirmStockist(null);
  };

  // Stats calculation
  const totalCount = stockists.length;
  const totalRetailers = stockists.reduce((acc, s) => acc + (Number(s.mappedRetailersCount) || 0), 0);
  const totalHospitals = stockists.reduce((acc, s) => acc + (Number(s.mappedHospitalsCount) || 0), 0);
  const totalStockValuation = stockists.reduce((acc, s) => acc + (Number(s.currentStockValueINR) || 0), 0);
  const avgStockoutIncidence = stockists.length > 0 
    ? (stockists.reduce((acc, s) => acc + (Number(s.stockoutIncidencePct) || 0), 0) / stockists.length).toFixed(1)
    : '0.0';

  // Filtered
  const filteredStockists = stockists.filter(stk => {
    const matchesSearch = (stk.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (stk.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (stk.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (stk.mappedDistributorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (stk.contactPerson || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = stateFilter === 'All' || stk.state === stateFilter;
    const matchesDistributor = distributorFilter === 'All' || stk.mappedDistributorName === distributorFilter;
    const matchesRisk = riskFilter === 'All' ||
      (riskFilter === 'Healthy' && stk.stockoutIncidencePct < 5) ||
      (riskFilter === 'Moderate' && stk.stockoutIncidencePct >= 5 && stk.stockoutIncidencePct <= 10) ||
      (riskFilter === 'High' && stk.stockoutIncidencePct > 10);
    return matchesSearch && matchesState && matchesDistributor && matchesRisk;
  });

  const columns = [
    {
      header: 'Stockist Name & Code',
      render: (row) => (
        <div>
          <div className="font-semibold text-navy-950 text-xs">{row.name}</div>
          <div className="text-2xs text-terracotta-700 font-sans font-medium">{row.code} • {row.tier}</div>
        </div>
      )
    },
    {
      header: 'Parent Distributor',
      render: (row) => (
        <div className="text-xs text-navy-800">
          <div className="font-medium text-navy-900">{row.mappedDistributorName}</div>
          <div className="text-2xs text-slate-500">{row.location}</div>
        </div>
      )
    },
    {
      header: 'Retail & Hospital Reach',
      render: (row) => (
        <div className="text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-navy-900">
            <Store className="w-3.5 h-3.5 text-navy-700/50" />
            <span>{row.mappedRetailersCount} Retailers</span>
          </div>
          <div className="text-2xs text-slate-500 pl-5">
            +{row.mappedHospitalsCount} Local Clinics/Hospitals
          </div>
        </div>
      )
    },
    {
      header: 'Current Stock Value',
      render: (row) => (
        <div className="text-right">
          <div className="font-semibold text-navy-950 text-xs">{formatCurrency(row.currentStockValueINR)}</div>
          <div className="text-2xs text-slate-400">Turnover: {formatCurrency(row.monthlyTurnoverINR)}/m</div>
        </div>
      )
    },
    {
      header: 'Stockout Rate',
      render: (row) => (
        <div className="text-center">
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
            row.stockoutIncidencePct > 8 ? 'bg-red-100 text-red-800' :
            row.stockoutIncidencePct > 5 ? 'bg-amber-100 text-amber-800' :
            'bg-emerald-100 text-emerald-800'
          }`}>
            {row.stockoutIncidencePct}%
          </span>
        </div>
      )
    },
    {
      header: 'Inventory Sync',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-2xs text-slate-600">
          <Wifi className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{row.inventorySyncStatus}</span>
        </div>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-center">
          <Button 
            variant="outline" 
            size="xs"
            onClick={() => setSelectedStockist(row)}
            icon={Eye}
            title="View Details"
          >
            Details
          </Button>
          <Button 
            variant="ghost" 
            size="xs"
            className="text-navy-900 hover:text-navy-950 hover:bg-slate-100 p-1.5"
            onClick={() => handleOpenEditModal(row)}
            icon={Edit2}
            title="Edit Stockist"
          />
          <Button 
            variant="ghost" 
            size="xs"
            className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1.5"
            onClick={() => setDeleteConfirmStockist(row)}
            icon={Trash2}
            title="Discontinue Stockist"
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
            <h1 className="text-2xl font-bold font-sans text-navy-950">
              Stockists
            </h1>
            <span className="text-xs bg-navy-100 text-navy-800 font-medium px-2 py-0.5 rounded-full">
              Local Network
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
            Local stockist network supplying retail chemists, rural pharmacies, and clinics across Northeast towns.
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
            Add New Stockist
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const headers = ['Stockist Name', 'Code', 'State', 'Location', 'Mapped Distributor', 'Monthly Turnover (INR)', 'Retailers Count', 'Stockout Rate %'];
              const rows = filteredStockists.map(s => [
                `"${s.name}"`,
                `"${s.code}"`,
                `"${s.state}"`,
                `"${s.location}"`,
                `"${s.mappedDistributorName}"`,
                s.monthlyTurnoverINR,
                s.mappedRetailersCount,
                s.stockoutIncidencePct
              ].join(','));
              const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `GRD_Stockists_Master_${new Date().toISOString().split('T')[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              toast.success('Stockist ledger exported (CSV)');
            }}
            icon={Download}
          >
            Download List (CSV)
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast.success(`Secondary POS inventory synchronization completed across ${stockists.length} stockists.`)}
            icon={RefreshCw}
          >
            Sync Stockist Data
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard 
          title="Active Stockists" 
          value={totalCount}
          subtitle="Secondary distribution nodes"
          icon={Building2}
        />
        <StatCard 
          title="Downstream Chemists" 
          value={formatNumber(totalRetailers)}
          subtitle="Retail pharmacy linkages"
          icon={Store}
        />
        <StatCard 
          title="Local Clinics Supplied" 
          value={totalHospitals}
          subtitle="Town nursing homes & CHCs"
          icon={Users}
        />
        <StatCard 
          title="Stockist Stock Value" 
          value={`₹${(totalStockValuation / 100000).toFixed(1)} Lakhs`}
          subtitle="Secondary channel buffer"
          icon={Building2}
        />
        <StatCard 
          title="Avg Stockout Incidence" 
          value={`${avgStockoutIncidence}%`}
          subtitle="NESFIC-I-09 target: < 6%"
          icon={CheckCircle2}
          trend={{ direction: 'down', text: 'Down from 12.8% baseline' }}
        />
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Select
              value={stateFilter}
              onChange={(val) => setStateFilter(val)}
              options={[
                { value: 'All', label: 'All Northeast States' },
                { value: 'Assam', label: 'Assam' },
                { value: 'Meghalaya', label: 'Meghalaya' },
                { value: 'Tripura', label: 'Tripura' },
                { value: 'Nagaland', label: 'Nagaland' },
                { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
                { value: 'Mizoram', label: 'Mizoram' },
                { value: 'Sikkim', label: 'Sikkim' }
              ]}
              icon={MapPin}
            />

            <Select
              value={distributorFilter}
              onChange={(val) => setDistributorFilter(val)}
              options={[
                { value: 'All', label: 'All C&F Distributors' },
                { value: 'Pragjyotish Medico & Trade Agencies', label: 'Pragjyotish Medico (GHY)' },
                { value: 'Brahmaputra Pharma Distributors', label: 'Brahmaputra Pharma' },
                { value: 'Barak Valley Healthcare Agency', label: 'Barak Valley Medico (Silchar)' },
                { value: 'Khasi Hills Medical Supplies', label: 'Khasi Hills Supplies (Shillong)' },
                { value: 'Tripura Meditech & Surgicals', label: 'Tripura Meditech (Agartala)' },
                { value: 'Naga Hills Pharma Logistics', label: 'Naga Hills Logistics (Dimapur)' }
              ]}
              icon={Building2}
            />

            <Select
              value={riskFilter}
              onChange={(val) => setRiskFilter(val)}
              options={[
                { value: 'All', label: 'All Risk Profiles' },
                { value: 'Healthy', label: 'Healthy Stock (<5%)' },
                { value: 'Moderate', label: 'Moderate Stockout (5-10%)' },
                { value: 'High', label: 'High Stockout Risk (>10%)' }
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
          </div>

          <div className="relative w-full lg:w-64">
            <Search className="w-4 h-4 text-navy-700/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search stockist, location or parent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 py-1.5 text-xs w-full"
            />
          </div>
        </div>
      </div>

      {/* Stockists Table */}
      <Table 
        title="Verified Stockists &amp; Retail Partners"
        subtitle="Primary pharmacy stockists, assigned C&F distributors, and POS synchronization status"
        columns={columns}
        data={filteredStockists}
        keyExtractor={(row) => row.id}
        emptyMessage="No stockists found matching criteria."
      />

      {/* Add / Edit Stockist Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={isEditing ? `Edit Stockist (${formData.name})` : "Add New Stockist Partner"}
          subtitle={isEditing ? "Update secondary distribution agency information and retail connections" : "Register a new pharmacy stockist agency mapped to a regional C&F distributor"}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSubmitStockist} className="space-y-4 text-xs text-slate-700">
            
            {/* Section 1: Agency Identification */}
            <div>
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-terracotta-600" />
                1. Stockist Agency Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">
                    Stockist Agency Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kamakhya Medicos & Druggists"
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-2xs font-bold text-slate-500 uppercase">
                      Stockist Code *
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAutoGenerateCode(formData.city)}
                      className="text-2xs text-terracotta-600 hover:text-terracotta-700 font-semibold cursor-pointer"
                    >
                      Auto-Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GRD-STK-GHY-009"
                    value={formData.code}
                    onChange={(e) => {
                      setFormData({ ...formData, code: e.target.value.toUpperCase() });
                      setFormErrors(prev => ({ ...prev, code: null }));
                    }}
                    className={`input py-2 text-xs w-full font-mono uppercase ${formErrors.code ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {formErrors.code && <p className="text-2xs text-rose-600 mt-1">{formErrors.code}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">
                    Stockist Partner Tier
                  </label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="input py-2 text-xs w-full bg-slate-50"
                  >
                    <option value="Tier 1 Stockist">Tier 1 Stockist (Major Town Center &gt; 35 Chemists)</option>
                    <option value="Tier 2 Stockist">Tier 2 Stockist (District Town &bull; 15–35 Chemists)</option>
                    <option value="Rural Hospital Linkage">Rural Hospital Linkage (Subdivision &bull; Primary Health)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">
                    Parent C&amp;F Distributor *
                  </label>
                  <select
                    value={formData.mappedDistributorName}
                    onChange={(e) => {
                      const selectedDist = MOCK_DISTRIBUTORS.find(d => d.name === e.target.value);
                      setFormData({ 
                        ...formData, 
                        mappedDistributorName: e.target.value,
                        mappedDistributorId: selectedDist?.id || 'DIST-001'
                      });
                    }}
                    className="input py-2 text-xs w-full bg-slate-50"
                  >
                    {MOCK_DISTRIBUTORS.map(d => (
                      <option key={d.id} value={d.name}>{d.name} ({d.city})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Geographic Territory & Location */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                2. Geographic Location &amp; Contact
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="input py-2 text-xs w-full bg-slate-50"
                  >
                    <option value="Assam">Assam</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Sikkim">Sikkim</option>
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">City / Town *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Guwahati, Silchar, Jorhat"
                    value={formData.city}
                    onChange={(e) => {
                      setFormData({ ...formData, city: e.target.value });
                    }}
                    className="input py-2 text-xs w-full"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Street Address / Market *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fancy Bazaar, Kamrup"
                    value={formData.location}
                    onChange={(e) => {
                      setFormData({ ...formData, location: e.target.value });
                      setFormErrors(prev => ({ ...prev, location: null }));
                    }}
                    className={`input py-2 text-xs w-full ${formErrors.location ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {formErrors.location && <p className="text-2xs text-rose-600 mt-1">{formErrors.location}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Contact Officer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. Pranjal Saikia"
                    value={formData.contactPerson}
                    onChange={(e) => {
                      setFormData({ ...formData, contactPerson: e.target.value });
                      setFormErrors(prev => ({ ...prev, contactPerson: null }));
                    }}
                    className={`input py-2 text-xs w-full ${formErrors.contactPerson ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {formErrors.contactPerson && <p className="text-2xs text-rose-600 mt-1">{formErrors.contactPerson}</p>}
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Mobile / Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98640 00000"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      setFormErrors(prev => ({ ...prev, phone: null }));
                    }}
                    className={`input py-2 text-xs w-full ${formErrors.phone ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {formErrors.phone && <p className="text-2xs text-rose-600 mt-1">{formErrors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Section 3: Commercial Reach & Channel Buffer */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                3. Retail Network Reach &amp; Turnover
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Downstream Retailers</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.mappedRetailersCount}
                    onChange={(e) => setFormData({ ...formData, mappedRetailersCount: parseInt(e.target.value, 10) || 0 })}
                    className="input py-2 text-xs w-full"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Clinics / Hospitals</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.mappedHospitalsCount}
                    onChange={(e) => setFormData({ ...formData, mappedHospitalsCount: parseInt(e.target.value, 10) || 0 })}
                    className="input py-2 text-xs w-full"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Monthly Turnover (₹)</label>
                  <input
                    type="number"
                    step="10000"
                    min="10000"
                    value={formData.monthlyTurnoverINR}
                    onChange={(e) => setFormData({ ...formData, monthlyTurnoverINR: parseFloat(e.target.value) || 0 })}
                    className="input py-2 text-xs w-full"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Current Stock Value (₹)</label>
                  <input
                    type="number"
                    step="10000"
                    min="0"
                    value={formData.currentStockValueINR}
                    onChange={(e) => setFormData({ ...formData, currentStockValueINR: parseFloat(e.target.value) || 0 })}
                    className="input py-2 text-xs w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Replenishment Order Rhythm</label>
                  <select
                    value={formData.orderFrequency}
                    onChange={(e) => setFormData({ ...formData, orderFrequency: e.target.value })}
                    className="input py-2 text-xs w-full bg-slate-50"
                  >
                    <option value="Daily">Daily Restock (High Density)</option>
                    <option value="Twice Weekly">Twice Weekly (Standard Care)</option>
                    <option value="Weekly">Weekly (District Sub-Depot)</option>
                    <option value="Bi-Weekly">Bi-Weekly (Remote Hill Terrain)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">POS Inventory Sync Mode</label>
                  <select
                    value={formData.inventorySyncStatus}
                    onChange={(e) => setFormData({ ...formData, inventorySyncStatus: e.target.value })}
                    className="input py-2 text-xs w-full bg-slate-50"
                  >
                    <option value="Live POS Connected">Live POS Connected (Marg / Tally)</option>
                    <option value="Daily Batch Sync">Daily Batch Sync (End of Day)</option>
                    <option value="Manual Weekly Audit">Manual Weekly Audit</option>
                  </select>
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
                {isEditing ? 'Save Stockist Changes' : 'Register Stockist'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Stockist Detail Drawer */}
      <Drawer
        isOpen={!!selectedStockist}
        onClose={() => setSelectedStockist(null)}
        title={selectedStockist?.name || 'Stockist Overview'}
        subtitle={selectedStockist ? `${selectedStockist.code} • ${selectedStockist.tier}` : ''}
        size="md"
      >
        {selectedStockist && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3 bg-navy-50/80 rounded-xl space-y-2 border border-navy-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Stockist Code:</span>
                <span className="font-mono font-bold text-navy-950 bg-white px-2 py-0.5 rounded border border-navy-200">{selectedStockist.code}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Parent C&amp;F Distributor:</span>
                <span className="font-semibold text-navy-950">{selectedStockist.mappedDistributorName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Territory Location:</span>
                <span className="font-medium text-navy-900">{selectedStockist.location} ({selectedStockist.state})</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Order Rhythm:</span>
                <span className="font-medium text-terracotta-700">{selectedStockist.orderFrequency}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-2xs text-slate-500 block uppercase font-bold">Monthly Turnover</span>
                <span className="text-sm font-bold text-navy-950 mt-0.5 block">{formatCurrency(selectedStockist.monthlyTurnoverINR)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-2xs text-slate-500 block uppercase font-bold">Current Stock Value</span>
                <span className="text-sm font-bold text-navy-950 mt-0.5 block">{formatCurrency(selectedStockist.currentStockValueINR)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-2xs text-slate-500 block uppercase font-bold">Retail Chemists Mapped</span>
                <span className="text-sm font-bold text-navy-950 mt-0.5 block">{selectedStockist.mappedRetailersCount} Chemists</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-2xs text-slate-500 block uppercase font-bold">Local Clinics / Nursing</span>
                <span className="text-sm font-bold text-navy-950 mt-0.5 block">{selectedStockist.mappedHospitalsCount} Centers</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950">Communication &amp; Contact</h4>
              <div className="space-y-1 text-xs">
                <div>Contact Officer: <strong>{selectedStockist.contactPerson}</strong></div>
                <div>Mobile: <a href={`tel:${selectedStockist.phone}`} className="text-terracotta-600 font-semibold hover:underline">{selectedStockist.phone}</a></div>
                <div className="flex items-center gap-1.5 text-emerald-700 pt-1">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Inventory POS: {selectedStockist.inventorySyncStatus}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <Button 
                variant="outline" 
                size="sm"
                className="w-1/2"
                onClick={() => {
                  setSelectedStockist(null);
                  handleOpenEditModal(selectedStockist);
                }}
                icon={Edit2}
              >
                Edit Stockist
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                className="w-1/2 bg-navy-900 hover:bg-navy-950 text-white font-bold"
                onClick={() => toast.success(`Replenishment indent dispatched to ${selectedStockist.mappedDistributorName}`)}
              >
                Trigger Indent
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Discontinue / Delete Confirmation Modal */}
      {deleteConfirmStockist && (
        <Modal
          isOpen={!!deleteConfirmStockist}
          onClose={() => setDeleteConfirmStockist(null)}
          title="Discontinue Stockist Partner"
          subtitle={`Remove ${deleteConfirmStockist.name} from active distribution roster`}
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs text-slate-600">
            <p>
              Are you sure you want to remove <strong>{deleteConfirmStockist.name}</strong> ({deleteConfirmStockist.code}) from the active stockist network?
            </p>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-2xs space-y-1">
              <p className="font-bold">Downstream Supply Chain Impact:</p>
              <p>Removing this stockist will unmap its {deleteConfirmStockist.mappedRetailersCount} retail chemist linkages and {deleteConfirmStockist.mappedHospitalsCount} local clinics from distributor {deleteConfirmStockist.mappedDistributorName}.</p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <Button variant="outline" size="sm" onClick={() => setDeleteConfirmStockist(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmDelete}>
                Confirm Removal
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
