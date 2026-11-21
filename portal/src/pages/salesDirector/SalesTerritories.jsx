import React, { useState } from 'react';
import {
  Target,
  TrendingUp,
  Store,
  Search,
  Filter,
  CheckCircle2,
  Download,
  MapPin,
  RotateCcw,
  Percent
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import { TERRITORY_PERFORMANCE } from '../../data/mockSalesDirectorData';
import { formatCurrency } from '../../utils/formatters';

export default function SalesTerritories() {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [achievementFilter, setAchievementFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTerritory, setActiveTerritory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasActiveFilters = searchQuery.trim() !== '' || 
    selectedRegion !== 'All' || 
    stateFilter !== 'All' || 
    achievementFilter !== 'All';

  const resetAllFilters = () => {
    setSelectedRegion('All');
    setStateFilter('All');
    setAchievementFilter('All');
    setSearchQuery('');
  };

  // Filter territories
  const filteredTerritories = TERRITORY_PERFORMANCE.filter(ter => {
    const matchRegion = selectedRegion === 'All' || 
      (selectedRegion === 'Assam' && ter.state.includes('Assam')) ||
      (selectedRegion === 'Hill States' && (ter.state === 'Meghalaya' || ter.state.includes('Mizoram') || ter.state.includes('Nagaland'))) ||
      (selectedRegion === 'Border' && (ter.state === 'Tripura' || ter.state.includes('Arunachal')));

    const matchState = stateFilter === 'All' || ter.state.includes(stateFilter);

    const matchAchievement = achievementFilter === 'All' ||
      (achievementFilter === 'Exceeded' && ter.percentage >= 100) ||
      (achievementFilter === 'OnTrack' && ter.percentage >= 90 && ter.percentage < 100) ||
      (achievementFilter === 'Lagging' && ter.percentage < 90);
    
    const matchSearch = !searchQuery || 
      ter.territoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ter.coverage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ter.regionalHead.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ter.state.toLowerCase().includes(searchQuery.toLowerCase());

    return matchRegion && matchState && matchAchievement && matchSearch;
  });

  const totalTarget = TERRITORY_PERFORMANCE.reduce((acc, curr) => acc + curr.targetINR, 0);
  const totalAchieved = TERRITORY_PERFORMANCE.reduce((acc, curr) => acc + curr.achievedINR, 0);
  const totalChemists = TERRITORY_PERFORMANCE.reduce((acc, curr) => acc + curr.chemistOutreach, 0);

  const handleOpenDetail = (ter) => {
    setActiveTerritory(ter);
    setIsModalOpen(true);
  };

  const territoryColumns = [
    {
      header: 'Territory & Key Cities',
      accessor: 'territoryName',
      render: (row) => (
        <div>
          <span className="font-bold text-navy-950 text-xs sm:text-sm font-sans">{row.territoryName}</span>
          <div className="text-2xs text-slate-500 mt-0.5">{row.coverage}</div>
          <span className="text-2xs text-slate-400">State: {row.state}</span>
        </div>
      )
    },
    {
      header: 'Regional Head',
      accessor: 'regionalHead',
      render: (row) => (
        <div>
          <span className="text-xs font-semibold text-navy-900">{row.regionalHead}</span>
          <div className="text-2xs text-slate-500">{row.fieldReps} Field MRs</div>
        </div>
      )
    },
    {
      header: 'Monthly Target',
      accessor: 'targetINR',
      align: 'right',
      className: 'whitespace-nowrap min-w-[130px]',
      sortValue: (row) => row.targetINR,
      render: (row) => (
        <div className="text-right">
          <span className="font-bold text-xs text-navy-950 font-sans block">{formatCurrency(row.targetINR)}</span>
          <div className="text-2xs text-slate-400 whitespace-nowrap">Quota</div>
        </div>
      )
    },
    {
      header: 'Achieved Revenue',
      accessor: 'achievedINR',
      align: 'right',
      className: 'whitespace-nowrap min-w-[140px]',
      sortValue: (row) => row.achievedINR,
      render: (row) => (
        <div className="text-right">
          <span className="font-bold text-xs sm:text-sm text-navy-950 font-sans block">{formatCurrency(row.achievedINR)}</span>
          <div className="text-2xs text-emerald-700 font-semibold whitespace-nowrap">{row.trend}</div>
        </div>
      )
    },
    {
      header: 'Quota %',
      accessor: 'percentage',
      align: 'center',
      className: 'whitespace-nowrap min-w-[120px]',
      sortValue: (row) => row.percentage,
      render: (row) => {
        let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
        if (row.percentage < 90) {
          badgeColor = 'bg-rose-50 text-rose-800 border-rose-200';
        } else if (row.percentage < 100) {
          badgeColor = 'bg-blue-50 text-blue-800 border-blue-200';
        }

        return (
          <div className="flex flex-col items-center">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border whitespace-nowrap ${badgeColor}`}>
              {row.percentage}%
            </span>
            <div className="w-20 bg-slate-100 h-1 rounded-full mt-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full ${row.percentage >= 100 ? 'bg-emerald-500' : row.percentage >= 90 ? 'bg-blue-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(100, row.percentage)}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      header: 'Chemist Reach',
      accessor: 'chemistOutreach',
      className: 'whitespace-nowrap min-w-[140px]',
      render: (row) => (
        <div>
          <span className="text-xs font-bold text-navy-900 whitespace-nowrap">{row.chemistOutreach} Chemist Stores</span>
          <div className="text-2xs text-slate-500 whitespace-nowrap">{row.activeDistributors} C&amp;F Partners</div>
        </div>
      )
    },
    {
      header: 'Actions',
      align: 'center',
      sortable: false,
      className: 'whitespace-nowrap min-w-[120px]',
      render: (row) => (
        <div className="flex justify-center">
          <Button
            size="sm"
            variant="outline"
            className="text-xs py-1 px-2.5 whitespace-nowrap cursor-pointer"
            onClick={() => handleOpenDetail(row)}
          >
            View Analysis
          </Button>
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
            <h1 className="font-sans font-bold text-2xl text-navy-950">Territory Performance &amp; Quota</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              8 Northeast Territories
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Territory-wise sales quotas, MTD revenue progress, field staff allocation, and distributor network health.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Download}
          className="text-xs font-semibold whitespace-nowrap self-start sm:self-auto shrink-0"
          onClick={() => {
            const csvContent = "data:text/csv;charset=utf-8," + 
              "Territory,Coverage,State,Head,Target,Achieved,Percentage,MRs,Chemists\n" +
              TERRITORY_PERFORMANCE.map(t => `"${t.territoryName}","${t.coverage}","${t.state}","${t.regionalHead}",${t.targetINR},${t.achievedINR},${t.percentage},${t.fieldReps},${t.chemistOutreach}`).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Territory_Performance_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          Download List (CSV)
        </Button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Regional Target"
          value={formatCurrency(totalTarget)}
          subtitle="Monthly approved budget"
          icon={Target}
          trend={{ direction: 'up', value: '8 Territories' }}
        />
        <StatCard
          title="Revenue Achieved"
          value={formatCurrency(totalAchieved)}
          subtitle="Total primary sales"
          icon={TrendingUp}
          trend={{ direction: 'up', value: `${((totalAchieved / totalTarget) * 100).toFixed(1)}% Quota` }}
        />
        <StatCard
          title="Top Performing Territory"
          value="Meghalaya (104.7%)"
          subtitle="Winter Cough Syrup surge"
          icon={CheckCircle2}
          trend={{ direction: 'up', value: '+22.6% YoY' }}
        />
        <StatCard
          title="Chemist Network Reach"
          value={`${totalChemists} Stores`}
          subtitle="Active retail pharmacies"
          icon={Store}
          trend={{ direction: 'up', value: '14 Distributors' }}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Region Tabs & Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Assam', 'Hill States', 'Border'].map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedRegion === region
                      ? 'bg-navy-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {region === 'All' ? 'All Territories' : region}
                </button>
              ))}
            </div>

            <Select
              label="State / Zone"
              value={stateFilter}
              onChange={(val) => setStateFilter(val)}
              options={[
                { value: 'All', label: 'All Northeast States' },
                { value: 'Assam', label: 'Assam' },
                { value: 'Meghalaya', label: 'Meghalaya' },
                { value: 'Tripura', label: 'Tripura' },
                { value: 'Nagaland', label: 'Nagaland & Manipur' },
                { value: 'Arunachal', label: 'Arunachal Pradesh' },
                { value: 'Mizoram', label: 'Mizoram' }
              ]}
              icon={MapPin}
            />

            <Select
              label="Quota Target Status"
              value={achievementFilter}
              onChange={(val) => setAchievementFilter(val)}
              options={[
                { value: 'All', label: 'All Quota Levels' },
                { value: 'Exceeded', label: 'Target Exceeded (≥100%)' },
                { value: 'OnTrack', label: 'On Track (90-99%)' },
                { value: 'Lagging', label: 'Lagging Target (<90%)' }
              ]}
              icon={Percent}
            />

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                title="Reset all territory filters"
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
                placeholder="Search territory, manager, or state..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 transition-all"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:inline">
              Showing {filteredTerritories.length} of {TERRITORY_PERFORMANCE.length}
            </span>
          </div>
        </div>
      </div>

      {/* Territory Table Card */}
      <Table
        title="Territory Sales Quotas & Field Performance"
        subtitle="Regional sales targets, MTD realization, field MR allocation, and chemist network reach"
        columns={territoryColumns}
        data={filteredTerritories}
        keyExtractor={(row) => row.id}
        pageSize={10}
        exportable={true}
        exportFilename={`GRD_Territory_Performance_${new Date().toISOString().split('T')[0]}`}
        emptyMessage="No territories found matching the selected search or region filter."
      />

      {/* Territory Detail Modal */}
      {isModalOpen && activeTerritory && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={activeTerritory.territoryName}
          subtitle={`Coverage: ${activeTerritory.coverage} · State: ${activeTerritory.state}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs text-slate-700">
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-2xs font-semibold text-slate-400 uppercase">Target vs Achieved</span>
                <p className="text-base font-bold font-sans text-navy-950 mt-0.5">
                  {formatCurrency(activeTerritory.achievedINR)}
                </p>
                <p className="text-2xs text-slate-500">Target: {formatCurrency(activeTerritory.targetINR)} ({activeTerritory.percentage}%)</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-2xs font-semibold text-slate-400 uppercase">Credit Outstanding</span>
                <p className="text-base font-bold font-sans text-navy-950 mt-0.5">
                  {formatCurrency(activeTerritory.outstandingCreditINR)}
                </p>
                <p className="text-2xs text-emerald-700 font-semibold">{activeTerritory.activeDistributors} Distributors mapped</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Regional Sales Head:</span>
                <span className="font-bold text-navy-950">{activeTerritory.regionalHead}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Medical Representatives:</span>
                <span className="font-semibold text-navy-900">{activeTerritory.fieldReps} Active MRs</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Chemist Network Reach:</span>
                <span className="font-semibold text-navy-900">{activeTerritory.chemistOutreach} Pharmacies</span>
              </div>
            </div>

            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 text-xs space-y-1">
              <p className="font-bold text-amber-950 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-700" />
                Key Growth Driver / Bottleneck
              </p>
              <p className="text-slate-700 text-2xs">
                {activeTerritory.keyGrowthDriver}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <Button size="sm" className="bg-navy-900 text-white" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
}
