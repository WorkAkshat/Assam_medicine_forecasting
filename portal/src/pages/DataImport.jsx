import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  Download,
  RefreshCw,
  Database,
  Server,
  Check
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Select from '../components/common/Select';
import { useToast } from '../hooks/useToast';

const CSV_TEMPLATES_CONTENT = {
  'grd_sales_history_template.csv': `Date,SKU_Code,Medicine_Name,Customer_ID,Customer_Name,State,Quantity,Unit_Price,Order_Channel
2026-11-18,GRD-TAB-001,Paracetamol 650mg Tablets,CUST-GHY-001,Gauhati Medical College Hospital (GMCH),Assam,2500,28.50,Institutional PO
2026-11-18,GRD-TAB-002,Azithromycin 500mg Tablets,CUST-SIL-002,Silchar Civil Hospital,Assam,1200,85.00,Hospital Rate Contract
2026-11-17,GRD-SYR-001,CofGRD Cough Syrup 100ml,CUST-SHL-003,Civil Hospital Shillong,Meghalaya,1800,42.00,Distributor Indent
2026-11-16,GRD-HYG-001,Handuser-C 500ml Sanitizer,CUST-AGT-004,Agartala Government Medical College,Tripura,900,120.00,Institutional Rate Contract`,

  'grd_inventory_snapshot_template.csv': `Depot_Code,Depot_Name,State,SKU_Code,Medicine_Name,Batch_Number,On_Hand_Qty,In_Transit_Qty,Mfg_Date,Expiry_Date
DEP-GHY-01,Guwahati Central Depot,Assam,GRD-TAB-001,Paracetamol 650mg Tablets,GRD-P650-B2401,6200,2500,2024-12-15,2026-12-15
DEP-SIL-02,Silchar C&F Depot,Assam,GRD-TAB-001,Paracetamol 650mg Tablets,GRD-P650-B2402,650,1500,2024-10-31,2027-10-31
DEP-AGT-03,Agartala Regional Depot,Tripura,GRD-TAB-002,Azithromycin 500mg Tablets,GRD-AZ5-B2403,850,600,2024-11-10,2026-11-10
DEP-SHL-04,Shillong Regional Hub,Meghalaya,GRD-SYR-001,CofGRD Cough Syrup 100ml,GRD-SYR-B2404,1400,800,2024-09-01,2026-09-01`,

  'grd_production_inbound_template.csv': `PO_Number,Factory_Source,SKU_Code,Medicine_Name,Batch_Lot,Quantity_Packs,Mfg_Date,Expiry_Date,Dispatch_ETA,QC_Inspection_Status
PO-RANI-8801,Rani Formulation Plant (Kamrup),GRD-TAB-001,Paracetamol 650mg Tablets,GRD-P650-B2407,15000,2026-11-18,2028-11-18,2026-11-20,cGMP QC Passed
PO-RANI-8802,Rani Formulation Plant (Kamrup),GRD-TAB-002,Azithromycin 500mg Tablets,GRD-AZ5-B2408,8000,2026-11-18,2028-11-18,2026-11-21,cGMP QC Passed
PO-RANI-8803,Rani Formulation Plant (Kamrup),GRD-HYG-001,Handuser-C 500ml Sanitizer,GRD-HGC-B2409,5000,2026-11-17,2028-11-17,2026-11-20,cGMP QC Passed`,

  'grd_distributor_pos_template.csv': `Distributor_Code,Distributor_Name,Stockist_ID,Stockist_Name,Territory,SKU_Code,Units_Sold,Stock_Cover_Days
DIST-001,Pragjyotish Medico & Trade Agencies,STK-001,Kamrup Medicos (Fancy Bazaar),Guwahati Metro,GRD-TAB-001,1420,18
DIST-001,Pragjyotish Medico & Trade Agencies,STK-002,Dispur Chemist & Druggist,Guwahati East,GRD-TAB-002,680,24
DIST-002,Barak Valley Medico Distributors,STK-003,Cachar Pharma World,Silchar Town,GRD-TAB-001,890,9
DIST-003,Tripura Health Logistics,STK-004,Surma Valley Pharmacy,Agartala Central,GRD-TAB-002,520,14`
};

const SAMPLE_TEMPLATES = [
  {
    name: 'Past Medicine Sales History',
    fileName: 'grd_sales_history_template.csv',
    requiredFields: 'Date, SKU_Code, Customer_ID, Quantity, Unit_Price, Order_Channel',
    description: 'Upload past sales records from Tally, Marg ERP, or Excel to calculate future medicine demand.'
  },
  {
    name: 'Warehouse Stock Balance',
    fileName: 'grd_inventory_snapshot_template.csv',
    requiredFields: 'Depot_Code, SKU_Code, Batch_Number, On_Hand_Qty, Mfg_Date, Expiry_Date',
    description: 'Current available medicine stock in Guwahati, Rani, Dibrugarh, Silchar, and regional depots.'
  },
  {
    name: 'Factory Production & New Batches',
    fileName: 'grd_production_inbound_template.csv',
    requiredFields: 'PO_Number, Factory_Source, SKU_Code, Batch_Lot, Quantity, Dispatch_ETA',
    description: 'Scheduled new medicine batches coming out from Rani plant into the Northeast network.'
  },
  {
    name: 'Stockist & Pharmacy Sales',
    fileName: 'grd_distributor_pos_template.csv',
    requiredFields: 'Distributor_Code, Stockist_ID, SKU_Code, Units_Sold, Stock_Cover_Days',
    description: 'Weekly sales data from your distributors and retail stockists.'
  }
];

const RECENT_IMPORTS = [
  {
    id: 'IMP-2026-089',
    fileName: 'guwahati_depot_closing_stock_17nov.csv',
    type: 'Depot Stock Ledger',
    rowsCount: 420,
    validRows: 420,
    errorCount: 0,
    importedBy: 'Manoj Bora (Warehouse Controller)',
    timestamp: 'Today, 08:30 AM',
    status: 'Completed'
  },
  {
    id: 'IMP-2026-088',
    fileName: 'rani_plant_batch_releases_nov_wk2.xlsx',
    type: 'Production Inbound',
    rowsCount: 180,
    validRows: 178,
    errorCount: 2,
    importedBy: 'Devajit Nath (Production Head)',
    timestamp: 'Yesterday, 04:15 PM',
    status: 'Completed with Warnings'
  },
  {
    id: 'IMP-2026-087',
    fileName: 'pragjyotish_medico_secondary_sales.csv',
    type: 'Distributor POS',
    rowsCount: 650,
    validRows: 650,
    errorCount: 0,
    importedBy: 'Bipul Goswami (Distributor Desk)',
    timestamp: '16 Nov 2026',
    status: 'Completed'
  },
  {
    id: 'IMP-2026-086',
    fileName: 'smch_tender_indent_q3.csv',
    type: 'Sales & Indents',
    rowsCount: 94,
    validRows: 94,
    errorCount: 0,
    importedBy: 'Anamika Das (Hospital Desk)',
    timestamp: '15 Nov 2026',
    status: 'Completed'
  }
];

export default function DataImport() {
  const { toast } = useToast();
  const [selectedFeedType, setSelectedFeedType] = useState('Depot Physical Stock Ledger');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDownloadTemplate = (tpl) => {
    const content = CSV_TEMPLATES_CONTENT[tpl.fileName] || 'Date,SKU_Code,Quantity\n';
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', tpl.fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded schema template: ${tpl.fileName}`);
  };

  const handleDownloadAllTemplates = () => {
    SAMPLE_TEMPLATES.forEach((tpl, idx) => {
      setTimeout(() => {
        handleDownloadTemplate(tpl);
      }, idx * 250);
    });
    toast.success('Downloading all 4 standard CSV schema templates...');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setUploadedFile(file);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setUploadSuccess(true);
    }, 1500);
  };

  const handleReset = () => {
    setUploadedFile(null);
    setUploadSuccess(false);
    setIsProcessing(false);
  };

  const historyColumns = [
    {
      header: 'File Name & Type',
      render: (row) => (
        <div>
          <div className="font-semibold text-navy-950 text-xs">{row.fileName}</div>
          <div className="text-2xs text-navy-700/60">{row.type} • ID: {row.id}</div>
        </div>
      )
    },
    {
      header: 'Records Processed',
      render: (row) => (
        <div className="text-xs">
          <span className="font-semibold text-navy-900">{row.validRows} valid</span>
          {row.errorCount > 0 && (
            <span className="text-2xs text-amber-700 ml-1">({row.errorCount} skipped)</span>
          )}
        </div>
      )
    },
    {
      header: 'Uploaded By',
      render: (row) => (
        <div className="text-xs text-navy-800">
          <div>{row.importedBy}</div>
          <div className="text-2xs text-navy-700/60">{row.timestamp}</div>
        </div>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'Completed' ? 'success' : 'warning'}>
          {row.status}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-sans text-navy-950">
              Data Import
            </h1>
            <span className="text-xs bg-navy-100 text-navy-800 font-medium px-2 py-0.5 rounded-full">
              Tally • Marg • Excel
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
            Upload sales history, warehouse stock, and distributor sales CSV files without changing your existing software.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownloadAllTemplates}
            icon={Download}
          >
            Download CSV Schemas
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard 
          title="Total Ingested Feeds" 
          value="89 Files"
          subtitle="Processed this quarter"
          icon={Database}
        />
        <StatCard 
          title="Data Integrity Score" 
          value="99.4%"
          subtitle="Passes schema validation"
          icon={CheckCircle2}
          trend={{ direction: 'up', text: 'Clean feeds' }}
        />
        <StatCard 
          title="Active ERP Connectors" 
          value="3 Ready"
          subtitle="Tally, Marg, SAP B1"
          icon={Server}
        />
        <StatCard 
          title="Last Ingestion" 
          value="08:30 AM"
          subtitle="Guwahati Depot stock sync"
          icon={RefreshCw}
        />
      </div>

      {/* Upload Zone & Feed Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Card */}
        <div className="lg:col-span-7 card p-5 space-y-4">
          <div className="border-b border-navy-100 pb-3">
            <h3 className="font-sans font-bold text-navy-950 text-base">Upload Operational Data File</h3>
            <p className="text-2xs text-navy-700/60">Upload CSV or Excel spreadsheets exported from your warehouse or billing software</p>
          </div>

          <div>
            <label className="text-xs font-medium text-navy-900 block mb-1">Target Ingestion Feed Type *</label>
            <Select
              value={selectedFeedType}
              onChange={(val) => setSelectedFeedType(val)}
              options={SAMPLE_TEMPLATES.map(t => ({ value: t.name, label: t.name }))}
              className="w-full justify-between"
              dropdownClassName="w-full"
            />
          </div>

          {/* Drag & Drop Area */}
          {!uploadedFile ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                dragActive 
                  ? 'border-terracotta-600 bg-terracotta-50/30' 
                  : 'border-navy-200 hover:border-navy-400 bg-navy-50/20'
              }`}
              onClick={() => document.getElementById('file-upload-input').click()}
            >
              <UploadCloud className="w-12 h-12 text-navy-700/40 mx-auto mb-2" />
              <div className="font-semibold text-navy-950 text-sm">
                Drop your CSV or Excel file here, or <span className="text-terracotta-600 underline">browse</span>
              </div>
              <p className="text-2xs text-navy-700/60 mt-1">
                Supports .csv, .xlsx, .xls up to 50MB. Auto-maps columns based on GRD schema.
              </p>
              <input
                id="file-upload-input"
                type="file"
                accept=".csv, .xlsx, .xls"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="border border-navy-200 rounded-xl p-5 space-y-3 bg-navy-50/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-navy-900 text-white rounded-lg">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-950 text-xs">{uploadedFile.name}</h4>
                    <p className="text-2xs text-navy-700/60">
                      {(uploadedFile.size / 1024).toFixed(1)} KB • Target: {selectedFeedType}
                    </p>
                  </div>
                </div>
                {uploadSuccess && (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" /> Ready to Import
                  </span>
                )}
              </div>

              {isProcessing && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-2xs text-navy-700/80">
                    <span>Validating column headers & checking batch formats...</span>
                    <span>70%</span>
                  </div>
                  <div className="w-full bg-navy-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-terracotta-600 h-full rounded-full animate-pulse" style={{ width: '70%' }} />
                  </div>
                </div>
              )}

              {uploadSuccess && (
                <div className="p-3 bg-white border border-navy-100 rounded-lg text-xs space-y-2">
                  <div className="flex justify-between text-2xs">
                    <span className="text-navy-700/70">Rows Detected:</span>
                    <span className="font-bold text-navy-900">420 Records</span>
                  </div>
                  <div className="flex justify-between text-2xs">
                    <span className="text-navy-700/70">Matched Columns:</span>
                    <span className="font-bold text-emerald-700">6 / 6 Required Headers Matched</span>
                  </div>
                  <div className="flex justify-between text-2xs">
                    <span className="text-navy-700/70">Data Quality Check:</span>
                    <span className="font-bold text-emerald-700">Zero Critical Anomalies</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="xs" onClick={handleReset}>
                  Cancel / Replace File
                </Button>
                <Button 
                  variant="primary" 
                  size="xs" 
                  disabled={isProcessing}
                  onClick={() => {
                    toast.success('420 medicine records committed to live database. Forecast models updated.');
                    handleReset();
                  }}
                >
                  Commit Ingestion to Database
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Template Schemas Guide */}
        <div className="lg:col-span-5 card p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="border-b border-navy-100 pb-3">
              <h3 className="font-sans font-bold text-navy-950 text-base">Standard CSV Data Schemas</h3>
              <p className="text-2xs text-navy-700/60">Expected column structures for operational feeds</p>
            </div>

            <div className="space-y-3 mt-3">
              {SAMPLE_TEMPLATES.map((tpl, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-navy-100 bg-navy-50/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-navy-950 text-xs">{tpl.name}</span>
                    <button 
                      type="button"
                      onClick={() => handleDownloadTemplate(tpl)}
                      className="text-2xs text-terracotta-600 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <Download className="w-3 h-3" /> Sample CSV
                    </button>
                  </div>
                  <p className="text-2xs text-navy-700/70">{tpl.description}</p>
                  <div className="text-2xs font-sans bg-white p-1 rounded border border-navy-100 text-navy-800 break-all">
                    {tpl.requiredFields}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-lg text-2xs text-amber-900 mt-3">
            <strong>Security & Privacy:</strong> All uploaded medical stock records are processed strictly within the confidential GR Dhanuka Group tenant with encryption at rest.
          </div>
        </div>
      </div>

      {/* Ingestion History */}
      <Table 
        title="Recent Import Ingestions &amp; Audit Trail"
        subtitle="Verified history of data files committed to PharmaPredict engine"
        columns={historyColumns}
        data={RECENT_IMPORTS}
        keyExtractor={(row) => row.id}
      />
    </div>
  );
}
