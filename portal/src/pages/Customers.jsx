import React, { useState } from 'react';
import {
  Building,
  Search,
  MapPin,
  Phone,
  HeartHandshake,
  ShieldCheck,
  Eye,
  Download,
  FileText,
  Activity,
  Plus,
  Edit2,
  Trash2,
  CreditCard,
  Hospital,
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
import { MOCK_CUSTOMERS, CUSTOMER_SEGMENTS } from '../data/mockCustomers';
import { MOCK_DISTRIBUTORS } from '../data/mockDistributors';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { logActivity } from '../services/grdDataService';

const INITIAL_CUSTOMER_FORM = {
  name: '',
  code: '',
  segment: 'Government Hospital',
  state: 'Assam',
  city: 'Guwahati',
  assignedDistributor: 'Pragjyotish Medico & Trade Agencies',
  mappedStockist: 'Dispur Valley Pharmaceuticals',
  contactPerson: '',
  phone: '+91 ',
  email: '',
  bedCount: 500,
  tenderContractValueINR: 5000000,
  monthlyIndentVolumeUnits: 8000,
  criticalSkusText: 'Handuser-C® Hospital Surgical Handrub 500ml, Paracetamol 650mg Tablets',
  fulfillmentRate: 95.0,
  leadTimeRequirementDays: 2,
  serviceLevelStatus: 'Excellent (Compliant)'
};

export default function Customers() {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [customers, setCustomers] = usePersistentState('grd_customers_master', MOCK_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('All Segments');
  const [stateFilter, setStateFilter] = useState('All');
  const [slaFilter, setSlaFilter] = useState('All');
  const [contractFilter, setContractFilter] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const hasActiveFilters = searchQuery.trim() !== '' ||
    segmentFilter !== 'All Segments' ||
    stateFilter !== 'All' ||
    slaFilter !== 'All' ||
    contractFilter !== 'All';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSegmentFilter('All Segments');
    setStateFilter('All');
    setSlaFilter('All');
    setContractFilter('All');
  };

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_CUSTOMER_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirmCust, setDeleteConfirmCust] = useState(null);

  // Auto-generate Customer code
  const handleAutoGenerateCode = (nameVal, cityVal) => {
    const raw = (nameVal || 'HOSPITAL').replace(/[^A-Za-z]/g, '').toUpperCase();
    const initials = raw.length > 4 ? raw.substring(0, 4) : raw;
    const cityCode = (cityVal || 'GHY').substring(0, 3).toUpperCase();
    const generated = `GRD-CUST-${initials}`;
    setFormData(prev => ({ ...prev, code: generated }));
    setFormErrors(prev => ({ ...prev, code: null }));
  };

  const resetForm = () => {
    setFormData(INITIAL_CUSTOMER_FORM);
    setFormErrors({});
    setIsEditing(false);
    setEditingId(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    const nextNum = customers.length + 1;
    setFormData({
      ...INITIAL_CUSTOMER_FORM,
      code: `GRD-CUST-HOSP${nextNum}`
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cust) => {
    setIsEditing(true);
    setEditingId(cust.id);
    setFormErrors({});
    setFormData({
      name: cust.name || '',
      code: cust.code || '',
      segment: cust.segment || 'Government Hospital',
      state: cust.state || 'Assam',
      city: cust.city || 'Guwahati',
      assignedDistributor: cust.assignedDistributor || 'Pragjyotish Medico & Trade Agencies',
      mappedStockist: cust.mappedStockist || 'Dispur Valley Pharmaceuticals',
      contactPerson: cust.contactPerson || '',
      phone: cust.phone || '+91 ',
      email: cust.email || '',
      bedCount: cust.bedCount || 0,
      tenderContractValueINR: cust.tenderContractValueINR || 0,
      monthlyIndentVolumeUnits: cust.monthlyIndentVolumeUnits || 5000,
      criticalSkusText: cust.criticalSkus ? cust.criticalSkus.join(', ') : 'Paracetamol 650mg Tablets',
      fulfillmentRate: cust.fulfillmentRate || 95.0,
      leadTimeRequirementDays: cust.leadTimeRequirementDays || 2,
      serviceLevelStatus: cust.serviceLevelStatus || 'Excellent (Compliant)'
    });
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = 'Institution / Hospital name is required.';
    if (!formData.code?.trim()) {
      errors.code = 'Account Code is required.';
    } else if (!isEditing) {
      const exists = customers.some(c => c.code?.toLowerCase() === formData.code.trim().toLowerCase());
      if (exists) errors.code = `Code "${formData.code}" already exists in Customer Accounts!`;
    }
    if (!formData.city?.trim()) errors.city = 'City / Town is required.';
    if (!formData.contactPerson?.trim()) errors.contactPerson = 'Procurement Officer or contact name required.';
    if (!formData.phone?.trim() || formData.phone.length < 8) errors.phone = 'Valid phone number required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitCustomer = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the validation errors before saving.');
      return;
    }

    const skusArray = formData.criticalSkusText
      ? formData.criticalSkusText.split(',').map(s => s.trim()).filter(Boolean)
      : ['Paracetamol 650mg Tablets'];

    if (isEditing) {
      const updated = customers.map(c => c.id === editingId ? {
        ...c,
        ...formData,
        id: editingId,
        criticalSkus: skusArray
      } : c);
      setCustomers(updated);
      logActivity({
        type: 'CUSTOMER',
        action: `Institutional Profile Updated (${formData.code})`,
        details: `Updated institutional profile for ${formData.name} (${formData.city}).`,
        user: currentUser
      });
      toast.success(`Account ${formData.name} updated successfully!`);
    } else {
      const newCustomer = {
        ...formData,
        id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
        criticalSkus: skusArray,
        lastOrderDate: new Date().toISOString().split('T')[0]
      };
      setCustomers([newCustomer, ...customers]);
      logActivity({
        type: 'CUSTOMER',
        action: `New Institution Registered (${newCustomer.code})`,
        details: `Enrolled ${newCustomer.name} (${newCustomer.segment} • ${newCustomer.city}).`,
        user: currentUser
      });
      toast.success(`Account ${newCustomer.name} registered into Healthcare Network!`);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmCust) return;
    setCustomers(customers.filter(c => c.id !== deleteConfirmCust.id));
    logActivity({
      type: 'CUSTOMER',
      action: `Institution Discontinued (${deleteConfirmCust.code})`,
      details: `${deleteConfirmCust.name} removed from active customer accounts.`,
      user: currentUser
    });
    toast.warning(`Account ${deleteConfirmCust.name} removed from network.`);
    setDeleteConfirmCust(null);
  };

  // Stats calculation
  const totalCount = customers.length;
  const totalBeds = customers.reduce((acc, c) => acc + (Number(c.bedCount) || 0), 0);
  const totalContractValuation = customers.reduce((acc, c) => acc + (Number(c.tenderContractValueINR) || 0), 0);
  const totalMonthlyIndent = customers.reduce((acc, c) => acc + (Number(c.monthlyIndentVolumeUnits) || 0), 0);
  const avgSla = customers.length > 0 
    ? (customers.reduce((acc, c) => acc + (Number(c.fulfillmentRate) || 0), 0) / customers.length).toFixed(1)
    : '0.0';

  // Filtered
  const filteredCustomers = customers.filter(cust => {
    const matchesSearch = (cust.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (cust.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (cust.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (cust.contactPerson || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cust.criticalSkus?.some(sku => sku.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSegment = segmentFilter === 'All Segments' || cust.segment === segmentFilter;
    const matchesState = stateFilter === 'All' || cust.state === stateFilter;
    const matchesSla = slaFilter === 'All' ||
      (slaFilter === 'Excellent' && (cust.fulfillmentRate >= 95 || cust.serviceLevelStatus?.includes('Excellent'))) ||
      (slaFilter === 'Acceptable' && (cust.fulfillmentRate >= 90 && cust.fulfillmentRate < 95)) ||
      (slaFilter === 'At Risk' && cust.fulfillmentRate < 90);
    const matchesContract = contractFilter === 'All' ||
      (contractFilter === 'Tier 1' && cust.tenderContractValueINR >= 10000000) ||
      (contractFilter === 'Tier 2' && cust.tenderContractValueINR >= 5000000 && cust.tenderContractValueINR < 10000000) ||
      (contractFilter === 'Standard' && cust.tenderContractValueINR < 5000000);
    return matchesSearch && matchesSegment && matchesState && matchesSla && matchesContract;
  });

  const columns = [
    {
      header: 'Institution / Customer',
      className: 'min-w-[180px]',
      render: (row) => (
        <div>
          <div className="font-semibold text-navy-950 text-xs">{row.name}</div>
          <div className="text-2xs text-terracotta-700 font-sans font-medium">{row.code}</div>
        </div>
      )
    },
    {
      header: 'Segment & Location',
      className: 'min-w-[170px]',
      render: (row) => (
        <div>
          <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-navy-100 text-navy-800">
            {row.segment}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-700 mt-1">
            <MapPin className="w-3 h-3 text-terracotta-600" />
            <span>{row.city}, {row.state}</span>
            {row.bedCount > 0 && (
              <span className="text-2xs font-medium text-slate-500">({formatNumber(row.bedCount)} beds)</span>
            )}
          </div>
        </div>
      )
    },
    {
      header: 'Tender / Indent Value',
      align: 'right',
      className: 'whitespace-nowrap',
      sortValue: (row) => row.tenderContractValueINR || 0,
      render: (row) => (
        <div className="text-right font-sans">
          <div className="font-semibold text-navy-950 text-xs">
            {row.tenderContractValueINR ? formatCurrency(row.tenderContractValueINR) : 'Rate Order'}
          </div>
          <div className="text-2xs text-slate-400">{formatNumber(row.monthlyIndentVolumeUnits)} units/mo</div>
        </div>
      )
    },
    {
      header: 'Key Essential Formulations',
      className: 'min-w-[200px]',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.criticalSkus?.slice(0, 2).map((sku, idx) => (
            <span key={idx} className="text-2xs bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
              {sku}
            </span>
          ))}
          {row.criticalSkus?.length > 2 && (
            <span className="text-2xs text-slate-400 self-center">+{row.criticalSkus.length - 2} more</span>
          )}
        </div>
      )
    },
    {
      header: 'Fulfillment SLA',
      align: 'center',
      className: 'whitespace-nowrap min-w-[120px]',
      sortValue: (row) => row.fulfillmentRate,
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-2xs font-sans gap-2">
            <span className="font-bold text-navy-900">{row.fulfillmentRate}%</span>
            <span className="text-slate-400 whitespace-nowrap">{row.leadTimeRequirementDays}d lead time</span>
          </div>
          <div className="w-full max-w-[110px] bg-slate-100 rounded-full h-1 overflow-hidden border border-slate-200 mx-auto">
            <div 
              className={`h-full rounded-full ${row.fulfillmentRate >= 95 ? 'bg-emerald-600' : 'bg-amber-500'}`}
              style={{ width: `${row.fulfillmentRate}%` }}
            />
          </div>
        </div>
      )
    },
    {
      header: 'Service Level',
      align: 'center',
      headerClassName: 'text-center',
      className: 'text-center whitespace-nowrap',
      render: (row) => {
        const rawStatus = row.serviceLevelStatus || 'Good';
        let cleanLabel = rawStatus.split(' (')[0];
        let variant = 'info';
        if (rawStatus.includes('At Risk') || rawStatus.includes('Delayed') || (row.fulfillmentRate && row.fulfillmentRate < 90)) {
          variant = 'danger';
          cleanLabel = 'At Risk';
        } else if (rawStatus.includes('Excellent') || rawStatus.includes('Compliant')) {
          variant = 'success';
          cleanLabel = rawStatus.includes('Excellent') ? 'Excellent' : 'Compliant';
        } else if (rawStatus.includes('Priority')) {
          variant = 'warning';
          cleanLabel = 'Priority';
        }
        return (
          <div className="flex justify-center">
            <Badge variant={variant} className="whitespace-nowrap">
              {cleanLabel}
            </Badge>
          </div>
        );
      }
    },
    {
      header: 'Actions',
      align: 'center',
      headerClassName: 'text-center whitespace-nowrap min-w-[130px]',
      className: 'text-center whitespace-nowrap min-w-[130px]',
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-center">
          <Button 
            variant="outline" 
            size="xs"
            onClick={() => setSelectedCustomer(row)}
            icon={Eye}
            title="View Institutional Account"
          >
            View Account
          </Button>
          <Button 
            variant="ghost" 
            size="xs"
            className="text-navy-900 hover:text-navy-950 hover:bg-slate-100 p-1.5"
            onClick={() => handleOpenEditModal(row)}
            icon={Edit2}
            title="Edit Account"
          />
          <Button 
            variant="ghost" 
            size="xs"
            className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1.5"
            onClick={() => setDeleteConfirmCust(row)}
            icon={Trash2}
            title="Remove Account"
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-sans text-navy-950">
              Hospitals &amp; Stores
            </h1>
            <span className="text-xs bg-navy-100 text-navy-800 font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
              Healthcare Network
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
            Government hospitals, private medical colleges, and retail pharmacy chains across Assam and Northeast states.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleOpenAddModal}
            icon={Plus}
            className="shadow-sm bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold cursor-pointer whitespace-nowrap"
          >
            Add New Account
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const headers = ['Customer Name', 'Code', 'Segment', 'City', 'State', 'Beds', 'Contract Value (INR)', 'Monthly Indent (Units)', 'Fulfillment Rate %'];
              const rows = filteredCustomers.map(c => [
                `"${c.name}"`,
                `"${c.code}"`,
                `"${c.segment}"`,
                `"${c.city}"`,
                `"${c.state}"`,
                c.bedCount || 0,
                c.tenderContractValueINR || 0,
                c.monthlyIndentVolumeUnits || 0,
                c.fulfillmentRate || 0
              ].join(','));
              const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `GRD_Healthcare_Network_${new Date().toISOString().split('T')[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              toast.success('Hospital & Customer master downloaded (CSV)');
            }}
            icon={Download}
            className="whitespace-nowrap"
          >
            Download List (CSV)
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast.info('Rate contract renewal desk active for 14 hospital partners.')}
            icon={HeartHandshake}
            className="whitespace-nowrap"
          >
            Hospital Tenders
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard 
          title="Active Accounts" 
          value={totalCount}
          subtitle="Hospitals, Defense & Chains"
          icon={Building}
        />
        <StatCard 
          title="Tender Contract Value" 
          value={`₹${(totalContractValuation / 10000000).toFixed(2)} Cr`}
          subtitle="Annualized institutional supply"
          icon={FileText}
        />
        <StatCard 
          title="Hospital Beds Serviced" 
          value={formatNumber(totalBeds)}
          subtitle="GMCH, AMCH, SMCH, NEIGRIHMS"
          icon={Activity}
        />
        <StatCard 
          title="Monthly Indent Units" 
          value={formatNumber(totalMonthlyIndent)}
          subtitle="Guaranteed off-take volume"
          icon={ShieldCheck}
        />
        <StatCard 
          title="Avg Fulfilment SLA" 
          value={`${avgSla}%`}
          subtitle="Target: ≥ 95% adherence"
          icon={HeartHandshake}
          trend={{ direction: 'up', text: '+8.3% under NESFIC-I-09' }}
        />
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={segmentFilter}
              onChange={(val) => setSegmentFilter(val)}
              options={CUSTOMER_SEGMENTS}
              icon={Building}
            />

            <Select
              value={stateFilter}
              onChange={(val) => setStateFilter(val)}
              options={[
                { value: 'All', label: 'All States' },
                { value: 'Assam', label: 'Assam' },
                { value: 'Meghalaya', label: 'Meghalaya' },
                { value: 'Tripura', label: 'Tripura' },
                { value: 'Nagaland', label: 'Nagaland' },
                { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' }
              ]}
              icon={MapPin}
            />

            <Select
              value={slaFilter}
              onChange={(val) => setSlaFilter(val)}
              options={[
                { value: 'All', label: 'All SLA Levels' },
                { value: 'Excellent', label: 'Excellent (≥95%)' },
                { value: 'Acceptable', label: 'Acceptable (90-94%)' },
                { value: 'At Risk', label: 'At Risk (<90%)' }
              ]}
              icon={ShieldCheck}
            />

            <Select
              value={contractFilter}
              onChange={(val) => setContractFilter(val)}
              options={[
                { value: 'All', label: 'All Contract Sizes' },
                { value: 'Tier 1', label: 'Tier 1 (≥₹1.0 Cr)' },
                { value: 'Tier 2', label: 'Tier 2 (₹50L - ₹1.0 Cr)' },
                { value: 'Standard', label: 'Standard (<₹50L)' }
              ]}
              icon={CreditCard}
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
              placeholder="Search hospital, city or medicine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 py-1.5 text-xs w-full"
            />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <Table 
        title="Hospital &amp; Institutional Accounts"
        subtitle="Government medical colleges, defense hospitals, and pharmacy retail chains"
        columns={columns}
        data={filteredCustomers}
        keyExtractor={(row) => row.id}
        compact={true}
        emptyMessage="No customer accounts found matching criteria."
      />

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={isEditing ? `Edit Account (${formData.name})` : "Register Hospital / Store Account"}
          subtitle={isEditing ? "Update institutional account details, bed strength, and rate contracts" : "Enroll a new government hospital, medical college, defense hospital, or retail chain"}
          maxWidth="max-w-3xl"
        >
          <form onSubmit={handleSubmitCustomer} className="space-y-4 text-xs text-slate-700">
            
            {/* Section 1: Institution Identification */}
            <div>
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Hospital className="w-3.5 h-3.5 text-terracotta-600" />
                1. Institutional Profile &amp; Classification
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">
                    Institution / Hospital Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tezpur Medical College & Hospital (TMCH)"
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
                      Account Code *
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAutoGenerateCode(formData.name, formData.city)}
                      className="text-2xs text-terracotta-600 hover:text-terracotta-700 font-semibold cursor-pointer"
                    >
                      Auto-Gen
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GRD-CUST-TMCH"
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">
                    Customer Segment *
                  </label>
                  <select
                    value={formData.segment}
                    onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                    className="input py-2 text-xs w-full bg-slate-50"
                  >
                    <option value="Government Hospital">Government Medical College / Hospital</option>
                    <option value="Private Hospital">Private Hospital &amp; Research Center</option>
                    <option value="Defense & Railways">Defense &amp; Railways Base Hospital</option>
                    <option value="Retail Chain">Organized Retail Pharmacy Chain</option>
                    <option value="Standalone Pharmacy">High-Volume Standalone Pharmacy</option>
                  </select>
                </div>

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
                    placeholder="e.g. Tezpur, Silchar, Guwahati"
                    value={formData.city}
                    onChange={(e) => {
                      setFormData({ ...formData, city: e.target.value });
                      setFormErrors(prev => ({ ...prev, city: null }));
                    }}
                    className={`input py-2 text-xs w-full ${formErrors.city ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {formErrors.city && <p className="text-2xs text-rose-600 mt-1">{formErrors.city}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Supply Linkage & Contract Volume */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                2. Supply Chain Linkage &amp; Tender Contract
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">
                    Supplying C&amp;F Distributor *
                  </label>
                  <select
                    value={formData.assignedDistributor}
                    onChange={(e) => setFormData({ ...formData, assignedDistributor: e.target.value })}
                    className="input py-2 text-xs w-full bg-slate-50"
                  >
                    {MOCK_DISTRIBUTORS.map(d => (
                      <option key={d.id} value={d.name}>{d.name} ({d.city})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">
                    Bed Strength (If Inpatient Hospital)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 500"
                    value={formData.bedCount}
                    onChange={(e) => setFormData({ ...formData, bedCount: parseInt(e.target.value, 10) || 0 })}
                    className="input py-2 text-xs w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">
                    Annual Tender Value (₹)
                  </label>
                  <input
                    type="number"
                    step="50000"
                    min="0"
                    value={formData.tenderContractValueINR}
                    onChange={(e) => setFormData({ ...formData, tenderContractValueINR: parseFloat(e.target.value) || 0 })}
                    className="input py-2 text-xs w-full"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">
                    Monthly Indent (Units)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    min="100"
                    value={formData.monthlyIndentVolumeUnits}
                    onChange={(e) => setFormData({ ...formData, monthlyIndentVolumeUnits: parseInt(e.target.value, 10) || 0 })}
                    className="input py-2 text-xs w-full"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">
                    Required SLA Window (Days)
                  </label>
                  <select
                    value={formData.leadTimeRequirementDays}
                    onChange={(e) => setFormData({ ...formData, leadTimeRequirementDays: Number(e.target.value) })}
                    className="input py-2 text-xs w-full bg-slate-50"
                  >
                    <option value={1}>1 Day (Emergency ICU SLA)</option>
                    <option value={2}>2 Days (Medical College Hospital)</option>
                    <option value={3}>3 Days (District Civil Hospital)</option>
                    <option value={5}>5 Days (Subdivision / CHC)</option>
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">
                  Key Essential Medicines Under Rate Contract (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Handuser-C® 500ml, Paracetamol 650mg, ClavoGRD-625"
                  value={formData.criticalSkusText}
                  onChange={(e) => setFormData({ ...formData, criticalSkusText: e.target.value })}
                  className="input py-2 text-xs w-full"
                />
              </div>
            </div>

            {/* Section 3: Procurement Officer & Contact */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                3. Procurement Officer &amp; Communication Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">
                    Store / Procurement Officer *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. A. K. Barua"
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
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">
                    Official Mobile / Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 361 2529457"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      setFormErrors(prev => ({ ...prev, phone: null }));
                    }}
                    className={`input py-2 text-xs w-full ${formErrors.phone ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {formErrors.phone && <p className="text-2xs text-rose-600 mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    placeholder="store.tmch@assam.gov.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input py-2 text-xs w-full"
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
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
                {isEditing ? 'Save Account Changes' : 'Register Institution'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Customer Detail Drawer */}
      <Drawer
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.name || 'Customer Profile'}
        subtitle={selectedCustomer ? `${selectedCustomer.code} • ${selectedCustomer.segment}` : ''}
        size="md"
      >
        {selectedCustomer && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3 bg-navy-50/80 rounded-xl space-y-2 border border-navy-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Customer Code:</span>
                <span className="font-mono font-bold text-navy-950 bg-white px-2 py-0.5 rounded border border-navy-200">{selectedCustomer.code}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Segment:</span>
                <span className="font-semibold text-navy-950">{selectedCustomer.segment}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Location:</span>
                <span className="font-medium text-navy-900">{selectedCustomer.city}, {selectedCustomer.state}</span>
              </div>
              {selectedCustomer.bedCount > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Inpatient Bed Strength:</span>
                  <span className="font-bold text-navy-950">{formatNumber(selectedCustomer.bedCount)} Beds</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-2xs text-slate-500 block uppercase font-bold">Annual Contract Value</span>
                <span className="text-sm font-bold text-navy-950 mt-0.5 block">
                  {selectedCustomer.tenderContractValueINR ? formatCurrency(selectedCustomer.tenderContractValueINR) : 'Open Indent'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-2xs text-slate-500 block uppercase font-bold">Monthly Indent Volume</span>
                <span className="text-sm font-bold text-navy-950 mt-0.5 block">{formatNumber(selectedCustomer.monthlyIndentVolumeUnits)} units</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-2xs text-slate-500 block uppercase font-bold">Fulfillment SLA Rate</span>
                <span className="text-sm font-bold text-emerald-700 mt-0.5 block">{selectedCustomer.fulfillmentRate}%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-2xs text-slate-500 block uppercase font-bold">Lead Time Window</span>
                <span className="text-sm font-bold text-navy-950 mt-0.5 block">{selectedCustomer.leadTimeRequirementDays} Days Max</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950">Procurement Officer &amp; Contact</h4>
              <div className="space-y-1 text-xs">
                <div>Official Contact: <strong>{selectedCustomer.contactPerson}</strong></div>
                <div>Phone: <a href={`tel:${selectedCustomer.phone}`} className="text-terracotta-600 font-semibold hover:underline">{selectedCustomer.phone}</a></div>
                {selectedCustomer.email && (
                  <div>Email: <a href={`mailto:${selectedCustomer.email}`} className="text-terracotta-600 font-semibold hover:underline">{selectedCustomer.email}</a></div>
                )}
                <div className="pt-2 text-2xs text-slate-500 border-t border-slate-100 mt-2">
                  Mapped C&amp;F Distributor: <strong>{selectedCustomer.assignedDistributor}</strong>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950">Essential Medicines List (EML) Under Contract</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCustomer.criticalSkus?.map((sku, idx) => (
                  <span key={idx} className="text-2xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium border border-slate-200">
                    {sku}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <Button 
                variant="outline" 
                size="sm"
                className="w-1/2"
                onClick={() => {
                  setSelectedCustomer(null);
                  handleOpenEditModal(selectedCustomer);
                }}
                icon={Edit2}
              >
                Edit Account
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                className="w-1/2 bg-navy-900 hover:bg-navy-950 text-white font-bold"
                onClick={() => toast.success(`Dedicated emergency buffer stock reserved for ${selectedCustomer.name}`)}
              >
                Reserve Emergency Buffer
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Discontinue / Delete Confirmation Modal */}
      {deleteConfirmCust && (
        <Modal
          isOpen={!!deleteConfirmCust}
          onClose={() => setDeleteConfirmCust(null)}
          title="Discontinue Healthcare Account"
          subtitle={`Remove ${deleteConfirmCust.name} from active network`}
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs text-slate-600">
            <p>
              Are you sure you want to remove <strong>{deleteConfirmCust.name}</strong> ({deleteConfirmCust.code}) from the active healthcare accounts roster?
            </p>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-2xs space-y-1">
              <p className="font-bold">Contractual Supply Impact:</p>
              <p>Removing this institutional account will unmap its {formatNumber(deleteConfirmCust.monthlyIndentVolumeUnits)} units/month guaranteed off-take from C&amp;F distributor {deleteConfirmCust.assignedDistributor}.</p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <Button variant="outline" size="sm" onClick={() => setDeleteConfirmCust(null)}>
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
