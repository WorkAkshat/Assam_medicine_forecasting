import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PortalLayout from '../components/layout/PortalLayout';

// Module Pages
import Dashboard from '../pages/Dashboard';
import PilotMonitoring from '../pages/PilotMonitoring';
import DemandForecasting from '../pages/DemandForecasting';
import Replenishment from '../pages/Replenishment';
import StockoutRisk from '../pages/StockoutRisk';
import ExcessInventory from '../pages/ExcessInventory';
import ExpiryManagement from '../pages/ExpiryManagement';
import Logistics from '../pages/Logistics';
import Skus from '../pages/Skus';
import Inventory from '../pages/Inventory';
import Orders from '../pages/Orders';
import Sales from '../pages/Sales';
import Distributors from '../pages/Distributors';
import Stockists from '../pages/Stockists';
import Customers from '../pages/Customers';
import Reports from '../pages/Reports';
import Alerts from '../pages/Alerts';
import DataImport from '../pages/DataImport';
import Users from '../pages/Users';
import Settings from '../pages/Settings';

// Dedicated Distributor Partner Portal Pages
import DistributorDashboard from '../pages/distributor/DistributorDashboard';
import DistributorOrders from '../pages/distributor/DistributorOrders';
import DistributorNewOrder from '../pages/distributor/DistributorNewOrder';
import DistributorStockists from '../pages/distributor/DistributorStockists';
import DistributorInventory from '../pages/distributor/DistributorInventory';
import DistributorLedger from '../pages/distributor/DistributorLedger';

// Dedicated Sales Director Commercial Portal Pages
import SalesDirectorDashboard from '../pages/salesDirector/SalesDirectorDashboard';
import SalesTerritories from '../pages/salesDirector/SalesTerritories';
import SalesCreditApprovals from '../pages/salesDirector/SalesCreditApprovals';
import SalesFieldForce from '../pages/salesDirector/SalesFieldForce';
import SalesProducts from '../pages/salesDirector/SalesProducts';

// Dedicated Supply Chain Manager Portal Pages (Dr. Abhijit Sarma)
import SupplyChainDashboard from '../pages/supplyChain/SupplyChainDashboard';
import SupplyChainApprovals from '../pages/supplyChain/SupplyChainApprovals';
import SupplyChainInward from '../pages/supplyChain/SupplyChainInward';
import SupplyChainColdChain from '../pages/supplyChain/SupplyChainColdChain';
import SupplyChainTransfers from '../pages/supplyChain/SupplyChainTransfers';

// Dedicated Warehouse Controller Portal Pages (Pranabesh Bora - Rani cGMP Plant)
import WarehouseDashboard from '../pages/warehouse/WarehouseDashboard';
import WarehouseBatches from '../pages/warehouse/WarehouseBatches';
import WarehouseDispatch from '../pages/warehouse/WarehouseDispatch';
import WarehouseStorage from '../pages/warehouse/WarehouseStorage';
import WarehouseAudit from '../pages/warehouse/WarehouseAudit';

// Dedicated Management / Executive Portal Pages (Gautam R. Dhanuka - Corporate HQ)
import ManagementDashboard from '../pages/management/ManagementDashboard';
import ManagementAvailability from '../pages/management/ManagementAvailability';
import ManagementFinancials from '../pages/management/ManagementFinancials';
import ManagementGovernance from '../pages/management/ManagementGovernance';
import ManagementStrategy from '../pages/management/ManagementStrategy';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PortalLayout />}>
        {/* Default redirect to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 20 Functional Modules */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pilot-kpis" element={<PilotMonitoring />} />
        <Route path="/demand-forecasting" element={<DemandForecasting />} />
        <Route path="/smart-replenishment" element={<Replenishment />} />
        <Route path="/stockout-risk" element={<StockoutRisk />} />
        <Route path="/excess-inventory" element={<ExcessInventory />} />
        <Route path="/expiry-management" element={<ExpiryManagement />} />
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
  );
}
