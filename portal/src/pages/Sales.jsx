import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Package,
  Download,
  Building,
  MapPin,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import { useToast } from '../hooks/useToast';
import {
  MOCK_SALES_SUMMARY,
  MOCK_MONTHLY_SALES_BY_CATEGORY,
  MOCK_TOP_PERFORMING_SKUS,
  MOCK_REGION_SALES_BREAKDOWN
} from '../data/mockSales';
import { formatCurrency, formatNumber } from '../utils/formatters';

const SEGMENT_COLORS = ['#0F2544', '#C85A2E', '#2563EB', '#0D9488'];

export default function Sales() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('6M');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const segmentData = [
    { name: 'Govt Medical Colleges & Hospitals', value: MOCK_SALES_SUMMARY.hospitalSharePct },
    { name: 'Retail Pharmacy Network', value: MOCK_SALES_SUMMARY.retailSharePct },
    { name: 'Defense (Army) & Indian Railways', value: MOCK_SALES_SUMMARY.defenseRailSharePct },
    { name: 'Stockist Trade & Commercial', value: MOCK_SALES_SUMMARY.stockistTradeSharePct }
  ];

  const chartFormattedData = MOCK_MONTHLY_SALES_BY_CATEGORY.map(item => ({
    ...item,
    TabletsLakhs: (item.tablets / 100000).toFixed(1),
    CapsulesLakhs: (item.capsules / 100000).toFixed(1),
    SyrupsLakhs: (item.syrups / 100000).toFixed(1),
    HygieneLakhs: (item.hygiene / 100000).toFixed(1),
    TotalLakhs: (item.total / 100000).toFixed(1)
  }));

  const topSkuColumns = [
    {
      header: 'Medicine / SKU',
      className: 'min-w-[130px]',
      render: (row) => (
        <div>
          <span className="font-semibold text-navy-950 text-xs leading-snug whitespace-nowrap">{row.name}</span>
          <div className="text-2xs font-sans text-navy-700/60 whitespace-nowrap">{row.skuCode}</div>
        </div>
      )
    },
    {
      header: 'Units Sold',
      align: 'right',
      className: 'whitespace-nowrap',
      sortValue: (row) => row.unitsSold,
      render: (row) => (
        <span className="text-xs font-semibold text-navy-900 font-sans whitespace-nowrap">{formatNumber(row.unitsSold)}</span>
      )
    },
    {
      header: 'Revenue',
      align: 'right',
      className: 'whitespace-nowrap',
      sortValue: (row) => row.revenueINR,
      render: (row) => (
        <span className="text-xs font-bold text-navy-950 font-sans whitespace-nowrap">{formatCurrency(row.revenueINR)}</span>
      )
    },
    {
      header: 'Margin',
      align: 'center',
      className: 'whitespace-nowrap',
      sortValue: (row) => row.marginPct,
      render: (row) => (
        <span className="text-xs font-semibold text-emerald-700 font-sans">{row.marginPct}%</span>
      )
    },
    {
      header: 'Demand Velocity',
      align: 'center',
      className: 'whitespace-nowrap min-w-[130px]',
      render: (row) => (
        <div className="flex justify-center">
          <span className="inline-block text-2xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap">
            {row.demandTrend}
          </span>
        </div>
      )
    }
  ];

  const regionColumns = [
    {
      header: 'Territory',
      className: 'min-w-[140px]',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-navy-950 whitespace-nowrap">
          <MapPin className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
          <span>{row.region}</span>
        </div>
      )
    },
    {
      header: 'Market Share',
      align: 'center',
      className: 'whitespace-nowrap',
      sortValue: (row) => row.sharePct,
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <div className="w-16 bg-navy-100 rounded-full h-1.5 overflow-hidden shrink-0">
            <div className="bg-navy-900 h-full rounded-full" style={{ width: `${row.sharePct * 2}%` }} />
          </div>
          <span className="text-xs font-medium text-navy-800 font-sans">{row.sharePct}%</span>
        </div>
      )
    },
    {
      header: 'Revenue',
      align: 'right',
      className: 'whitespace-nowrap',
      sortValue: (row) => row.revenueINR,
      render: (row) => (
        <span className="text-xs font-semibold text-navy-900 font-sans whitespace-nowrap">{formatCurrency(row.revenueINR)}</span>
      )
    },
    {
      header: 'YoY Growth',
      align: 'center',
      className: 'whitespace-nowrap',
      sortValue: (row) => row.growthPct,
      render: (row) => (
        <span className="text-xs font-semibold text-emerald-700 font-sans">+{row.growthPct}%</span>
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
              Sales
            </h1>
            <span className="text-xs bg-navy-100 text-navy-800 font-medium px-2 py-0.5 rounded-full">
              FY 2026-27
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
            Review medicine sales revenue, hospital orders, monthly growth, and regional state breakdown across Northeast India.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const headers = ['Medicine SKU', 'Name', 'Units Sold (MTD)', 'Revenue (INR)', 'Gross Margin', 'Demand Trend'];
              const rows = MOCK_TOP_PERFORMING_SKUS.map(s => [
                `"${s.skuCode}"`,
                `"${s.name}"`,
                s.unitsSold,
                s.revenueINR,
                `"${s.marginPct}%"`,
                `"${s.demandTrend}"`
              ].join(','));
              const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'grd_sales_report.csv');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              toast.success('Sales report downloaded (CSV)');
            }}
            icon={Download}
          >
            Export Sales Report
          </Button>
          <div className="flex items-center p-1 bg-navy-100 rounded-lg text-xs font-medium text-navy-800">
            {['3M', '6M', '1Y'].map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-2.5 py-1 rounded ${timeRange === t ? 'bg-white shadow-sm font-bold text-navy-950' : 'hover:text-navy-950'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard 
          title="YTD Total Revenue" 
          value={`₹${(MOCK_SALES_SUMMARY.totalRevenueYTD_INR / 10000000).toFixed(2)} Cr`}
          subtitle="Annualized Northeast sales"
          icon={DollarSign}
          trend={{ direction: 'up', text: `+${MOCK_SALES_SUMMARY.growthVsLastYearPct}% YoY` }}
        />
        <StatCard 
          title="Current Month Sales" 
          value={`₹${(MOCK_SALES_SUMMARY.currentMonthRevenueINR / 10000000).toFixed(2)} Cr`}
          subtitle="November 2026 MTD"
          icon={TrendingUp}
          trend={{ direction: 'up', text: '+7.4% vs Oct' }}
        />
        <StatCard 
          title="YTD Units Dispatched" 
          value={formatNumber(MOCK_SALES_SUMMARY.totalUnitsSoldYTD)}
          subtitle="Packs & bottles across 8 states"
          icon={Package}
        />
        <StatCard 
          title="Hospital & Tender Share" 
          value={`${MOCK_SALES_SUMMARY.hospitalSharePct + MOCK_SALES_SUMMARY.defenseRailSharePct}%`}
          subtitle="Institutional off-take anchor"
          icon={Building}
          badge={{ text: 'Stable Base', variant: 'info' }}
        />
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend by Category */}
        <div className="lg:col-span-2 card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-100 pb-3">
            <div>
              <h3 className="font-sans font-bold text-navy-950 text-base">Monthly Sales Trajectory (₹ Lakhs)</h3>
              <p className="text-2xs text-navy-700/60">Category-wise monthly dispatch value across Northeast distribution channels</p>
            </div>
            <span className="text-xs font-medium text-navy-800 bg-navy-50 px-2 py-1 rounded border border-navy-100">
              Assam Hub Anchor
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartFormattedData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit="L" />
                <Tooltip 
                  formatter={(val, name) => [`₹${val} Lakhs`, name.replace('Lakhs', '')]}
                  contentStyle={{ backgroundColor: '#0F2544', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="TabletsLakhs" name="Tablets" fill="#0F2544" stackId="a" />
                <Bar dataKey="CapsulesLakhs" name="Capsules" fill="#2563EB" stackId="a" />
                <Bar dataKey="SyrupsLakhs" name="Syrups & Suspensions" fill="#C85A2E" stackId="a" />
                <Bar dataKey="HygieneLakhs" name="Sanitizers & Hygiene" fill="#0D9488" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Segment Breakdown */}
        <div className="card p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-navy-100 pb-3">
              <h3 className="font-sans font-bold text-navy-950 text-base">Customer Segment Share</h3>
              <p className="text-2xs text-navy-700/60">Institutional vs open trade retail split</p>
            </div>

            <div className="h-52 w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val) => [`${val}%`, 'Share']}
                    contentStyle={{ backgroundColor: '#0F2544', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-navy-100 text-xs">
            {segmentData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SEGMENT_COLORS[idx] }} />
                  <span className="text-navy-800 text-2xs truncate max-w-[180px]">{item.name}</span>
                </div>
                <span className="font-bold text-navy-950">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Section: Top SKUs & Regional Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top SKUs */}
        <div className="card p-3.5 sm:p-4.5 space-y-3">
          <div className="flex items-center justify-between border-b border-navy-100 pb-2">
            <div>
              <h3 className="font-sans font-bold text-navy-950 text-base">Top Performing Medicines (MTD)</h3>
              <p className="text-2xs text-navy-700/60">Fastest-moving formulations by volume & commercial realization</p>
            </div>
            <Sparkles className="w-4 h-4 text-terracotta-600" />
          </div>
          <Table 
            compact={true}
            columns={topSkuColumns}
            data={MOCK_TOP_PERFORMING_SKUS}
            keyExtractor={(row) => row.skuCode}
          />
        </div>

        {/* Regional Breakdown */}
        <div className="card p-3.5 sm:p-4.5 space-y-3">
          <div className="flex items-center justify-between border-b border-navy-100 pb-2">
            <div>
              <h3 className="font-sans font-bold text-navy-950 text-base">Regional Northeast Revenue Split</h3>
              <p className="text-2xs text-navy-700/60">Territorial sales volume and annual compound growth rate</p>
            </div>
            <MapPin className="w-4 h-4 text-navy-700/50" />
          </div>
          <Table 
            compact={true}
            columns={regionColumns}
            data={MOCK_REGION_SALES_BREAKDOWN}
            keyExtractor={(row) => row.region}
          />
        </div>
      </div>
    </div>
  );
}
