import React, { Suspense, lazy, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Truck, PackageCheck, Repeat2 } from 'lucide-react';
import { useEngine } from '../hooks/useEngine';
import { EngineGate, inr, pct, units, SKU_BY_ID, StatusPill, AnimatedNumber, weekLabel } from '../components/engine/ui';
import { STATUS_COLORS, locStatus } from '../components/tower/statusColors';

const NetworkScene = lazy(() => import('../components/tower/NetworkScene'));

const KPI_ROWS = [
  { id: 'accuracy', label: 'Forecast accuracy', fmt: (k) => `${pct(k.baseline, 0)} → ${pct(k.ai, 0)}`, gain: (k) => `+${Math.round(k.gain * 100)}%`, target: '+20%' },
  { id: 'stockout', label: 'Stock-out weeks', fmt: (k) => `${pct(k.baseline)} → ${pct(k.ai)}`, gain: (k) => `−${Math.round(k.gain * 100)}%`, target: '−20%' },
  { id: 'excess', label: 'Excess stock share', fmt: (k) => `${pct(k.baseline)} → ${pct(k.ai)}`, gain: (k) => `−${Math.round(k.gain * 100)}%`, target: '−15%' },
  { id: 'expiry', label: 'Expiry loss', fmt: (k) => `${pct(k.baseline, 2)} → ${pct(k.ai, 2)}`, gain: (k) => `−${Math.round(k.gain * 100)}%`, target: '−15%' },
  { id: 'service', label: 'Fill rate', fmt: (k) => `${pct(k.baseline)} → ${pct(k.ai)}`, gain: (k) => `+${(k.gain * 100).toFixed(1)} pts`, target: '+10 pts' },
];

function met(id, k) {
  return id === 'service' ? k.gain >= k.target : k.gain >= k.target;
}

function SceneFallback() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-white/60">
      <span className="animate-pulse">Raising the terrain…</span>
    </div>
  );
}

function DepotPanel({ loc, rows }) {
  const items = rows
    .filter((r) => r.loc === loc.id && r.status !== 'healthy')
    .sort((a, b) => b.pStockout - a.pStockout || b.atRiskValue - a.atRiskValue)
    .slice(0, 5);
  return (
    <motion.div key={loc.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.25 }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] text-white/55">{loc.state} · {loc.route}</p>
          <h2 className="font-display text-xl text-white">{loc.name}</h2>
        </div>
        <div className="text-right">
          <p className="num text-3xl font-semibold" style={{ color: STATUS_COLORS[locStatus(loc)] }}>{loc.health}</p>
          <p className="text-[11px] text-white/50">health score</p>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <dt className="text-[12px] text-white/50">Stock on hand</dt>
          <dd className="num text-white">{inr(loc.stockValue)}</dd>
        </div>
        <div>
          <dt className="text-[12px] text-white/50">Order this week</dt>
          <dd className="num text-muga-300">{inr(loc.orderValue)}</dd>
        </div>
        <div>
          <dt className="text-[12px] text-white/50">Lead time from Rani</dt>
          <dd className="num text-white">{loc.leadDays.toFixed(1)} d <span className="text-white/45">± {loc.leadSdDays.toFixed(1)}</span></dd>
        </div>
        <div>
          <dt className="text-[12px] text-white/50">Forecast error</dt>
          <dd className="num text-white">{pct(loc.wape, 0)} <span className="text-white/45">was {pct(loc.wapeManual, 0)}</span></dd>
        </div>
      </dl>
      <div className="mt-5">
        <p className="text-[12px] text-white/50">Needs attention</p>
        <ul className="mt-2 divide-y divide-white/10">
          {items.length === 0 && <li className="py-2 text-sm text-white/60">Every medicine here is within its safety band.</li>}
          {items.map((r) => (
            <li key={r.key}>
              <Link to={`/demand/series?k=${encodeURIComponent(r.key)}`} className="group flex items-center justify-between gap-3 py-2">
                <span className="min-w-0">
                  <span className="block truncate text-sm text-white group-hover:text-muga-200">{SKU_BY_ID[r.sku].name}</span>
                  <span className="block text-[12px] text-white/50">
                    {r.status === 'excess' ? `${inr(r.atRiskValue + r.excessValue)} at risk` : `${r.coverWeeks.toFixed(1)} wk cover · ${pct(r.pStockout, 0)} stock-out risk`}
                  </span>
                </span>
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: STATUS_COLORS[r.status] }} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function NetworkPanel({ data }) {
  const t = data.totals;
  return (
    <motion.div key="network" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <p className="text-[12px] text-white/55">Whole network · week of {weekLabel(data.asOf)}</p>
      <h2 className="font-display text-xl text-white">13 depots, 20 medicines</h2>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <dt className="text-[12px] text-white/50">At stock-out risk</dt>
          <dd className="num text-2xl text-[#ef6a53]"><AnimatedNumber value={t.critical} /></dd>
        </div>
        <div>
          <dt className="text-[12px] text-white/50">On watch</dt>
          <dd className="num text-2xl text-muga-300"><AnimatedNumber value={t.watch} /></dd>
        </div>
        <div>
          <dt className="text-[12px] text-white/50">Stock on hand</dt>
          <dd className="num text-white">{inr(t.stockValue)}</dd>
        </div>
        <div>
          <dt className="text-[12px] text-white/50">Near-expiry + excess</dt>
          <dd className="num text-white">{inr(t.atRiskValue + t.excessValue)}</dd>
        </div>
      </dl>
      <p className="mt-5 text-sm leading-relaxed text-white/65">
        Select a pillar to open a depot. Pillar height is stock value; colour is service risk. Gold dots are this week’s suggested shipments — they travel faster on reliable routes. Dashed routes have unreliable lead times.
      </p>
    </motion.div>
  );
}

export default function Overview() {
  const { data } = useEngine();
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const ranked = useMemo(() => (data ? [...data.locations].sort((a, b) => a.health - b.health) : []), [data]);
  const sel = data?.locations.find((l) => l.id === selected);

  return (
    <EngineGate label="Building the network view">
      {data && (
        <div className="space-y-6">
          <section className="relative -mx-3.5 -mt-4 overflow-hidden bg-ink-950 text-white sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-8">
            <div className="relative h-[52vh] min-h-[360px] sm:h-[60vh] lg:h-[calc(100vh-4rem)] lg:min-h-[600px]">
              <Suspense fallback={<SceneFallback />}>
                <NetworkScene locations={data.locations} selected={selected} onSelect={setSelected} hovered={hovered} onHover={setHovered} />
              </Suspense>

              <div className="pointer-events-none absolute left-4 top-4 max-w-[60%] sm:left-6 sm:top-6">
                <h1 className="font-display text-xl font-semibold leading-tight sm:text-3xl">Northeast network</h1>
                <p className="mt-1 text-[13px] text-white/60 sm:text-sm">
                  Week of {weekLabel(data.asOf)} · {data.totals.series} medicine × depot lines
                </p>
              </div>

              {/* Depot ranking (desktop) */}
              <div className="absolute bottom-24 left-6 top-32 hidden w-52 overflow-y-auto rounded-xl bg-ink-950/55 p-2 backdrop-blur-sm lg:block">
                <p className="mb-1 px-2 text-[12px] text-white/50">Depots, weakest first</p>
                <ul className="space-y-1">
                  {ranked.map((l) => (
                    <li key={l.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(l.id === selected ? null : l.id)}
                        onMouseEnter={() => setHovered(l.id)}
                        onMouseLeave={() => setHovered(null)}
                        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${selected === l.id ? 'bg-white/15' : 'hover:bg-white/10'}`}
                      >
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: STATUS_COLORS[locStatus(l)] }} />
                        <span className="flex-1 truncate text-white/85">{l.name}</span>
                        <span className="num text-white/60">{l.health}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Detail panel (desktop overlay) */}
              <div className="absolute right-6 top-6 hidden w-[340px] rounded-xl border border-white/10 bg-ink-950/80 p-5 backdrop-blur-md lg:block">
                <AnimatePresence mode="wait">{sel ? <DepotPanel loc={sel} rows={data.rows} /> : <NetworkPanel data={data} />}</AnimatePresence>
              </div>

              {/* KPI strip */}
              <Link
                to="/performance"
                className="absolute inset-x-0 bottom-0 hidden grid-cols-5 border-t border-white/10 bg-ink-950/85 backdrop-blur-md transition-colors hover:bg-ink-900/90 lg:grid"
              >
                {KPI_ROWS.map((k) => {
                  const v = data.kpis[k.id];
                  return (
                    <div key={k.id} className="border-r border-white/10 px-5 py-3 last:border-r-0">
                      <p className="text-[12px] text-white/50">{k.label}</p>
                      <p className="num mt-0.5 text-white">{k.fmt(v)}</p>
                      <p className={`text-[12px] ${met(k.id, v) ? 'text-monsoon-300' : 'text-muga-300'}`}>
                        {k.gain(v)} · target {k.target}
                      </p>
                    </div>
                  );
                })}
              </Link>
            </div>
          </section>

          {/* Phone & tablet: depot panel, depot picker and KPIs below the map */}
          <section className="space-y-4 lg:hidden">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" aria-label="Depots, weakest first">
              {ranked.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setSelected(l.id === selected ? null : l.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${selected === l.id ? 'border-ink-900 bg-ink-900 text-white' : 'border-mist-300 bg-white text-ink-900'}`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: STATUS_COLORS[locStatus(l)] }} />
                  {l.name}
                  <span className="num opacity-60">{l.health}</span>
                </button>
              ))}
            </div>
            <div className="rounded-xl bg-ink-950 p-5">
              <AnimatePresence mode="wait">{sel ? <DepotPanel loc={sel} rows={data.rows} /> : <NetworkPanel data={data} />}</AnimatePresence>
            </div>
            <Link to="/performance" className="panel grid grid-cols-2 gap-px overflow-hidden bg-mist-300/70 sm:grid-cols-3">
              {KPI_ROWS.map((k) => {
                const v = data.kpis[k.id];
                return (
                  <div key={k.id} className="bg-white p-3">
                    <p className="text-[12px] text-slate-500">{k.label}</p>
                    <p className="num text-sm text-ink-950">{k.fmt(v)}</p>
                    <p className={`text-[12px] ${met(k.id, v) ? 'text-monsoon-700' : 'text-muga-700'}`}>{k.gain(v)} · target {k.target}</p>
                  </div>
                );
              })}
            </Link>
          </section>

          {/* This week's decisions */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Link to="/replenishment" className="panel group p-5 transition-shadow hover:shadow-lift">
              <div className="flex items-center justify-between">
                <PackageCheck className="h-5 w-5 text-monsoon-600" />
                <ArrowUpRight className="h-4 w-4 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <p className="num mt-4 text-3xl font-semibold text-ink-950">{data.totals.orders}</p>
              <p className="text-sm text-slate-600">replenishment orders to review, worth {inr(data.totals.orderValue)}</p>
            </Link>
            <Link to="/expiry" className="panel group p-5 transition-shadow hover:shadow-lift">
              <div className="flex items-center justify-between">
                <Repeat2 className="h-5 w-5 text-[#3f55b8]" />
                <ArrowUpRight className="h-4 w-4 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <p className="num mt-4 text-3xl font-semibold text-ink-950">{data.transfers.length}</p>
              <p className="text-sm text-slate-600">depot-to-depot transfers that rescue {inr(data.transfers.reduce((a, t) => a + t.value, 0))} of slow or near-expiry stock</p>
            </Link>
            <div className="panel p-5">
              <div className="flex items-center justify-between">
                <Truck className="h-5 w-5 text-muga-600" />
                <span className="text-[12px] text-slate-500">next 12 weeks vs last 12</span>
              </div>
              <ul className="mt-3 space-y-2">
                {data.outlook
                  .map((o) => ({ ...o, delta: o.next - o.past }))
                  .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
                  .slice(0, 4)
                  .map((o) => (
                    <li key={o.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-700">{o.label}</span>
                      <span className={`num ${o.delta > 0 ? 'text-[#b63c27]' : 'text-monsoon-700'}`}>{o.delta > 0 ? 'rising' : 'easing'}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </section>

          <section className="panel overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="font-display text-lg text-ink-950">Most urgent medicines</h2>
              <Link to="/replenishment" className="text-sm text-monsoon-700 hover:underline">Open replenishment</Link>
            </div>
            <ul className="divide-y divide-mist-200 md:hidden">
              {[...data.rows].sort((a, b) => b.pStockout - a.pStockout).slice(0, 8).map((r) => (
                <li key={r.key}>
                  <Link to={`/demand/series?k=${encodeURIComponent(r.key)}`} className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink-950">{SKU_BY_ID[r.sku].name}</span>
                      <span className="block text-[12px] text-slate-500">{data.locations.find((l) => l.id === r.loc).name} · {r.coverWeeks.toFixed(1)} wk cover · order {units(r.order)}</span>
                    </span>
                    <span className="num shrink-0 text-sm text-[#b63c27]">{pct(r.pStockout, 0)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-mist-50 text-left text-[12px] text-slate-500">
                  <tr>
                    <th className="px-5 py-2 font-medium">Medicine</th>
                    <th className="px-3 py-2 font-medium">Depot</th>
                    <th className="px-3 py-2 text-right font-medium">Cover</th>
                    <th className="px-3 py-2 text-right font-medium">Stock-out risk</th>
                    <th className="px-3 py-2 text-right font-medium">Suggested order</th>
                    <th className="px-5 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist-200">
                  {[...data.rows]
                    .sort((a, b) => b.pStockout - a.pStockout)
                    .slice(0, 8)
                    .map((r) => (
                      <tr key={r.key} className="hover:bg-mist-50">
                        <td className="px-5 py-2.5">
                          <Link className="text-ink-900 hover:text-monsoon-700" to={`/demand/series?k=${encodeURIComponent(r.key)}`}>{SKU_BY_ID[r.sku].name}</Link>
                        </td>
                        <td className="px-3 py-2.5 text-slate-600">{data.locations.find((l) => l.id === r.loc).name}</td>
                        <td className="num px-3 py-2.5 text-right">{r.coverWeeks.toFixed(1)} wk</td>
                        <td className="num px-3 py-2.5 text-right">{pct(r.pStockout, 0)}</td>
                        <td className="num px-3 py-2.5 text-right">{units(r.order)}</td>
                        <td className="px-5 py-2.5"><StatusPill status={r.status} /></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </EngineGate>
  );
}
