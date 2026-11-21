import React, { useState } from 'react';
import {
  Pill,
  TrendingUp,
  Search,
  Filter,
  Award,
  Building2,
  Download,
  Package,
  RotateCcw
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Select from '../../components/common/Select';
import { TOP_PRODUCTS_COMMERCIAL } from '../../data/mockSalesDirectorData';
import { formatNumber, formatCurrency } from '../../utils/formatters';

export default function SalesProducts() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [growthFilter, setGrowthFilter] = useState('All');
  const [rankingFilter, setRankingFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const hasActiveFilters = searchQuery.trim() !== '' || 
    selectedCategory !== 'All' || 
    growthFilter !== 'All' || 
    rankingFilter !== 'All';

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setGrowthFilter('All');
    setRankingFilter('All');
    setSearchQuery('');
  };

  const filteredProducts = TOP_PRODUCTS_COMMERCIAL.filter(prod => {
    const matchCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    
    // Parse growth percentage from '+16.2%'
    const growthNum = parseFloat(prod.growthRate.replace(/[^0-9.]/g, '')) || 0;
    const matchGrowth = growthFilter === 'All' ||
      (growthFilter === 'Surge' && growthNum >= 25) ||
      (growthFilter === 'Strong' && growthNum >= 15 && growthNum < 25) ||
      (growthFilter === 'Steady' && growthNum < 15);

    const matchRanking = rankingFilter === 'All' ||
      (rankingFilter === 'Leader' && prod.marketPosition.includes('#1')) ||
      (rankingFilter === 'Winter' && prod.marketPosition.toLowerCase().includes('winter')) ||
      (rankingFilter === 'Broad' && prod.marketPosition.toLowerCase().includes('broad-spectrum'));

    const matchSearch = !searchQuery || 
      prod.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.skuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.skuCode.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchGrowth && matchRanking && matchSearch;
  });

  const totalProductRevenue = TOP_PRODUCTS_COMMERCIAL.reduce((acc, curr) => acc + curr.monthlyRevenueINR, 0);
  const totalUnitsSold = TOP_PRODUCTS_COMMERCIAL.reduce((acc, curr) => acc + curr.unitsSold, 0);

  const productColumns = [
    {
      header: 'Medicine & Formulation',
      accessor: 'brandName',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-navy-950 text-xs">{row.skuCode}</span>
          <div className="font-bold text-navy-900 text-xs sm:text-sm font-sans">{row.brandName}</div>
          <span className="text-2xs text-slate-500">{row.skuName}</span>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => (
        <span className="text-xs text-slate-700 font-medium">{row.category}</span>
      )
    },
    {
      header: 'Units Sold (MTD)',
      accessor: 'unitsSold',
      align: 'right',
      className: 'whitespace-nowrap min-w-[130px]',
      sortValue: (row) => row.unitsSold,
      render: (row) => (
        <div className="text-right">
          <span className="font-bold text-xs sm:text-sm text-navy-950 font-sans block">{formatNumber(row.unitsSold)} units</span>
          <div className="text-2xs text-slate-400 whitespace-nowrap">Dispensed</div>
        </div>
      )
    },
    {
      header: 'Monthly Revenue',
      accessor: 'monthlyRevenueINR',
      align: 'right',
      className: 'whitespace-nowrap min-w-[140px]',
      sortValue: (row) => row.monthlyRevenueINR,
      render: (row) => (
        <div className="text-right">
          <span className="font-bold text-xs sm:text-sm text-emerald-700 font-sans block">{formatCurrency(row.monthlyRevenueINR)}</span>
          <div className="text-2xs text-emerald-800 font-semibold whitespace-nowrap">{row.growthRate} YoY</div>
        </div>
      )
    },
    {
      header: 'Prescription Share',
      accessor: 'prescriptionShare',
      align: 'center',
      className: 'whitespace-nowrap min-w-[140px]',
      render: (row) => (
        <div className="flex flex-col items-center">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-navy-950 bg-slate-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">
            {row.prescriptionShare}
          </span>
          <div className="text-2xs text-slate-400 mt-0.5 whitespace-nowrap">Doctor detailing pull</div>
        </div>
      )
    },
    {
      header: 'Market Ranking',
      accessor: 'marketPosition',
      align: 'center',
      className: 'whitespace-nowrap min-w-[160px]',
      render: (row) => (
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1 text-2xs font-bold text-terracotta-800 bg-terracotta-50 px-2.5 py-1 rounded-lg border border-terracotta-200 whitespace-nowrap">
            <Award className="w-3 h-3 text-terracotta-600" />
            {row.marketPosition}
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
            <h1 className="font-sans font-bold text-2xl text-navy-950">Product Revenue &amp; Prescriptions</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Commercial Portfolio
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Commercial sales revenue, physician prescription shares, and regional market positioning of GRD formulations.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Download}
          className="text-xs font-semibold whitespace-nowrap self-start sm:self-auto shrink-0"
          onClick={() => {
            const csvContent = "data:text/csv;charset=utf-8," + 
              "SKU,Brand,Generic,Category,UnitsSold,Revenue,Growth,RxShare,Ranking\n" +
              TOP_PRODUCTS_COMMERCIAL.map(p => `"${p.skuCode}","${p.brandName}","${p.skuName}","${p.category}",${p.unitsSold},${p.monthlyRevenueINR},"${p.growthRate}","${p.prescriptionShare}","${p.marketPosition}"`).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Product_Revenue_${new Date().toISOString().slice(0,10)}.csv`);
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
          title="Top Revenue Driver"
          value="DoloGRD-650"
          subtitle="₹68.4 Lakhs MTD"
          icon={Pill}
          trend={{ direction: 'up', value: '+16.2% YoY' }}
        />
        <StatCard
          title="Fastest Growing"
          value="CofGRD Expectorant"
          subtitle="Winter respiratory spike"
          icon={TrendingUp}
          trend={{ direction: 'up', value: '+31.4% Growth' }}
        />
        <StatCard
          title="Units Dispensed"
          value={formatNumber(totalUnitsSold)}
          subtitle="Across hospital & trade"
          icon={Package}
          trend={{ direction: 'up', value: 'High Demand' }}
        />
        <StatCard
          title="Portfolio Revenue"
          value={formatCurrency(totalProductRevenue)}
          subtitle="Top 5 core formulations"
          icon={Building2}
          trend={{ direction: 'up', value: '92.4% Margin' }}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Category Tabs & Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Tablets', 'Syrups', 'Suspensions & Hygiene'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-navy-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <Select
              label="Growth Velocity"
              value={growthFilter}
              onChange={(val) => setGrowthFilter(val)}
              options={[
                { value: 'All', label: 'All Growth Rates' },
                { value: 'Surge', label: 'Surge (>25% YoY)' },
                { value: 'Strong', label: 'Strong Growth (15-25% YoY)' },
                { value: 'Steady', label: 'Steady Growth (<15% YoY)' }
              ]}
              icon={TrendingUp}
            />

            <Select
              label="Market Ranking"
              value={rankingFilter}
              onChange={(val) => setRankingFilter(val)}
              options={[
                { value: 'All', label: 'All Market Positions' },
                { value: 'Leader', label: '#1 Market Leaders' },
                { value: 'Winter', label: 'Winter Respiratory Surge' },
                { value: 'Broad', label: 'Broad-Spectrum Antibiotics' }
              ]}
              icon={Award}
            />

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                title="Reset all product filters"
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
                placeholder="Search brand, generic, or SKU..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 transition-all"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:inline">
              Showing {filteredProducts.length} of {TOP_PRODUCTS_COMMERCIAL.length}
            </span>
          </div>
        </div>
      </div>

      {/* Products Table Card */}
      <Table
        title="Formulation Revenue & Physician Detailing Share"
        subtitle="Commercial revenue contribution, hospital indent velocity, and physician prescription share"
        columns={productColumns}
        data={filteredProducts}
        keyExtractor={(row) => row.skuCode}
        pageSize={10}
        exportable={true}
        exportFilename={`GRD_Product_Sales_${new Date().toISOString().split('T')[0]}`}
        emptyMessage="No products found matching the selected category or search filter."
      />

    </div>
  );
}
