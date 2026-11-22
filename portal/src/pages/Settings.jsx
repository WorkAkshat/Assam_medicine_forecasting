import React, { useState } from 'react';
import {
  ShieldCheck,
  Sliders,
  Wifi,
  Save,
  CheckCircle2,
  History,
  Building2
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Select from '../components/common/Select';
import { useToast } from '../hooks/useToast';
import { usePersistentState, clearAllPersistentData } from '../hooks/usePersistentState';

const AUDIT_LOGS = [
  {
    id: 'AUD-8821',
    timestamp: '2026-11-18 11:42 IST',
    user: 'Dr. Abhijit Sarma',
    role: 'Supply Chain Manager',
    action: 'Approved Replenishment Indent #REP-2026-104',
    details: 'Authorized 4,000 units Paracetamol dispatch from Guwahati to Silchar via NH-6.',
    status: 'Success'
  },
  {
    id: 'AUD-8820',
    timestamp: '2026-11-18 09:15 IST',
    user: 'Manoj Bora',
    role: 'Warehouse Controller',
    action: 'Physical Cycle Count Reconciled',
    details: 'Reconciled 1,200 units Handuser-C® 500ml at Guwahati Depot (0 discrepancy).',
    status: 'Verified'
  },
  {
    id: 'AUD-8819',
    timestamp: '2026-11-17 16:30 IST',
    user: 'Gautam R. Dhanuka',
    role: 'Executive / Board',
    action: 'NESFIC-I-09 Target Baseline Locked',
    details: 'Locked pilot baseline metrics: Forecast error 28.4%, Stockout 12.8%, Expiry 8.5%.',
    status: 'Governed'
  },
  {
    id: 'AUD-8818',
    timestamp: '2026-11-17 14:10 IST',
    user: 'Bipul Goswami',
    role: 'Distributor Desk',
    action: 'Secondary POS Ingestion Sync',
    details: 'Ingested weekly pharmacy consumption ledger for Kamrup & Nalbari (650 records).',
    status: 'Success'
  },
  {
    id: 'AUD-8817',
    timestamp: '2026-11-16 18:05 IST',
    user: 'Dr. Abhijit Sarma',
    role: 'Supply Chain Manager',
    action: 'Monsoon Safety Stock Buffer Extended',
    details: 'Adjusted Barak Valley corridor buffer from +2.0 to +3.5 days due to Sonapur landslide.',
    status: 'Rule Updated'
  }
];

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('operational'); // 'operational', 'offline', 'pilot', 'audit'
  
  const [settings, setSettings] = usePersistentState('grd_system_settings', {
    monsoonBufferDays: 3.5,
    standardBufferDays: 1.5,
    fefoThresholdDays: 90,
    enableDynamicRouting: true,
    offlineSyncInterval: 15,
    localCacheDuration: 7,
    smsFallbackActive: true
  });

  // Operational Settings State
  const [monsoonBufferDays, setMonsoonBufferDays] = useState(settings.monsoonBufferDays ?? 3.5);
  const [standardBufferDays, setStandardBufferDays] = useState(settings.standardBufferDays ?? 1.5);
  const [fefoThresholdDays, setFefoThresholdDays] = useState(settings.fefoThresholdDays ?? 90);
  const [enableDynamicRouting, setEnableDynamicRouting] = useState(settings.enableDynamicRouting ?? true);
  
  // Offline / Connectivity State
  const [offlineSyncInterval, setOfflineSyncInterval] = useState(settings.offlineSyncInterval ?? 15);
  const [localCacheDuration, setLocalCacheDuration] = useState(settings.localCacheDuration ?? 7);
  const [smsFallbackActive, setSmsFallbackActive] = useState(settings.smsFallbackActive ?? true);

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettings({
      monsoonBufferDays: Number(monsoonBufferDays),
      standardBufferDays: Number(standardBufferDays),
      fefoThresholdDays: Number(fefoThresholdDays),
      enableDynamicRouting,
      offlineSyncInterval: Number(offlineSyncInterval),
      localCacheDuration: Number(localCacheDuration),
      smsFallbackActive
    });
    setSavedNotice(true);
    toast.success('Configuration saved permanently. Settings will persist across browser reloads.');
    setTimeout(() => {
      setSavedNotice(false);
    }, 2000);
  };

  const handleResetFactory = () => {
    if (window.confirm('Reset all manually saved data (orders, inventory counts, transfers, settings) back to initial pilot seed?')) {
      clearAllPersistentData();
      toast.info('All data reset to factory seed. Reloading page...');
      setTimeout(() => {
        window.location.reload();
      }, 700);
    }
  };

  const auditColumns = [
    {
      header: 'Timestamp & User',
      render: (row) => (
        <div>
          <div className="font-semibold text-navy-950 text-xs">{row.user}</div>
          <div className="text-2xs text-navy-700/60 font-sans">{row.timestamp} • {row.role}</div>
        </div>
      )
    },
    {
      header: 'Action Taken',
      render: (row) => (
        <span className="font-medium text-navy-900 text-xs">{row.action}</span>
      )
    },
    {
      header: 'Details & Impact',
      render: (row) => (
        <p className="text-2xs text-navy-700/80 max-w-md">{row.details}</p>
      )
    },
    {
      header: 'Audit State',
      render: (row) => (
        <Badge variant={row.status === 'Governed' ? 'warning' : 'success'}>
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
              Settings
            </h1>
            <span className="text-xs bg-navy-100 text-navy-800 font-medium px-2 py-0.5 rounded-full">
              System &amp; Audit
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
            Configure delivery lead times, offline sync rules, and review the activity log for compliance.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResetFactory}
          >
            Reset to Seed Data
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleSaveSettings}
            icon={Save}
          >
            Save Configuration
          </Button>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System configuration successfully updated and broadcast to all Northeast distribution nodes.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="card p-3">
        <div className="flex flex-wrap items-center gap-2 border-b border-navy-100 pb-2">
          {[
            { id: 'operational', label: 'Northeast Logistics Rules', icon: Sliders },
            { id: 'offline', label: 'Offline Sync & Low-Bandwidth', icon: Wifi },
            { id: 'pilot', label: 'NESFIC-I-09 Pilot Governance', icon: Building2 },
            { id: 'audit', label: 'Compliance Audit Trail', icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isSelected 
                    ? 'bg-navy-900 text-white font-semibold' 
                    : 'text-navy-700/70 hover:bg-navy-50 hover:text-navy-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Operational Rules */}
      {activeTab === 'operational' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="card p-5 space-y-4">
            <div className="border-b border-navy-100 pb-3">
              <h3 className="font-sans font-bold text-navy-950 text-base">Regional Transit & Safety Stock Parameters</h3>
              <p className="text-2xs text-navy-700/60">Calibrated for Brahmaputra flood plains, Meghalaya rain corridors, and hill states</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-2">
                <label className="font-bold text-navy-900 block">Monsoon Season Safety Stock Buffer (Days)</label>
                <p className="text-2xs text-navy-700/60">Additional lead time automatically added to replenishment models during heavy rainfall / landslide alerts.</p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="7"
                    step="0.5"
                    value={monsoonBufferDays}
                    onChange={(e) => setMonsoonBufferDays(e.target.value)}
                    className="w-full accent-navy-900"
                  />
                  <span className="font-bold text-navy-950 text-sm w-16 text-right">+{monsoonBufferDays} days</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-navy-900 block">Standard Safety Buffer (Dry Season)</label>
                <p className="text-2xs text-navy-700/60">Default buffer added to vendor lead times under normal highway transit conditions.</p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.5"
                    max="4"
                    step="0.5"
                    value={standardBufferDays}
                    onChange={(e) => setStandardBufferDays(e.target.value)}
                    className="w-full accent-navy-900"
                  />
                  <span className="font-bold text-navy-950 text-sm w-16 text-right">+{standardBufferDays} days</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-navy-900 block">FEFO Expiry Liquidation Trigger Window (Days)</label>
                <p className="text-2xs text-navy-700/60">Batches within this window are prioritized for high-consumption medical colleges or promotional discounts.</p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="45"
                    max="180"
                    step="15"
                    value={fefoThresholdDays}
                    onChange={(e) => setFefoThresholdDays(e.target.value)}
                    className="w-full accent-navy-900"
                  />
                  <span className="font-bold text-navy-950 text-sm w-16 text-right">{fefoThresholdDays} days</span>
                </div>
              </div>

              <div className="space-y-2 flex flex-col justify-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableDynamicRouting}
                    onChange={(e) => setEnableDynamicRouting(e.target.checked)}
                    className="rounded text-navy-900 focus:ring-0"
                  />
                  <span className="font-bold text-navy-900">
                    Enable Autonomous Multi-Corridor Re-Routing
                  </span>
                </label>
                <p className="text-2xs text-navy-700/60 pl-6">
                  Automatically switch consignments to NH-27 Northern bypass when NH-6 Meghalaya corridor reports &gt; 24h blockage.
                </p>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Offline & Low Bandwidth */}
      {activeTab === 'offline' && (
        <div className="card p-5 space-y-4">
          <div className="border-b border-navy-100 pb-3">
            <h3 className="font-sans font-bold text-navy-950 text-base">Variable Connectivity & Low-Bandwidth Optimizations</h3>
            <p className="text-2xs text-navy-700/60">Designed for rural and mountainous areas in Northeast India with intermittent 2G/3G signals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-2">
              <label className="font-bold text-navy-900 block">Offline Local Cache Horizon (Days)</label>
              <p className="text-2xs text-navy-700/60">Number of days of inventory and SKU masters cached locally in browser IndexedDB.</p>
              <Select
                value={localCacheDuration}
                onChange={(val) => setLocalCacheDuration(val)}
                options={[
                  { value: '3', label: '3 Days Local Cache' },
                  { value: '7', label: '7 Days Local Cache (Recommended)' },
                  { value: '14', label: '14 Days Local Cache' }
                ]}
                className="w-full justify-between"
                dropdownClassName="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-navy-900 block">Auto-Sync Retry Interval</label>
              <p className="text-2xs text-navy-700/60">Frequency to attempt syncing offline queued orders when cellular link is detected.</p>
              <Select
                value={offlineSyncInterval}
                onChange={(val) => setOfflineSyncInterval(val)}
                options={[
                  { value: '5', label: 'Every 5 minutes' },
                  { value: '15', label: 'Every 15 minutes' },
                  { value: '30', label: 'Every 30 minutes' }
                ]}
                className="w-full justify-between"
                dropdownClassName="w-full"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-navy-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={smsFallbackActive}
                onChange={(e) => setSmsFallbackActive(e.target.checked)}
                className="rounded text-navy-900 focus:ring-0"
              />
              <span className="font-bold text-navy-900 text-xs">
                Enable SMS / GSM Modem Fallback for Remote Stockists
              </span>
            </label>
            <p className="text-2xs text-navy-700/60 pl-6 mt-0.5">
              Allows stockists in remote hilly terrain to place urgent stock replenishment indents via formatted SMS commands.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: NESFIC-I-09 Pilot Governance */}
      {activeTab === 'pilot' && (
        <div className="card p-5 space-y-4">
          <div className="border-b border-navy-100 pb-3">
            <h3 className="font-sans font-bold text-navy-950 text-base">NESFIC-I-09 Challenge Governance</h3>
            <p className="text-2xs text-navy-700/60">Operational boundaries agreed under the Assam Startup Initiative</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-navy-50 rounded-lg space-y-1">
              <span className="text-2xs text-navy-700/60 font-medium block">Challenge Owner</span>
              <span className="font-bold text-navy-950">GR Dhanuka Group / GRD Pharma</span>
              <span className="text-2xs text-navy-700/70 block">Guwahati HQ & Rani Formulation Plant</span>
            </div>

            <div className="p-3 bg-navy-50 rounded-lg space-y-1">
              <span className="text-2xs text-navy-700/60 font-medium block">Pilot Timeline</span>
              <span className="font-bold text-navy-950">12 – 16 Weeks Duration</span>
              <span className="text-2xs text-navy-700/70 block">Current Stage: Week 6 of Pilot</span>
            </div>

            <div className="p-3 bg-navy-50 rounded-lg space-y-1">
              <span className="text-2xs text-navy-700/60 font-medium block">Pilot Geography</span>
              <span className="font-bold text-navy-950">Assam Pilot Anchor</span>
              <span className="text-2xs text-navy-700/70 block">Guwahati, Dibrugarh, Silchar + 7 States</span>
            </div>
          </div>

          <div className="p-4 bg-terracotta-50/50 border border-terracotta-200/60 rounded-lg text-xs text-navy-900 space-y-1">
            <div className="font-bold text-terracotta-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Pilot Outcome Targets Mandate:
            </div>
            <ul className="list-disc pl-5 space-y-0.5 text-2xs text-navy-800">
              <li>Improve demand forecast accuracy by ≥ 20% over baseline.</li>
              <li>Reduce stock-out incidence by ≥ 20%.</li>
              <li>Reduce excess / slow-moving inventory by ≥ 15%.</li>
              <li>Reduce expiry-related losses by ≥ 15%.</li>
              <li>Improve order fulfillment / service levels by ≥ 10 percentage points.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-navy-100 pb-2">
            <div>
              <h3 className="font-sans font-bold text-navy-950 text-base">Immutable Activity & Decision Log</h3>
              <p className="text-2xs text-navy-700/60">Cryptographically sequenced audit trail for pharma regulatory compliance</p>
            </div>
            <Button 
              variant="outline" 
              size="xs"
              onClick={() => {
                const headers = ['Audit ID', 'Timestamp', 'User', 'Role', 'Action', 'Details', 'Status'];
                const rows = AUDIT_LOGS.map(a => [
                  `"${a.id}"`,
                  `"${a.timestamp}"`,
                  `"${a.user}"`,
                  `"${a.role}"`,
                  `"${a.action}"`,
                  `"${a.details}"`,
                  `"${a.status}"`
                ].join(','));
                const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'grd_regulatory_audit_trail.csv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success('Audit trail downloaded (CSV)');
              }}
            >
              Export Audit Trail
            </Button>
          </div>

          <Table 
            columns={auditColumns}
            data={AUDIT_LOGS}
            keyExtractor={(row) => row.id}
          />
        </div>
      )}
    </div>
  );
}
