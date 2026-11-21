import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CreditCard,
  Users,
  CheckCircle2,
  Eye,
  Download,
  Plus,
  RotateCcw,
  Star
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Drawer from '../components/common/Drawer';
import Modal from '../components/common/Modal';
import Select from '../components/common/Select';
import { useToast } from '../hooks/useToast';
import { usePersistentState } from '../hooks/usePersistentState';
import { MOCK_DISTRIBUTORS } from '../data/mockDistributors';
import { formatCurrency, getStatusBadgeVariant } from '../utils/formatters';

export default function Distributors() {
  const { toast } = useToast();
  const [distributors, setDistributors] = usePersistentState('grd_distributors_master', MOCK_DISTRIBUTORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [fulfillmentFilter, setFulfillmentFilter] = useState('All');
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const hasActiveFilters = searchQuery.trim() !== '' ||
    stateFilter !== 'All' ||
    ratingFilter !== 'All' ||
    fulfillmentFilter !== 'All';

  const resetAllFilters = () => {
    setSearchQuery('');
    setStateFilter('All');
    setRatingFilter('All');
    setFulfillmentFilter('All');
  };

  // New Distributor Form State
  const [newName, setNewName] = useState('');
  const [newTerritory, setNewTerritory] = useState('');
  const [newState, setNewState] = useState('Assam');
  const [newContact, setNewContact] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCreditLimit, setNewCreditLimit] = useState('2500000');

  // Stats calculation
  const totalDistributors = distributors.length;
  const totalCreditLimit = distributors.reduce((acc, d) => acc + d.creditLimitINR, 0);
  const totalOutstanding = distributors.reduce((acc, d) => acc + d.currentOutstandingINR, 0);
  const totalStockists = distributors.reduce((acc, d) => acc + d.activeStockistsCount, 0);
  const avgFulfillment = (distributors.reduce((acc, d) => acc + d.orderFulfillmentRate, 0) / distributors.length).toFixed(1);

  // Filtered
  const filteredDistributors = distributors.filter(dist => {
    const matchesSearch = dist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dist.territory.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dist.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dist.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = stateFilter === 'All' || dist.state === stateFilter;
    const matchesRating = ratingFilter === 'All' ||
      (ratingFilter === 'Top' && dist.rating >= 4.5) ||
      (ratingFilter === 'Standard' && dist.rating >= 4.0 && dist.rating < 4.5) ||
      (ratingFilter === 'Monitored' && dist.rating < 4.0);
    const matchesFulfillment = fulfillmentFilter === 'All' ||
      (fulfillmentFilter === 'High' && dist.orderFulfillmentRate >= 92) ||
      (fulfillmentFilter === 'Moderate' && dist.orderFulfillmentRate < 92);
    return matchesSearch && matchesState && matchesRating && matchesFulfillment;
  });

  const handleAddDistributor = (e) => {
    e.preventDefault();
    const created = {
      id: `DIST-00${distributors.length + 1}`,
      code: `GRD-DIST-${newState.substring(0, 3).toUpperCase()}${distributors.length + 1}`,
      name: newName,
      territory: newTerritory,
      state: newState,
      city: newTerritory.split(',')[0] || newState,
      contactPerson: newContact,
      phone: newPhone,
      email: `${newContact.toLowerCase().replace(/\s+/g, '')}@dist.grdpharma.com`,
      gstin: `18AAAG${Math.floor(1000 + Math.random() * 9000)}P1Z5`,
      dlNumber: `${newState.substring(0, 3).toUpperCase()}/DL/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      creditLimitINR: Number(newCreditLimit),
      currentOutstandingINR: 0,
      paymentTermDays: 30,
      rating: 4.5,
      activeStockistsCount: 12,
      orderFulfillmentRate: 92.0,
      avgReplenishmentCycleDays: 3,
      status: 'Active',
      joinedYear: 2026,
      inventoryVisibilityEnabled: true,
      lastOrderDate: new Date().toISOString().split('T')[0]
    };

    setDistributors([...distributors, created]);
    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setIsAddModalOpen(false);
      setNewName('');
      setNewTerritory('');
    }, 1200);
  };

  const columns = [
    {
      header: 'Distributor Details',
      render: (row) => (
        <div>
          <div className="font-semibold text-navy-950 text-xs">{row.name}</div>
          <div className="text-2xs text-navy-700/60 font-sans">{row.code} • Since {row.joinedYear}</div>
        </div>
      )
    },
    {
      header: 'Territory & State',
      render: (row) => (
        <div className="flex items-start gap-1.5 text-xs text-navy-800">
          <MapPin className="w-3.5 h-3.5 text-terracotta-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-medium">{row.territory}</div>
            <div className="text-2xs text-navy-700/60">{row.state}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Key Contact',
      render: (row) => (
        <div className="text-xs">
          <div className="font-medium text-navy-900">{row.contactPerson}</div>
          <div className="text-2xs text-navy-700/60">{row.phone}</div>
        </div>
      )
    },
    {
      header: 'Credit Utilization',
      render: (row) => {
        const utilPct = Math.round((row.currentOutstandingINR / row.creditLimitINR) * 100);
        return (
          <div className="w-36">
            <div className="flex justify-between text-2xs mb-1">
              <span className="font-semibold text-navy-900">{formatCurrency(row.currentOutstandingINR)}</span>
              <span className="text-navy-700/60">of {formatCurrency(row.creditLimitINR)}</span>
            </div>
            <div className="w-full bg-navy-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full ${utilPct > 80 ? 'bg-red-600' : utilPct > 50 ? 'bg-amber-500' : 'bg-emerald-600'}`}
                style={{ width: `${Math.min(utilPct, 100)}%` }}
              />
            </div>
            <div className="text-2xs text-right text-navy-700/60 mt-0.5">{utilPct}% used</div>
          </div>
        );
      }
    },
    {
      header: 'Stockists Reach',
      render: (row) => (
        <div className="text-center">
          <span className="font-bold text-navy-950 text-xs">{row.activeStockistsCount}</span>
          <div className="text-2xs text-navy-700/60">Retail Linkages</div>
        </div>
      )
    },
    {
      header: 'Fulfillment Rate',
      render: (row) => (
        <span className={`text-xs font-semibold ${row.orderFulfillmentRate >= 92 ? 'text-emerald-700' : 'text-amber-700'}`}>
          {row.orderFulfillmentRate}%
        </span>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={getStatusBadgeVariant(row.status)}>
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <Button 
          variant="outline" 
          size="xs"
          onClick={() => setSelectedDistributor(row)}
          icon={Eye}
        >
          View Profile
        </Button>
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
              Distributors
            </h1>
            <span className="text-xs bg-navy-100 text-navy-800 font-medium px-2 py-0.5 rounded-full">
              Primary Channel
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
            Certified C&amp;F partners and regional distributors supplying medicines across Assam and Northeast states.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const headers = ['Distributor Name', 'Code', 'Territory', 'State', 'Active Stockists', 'Credit Limit', 'Current Outstanding', 'Status'];
              const rows = filteredDistributors.map(d => [
                `"${d.name}"`,
                `"${d.code}"`,
                `"${d.territory}"`,
                `"${d.state}"`,
                d.activeStockistsCount,
                d.creditLimitINR,
                d.currentOutstandingINR,
                `"${d.status}"`
              ].join(','));
              const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'grd_distributor_master.csv');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              toast.success('Distributor master exported (CSV)');
            }}
            icon={Download}
          >
            Download List (CSV)
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            icon={Plus}
          >
            Add New Distributor
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard 
          title="Active Distributors" 
          value={totalDistributors}
          subtitle="Certified C&F Partners"
          icon={Building2}
        />
        <StatCard 
          title="Total Credit Limit" 
          value={`₹${(totalCreditLimit / 10000000).toFixed(2)} Cr`}
          subtitle="Extended network credit"
          icon={CreditCard}
        />
        <StatCard 
          title="Current Outstanding" 
          value={`₹${(totalOutstanding / 10000000).toFixed(2)} Cr`}
          subtitle="Within 30-day payment term"
          icon={CreditCard}
          trend={{ direction: 'neutral', text: 'Avg 24 days DCI' }}
        />
        <StatCard 
          title="Sub-Stockist Network" 
          value={totalStockists}
          subtitle="Active retail touchpoints"
          icon={Users}
        />
        <StatCard 
          title="Avg Fulfilment Rate" 
          value={`${avgFulfillment}%`}
          subtitle="Order execution SLA"
          icon={ShieldCheck}
          trend={{ direction: 'up', text: '+7.6% under pilot' }}
        />
      </div>

      {/* Filter Bar */}
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
                { value: 'Manipur', label: 'Manipur' },
                { value: 'Mizoram', label: 'Mizoram' }
              ]}
              icon={MapPin}
            />

            <Select
              value={ratingFilter}
              onChange={(val) => setRatingFilter(val)}
              options={[
                { value: 'All', label: 'All Ratings' },
                { value: 'Top', label: 'Top Rated (≥4.5 ★)' },
                { value: 'Standard', label: 'Standard (4.0 - 4.4 ★)' },
                { value: 'Monitored', label: 'Monitored (<4.0 ★)' }
              ]}
              icon={Star}
            />

            <Select
              value={fulfillmentFilter}
              onChange={(val) => setFulfillmentFilter(val)}
              options={[
                { value: 'All', label: 'All SLA Levels' },
                { value: 'High', label: 'High SLA (≥92%)' },
                { value: 'Moderate', label: 'Moderate SLA (<92%)' }
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
              placeholder="Search distributor, contact or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 py-1.5 text-xs w-full"
            />
          </div>
        </div>
      </div>

      {/* Distributors Table */}
      <Table 
        title="Authorized Medicine Distributors"
        subtitle="Primary C&F network, allocated territories, and credit terms across Northeast states"
        columns={columns}
        data={filteredDistributors}
        keyExtractor={(row) => row.id}
        emptyMessage="No distributors found matching criteria."
      />

      {/* Distributor Profile Drawer */}
      <Drawer
        isOpen={!!selectedDistributor}
        onClose={() => setSelectedDistributor(null)}
        title={selectedDistributor?.name || 'Distributor Profile'}
        size="md"
      >
        {selectedDistributor && (
          <div className="space-y-5 text-sm">
            <div className="p-4 bg-navy-50 rounded-lg space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-navy-700/70">Partner Code:</span>
                <span className="font-sans font-bold text-navy-900">{selectedDistributor.code}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-navy-700/70">Drug License (DL) #:</span>
                <span className="font-sans text-navy-900">{selectedDistributor.dlNumber}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-navy-700/70">GSTIN:</span>
                <span className="font-sans text-navy-900">{selectedDistributor.gstin}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-navy-700/70">Territory:</span>
                <span className="font-medium text-navy-950">{selectedDistributor.territory}</span>
              </div>
            </div>

            <div className="border border-navy-100 rounded-lg p-3 space-y-2">
              <h4 className="text-xs font-bold text-navy-900">Contact &amp; Communications</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-navy-800">
                  <Users className="w-3.5 h-3.5 text-navy-700/50" />
                  <span>Key Contact: <strong>{selectedDistributor.contactPerson}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-navy-800">
                  <Phone className="w-3.5 h-3.5 text-navy-700/50" />
                  <span>Phone: <a href={`tel:${selectedDistributor.phone}`} className="text-terracotta-600 hover:underline">{selectedDistributor.phone}</a></span>
                </div>
                <div className="flex items-center gap-2 text-navy-800">
                  <Mail className="w-3.5 h-3.5 text-navy-700/50" />
                  <span>Email: <a href={`mailto:${selectedDistributor.email}`} className="text-terracotta-600 hover:underline">{selectedDistributor.email}</a></span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-navy-50/70 rounded-lg border border-navy-100">
                <span className="text-2xs text-navy-700/60 block">Credit Limit</span>
                <span className="text-base font-bold text-navy-950">{formatCurrency(selectedDistributor.creditLimitINR)}</span>
              </div>
              <div className="p-3 bg-navy-50/70 rounded-lg border border-navy-100">
                <span className="text-2xs text-navy-700/60 block">Outstanding Balance</span>
                <span className="text-base font-bold text-terracotta-700">{formatCurrency(selectedDistributor.currentOutstandingINR)}</span>
              </div>
              <div className="p-3 bg-navy-50/70 rounded-lg border border-navy-100">
                <span className="text-2xs text-navy-700/60 block">Payment Terms</span>
                <span className="text-base font-bold text-navy-950">{selectedDistributor.paymentTermDays} Days</span>
              </div>
              <div className="p-3 bg-navy-50/70 rounded-lg border border-navy-100">
                <span className="text-2xs text-navy-700/60 block">Avg Replenishment Cycle</span>
                <span className="text-base font-bold text-navy-950">{selectedDistributor.avgReplenishmentCycleDays} Days</span>
              </div>
            </div>

            <div className="pt-4 border-t border-navy-100 space-y-2">
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => toast.success(`Stock allocation indent initiated for ${selectedDistributor.name}`)}
              >
                Create Stock Allocation Indent
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Onboard Distributor Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard New C&F Distributor"
        size="md"
      >
        <form onSubmit={handleAddDistributor} className="space-y-4">
          {addSuccess ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-semibold text-emerald-900">Distributor Onboarded Successfully</h4>
              <p className="text-xs text-emerald-700">Login credentials & portal access generated for distributor desk.</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-navy-900 mb-1">Distributor Agency / Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brahmaputra Medico Agency"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="input w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-navy-900 mb-1">State *</label>
                  <Select
                    value={newState}
                    onChange={(val) => setNewState(val)}
                    options={[
                      { value: 'Assam', label: 'Assam' },
                      { value: 'Meghalaya', label: 'Meghalaya' },
                      { value: 'Tripura', label: 'Tripura' },
                      { value: 'Nagaland', label: 'Nagaland' },
                      { value: 'Manipur', label: 'Manipur' },
                      { value: 'Mizoram', label: 'Mizoram' },
                      { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
                      { value: 'Sikkim', label: 'Sikkim' }
                    ]}
                    className="w-full justify-between"
                    dropdownClassName="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-900 mb-1">Approved Credit Limit (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newCreditLimit}
                    onChange={(e) => setNewCreditLimit(e.target.value)}
                    className="input w-full text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-navy-900 mb-1">Territory Coverage *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kamrup Metro, Nalbari, Barpeta"
                  value={newTerritory}
                  onChange={(e) => setNewTerritory(e.target.value)}
                  className="input w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-navy-900 mb-1">Key Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Baruah"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    className="input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-900 mb-1">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="input w-full text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-navy-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Complete Onboarding
                </Button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
}
