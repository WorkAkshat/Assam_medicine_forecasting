import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { MOCK_USERS } from '../../data/mockUsers';
import {
  Check,
  ShieldCheck,
  Building,
  Truck,
  Store,
  Briefcase,
  ArrowRight,
  Shield,
  Layers,
  CheckCircle2
} from 'lucide-react';

const ROLE_DETAILS = {
  'super-admin': {
    icon: ShieldCheck,
    title: 'Super Admin',
    theme: 'bg-purple-900 text-white',
    badge: 'bg-purple-100 text-purple-800 border-purple-200',
    scope: 'Enterprise IT, Master SKU Catalog, System Security & Governance',
    keyPermissions: [
      'Full administrative access to all 8 Northeast states',
      'Manage medicine formulary (create, edit, archive SKUs)',
      'Manage user roles, credentials, and security audit trail',
      'Access raw data import/export engine & database sync',
      'System-wide emergency override and parameter tuning'
    ]
  },
  'management': {
    icon: Briefcase,
    title: 'Management / Executive',
    theme: 'bg-navy-900 text-white',
    badge: 'bg-navy-100 text-navy-800 border-navy-200',
    scope: 'GR Dhanuka Group Boardroom, Capital Allocation & Policy',
    keyPermissions: [
      'High-level executive briefing & pilot KPI governance',
      'State healthcare availability index monitoring',
      'Working capital optimization & stockout avoidance metrics',
      'Commercial contract review & institutional revenue tracking',
      'Long-term Northeast pharmaceutical expansion planning'
    ]
  },
  'sales-manager': {
    icon: Building,
    title: 'Sales Director',
    theme: 'bg-amber-800 text-white',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    scope: 'Commercial Trade, Hospital Tenders & Field Medical Reps',
    keyPermissions: [
      'Commercial demand forecasts & monthly territory quotas',
      'Review & authorize hospital tender credit limits (e.g. GMCH, SMCH)',
      'Monitor field force medical representative doctor detailing visits',
      'Analyze medicine brand margins, trade pricing, and commercial sales',
      'Track institutional accounts and retail pharmacy network'
    ]
  },
  'supply-chain-manager': {
    icon: Truck,
    title: 'Supply Chain Manager',
    theme: 'bg-blue-900 text-white',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    scope: 'Guwahati Mother Hub & 12 Northeast Depots Logistics',
    keyPermissions: [
      'Authorize automated predictive replenishment recommendations',
      'Schedule inter-depot stock transfers from surplus to deficit hubs',
      'Monitor real-time cold chain temperature & GPS truck telemetry',
      'Coordinate inward batch transfers from Rani formulation plant',
      'Prevent medicine stockouts with proactive safety buffers'
    ]
  },
  'warehouse-staff': {
    icon: Store,
    title: 'Warehouse Controller',
    theme: 'bg-emerald-800 text-white',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    scope: 'Rani cGMP Formulation Plant Warehouse & Dispatch Docks',
    keyPermissions: [
      'Log finished formulation production batches (Schedule M compliant)',
      'Issue dock dispatch gate passes & assign transporter trucks',
      'Manage ambient, cold chain (2-8°C), and quarantine storage zones',
      'Conduct physical cycle count audits & log discrepancies',
      'Clear staged shipments for road transport across NH-27/NH-6'
    ]
  },
  'distributor': {
    icon: Building,
    title: 'Distributor Partner',
    theme: 'bg-teal-900 text-white',
    badge: 'bg-teal-100 text-teal-800 border-teal-200',
    scope: 'Wholesale Depot Indents & Retail Pharmacy Distribution',
    keyPermissions: [
      'Place direct bulk stock purchase orders with Guwahati Mother Depot',
      'View real-time depot stock availability before ordering',
      'Track dispatched delivery trucks with ETA estimates',
      'Confirm physical delivery receipts & update godown inventory',
      'Generate GST-compliant tax invoices & review credit ledger'
    ]
  }
};

export default function RoleSwitcher({ isOpen, onClose }) {
  const { currentRole, switchRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSelectRole = (roleId, userName, roleName) => {
    switchRole(roleId);
    navigate('/dashboard');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    onClose();
    toast.success(`Switched perspective to ${userName} (${roleName})`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Role Permissions & Access Guide"
      subtitle="Comprehensive matrix of the 6 core operational perspectives under NESFIC-I-09"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-600 font-light leading-relaxed">
          The NESFIC-I-09 framework provides role-based access control across all pharmaceutical workflows. Review the capabilities, operational territory, and primary responsibilities for each persona below, or switch directly into any simulated perspective:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {MOCK_USERS.map((user) => {
            const isSelected = currentRole === user.roleId;
            const details = ROLE_DETAILS[user.roleId] || {};
            const Icon = details.icon || Shield;

            return (
              <div
                key={user.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-navy-950 text-white border-navy-900 shadow-md ring-2 ring-navy-900/10'
                    : 'bg-white hover:bg-slate-50/80 border-slate-200/90 shadow-2xs'
                }`}
              >
                <div>
                  {/* Persona Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : details.theme
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className={`font-bold text-sm leading-tight truncate ${isSelected ? 'text-white' : 'text-navy-950'}`}>
                          {user.name}
                        </h4>
                        <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {user.department} • {user.location}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      isSelected 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' 
                        : details.badge
                    }`}>
                      {isSelected ? '✓ Active' : user.roleName}
                    </span>
                  </div>

                  {/* Scope of Responsibility */}
                  <div className="mt-3">
                    <p className={`text-2xs font-bold uppercase tracking-wider ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                      Operational Scope
                    </p>
                    <p className={`text-xs mt-0.5 font-medium leading-relaxed ${isSelected ? 'text-slate-200' : 'text-slate-700'}`}>
                      {details.scope}
                    </p>
                  </div>

                  {/* Key Capabilities */}
                  <div className="mt-3 space-y-1.5">
                    <p className={`text-2xs font-bold uppercase tracking-wider ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                      Key Privileges &amp; Actions
                    </p>
                    <ul className="space-y-1 text-2xs">
                      {details.keyPermissions?.map((perm, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug">
                          <CheckCircle2 className={`w-3 h-3 shrink-0 mt-0.5 ${isSelected ? 'text-emerald-400' : 'text-emerald-600'}`} />
                          <span className={isSelected ? 'text-slate-300' : 'text-slate-600'}>{perm}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Switch Action */}
                <div className="pt-3 border-t border-slate-200/40 flex items-center justify-between">
                  <span className={`text-2xs ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                    ID: {user.id}
                  </span>

                  {isSelected ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Currently Active
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectRole(user.roleId, user.name, user.roleName)}
                      className="px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs hover:translate-x-0.5"
                    >
                      <span>Switch Perspective</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Active Perspective: <strong className="text-navy-950 font-bold">{MOCK_USERS.find(u => u.roleId === currentRole)?.name} ({MOCK_USERS.find(u => u.roleId === currentRole)?.roleName})</strong></span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">6 Organizational Personas</span>
        </div>
      </div>
    </Modal>
  );
}
