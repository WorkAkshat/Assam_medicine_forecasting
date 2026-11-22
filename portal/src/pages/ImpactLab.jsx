import React, { useEffect, useRef, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Shuffle, RotateCcw } from 'lucide-react';
import { useEngine, DEFAULT_SCENARIO } from '../hooks/useEngine';
import { EngineGate, PageHeader, AnimatedNumber, TargetMeter, inr, pct, weekLabel } from '../components/engine/ui';

const KPIS = [
  {
    id: 'accuracy',
    title: 'Demand forecast accuracy',
    target: 'at least 20% better',
    better: 'higher',
    value: (k) => k.ai,
    fmt: (v) => pct(v, 1),
    gainText: (k) => `${(k.gain * 100).toFixed(1)}% less error`,
    note: (k) => `Scored on the 4-week bucket each order is sized on. Week-by-week: ${pct(k.weekly.baseline, 0)} → ${pct(k.weekly.ai, 0)}.`,
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
    better: 'higher',
    value: (k) => k.ai,
    fmt: (v) => pct(v, 1),
    gainText: (k) => `+${(k.gain * 100).toFixed(1)} points`,
    note: (k) => (k.baseline > 0.9 ? 'This baseline already fills over 90%, which caps the possible gain below 10 points.' : 'Units served as a share of units demanded.'),
    meter: (k) => ({ baseline: k.baseline, ai: k.ai, targetValue: Math.min(1, k.baseline + 0.1), max: 1 }),
  },
];

function Slider({ label, value, min, max, step, onChange, format, hint }) {
  return (
    <label className="block">
      <span className="flex justify-between text-sm">
        <span className="text-ink-900">{label}</span>
        <span className="num text-monsoon-700">{format(value)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-monsoon-600" />
      {hint && <span className="text-[12px] text-slate-500">{hint}</span>}
    </label>
  );
}

export default function ImpactLab() {
  const { data, scenario, run, status } = useEngine();
  const [draft, setDraft] = useState(scenario);
  const timer = useRef();

  useEffect(() => setDraft(scenario), [scenario]);

  const update = (patch) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => run(next), 220);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

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
    <EngineGate label="Simulating the pilot">
      {data && (
        <div className="space-y-6">
          <PageHeader
            title="Pilot impact"
            sub={`The last ${data.weeks.sim} weeks replayed twice from the same opening stock, demand and transport delays: once with today’s ordering habits and once with the AI plan. Change the conditions to stress-test the result.`}
          />

          <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
            <aside className="panel h-fit space-y-6 p-5 xl:sticky xl:top-20">
              <div>
                <h2 className="font-display text-base text-ink-950">Conditions</h2>
                <p className="text-[12px] text-slate-500">The engine re-runs in the background as you move a control.</p>
              </div>
              <Slider label="Monsoon severity" min={0.6} max={1.6} step={0.05} value={draft.monsoon} onChange={(v) => update({ monsoon: v })} format={(v) => `${Math.round(v * 100)}%`} hint="Rainfall, floods and the disease seasons that follow" />
              <Slider label="Transport disruption" min={0} max={1} step={0.05} value={draft.leadShock} onChange={(v) => update({ leadShock: v })} format={(v) => `+${Math.round(v * 100)}% lead time`} hint="Landslides, blockades and highway closures" />
              <Slider label="Extra safety margin" min={-0.4} max={0.6} step={0.1} value={draft.serviceBoost} onChange={(v) => update({ serviceBoost: v })} format={(v) => (v >= 0 ? `+${v.toFixed(1)}σ` : `${v.toFixed(1)}σ`)} hint="Higher service for more stock" />
              <label className="flex items-center justify-between text-sm">
                <span className="text-ink-900">Depot-to-depot transfers</span>
                <input type="checkbox" checked={draft.redistribute} onChange={(e) => update({ redistribute: e.target.checked })} className="h-4 w-4 accent-monsoon-600" />
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={() => update({ seed: (draft.seed * 7 + 13) % 997 })} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-mist-300 px-3 py-1.5 text-sm hover:bg-mist-50">
                  <Shuffle className="h-4 w-4" /> Another year
                </button>
                <button type="button" onClick={() => update(DEFAULT_SCENARIO)} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-mist-300 px-3 py-1.5 text-sm hover:bg-mist-50" aria-label="Reset conditions">
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[12px] text-slate-500">
                Run {data.elapsedMs} ms · seed {data.scenario.seed}
                {status === 'refreshing' && <span className="ml-1 text-muga-700">· updating</span>}
              </p>
            </aside>

            <div className="space-y-6">
              <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {KPIS.map((K) => {
                  const k = data.kpis[K.id];
                  const ok = k.gain >= k.target;
                  const m = K.meter(k);
                  return (
                    <article key={K.id} className="panel flex flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm font-medium text-ink-900">{K.title}</h3>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${ok ? 'bg-monsoon-50 text-monsoon-800' : 'bg-muga-50 text-muga-800'}`}>{ok ? 'Target met' : 'Below target'}</span>
                      </div>
                      <div className="mt-3 flex items-baseline gap-3">
                        <AnimatedNumber value={K.value(k)} format={K.fmt} className="num text-3xl font-semibold text-ink-950" />
                        <span className="num text-sm text-slate-500">from {K.fmt(K.id === 'accuracy' ? k.baseline : k.baseline)}</span>
                      </div>
                      <p className={`text-sm ${ok ? 'text-monsoon-700' : 'text-muga-700'}`}>{K.gainText(k)} · target {K.target}</p>
                      <div className="mt-4">
                        <TargetMeter baseline={m.baseline} ai={m.ai} targetValue={m.targetValue} max={m.max} />
                        <div className="mt-1.5 flex justify-between text-[11px] text-slate-500">
                          <span><i className="mr-1 inline-block h-1.5 w-3 rounded bg-ink-300 align-middle" />manual{K.meterLabel ? ` ${K.meterLabel}` : ''}</span>
                          <span><i className="mr-1 inline-block h-1.5 w-3 rounded bg-monsoon-500 align-middle" />AI</span>
                          <span><i className="mr-1 inline-block h-3 w-0.5 bg-muga-500 align-middle" />target</span>
                        </div>
                      </div>
                      <p className="mt-3 text-[12px] leading-relaxed text-slate-500">{K.note(k)}</p>
                    </article>
                  );
                })}
                <article className="panel flex flex-col justify-between bg-ink-950 p-5 text-white">
                  <div>
                    <h3 className="text-sm font-medium text-white/80">Working capital in stock</h3>
                    <p className="num mt-3 text-3xl font-semibold">{inr(data.sim.ai.avgInventoryValue)}</p>
                    <p className="text-sm text-white/60">average, against {inr(data.sim.manual.avgInventoryValue)} today</p>
                  </div>
                  <p className="mt-4 text-sm text-muga-200">
                    {inr(data.sim.manual.avgInventoryValue - data.sim.ai.avgInventoryValue)} released · {data.sim.ai.transfers} transfers · {data.sim.ai.orders} orders vs {data.sim.manual.orders}
                  </p>
                </article>
              </section>

              <section className="grid gap-6 lg:grid-cols-2">
                <div className="panel p-5">
                  <h3 className="font-display text-base text-ink-950">Weekly fill rate</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={weekly} margin={{ top: 10, right: 8, bottom: 0, left: -12 }}>
                      <CartesianGrid stroke="#E1E9E7" vertical={false} />
                      <XAxis dataKey="date" tickFormatter={weekLabel} tick={{ fontSize: 11, fill: '#548293' }} minTickGap={30} axisLine={false} tickLine={false} />
                      <YAxis domain={['dataMin - 0.02', 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} tick={{ fontSize: 11, fill: '#548293' }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v, n) => [pct(v, 1), n]} labelFormatter={weekLabel} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                      <Line dataKey="manualFill" name="Manual" stroke="#7FA5B3" strokeWidth={1.8} dot={false} animationDuration={600} />
                      <Line dataKey="aiFill" name="AI plan" stroke="#0E7570" strokeWidth={2.4} dot={false} animationDuration={600} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="panel p-5">
                  <h3 className="font-display text-base text-ink-950">Stock value held</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={weekly} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
                      <CartesianGrid stroke="#E1E9E7" vertical={false} />
                      <XAxis dataKey="date" tickFormatter={weekLabel} tick={{ fontSize: 11, fill: '#548293' }} minTickGap={30} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={(v) => inr(v)} tick={{ fontSize: 11, fill: '#548293' }} axisLine={false} tickLine={false} width={60} />
                      <Tooltip formatter={(v, n) => [inr(v), n]} labelFormatter={weekLabel} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                      <Line dataKey="manualInv" name="Manual" stroke="#7FA5B3" strokeWidth={1.8} dot={false} animationDuration={600} />
                      <Line dataKey="aiInv" name="AI plan" stroke="#A3691F" strokeWidth={2.4} dot={false} animationDuration={600} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="panel p-5 text-sm leading-relaxed text-slate-600">
                <h3 className="font-display text-base text-ink-950">How to read this</h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                  <li>All data here is <strong>synthetic</strong>, generated to reflect Northeast patterns: monsoon and Brahmaputra floods, malaria and dengue seasons, winter respiratory illness, national deworming days, Bihu and Durga Puja, highway disruptions and uneven lead times. It will be replaced by GRD’s own sales, stock and dispatch records in the pilot.</li>
                  <li>“Manual” models today’s habit: a monthly indent of about five weeks of last month’s sales, adjusted by judgement, sometimes missed, with an emergency re-order after a stock-out, and no expiry-first picking.</li>
                  <li>“AI plan” re-forecasts every week, sets safety stock from forecast error and lead-time variability, picks first-expiry-first, and moves at-risk stock between depots before ordering more.</li>
                  <li>Forecast accuracy comes from a rolling back-test with no look-ahead: each forecast only uses data available on the day it was made.</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </EngineGate>
  );
}
