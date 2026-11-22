import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { animate, useReducedMotion } from 'framer-motion';
import { SKUS, LOCATIONS, VED_LABEL } from '../../engine/catalog';
import { useEngine } from '../../hooks/useEngine';

export const SKU_BY_ID = Object.fromEntries(SKUS.map((s) => [s.id, s]));
export const LOC_BY_ID = Object.fromEntries(LOCATIONS.map((l) => [l.id, l]));
export { VED_LABEL };

export const inr = (v) => {
  if (v == null || Number.isNaN(v)) return '₹0';
  const a = Math.abs(v);
  if (a >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`;
  if (a >= 1e5) return `₹${(v / 1e5).toFixed(1)} L`;
  if (a >= 1e3) return `₹${(v / 1e3).toFixed(1)}k`;
  return `₹${Math.round(v)}`;
};
export const units = (v) => new Intl.NumberFormat('en-IN').format(Math.round(v || 0));
export const pct = (v, d = 1) => `${(v * 100).toFixed(d)}%`;
export const weekLabel = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

export const STATUS_META = {
  critical: { label: 'Stock-out risk', dot: 'bg-[#e4573f]', text: 'text-[#b63c27]', soft: 'bg-[#fdece8] text-[#9b321f]' },
  watch: { label: 'Watch', dot: 'bg-muga-400', text: 'text-muga-700', soft: 'bg-muga-50 text-muga-800' },
  excess: { label: 'Excess / expiry', dot: 'bg-[#6f86e8]', text: 'text-[#3f55b8]', soft: 'bg-[#eef1fd] text-[#34479a]' },
  healthy: { label: 'Healthy', dot: 'bg-monsoon-500', text: 'text-monsoon-700', soft: 'bg-monsoon-50 text-monsoon-800' },
};

export function StatusPill({ status }) {
  const m = STATUS_META[status] || STATUS_META.healthy;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${m.soft}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

/** Number that eases to its new value when the engine re-runs. */
export function AnimatedNumber({ value, format = (v) => v.toFixed(0), className = '' }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    if (reduce) {
      setShown(value);
      prev.current = value;
      return undefined;
    }
    const ctl = animate(prev.current, value, { duration: 0.7, ease: [0.16, 1, 0.3, 1], onUpdate: setShown });
    prev.current = value;
    return () => ctl.stop();
  }, [value, reduce]);
  return <span className={className}>{format(shown)}</span>;
}

/** Baseline → AI bar with the target marker. `better` is 'lower' or 'higher'. */
export function TargetMeter({ baseline, ai, targetValue, better = 'lower', max }) {
  const top = max ?? (Math.max(baseline, ai, targetValue) * 1.15 || 1);
  const w = (v) => `${Math.max(0, Math.min(100, (v / top) * 100))}%`;
  return (
    <div className="space-y-1.5" aria-hidden>
      <div className="relative h-2 rounded-full bg-mist-200">
        <div className="absolute inset-y-0 left-0 rounded-full bg-ink-300 transition-[width] duration-700" style={{ width: w(baseline) }} />
      </div>
      <div className="relative h-2 rounded-full bg-mist-200">
        <div className="absolute inset-y-0 left-0 rounded-full bg-monsoon-500 transition-[width] duration-700" style={{ width: w(ai) }} />
        <div className="absolute -top-1 h-4 w-0.5 bg-muga-500" style={{ left: w(targetValue) }} title={better === 'lower' ? 'Target ceiling' : 'Target floor'} />
      </div>
    </div>
  );
}

export function EngineGate({ children, label = 'Running the forecast engine' }) {
  const { status, data, error, run, scenario } = useEngine();
  if (status === 'error' && !data) {
    return (
      <div className="panel p-6 text-sm">
        <p className="font-medium text-ink-900">The engine stopped before finishing.</p>
        <p className="mt-1 text-slate-600">{String(error?.message || error).split('\n')[0]}</p>
        <button type="button" onClick={() => run(scenario)} className="mt-4 rounded-md bg-monsoon-600 px-3 py-1.5 text-white">
          Run again
        </button>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="panel relative overflow-hidden p-8">
        <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden">
          <div className="h-full w-1/3 animate-sweep bg-monsoon-500" />
        </div>
        <p className="font-display text-lg text-ink-900">{label}…</p>
        <p className="mt-1 text-sm text-slate-500">Generating 3 years of weekly demand for 260 medicine × depot series, back-testing 5 models and simulating the pilot.</p>
      </div>
    );
  }
  return children;
}

export function RefreshBar() {
  const { status } = useEngine();
  if (status !== 'refreshing' && status !== 'running') return null;
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden" role="progressbar" aria-label="Engine running">
      <div className="h-full w-1/3 animate-sweep bg-muga-400" />
    </div>
  );
}

export function PageHeader({ title, sub, children }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <h1 className="font-display text-2xl font-semibold text-ink-950 sm:text-[28px]">{title}</h1>
        {sub && <p className="mt-1 text-sm leading-relaxed text-slate-600">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function downloadCsv(filename, rows) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  const esc = (v) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Compact, engine-driven pilot summary for the role dashboards. */
export function EnginePilotBanner() {
  const { data } = useEngine();
  const k = data?.kpis;
  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl bg-ink-950 p-5 text-white md:flex-row md:items-center">
      <div className="space-y-1">
        <p className="text-[12px] text-muga-300">NESFIC-I-09 · simulated pilot on synthetic Northeast data</p>
        <h3 className="font-display text-lg">
          {k
            ? `Forecast error down ${(k.accuracy.gain * 100).toFixed(1)}%, stock-out weeks down ${Math.round(k.stockout.gain * 100)}%, expiry loss down ${Math.round(k.expiry.gain * 100)}%`
            : 'Running the pilot simulation…'}
        </h3>
        {k && (
          <p className="text-sm text-white/60">
            Fill rate {pct(k.service.baseline)} → {pct(k.service.ai)} · excess stock share {pct(k.excess.baseline)} → {pct(k.excess.ai)}
          </p>
        )}
      </div>
      <Link to="/pilot-kpis" className="shrink-0 rounded-md bg-muga-400 px-4 py-2 text-sm font-medium text-ink-950 hover:bg-muga-300">
        Open pilot impact
      </Link>
    </div>
  );
}
