import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  Pill,
  Boxes,
  TrendingUp,
  Sparkles,
  Truck,
  Building2,
  Store,
  Hospital,
  ShoppingCart,
  BarChart3,
  ShieldAlert,
  Archive,
  Clock,
  Bell,
  FileUp,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Factory,
  ThermometerSnowflake,
  QrCode,
  FileText,
  Award,
  DollarSign,
  ArrowLeftRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePersistentState } from '../../hooks/usePersistentState';
import { DISTRIBUTOR_ORDERS } from '../../data/mockDistributorPortalData';
import { COMMERCIAL_CREDIT_APPROVALS } from '../../data/mockSalesDirectorData';
import { PENDING_REPLENISHMENT_APPROVALS, INTER_DEPOT_TRANSFERS } from '../../data/mockSupplyChainData';
import { PLANT_PRODUCTION_BATCHES } from '../../data/mockWarehouseData';
import { MOCK_ALERTS } from '../../data/mockAlerts';
import { STORAGE_KEYS } from '../../services/grdDataService';

export default function Sidebar({ isCollapsed, onToggle, onItemClick }) {
  const location = useLocation();
  const { currentRole, currentUser } = useAuth();

  const [distributorOrders] = usePersistentState(STORAGE_KEYS.DISTRIBUTOR_ORDERS, DISTRIBUTOR_ORDERS);
  const [creditApprovals] = usePersistentState(STORAGE_KEYS.CREDIT_APPROVALS, COMMERCIAL_CREDIT_APPROVALS);
  const [scmApprovals] = usePersistentState(STORAGE_KEYS.SCM_APPROVALS, PENDING_REPLENISHMENT_APPROVALS);
  const [transfers] = usePersistentState(STORAGE_KEYS.TRANSFERS, INTER_DEPOT_TRANSFERS);
  const [batches] = usePersistentState(STORAGE_KEYS.PLANT_BATCHES, PLANT_PRODUCTION_BATCHES);
  const [alerts] = usePersistentState(STORAGE_KEYS.ALERTS, MOCK_ALERTS);

  const pendingCreditCount = creditApprovals.filter(c => c.status === 'Pending Approval').length;
  const pendingScmCount = scmApprovals.filter(a => a.status === 'Pending Approval').length;
  const activeTransfersCount = transfers.filter(t => t.status === 'In Transit').length;
  const unreadAlertsCount = alerts.filter(a => a.status !== 'Resolved').length;

  // Navigation for Distributor Partner role
  const distributorNavSections = [
    {
      group: 'Orders & Live Stock',
      items: [
        { path: '/dashboard', label: 'Distributor Desk', icon: LayoutDashboard },
        { 
          path: '/distributor/new-order', 
          label: 'New Stock Order', 
          icon: ShoppingCart, 
          badge: 'Quick', 
          badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
        },
        { 
          path: '/distributor/orders', 
          label: 'My Orders & Bills', 
          icon: Boxes, 
          badge: `${distributorOrders.length} Orders`, 
          badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200' 
        },
        { path: '/distributor/depot-stock', label: 'Guwahati Stock', icon: Pill },
      ]
    },
    {
      group: 'Retail Network & Ledger',
      items: [
        { 
          path: '/distributor/stockists', 
          label: 'My Sub-Stockists', 
          icon: Store, 
          badge: '24 Stores', 
          badgeColor: 'bg-terracotta-50 text-terracotta-700 border border-terracotta-200' 
        },
        { path: '/customers', label: 'Hospital Indents', icon: Hospital },
        { path: '/distributor/ledger', label: 'Account Ledger', icon: BarChart3 },
      ]
    },
    {
      group: 'Supply & Transport',
      items: [
        { path: '/logistics-monitoring', label: 'Transit Routes', icon: Truck, badge: 'GPS', badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200' },
        { path: '/stockout-risk', label: 'Stockout Risk', icon: ShieldAlert, badge: 'Buffer', badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200' },
        { path: '/skus', label: 'Medicine Catalog', icon: Pill },
      ]
    },
    {
      group: 'Support & Alerts',
      items: [
        { path: '/reports', label: 'Dispatches & Billing', icon: FileText },
        { 
          path: '/alerts', 
          label: 'Supply Alerts', 
          icon: Bell, 
          badge: unreadAlertsCount > 0 ? `${unreadAlertsCount}` : null, 
          badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200' 
        },
        { path: '/settings', label: 'Account Settings', icon: Settings },
      ]
    }
  ];

  // Navigation for Sales Director role
  const salesDirectorNavSections = [
    {
      group: 'Commercial Leadership',
      items: [
        { path: '/dashboard', label: 'Sales Dashboard', icon: LayoutDashboard },
        { 
          path: '/sales-director/territories', 
          label: 'Sales Territories', 
          icon: Building2, 
          badge: '8 Zones', 
          badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200' 
        },
        { 
          path: '/sales-director/credit-approvals', 
          label: 'Credit Approvals', 
          icon: CreditCard, 
          badge: pendingCreditCount > 0 ? `${pendingCreditCount} Pending` : 'All Clear', 
          badgeColor: pendingCreditCount > 0 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
        },
        { path: '/orders', label: 'Purchase Orders', icon: ShoppingCart },
      ]
    },
    {
      group: 'Field Team & Retail Reach',
      items: [
        { 
          path: '/sales-director/field-force', 
          label: 'Medical Reps (MR)', 
          icon: Users, 
          badge: '48 Reps', 
          badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
        },
        { path: '/distributors', label: 'C&F Distributors', icon: Building2 },
        { path: '/stockists', label: 'Chemist Retailers', icon: Store, badge: '24 Stores', badgeColor: 'bg-terracotta-50 text-terracotta-700 border border-terracotta-200' },
        { path: '/customers', label: 'Hospital Tenders', icon: Hospital },
        { path: '/sales', label: 'Revenue Ledger', icon: BarChart3 },
      ]
    },
    {
      group: 'Demand & Formulations',
      items: [
        { path: '/sales-director/products', label: 'Top Formulations', icon: Pill },
        { path: '/demand-forecasting', label: 'Demand Forecast', icon: TrendingUp },
        { path: '/skus', label: 'Product Catalog', icon: Boxes },
        { path: '/inventory', label: 'Depot Availability', icon: Archive },
      ]
    },
    {
      group: 'Reports & Notifications',
      items: [
        { path: '/reports', label: 'Commercial Reports', icon: FileText },
        { path: '/pilot-kpis', label: 'Assam Pilot KPIs', icon: Target, badge: 'Live', badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
        { 
          path: '/alerts', 
          label: 'Sales Alerts', 
          icon: Bell, 
          badge: unreadAlertsCount > 0 ? `${unreadAlertsCount}` : null, 
          badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200' 
        },
        { path: '/settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  // Navigation for Supply Chain Manager role (Dr. Abhijit Sarma - Guwahati Central Depot)
  const supplyChainNavSections = [
    {
      group: 'Guwahati Mother Hub',
      items: [
        { path: '/dashboard', label: 'Operations Desk', icon: LayoutDashboard },
        { 
          path: '/supply-chain/approvals', 
          label: 'Order Approvals', 
          icon: Sparkles, 
          badge: pendingScmCount > 0 ? `${pendingScmCount} Pending` : 'Clear', 
          badgeColor: pendingScmCount > 0 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
        },
        { 
          path: '/supply-chain/inward', 
          label: 'Factory Inward', 
          icon: Factory, 
          badge: `${batches.length} Batches`, 
          badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
        },
        { 
          path: '/supply-chain/cold-chain', 
          label: 'Cold Chain GPS', 
          icon: ThermometerSnowflake, 
          badge: 'Live', 
          badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200' 
        },
        { 
          path: '/supply-chain/transfers', 
          label: 'Stock Transfers', 
          icon: ArrowLeftRight, 
          badge: activeTransfersCount > 0 ? `${activeTransfersCount} Active` : '0 Active', 
          badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
        },
      ]
    },
    {
      group: 'Regional Buffer & Logistics',
      items: [
        { path: '/inventory', label: 'Depot Stock', icon: Boxes },
        { 
          path: '/stockout-risk', 
          label: 'Stockout Risk', 
          icon: ShieldAlert, 
          badge: '5 Depots', 
          badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200' 
        },
        { path: '/excess-inventory', label: 'Surplus Stock', icon: Archive },
        { path: '/logistics-monitoring', label: 'Transit Routes', icon: Truck },
        { 
          path: '/alerts', 
          label: 'Supply Alerts', 
          icon: Bell, 
          badge: unreadAlertsCount > 0 ? `${unreadAlertsCount}` : null, 
          badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200' 
        },
      ]
    },
    {
      group: 'Planning & Replenishment',
      items: [
        { path: '/demand-forecasting', label: 'Demand Forecast', icon: TrendingUp },
        { 
          path: '/smart-replenishment', 
          label: 'Replenishment', 
          icon: Sparkles, 
          badge: '6 Orders', 
          badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
        },
        { 
          path: '/expiry-management', 
          label: 'Expiry Watch', 
          icon: Clock, 
          badge: 'cGMP', 
          badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200' 
        },
        { path: '/skus', label: 'Medicine SKUs', icon: Pill },
        { path: '/orders', label: 'Purchase Orders', icon: ShoppingCart },
      ]
    },
    {
      group: 'Partners & Audit',
      items: [
        { path: '/distributors', label: 'Certified Distributors', icon: Building2 },
        { path: '/customers', label: 'Hospital Tenders', icon: Hospital },
        { path: '/reports', label: 'Operations Reports', icon: BarChart3 },
        { path: '/data-import', label: 'ERP Data Sync', icon: FileUp },
        { path: '/settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  // Navigation for Warehouse Controller role (Pranabesh Bora - Rani cGMP Plant)
  const warehouseNavSections = [
    {
      group: 'Rani Plant Operations',
      items: [
        { path: '/dashboard', label: 'Warehouse Desk', icon: LayoutDashboard },
        { 
          path: '/warehouse/batches', 
          label: 'Batch Register', 
          icon: QrCode, 
          badge: `${batches.length} Batches`, 
          badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
        },
        { 
          path: '/warehouse/dispatch', 
          label: 'Gate Pass & Docks', 
          icon: Truck, 
          badge: '3 Docks', 
          badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200' 
        },
        { 
          path: '/warehouse/storage', 
          label: 'Cold Bay & Aisles', 
          icon: Building2 
        },
        { 
          path: '/warehouse/audit', 
          label: 'Stock Audit', 
          icon: ShieldCheck, 
          badge: '99.8%', 
          badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
        },
      ]
    },
    {
      group: 'Factory Inward & Logistics',
      items: [
        { path: '/supply-chain/inward', label: 'Factory Inward', icon: Factory, badge: 'QC Pass', badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
        { path: '/supply-chain/transfers', label: 'Inter-Depot Transfers', icon: ArrowLeftRight, badge: `${activeTransfersCount} Active`, badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200' },
        { path: '/logistics-monitoring', label: 'Transit Fleet GPS', icon: Truck },
        { path: '/orders', label: 'Dispatch Orders', icon: ShoppingCart },
      ]
    },
    {
      group: 'Inventory & cGMP Quality',
      items: [
        { path: '/inventory', label: 'Plant Stock', icon: Boxes },
        { path: '/skus', label: 'Medicine SKUs', icon: Pill },
        { 
          path: '/expiry-management', 
          label: 'Expiry Watch', 
          icon: Clock, 
          badge: 'cGMP', 
          badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200' 
        },
        { path: '/excess-inventory', label: 'Surplus Stock', icon: Archive },
      ]
    },
    {
      group: 'Compliance & System',
      items: [
        { path: '/reports', label: 'Batch QA Reports', icon: FileText },
        { 
          path: '/alerts', 
          label: 'Plant Alerts', 
          icon: Bell, 
          badge: unreadAlertsCount > 0 ? `${unreadAlertsCount}` : null, 
          badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200' 
        },
        { path: '/data-import', label: 'Barcode Scanner Import', icon: FileUp },
        { path: '/settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  // Navigation for Management / Executive role (Gautam R. Dhanuka - Corporate HQ)
  const managementNavSections = [
    {
      group: 'Executive Leadership',
      items: [
        { path: '/dashboard', label: 'Boardroom Desk', icon: LayoutDashboard },
        { 
          path: '/management/availability', 
          label: 'Medicine Availability', 
          icon: Award, 
          badge: '98.2%', 
          badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
        },
        { 
          path: '/management/financials', 
          label: 'Cost Savings & ROI', 
          icon: DollarSign, 
          badge: '₹48.5L', 
          badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
        },
        { 
          path: '/management/governance', 
          label: 'Pilot Governance', 
          icon: Building2, 
          badge: 'Phase 3', 
          badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200' 
        },
        { 
          path: '/management/strategy', 
          label: 'Expansion Vision', 
          icon: TrendingUp 
        },
      ]
    },
    {
      group: 'Pilot KPIs & Forecasting',
      items: [
        { path: '/pilot-kpis', label: 'Assam Pilot KPIs', icon: Target, badge: 'Live', badgeColor: 'bg-terracotta-50 text-terracotta-700 border border-terracotta-200' },
        { path: '/demand-forecasting', label: 'Demand Forecast', icon: TrendingUp },
        { path: '/inventory', label: 'Regional Depots Stock', icon: Boxes },
        { path: '/stockout-risk', label: 'Stockout Risk', icon: ShieldAlert, badge: 'Monitored', badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200' },
        { path: '/logistics-monitoring', label: 'Highway Corridors', icon: Truck },
      ]
    },
    {
      group: 'Commercial & Trade',
      items: [
        { path: '/sales', label: 'Sales Revenue', icon: BarChart3 },
        { path: '/orders', label: 'Purchase Orders', icon: ShoppingCart },
        { path: '/distributors', label: 'C&F Distributors', icon: Building2 },
        { path: '/customers', label: 'Hospital Tenders', icon: Hospital },
      ]
    },
    {
      group: 'Governance & Audits',
      items: [
        { path: '/reports', label: 'Executive Reports', icon: FileText },
        { path: '/users', label: 'Executive Team', icon: Users },
        { 
          path: '/alerts', 
          label: 'Board Alerts', 
          icon: Bell, 
          badge: unreadAlertsCount > 0 ? `${unreadAlertsCount}` : null, 
          badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200' 
        },
        { path: '/settings', label: 'System Governance', icon: Settings },
      ]
    }
  ];

  // Standard Operations / Super Admin navigation groups
  const adminNavSections = [
    {
      group: 'Main',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { 
          path: '/pilot-kpis', 
          label: 'Assam Pilot', 
          icon: Target, 
          badge: 'Live', 
          badgeColor: 'bg-terracotta-50 text-terracotta-700 border border-terracotta-200' 
        },
      ]
    },
    {
      group: 'Demand & Forecast',
      items: [
        { path: '/demand-forecasting', label: 'Demand Forecast', icon: TrendingUp },
        { 
          path: '/smart-replenishment', 
          label: 'Replenishment', 
          icon: Sparkles, 
          badge: '6 Orders', 
          badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
        },
        { 
          path: '/stockout-risk', 
          label: 'Stockout Risk', 
          icon: ShieldAlert, 
          badge: '6 Depots', 
          badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200' 
        },
        { path: '/excess-inventory', label: 'Excess Stock', icon: Archive },
        { 
          path: '/expiry-management', 
          label: 'Expiry Tracking', 
          icon: Clock, 
          badge: '4 Near', 
          badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200' 
        },
        { path: '/logistics-monitoring', label: 'Transit & Routes', icon: Truck },
      ]
    },
    {
      group: 'Inventory & Orders',
      items: [
        { path: '/skus', label: 'Medicines (SKUs)', icon: Pill },
        { path: '/inventory', label: 'Inventory Stock', icon: Boxes },
        { path: '/orders', label: 'Purchase Orders', icon: ShoppingCart },
        { path: '/sales', label: 'Sales Ledger', icon: BarChart3 },
      ]
    },
    {
      group: 'Supply Partners',
      items: [
        { path: '/distributors', label: 'Distributors', icon: Building2 },
        { path: '/stockists', label: 'Stockists', icon: Store },
        { path: '/customers', label: 'Hospitals & Stores', icon: Hospital },
      ]
    },
    {
      group: 'Reports & Tools',
      items: [
        { path: '/reports', label: 'Reports', icon: BarChart3 },
        { 
          path: '/alerts', 
          label: 'Alerts', 
          icon: Bell, 
          badge: unreadAlertsCount > 0 ? `${unreadAlertsCount}` : null, 
          badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200' 
        },
        { path: '/data-import', label: 'Data Import', icon: FileUp },
        { path: '/users', label: 'Team Members', icon: Users },
        { path: '/settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-white text-slate-700 transition-all duration-300 border-r border-slate-200 shadow-sm ${
      isCollapsed ? 'w-20' : 'w-72'
    }`}>
      {/* Brand Header */}
      <div className={`h-16 flex items-center border-b border-slate-100 bg-white relative ${
        isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'
      }`}>
        {isCollapsed ? (
          <div className="flex items-center justify-center w-full">
            <button
              type="button"
              onClick={onToggle}
              className="w-10 h-10 rounded-xl bg-slate-50 p-1 flex items-center justify-center border border-slate-200/90 shadow-sm hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
              title="Click to Expand Sidebar"
            >
              <img 
                src="/logo.webp" 
                alt="GRD Pharmaceuticals" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                onError={(e) => {
                  if (!e.currentTarget.src.includes('logo.png')) {
                    e.currentTarget.src = '/logo.png';
                  }
                }}
              />
            </button>
            <button
              type="button"
              onClick={onToggle}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-500 hover:text-navy-900 hover:bg-slate-50 transition-all z-40 cursor-pointer"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-slate-50 p-1 flex items-center justify-center shrink-0 border border-slate-200/90 shadow-sm">
                <img 
                  src="/logo.webp" 
                  alt="GRD Pharmaceuticals" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    if (!e.currentTarget.src.includes('logo.png')) {
                      e.currentTarget.src = '/logo.png';
                    }
                  }}
                />
              </div>
              <div className="leading-tight overflow-hidden">
                <div className="flex items-baseline gap-1">
                  <span className="font-sans font-black text-base text-navy-950 tracking-tight">GRD</span>
                  <span className="font-sans font-bold text-sm text-slate-800 tracking-tight whitespace-nowrap">Pharmaceuticals</span>
                </div>
                <p className="text-[10px] text-terracotta-600 font-semibold tracking-wide uppercase font-sans">
                  {currentRole === 'distributor' ? 'Distributor Partner' : currentRole === 'sales-manager' ? 'Commercial Sales Desk' : currentRole === 'supply-chain-manager' ? 'Guwahati Central Depot' : currentRole === 'warehouse-staff' ? 'Rani cGMP Plant WH' : currentRole === 'management' ? 'Guwahati Corporate HQ' : 'A Unit of Dhanuka Group'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggle}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Navigation List with Smooth Dedicated Scrollbar */}
      <div className={`flex-1 overflow-y-auto sidebar-scroll pt-2 pb-6 ${isCollapsed ? 'px-2 space-y-2' : 'px-3 space-y-4'}`}>
        {(currentRole === 'distributor' ? distributorNavSections : currentRole === 'sales-manager' ? salesDirectorNavSections : currentRole === 'supply-chain-manager' ? supplyChainNavSections : currentRole === 'warehouse-staff' ? warehouseNavSections : currentRole === 'management' ? managementNavSections : adminNavSections).map((section, sIdx) => (
          <div key={sIdx} className={isCollapsed ? 'space-y-1' : 'space-y-0.5'}>
            {!isCollapsed ? (
              <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 font-sans">
                {section.group}
              </p>
            ) : sIdx > 0 ? (
              <div className="w-8 mx-auto my-1.5 border-t border-slate-200/80" />
            ) : null}

            {section.items.map((item, iIdx) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && item.path !== '/dashboard' && location.pathname.startsWith(item.path + '/'));

              if (isCollapsed) {
                return (
                  <NavLink
                    key={iIdx}
                    to={item.path}
                    title={item.label}
                    onClick={() => { if (onItemClick) onItemClick(); }}
                    className={`w-11 h-11 mx-auto flex items-center justify-center rounded-xl transition-all group relative ${
                      isActive
                        ? 'bg-navy-900 text-white font-semibold shadow-md ring-1 ring-navy-950/20'
                        : 'text-slate-500 hover:text-navy-900 hover:bg-slate-100/90'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive 
                        ? 'text-terracotta-400' 
                        : 'text-slate-400 group-hover:text-navy-900'
                    }`} />

                    {item.badge && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                    )}
                  </NavLink>
                );
              }

              return (
                <NavLink
                  key={iIdx}
                  to={item.path}
                  onClick={() => { if (onItemClick) onItemClick(); }}
                  className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-medium transition-all group relative ${
                    isActive
                      ? 'bg-navy-900 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive 
                      ? 'text-terracotta-400' 
                      : 'text-slate-400 group-hover:text-navy-900'
                  }`} />
                  
                  <span className="whitespace-nowrap font-medium flex-1 tracking-tight">{item.label}</span>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ml-auto transition-all ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : item.badgeColor || 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Persistent Bottom Operational Card - Covers & anchors sidebar base across all roles */}
      <div className={`mt-auto border-t border-slate-200/90 bg-slate-50/90 p-2.5 shrink-0 relative z-10 ${isCollapsed ? 'px-1 py-2 text-center' : ''}`}>
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-1.5" title={`${currentUser.name} (${currentUser.roleName} - ${currentUser.location})`}>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
            <div className="w-7 h-7 rounded-full bg-navy-900 text-white font-bold text-3xs flex items-center justify-center ring-1 ring-navy-800/40">
              {currentUser.avatar}
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] px-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-2xs font-semibold text-slate-600">8 NE States Active</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-terracotta-700 bg-terracotta-50 px-1.5 py-0.2 rounded border border-terracotta-200/70">
                NESFIC Pilot
              </span>
            </div>

            <div className="p-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-navy-900 text-white font-bold text-2xs flex items-center justify-center shrink-0 ring-1 ring-navy-800/40">
                  {currentUser.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-navy-950 truncate leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-terracotta-700 font-semibold truncate leading-tight">{currentUser.roleName}</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Connected" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
