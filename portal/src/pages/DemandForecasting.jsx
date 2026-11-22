import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  Filter,
  Sparkles,
  CheckCircle2,
  Eye,
  BarChart2,
  Layers,
  MapPin,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Drawer from '../components/common/Drawer';
import Select from '../components/common/Select';
import DemandTrendChart from '../components/charts/DemandTrendChart';
import { MOCK_FORECAST_ITEMS } from '../data/mockForecasts';
import { MOCK_SKUS } from '../data/mockSkus';
import { STATES } from '../data/mockInventory';
import { formatNumber } from '../utils/formatters';

const skuMap = new Map(MOCK_SKUS.map(s => [s.code, s]));

export default function DemandForecasting() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All States');
  const [confidenceFilter, setConfidenceFilter] = useState('All');
  const [growthFilter, setGrowthFilter] = useState('All');
  const [selectedHorizon, setSelectedHorizon] = useState('30'); // '30' | '60' | '90' | 'pilot'
  const [selectedForecast, setSelectedForecast] = useState(null);

  const hasActiveFilters = searchQuery.trim() !== '' || 
    selectedCategory !== 'All' || 
    selectedState !== 'All States' || 
    confidenceFilter !== 'All' || 
    growthFilter !== 'All';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedState('All States');
    setConfidenceFilter('All');
    setGrowthFilter('All');
  };

  const filteredItems = MOCK_FORECAST_ITEMS.filter((item) => {
    const sku = skuMap.get(item.skuCode);
    const brand = sku?.brandName || '';
    const matchesSearch = item.skuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.skuCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.targetLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesState = selectedState === 'All States' || item.targetState.includes(selectedState) || item.targetState.includes('Multi-State');
    
    // Confidence filter
    const matchesConfidence = confidenceFilter === 'All' || 
      (confidenceFilter === 'High' && item.confidenceLevel.includes('High')) ||
      (confidenceFilter === 'Medium' && item.confidenceLevel.includes('Medium'));

    // Growth velocity filter
    const matchesGrowth = growthFilter === 'All' ||
      (growthFilter === 'Surge' && item.projectedGrowthPct > 25) ||
      (growthFilter === 'High' && item.projectedGrowthPct >= 15 && item.projectedGrowthPct <= 25) ||
      (growthFilter === 'Stable' && item.projectedGrowthPct < 15);

    return matchesSearch && matchesCat && matchesState && matchesConfidence && matchesGrowth;
  });

  const totalDemandUnits = filteredItems.reduce((acc, item) => {
    const qty = selectedHorizon === '30' ? item.forecastNext30Days : selectedHorizon === '60' ? item.forecastNext60Days : item.forecastNext90Days;
    return acc + qty;
  }, 0);

  const columns = [
    {
      header: 'Medicine & Brand',
      accessor: 'skuCode',
      headerClassName: 'w-[18%]',
      className: 'w-[18%]',
      render: (row) => {
        const sku = skuMap.get(row.skuCode);
        const brand = sku?.brandName || row.skuName;
        return (
          <div className="max-w-[160px]">
            <span className="font-sans font-bold text-navy-950 text-xs sm:text-sm">{brand}</span>
            <div className="font-mono text-2xs text-slate-500 mt-0.5">{row.skuCode} · {row.category}</div>
            <div className="text-2xs text-slate-500 truncate" title={row.skuName}>{row.skuName}</div>
          </div>
        );
      }
    },
    {
      header: 'State & City',
      accessor: 'targetState',
      headerClassName: 'w-[14%]',
      className: 'w-[14%]',
      render: (row) => (
        <div className="text-xs">
          <div className="flex items-center gap-1 font-semibold text-slate-900">
            <MapPin className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
            <span>{row.targetState}</span>
          </div>
          <span className="text-2xs text-slate-500 pl-4 block leading-tight">{row.targetLocation}</span>
        </div>
      )
    },
    {
      header: 'Past Monthly Sales',
      accessor: 'historicalAverageMonthly',
      sortValue: (row) => row.historicalAverageMonthly,
      headerClassName: 'text-right w-[11%]',
      className: 'text-right w-[11%]',
      render: (row) => (
        <div className="text-right font-sans text-slate-700 text-xs font-semibold whitespace-nowrap">
          {formatNumber(row.historicalAverageMonthly)} units
        </div>
      )
    },
    {
      header: `Next ${selectedHorizon} Days Demand`,
      sortValue: (row) => selectedHorizon === '30' ? row.forecastNext30Days : selectedHorizon === '60' ? row.forecastNext60Days : row.forecastNext90Days,
      headerClassName: 'text-right w-[12%]',
      className: 'text-right w-[12%]',
      render: (row) => {
        const val = selectedHorizon === '30' ? row.forecastNext30Days : selectedHorizon === '60' ? row.forecastNext60Days : row.forecastNext90Days;
        return (
          <div className="text-right font-sans whitespace-nowrap">
            <span className="font-bold text-terracotta-700 text-sm block">{formatNumber(val)}</span>
            <span className="text-2xs text-slate-400 block">units expected</span>
          </div>
        );
      }
    },
    {
      header: 'Expected Growth',
      accessor: 'projectedGrowthPct',
      sortValue: (row) => row.projectedGrowthPct,
      headerClassName: 'text-right w-[9%]',
      className: 'text-right w-[9%]',
      render: (row) => (
        <div className="text-right font-sans font-semibold text-emerald-700 text-xs whitespace-nowrap">
          +{row.projectedGrowthPct}%
        </div>
      )
    },
    {
      header: 'Reliability',
      accessor: 'confidenceLevel',
      headerClassName: 'text-center w-[11%]',
      className: 'text-center w-[11%]',
      render: (row) => (
        <div className="flex justify-center">
          <Badge variant={row.confidenceLevel.includes('High') ? 'success' : 'info'} className="whitespace-nowrap text-2xs">
            {row.confidenceLevel}
          </Badge>
        </div>
      )
    },
    {
      header: 'Why Demand is Rising',
      headerClassName: 'w-[14%]',
      className: 'w-[14%]',
      render: (row) => {
        const driver = row.primaryDrivers?.[0] || row.seasonalityPattern || row.explainabilityFactors?.[0] || 'Seasonal Baseline Demand';
        return (
          <div className="max-w-[130px] truncate text-slate-700 text-xs font-medium" title={driver}>
            {driver}
          </div>
        );
      }
    },
    {
      header: 'Action',
      sortable: false,
      headerClassName: 'text-center w-[11%] whitespace-nowrap',
      className: 'text-center w-[11%] whitespace-nowrap',
      render: (row) => (
        <div className="flex items-center justify-center">
          <Button 
            variant="outline" 
            size="xs"
            onClick={() => setSelectedForecast(row)}
            icon={Eye}
            className="border-slate-300 hover:border-navy-900 text-navy-900 hover:bg-slate-50 font-semibold px-2 py-1 text-xs whitespace-nowrap"
          >
            Explain
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
              Medicine Demand Forecast
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-terracotta-100 text-terracotta-800">
              AI Powered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
            Predict how much medicine hospitals, stockists, and pharmacies will need over the next 30, 60, or 90 days.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Forecast Accuracy"
          value="88.4%"
          subtitle="Within 11.6% margin"
          icon={TrendingUp}
          trend={{ direction: 'up', text: '+23.5% vs Base' }}
          badge={{ text: 'Target Met', variant: 'success' }}
        />
        <StatCard
          title={`${selectedHorizon}-Day Expected Demand`}
          value={formatNumber(totalDemandUnits)}
          subtitle="Total medicine units required"
          icon={Layers}
          trend={{ direction: 'up', text: '+14.2% Winter Surge' }}
          badge={{ text: 'Projected', variant: 'info' }}
        />
        <StatCard
          title="Key Demand Factors"
          value="6 Factors"
          subtitle="Flu season, weather, tenders"
          icon={Sparkles}
          trend={{ direction: 'up', text: 'Live Signals' }}
          badge={{ text: 'Active Drivers', variant: 'info' }}
        />
        <StatCard
          title="Prediction Method"
          value="Hybrid AI"
          subtitle="Trained on Assam sales"
          icon={BarChart2}
          trend={{ direction: 'up', text: '99.2% Confidence' }}
          badge={{ text: 'Validated', variant: 'neutral' }}
        />
      </div>

      {/* Interactive Chart Banner */}
      <div className="card p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-sans font-bold text-base text-navy-950">
              Expected Medicine Demand vs Past Sales
            </h3>
            <p className="text-xs text-slate-500">
              Compares future medicine requirement with actual sales from past months across Northeast India
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
            <span className="text-2xs font-semibold text-slate-500 px-2 font-sans">Forecast Period:</span>
            {['30', '60', '90'].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setSelectedHorizon(h)}
                className={`px-2.5 py-1 rounded-md text-2xs font-bold transition-all cursor-pointer ${
                  selectedHorizon === h ? 'bg-navy-900 text-white shadow-2xs' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                {h} Days
              </button>
            ))}
          </div>
        </div>
        <DemandTrendChart height={280} />
      </div>

      {/* Filter Toolbar */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Select
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(val)}
              options={[
                { value: 'All', label: 'All Categories' },
                { value: 'Tablets', label: 'Tablets' },
                { value: 'Capsules', label: 'Capsules' },
                { value: 'Syrups', label: 'Syrups' },
                { value: 'Suspensions & Hygiene', label: 'Suspensions & Hygiene' }
              ]}
              icon={Filter}
            />

            <Select
              value={selectedState}
              onChange={(val) => setSelectedState(val)}
              options={STATES}
              icon={MapPin}
            />

            <Select
              value={confidenceFilter}
              onChange={(val) => setConfidenceFilter(val)}
              options={[
                { value: 'All', label: 'All Confidence' },
                { value: 'High', label: 'High Confidence (≥90%)' },
                { value: 'Medium', label: 'Medium (80-89%)' }
              ]}
              icon={ShieldCheck}
            />

            <Select
              value={growthFilter}
              onChange={(val) => setGrowthFilter(val)}
              options={[
                { value: 'All', label: 'All Growth Rates' },
                { value: 'Surge', label: 'Surge Demand (>25%)' },
                { value: 'High', label: 'High Growth (15-25%)' },
                { value: 'Stable', label: 'Stable (<15%)' }
              ]}
              icon={TrendingUp}
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
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search SKU, brand or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 py-1.5 text-xs w-full"
            />
          </div>
        </div>
      </div>

      {/* Paginated, Sortable Table */}
      <Table 
        title="Regional Medicine Demand Forecasts"
        subtitle="30, 60, and 90-day predictive volume estimates by medicine category and territory"
        columns={columns}
        data={filteredItems}
        keyExtractor={(row) => row.id}
        exportFilename="grd_demand_forecast_ledger"
        pageSize={10}
        showPagination={true}
        compact={true}
        tableClassName="w-full table-fixed"
        emptyMessage="No forecast models found matching your criteria."
      />

      {/* Explainability Drawer */}
      <Drawer
        isOpen={!!selectedForecast}
        onClose={() => setSelectedForecast(null)}
        title={selectedForecast?.skuName || 'Demand Driver Explainability'}
        subtitle={`${selectedForecast?.skuCode} · ${selectedForecast?.targetState}`}
        size="md"
      >
        {selectedForecast && (
          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs font-semibold text-slate-400 font-sans uppercase">DESTINATION DEPOT</span>
                <p className="font-bold text-navy-950 text-sm">{selectedForecast.targetLocation}</p>
                <p className="text-xs text-slate-500">{selectedForecast.targetState}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 font-sans uppercase">EXPECTED DEMAND</span>
                <p className="font-bold text-terracotta-700 text-sm">
                  {formatNumber(selectedHorizon === '30' ? selectedForecast.forecastNext30Days : selectedHorizon === '60' ? selectedForecast.forecastNext60Days : selectedForecast.forecastNext90Days)} Units
                </p>
                <p className="text-xs text-emerald-700 font-semibold">+{selectedForecast.projectedGrowthPct}% Expected Growth</p>
              </div>
            </div>

            <div className="border border-slate-100 rounded-xl p-3.5 space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-navy-950 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
                Why Is Demand Rising?
              </h4>
              <ul className="space-y-1.5 text-slate-700">
                {(selectedForecast.primaryDrivers || selectedForecast.explainabilityFactors || [selectedForecast.seasonalityPattern]).map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 bg-navy-50/70 rounded-xl text-navy-900 border border-navy-100 text-xs space-y-1">
              <strong className="block text-navy-950 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-navy-800" />
                Recommended Operational Action:
              </strong>
              <p className="leading-relaxed text-slate-700">
                {selectedForecast.recommendedAction || `Keep at least ${selectedForecast.recommendedBufferDays || 14} days of extra safety stock in this depot. Dispatch replenishment stock before weekly high demand days.`}
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
