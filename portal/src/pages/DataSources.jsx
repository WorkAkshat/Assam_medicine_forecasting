import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, Trash2, Download, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useEngine } from '../hooks/useEngine';
import { useToast } from '../hooks/useToast';
import { EngineGate, PageHeader, downloadCsv, weekLabel } from '../components/engine/ui';
import { SKUS, LOCATIONS, weekDate, HISTORY_WEEKS } from '../engine/catalog';

// Minimal RFC-4180 CSV parser (quoted fields, commas and newlines inside quotes).
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',' || c === ';' || c === '\t') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field);
      if (row.some((f) => f.trim() !== '')) rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim() !== '')) rows.push(row);
  return rows;
}

const ALIASES = {
  week: ['week', 'week_start', 'date', 'invoice_date', 'bill_date'],
  sku: ['sku', 'sku_code', 'item_code', 'product_code'],
  depot: ['depot', 'depot_code', 'location', 'branch', 'godown'],
  units: ['units', 'qty', 'quantity', 'sold_qty'],
  segment: ['segment', 'customer_type', 'channel'],
  batch: ['batch', 'batch_no'],
  expiry: ['expiry', 'expiry_date', 'exp_date'],
  qty: ['qty', 'quantity', 'stock', 'closing_stock', 'units'],
};

function mapRows(table, fields) {
  if (table.length < 2) return { rows: [], missing: fields };
  const header = table[0].map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'));
  const idx = {};
  fields.forEach((f) => {
    idx[f] = header.findIndex((h) => ALIASES[f].includes(h));
  });
  const required = fields.filter((f) => f !== 'segment' && f !== 'batch');
  const missing = required.filter((f) => idx[f] < 0);
  if (missing.length) return { rows: [], missing };
  const rows = table.slice(1).map((r) => {
    const o = {};
    fields.forEach((f) => {
      o[f] = idx[f] >= 0 ? (r[idx[f]] || '').trim() : '';
    });
    if (o.sku) o.sku = o.sku.toUpperCase();
    if (o.depot) o.depot = o.depot.toUpperCase();
    if (o.segment) o.segment = o.segment.toLowerCase();
    return o;
  });
  return { rows, missing: [] };
}

function salesTemplate() {
  const out = [];
  for (let w = HISTORY_WEEKS - 3; w < HISTORY_WEEKS; w += 1) {
    out.push({ week_start: weekDate(w).toISOString().slice(0, 10), sku_code: 'PCM650', depot_code: 'GHY', units: 2140, segment: 'retail' });
    out.push({ week_start: weekDate(w).toISOString().slice(0, 10), sku_code: 'PCM650', depot_code: 'GHY', units: 610, segment: 'hospital' });
  }
  return out;
}
const stockTemplate = () => [
  { sku_code: 'PCM650', depot_code: 'GHY', batch_no: 'GRD24A118', expiry_date: '2027-06-30', qty: 3200 },
  { sku_code: 'MTZ200', depot_code: 'SLC', batch_no: 'GRD25S044', expiry_date: '2027-02-28', qty: 410 },
];

function UploadCard({ title, sub, onFile, template, templateName }) {
  const input = useRef(null);
  const [drag, setDrag] = useState(false);
  return (
    <div
      className={`panel flex flex-col p-5 transition-colors ${drag ? 'border-monsoon-500 bg-monsoon-50/40' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]);
      }}
    >
      <FileSpreadsheet className="h-6 w-6 text-monsoon-600" />
      <h2 className="mt-3 font-display text-base text-ink-950">{title}</h2>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{sub}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <button type="button" onClick={() => input.current?.click()} className="inline-flex items-center gap-1.5 rounded-md bg-monsoon-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-monsoon-700">
          <Upload className="h-4 w-4" /> Choose CSV
        </button>
        <button type="button" onClick={() => downloadCsv(templateName, template())} className="inline-flex items-center gap-1.5 rounded-md border border-mist-300 px-3 py-1.5 text-sm hover:bg-mist-50">
          <Download className="h-4 w-4" /> Template
        </button>
      </div>
      <input ref={input} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { if (e.target.files[0]) onFile(e.target.files[0]); e.target.value = ''; }} />
    </div>
  );
}

export default function DataSources() {
  const { data, uploads, setUploads, status } = useEngine();
  const { toast } = useToast();

  const load = (kind) => async (file) => {
    if (file.size > 8 * 1024 * 1024) {
      toast.error('That file is over 8 MB. Export one region or a shorter period and try again.');
      return;
    }
    const text = await file.text();
    const fields = kind === 'sales' ? ['week', 'sku', 'depot', 'units', 'segment'] : ['sku', 'depot', 'batch', 'expiry', 'qty'];
    const { rows, missing } = mapRows(parseCsv(text), fields);
    if (missing.length) {
      toast.error(`${file.name}: missing column${missing.length > 1 ? 's' : ''} ${missing.join(', ')}. Download the template to see the expected headers.`);
      return;
    }
    const next = {
      ...uploads,
      [kind]: rows,
      files: [...(uploads.files || []).filter((f) => f.kind !== kind), { kind, name: file.name, rows: rows.length, at: new Date().toISOString() }],
    };
    const stored = setUploads(next);
    toast.success(`${file.name}: ${rows.length} rows loaded. Forecasts are re-running.`);
    if (!stored) toast.warning('The file is too large to keep on this device; it will be used until you reload.');
  };

  const clear = () => {
    setUploads({ sales: [], stock: [], files: [] });
    toast.info('Back to the built-in sample data.');
  };

  const q = data?.dataQuality;
  return (
    <EngineGate>
      {data && (
        <div className="space-y-5">
          <PageHeader title="Data sources" sub="Load GRD’s own exports from Tally, Marg, SAP or Excel. Nothing replaces your current systems: the planner reads weekly sales and current stock, and all calculation happens on this device." />

          <section className="grid gap-4 md:grid-cols-2">
            <UploadCard
              title="Weekly sales"
              sub="One row per medicine, depot and week (and optionally customer segment: retail, hospital, institution, stockist). Columns: week_start, sku_code, depot_code, units, segment."
              onFile={load('sales')}
              template={salesTemplate}
              templateName="grd-sales-template.csv"
            />
            <UploadCard
              title="Current stock by batch"
              sub="One row per batch held at a depot, so expiry risk is exact. Columns: sku_code, depot_code, batch_no, expiry_date, qty."
              onFile={load('stock')}
              template={stockTemplate}
              templateName="grd-stock-template.csv"
            />
          </section>

          <section className="panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg text-ink-950">Data in use</h2>
              {(uploads.files || []).length > 0 && (
                <button type="button" onClick={clear} className="inline-flex items-center gap-1.5 text-sm text-[#b63c27] hover:underline">
                  <Trash2 className="h-4 w-4" /> Remove uploaded data
                </button>
              )}
            </div>
            {q.source === 'synthetic' ? (
              <p className="mt-2 text-sm text-slate-600">Built-in sample data: 3 years of weekly sales for {SKUS.length} medicines at {LOCATIONS.length} Northeast depots, shaped by monsoon, floods, disease seasons and festivals.</p>
            ) : (
              <div className="mt-3 grid gap-4 lg:grid-cols-2">
                <ul className="space-y-2 text-sm">
                  {(uploads.files || []).map((f) => (
                    <li key={f.kind} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-monsoon-600" /> <span className="text-ink-950">{f.name}</span> <span className="text-slate-500">{f.rows} rows · {new Date(f.at).toLocaleString('en-IN')}</span></li>
                  ))}
                  {status === 'refreshing' && <li className="text-muga-700">Re-running forecasts…</li>}
                </ul>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div><dt className="text-slate-500">Sales rows matched</dt><dd className="num text-ink-950">{q.salesMatched} of {q.salesRows}</dd></div>
                  <div><dt className="text-slate-500">Medicine × depot lines</dt><dd className="num text-ink-950">{q.seriesWithData} from your data</dd></div>
                  <div><dt className="text-slate-500">Weeks covered</dt><dd className="num text-ink-950">{q.firstWeek != null ? `${weekLabel(weekDate(q.firstWeek).toISOString())} – ${weekLabel(weekDate(q.lastWeek).toISOString())}` : '—'}</dd></div>
                  <div><dt className="text-slate-500">Stock batches matched</dt><dd className="num text-ink-950">{q.stockMatched} of {q.stockRows}</dd></div>
                </dl>
              </div>
            )}
            {q.source !== 'synthetic' && (q.badRows > 0 || q.staleSeries > 0 || q.outOfRange > 0 || q.unknownSkus.length > 0 || q.unknownDepots.length > 0 || q.paddedSeries > 0) && (
              <ul className="mt-4 space-y-1.5 rounded-md bg-muga-50 p-3 text-sm text-muga-900">
                {q.badRows > 0 && <li className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{q.badRows} rows skipped: unreadable date or quantity.</li>}
                {q.outOfRange > 0 && <li className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{q.outOfRange} rows fall outside the last 3 years and were not used.</li>}
                {q.unknownSkus.length > 0 && <li className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />Unknown medicine codes: {q.unknownSkus.join(', ')}. Add them to the medicine master to include them.</li>}
                {q.unknownDepots.length > 0 && <li className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />Unknown depot codes: {q.unknownDepots.join(', ')}.</li>}
                {q.staleSeries > 0 && <li className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{q.staleSeries} lines stop up to {q.staleWeeks} weeks before this week. Those weeks are estimated from the last month until newer sales are loaded.</li>}
                {q.paddedSeries > 0 && <li className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{q.paddedSeries} lines have less than 3 years of history; earlier weeks use sample data until more history is loaded.</li>}
              </ul>
            )}
          </section>

          <section className="panel p-5">
            <h2 className="font-display text-lg text-ink-950">Codes the planner recognises</h2>
            <div className="mt-3 grid gap-5 md:grid-cols-2">
              <div>
                <p className="kicker mb-1">Depots</p>
                <p className="text-sm leading-relaxed text-slate-600">{LOCATIONS.map((l) => `${l.id} ${l.name}`).join(' · ')}</p>
              </div>
              <div>
                <p className="kicker mb-1">Medicines</p>
                <p className="text-sm leading-relaxed text-slate-600">{SKUS.map((s) => `${s.id} ${s.name}`).join(' · ')}</p>
              </div>
            </div>
          </section>
        </div>
      )}
    </EngineGate>
  );
}
