import React, { useState } from 'react';
import {
  Boxes,
  Building2,
  Search,
  Filter,
  Clock,
  ShoppingCart,
  TrendingUp,
  Warehouse
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import { usePersistentState } from '../../hooks/usePersistentState';
import { STORAGE_KEYS, INITIAL_DISTRIBUTOR_INVENTORY } from '../../services/grdDataService';
import { GUWAHATI_DEPOT_STOCK } from '../../data/mockDistributorPortalData';
import { formatNumber, formatCurrency } from '../../utils/formatters';

export default function DistributorInventory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('godown'); // 'godown' or 'depot'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [godownStock] = usePersistentState(STORAGE_KEYS.DISTRIBUTOR_INVENTORY, INITIAL_DISTRIBUTOR_INVENTORY);

  // Filter godown stock items
  const filteredGodownStock = godownStock.filter(item => {
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = !searchQuery || 
      item.skuName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skuCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brandName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Filter depot stock items
  const filteredDepotStock = GUWAHATI_DEPOT_STOCK.filter(item => {
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = !searchQuery || 
      item.skuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skuCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalGodownUnits = godownStock.reduce((acc, curr) => acc + (curr.godownStock || 0), 0);
  const totalGodownValue = godownStock.reduce((acc, curr) => acc + ((curr.godownStock || 0) * (curr.tradePrice || 0)), 0);
  const totalDepotUnits = GUWAHATI_DEPOT_STOCK.reduce((acc, curr) => acc + curr.availableUnits, 0);

  const godownColumns = [
    {
      header: 'Medicine & Formulation',
      accessor: 'skuName',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-navy-950 text-xs">{row.skuCode}</span>
          <div className="font-bold text-navy-900 text-xs sm:text-sm font-sans">{row.brandName || row.skuName}</div>
          <span className="text-2xs text-slate-500">{row.skuName} · {row.packSize}</span>
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
      header: 'Godown On-Hand Stock',
      accessor: 'godownStock',
      align: 'right',
      className: 'whitespace-nowrap min-w-[130px]',
      sortValue: (row) => row.godownStock,
      render: (row) => (
        <div className="text-right">
          <span className="font-bold text-xs sm:text-sm text-emerald-700 font-sans block">{formatNumber(row.godownStock || 0)} packs</span>
          <div className="text-2xs text-slate-400 whitespace-nowrap">Panbazar Godown</div>
        </div>
      )
    },
    {
      header: 'Trade Value (INR)',
      align: 'right',
      className: 'whitespace-nowrap min-w-[130px]',
      sortValue: (row) => (row.godownStock || 0) * (row.tradePrice || 0),
      render: (row) => (
        <div className="text-right">
          <span className="font-bold text-xs text-navy-950 font-sans block">
            {formatCurrency((row.godownStock || 0) * (row.tradePrice || 0))}
          </span>
          <div className="text-2xs text-slate-400 whitespace-nowrap">DP: ₹{Number(row.tradePrice || 0).toFixed(2)}</div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'godownStock',
      align: 'center',
      className: 'whitespace-nowrap min-w-[100px]',
      render: (row) => {
        const stock = row.godownStock || 0;
        const isLow = stock < 500;
        return (
          <div className="flex justify-center">
            <Badge variant={isLow ? 'warning' : 'success'} className="whitespace-nowrap">
              {isLow ? 'Low Buffer' : 'Adequate'}
            </Badge>
          </div>
        );
      }
    },
    {
      header: 'Action',
      align: 'center',
      sortable: false,
      className: 'whitespace-nowrap min-w-[160px]',
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-center">
          <Link to="/distributor/stockists">
            <Button
              size="sm"
              variant="outline"
              className="text-xs py-1 px-2.5 text-emerald-700 border-emerald-200 hover:bg-emerald-50 whitespace-nowrap cursor-pointer"
            >
              Bill Chemist
            </Button>
          </Link>
          <Link to="/distributor/new-order">
            <Button
              size="sm"
              className="bg-navy-900 hover:bg-navy-950 text-white text-xs py-1 px-2.5 whitespace-nowrap cursor-pointer"
            >
              Restock
            </Button>
          </Link>
        </div>
      )
    }
  ];

  const depotStockColumns = [
    {
      header: 'Medicine & Formulation',
      accessor: 'skuName',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-navy-950 text-xs">{row.skuCode}</span>
          <div className="font-bold text-navy-900 text-xs sm:text-sm font-sans">{row.skuName}</div>
          <span className="text-2xs text-terracotta-700 font-semibold">{row.brandName} · {row.packSize}</span>
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
      header: 'Depot Available Units',
      accessor: 'availableUnits',
      sortValue: (row) => row.availableUnits,
      render: (row) => (
        <div className="text-right sm:text-left">
          <span className="font-bold text-xs sm:text-sm text-emerald-700 font-sans">{formatNumber(row.availableUnits)} units</span>
          <div className="text-2xs text-slate-400">Guwahati Central Godown</div>
        </div>
      )
    },
    {
      header: 'Trade Price (DP)',
      accessor: 'tradePrice',
      sortValue: (row) => row.tradePrice,
      render: (row) => (
        <div className="text-right">
          <span className="font-bold text-xs text-navy-950 font-sans">₹{row.tradePrice.toFixed(2)}</span>
          <div className="text-2xs text-slate-400">MRP: ₹{row.mrp.toFixed(2)}</div>
        </div>
      )
    },
    {
      header: 'Batch & Expiry',
      accessor: 'batchNumber',
      className: 'whitespace-nowrap min-w-[130px]',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-navy-950 text-xs whitespace-nowrap">{row.batchNumber}</span>
          <div className="text-2xs text-emerald-700 font-medium whitespace-nowrap">Exp: {row.expiryDate}</div>
        </div>
      )
    },
    {
      header: 'Action',
      sortable: false,
      render: (row) => (
        <Link to="/distributor/new-order">
          <Button
            size="sm"
            className="bg-navy-900 hover:bg-navy-950 text-white text-xs py-1 px-3 flex items-center gap-1"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Order
          </Button>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans font-bold text-2xl text-navy-950">Distributor Godown &amp; Mother Depot Stock</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              Pragjyotish Medico
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Monitor verified physical inventory at Panbazar Godown and live stock ready for loading at Guwahati Central Depot.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/distributor/new-order">
            <Button className="bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5">
              <ShoppingCart className="w-4 h-4" />
              Place Indent Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('godown')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'godown'
              ? 'bg-navy-950 text-white shadow-sm'
              : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
          }`}
        >
          <Warehouse className="w-4 h-4" />
          <span>My Panbazar Godown Stock ({godownStock.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('depot')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'depot'
              ? 'bg-navy-950 text-white shadow-sm'
              : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Guwahati Mother Depot Availability ({GUWAHATI_DEPOT_STOCK.length})</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Godown On-Hand Units"
          value={formatNumber(totalGodownUnits)}
          subtitle="Physical inventory in Panbazar"
          icon={Boxes}
          trend={{ direction: 'up', text: 'Verified stock' }}
          badge={{ text: 'In Godown', variant: 'success' }}
        />
        <StatCard
          title="Godown Stock Value"
          value={formatCurrency(totalGodownValue)}
          subtitle="Current inventory valuation"
          icon={TrendingUp}
          badge={{ text: 'Working Capital', variant: 'info' }}
        />
        <StatCard
          title="Mother Depot Stock"
          value={formatNumber(totalDepotUnits)}
          subtitle="Available for quick restock"
          icon={Building2}
          badge={{ text: 'Guwahati CD', variant: 'neutral' }}
        />
        <StatCard
          title="Stock Cover Period"
          value="18.5 Days"
          subtitle="Based on pharmacy run-rate"
          icon={Clock}
          trend={{ direction: 'neutral', text: 'Safe buffer' }}
          badge={{ text: 'Optimal', variant: 'success' }}
        />
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search medicine, code, or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9 py-2 text-xs w-full bg-slate-50 border-slate-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input py-2 text-xs bg-slate-50 border-slate-200"
          >
            <option value="All">All Categories</option>
            <option value="Tablets">Tablets</option>
            <option value="Capsules">Capsules</option>
            <option value="Syrups">Syrups</option>
            <option value="Suspensions & Hygiene">Suspensions &amp; Hygiene</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {activeTab === 'godown' ? (
          <Table
            columns={godownColumns}
            data={filteredGodownStock}
            keyExtractor={(row) => row.skuCode}
            defaultSortKey="godownStock"
            defaultSortOrder="desc"
          />
        ) : (
          <Table
            columns={depotStockColumns}
            data={filteredDepotStock}
            keyExtractor={(row) => row.skuCode}
            defaultSortKey="availableUnits"
            defaultSortOrder="desc"
          />
        )}
      </div>

    </div>
  );
}
