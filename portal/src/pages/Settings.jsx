import React from 'react';
import { ShieldCheck, WifiOff } from 'lucide-react';
import { useEngine, DEFAULT_SETTINGS } from '../hooks/useEngine';
import { useToast } from '../hooks/useToast';
import { PageHeader, pct } from '../components/engine/ui';
import { VED_Z, VED_LABEL } from '../engine/catalog';
import { normCdf } from '../engine/rng';

export default function Settings() {
  const { settings, updateSettings, status } = useEngine();
  const { toast } = useToast();

  const clearDevice = () => {
    try {
      Object.keys(window.localStorage).filter((k) => k.startsWith('grd_')).forEach((k) => window.localStorage.removeItem(k));
      Object.keys(window.sessionStorage).filter((k) => k.startsWith('grd_')).forEach((k) => window.sessionStorage.removeItem(k));
    } catch {
      /* ignore */
    }
    toast.info('Local data cleared. Reloading…');
    setTimeout(() => window.location.assign('/'), 600);
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Planning settings" sub="Rules the replenishment engine follows. Changes re-run every forecast and order straight away." />

      <section className="panel p-5">
        <h2 className="font-display text-lg text-ink-950">Service levels</h2>
        <p className="mt-1 text-sm text-slate-600">How often each class of medicine should be in stock through a replenishment cycle. A higher margin holds more safety stock.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] text-sm">
            <thead className="text-left text-[12px] text-slate-500">
              <tr><th className="py-2 font-medium">Class</th><th className="py-2 text-right font-medium">Standard</th><th className="py-2 text-right font-medium">With your margin</th></tr>
            </thead>
            <tbody className="divide-y divide-mist-200">
              {Object.entries(VED_Z).map(([k, z]) => (
                <tr key={k}>
                  <td className="py-2 text-ink-950">{VED_LABEL[k]}</td>
                  <td className="num py-2 text-right">{pct(normCdf(z), 1)}</td>
                  <td className="num py-2 text-right text-monsoon-700">{pct(normCdf(z + settings.serviceBoost), 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <label className="mt-5 block max-w-md">
          <span className="flex justify-between text-sm"><span className="text-ink-900">Extra safety margin</span><span className="num text-monsoon-700">{settings.serviceBoost >= 0 ? '+' : ''}{settings.serviceBoost.toFixed(1)}σ</span></span>
          <input type="range" min={-0.4} max={0.8} step={0.1} value={settings.serviceBoost} onChange={(e) => updateSettings({ serviceBoost: Number(e.target.value) })} className="mt-2 w-full accent-monsoon-600" />
        </label>
      </section>

      <section className="panel p-5">
        <h2 className="font-display text-lg text-ink-950">Stock movement</h2>
        <label className="mt-3 flex items-start justify-between gap-4">
          <span>
            <span className="block text-sm text-ink-900">Suggest depot-to-depot transfers</span>
            <span className="block text-[13px] text-slate-500">Move near-expiry or surplus stock to depots that will sell it in time, before ordering more from Rani.</span>
          </span>
          <input type="checkbox" checked={settings.redistribute} onChange={(e) => updateSettings({ redistribute: e.target.checked })} className="mt-1 h-5 w-5 shrink-0 accent-monsoon-600" />
        </label>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <div><dt className="text-slate-500">Review cycle</dt><dd className="text-ink-950">Weekly</dd></div>
          <div><dt className="text-slate-500">Issue rule</dt><dd className="text-ink-950">First expiry, first out</dd></div>
          <div><dt className="text-slate-500">Stock cap</dt><dd className="text-ink-950">⅓ of shelf life, max 16 weeks</dd></div>
        </dl>
        <button type="button" onClick={() => updateSettings(DEFAULT_SETTINGS)} className="mt-5 rounded-md border border-mist-300 px-3 py-1.5 text-sm hover:bg-mist-50">Restore defaults</button>
        {status === 'refreshing' && <span className="ml-3 text-sm text-muga-700">Re-running…</span>}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="panel p-5">
          <ShieldCheck className="h-5 w-5 text-monsoon-600" />
          <h2 className="mt-2 font-display text-base text-ink-950">Data privacy</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">Sales and stock files you load are processed in this browser and kept only on this device. Nothing is sent to an outside server.</p>
          <button type="button" onClick={clearDevice} className="mt-4 rounded-md border border-[#e9b3a8] px-3 py-1.5 text-sm text-[#9b321f] hover:bg-[#fdece8]">Clear all data on this device</button>
        </div>
        <div className="panel p-5">
          <WifiOff className="h-5 w-5 text-monsoon-600" />
          <h2 className="mt-2 font-display text-base text-ink-950">Working offline</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">Once opened, the planner is stored on the device. Forecasts, orders and approvals keep working without a connection, which suits depots with patchy networks.</p>
        </div>
      </section>
    </div>
  );
}
