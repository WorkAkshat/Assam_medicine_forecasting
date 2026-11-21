import React, { useState } from 'react';
import {
  X,
  Bell,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Truck,
  ArrowRight,
  Check,
  MapPin,
  Activity,
  History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePersistentState } from '../../hooks/usePersistentState';
import { MOCK_ALERTS } from '../../data/mockAlerts';
import { INITIAL_ACTIVITY_LOG, STORAGE_KEYS } from '../../services/grdDataService';

export default function NotificationCenter({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [alerts, setAlerts] = usePersistentState(STORAGE_KEYS.ALERTS, MOCK_ALERTS);
  const [activityLogs] = usePersistentState(STORAGE_KEYS.ACTIVITY_LOG, INITIAL_ACTIVITY_LOG);
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' | 'activity'

  if (!isOpen) return null;

  const unresolvedAlerts = alerts.filter(a => a.status !== 'Resolved');

  const handleMarkAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, isUnread: false })));
  };

  const handleViewAll = () => {
    navigate('/alerts');
    onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-84 sm:w-[420px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">

      {/* Header Bar */}
      <div className="p-3.5 px-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-navy-900 text-white flex items-center justify-center shadow-xs shrink-0">
            <Bell className="w-4 h-4 text-terracotta-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-sans font-bold text-xs sm:text-sm text-navy-950">
                Operational Feed
              </h3>
              {unresolvedAlerts.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                  {unresolvedAlerts.length} Alerts
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500">Live operational events &amp; audit history</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Close feed"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200 bg-slate-50/50 p-1 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'alerts'
            ? 'bg-white text-navy-950 shadow-xs font-bold'
            : 'text-slate-500 hover:text-slate-800'
            }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Alerts ({unresolvedAlerts.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'activity'
            ? 'bg-white text-navy-950 shadow-xs font-bold'
            : 'text-slate-500 hover:text-slate-800'
            }`}
        >
          <History className="w-3.5 h-3.5 text-blue-500" />
          <span>Activity Log ({activityLogs.length})</span>
        </button>
      </div>

      {/* Body List */}
      <div className="max-h-[380px] overflow-y-auto p-2.5 space-y-2">
        {activeTab === 'alerts' ? (
          unresolvedAlerts.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              All alerts resolved! Supply chain operating normally.
            </div>
          ) : (
            unresolvedAlerts.slice(0, 4).map((alert) => {
              const isCritical = alert.severity === 'Critical';
              const isWarning = alert.severity === 'Warning' || alert.severity === 'High';

              return (
                <div
                  key={alert.id}
                  onClick={handleViewAll}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group relative ${isCritical
                    ? 'bg-rose-50/50 border-rose-200 hover:bg-rose-50'
                    : isWarning
                      ? 'bg-amber-50/50 border-amber-200 hover:bg-amber-50'
                      : 'bg-blue-50/50 border-blue-200 hover:bg-blue-50'
                    }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isCritical ? 'bg-rose-100 text-rose-700' : isWarning ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {isCritical && <ShieldAlert className="w-3.5 h-3.5" />}
                        {isWarning && <Clock className="w-3.5 h-3.5" />}
                        {!isCritical && !isWarning && <Truck className="w-3.5 h-3.5" />}
                      </div>
                      <span className="font-bold text-xs text-navy-950 truncate">
                        {alert.title || alert.type}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">
                      {alert.timestamp || 'Recent'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-snug pl-8">
                    {alert.summary || alert.message || alert.description}
                  </p>

                  <div className="mt-1.5 pl-8 flex items-center justify-between gap-2 text-2xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-600 truncate min-w-0">
                      <MapPin className="w-3 h-3 text-terracotta-500 shrink-0" />
                      <span className="truncate">{alert.location || 'Northeast Hub'}</span>
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-full border border-slate-200 shrink-0 whitespace-nowrap shadow-2xs">
                      {alert.skuCode || 'Multi-SKU'}
                    </span>
                  </div>
                </div>
              );
            })
          )
        ) : (
          activityLogs.slice(0, 6).map((log) => (
            <div key={log.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-navy-950 font-sans">{log.action}</span>
                <span className="text-[10px] text-slate-400">{log.timeAgo || 'Just now'}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">{log.details}</p>
              <div className="flex items-center justify-between text-2xs text-slate-400 pt-1 border-t border-slate-200/50">
                <span className="font-medium text-slate-700">{log.userName}</span>
                <span className="text-terracotta-600 font-semibold">{log.userRole}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer: View All Hub */}
      <div className="p-2.5 px-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-center">
        <button
          type="button"
          onClick={handleViewAll}
          className="w-full py-1 text-xs font-bold text-navy-900 hover:text-terracotta-600 flex items-center justify-center gap-1.5 transition-colors group cursor-pointer"
        >
          <span>View Alerts Desk ({alerts.length})</span>
          <ArrowRight className="w-3.5 h-3.5 text-terracotta-500 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

    </div>
  );
}