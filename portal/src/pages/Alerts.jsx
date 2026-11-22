import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Hourglass, TrendingUp, Truck, Archive, Check } from 'lucide-react';
import { useEngine } from '../hooks/useEngine';
import { usePersistentState } from '../hooks/usePersistentState';
import { EngineGate, PageHeader, Segmented, useScope, SampleDataNote, LOC_BY_ID } from '../components/engine/ui';

const TYPES = {
  stockout: { label: 'Stock-out risk', icon: AlertTriangle, tone: 'text-[#b63c27] bg-[#fdece8]', to: '/replenishment' },
  expiry: { label: 'Expiry', icon: Hourglass, tone: 'text-muga-800 bg-muga-50', to: '/expiry' },
  surge: { label: 'Demand rising', icon: TrendingUp, tone: 'text-monsoon-800 bg-monsoon-50', to: null },
  excess: { label: 'Excess stock', icon: Archive, tone: 'text-[#34479a] bg-[#eef1fd]', to: '/expiry' },
  transport: { label: 'Delivery risk', icon: Truck, tone: 'text-ink-700 bg-mist-200', to: '/network' },
};
const SEV = { high: 'Act today', medium: 'This week', low: 'Watch' };

export default function Alerts() {
  const { data } = useEngine();
  const { inScope } = useScope();
  const [type, setType] = useState('all');
  const [showDone, setShowDone] = useState(false);
  const [done, setDone] = usePersistentState('grd_alerts_done', {});
  const week = data?.asOf.slice(0, 10);

  const list = useMemo(() => (data ? data.alerts.filter((a) => inScope(a)) : []), [data, inScope]);
  const counts = useMemo(() => Object.fromEntries(Object.keys(TYPES).map((t) => [t, list.filter((a) => a.type === t).length])), [list]);
  const shown = list.filter((a) => (type === 'all' || a.type === type) && (showDone || !done[`${week}:${a.id}`]));

  return (
    <EngineGate>
      {data && (
        <div className="space-y-5">
          <PageHeader title="Alerts" sub="What needs a decision now, raised from this week’s forecast, stock positions, batch expiry dates and delivery reliability." />
          <SampleDataNote />
          <div className="flex flex-wrap items-center gap-2">
            <Segmented
              label="Alert type"
              value={type}
              onChange={setType}
              options={[['all', `All ${list.length}`], ...Object.entries(TYPES).filter(([t]) => counts[t]).map(([t, m]) => [t, `${m.label} ${counts[t]}`])]}
            />
            <label className="ml-auto flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} className="h-4 w-4 accent-monsoon-600" />
              Show handled
            </label>
          </div>
          <ul className="space-y-2.5">
            {shown.slice(0, 120).map((a) => {
              const m = TYPES[a.type];
              const Icon = m.icon;
              const isDone = done[`${week}:${a.id}`];
              const target = a.key ? `/demand/series?k=${encodeURIComponent(a.key)}` : m.to;
              return (
                <li key={a.id} className={`panel flex gap-3 p-4 ${isDone ? 'opacity-60' : ''}`}>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${m.tone}`}><Icon className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-slate-500">
                      <span className={a.severity === 'high' ? 'font-medium text-[#b63c27]' : ''}>{SEV[a.severity]}</span>
                      <span>{m.label}</span>
                      {a.loc && <span>{LOC_BY_ID[a.loc]?.name}</span>}
                    </div>
                    <p className="mt-0.5 font-medium text-ink-950">{a.title}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{a.detail}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm">
                      {target && <Link to={target} className="text-monsoon-700 hover:underline">Open</Link>}
                      {a.type === 'stockout' && <Link to="/replenishment" className="text-monsoon-700 hover:underline">Go to order</Link>}
                      <button type="button" onClick={() => setDone((p) => ({ ...p, [`${week}:${a.id}`]: !isDone }))} className="inline-flex items-center gap-1 text-slate-600 hover:text-ink-950">
                        <Check className="h-4 w-4" /> {isDone ? 'Reopen' : 'Mark handled'}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
            {shown.length === 0 && <li className="panel p-8 text-center text-slate-500">Nothing needs attention here right now.</li>}
          </ul>
        </div>
      )}
    </EngineGate>
  );
}
