import React from 'react';
import { Link } from 'react-router-dom';
import { useEngine } from '../hooks/useEngine';
import { EngineGate, PageHeader, inr, pct, SampleDataNote } from '../components/engine/ui';
import { HUB } from '../engine/catalog';

function Reliability({ days, sd }) {
  const cv = sd / Math.max(0.5, days);
  const label = cv > 0.38 ? 'Unreliable' : cv > 0.25 ? 'Variable' : 'Reliable';
  const tone = cv > 0.38 ? 'text-[#b63c27]' : cv > 0.25 ? 'text-muga-700' : 'text-monsoon-700';
  return <span className={tone}>{label}</span>;
}

export default function Network() {
  const { data } = useEngine();
  return (
    <EngineGate>
      {data && (
        <div className="space-y-5">
          <PageHeader title="Depots & routes" sub={`Every depot served from the ${HUB.name}, with the delivery time and reliability the safety stock is sized for. Lead times stretch in monsoon and with highway disruptions.`} />
          <SampleDataNote />
          <ul className="grid gap-3 sm:grid-cols-2 md:hidden">
            {data.locations.map((l) => (
              <li key={l.id} className="panel p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-ink-950">{l.name}</p>
                    <p className="text-[12px] text-slate-500">{l.state} · {l.route}</p>
                  </div>
                  <span className="num text-xl text-ink-950">{l.health}</span>
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-[12px]">
                  <div><dt className="text-slate-500">Lead time</dt><dd className="num text-sm">{l.leadDays.toFixed(1)} ± {l.leadSdDays.toFixed(1)} d</dd></div>
                  <div><dt className="text-slate-500">Distance</dt><dd className="num text-sm">{l.km} km</dd></div>
                  <div><dt className="text-slate-500">Stock</dt><dd className="num text-sm">{inr(l.stockValue)}</dd></div>
                </dl>
                <p className="mt-2 text-[12px]"><Reliability days={l.leadDays} sd={l.leadSdDays} /> · {l.critical} at risk · forecast error {pct(l.wape, 0)}</p>
              </li>
            ))}
          </ul>
          <section className="panel hidden overflow-x-auto md:block">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="bg-mist-50 text-left text-[12px] text-slate-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Depot</th>
                  <th className="px-3 py-2.5 font-medium">Route</th>
                  <th className="px-3 py-2.5 text-right font-medium">Distance</th>
                  <th className="px-3 py-2.5 text-right font-medium">Lead time</th>
                  <th className="px-3 py-2.5 font-medium">Delivery</th>
                  <th className="px-3 py-2.5 text-right font-medium">Stock</th>
                  <th className="px-3 py-2.5 text-right font-medium">At risk</th>
                  <th className="px-3 py-2.5 text-right font-medium">Forecast error</th>
                  <th className="px-4 py-2.5 text-right font-medium">Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist-200">
                {data.locations.map((l) => (
                  <tr key={l.id} className="hover:bg-mist-50">
                    <td className="px-4 py-2.5"><span className="text-ink-950">{l.name}</span><span className="block text-[11px] text-slate-500">{l.state}</span></td>
                    <td className="px-3 py-2.5 text-slate-600">{l.route}</td>
                    <td className="num px-3 py-2.5 text-right">{l.km} km</td>
                    <td className="num px-3 py-2.5 text-right">{l.leadDays.toFixed(1)} ± {l.leadSdDays.toFixed(1)} d</td>
                    <td className="px-3 py-2.5"><Reliability days={l.leadDays} sd={l.leadSdDays} /></td>
                    <td className="num px-3 py-2.5 text-right">{inr(l.stockValue)}</td>
                    <td className="num px-3 py-2.5 text-right">{l.critical + l.watch}</td>
                    <td className="num px-3 py-2.5 text-right">{pct(l.wape, 0)}</td>
                    <td className="num px-4 py-2.5 text-right">{l.health}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <p className="text-sm text-slate-600">See the same network on the <Link to="/" className="text-monsoon-700 underline">3D overview</Link>.</p>
        </div>
      )}
    </EngineGate>
  );
}
