import React from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useEngine } from '../hooks/useEngine';
import { EngineGate, PageHeader, AnimatedNumber, TargetMeter, inr, pct, weekLabel, SampleDataNote } from '../components/engine/ui';

// The five outcomes the problem statement sets, each measured against the current way of ordering.
const KPIS = [
  {
    id: 'accuracy',
    title: 'Demand forecast accuracy',
    target: 'at least 20% better',
    value: (k) => k.ai,
    fmt: (v) => pct(v, 1),
    gainText: (k) => `${(k.gain * 100).toFixed(1)}% less forecast error`,
    note: (k) => `Measured on the 4-week quantity each order is sized on. Week by week: ${pct(k.weekly.baseline, 0)} → ${pct(k.weekly.ai, 0)}.`,
    meter: (k) => ({ baseline: 1 - k.baseline, ai: 1 - k.ai, targetValue: (1 - k.baseline) * 0.8 }),
    meterLabel: 'error',
  },
  {
    id: 'stockout',
    title: 'Stock-out incidence',
    target: 'at least 20% lower',
    value: (k) => k.ai,
    fmt: (v) => pct(v, 1),
    gainText: (k) => `${(k.gain * 100).toFixed(0)}% fewer stock-out weeks`,
    note: () => 'Share of medicine × depot weeks where some demand went unserved.',
    meter: (k) => ({ baseline: k.baseline, ai: k.ai, targetValue: k.baseline * 0.8 }),
  },
  {
    id: 'excess',
    title: 'Excess and slow-moving stock',
    target: 'at least 15% lower',
    value: (k) => k.ai,
    fmt: (v) => pct(v, 1),
    gainText: (k) => `${(k.gain * 100).toFixed(0)}% less excess`,
    note: () => 'Share of stock value held beyond 10 weeks of actual demand.',
    meter: (k) => ({ baseline: k.baseline, ai: k.ai, targetValue: k.baseline * 0.85 }),
  },
  {
    id: 'expiry',
    title: 'Expiry-related losses',
    target: 'at least 15% lower',
    value: (k) => k.ai,
    fmt: (v) => pct(v, 2),
    gainText: (k) => `${(k.gain * 100).toFixed(0)}% less written off`,
    note: () => 'Value expired as a share of value issued.',
    meter: (k) => ({ baseline: k.baseline, ai: k.ai, targetValue: k.baseline * 0.85 }),
  },
  {
    id: 'service',
    title: 'Order fulfilment (fill rate)',
    target: 'at least 10 points higher',
    value: (k) => k.ai,
    fmt: (v) => pct(v, 1),
    gainText: (k) => `+${(k.gain * 100).toFixed(1)} points`,
    note: (k) => (k.baseline > 0.9 ? `Current ordering already fills ${pct(k.baseline, 0)}, so a 10-point gain is not possible on this data.` : 'Units served as a share of units demanded.'),
    meter: (k) => ({ baseline: k.baseline, ai: k.ai, targetValue: Math.min(1, k.baseline + 0.1), max: 1 }),
  },
];

export default function Performance() {
  const { data } = useEngine();
  const weekly = data
    ? data.sim.manual.weekly.map((m, i) => ({
        date: data.sim.weekDates[i],
        manualFill: m.fill,
        aiFill: data.sim.ai.weekly[i].fill,
        manualInv: m.inv,
        aiInv: data.sim.ai.weekly[i].inv,
      }))
    : [];

  return (
    <EngineGate>
      {data && (
        <div className="space-y-5">
          <PageHeader
            title="Outcome KPIs"
            sub={`The five outcomes GRD wants from demand and inventory planning. Each is measured over the last ${data.weeks.sim} weeks by replaying the same demand, opening stock and delivery delays twice: once with the current way of ordering and once with this system’s recommendations.`}
          />
          <SampleDataNote />

          <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {KPIS.map((K) => {
              const k = data.kpis[K.id];
              const ok = k.gain >= k.target;
              const m = K.meter(k);
              return (
                <article key={K.id} className="panel flex flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-sm font-medium text-ink-900">{K.title}</h2>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${ok ? 'bg-monsoon-50 text-monsoon-800' : 'bg-muga-50 text-muga-800'}`}>{ok ? 'Target met' : 'Below target'}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-baseline gap-x-3">
                    <AnimatedNumber value={K.value(k)} format={K.fmt} className="num text-3xl font-semibold text-ink-950" />
                    <span className="num text-sm text-slate-500">from {K.fmt(k.baseline)}</span>
                  </div>
                  <p className={`text-sm ${ok ? 'text-monsoon-700' : 'text-muga-700'}`}>{K.gainText(k)} · target {K.target}</p>
                  <div className="mt-4">
                    <TargetMeter baseline={m.baseline} ai={m.ai} targetValue={m.targetValue} max={m.max} />
                    <div className="mt-1.5 flex flex-wrap justify-between gap-x-3 text-[11px] text-slate-500">
                      <span><i className="mr-1 inline-block h-1.5 w-3 rounded bg-ink-300 align-middle" />current{K.meterLabel ? ` ${K.meterLabel}` : ''}</span>
                      <span><i className="mr-1 inline-block h-1.5 w-3 rounded bg-monsoon-500 align-middle" />recommended</span>
                      <span><i className="mr-1 inline-block h-3 w-0.5 bg-muga-500 align-middle" />target</span>
                    </div>
                  </div>
                  <p className="mt-3 text-[12px] leading-relaxed text-slate-500">{K.note(k)}</p>
                </article>
              );
            })}
            <article className="panel flex flex-col justify-between bg-ink-950 p-5 text-white">
              <div>
                <h2 className="text-sm font-medium text-white/80">Working capital in stock</h2>
                <p className="num mt-3 text-3xl font-semibold">{inr(data.sim.ai.avgInventoryValue)}</p>
                <p className="text-sm text-white/60">average, against {inr(data.sim.manual.avgInventoryValue)} with current ordering</p>
              </div>
              <p className="mt-4 text-sm text-muga-200">
                {inr(data.sim.manual.avgInventoryValue - data.sim.ai.avgInventoryValue)} released · {data.sim.ai.transfers} depot transfers
              </p>
            </article>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="panel p-4 sm:p-5">
              <h2 className="font-display text-base text-ink-950">Weekly fill rate</h2>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weekly} margin={{ top: 10, right: 8, bottom: 0, left: -12 }}>
                    <CartesianGrid stroke="#E1E9E7" vertical={false} />
                    <XAxis dataKey="date" tickFormatter={weekLabel} tick={{ fontSize: 11, fill: '#548293' }} minTickGap={30} axisLine={false} tickLine={false} />
                    <YAxis domain={['dataMin - 0.02', 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} tick={{ fontSize: 11, fill: '#548293' }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v, n) => [pct(v, 1), n]} labelFormatter={weekLabel} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Line dataKey="manualFill" name="Current ordering" stroke="#7FA5B3" strokeWidth={1.8} dot={false} animationDuration={600} />
                    <Line dataKey="aiFill" name="Recommended" stroke="#0E7570" strokeWidth={2.4} dot={false} animationDuration={600} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="panel p-4 sm:p-5">
              <h2 className="font-display text-base text-ink-950">Stock value held</h2>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weekly} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid stroke="#E1E9E7" vertical={false} />
                    <XAxis dataKey="date" tickFormatter={weekLabel} tick={{ fontSize: 11, fill: '#548293' }} minTickGap={30} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v) => inr(v)} tick={{ fontSize: 11, fill: '#548293' }} axisLine={false} tickLine={false} width={60} />
                    <Tooltip formatter={(v, n) => [inr(v), n]} labelFormatter={weekLabel} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Line dataKey="manualInv" name="Current ordering" stroke="#7FA5B3" strokeWidth={1.8} dot={false} animationDuration={600} />
                    <Line dataKey="aiInv" name="Recommended" stroke="#A3691F" strokeWidth={2.4} dot={false} animationDuration={600} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="panel p-5 text-sm leading-relaxed text-slate-600">
            <h2 className="font-display text-base text-ink-950">How these are measured</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li><strong className="text-ink-900">Current ordering</strong> follows today’s habit: a monthly indent of about five weeks of last month’s sales, adjusted by judgement, sometimes missed, with an emergency re-order after a stock-out and no first-expiry-first picking.</li>
              <li><strong className="text-ink-900">Recommended</strong> re-forecasts every week, sizes safety stock from forecast error and delivery-time variability, picks first-expiry-first, and moves at-risk stock between depots before ordering more.</li>
              <li>Forecast accuracy comes from a rolling test with no look-ahead: each forecast uses only data available on the day it was made.</li>
              <li>The baseline is agreed with GRD once its own sales, stock and dispatch records are loaded under <Link to="/data" className="text-monsoon-700 underline">Data sources</Link>.</li>
            </ul>
          </section>
        </div>
      )}
    </EngineGate>
  );
}
