import React, { useState } from 'react';
import {
  Users,
  MapPin,
  TrendingUp,
  Search,
  Filter,
  Award,
  Pill,
  Target,
  Download,
  Stethoscope,
  RotateCcw,
  Plus
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import { FIELD_FORCE_ROSTER } from '../../data/mockSalesDirectorData';
import { formatNumber, formatCurrency } from '../../utils/formatters';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useToast } from '../../hooks/useToast';
import { STORAGE_KEYS } from '../../services/grdDataService';

export default function SalesFieldForce() {
  const { toast } = useToast();
  const [reps, setReps] = usePersistentState(STORAGE_KEYS.FIELD_FORCE, FIELD_FORCE_ROSTER);
  const [isAddRepModalOpen, setIsAddRepModalOpen] = useState(false);
  const [formName, setFormName] = useState('Partha Pratim Sarma');
  const [formRole, setFormRole] = useState('Medical Representative');
  const [formHq, setFormHq] = useState('Guwahati Metro');
  const [formTerritory, setFormTerritory] = useState('Kamrup Metro (GMCH & Ulubari)');
  const [formCallsTarget, setFormCallsTarget] = useState(180);
  const [formPob, setFormPob] = useState(550000);
  const [formTopBrand, setFormTopBrand] = useState('DoloGRD-650 & Handuser-C®');

  const handleAddRep = (e) => {
    e.preventDefault();
    const newRep = {
      id: `MR-0${reps.length + 1}`,
      name: formName,
      role: formRole,
      hq: formHq,
      territory: formTerritory,
      doctorCallsCompleted: 0,
      doctorCallsTarget: Number(formCallsTarget),
      callAdherence: 100,
      pobBookedINR: Number(formPob),
      topBrandFocused: formTopBrand,
      rating: 'A+ (Top Performer)'
    };

    setReps(prev => [newRep, ...prev]);
    setIsAddRepModalOpen(false);
    toast.success(`Medical Representative ${newRep.name} added to ${newRep.hq}! Roster and targets updated.`);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState('All');
  const [hqFilter, setHqFilter] = useState('All');
  const [adherenceFilter, setAdherenceFilter] = useState('All');

  const hasActiveFilters = searchQuery.trim() !== '' || 
    selectedRating !== 'All' || 
    hqFilter !== 'All' || 
    adherenceFilter !== 'All';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedRating('All');
    setHqFilter('All');
    setAdherenceFilter('All');
  };

  const filteredReps = reps.filter(rep => {
    const matchRating = selectedRating === 'All' || rep.rating.startsWith(selectedRating);
    const matchHq = hqFilter === 'All' || rep.hq.includes(hqFilter);
    const matchAdherence = adherenceFilter === 'All' ||
      (adherenceFilter === 'High' && rep.callAdherence >= 95) ||
      (adherenceFilter === 'Standard' && rep.callAdherence >= 90 && rep.callAdherence < 95) ||
      (adherenceFilter === 'Low' && rep.callAdherence < 90);

    const matchSearch = !searchQuery || 
      rep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.hq.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.territory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.topBrandFocused.toLowerCase().includes(searchQuery.toLowerCase());

    return matchRating && matchHq && matchAdherence && matchSearch;
  });

  const totalCallsTarget = reps.reduce((acc, curr) => acc + curr.doctorCallsTarget, 0);
  const totalCallsDone = reps.reduce((acc, curr) => acc + curr.doctorCallsCompleted, 0);
  const totalPob = reps.reduce((acc, curr) => acc + curr.pobBookedINR, 0);

  const repColumns = [
    {
      header: 'Representative & Role',
      accessor: 'name',
      render: (row) => (
        <div>
          <span className="font-bold text-navy-950 text-xs sm:text-sm font-sans">{row.name}</span>
          <div className="text-2xs text-slate-500 mt-0.5">{row.designation}</div>
          <span className="text-2xs text-slate-400 font-mono">ID: {row.id}</span>
        </div>
      )
    },
    {
      header: 'Headquarters & Territory',
      accessor: 'hq',
      render: (row) => (
        <div>
          <span className="text-xs font-semibold text-navy-900">{row.hq}</span>
          <div className="text-2xs text-slate-500">{row.territory}</div>
        </div>
      )
    },
    {
      header: 'Doctor Detailing Calls',
      accessor: 'doctorCallsCompleted',
      className: 'whitespace-nowrap min-w-[150px]',
      sortValue: (row) => row.doctorCallsCompleted,
      render: (row) => (
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-navy-950 font-sans whitespace-nowrap">
            <Stethoscope className="w-3.5 h-3.5 text-terracotta-600" />
            {row.doctorCallsCompleted} / {row.doctorCallsTarget}
          </div>
          <div className="text-2xs text-slate-400 whitespace-nowrap">Monthly Targets</div>
        </div>
      )
    },
    {
      header: 'Call Adherence %',
      accessor: 'callAdherence',
      align: 'center',
      className: 'whitespace-nowrap min-w-[130px]',
      sortValue: (row) => row.callAdherence,
      render: (row) => {
        let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
        if (row.callAdherence < 90) {
          badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
        }

        return (
          <div className="flex flex-col items-center">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border whitespace-nowrap ${badgeColor}`}>
              {row.callAdherence}%
            </span>
            <div className="w-16 bg-slate-100 h-1 rounded-full mt-1 overflow-hidden">
              <div 
                className={`h-full rounded-full ${row.callAdherence >= 95 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${row.callAdherence}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      header: 'Personal Order Booking (POB)',
      accessor: 'pobBookedINR',
      align: 'right',
      className: 'whitespace-nowrap min-w-[150px]',
      sortValue: (row) => row.pobBookedINR,
      render: (row) => (
        <div className="text-right">
          <span className="font-bold text-xs sm:text-sm text-navy-950 font-sans block">{formatCurrency(row.pobBookedINR)}</span>
          <div className="text-2xs text-slate-400 whitespace-nowrap">Direct Doctor Rx</div>
        </div>
      )
    },
    {
      header: 'Focus Formulations',
      accessor: 'topBrandFocused',
      className: 'whitespace-nowrap',
      render: (row) => (
        <span className="text-2xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg whitespace-nowrap">
          {row.topBrandFocused}
        </span>
      )
    },
    {
      header: 'Rating',
      accessor: 'rating',
      align: 'center',
      className: 'whitespace-nowrap min-w-[100px]',
      render: (row) => (
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1 text-2xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 whitespace-nowrap">
            <Award className="w-3 h-3 text-amber-600" />
            {row.rating}
          </span>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans font-bold text-2xl text-navy-950">Field Force &amp; Doctor Detailing</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              48 Active Field Officers
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Monitor Medical Representative daily doctor detailing calls, chemist prescription audits, and personal order bookings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            className="text-xs font-semibold whitespace-nowrap self-start sm:self-auto shrink-0 bg-navy-900 hover:bg-navy-950 text-white"
            onClick={() => setIsAddRepModalOpen(true)}
          >
            Add Medical Rep
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            className="text-xs font-semibold whitespace-nowrap self-start sm:self-auto shrink-0"
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," + 
                "ID,Name,Designation,HQ,Territory,TargetCalls,DoneCalls,Adherence,POB,Rating\n" +
                FIELD_FORCE_ROSTER.map(r => `"${r.id}","${r.name}","${r.designation}","${r.hq}","${r.territory}",${r.doctorCallsTarget},${r.doctorCallsCompleted},${r.callAdherence},${r.pobBookedINR},"${r.rating}"`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `Field_Force_Report_${new Date().toISOString().slice(0,10)}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Download List (CSV)
          </Button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Field Strength"
          value="48 Officers"
          subtitle="All 8 Northeast States"
          icon={Users}
          trend={{ direction: 'up', value: '100% Deployed' }}
        />
        <StatCard
          title="Doctor Calls Done"
          value={`${formatNumber(totalCallsDone)} Visits`}
          subtitle={`Target: ${formatNumber(totalCallsTarget)}`}
          icon={Stethoscope}
          trend={{ direction: 'up', value: `${((totalCallsDone / totalCallsTarget) * 100).toFixed(1)}% Adherence` }}
        />
        <StatCard
          title="Total POB Booked"
          value={formatCurrency(totalPob)}
          subtitle="Secondary orders generated"
          icon={TrendingUp}
          trend={{ direction: 'up', value: 'Direct Rx Pull' }}
        />
        <StatCard
          title="Top Brand Focus"
          value="DoloGRD & CofGRD"
          subtitle="Winter respiratory season"
          icon={Pill}
          trend={{ direction: 'up', value: '+31% Prescription' }}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Rating Filter Tabs & Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'A+', 'A', 'B+'].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setSelectedRating(rate)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedRating === rate
                      ? 'bg-navy-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {rate === 'All' ? 'All Performers' : `Grade ${rate}`}
                </button>
              ))}
            </div>

            <Select
              label="Headquarters"
              value={hqFilter}
              onChange={(val) => setHqFilter(val)}
              options={[
                { value: 'All', label: 'All Headquarters' },
                { value: 'Guwahati', label: 'Guwahati Metro HQ' },
                { value: 'Shillong', label: 'Shillong HQ' },
                { value: 'Dibrugarh', label: 'Dibrugarh HQ' },
                { value: 'Silchar', label: 'Silchar HQ' },
                { value: 'Agartala', label: 'Agartala HQ' },
                { value: 'Dimapur', label: 'Dimapur HQ' }
              ]}
              icon={MapPin}
            />

            <Select
              label="Doctor Detailing Adherence"
              value={adherenceFilter}
              onChange={(val) => setAdherenceFilter(val)}
              options={[
                { value: 'All', label: 'All Adherence Levels' },
                { value: 'High', label: 'High Adherence (≥95%)' },
                { value: 'Standard', label: 'Standard (90-94%)' },
                { value: 'Low', label: 'Needs Focus (<90%)' }
              ]}
              icon={Stethoscope}
            />

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                title="Reset all field force filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Search Input & Counter */}
          <div className="flex items-center gap-3">
            <div className="relative min-w-[220px] w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search representative, HQ, or brand..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 transition-all"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:inline">
              Showing {filteredReps.length} of {FIELD_FORCE_ROSTER.length}
            </span>
          </div>
        </div>
      </div>

      {/* Field Force Roster Table Card */}
      <Table
        title="Field Force Roster & Doctor Detailing Performance"
        subtitle="Medical representative call adherence, doctor prescription tracking, and personal order bookings"
        columns={repColumns}
        data={filteredReps}
        keyExtractor={(row) => row.id}
        pageSize={10}
        exportable={true}
        exportFilename={`GRD_Field_Force_Roster_${new Date().toISOString().split('T')[0]}`}
        emptyMessage="No medical representatives found matching the selected criteria."
      />

      {/* Add Rep Modal */}
      {isAddRepModalOpen && (
        <Modal
          isOpen={isAddRepModalOpen}
          onClose={() => setIsAddRepModalOpen(false)}
          title="Add New Field Medical Representative"
          subtitle="Deploy a medical representative to territory headquarters for doctor detailing and hospital demand pull"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleAddRep} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Representative Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Designation / Role *
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  <option value="Senior Medical Representative">Senior Medical Representative</option>
                  <option value="Medical Representative">Medical Representative</option>
                  <option value="Area Business Manager">Area Business Manager</option>
                  <option value="Territory Manager">Territory Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Headquarters (HQ) *
                </label>
                <select
                  value={formHq}
                  onChange={(e) => setFormHq(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  <option value="Guwahati Metro">Guwahati Metro</option>
                  <option value="Shillong HQ">Shillong HQ</option>
                  <option value="Dibrugarh HQ">Dibrugarh HQ</option>
                  <option value="Silchar HQ">Silchar HQ</option>
                  <option value="Agartala HQ">Agartala HQ</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Territory Beat *
                </label>
                <input
                  type="text"
                  required
                  value={formTerritory}
                  onChange={(e) => setFormTerritory(e.target.value)}
                  placeholder="e.g. Kamrup Metro (GMCH & Panbazar)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Monthly Doctor Calls Target *
                </label>
                <input
                  type="number"
                  min="50"
                  max="300"
                  required
                  value={formCallsTarget}
                  onChange={(e) => setFormCallsTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Monthly POB Target (INR) *
                </label>
                <input
                  type="number"
                  min="50000"
                  step="25000"
                  required
                  value={formPob}
                  onChange={(e) => setFormPob(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Key Focus Formulations *
                </label>
                <input
                  type="text"
                  required
                  value={formTopBrand}
                  onChange={(e) => setFormTopBrand(e.target.value)}
                  placeholder="e.g. DoloGRD-650 &amp; Handuser-C®"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddRepModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-navy-900 hover:bg-navy-950 text-white font-bold shadow-sm cursor-pointer">
                Deploy Representative
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
