import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  Filter,
  Sliders,
  Trash2,
  MapPin,
  ShieldAlert,
  Plus
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Drawer from '../components/common/Drawer';
import Select from '../components/common/Select';
import { useToast } from '../hooks/useToast';
import { usePersistentState } from '../hooks/usePersistentState';
import { MOCK_ALERTS, ALERT_TYPES } from '../data/mockAlerts';

export default function Alerts() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formAlertTitle, setFormAlertTitle] = useState('NH-06 Sonapur Landslide Transport Alert');
  const [formAlertSeverity, setFormAlertSeverity] = useState('critical');
  const [formAlertType, setFormAlertType] = useState('Transit Delay');
  const [formAlertLocation, setFormAlertLocation] = useState('Silchar Regional Corridor (NH-06)');
  const [formAlertSku, setFormAlertSku] = useState('GRD-TAB-001');
  const [formAlertDesc, setFormAlertDesc] = useState('Heavy monsoon mudslide near Sonapur tunnel. Transit vehicles delayed by 18-24 hours. Cold-chain backup power active.');
  const [formAlertAction, setFormAlertAction] = useState('Re-route emergency consignments via Badarpur bypass; activate 48hr safety buffer at Silchar depot.');

  const handleCreateAlert = (e) => {
    e.preventDefault();
    const newAlert = {
      id: `ALT-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: formAlertTitle,
      severity: formAlertSeverity,
      type: formAlertType,
      location: formAlertLocation,
      skuCode: formAlertSku,
      description: formAlertDesc,
      actionRequired: formAlertAction,
      timestamp: 'Just now',
      isRead: false,
      actionAcknowledged: false
    };
    setAlerts(prev => [newAlert, ...prev]);
    setIsCreateModalOpen(false);
    toast.success(`Operational alert ${newAlert.id} published across regional monitoring desks!`);
  };
  const { toast } = useToast();
  const [alerts, setAlerts] = usePersistentState('grd_alerts_data', MOCK_ALERTS);
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedType, setSelectedType] = useState('All Alerts');
  const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState(false);

  // Config thresholds state
  const [stockCoverThreshold, setStockCoverThreshold] = useState(7);
  const [expiryAlertHorizon, setExpiryAlertHorizon] = useState(90);
  const [transitDelayHours, setTransitDelayHours] = useState(24);
  const [demandSurgeThreshold, setDemandSurgeThreshold] = useState(30);
  const [smsNotificationEnabled, setSmsNotificationEnabled] = useState(true);
  const [configSaved, setConfigSaved] = useState(false);

  // Stats calculation
  const totalAlerts = alerts.length;
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;
  const unreadCount = alerts.filter(a => !a.isRead).length;

  // Filtered
  const filteredAlerts = alerts.filter(a => {
    const matchesSeverity = selectedSeverity === 'All' || a.severity === selectedSeverity;
    const matchesType = selectedType === 'All Alerts' || a.type === selectedType;
    return matchesSeverity && matchesType;
  });

  const handleMarkAllRead = () => {
    setAlerts(alerts.map(a => ({ ...a, isRead: true })));
    toast.info('All operational alerts marked as read.');
  };

  const handleDismissAlert = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.info(`Alert ${id} dismissed.`);
  };

  const handleAcknowledge = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, isRead: true, actionAcknowledged: true } : a));
    toast.success(`Action acknowledged for alert ${id}. Operations team notified.`);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setConfigSaved(true);
    toast.success('Alert threshold rules updated across Northeast corridors.');
    setTimeout(() => {
      setConfigSaved(false);
      setIsConfigDrawerOpen(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-sans text-navy-950">
              Alerts
            </h1>
            <span className="text-xs bg-red-100 text-red-800 font-semibold px-2 py-0.5 rounded-full">
              {unreadCount} Unread Alerts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
            Proactive notifications for low stock, delivery delays, near-expiry medicines, and sudden demand spikes across Northeast India.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            icon={Plus}
            className="bg-navy-900 hover:bg-navy-950 text-white font-bold cursor-pointer shadow-sm"
          >
            Log Incident Alert
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleMarkAllRead}
            icon={CheckCircle2}
          >
            Mark All as Read
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setIsConfigDrawerOpen(true)}
            icon={Sliders}
          >
            Alert Thresholds
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard 
          title="Active Alerts" 
          value={totalAlerts}
          subtitle="Real-time triggers active"
          icon={Bell}
          trend={{ direction: 'neutral', text: `${unreadCount} Unread` }}
          badge={{ text: 'Live Feed', variant: 'info' }}
        />
        <StatCard 
          title="Critical Severity" 
          value={criticalCount}
          subtitle="Immediate action required"
          icon={AlertCircle}
          badge={{ text: 'Urgent', variant: 'danger' }}
        />
        <StatCard 
          title="Operational Warnings" 
          value={warningCount}
          subtitle="Transit & surge tracking"
          icon={AlertTriangle}
          badge={{ text: 'Attention', variant: 'warning' }}
        />
        <StatCard 
          title="Automated Resolutions" 
          value="14 Resolved"
          subtitle="By safety stock adjustments"
          icon={CheckCircle2}
          trend={{ direction: 'up', text: 'Auto-pilot protected' }}
          badge={{ text: 'Resolved', variant: 'success' }}
        />
      </div>

      {/* Filter Bar */}
      <div className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={selectedSeverity}
            onChange={(val) => setSelectedSeverity(val)}
            options={[
              { value: 'All', label: 'All Severities' },
              { value: 'critical', label: 'Critical Only' },
              { value: 'warning', label: 'Warning Only' },
              { value: 'info', label: 'Informational' }
            ]}
            icon={AlertTriangle}
          />

          <Select
            value={selectedType}
            onChange={(val) => setSelectedType(val)}
            options={ALERT_TYPES}
            icon={Filter}
          />
        </div>

        <div className="text-2xs text-navy-700/60">
          Showing <strong>{filteredAlerts.length}</strong> alerts
        </div>
      </div>

      {/* Alert Cards Stream */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="card p-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-navy-950 font-sans text-base">All Clear! No Active Alerts</h3>
            <p className="text-xs text-navy-700/60 max-w-md mx-auto">
              All 12 medicine warehouses and highway delivery routes are operating smoothly with no stock shortages or delays.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';

            return (
              <div 
                key={alert.id}
                className={`card p-4 transition-all border-l-4 ${
                  isCritical 
                    ? 'border-l-red-600 bg-red-50/20' 
                    : isWarning 
                      ? 'border-l-amber-500 bg-amber-50/20' 
                      : 'border-l-blue-600'
                } ${!alert.isRead ? 'shadow-sm font-medium' : 'opacity-90'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                      isCritical ? 'bg-red-100 text-red-700' : isWarning ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {isCritical ? <ShieldAlert className="w-5 h-5" /> : isWarning ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isCritical ? 'bg-red-100 text-red-800' : isWarning ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.type}
                        </span>
                        <span className="text-xs text-navy-700/60 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.timestamp}
                        </span>
                        {alert.actionAcknowledged && (
                          <span className="text-2xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                            Acknowledged
                          </span>
                        )}
                      </div>

                      <h3 className="font-sans font-bold text-navy-950 text-base mt-1">
                        {alert.title}
                      </h3>
                      <p className="text-xs text-navy-800/80 mt-1 max-w-3xl">
                        {alert.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-2xs text-navy-700/70">
                        <div className="flex items-center gap-1 font-medium text-navy-900">
                          <MapPin className="w-3.5 h-3.5 text-terracotta-600" />
                          <span>{alert.location}</span>
                        </div>
                        {alert.skuCode && (
                          <span className="font-sans bg-navy-100/70 text-navy-800 px-1.5 py-0.5 rounded">
                            SKU: {alert.skuCode}
                          </span>
                        )}
                      </div>

                      {alert.actionRequired && (
                        <div className="mt-3 p-2.5 rounded bg-white border border-navy-100/80 text-xs flex items-start gap-2">
                          <span className="font-bold text-terracotta-700 uppercase text-2xs shrink-0 mt-0.5">Required Action:</span>
                          <span className="text-navy-900">{alert.actionRequired}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-navy-100">
                    {!alert.actionAcknowledged ? (
                      <Button 
                        variant="primary" 
                        size="xs"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        Take Action
                      </Button>
                    ) : (
                      <span className="text-2xs text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Action Logged
                      </span>
                    )}

                    <button
                      onClick={() => handleDismissAlert(alert.id)}
                      className="p-1.5 rounded text-navy-700/50 hover:text-red-700 hover:bg-navy-100 transition-colors"
                      title="Dismiss Alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Threshold Configuration Drawer */}
      <Drawer
        isOpen={isConfigDrawerOpen}
        onClose={() => setIsConfigDrawerOpen(false)}
        title="Alert Thresholds & Escalation Rules"
        size="md"
      >
        <form onSubmit={handleSaveConfig} className="space-y-5 text-xs">
          {configSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Threshold parameters saved and deployed to alert trigger engine.</span>
            </div>
          )}

          <div>
            <label className="font-bold text-navy-950 block mb-1">
              Minimum Stock Cover Alert Window (Days)
            </label>
            <p className="text-2xs text-navy-700/60 mb-2">
              Triggers Critical Stockout Alert when on-hand stock falls below this threshold.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="3"
                max="14"
                value={stockCoverThreshold}
                onChange={(e) => setStockCoverThreshold(e.target.value)}
                className="w-full accent-navy-900"
              />
              <span className="font-bold text-navy-950 text-sm w-12 text-right">{stockCoverThreshold}d</span>
            </div>
          </div>

          <div>
            <label className="font-bold text-navy-950 block mb-1">
              Batch Expiry Alert Horizon (Days before expiry)
            </label>
            <p className="text-2xs text-navy-700/60 mb-2">
              Enters batch into FEFO priority liquidation queue and alerts sales director.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="30"
                max="180"
                step="15"
                value={expiryAlertHorizon}
                onChange={(e) => setExpiryAlertHorizon(e.target.value)}
                className="w-full accent-navy-900"
              />
              <span className="font-bold text-navy-950 text-sm w-12 text-right">{expiryAlertHorizon}d</span>
            </div>
          </div>

          <div>
            <label className="font-bold text-navy-950 block mb-1">
              Highway Transit Delay Escalation (Hours behind ETA)
            </label>
            <p className="text-2xs text-navy-700/60 mb-2">
              Triggers when GPS check-in or NH-27/NH-6 toll log exceeds scheduled ETA.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="6"
                max="48"
                step="6"
                value={transitDelayHours}
                onChange={(e) => setTransitDelayHours(e.target.value)}
                className="w-full accent-navy-900"
              />
              <span className="font-bold text-navy-950 text-sm w-12 text-right">{transitDelayHours}h</span>
            </div>
          </div>

          <div>
            <label className="font-bold text-navy-950 block mb-1">
              Demand Surge Anomaly Threshold (% over forecast)
            </label>
            <p className="text-2xs text-navy-700/60 mb-2">
              Flags sudden hospital outbreaks or unexpected retail spikes for urgent review.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="15"
                max="60"
                step="5"
                value={demandSurgeThreshold}
                onChange={(e) => setDemandSurgeThreshold(e.target.value)}
                className="w-full accent-navy-900"
              />
              <span className="font-bold text-navy-950 text-sm w-12 text-right">+{demandSurgeThreshold}%</span>
            </div>
          </div>

          <div className="pt-3 border-t border-navy-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={smsNotificationEnabled}
                onChange={(e) => setSmsNotificationEnabled(e.target.checked)}
                className="rounded text-navy-900 focus:ring-0"
              />
              <span className="font-medium text-navy-950">
                Dispatch WhatsApp & SMS alerts to depot managers on Critical Severity
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-navy-100 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsConfigDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Alert Thresholds
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Log Operational Incident Alert Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Publish Operational Incident Alert"
          subtitle="Broadcast a real-time risk, transit roadblock, or stockout warning to Northeast monitoring desks"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
            <div>
              <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Incident Title *
              </label>
              <input
                type="text"
                required
                value={formAlertTitle}
                onChange={(e) => setFormAlertTitle(e.target.value)}
                placeholder="e.g. NH-06 Sonapur Landslide Transport Alert"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Severity Level *
                </label>
                <select
                  value={formAlertSeverity}
                  onChange={(e) => setFormAlertSeverity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  <option value="critical">Critical (Immediate Escalation)</option>
                  <option value="warning">Warning (Operational Risk)</option>
                  <option value="info">Info (Advisory Notice)</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Alert Category *
                </label>
                <select
                  value={formAlertType}
                  onChange={(e) => setFormAlertType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer"
                >
                  <option value="Transit Delay">Transit Delay / Highway Risk</option>
                  <option value="Stock-out Risk">Stock-out Risk</option>
                  <option value="Demand Surge">Demand Surge Anomaly</option>
                  <option value="Cold Chain Breach">Cold Chain Excursion</option>
                  <option value="Batch Quality Hold">Batch Quality Hold</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Corridor / Location *
                </label>
                <input
                  type="text"
                  required
                  value={formAlertLocation}
                  onChange={(e) => setFormAlertLocation(e.target.value)}
                  placeholder="e.g. Silchar Regional Corridor (NH-06)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Affected SKU Code
                </label>
                <input
                  type="text"
                  value={formAlertSku}
                  onChange={(e) => setFormAlertSku(e.target.value)}
                  placeholder="e.g. GRD-TAB-001"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Incident Description *
              </label>
              <textarea
                required
                rows={2}
                value={formAlertDesc}
                onChange={(e) => setFormAlertDesc(e.target.value)}
                placeholder="Details of the operational occurrence..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 resize-none"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Action Required / Recommended Mitigation *
              </label>
              <input
                type="text"
                required
                value={formAlertAction}
                onChange={(e) => setFormAlertAction(e.target.value)}
                placeholder="e.g. Re-route emergency consignments via Badarpur bypass"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-navy-900 hover:bg-navy-950 text-white font-bold">
                Broadcast Alert
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
