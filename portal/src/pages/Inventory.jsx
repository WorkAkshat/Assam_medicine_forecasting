import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useEngine } from '../hooks/useEngine';
import { EngineGate, PageHeader, SKU_BY_ID, LOC_BY_ID, VED_LABEL, inr, units, pct, StatusPill, Segmented, useScope, SampleDataNote, STATUS_META, downloadCsv } from '../components/engine/ui';
import { SKUS, LOCATIONS } from '../engine/catalog';

const CELL = {
  critical: 'bg-[#f6c9bf] text-[#7d2616]',
  watch: 'bg-muga-100 text-muga-900',
  healthy: 'bg-monsoon-50 text-monsoon-900',
  excess: 'bg-[#dfe5fb] text-[#2c3c86]',
};

export default function Inventory() {
  const { data } = useEngine();
  const navigate = useNavigate();
  const { depot, rows } = useScope();
  const [view, setView] = useState(depot ? 'list' : 'matrix');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');

  const byKey = useMemo(() => new Map(rows.map((r) => [r.key, r])), [rows]);
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows
      .filter((r) => status === 'all' || r.status === status)
      .filter((r) => !needle || SKU_BY_ID[r.sku].name.toLowerCase().includes(needle) || LOC_BY_ID[r.loc].name.toLowerCase().includes(needle))
      .sort((a, b) => b.pStockout - a.pStockout);
  }, [rows, q, status]);

  const stockValue = rows.reduce((a, r) => a + r.stockValue, 0);
  const inbound = rows.reduce((a, r) => a + r.inbound * SKU_BY_ID[r.sku].price, 0);
  const counts = Object.fromEntries(Object.keys(STATUS_META).map((k) => [k, rows.filter((r) => r.status === k).length]));
  const locs = depot ? LOCATIONS.filter((l) => l.id === depot) : LOCATIONS;

  return (
    <EngineGate>
      {data && (
        <div className="space-y-5">
          <PageHeader title="Inventory" sub={depot ? `Stock, cover and batch risk at ${LOC_BY_ID[depot].name}.` : 'Stock on hand and weeks of cover for every medicine at every depot, so shortages and surpluses are visible across the whole network at once.'}>
            <button
              type="button"
              onClick={() => downloadCsv(`inventory-${data.asOf.slice(0, 10)}.csv`, rows.map((r) => ({ sku_code: r.sku, medicine: SKU_BY_ID[r.sku].name, depot_code: r.loc, depot: LOC_BY_ID[r.loc].name, on_hand: Math.round(r.onHand), inbound: Math.round(r.inbound), weekly_demand: r.dAvg.toFixed(1), weeks_cover: r.coverWeeks.toFixed(1), stock_value_inr: Math.round(r.stockValue), status: r.status, stockout_risk: r.pStockout.toFixed(3), nearest_expiry_weeks: r.nearestExpiry ?? '' })))}
              className="rounded-md border border-mist-300 bg-white px-3 py-1.5 text-sm hover:bg-mist-50"
            >
              Export CSV
            </button>
          </PageHeader>
          <SampleDataNote />

          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="panel p-4"><p className="kicker">Stock on hand</p><p className="num mt-1 text-xl text-ink-950 sm:text-2xl">{inr(stockValue)}</p></div>
            <div className="panel p-4"><p className="kicker">In transit</p><p className="num mt-1 text-xl text-ink-950 sm:text-2xl">{inr(inbound)}</p></div>
            <div className="panel p-4"><p className="kicker">Lines at stock-out risk</p><p className="num mt-1 text-xl text-[#b63c27] sm:text-2xl">{counts.critical + counts.watch}</p></div>
            <div className="panel p-4"><p className="kicker">Lines with excess or expiry risk</p><p className="num mt-1 text-xl text-[#3f55b8] sm:text-2xl">{counts.excess}</p></div>
          </section>

          <div className="flex flex-wrap items-center gap-2">
            {!depot && <Segmented label="View" value={view} onChange={setView} options={[['matrix', 'Network grid'], ['list', 'List']]} />}
            <Segmented label="Status" value={status} onChange={setStatus} options={[['all', 'All'], ...Object.entries(STATUS_META).map(([k, m]) => [k, m.label])]} />
            {view === 'list' && (
              <label className="relative min-w-[200px] flex-1 sm:max-w-xs">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search medicine or depot" className="input pl-8" aria-label="Search medicine or depot" />
              </label>
            )}
          </div>

          {view === 'matrix' && !depot ? (
            <section className="panel overflow-hidden">
              <p className="px-4 pt-3 text-[12px] text-slate-500">Weeks of cover at the current forecast. Tap a cell to open that line.</p>
              <div className="overflow-auto">
                <table className="w-max min-w-full border-separate border-spacing-0 text-[12px]">
                  <thead>
                    <tr>
                      <th className="sticky left-0 top-0 z-20 bg-white px-3 py-2 text-left font-medium text-slate-500">Medicine</th>
                      {locs.map((l) => (
                        <th key={l.id} className="sticky top-0 z-10 bg-white px-1 py-2 font-medium text-slate-500" title={l.name}>
                          <span className="block w-12 truncate text-center">{l.name.split(' ')[0]}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SKUS.map((k) => (
                      <tr key={k.id}>
                        <th scope="row" className="sticky left-0 z-10 max-w-[150px] truncate bg-white px-3 py-1 text-left font-normal text-ink-900 sm:max-w-[220px]" title={k.name}>{k.name}</th>
                        {locs.map((l) => {
                          const r = byKey.get(`${k.id}@${l.id}`);
                          if (!r) return <td key={l.id} />;
                          const dim = status !== 'all' && r.status !== status;
                          return (
                            <td key={l.id} className="p-0.5">
                              <button
                                type="button"
                                onClick={() => navigate(`/demand/series?k=${encodeURIComponent(r.key)}`)}
                                className={`num block h-8 w-12 rounded text-center transition-opacity ${CELL[r.status]} ${dim ? 'opacity-20' : 'hover:ring-2 hover:ring-ink-900/30'}`}
                                title={`${k.name} at ${l.name}: ${r.coverWeeks.toFixed(1)} weeks cover, ${pct(r.pStockout, 0)} stock-out risk`}
                              >
                                {r.coverWeeks > 52 ? '52+' : r.coverWeeks.toFixed(1)}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap gap-3 px-4 pb-3 pt-2 text-[12px] text-slate-600">
                {Object.entries(STATUS_META).map(([k, m]) => (
                  <span key={k} className="inline-flex items-center gap-1.5"><i className={`inline-block h-3 w-4 rounded ${CELL[k]}`} />{m.label}</span>
                ))}
              </div>
            </section>
          ) : (
            <>
              <ul className="space-y-2.5 md:hidden">
                {filtered.slice(0, 80).map((r) => (
                  <li key={r.key}>
                    <Link to={`/demand/series?k=${encodeURIComponent(r.key)}`} className="panel block p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink-950">{SKU_BY_ID[r.sku].name}</p>
                          <p className="text-[12px] text-slate-500">{LOC_BY_ID[r.loc].name}</p>
                        </div>
                        <StatusPill status={r.status} />
                      </div>
                      <dl className="mt-2 grid grid-cols-3 gap-2 text-[12px]">
                        <div><dt className="text-slate-500">On hand</dt><dd className="num text-sm text-ink-950">{units(r.onHand)}</dd></div>
                        <div><dt className="text-slate-500">Cover</dt><dd className="num text-sm text-ink-950">{r.coverWeeks > 52 ? '52+' : r.coverWeeks.toFixed(1)} wk</dd></div>
                        <div><dt className="text-slate-500">Expiry</dt><dd className="num text-sm text-ink-950">{r.nearestExpiry == null ? '—' : `${r.nearestExpiry} wk`}</dd></div>
                      </dl>
                    </Link>
                  </li>
                ))}
              </ul>
              <section className="panel hidden overflow-x-auto md:block">
                <table className="w-full min-w-[820px] text-sm">
                  <thead className="bg-mist-50 text-left text-[12px] text-slate-500">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Medicine</th>
                      <th className="px-3 py-2.5 font-medium">Depot</th>
                      <th className="px-3 py-2.5 text-right font-medium">On hand</th>
                      <th className="px-3 py-2.5 text-right font-medium">In transit</th>
                      <th className="px-3 py-2.5 text-right font-medium">Weekly demand</th>
                      <th className="px-3 py-2.5 text-right font-medium">Cover</th>
                      <th className="px-3 py-2.5 text-right font-medium">Nearest expiry</th>
                      <th className="px-3 py-2.5 text-right font-medium">Value</th>
                      <th className="px-4 py-2.5 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mist-200">
                    {filtered.slice(0, 200).map((r) => (
                      <tr key={r.key} className="hover:bg-mist-50">
                        <td className="px-4 py-2.5">
                          <Link to={`/demand/series?k=${encodeURIComponent(r.key)}`} className="text-ink-950 hover:text-monsoon-700">{SKU_BY_ID[r.sku].name}</Link>
                          <span className="block text-[11px] text-slate-500">{VED_LABEL[SKU_BY_ID[r.sku].ved]}</span>
                        </td>
                        <td className="px-3 py-2.5 text-slate-600">{LOC_BY_ID[r.loc].name}</td>
                        <td className="num px-3 py-2.5 text-right">{units(r.onHand)}</td>
                        <td className="num px-3 py-2.5 text-right">{units(r.inbound)}</td>
                        <td className="num px-3 py-2.5 text-right">{units(r.dAvg)}</td>
                        <td className="num px-3 py-2.5 text-right">{r.coverWeeks > 52 ? '52+' : r.coverWeeks.toFixed(1)} wk</td>
                        <td className="num px-3 py-2.5 text-right">{r.nearestExpiry == null ? '—' : `${r.nearestExpiry} wk`}</td>
                        <td className="num px-3 py-2.5 text-right">{inr(r.stockValue)}</td>
                        <td className="px-4 py-2.5"><StatusPill status={r.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
              {filtered.length === 0 && <p className="panel p-8 text-center text-slate-500">No lines match this filter.</p>}
            </>
          )}
        </div>
      )}
    </EngineGate>
  );
}
