import React, { Suspense, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mountain, Bell, PackageCheck, Boxes, Hourglass, TrendingUp, Truck, Pill, Target, Database, SlidersHorizontal, Menu, X, WifiOff, Wifi, RefreshCw,
} from 'lucide-react';
import { useRole, ROLES } from '../../hooks/useRole';
import { useEngine } from '../../hooks/useEngine';
import { LOCATIONS } from '../../engine/catalog';
import { RefreshBar } from '../engine/ui';

export const NAV = {
  overview: { path: '/', label: 'Network overview', icon: Mountain },
  alerts: { path: '/alerts', label: 'Alerts', icon: Bell },
  replenishment: { path: '/replenishment', label: 'Replenishment', icon: PackageCheck },
  inventory: { path: '/inventory', label: 'Inventory', icon: Boxes },
  expiry: { path: '/expiry', label: 'Expiry & surplus', icon: Hourglass },
  demand: { path: '/demand', label: 'Demand forecast', icon: TrendingUp },
  network: { path: '/network', label: 'Depots & routes', icon: Truck },
  medicines: { path: '/medicines', label: 'Medicines', icon: Pill },
  performance: { path: '/performance', label: 'Outcome KPIs', icon: Target },
  data: { path: '/data', label: 'Data sources', icon: Database },
  settings: { path: '/settings', label: 'Planning settings', icon: SlidersHorizontal },
};

function useOnline() {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

function useBadges() {
  const { data } = useEngine();
  const { depot } = useRole();
  if (!data) return {};
  const inScope = (x) => !depot || x.loc === depot;
  return {
    alerts: data.alerts.filter((a) => a.severity === 'high' && inScope(a)).length || null,
    replenishment: data.rows.filter((r) => r.order > 0 && inScope(r)).length || null,
  };
}

function RolePicker({ compact = false }) {
  const { role, setRole, homeDepot, setDepot } = useRole();
  return (
    <div className={`flex ${compact ? 'flex-col gap-2' : 'items-center gap-2'}`}>
      <label className="min-w-0">
        <span className="sr-only">View as</span>
        <select value={role.id} onChange={(e) => setRole(e.target.value)} className="w-full rounded-md border border-white/15 bg-white/[0.06] px-2.5 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-monsoon-400 [&>option]:text-ink-950">
          {ROLES.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </label>
      {role.scoped && (
        <label className="min-w-0">
          <span className="sr-only">Depot</span>
          <select value={homeDepot} onChange={(e) => setDepot(e.target.value)} className="w-full rounded-md border border-white/15 bg-white/[0.06] px-2.5 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-monsoon-400 [&>option]:text-ink-950">
            {LOCATIONS.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}

function NavList({ onNavigate }) {
  const { role } = useRole();
  const badges = useBadges();
  return (
    <nav aria-label="Main" className="space-y-0.5">
      {role.nav.map((id) => {
        const item = NAV[id];
        const Icon = item.icon;
        return (
          <NavLink
            key={id}
            to={item.path}
            end={item.path === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive ? 'bg-white/10 text-white before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-muga-400' : 'text-white/65 hover:bg-white/[0.06] hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-muga-300' : 'text-white/45 group-hover:text-white/80'}`} />
                <span className="flex-1 truncate">{item.label}</span>
                {badges[id] ? <span className="num rounded-full bg-white/10 px-1.5 text-[11px] text-white/80">{badges[id]}</span> : null}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white p-1">
        <img src="/logo.webp" alt="" className="h-full w-full object-contain" onError={(e) => { e.currentTarget.src = '/logo.png'; }} />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-[15px] font-semibold text-white">GRD Supply Planner</span>
        <span className="block text-[11px] text-white/50">Demand & inventory · Northeast</span>
      </span>
    </Link>
  );
}

function StatusLine() {
  const online = useOnline();
  const { status, data, refresh } = useEngine();
  return (
    <div className="flex items-center gap-3 text-[12px]">
      <span className={`inline-flex items-center gap-1.5 ${online ? 'text-white/55' : 'text-muga-300'}`} title={online ? 'Online' : 'Offline: forecasts keep working on this device'}>
        {online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
        {online ? 'Online' : 'Offline'}
      </span>
      <button type="button" onClick={refresh} className="inline-flex items-center gap-1.5 text-white/55 hover:text-white" title="Re-run forecasts">
        <RefreshCw className={`h-3.5 w-3.5 ${status === 'refreshing' || status === 'running' ? 'animate-spin' : ''}`} />
        {data ? `${data.elapsedMs} ms` : '…'}
      </button>
    </div>
  );
}

const MOBILE_TABS = 4;

export default function AppShell() {
  const location = useLocation();
  const { role } = useRole();
  const badges = useBadges();
  const [drawer, setDrawer] = useState(false);
  useEffect(() => {
    setDrawer(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-mist-100">
      <RefreshBar />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-md focus:bg-white focus:px-3 focus:py-2">Skip to content</a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-ink-950 lg:flex">
        <div className="px-4 pb-4 pt-5"><Brand /></div>
        <div className="px-4 pb-3"><RolePicker /></div>
        <div className="sidebar-scroll dark-scroll flex-1 overflow-y-auto px-2.5 pb-4"><NavList /></div>
        <div className="border-t border-white/10 px-4 py-3"><StatusLine /></div>
      </aside>

      {/* Mobile / tablet top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 bg-ink-950 px-3 sm:px-5 lg:hidden">
        <button type="button" onClick={() => setDrawer(true)} className="rounded-md p-2 text-white/80 hover:bg-white/10" aria-label="Open menu" aria-expanded={drawer}>
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1"><Brand /></div>
        <Link to="/alerts" className="relative rounded-md p-2 text-white/80 hover:bg-white/10" aria-label="Alerts">
          <Bell className="h-5 w-5" />
          {badges.alerts ? <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#ef6a53]" /> : null}
        </Link>
      </header>

      <AnimatePresence>
        {drawer && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
            <motion.button type="button" aria-label="Close menu" className="absolute inset-0 bg-ink-950/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.aside
              className="absolute inset-y-0 left-0 flex w-[min(20rem,86vw)] flex-col bg-ink-950"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between px-4 pb-3 pt-4">
                <Brand />
                <button type="button" onClick={() => setDrawer(false)} className="rounded-md p-2 text-white/70 hover:bg-white/10" aria-label="Close menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-4 pb-3"><RolePicker compact /></div>
              <div className="flex-1 overflow-y-auto px-2.5 pb-4"><NavList onNavigate={() => setDrawer(false)} /></div>
              <div className="border-t border-white/10 px-4 py-3"><StatusLine /></div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <main id="main" className="mx-auto w-full max-w-[1600px] px-3.5 pb-24 pt-4 sm:px-6 sm:pt-6 md:pb-10 lg:px-8 lg:pt-8">
          <Suspense
            fallback={
              <div className="space-y-4" aria-busy="true">
                <div className="h-8 w-64 max-w-full animate-pulse rounded-md bg-mist-200" />
                <div className="h-48 animate-pulse rounded-lg border border-mist-300/70 bg-white" />
              </div>
            }
          >
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}>
              <Outlet />
            </motion.div>
          </Suspense>
        </main>
      </div>

      {/* Mobile bottom tabs: the four most-used screens for this role */}
      <nav aria-label="Quick" className="fixed inset-x-0 bottom-0 z-40 grid border-t border-mist-300 bg-white/95 backdrop-blur md:hidden" style={{ gridTemplateColumns: `repeat(${MOBILE_TABS}, minmax(0, 1fr))`, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {role.nav.slice(0, MOBILE_TABS).map((id) => {
          const item = NAV[id];
          const Icon = item.icon;
          return (
            <NavLink key={id} to={item.path} end={item.path === '/'} className={({ isActive }) => `relative flex flex-col items-center gap-0.5 py-2 text-[11px] ${isActive ? 'text-monsoon-700' : 'text-slate-500'}`}>
              <Icon className="h-5 w-5" />
              <span className="max-w-full truncate px-1">{item.label.split(' ')[0]}</span>
              {badges[id] ? <span className="absolute right-[28%] top-1.5 h-2 w-2 rounded-full bg-[#ef6a53]" /> : null}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
