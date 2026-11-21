import React, { useState } from 'react';
import { Check, FileSpreadsheet } from 'lucide-react';
import { exportToCSV } from '../../utils/formatters';

export default function ExportButton({ data, filename = 'grd_kpi_export', label = 'Export Report' }) {
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => {
      setExported(false);
    }, 2200);

    if (Array.isArray(data) && data.length > 0) {
      const keys = Object.keys(data[0]);
      const rows = data.map(row => keys.map(k => row[k]));
      exportToCSV(keys, rows, filename);
    } else {
      // General KPI summary CSV download
      const headers = ['Operational Metric', 'Value', 'Status', 'Export Timestamp'];
      const rows = [
        ['Total SKUs Monitored', '18 Active SKUs', 'cGMP Active', new Date().toLocaleString()],
        ['Network Available Stock', '66,320 Units', '12 Stock Hubs', new Date().toLocaleString()],
        ['In-Transit Cargo', '14,850 Units', '4 Active Corridors', new Date().toLocaleString()],
        ['Stock-out Risk Points', '6 Depots at Risk', 'Active Replenishment', new Date().toLocaleString()],
        ['Northeast Service Level', '94.2%', 'Target >= 95%', new Date().toLocaleString()],
        ['Forecast Accuracy (MAPE)', '82.4%', 'Target +20% Baseline', new Date().toLocaleString()]
      ];
      exportToCSV(headers, rows, filename);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs hover:border-slate-300 transition-all cursor-pointer shrink-0"
    >
      {exported ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
          <span className="text-emerald-700">Downloaded!</span>
        </>
      ) : (
        <>
          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
