import React, { useState } from 'react';
import {
  Download,
  Calendar,
  Printer,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Select from '../components/common/Select';
import { mockPilotTargets } from '../data/mockPilotData';
import { mockSkus } from '../data/mockSkus';
import { mockInventoryItems } from '../data/mockInventory';
import { formatNumber, exportToCSV } from '../utils/formatters';

const REPORT_TEMPLATES = [
  {
    id: 'rpt-pilot-nesfic',
    name: 'Assam Pilot & Government Goal Progress Report',
    category: 'Executive & Government',
    description: 'Tracks progress on all 5 government-mandated targets (forecast accuracy, stockout reduction, waste reduction).',
    frequency: 'Bi-Weekly',
    format: 'PDF / Excel'
  },
  {
    id: 'rpt-forecast-mape',
    name: 'Medicine Demand Forecast Accuracy Report',
    category: 'Demand & Forecasting',
    description: 'Medicine-by-medicine forecast accuracy, comparison with old manual estimates, and seasonal trend factors.',
    frequency: 'Weekly',
    format: 'CSV / Excel'
  },
  {
    id: 'rpt-stockout-log',
    name: 'Medicine Stock Availability & Shortages Log',
    category: 'Inventory',
    description: 'Depot-wise medicine stockouts, shortage duration, and days taken to restock hospitals.',
    frequency: 'Daily',
    format: 'CSV / Excel'
  },
  {
    id: 'rpt-expiry-fefo',
    name: 'Medicine Expiry & Waste Prevention (FEFO) Report',
    category: 'Quality & Zero Wastage',
    description: 'Batches expiring in 30, 60, or 90 days, priority discount sales, and money saved from expiration losses.',
    frequency: 'Weekly',
    format: 'PDF / CSV'
  },
  {
    id: 'rpt-transit-corridors',
    name: 'Highway Delivery Times & Transit Delays Report',
    category: 'Logistics',
    description: 'Truck travel times, highway landslide/flood delays on NH-27/NH-6, and transporter delivery performance.',
    frequency: 'Monthly',
    format: 'PDF'
  }
];

export default function Reports() {
  const [selectedReportId, setSelectedReportId] = useState('rpt-pilot-nesfic');
  const [timeRange, setTimeRange] = useState('Nov 2026');
  const [selectedFormat, setSelectedFormat] = useState('CSV');
  const [exportNotice, setExportNotice] = useState(false);

  const activeTemplate = REPORT_TEMPLATES.find(t => t.id === selectedReportId) || REPORT_TEMPLATES[0];

  const handleExport = (format) => {
    const fmt = format || selectedFormat;
    setSelectedFormat(fmt);
    setExportNotice(true);
    setTimeout(() => {
      setExportNotice(false);
    }, 3500);

    if (fmt === 'PDF') {
      window.print();
      return;
    }

    // CSV / Excel export with real data
    let headers = [];
    let rows = [];

    if (selectedReportId === 'rpt-pilot-nesfic') {
      headers = ['Outcome KPI', 'Agreed Baseline', 'NESFIC Target', 'Pilot Actual', 'Variance vs Baseline', 'Target Status'];
      rows = (mockPilotTargets || []).map(t => [
        t.outcome || t.metric,
        t.baseline,
        t.target,
        t.current || t.actual,
        t.variance,
        t.status
      ]);
    } else if (selectedReportId === 'rpt-stockout-log') {
      headers = ['SKU ID', 'Medicine Name', 'Facility', 'Stock on Hand', 'Risk Level'];
      rows = (mockInventoryItems || []).map(i => [
        i.skuId || i.id,
        i.name,
        i.facilityName || i.location || 'Guwahati Regional Hub',
        i.currentStock || i.stockOnHand || 0,
        i.status || 'Monitored'
      ]);
    } else {
      headers = ['SKU Code', 'Medicine Name', 'Dosage Form', 'Category', 'MRP (INR)', 'Criticality VED'];
      rows = (mockSkus || []).map(s => [
        s.code || s.skuId,
        s.name,
        s.dosageForm || s.dosage,
        s.category,
        s.mrp,
        s.ved
      ]);
    }

    exportToCSV(headers, rows, `GRD_${activeTemplate.id}_${timeRange.replace(/\s+/g, '_')}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-sans text-navy-950">
              Reports
            </h1>
            <span className="text-xs bg-navy-100 text-navy-800 font-medium px-2 py-0.5 rounded-full">
              Audit Ready
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
            Generate and download PDF and Excel reports for GR Dhanuka management, hospital audits, and pilot reviews.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleExport('PDF')}
            icon={Printer}
          >
            Print Layout
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => handleExport('CSV')}
            icon={Download}
          >
            Download {selectedFormat}
          </Button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span><strong>{activeTemplate.name}</strong> prepared and downloaded successfully in {selectedFormat} format.</span>
          </div>
          <span className="text-2xs text-emerald-700 font-sans">Timestamp: 2026-11-18 12:35 IST</span>
        </div>
      )}

      {/* Main Grid: Template Selector & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Template Catalog */}
        <div className="lg:col-span-4 space-y-3">
          <div className="card p-4 space-y-3">
            <div className="border-b border-navy-100 pb-2">
              <h3 className="font-sans font-bold text-navy-950 text-base">Standard Report Catalog</h3>
              <p className="text-2xs text-navy-700/60">Choose pre-configured operational templates</p>
            </div>

            <div className="space-y-2">
              {REPORT_TEMPLATES.map((tpl) => {
                const isSelected = tpl.id === selectedReportId;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedReportId(tpl.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected 
                        ? 'border-navy-900 bg-navy-50/80 shadow-sm' 
                        : 'border-navy-100 hover:border-navy-200 hover:bg-navy-50/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xs font-semibold text-terracotta-700">
                        {tpl.category}
                      </span>
                      <span className="text-2xs text-navy-700/60 font-sans">{tpl.frequency}</span>
                    </div>
                    <div className="font-sans font-bold text-navy-950 text-xs mt-1">
                      {tpl.name}
                    </div>
                    <p className="text-2xs text-navy-700/70 mt-1 line-clamp-2">
                      {tpl.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Settings Card */}
          <div className="card p-4 space-y-3">
            <h4 className="font-semibold text-xs text-navy-900">Report Settings</h4>
            
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-2xs text-navy-700/70 block mb-1">Time Horizon:</label>
                <Select
                  value={timeRange}
                  onChange={(val) => setTimeRange(val)}
                  options={[
                    { value: 'Nov 2026', label: 'November 2026 (Pilot MTD)' },
                    { value: 'Oct 2026', label: 'October 2026' },
                    { value: 'Q3 2026', label: 'Q3 FY26 (Jul - Sep 2026)' },
                    { value: 'Full Pilot', label: 'Full NESFIC-I-09 Pilot (16 Weeks)' }
                  ]}
                  icon={Calendar}
                  className="w-full justify-between"
                  dropdownClassName="w-full"
                />
              </div>

              <div>
                <label className="text-2xs text-navy-700/70 block mb-1">Export File Format:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['CSV', 'Excel (.xlsx)', 'PDF'].map(fmt => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setSelectedFormat(fmt.split(' ')[0])}
                      className={`py-1.5 text-2xs font-medium rounded border ${
                        selectedFormat === fmt.split(' ')[0]
                          ? 'bg-navy-900 text-white border-navy-900'
                          : 'border-navy-200 text-navy-800 hover:bg-navy-50'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-navy-100 flex items-center justify-between text-2xs text-navy-700/60">
                <span>Data Source: Live ERP + NESFIC Data</span>
                <span className="font-medium text-emerald-700">Verified Sync</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Report Preview */}
        <div className="lg:col-span-8 card p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-terracotta-600" />
                <h3 className="font-sans font-bold text-navy-950 text-base">{activeTemplate.name}</h3>
              </div>
              <p className="text-2xs text-navy-700/60 mt-0.5">
                Preview for: <strong>{timeRange}</strong> • Generated for GRD Pharmaceuticals
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="xs"
                onClick={() => handleExport(selectedFormat)}
                icon={Download}
              >
                Export {selectedFormat}
              </Button>
            </div>
          </div>

          {/* Conditional Preview depending on template */}
          {selectedReportId === 'rpt-pilot-nesfic' && (
            <div className="space-y-4">
              <div className="p-3 bg-navy-50 rounded-lg text-xs space-y-1">
                <div className="font-semibold text-navy-950">NESFIC-I-09 Compliance Summary</div>
                <p className="text-2xs text-navy-700/70">
                  Targeted outcomes benchmarked against pre-pilot baseline figures agreed with GR Dhanuka Group.
                </p>
              </div>

              <div className="border border-navy-100 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-navy-50 text-navy-700/80 border-b border-navy-100">
                    <tr>
                      <th className="p-2.5 font-semibold">NESFIC-I-09 Intended Outcome</th>
                      <th className="p-2.5 font-semibold text-right">Agreed Baseline</th>
                      <th className="p-2.5 font-semibold text-right">Mandated Target</th>
                      <th className="p-2.5 font-semibold text-right">Pilot Actual</th>
                      <th className="p-2.5 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100">
                    {mockPilotTargets.map((target, idx) => (
                      <tr key={idx} className="hover:bg-navy-50/40">
                        <td className="p-2.5 font-medium text-navy-950">
                          {target.title}
                          <div className="text-2xs text-navy-700/60 font-normal">{target.description}</div>
                        </td>
                        <td className="p-2.5 text-right font-sans text-navy-700">{target.baseline}</td>
                        <td className="p-2.5 text-right font-sans font-semibold text-terracotta-700">{target.target}</td>
                        <td className="p-2.5 text-right font-sans font-bold text-navy-900">{target.actual}</td>
                        <td className="p-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-2xs font-semibold ${
                            target.status === 'Achieved' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {target.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedReportId === 'rpt-forecast-mape' && (
            <div className="space-y-4">
              <div className="border border-navy-100 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-navy-50 text-navy-700/80 border-b border-navy-100">
                    <tr>
                      <th className="p-2.5 font-semibold">SKU Code</th>
                      <th className="p-2.5 font-semibold">Medicine Formulation</th>
                      <th className="p-2.5 font-semibold text-right">Baseline Error</th>
                      <th className="p-2.5 font-semibold text-right">PharmaPredict MAPE</th>
                      <th className="p-2.5 font-semibold text-right">Accuracy Gain</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100">
                    {mockSkus.slice(0, 8).map((sku, idx) => (
                      <tr key={idx} className="hover:bg-navy-50/40">
                        <td className="p-2.5 font-sans text-navy-700 text-2xs">{sku.code}</td>
                        <td className="p-2.5 font-medium text-navy-950">{sku.name}</td>
                        <td className="p-2.5 text-right font-sans text-navy-700">28.4%</td>
                        <td className="p-2.5 text-right font-sans font-semibold text-emerald-700">8.6%</td>
                        <td className="p-2.5 text-right font-bold text-navy-900">+19.8%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(selectedReportId === 'rpt-stockout-log' || selectedReportId === 'rpt-expiry-fefo' || selectedReportId === 'rpt-transit-corridors') && (
            <div className="space-y-4">
              <div className="border border-navy-100 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-navy-50 text-navy-700/80 border-b border-navy-100">
                    <tr>
                      <th className="p-2.5 font-semibold">Storage Depot</th>
                      <th className="p-2.5 font-semibold">Product Batch</th>
                      <th className="p-2.5 font-semibold text-right">Stock Level</th>
                      <th className="p-2.5 font-semibold text-right">Cover Days</th>
                      <th className="p-2.5 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100">
                    {mockInventoryItems.slice(0, 8).map((item, idx) => (
                      <tr key={idx} className="hover:bg-navy-50/40">
                        <td className="p-2.5 font-medium text-navy-950">{item.location}</td>
                        <td className="p-2.5">
                          <span className="font-semibold text-navy-900">{item.skuName}</span>
                          <div className="text-2xs font-sans text-navy-700/60">{item.batchNumber}</div>
                        </td>
                        <td className="p-2.5 text-right font-sans">{formatNumber(item.onHand)}</td>
                        <td className="p-2.5 text-right font-sans">{item.daysCover}d</td>
                        <td className="p-2.5 text-center">
                          <Badge variant={item.status === 'Optimal' ? 'success' : item.status === 'Low' ? 'warning' : 'danger'}>
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-navy-100 flex items-center justify-between text-2xs text-navy-700/60">
            <span>Confidential • Proprietary to GR Dhanuka Group & PharmaPredict</span>
            <span>Page 1 of 4 • Certified NESFIC Report</span>
          </div>
        </div>
      </div>
    </div>
  );
}
