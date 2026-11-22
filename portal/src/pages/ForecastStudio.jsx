import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ComposedChart, Area, Line, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, LineChart } from 'recharts';
import { useEngine } from '../hooks/useEngine';
import { EngineGate, PageHeader, SKU_BY_ID, LOC_BY_ID, VED_LABEL, inr, pct, units, weekLabel, StatusPill } from '../components/engine/ui';
import { SKUS, LOCATIONS, SIGNAL_LABELS } from '../engine/catalog';

const tooltipStyle = { borderRadius: 8, border: '1px solid #CBD8D5', fontSize: 12, boxShadow: '0 8px 24px -12px rgba(8,24,32,.3)' };

function ForecastChart({ detail }) {
  const rows = useMemo(() => {
    const bt = new Map(detail.backtestPoints.map((p) => [p.w, p]));
    const hist = detail.history.map((h) => ({ date: h.date, actual: h.actual, tested: bt.get(h.w)?.ens }));
    const last = detail.history[detail.history.length - 1];
    const joint = { date: last.date, actual: last.actual, ensemble: last.actual, band: [last.actual, last.actual] };
    hist[hist.length - 1] = { ...hist[hist.length - 1], ...joint };
    const fut = detail.forecast.map((f) => ({ date: f.date, ensemble: f.ensemble, band: [f.p10, f.p90], manual: f.manual }));
    return [...hist.slice(-52), ...fut];
  }, [detail]);
  const today = detail.forecast[0].date;
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={rows} margin={{ top: 10, right: 12, bottom: 0, left: -8 }}>
        <CartesianGrid stroke="#E1E9E7" vertical={false} />
        <XAxis dataKey="date" tickFormatter={weekLabel} tick={{ fontSize: 11, fill: '#548293' }} minTickGap={36} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#548293' }} axisLine={false} tickLine={false} width={52} tickFormatter={(v) => units(v)} />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(d) => `Week of ${weekLabel(d)}`}
          formatter={(v, name) => [Array.isArray(v) ? `${units(v[0])} – ${units(v[1])}` : units(v), name]}
        />
        <ReferenceLine x={today} stroke="#C08427" strokeDasharray="3 3" label={{ value: 'today', position: 'insideTopLeft', fontSize: 11, fill: '#82501C' }} />
        <Area dataKey="band" name="80% range" stroke="none" fill="#D29C36" fillOpacity={0.18} isAnimationActive animationDuration={600} />
        <Line dataKey="actual" name="Actual sales" stroke="#15303B" strokeWidth={1.6} dot={false} isAnimationActive={false} />
        <Scatter dataKey="tested" name="Back-tested forecast" fill="#0E7570" shape="circle" isAnimationActive={false} />
        <Line dataKey="manual" name="Manual rule" stroke="#7FA5B3" strokeDasharray="4 4" dot={false} strokeWidth={1.4} />
        <Line dataKey="ensemble" name="AI forecast" stroke="#A3691F" strokeWidth={2.4} dot={false} animationDuration={700} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function SignalsChart({ detail }) {
  if (!detail.relevantSignals.length) return <p className="text-sm text-slate-500">This medicine sells steadily; no seasonal or outbreak signal drives it.</p>;
  const colors = ['#0E7570', '#A3691F', '#3f55b8', '#b63c27'];
  return (
    <ResponsiveContainer width="100%" height={150}>
      <LineChart data={detail.signals.slice(-64)} margin={{ top: 6, right: 8, bottom: 0, left: -30 }}>
        <XAxis dataKey="date" tickFormatter={weekLabel} tick={{ fontSize: 10, fill: '#548293' }} minTickGap={40} axisLine={false} tickLine={false} />
        <YAxis tick={false} axisLine={false} width={30} />
        <ReferenceLine x={detail.forecast[0].date} stroke="#C08427" strokeDasharray="3 3" />
        <Tooltip contentStyle={tooltipStyle} labelFormatter={(d) => weekLabel(d)} formatter={(v, n) => [v.toFixed(2), SIGNAL_LABELS[n] || n]} />
        {detail.relevantSignals.map((s, i) => (
          <Line key={s} dataKey={s} stroke={colors[i % colors.length]} dot={false} strokeWidth={1.5} isAnimationActive={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function ForecastStudio() {
  const { data, getSeries } = useEngine();
  const [params, setParams] = useSearchParams();
  const defaultKey = useMemo(() => {
    if (!data) return null;
    return [...data.rows].sort((a, b) => b.pStockout - a.pStockout)[0]?.key;
  }, [data]);
  const key = params.get('k') || defaultKey;
  const [skuId, locId] = (key || '@').split('@');
  const [detail, setDetail] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!key || !data) return undefined;
    let live = true;
    setErr(null);
    getSeries(key).then(
      (d) => live && setDetail(d),
      (e) => live && setErr(e),
    );
    return () => {
      live = false;
    };
  }, [key, data, getSeries]);

  const setKey = (s, l) => setParams({ k: `${s}@${l}` }, { replace: true });
  const sku = SKU_BY_ID[skuId];
  const loc = LOC_BY_ID[locId];

  return (
    <EngineGate>
      <div className="space-y-6">
        <PageHeader
          title="Forecast studio"
          sub="Weekly demand for one medicine at one depot: history, the AI forecast with its likely range, how each model scored on recent weeks, and what is driving the outlook."
        >
          <label className="text-sm">
            <span className="sr-only">Medicine</span>
            <select className="select" value={skuId} onChange={(e) => setKey(e.target.value, locId)}>
              {SKUS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="sr-only">Depot</span>
            <select className="select" value={locId} onChange={(e) => setKey(skuId, e.target.value)}>
              {LOCATIONS.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </label>
        </PageHeader>

        {err && <div className="panel p-4 text-sm text-[#9b321f]">Could not load this series: {String(err.message).split('\n')[0]}</div>}

        {detail && detail.key === key && sku && loc && (
          <>
            <section className="panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="kicker">{sku.form} · {VED_LABEL[sku.ved]} · {loc.name}, {loc.state}</p>
                  <h2 className="font-display text-xl text-ink-950">{sku.name}</h2>
                </div>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div>
                    <p className="kicker">Next 4 weeks</p>
                    <p className="num text-xl text-ink-950">{units(detail.row.next4)} {sku.unit}s</p>
                  </div>
                  <div>
                    <p className="kicker">Forecast error</p>
                    <p className="num text-xl text-ink-950">
                      {pct(detail.row.wape, 0)} <span className="text-sm text-slate-500">manual {pct(detail.row.wapeManual, 0)}</span>
                    </p>
                  </div>
                  <div>
                    <p className="kicker">Status</p>
                    <div className="mt-1"><StatusPill status={detail.row.status} /></div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <ForecastChart detail={detail} />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-slate-500">
                <span><i className="mr-1.5 inline-block h-0.5 w-4 bg-ink-800 align-middle" />Actual sales</span>
                <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-monsoon-600 align-middle" />What the engine forecast for past weeks</span>
                <span><i className="mr-1.5 inline-block h-0.5 w-4 bg-muga-600 align-middle" />AI forecast</span>
                <span><i className="mr-1.5 inline-block h-2.5 w-4 bg-muga-400/30 align-middle" />80% likely range</span>
                <span><i className="mr-1.5 inline-block h-0.5 w-4 border-t border-dashed border-ink-300 align-middle" />Today’s manual rule</span>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-3">
              <section className="panel p-5">
                <h3 className="font-display text-base text-ink-950">Why the forecast moves</h3>
                <p className="mt-0.5 text-[12px] text-slate-500">Average effect over the next 12 weeks versus a typical week</p>
                <ul className="mt-4 space-y-2.5">
                  {(detail.row.drivers || []).map((d) => {
                    const w = Math.min(100, Math.abs(d.effect) * 200);
                    return (
                      <li key={d.id}>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-700">{SIGNAL_LABELS[d.id] || d.id}</span>
                          <span className={`num ${d.effect > 0 ? 'text-muga-700' : 'text-monsoon-700'}`}>{d.effect > 0 ? '+' : ''}{Math.round(d.effect * 100)}%</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-mist-200">
                          <div className={`h-full rounded-full ${d.effect > 0 ? 'bg-muga-400' : 'bg-monsoon-400'}`} style={{ width: `${w}%` }} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-5">
                  <p className="kicker mb-1">Signals for this depot (past actual, future expected)</p>
                  <SignalsChart detail={detail} />
                </div>
              </section>

              <section className="panel p-5">
                <h3 className="font-display text-base text-ink-950">Model scoreboard</h3>
                <p className="mt-0.5 text-[12px] text-slate-500">Error on the last 7 four-week windows (lower is better)</p>
                <table className="mt-3 w-full text-sm">
                  <tbody className="divide-y divide-mist-200">
                    {[...detail.models].sort((a, b) => a.wape - b.wape).map((m) => (
                      <tr key={m.id} className={m.id === 'ensemble' ? 'font-medium text-ink-950' : 'text-slate-700'}>
                        <td className="py-2">{m.name}</td>
                        <td className="num py-2 text-right">{pct(m.wape, 0)}</td>
                        <td className="w-24 py-2 pl-3">
                          {m.id !== 'manual' && m.id !== 'ensemble' && (
                            <div className="h-1.5 rounded-full bg-mist-200" title={`Ensemble weight ${pct(m.weight, 0)}`}>
                              <div className="h-full rounded-full bg-monsoon-500" style={{ width: `${m.weight * 100}%` }} />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-3 text-[12px] leading-relaxed text-slate-500">Bars show each model’s share of the ensemble. Weights shift toward whichever model has been most accurate for this depot.</p>
              </section>

              <section className="panel p-5">
                <h3 className="font-display text-base text-ink-950">Replenishment maths</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  {[
                    ['Average weekly demand ahead', `${units(detail.policy.dAvg)} ${sku.unit}s`],
                    ['Lead time incl. review', `${detail.policy.cover.toFixed(1)} weeks`],
                    ['Safety stock', units(detail.policy.ss)],
                    ['Re-order point', units(detail.policy.rop)],
                    ['Order-up-to level', units(detail.policy.S)],
                    ['On hand + inbound', `${units(detail.row.onHand)} + ${units(detail.row.inbound)}`],
                    ['Stock-out risk before next delivery', pct(detail.row.pStockout, 0)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3">
                      <dt className="text-slate-600">{k}</dt>
                      <dd className="num text-ink-950">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-4 rounded-md bg-mist-100 p-3">
                  <p className="text-sm text-ink-950">
                    {detail.row.order > 0 ? (
                      <>Order <span className="num font-semibold">{units(detail.row.order)}</span> {sku.unit}s ({inr(detail.row.orderValue)}) this week.</>
                    ) : (
                      <>No order needed this week.</>
                    )}
                  </p>
                  <p className="mt-1 text-[12px] text-slate-500">{detail.row.reason}</p>
                </div>
                {detail.batches.length > 0 && (
                  <div className="mt-4">
                    <p className="kicker mb-1">Batches on hand (first expiry first)</p>
                    <ul className="space-y-1 text-sm">
                      {[...detail.batches].sort((a, b) => a.exp - b.exp).map((b, i) => (
                        <li key={i} className="flex justify-between">
                          <span className="text-slate-600">expires in {b.weeksLeft} wk</span>
                          <span className="num">{units(b.q)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <Link to="/smart-replenishment" className="mt-4 inline-block text-sm text-monsoon-700 hover:underline">See all orders for this week</Link>
              </section>
            </div>
          </>
        )}
        {!detail && !err && <div className="panel h-[420px] animate-pulse" />}
      </div>
    </EngineGate>
  );
}
