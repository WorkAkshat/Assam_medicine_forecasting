import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Check } from 'lucide-react';
import { useEngine } from '../hooks/useEngine';
import { useToast } from '../hooks/useToast';
import { usePersistentState } from '../hooks/usePersistentState';
import { EngineGate, PageHeader, SKU_BY_ID, LOC_BY_ID, VED_LABEL, inr, pct, units, StatusPill, downloadCsv, useScope, Segmented, SampleDataNote } from '../components/engine/ui';
import { LOCATIONS, STATES } from '../engine/catalog';

const PRIORITY = { critical: 0, watch: 1, healthy: 2, excess: 3 };

export default function Replenishment() {
  const { data } = useEngine();
  const { toast } = useToast();
  const { depot: scopedDepot, rows: scoped } = useScope();
  const [stateFilter, setStateFilter] = useState('all');
  const [depot, setDepot] = useState('all');
  const [urgency, setUrgency] = useState('all');
  const [edits, setEdits] = useState({});
  const [picked, setPicked] = useState(() => new Set());
  const [approved, setApproved] = usePersistentState('grd_approved_orders', {});

  const rows = useMemo(
    () =>
      scoped
        .filter((r) => r.order > 0)
        .filter((r) => stateFilter === 'all' || LOC_BY_ID[r.loc].state === stateFilter)
        .filter((r) => depot === 'all' || r.loc === depot)
        .filter((r) => urgency === 'all' || (urgency === 'urgent' ? r.status === 'critical' : r.status !== 'critical'))
        .sort((a, b) => PRIORITY[a.status] - PRIORITY[b.status] || b.pStockout - a.pStockout || b.orderValue - a.orderValue),
    [scoped, stateFilter, depot, urgency],
  );

  const weekKey = data?.asOf.slice(0, 10);
  const isApproved = (key) => approved[`${weekKey}:${key}`];
  const qtyOf = (r) => edits[r.key] ?? r.order;
  const totalValue = rows.reduce((a, r) => a + qtyOf(r) * SKU_BY_ID[r.sku].price, 0);
  const pending = rows.filter((r) => !isApproved(r.key));

  const approve = (keys) => {
    if (!keys.length) return;
    setApproved((prev) => {
      const next = { ...prev };
      keys.forEach((k) => {
        const r = rows.find((x) => x.key === k);
        if (r) next[`${weekKey}:${k}`] = { qty: qtyOf(r), at: new Date().toISOString() };
      });
      return next;
    });
    setPicked(new Set());
    toast.success(`${keys.length} order${keys.length > 1 ? 's' : ''} approved`);
  };

  const exportPlan = () =>
    downloadCsv(
      `replenishment-plan-${weekKey}.csv`,
      rows.map((r) => ({
        week: weekKey,
        sku_code: r.sku,
        medicine: SKU_BY_ID[r.sku].name,
        depot_code: r.loc,
        depot: LOC_BY_ID[r.loc].name,
        priority: r.status,
        on_hand: Math.round(r.onHand),
        inbound: Math.round(r.inbound),
        forecast_next_4_weeks: Math.round(r.next4),
        safety_stock: Math.round(r.ss),
        reorder_point: Math.round(r.rop),
        order_up_to: Math.round(r.S),
        suggested_qty: r.order,
        planned_qty: qtyOf(r),
        value_inr: Math.round(qtyOf(r) * SKU_BY_ID[r.sku].price),
        stockout_risk: r.pStockout.toFixed(3),
        reason: r.reason,
        approved: isApproved(r.key) ? 'yes' : 'no',
      })),
    );

  const togglePick = (k) =>
    setPicked((s) => {
      const n = new Set(s);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });

  const qtyInput = (r, done, name) => (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      step={10}
      disabled={done}
      value={qtyOf(r)}
      onChange={(e) => setEdits((s) => ({ ...s, [r.key]: Math.max(0, Number(e.target.value) || 0) }))}
      className={`num w-24 rounded-md border px-2 py-1 text-right ${edits[r.key] != null && edits[r.key] !== r.order ? 'border-muga-400 bg-muga-50' : 'border-mist-300'} disabled:border-transparent disabled:bg-transparent`}
      aria-label={`Order quantity for ${name}`}
    />
  );

  return (
    <EngineGate>
      <div className="space-y-5">
        <PageHeader
          title="Replenishment"
          sub="This week’s suggested orders from the Rani hub, sized from the forecast, each depot’s real lead time and how vital the medicine is. Adjust any quantity, then approve."
        >
          <button type="button" onClick={exportPlan} className="inline-flex items-center gap-1.5 rounded-md border border-mist-300 bg-white px-3 py-1.5 text-sm text-ink-900 hover:bg-mist-50">
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button
            type="button"
            disabled={!pending.length}
            onClick={() => approve((picked.size ? [...picked] : pending.map((r) => r.key)).filter((k) => !isApproved(k)))}
            className="inline-flex items-center gap-1.5 rounded-md bg-monsoon-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-monsoon-700 disabled:opacity-40"
          >
            <Check className="h-4 w-4" /> {picked.size ? `Approve ${picked.size} selected` : `Approve all ${pending.length}`}
          </button>
        </PageHeader>
        <SampleDataNote />

        <section className="flex flex-col gap-3 border-y border-mist-300/80 py-3 text-sm xl:flex-row xl:items-center">
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <span><span className="num text-xl text-ink-950">{rows.length}</span> <span className="text-slate-600">orders</span></span>
            <span><span className="num text-xl text-ink-950">{inr(totalValue)}</span> <span className="text-slate-600">planned value</span></span>
            <span><span className="num text-xl text-[#b63c27]">{rows.filter((r) => r.status === 'critical').length}</span> <span className="text-slate-600">prevent a likely stock-out</span></span>
          </div>
          <div className="flex flex-wrap gap-2 xl:ml-auto">
            <Segmented label="Urgency" value={urgency} onChange={setUrgency} options={[['all', 'All'], ['urgent', 'Urgent'], ['routine', 'Routine']]} />
            {!scopedDepot && (
              <>
                <select className="select" value={stateFilter} onChange={(e) => { setStateFilter(e.target.value); setDepot('all'); }} aria-label="Filter by state">
                  <option value="all">All states</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="select" value={depot} onChange={(e) => setDepot(e.target.value)} aria-label="Filter by depot">
                  <option value="all">All depots</option>
                  {LOCATIONS.filter((l) => stateFilter === 'all' || l.state === stateFilter).map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </>
            )}
          </div>
        </section>

        {/* Phone & small tablet: cards */}
        <ul className="space-y-3 md:hidden">
          {rows.map((r) => {
            const sku = SKU_BY_ID[r.sku];
            const done = isApproved(r.key);
            return (
              <li key={r.key} className={`panel p-4 ${done ? 'bg-monsoon-50/60' : ''}`}>
                <div className="flex items-start gap-3">
                  {done ? <Check className="mt-0.5 h-5 w-5 text-monsoon-600" aria-label="Approved" /> : <input type="checkbox" checked={picked.has(r.key)} onChange={() => togglePick(r.key)} className="mt-1 h-5 w-5 accent-monsoon-600" aria-label={`Select ${sku.name}`} />}
                  <div className="min-w-0 flex-1">
                    <Link to={`/demand/series?k=${encodeURIComponent(r.key)}`} className="font-medium text-ink-950">{sku.name}</Link>
                    <p className="text-[12px] text-slate-500">{LOC_BY_ID[r.loc].name} · {VED_LABEL[sku.ved]}</p>
                  </div>
                  <StatusPill status={r.status} />
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-[12px]">
                  <div><dt className="text-slate-500">On hand</dt><dd className="num text-sm text-ink-950">{units(r.onHand)}</dd></div>
                  <div><dt className="text-slate-500">Next 4 wk</dt><dd className="num text-sm text-ink-950">{units(r.next4)}</dd></div>
                  <div><dt className="text-slate-500">Risk</dt><dd className="num text-sm text-ink-950">{pct(r.pStockout, 0)}</dd></div>
                </dl>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-600">Order {qtyInput(r, done, sku.name)}</span>
                  <span className="num text-sm text-ink-950">{inr(qtyOf(r) * sku.price)}</span>
                </div>
                <p className="mt-2 text-[12px] leading-snug text-slate-500">{r.reason}</p>
              </li>
            );
          })}
        </ul>

        {/* Tablet landscape & desktop: table */}
        <section className="panel hidden overflow-hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-mist-50 text-left text-[12px] text-slate-500">
                <tr>
                  <th className="w-10 px-4 py-2.5"><span className="sr-only">Select</span></th>
                  <th className="px-2 py-2.5 font-medium">Medicine and depot</th>
                  <th className="px-3 py-2.5 text-right font-medium">On hand</th>
                  <th className="px-3 py-2.5 text-right font-medium">Next 4 wk</th>
                  <th className="px-3 py-2.5 text-right font-medium">Re-order at</th>
                  <th className="px-3 py-2.5 text-right font-medium">Risk</th>
                  <th className="px-3 py-2.5 text-right font-medium">Order qty</th>
                  <th className="px-3 py-2.5 text-right font-medium">Value</th>
                  <th className="hidden px-4 py-2.5 font-medium xl:table-cell">Why</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist-200">
                {rows.map((r) => {
                  const sku = SKU_BY_ID[r.sku];
                  const done = isApproved(r.key);
                  return (
                    <tr key={r.key} className={done ? 'bg-monsoon-50/50' : 'hover:bg-mist-50'}>
                      <td className="px-4 py-2.5">
                        {done ? <Check className="h-4 w-4 text-monsoon-600" aria-label="Approved" /> : <input type="checkbox" checked={picked.has(r.key)} onChange={() => togglePick(r.key)} aria-label={`Select ${sku.name} at ${LOC_BY_ID[r.loc].name}`} className="h-4 w-4 accent-monsoon-600" />}
                      </td>
                      <td className="px-2 py-2.5">
                        <Link to={`/demand/series?k=${encodeURIComponent(r.key)}`} className="font-medium text-ink-950 hover:text-monsoon-700">{sku.name}</Link>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
                          <span>{LOC_BY_ID[r.loc].name}</span>
                          <span>{VED_LABEL[sku.ved]}</span>
                          <StatusPill status={r.status} />
                        </div>
                      </td>
                      <td className="num px-3 py-2.5 text-right">{units(r.onHand)}<span className="block text-[11px] text-slate-400">{r.coverWeeks.toFixed(1)} wk</span></td>
                      <td className="num px-3 py-2.5 text-right">{units(r.next4)}</td>
                      <td className="num px-3 py-2.5 text-right">{units(r.rop)}</td>
                      <td className="num px-3 py-2.5 text-right">{pct(r.pStockout, 0)}</td>
                      <td className="px-3 py-2.5 text-right">{qtyInput(r, done, sku.name)}</td>
                      <td className="num px-3 py-2.5 text-right">{inr(qtyOf(r) * sku.price)}</td>
                      <td className="hidden max-w-[280px] px-4 py-2.5 text-[12px] leading-snug text-slate-600 xl:table-cell">{r.reason}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
        {rows.length === 0 && <p className="panel px-4 py-10 text-center text-slate-500">No orders are needed for this selection this week.</p>}
      </div>
    </EngineGate>
  );
}
