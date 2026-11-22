import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Snowflake } from 'lucide-react';
import { useEngine } from '../hooks/useEngine';
import { EngineGate, PageHeader, VED_LABEL, inr, units, Segmented } from '../components/engine/ui';
import { SKUS, SIGNAL_LABELS } from '../engine/catalog';

export default function Medicines() {
  const { data } = useEngine();
  const [form, setForm] = useState('all');
  const forms = [...new Set(SKUS.map((s) => s.form))];
  const stats = useMemo(() => {
    const m = {};
    (data?.rows || []).forEach((r) => {
      const x = m[r.sku] || { stock: 0, weekly: 0, critical: 0, topLoc: null, top: 0 };
      x.stock += r.stockValue;
      x.weekly += r.dAvg;
      if (r.status === 'critical') x.critical += 1;
      if (r.pStockout > x.top) {
        x.top = r.pStockout;
        x.topLoc = r.key;
      }
      m[r.sku] = x;
    });
    return m;
  }, [data]);
  const list = SKUS.filter((s) => form === 'all' || s.form === form);
  return (
    <EngineGate>
      {data && (
        <div className="space-y-5">
          <PageHeader title="Medicines" sub="GRD’s formulations with the planning attributes the engine uses: criticality, shelf life, price, cold chain and the demand signals each one responds to." />
          <Segmented label="Dosage form" value={form} onChange={setForm} options={[['all', 'All'], ...forms.map((f) => [f, f])]} />
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((s) => {
              const st = stats[s.id] || {};
              return (
                <li key={s.id} className="panel flex flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-ink-950">{s.name}</p>
                      <p className="text-[12px] text-slate-500">{s.id} · {s.form} · per {s.unit} ₹{s.price}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${s.ved === 'V' ? 'bg-[#fdece8] text-[#9b321f]' : s.ved === 'E' ? 'bg-muga-50 text-muga-800' : 'bg-mist-200 text-ink-700'}`}>{VED_LABEL[s.ved]}</span>
                  </div>
                  <dl className="mt-3 grid grid-cols-3 gap-2 text-[12px]">
                    <div><dt className="text-slate-500">Shelf life</dt><dd className="num text-sm">{Math.round(s.shelf / 4.345)} mo</dd></div>
                    <div><dt className="text-slate-500">Weekly need</dt><dd className="num text-sm">{units(st.weekly)}</dd></div>
                    <div><dt className="text-slate-500">Network stock</dt><dd className="num text-sm">{inr(st.stock)}</dd></div>
                  </dl>
                  <p className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                    {s.coldChain && <span className="inline-flex items-center gap-1 rounded bg-[#eef1fd] px-1.5 py-0.5 text-[#34479a]"><Snowflake className="h-3 w-3" /> 2–8 °C</span>}
                    {Object.keys(s.drivers).filter((d) => !d.startsWith('fest')).map((d) => <span key={d} className="rounded bg-mist-100 px-1.5 py-0.5 text-slate-600">{SIGNAL_LABELS[d]}</span>)}
                    {!Object.keys(s.drivers).some((d) => !d.startsWith('fest')) && <span className="rounded bg-mist-100 px-1.5 py-0.5 text-slate-600">Steady chronic demand</span>}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-3 text-sm">
                    <span className={st.critical ? 'text-[#b63c27]' : 'text-slate-500'}>{st.critical ? `${st.critical} depots at risk` : 'No depot at risk'}</span>
                    {st.topLoc && <Link to={`/demand/series?k=${encodeURIComponent(st.topLoc)}`} className="text-monsoon-700 hover:underline">Forecast</Link>}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </EngineGate>
  );
}
