import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PortalLayout from '../components/layout/PortalLayout';

// Module Pages
const Dashboard = lazy(() => import('../pages/Dashboard'));
const ImpactLab = lazy(() => import('../pages/ImpactLab'));
const ControlTower = lazy(() => import('../pages/ControlTower'));
const ForecastStudio = lazy(() => import('../pages/ForecastStudio'));
const ReplenishmentPlan = lazy(() => import('../pages/ReplenishmentPlan'));
const StockoutRisk = lazy(() => import('../pages/StockoutRisk'));
const ExcessInventory = lazy(() => import('../pages/ExcessInventory'));
const ExpiryRadar = lazy(() => import('../pages/ExpiryRadar'));
const Logistics = lazy(() => import('../pages/Logistics'));
const Skus = lazy(() => import('../pages/Skus'));
const Inventory = lazy(() => import('../pages/Inventory'));
const Orders = lazy(() => import('../pages/Orders'));
const Sales = lazy(() => import('../pages/Sales'));
const Distributors = lazy(() => import('../pages/Distributors'));
const Stockists = lazy(() => import('../pages/Stockists'));
const Customers = lazy(() => import('../pages/Customers'));
const Reports = lazy(() => import('../pages/Reports'));
const Alerts = lazy(() => import('../pages/Alerts'));
const DataImport = lazy(() => import('../pages/DataImport'));
const Users = lazy(() => import('../pages/Users'));
const Settings = lazy(() => import('../pages/Settings'));

// Dedicated Distributor Partner Portal Pages
const DistributorDashboard = lazy(() => import('../pages/distributor/DistributorDashboard'));
const DistributorOrders = lazy(() => import('../pages/distributor/DistributorOrders'));
const DistributorNewOrder = lazy(() => import('../pages/distributor/DistributorNewOrder'));
const DistributorStockists = lazy(() => import('../pages/distributor/DistributorStockists'));
const DistributorInventory = lazy(() => import('../pages/distributor/DistributorInventory'));
const DistributorLedger = lazy(() => import('../pages/distributor/DistributorLedger'));

// Dedicated Sales Director Commercial Portal Pages
const SalesDirectorDashboard = lazy(() => import('../pages/salesDirector/SalesDirectorDashboard'));
const SalesTerritories = lazy(() => import('../pages/salesDirector/SalesTerritories'));
const SalesCreditApprovals = lazy(() => import('../pages/salesDirector/SalesCreditApprovals'));
const SalesFieldForce = lazy(() => import('../pages/salesDirector/SalesFieldForce'));
const SalesProducts = lazy(() => import('../pages/salesDirector/SalesProducts'));

// Dedicated Supply Chain Manager Portal Pages (Dr. Abhijit Sarma)
const SupplyChainDashboard = lazy(() => import('../pages/supplyChain/SupplyChainDashboard'));
const SupplyChainApprovals = lazy(() => import('../pages/supplyChain/SupplyChainApprovals'));
const SupplyChainInward = lazy(() => import('../pages/supplyChain/SupplyChainInward'));
const SupplyChainColdChain = lazy(() => import('../pages/supplyChain/SupplyChainColdChain'));
const SupplyChainTransfers = lazy(() => import('../pages/supplyChain/SupplyChainTransfers'));

// Dedicated Warehouse Controller Portal Pages (Pranabesh Bora - Rani cGMP Plant)
const WarehouseDashboard = lazy(() => import('../pages/warehouse/WarehouseDashboard'));
const WarehouseBatches = lazy(() => import('../pages/warehouse/WarehouseBatches'));
const WarehouseDispatch = lazy(() => import('../pages/warehouse/WarehouseDispatch'));
const WarehouseStorage = lazy(() => import('../pages/warehouse/WarehouseStorage'));
const WarehouseAudit = lazy(() => import('../pages/warehouse/WarehouseAudit'));

// Dedicated Management / Executive Portal Pages (Gautam R. Dhanuka - Corporate HQ)
const ManagementDashboard = lazy(() => import('../pages/management/ManagementDashboard'));
const ManagementAvailability = lazy(() => import('../pages/management/ManagementAvailability'));
const ManagementFinancials = lazy(() => import('../pages/management/ManagementFinancials'));
const ManagementGovernance = lazy(() => import('../pages/management/ManagementGovernance'));
const ManagementStrategy = lazy(() => import('../pages/management/ManagementStrategy'));

function PageFallback() {
  return (
    <div className="space-y-4" aria-busy="true">
      <div className="h-8 w-64 rounded-md bg-mist-200 animate-pulse" />
      <div className="h-48 rounded-lg bg-white border border-mist-300/70 animate-pulse" />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
    <Routes>
      <Route element={<PortalLayout />}>
        {/* Default redirect to Dashboard */}
        <Route path="/" element={<Navigate to="/control-tower" replace />} />
        <Route path="/control-tower" element={<ControlTower />} />

        {/* 20 Functional Modules */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pilot-kpis" element={<ImpactLab />} />
        <Route path="/demand-forecasting" element={<ForecastStudio />} />
        <Route path="/smart-replenishment" element={<ReplenishmentPlan />} />
        <Route path="/stockout-risk" element={<StockoutRisk />} />
        <Route path="/excess-inventory" element={<ExcessInventory />} />
        <Route path="/expiry-management" element={<ExpiryRadar />} />
        <Route path="/logistics-monitoring" element={<Logistics />} />
        <Route path="/skus" element={<Skus />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/distributors" element={<Distributors />} />
        <Route path="/stockists" element={<Stockists />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/data-import" element={<DataImport />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />

        {/* Distributor Partner Portal Routes */}
        <Route path="/distributor/dashboard" element={<DistributorDashboard />} />
        <Route path="/distributor/orders" element={<DistributorOrders />} />
        <Route path="/distributor/new-order" element={<DistributorNewOrder />} />
        <Route path="/distributor/stockists" element={<DistributorStockists />} />
        <Route path="/distributor/depot-stock" element={<DistributorInventory />} />
        <Route path="/distributor/ledger" element={<DistributorLedger />} />

        {/* Sales Director Commercial Portal Routes */}
        <Route path="/sales-director/dashboard" element={<SalesDirectorDashboard />} />
        <Route path="/sales-director/territories" element={<SalesTerritories />} />
        <Route path="/sales-director/credit-approvals" element={<SalesCreditApprovals />} />
        <Route path="/sales-director/field-force" element={<SalesFieldForce />} />
        <Route path="/sales-director/products" element={<SalesProducts />} />

        {/* Supply Chain Manager Portal Routes (Dr. Abhijit Sarma) */}
        <Route path="/supply-chain/dashboard" element={<SupplyChainDashboard />} />
        <Route path="/supply-chain/approvals" element={<SupplyChainApprovals />} />
        <Route path="/supply-chain/inward" element={<SupplyChainInward />} />
        <Route path="/supply-chain/cold-chain" element={<SupplyChainColdChain />} />
        <Route path="/supply-chain/transfers" element={<SupplyChainTransfers />} />

        {/* Warehouse Controller Portal Routes (Pranabesh Bora - Rani cGMP Plant) */}
        <Route path="/warehouse/dashboard" element={<WarehouseDashboard />} />
        <Route path="/warehouse/batches" element={<WarehouseBatches />} />
        <Route path="/warehouse/dispatch" element={<WarehouseDispatch />} />
        <Route path="/warehouse/storage" element={<WarehouseStorage />} />
        <Route path="/warehouse/audit" element={<WarehouseAudit />} />

        {/* Management / Executive Portal Routes (Gautam R. Dhanuka - Corporate HQ) */}
        <Route path="/management/dashboard" element={<ManagementDashboard />} />
        <Route path="/management/availability" element={<ManagementAvailability />} />
        <Route path="/management/financials" element={<ManagementFinancials />} />
        <Route path="/management/governance" element={<ManagementGovernance />} />
        <Route path="/management/strategy" element={<ManagementStrategy />} />

        {/* 404 Wildcard fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
    </Suspense>
  );
}
