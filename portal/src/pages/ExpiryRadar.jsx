import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useEngine } from '../hooks/useEngine';
import { useToast } from '../hooks/useToast';
import { usePersistentState } from '../hooks/usePersistentState';
import { EngineGate, PageHeader, SKU_BY_ID, LOC_BY_ID, inr, units } from '../components/engine/ui';

function urgency(weeks) {
  if (weeks == null) return 'text-slate-500';
  if (weeks <= 8) return 'text-[#b63c27]';
  if (weeks <= 16) return 'text-muga-700';
  return 'text-slate-600';
}

export default function ExpiryRadar() {
  const { data } = useEngine();
  const { toast } = useToast();
  const [done, setDone] = usePersistentState('grd_engine_transfers_done', {});
  const weekKey = data?.asOf.slice(0, 10);

  const risky = useMemo(
    () =>
      data
        ? data.rows
            .filter((r) => r.atRiskValue + r.excessValue > 0)
            .sort((a, b) => b.atRiskValue + b.excessValue - (a.atRiskValue + a.excessValue))
        : [],
    [data],
  );

  const tkey = (t) => `${weekKey}:${t.sku}:${t.from}:${t.to}:${t.q}`;
  const confirm = (t) => {
    setDone((p) => ({ ...p, [tkey(t)]: new Date().toISOString() }));
    toast.success(`Transfer booked: ${units(t.q)} ${SKU_BY_ID[t.sku].unit}s ${LOC_BY_ID[t.from].name} → ${LOC_BY_ID[t.to].name}`);
  };
  const rescued = data ? data.transfers.reduce((a, t) => a + t.value, 0) : 0;

  return (
    <EngineGate>
      {data && (
        <div className="space-y-6">
          <PageHeader
            title="Expiry and surplus"
            sub="Stock that will not sell before it expires, or that sits far above what its depot needs, with depot-to-depot transfers that move it to where it will sell in time."
          />

          <section className="grid gap-4 sm:grid-cols-3">
            <div className="panel p-5">
              <p className="kicker">Value that would expire unsold</p>
              <p className="num mt-1 text-2xl text-ink-950">{inr(data.totals.atRiskValue)}</p>
              <p className="mt-1 text-[12px] text-slate-500">at today’s forecast, consuming first-expiry-first</p>
            </div>
            <div className="panel p-5">
              <p className="kicker">Surplus above 12 weeks of need</p>
              <p className="num mt-1 text-2xl text-ink-950">{inr(data.totals.excessValue)}</p>
              <p className="mt-1 text-[12px] text-slate-500">working capital tied up across {data.totals.excess} lines</p>
            </div>
            <div className="panel p-5">
              <p className="kicker">Recoverable through transfers</p>
              <p className="num mt-1 text-2xl text-monsoon-700">{inr(rescued)}</p>
              <p className="mt-1 text-[12px] text-slate-500">{data.transfers.length} suggested moves this week</p>
            </div>
          </section>

          <section className="panel overflow-hidden">
            <div className="px-5 py-4">
              <h2 className="font-display text-lg text-ink-950">Suggested transfers</h2>
              <p className="text-[12px] text-slate-500">Each move sends the soonest-expiring batches, and only as much as the receiving depot can sell before expiry.</p>
            </div>
            <ul className="divide-y divide-mist-200">
              {data.transfers.map((t) => {
                const booked = done[tkey(t)];
                return (
                  <li key={tkey(t)} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 text-sm">
                    <div className="min-w-[220px] flex-1">
                      <p className="font-medium text-ink-950">{SKU_BY_ID[t.sku].name}</p>
                      <p className="flex items-center gap-1.5 text-[12px] text-slate-600">
                        {LOC_BY_ID[t.from].name} <ArrowRight className="h-3 w-3" /> {LOC_BY_ID[t.to].name} · {t.km} km by road
                      </p>
                    </div>
                    <div className="num w-24 text-right">{units(t.q)}</div>
                    <div className="num w-20 text-right">{inr(t.value)}</div>
                    <div className={`w-32 text-right text-[12px] ${urgency(t.expiresInWeeks)}`}>expires in {t.expiresInWeeks} wk</div>
                    <div className="w-28 text-right">
                      {booked ? (
                        <span className="inline-flex items-center gap-1 text-monsoon-700"><Check className="h-4 w-4" /> Booked</span>
                      ) : (
                        <button type="button" onClick={() => confirm(t)} className="rounded-md border border-monsoon-600 px-2.5 py-1 text-monsoon-700 hover:bg-monsoon-50">
                          Book transfer
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
              {data.transfers.length === 0 && <li className="px-5 py-8 text-center text-slate-500">No depot holds stock that another depot can use before it expires.</li>}
            </ul>
          </section>

          <section className="panel overflow-hidden">
            <div className="px-5 py-4">
              <h2 className="font-display text-lg text-ink-950">Lines at risk</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-mist-50 text-left text-[12px] text-slate-500">
                  <tr>
                    <th className="px-5 py-2 font-medium">Medicine</th>
                    <th className="px-3 py-2 font-medium">Depot</th>
                    <th className="px-3 py-2 text-right font-medium">On hand</th>
                    <th className="px-3 py-2 text-right font-medium">Weeks of cover</th>
                    <th className="px-3 py-2 text-right font-medium">Nearest expiry</th>
                    <th className="px-3 py-2 text-right font-medium">Won’t sell in time</th>
                    <th className="px-5 py-2 text-right font-medium">Surplus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist-200">
                  {risky.slice(0, 30).map((r) => (
                    <tr key={r.key} className="hover:bg-mist-50">
                      <td className="px-5 py-2.5">
                        <Link className="text-ink-900 hover:text-monsoon-700" to={`/demand-forecasting?k=${encodeURIComponent(r.key)}`}>{SKU_BY_ID[r.sku].name}</Link>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">{LOC_BY_ID[r.loc].name}</td>
                      <td className="num px-3 py-2.5 text-right">{units(r.onHand)}</td>
                      <td className="num px-3 py-2.5 text-right">{r.coverWeeks > 98 ? '—' : r.coverWeeks.toFixed(1)}</td>
                      <td className={`num px-3 py-2.5 text-right ${urgency(r.nearestExpiry)}`}>{r.nearestExpiry == null ? '—' : `${r.nearestExpiry} wk`}</td>
                      <td className="num px-3 py-2.5 text-right">{inr(r.atRiskValue)}</td>
                      <td className="num px-5 py-2.5 text-right">{inr(r.excessValue)}</td>
                    </tr>
                  ))}
                  {risky.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-slate-500">Nothing is at risk of expiring this cycle.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </EngineGate>
  );
}
