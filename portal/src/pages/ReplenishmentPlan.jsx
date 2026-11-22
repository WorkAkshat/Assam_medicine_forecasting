import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check } from 'lucide-react';
import { useEngine } from '../hooks/useEngine';
import { useToast } from '../hooks/useToast';
import { usePersistentState } from '../hooks/usePersistentState';
import { EngineGate, PageHeader, SKU_BY_ID, LOC_BY_ID, VED_LABEL, inr, pct, units, StatusPill, downloadCsv } from '../components/engine/ui';
import { LOCATIONS } from '../engine/catalog';

const PRIORITY = { critical: 0, watch: 1, excess: 3, healthy: 2 };

export default function ReplenishmentPlan() {
  const { data } = useEngine();
  const { toast } = useToast();
  const [depot, setDepot] = useState('all');
  const [scope, setScope] = useState('pilot');
  const [edits, setEdits] = useState({});
  const [picked, setPicked] = useState(() => new Set());
  const [approved, setApproved] = usePersistentState('grd_engine_approved_orders', {});

  const rows = useMemo(() => {
    if (!data) return [];
    return data.rows
      .filter((r) => r.order > 0)
      .filter((r) => depot === 'all' || r.loc === depot)
      .filter((r) => scope === 'all' || LOC_BY_ID[r.loc].pilot)
      .sort((a, b) => PRIORITY[a.status] - PRIORITY[b.status] || b.pStockout - a.pStockout || b.orderValue - a.orderValue);
  }, [data, depot, scope]);

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
        next[`${weekKey}:${k}`] = { qty: qtyOf(r), at: new Date().toISOString() };
      });
      return next;
    });
    setPicked(new Set());
    toast.success(`${keys.length} order${keys.length > 1 ? 's' : ''} approved and queued for dispatch from Rani`);
  };

  const exportPlan = () =>
    downloadCsv(
      `replenishment-plan-${weekKey}.csv`,
      rows.map((r) => ({
        medicine: SKU_BY_ID[r.sku].name,
        depot: LOC_BY_ID[r.loc].name,
        status: r.status,
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

  return (
    <EngineGate>
      <div className="space-y-6">
        <PageHeader
          title="Replenishment plan"
          sub="Suggested orders for this week, sized from the forecast, each depot’s lead time and how vital the medicine is. Adjust any quantity, then approve."
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

        <section className="flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-mist-300/80 py-3 text-sm">
          <div>
            <span className="num text-xl text-ink-950">{rows.length}</span> <span className="text-slate-600">orders</span>
          </div>
          <div>
            <span className="num text-xl text-ink-950">{inr(totalValue)}</span> <span className="text-slate-600">planned value</span>
          </div>
          <div>
            <span className="num text-xl text-[#b63c27]">{rows.filter((r) => r.status === 'critical').length}</span> <span className="text-slate-600">prevent a likely stock-out</span>
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            <div className="inline-flex rounded-md border border-mist-300 bg-white p-0.5 text-sm" role="radiogroup" aria-label="Depot scope">
              {[['pilot', 'Assam pilot'], ['all', 'All NE depots']].map(([v, l]) => (
                <button key={v} type="button" role="radio" aria-checked={scope === v} onClick={() => setScope(v)} className={`rounded px-2.5 py-1 ${scope === v ? 'bg-ink-900 text-white' : 'text-slate-600 hover:text-ink-900'}`}>
                  {l}
                </button>
              ))}
            </div>
            <select className="select" value={depot} onChange={(e) => setDepot(e.target.value)} aria-label="Filter by depot">
              <option value="all">Every depot</option>
              {LOCATIONS.filter((l) => scope === 'all' || l.pilot).map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-mist-50 text-left text-[12px] text-slate-500">
                <tr>
                  <th className="w-10 px-4 py-2.5" aria-label="Select" />
                  <th className="px-2 py-2.5 font-medium">Medicine and depot</th>
                  <th className="px-3 py-2.5 text-right font-medium">On hand</th>
                  <th className="px-3 py-2.5 text-right font-medium">Next 4 wk</th>
                  <th className="px-3 py-2.5 text-right font-medium">Re-order at</th>
                  <th className="px-3 py-2.5 text-right font-medium">Risk</th>
                  <th className="px-3 py-2.5 text-right font-medium">Order qty</th>
                  <th className="px-3 py-2.5 text-right font-medium">Value</th>
                  <th className="px-4 py-2.5 font-medium">Why</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist-200">
                <AnimatePresence initial={false}>
                  {rows.map((r) => {
                    const sku = SKU_BY_ID[r.sku];
                    const done = isApproved(r.key);
                    return (
                      <motion.tr key={r.key} layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={done ? 'bg-monsoon-50/50' : 'hover:bg-mist-50'}>
                        <td className="px-4 py-2.5">
                          {done ? (
                            <Check className="h-4 w-4 text-monsoon-600" aria-label="Approved" />
                          ) : (
                            <input type="checkbox" checked={picked.has(r.key)} onChange={() => togglePick(r.key)} aria-label={`Select ${sku.name} at ${LOC_BY_ID[r.loc].name}`} className="h-4 w-4 accent-monsoon-600" />
                          )}
                        </td>
                        <td className="px-2 py-2.5">
                          <Link to={`/demand-forecasting?k=${encodeURIComponent(r.key)}`} className="font-medium text-ink-950 hover:text-monsoon-700">{sku.name}</Link>
                          <div className="mt-0.5 flex items-center gap-2 text-[12px] text-slate-500">
                            <span>{LOC_BY_ID[r.loc].name}</span>
                            <span>{VED_LABEL[sku.ved]}</span>
                            <StatusPill status={r.status} />
                          </div>
                        </td>
                        <td className="num px-3 py-2.5 text-right">{units(r.onHand)}<span className="block text-[11px] text-slate-400">{r.coverWeeks.toFixed(1)} wk</span></td>
                        <td className="num px-3 py-2.5 text-right">{units(r.next4)}</td>
                        <td className="num px-3 py-2.5 text-right">{units(r.rop)}</td>
                        <td className="num px-3 py-2.5 text-right">{pct(r.pStockout, 0)}</td>
                        <td className="px-3 py-2.5 text-right">
                          <input
                            type="number"
                            min={0}
                            step={10}
                            disabled={done}
                            value={qtyOf(r)}
                            onChange={(e) => setEdits((s) => ({ ...s, [r.key]: Math.max(0, Number(e.target.value) || 0) }))}
                            className={`num w-24 rounded-md border px-2 py-1 text-right ${edits[r.key] != null && edits[r.key] !== r.order ? 'border-muga-400 bg-muga-50' : 'border-mist-300'} disabled:bg-transparent disabled:border-transparent`}
                            aria-label={`Order quantity for ${sku.name}`}
                          />
                        </td>
                        <td className="num px-3 py-2.5 text-right">{inr(qtyOf(r) * sku.price)}</td>
                        <td className="max-w-[280px] px-4 py-2.5 text-[12px] leading-snug text-slate-600">{r.reason}</td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-slate-500">No orders are needed for this selection this week.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </EngineGate>
  );
}
