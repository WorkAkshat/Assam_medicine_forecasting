import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  ChevronDown,
  Check,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { usePersistentState } from '../../hooks/usePersistentState';
import NotificationCenter from './NotificationCenter';
import { MOCK_USERS } from '../../data/mockUsers';
import { MOCK_ALERTS } from '../../data/mockAlerts';
import { STORAGE_KEYS } from '../../services/grdDataService';

const ROLE_THEMES = {
  'super-admin': {
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    avatar: 'bg-purple-900 text-white ring-purple-200',
    dot: 'bg-purple-500',
    roleColor: 'text-purple-700'
  },
  'management': {
    badge: 'bg-navy-50 text-navy-800 border-navy-200',
    avatar: 'bg-navy-900 text-white ring-navy-200',
    dot: 'bg-navy-600',
    roleColor: 'text-navy-800'
  },
  'sales-manager': {
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    avatar: 'bg-amber-800 text-white ring-amber-200',
    dot: 'bg-amber-500',
    roleColor: 'text-amber-800'
  },
  'supply-chain-manager': {
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
    avatar: 'bg-blue-900 text-white ring-blue-200',
    dot: 'bg-blue-500',
    roleColor: 'text-blue-700'
  },
  'warehouse-staff': {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    avatar: 'bg-emerald-800 text-white ring-emerald-200',
    dot: 'bg-emerald-500',
    roleColor: 'text-emerald-700'
  },
  'distributor': {
    badge: 'bg-teal-50 text-teal-800 border-teal-200',
    avatar: 'bg-teal-900 text-white ring-teal-200',
    dot: 'bg-teal-500',
    roleColor: 'text-teal-700'
  }
};

export default function Topbar({ onMobileToggle, onNotificationToggle, onRoleModalToggle }) {
  const { currentUser, currentRole, switchRole, roles } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [alerts] = usePersistentState(STORAGE_KEYS.ALERTS, MOCK_ALERTS);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const unreadAlertsCount = alerts.filter(a => a.status !== 'Resolved').length;

  const handleSwitchRole = (targetUser) => {
    switchRole(targetUser.roleId);
    setIsProfileMenuOpen(false);
    toast.success(`Switched perspective to ${targetUser.name} (${targetUser.roleName})`);
    navigate('/dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isNotificationOpen || isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen, isProfileMenuOpen]);

  // Simple, clean breadcrumb title generator
  const getBreadcrumb = () => {
    const path = location.pathname.replace(/^\//, '');
    const titles = {
      '': 'Dashboard',
      'dashboard': 'Dashboard',
      'pilot-kpis': 'Assam Pilot (NESFIC-I-09)',
      'demand-forecasting': 'Demand Forecast',
      'smart-replenishment': 'Replenishment',
      'stockout-risk': 'Stockout Risk',
      'excess-inventory': 'Excess Stock',
      'expiry-management': 'Expiry Tracking',
      'logistics-monitoring': 'Transit & Logistics',
      'skus': 'Medicines (SKUs)',
      'inventory': 'Inventory',
      'orders': 'Orders',
      'sales': 'Sales',
      'distributors': 'Distributors',
      'stockists': 'Stockists',
      'customers': 'Hospitals & Stores',
      'reports': 'Reports',
      'alerts': 'Alerts',
      'data-import': 'Data Import',
      'users': 'Users',
      'settings': 'Settings',

      // Distributor Partner Portal
      'distributor/dashboard': 'Distributor Desk',
      'distributor/orders': 'My Orders & Bills',
      'distributor/new-order': 'New Stock Order',
      'distributor/depot-stock': 'Guwahati Stock',
      'distributor/stockists': 'My Sub-Stockists',
      'distributor/ledger': 'Account Ledger',

      // Sales Director Commercial Portal
      'sales-director/dashboard': 'Sales Dashboard',
      'sales-director/territories': 'Sales Territories',
      'sales-director/credit-approvals': 'Credit Approvals',
      'sales-director/field-force': 'Medical Reps (MR)',
      'sales-director/products': 'Medicine Sales',

      // Supply Chain Manager Portal
      'supply-chain/dashboard': 'Operations Desk',
      'supply-chain/approvals': 'Order Approvals',
      'supply-chain/inward': 'Factory Inward',
      'supply-chain/cold-chain': 'Cold Chain GPS',
      'supply-chain/transfers': 'Stock Transfers',

      // Warehouse Controller Portal
      'warehouse/dashboard': 'Warehouse Desk',
      'warehouse/batches': 'Batch Register',
      'warehouse/dispatch': 'Gate Pass & Docks',
      'warehouse/storage': 'Cold Bay & Aisles',
      'warehouse/audit': 'Stock Audit',

      // Management / Executive Portal
      'management/dashboard': 'Boardroom Desk',
      'management/availability': 'Medicine Availability',
      'management/financials': 'Cost Savings & ROI',
      'management/governance': 'Pilot Governance',
      'management/strategy': 'Expansion Vision'
    };
    return titles[path] || path.split('/').pop().split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onMobileToggle}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="sm:hidden font-sans font-bold text-xs sm:text-sm text-navy-950 truncate max-w-[140px]">
          {getBreadcrumb()}
        </div>

        <div className="hidden sm:flex flex-col min-w-0">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 font-sans">
            GRD Pharmaceuticals
          </span>
          <h2 className="font-sans font-bold text-base sm:text-lg text-navy-950 leading-tight truncate">
            {getBreadcrumb()}
          </h2>
        </div>
      </div>

      {/* Right: Notifications, Role Switcher, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Notification Bell & Compact Dropdown Bar */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => {
              setIsNotificationOpen(prev => !prev);
              if (onNotificationToggle) onNotificationToggle();
            }}
            className={`relative p-2 rounded-xl transition-all cursor-pointer ${
              isNotificationOpen 
                ? 'bg-slate-100 text-navy-950 ring-2 ring-slate-200' 
                : 'text-slate-500 hover:text-navy-900 hover:bg-slate-100'
            }`}
            title="Open Alerts & Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          <NotificationCenter
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>

        {/* User Profile Card with Embedded Role Switcher Dropdown */}
        <div className="relative pl-1.5 sm:pl-2 border-l border-slate-200" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(prev => !prev)}
            className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl transition-all cursor-pointer ${
              isProfileMenuOpen 
                ? 'bg-slate-100 ring-2 ring-navy-900/10' 
                : 'hover:bg-slate-100/80'
            }`}
            title={`Active Role: ${currentUser.name} (${currentUser.roleName} - ${currentUser.location}). Click to switch role.`}
          >
            <div className="w-8 h-8 rounded-full bg-navy-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-navy-100 shrink-0">
              {currentUser.avatar || 'US'}
            </div>
            <div className="hidden sm:block text-left text-xs leading-tight">
              <div className="flex items-center gap-1">
                <p className="font-bold text-navy-950 whitespace-nowrap max-w-[180px] truncate">{currentUser.name}</p>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                  isProfileMenuOpen ? 'rotate-180 text-navy-900' : ''
                }`} />
              </div>
              <p className="text-[10px] text-terracotta-700 font-semibold whitespace-nowrap max-w-[180px] truncate">
                {currentUser.roleName}
              </p>
            </div>
          </button>

          {/* Role Switcher Menu Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-[370px] max-w-[calc(100vw-20px)] bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              
              {/* Current Active User Profile Header */}
              <div className="p-2.5 bg-slate-50/90 rounded-xl border border-slate-200/70 mb-2 flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center ring-2 shrink-0 ${
                    ROLE_THEMES[currentUser.roleId]?.avatar || 'bg-navy-900 text-white ring-navy-100'
                  }`}>
                    {currentUser.avatar || 'US'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-bold text-navy-950 text-xs truncate">{currentUser.name}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${
                        ROLE_THEMES[currentUser.roleId]?.badge || 'bg-terracotta-50 text-terracotta-700 border-terracotta-200/70'
                      }`}>
                        {currentUser.roleName}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{currentUser.location}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 shrink-0 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                </span>
              </div>

              {/* Dropdown Section Header */}
              <div className="px-1.5 py-1 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Switch Role</span>
                <span className="text-[10px] font-medium text-slate-400">6 Profiles Available</span>
              </div>

              {/* Roles List - Concise, Distinct & Clean */}
              <div className="space-y-1 mt-1">
                {MOCK_USERS.map((user) => {
                  const isSelected = currentUser.roleId === user.roleId;
                  const theme = ROLE_THEMES[user.roleId] || {};

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleSwitchRole(user)}
                      className={`w-full px-2.5 py-2 rounded-xl text-left transition-all flex items-center gap-2.5 cursor-pointer group ${
                        isSelected
                          ? 'bg-navy-950 text-white shadow-sm ring-1 ring-navy-900'
                          : 'bg-white hover:bg-slate-50/90 text-slate-700 border border-slate-200/70 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full font-bold text-2xs flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        isSelected 
                          ? 'bg-white/20 text-white ring-2 ring-white/30' 
                          : `${theme.avatar || 'bg-slate-100 text-navy-900'} ring-1 ring-slate-200`
                      }`}>
                        {user.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`font-bold text-xs leading-tight truncate ${isSelected ? 'text-white' : 'text-navy-950'}`}>
                            {user.name}
                          </p>
                          {isSelected ? (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30 shrink-0">
                              <Check className="w-2.5 h-2.5 text-emerald-300" /> Active
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 group-hover:bg-navy-900 group-hover:text-white px-2 py-0.5 rounded-md transition-all shrink-0">
                              Switch →
                            </span>
                          )}
                        </div>
                        <p className={`text-[10px] leading-tight truncate mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          <span className={`font-semibold ${isSelected ? 'text-terracotta-300' : (theme.roleColor || 'text-terracotta-700')}`}>
                            {user.roleName}
                          </span>
                          <span className="mx-1 text-slate-300">•</span>
                          <span>{user.location}</span>
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* View Full Guide Modal Trigger */}
              <div className="mt-2 pt-1.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    if (onRoleModalToggle) onRoleModalToggle();
                  }}
                  className="w-full py-1.5 px-2 text-center text-2xs sm:text-xs text-navy-900 hover:text-terracotta-600 font-semibold cursor-pointer rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-1 group"
                >
                  <span>View Role Permissions &amp; Access Guide</span>
                  <ArrowRight className="w-3 h-3 text-terracotta-500 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}
