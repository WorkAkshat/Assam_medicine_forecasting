import React, { useState } from 'react';
import {
  Pill,
  Boxes,
  Truck,
  ShieldAlert,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Filter,
  ChevronRight
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import ExportButton from '../components/common/ExportButton';
import Select from '../components/common/Select';
import DemandTrendChart from '../components/charts/DemandTrendChart';
import StateDistributionChart from '../components/charts/StateDistributionChart';
import ForecastAccuracyChart from '../components/charts/ForecastAccuracyChart';
import { MOCK_SKUS } from '../data/mockSkus';
import { MOCK_INVENTORY_ITEMS, STATES } from '../data/mockInventory';
import { MOCK_REPLENISHMENT_RECOMMENDATIONS } from '../data/mockReplenishment';
import { MOCK_IN_TRANSIT_SHIPMENTS } from '../data/mockLogistics';

import { formatNumber, formatCurrency } from '../utils/formatters';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePersistentState } from '../hooks/usePersistentState';
import { STORAGE_KEYS } from '../services/grdDataService';
import DistributorDashboard from './distributor/DistributorDashboard';
import SalesDirectorDashboard from './salesDirector/SalesDirectorDashboard';
import SupplyChainDashboard from './supplyChain/SupplyChainDashboard';
import WarehouseDashboard from './warehouse/WarehouseDashboard';
import ManagementDashboard from './management/ManagementDashboard';

export default function Dashboard() {
  const { currentRole } = useAuth();

  // If active perspective is Management / Executive, render Executive Leadership Desk
  if (currentRole === 'management') {
    return <ManagementDashboard />;
  }

  // If active perspective is Warehouse Controller, render dedicated Plant Warehouse Operations Desk
  if (currentRole === 'warehouse-staff') {
    return <WarehouseDashboard />;
  }

  // If active perspective is Supply Chain Manager, render dedicated Supply Chain Operations Desk
  if (currentRole === 'supply-chain-manager') {
    return <SupplyChainDashboard />;
  }

  // If active perspective is Distributor Partner, render dedicated Distributor Dashboard
  if (currentRole === 'distributor') {
    return <DistributorDashboard />;
  }

  // If active perspective is Sales Director, render dedicated Commercial Sales Dashboard
  if (currentRole === 'sales-manager') {
    return <SalesDirectorDashboard />;
  }

  const [skus] = usePersistentState(STORAGE_KEYS.SKUS, MOCK_SKUS);
  const [inventory] = usePersistentState(STORAGE_KEYS.INVENTORY, MOCK_INVENTORY_ITEMS);
  const [replenishments] = usePersistentState(STORAGE_KEYS.REPLENISHMENT, MOCK_REPLENISHMENT_RECOMMENDATIONS);

  const [selectedState, setSelectedState] = useState('All States');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter inventory items based on selection
  const filteredInventory = inventory.filter(item => {
    const matchState = selectedState === 'All States' || item.state === selectedState;
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchState && matchCat;
  });

  const matchingSkus = skus.filter(sku => selectedCategory === 'All' || sku.category === selectedCategory);
  const matchingStock = filteredInventory.reduce((acc, item) => acc + (item.available ?? item.onHand ?? item.currentStock ?? 0), 0);
  const totalInTransit = filteredInventory.reduce((acc, item) => acc + (item.inTransit || 0), 0);
  const stockoutRiskCount = filteredInventory.filter(item => item.status === 'Low' || item.status === 'Critical' || (item.available || 0) < (item.minStock || 1000)).length;

  const criticalReplenishments = replenishments.filter(r => {
    const isCrit = r.urgencyPriority === 'Critical' || r.urgency === 'Critical';
    const matchState = selectedState === 'All States' || r.state === selectedState || r.targetState === selectedState || r.depotName?.includes(selectedState);
    const matchCat = selectedCategory === 'All' || r.category === selectedCategory;
    return isCrit && (selectedState === 'All States' ? true : matchState);
  });

  return (
    <div className="space-y-6">
      
      {/* Page Title & Operational Filter Bar */}
      {/* Page Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans font-bold text-2xl text-navy-950">Medicine Demand &amp; Supply Overview</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live Monitoring
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Real-time medicine demand, warehouse stock levels, and automated restocking across Assam and Northeast India.
          </p>
        </div>

        {/* Global Dashboard Filters */}
        <div className="flex items-center gap-2 text-xs shrink-0 flex-wrap py-0.5 relative z-10">
          <Select
            value={selectedState}
            onChange={(val) => setSelectedState(val)}
            options={STATES}
            icon={Filter}
          />

          <Select
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
            options={[
              { value: 'All', label: 'All Medicines' },
              { value: 'Tablets', label: 'Tablets' },
              { value: 'Capsules', label: 'Capsules' },
              { value: 'Syrups', label: 'Syrups' },
              { value: 'Suspensions & Hygiene', label: 'Suspensions & Hygiene' }
            ]}
            icon={Boxes}
            align="right"
          />

          <ExportButton label="Export CSV" data={matchingSkus} filename="skus_inventory_forecast" />
        </div>
      </div>

      {/* Active Filter Indicator */}
      {(selectedState !== 'All States' || selectedCategory !== 'All') && (
        <div className="flex items-center justify-between bg-navy-50/80 border border-navy-100 rounded-xl px-3 py-2 text-xs text-navy-900 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="font-bold text-terracotta-700">Active Filter:</span>
            <span>{selectedState !== 'All States' ? `State: ${selectedState}` : 'All States'}</span>
            <span>•</span>
            <span>{selectedCategory !== 'All' ? `Category: ${selectedCategory}` : 'All Medicines'}</span>
            <span className="text-slate-400 font-medium">({matchingSkus.length} Formulations Active)</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedState('All States');
              setSelectedCategory('All');
            }}
            className="text-terracotta-600 hover:text-terracotta-800 font-bold underline cursor-pointer text-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Medicines Monitored"
          value={matchingSkus.length}
          subvalue="Active Formulations"
          icon={Pill}
          change="+18.4% YoY"
          isPositive={true}
          badge={selectedCategory !== 'All' ? `${selectedCategory} Filter` : 'Rani Plant Active'}
          badgeColor="bg-blue-50 text-blue-700"
        />

        <StatCard
          title="Total Stock Available"
          value={formatNumber(matchingStock)}
          subvalue="Units in Depots"
          icon={Boxes}
          change="+12,400 units"
          isPositive={true}
          badge={selectedState !== 'All States' ? `${selectedState} Depots` : '12 Stock Hubs'}
          badgeColor="bg-emerald-50 text-emerald-700"
        />

        <StatCard
          title="Stock on Delivery Routes"
          value={formatNumber(totalInTransit)}
          subvalue="Units in Transit"
          icon={Truck}
          change="Live Fleet Corridors"
          isPositive={true}
          badge="NH-6 / NH-27 Active"
          badgeColor="bg-amber-50 text-amber-700"
        />

        <StatCard
          title="Depots Low on Stock"
          value={stockoutRiskCount}
          subvalue="Locations Need Stock"
          icon={ShieldAlert}
          change={stockoutRiskCount === 0 ? "Optimal buffer" : `${stockoutRiskCount} Depots below SS`}
          isPositive={stockoutRiskCount === 0}
          badge={stockoutRiskCount === 0 ? "SLA Maintained" : "Action Needed"}
          badgeColor={stockoutRiskCount === 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}
        />
      </div>

      {/* NESFIC-I-09 Pilot Banner - Clean Light Theme */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/70 via-white to-blue-50/70 text-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-terracotta-600 text-white text-[10px] font-sans font-bold">
              NESFIC-I-09 Pilot Project
            </span>
            <span className="text-xs text-slate-500 font-medium">Assam Medicine Availability Network</span>
          </div>
          <h3 className="font-sans font-bold text-base sm:text-lg text-navy-950">
            Pilot Week 11: Forecast Accuracy at 79.4% (+15.2% Improvement Over Baseline)
          </h3>
          <p className="text-xs text-slate-600 font-normal max-w-2xl leading-relaxed">
            Live validation across Guwahati Central Depot, Rani cGMP plant, Dibrugarh, and Silchar stockists. Hospital stockouts decreased by 34.6%, ensuring critical medicines remain available for patients.
          </p>
        </div>

        <Link
          to="/pilot-kpis"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-semibold shrink-0 transition-all shadow-sm"
        >
          <span>View 5 Pilot Goals &amp; Progress</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Main Charts & Reorder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
        
        {/* Left 2 Cols: Demand Forecast Horizon Chart */}
        <div className="lg:col-span-2 portal-card p-5 space-y-4 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-terracotta-600" />
                <h3 className="font-sans font-bold text-base text-navy-950">
                  Medicine Demand: Past Sales vs 90-Day Forecast
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-light mt-0.5">
                Past 6 Months Sales &bull; Baseline Average &bull; AI 90-Day Demand Projection
              </p>
            </div>

            <Link to="/demand-forecasting" className="text-xs font-semibold text-navy-900 hover:text-terracotta-600 flex items-center gap-1">
              <span>View All Forecasts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <DemandTrendChart height={310} />

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xs text-slate-500 block font-medium">Forecast Accuracy</span>
              <span className="font-bold text-emerald-700 text-sm">87.2% Accurate</span>
              <span className="text-[10px] text-slate-400 block">12.8% Error Margin</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xs text-slate-500 block font-medium">Winter Demand Surge</span>
              <span className="font-bold text-navy-950 text-sm">+28.5% Expected</span>
              <span className="text-[10px] text-terracotta-600 block">Cough, Cold &amp; Antibiotics</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xs text-slate-500 block font-medium">Prediction Reliability</span>
              <span className="font-bold text-blue-700 text-sm">88.2% High</span>
              <span className="text-[10px] text-slate-400 block">Validated Model</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Urgent Decision-Support Actions */}
        <div className="portal-card p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-terracotta-600" />
                <h3 className="font-sans font-bold text-base text-navy-950">
                  Urgent Reorders Needed
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                {criticalReplenishments.length} Urgent
              </span>
            </div>
            <p className="text-xs text-slate-500 font-light mt-1">
              Medicines that must be dispatched immediately to prevent stockouts at regional hospitals.
            </p>

            {/* Replenishment Mini List */}
            <div className="mt-3 space-y-2.5">
              {criticalReplenishments.slice(0, 3).map((rep) => (
                <div key={rep.id} className="p-3 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-navy-950">{rep.skuCode}</span>
                    <Badge status={rep.urgencyPriority} />
                  </div>
                  <p className="text-[11px] text-slate-700 font-medium truncate">{rep.skuName}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>To: <strong>{rep.destinationState}</strong></span>
                    <span className="font-semibold text-terracotta-700">+{formatNumber(rep.recommendedReplenishQty)} units</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/smart-replenishment"
            className="w-full py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Review All Reorder Requests</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* Second Grid: State Distribution & Accuracy by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* State Demand Distribution */}
        <div className="portal-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="font-sans font-bold text-base text-navy-950">
                Medicine Demand Share by State
              </h3>
              <p className="text-xs text-slate-500 font-light">Assam (Hub) and 7 Northeast regional states</p>
            </div>
            <Link to="/inventory" className="text-xs font-semibold text-navy-900 hover:text-terracotta-600">
              View Warehouses &rarr;
            </Link>
          </div>
          <StateDistributionChart height={240} />
        </div>

        {/* Forecast Accuracy vs Legacy Baseline */}
        <div className="portal-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="font-sans font-bold text-base text-navy-950">
                Forecast Accuracy: AI vs Old Manual Guesses
              </h3>
              <p className="text-xs text-slate-500 font-light">Goal: +20% better accuracy than old manual estimates</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Target Achieved
            </span>
          </div>
          <ForecastAccuracyChart height={240} />
        </div>

      </div>

      {/* Active In-Transit Shipments Tracking Table */}
      <div className="portal-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-terracotta-600" />
              <h3 className="font-sans font-bold text-base text-navy-950">
                Live Medicine Delivery Trucks on Road
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Current live location, truck routes, and delivery status of medicine consignments
            </p>
          </div>

          <Link to="/logistics-monitoring" className="text-xs font-semibold text-navy-900 hover:text-terracotta-600 flex items-center gap-1">
            <span>View All Shipments</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-3">Tracking ID</th>
                <th className="py-2.5 px-3">Route &amp; Destination</th>
                <th className="py-2.5 px-3">Medicines Carried</th>
                <th className="py-2.5 px-3">Current Location</th>
                <th className="py-2.5 px-3">Delivery Status</th>
                <th className="py-2.5 px-3 text-right">Value (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {MOCK_IN_TRANSIT_SHIPMENTS.map((shp) => (
                <tr key={shp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-sans font-bold text-navy-900">{shp.trackingNumber}</td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-900">{shp.destination}</p>
                    <p className="text-[11px] text-slate-400">From: {shp.origin}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-[220px] truncate">{shp.cargoDescription}</td>
                  <td className="py-3 px-3 text-slate-600">{shp.currentLocation}</td>
                  <td className="py-3 px-3">
                    <Badge status={shp.status} />
                  </td>
                  <td className="py-3 px-3 text-right font-sans font-bold text-navy-950">
                    {formatCurrency(shp.shipmentValueINR)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
