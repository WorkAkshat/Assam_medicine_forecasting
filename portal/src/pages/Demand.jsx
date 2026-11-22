import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart } from 'recharts';
import { ChevronRight } from 'lucide-react';
import { useEngine } from '../hooks/useEngine';
import { EngineGate, PageHeader, SKU_BY_ID, LOC_BY_ID, inr, pct, units, weekLabel, useScope, SampleDataNote, Segmented } from '../components/engine/ui';
import { SIGNAL_LABELS, STATES } from '../engine/catalog';

const SEG_COLORS = { retail: '#0E7570', hospital: '#A3691F', institution: '#3f55b8', stockist: '#7FA5B3' };
const tip = { borderRadius: 8, border: '1px solid #CBD8D5', fontSize: 12 };

export default function Demand() {
  const { data } = useEngine();
  const { depot, rows: scoped } = useScope();
  const [state, setState] = useState('all');
  const [open, setOpen] = useState(null);
  const [sort, setSort] = useState('change');

  const rows = useMemo(() => scoped.filter((r) => state === 'all' || LOC_BY_ID[r.loc].state === state), [scoped, state]);

  const bySku = useMemo(() => {
    const m = new Map();
    rows.forEach((r) => {
      const k = m.get(r.sku) || { sku: r.sku, last4: 0, next4: 0, err: 0, errManual: 0, w: 0, lines: [], drivers: {} };
      k.last4 += r.last4;
      k.next4 += r.next4;
      k.err += r.wape * r.last4;
      k.errManual += r.wapeManual * r.last4;
      k.w += r.last4;
      k.lines.push(r);
      (r.drivers || []).forEach((d) => {
        if (d.id !== 'trend' && d.id !== 'level') k.drivers[d.id] = (k.drivers[d.id] || 0) + d.effect * r.last4;
      });
      m.set(r.sku, k);
    });
    const list = [...m.values()].map((k) => {
      const top = Object.entries(k.drivers).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0];
      return { ...k, change: k.last4 ? k.next4 / k.last4 - 1 : 0, wape: k.w ? k.err / k.w : 0, wapeManual: k.w ? k.errManual / k.w : 0, driver: top ? { id: top[0], effect: top[1] / Math.max(1, k.w) } : null, value: k.next4 * SKU_BY_ID[k.sku].price };
    });
    return list.sort((a, b) => (sort === 'change' ? Math.abs(b.change) - Math.abs(a.change) : b.value - a.value));
  }, [rows, sort]);

  const segTotals = useMemo(() => {
    if (!data) return [];
    const t = data.segments.map(() => 0);
    rows.forEach((r) => r.segMix.forEach((v, i) => (t[i] += v * SKU_BY_ID[r.sku].price)));
    const sum = t.reduce((a, b) => a + b, 0) || 1;
    return data.segments.map((g, i) => ({ ...g, value: t[i], share: t[i] / sum }));
  }, [data, rows]);

  const chart = useMemo(() => {
    if (!data) return [];
    const pts = data.trend.slice(-64).map((p) => ({ ...p }));
    const lastActual = pts.findLastIndex((p) => p.actual != null);
    if (lastActual >= 0) Object.assign(pts[lastActual], { forecast: pts[lastActual].actual, band: [pts[lastActual].actual, pts[lastActual].actual] });
    return pts;
  }, [data]);
  const nextValue = bySku.reduce((a, k) => a + k.value, 0);
  const lastValue = rows.reduce((a, r) => a + r.last4 * SKU_BY_ID[r.sku].price, 0);

  return (
    <EngineGate>
      {data && (
        <div className="space-y-5">
          <PageHeader title="Demand forecast" sub="Weekly demand for every medicine at every depot over the next 12 weeks, the signals moving it, and how each customer segment is buying." >
            {!depot && (
              <select className="select" value={state} onChange={(e) => setState(e.target.value)} aria-label="Filter by state">
                <option value="all">All Northeast states</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
          </PageHeader>
          <SampleDataNote />

          <section className="grid gap-3 sm:grid-cols-3">
            <div className="panel p-4"><p className="kicker">Next 4 weeks (value)</p><p className="num mt-1 text-2xl text-ink-950">{inr(nextValue)}</p><p className={`text-[12px] ${nextValue >= lastValue ? 'text-muga-700' : 'text-monsoon-700'}`}>{nextValue >= lastValue ? '+' : ''}{pct(lastValue ? nextValue / lastValue - 1 : 0, 0)} vs last 4 weeks</p></div>
            <div className="panel p-4"><p className="kicker">Forecast error</p><p className="num mt-1 text-2xl text-ink-950">{pct(data.backtest.bucketWape.ensemble, 1)}</p><p className="text-[12px] text-slate-500">was {pct(data.backtest.bucketWape.manual, 1)} with the 4-week-average rule</p></div>
            <div className="panel p-4"><p className="kicker">Biggest driver ahead</p><p className="mt-1 font-display text-xl text-ink-950">{[...data.outlook].sort((a, b) => b.next - b.past - (a.next - a.past))[0]?.label}</p><p className="text-[12px] text-slate-500">rising most over the next 12 weeks</p></div>
          </section>

          <section className="grid gap-5 xl:grid-cols-3">
            <div className="panel p-4 sm:p-5 xl:col-span-2">
              <h2 className="font-display text-base text-ink-950">Network demand, ₹ per week</h2>
              <p className="text-[12px] text-slate-500">Actual sales, then the forecast with its 80% likely range</p>
              <div className="mt-3 h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chart} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid stroke="#E1E9E7" vertical={false} />
                    <XAxis dataKey="date" tickFormatter={weekLabel} tick={{ fontSize: 11, fill: '#548293' }} minTickGap={40} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={inr} tick={{ fontSize: 11, fill: '#548293' }} axisLine={false} tickLine={false} width={58} />
                    <Tooltip contentStyle={tip} labelFormatter={(d) => `Week of ${weekLabel(d)}`} formatter={(v, n) => [Array.isArray(v) ? `${inr(v[0])} – ${inr(v[1])}` : inr(v), n]} />
                    <Area dataKey="band" name="Likely range" stroke="none" fill="#D29C36" fillOpacity={0.2} />
                    <Line dataKey="actual" name="Actual" stroke="#15303B" strokeWidth={1.6} dot={false} isAnimationActive={false} />
                    <Line dataKey="forecast" name="Forecast" stroke="#A3691F" strokeWidth={2.4} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="panel p-4 sm:p-5">
              <h2 className="font-display text-base text-ink-950">Customer segments</h2>
              <p className="text-[12px] text-slate-500">Share of sales value, last 13 weeks{depot ? `, ${LOC_BY_ID[depot].name}` : ''}</p>
              <ul className="mt-4 space-y-3">
                {segTotals.map((g) => (
                  <li key={g.id}>
                    <div className="flex justify-between text-sm"><span className="text-slate-700">{g.name}</span><span className="num text-ink-950">{pct(g.share, 0)}</span></div>
                    <div className="mt-1 h-1.5 rounded-full bg-mist-200"><div className="h-full rounded-full" style={{ width: `${g.share * 100}%`, background: SEG_COLORS[g.id] }} /></div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.trend.filter((p) => p.actual != null).slice(-52)} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                    <XAxis dataKey="date" hide />
                    <Tooltip contentStyle={tip} labelFormatter={(d) => weekLabel(d)} formatter={(v, n) => [inr(v), data.segments.find((g) => g.id === n)?.name || n]} />
                    {data.segments.map((g) => (
                      <Area key={g.id} dataKey={g.id} stackId="1" stroke="none" fill={SEG_COLORS[g.id]} fillOpacity={0.85} isAnimationActive={false} />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-slate-500">Hospitals react hardest to outbreaks; institutions buy in monthly tenders; sub-stockists buy ahead of festivals.</p>
            </div>
          </section>

          <section className="panel overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
              <h2 className="font-display text-lg text-ink-950">By medicine</h2>
              <Segmented label="Sort" value={sort} onChange={setSort} options={[['change', 'Biggest change'], ['value', 'Highest value']]} />
            </div>
            <ul className="divide-y divide-mist-200">
              {bySku.map((k) => {
                const sku = SKU_BY_ID[k.sku];
                const isOpen = open === k.sku;
                return (
                  <li key={k.sku}>
                    <button type="button" onClick={() => setOpen(isOpen ? null : k.sku)} aria-expanded={isOpen} className="grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-4 py-3 text-left hover:bg-mist-50 sm:px-5 md:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))_auto]">
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-ink-950">{sku.name}</span>
                        <span className="block text-[12px] text-slate-500">{sku.form} · {k.lines.length} depots{k.driver ? ` · ${SIGNAL_LABELS[k.driver.id] || k.driver.id}` : ''}</span>
                      </span>
                      <span className={`num text-right text-sm md:order-none ${k.change > 0.05 ? 'text-muga-700' : k.change < -0.05 ? 'text-monsoon-700' : 'text-slate-600'}`}>{k.change >= 0 ? '+' : ''}{pct(k.change, 0)}</span>
                      <span className="num hidden text-right text-sm md:block">{units(k.last4)}</span>
                      <span className="num hidden text-right text-sm md:block">{units(k.next4)}</span>
                      <span className="num hidden text-right text-sm md:block">{pct(k.wape, 0)} <span className="text-slate-400">/ {pct(k.wapeManual, 0)}</span></span>
                      <ChevronRight className={`hidden h-4 w-4 text-slate-400 transition-transform md:block ${isOpen ? 'rotate-90' : ''}`} />
                      <span className="col-span-2 text-[12px] text-slate-500 md:hidden">{units(k.last4)} last 4 wk → {units(k.next4)} next 4 wk {sku.unit}s</span>
                    </button>
                    {isOpen && (
                      <ul className="grid gap-px bg-mist-200 sm:grid-cols-2 lg:grid-cols-3">
                        {k.lines.sort((a, b) => b.next4 - a.next4).map((r) => (
                          <li key={r.key} className="bg-mist-50">
                            <Link to={`/demand/series?k=${encodeURIComponent(r.key)}`} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-white sm:px-5">
                              <span>{LOC_BY_ID[r.loc].name}</span>
                              <span className="num text-slate-600">{units(r.next4)} <span className={r.next4 >= r.last4 ? 'text-muga-700' : 'text-monsoon-700'}>{r.last4 ? `${r.next4 >= r.last4 ? '+' : ''}${Math.round((r.next4 / r.last4 - 1) * 100)}%` : ''}</span></span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="hidden border-t border-mist-200 px-5 py-2 text-[12px] text-slate-500 md:block">Columns: change, last 4 weeks, next 4 weeks (units), forecast error now / with the 4-week-average rule.</p>
          </section>
        </div>
      )}
    </EngineGate>
  );
}
