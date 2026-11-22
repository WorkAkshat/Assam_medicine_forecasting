import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Truck, 
  Users, 
  Warehouse, 
  ExternalLink,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const QUICK_ROLES = [
  {
    roleId: 'supply-chain-manager',
    roleName: 'Supply Chain Manager',
    user: 'Dr. Abhijit Sarma',
    email: 'abhijit.sarma@grdpharma.in',
    depot: 'Guwahati Mother Warehouse',
    icon: Truck,
    badge: 'Operations Desk'
  },
  {
    roleId: 'management',
    roleName: 'Executive Leadership',
    user: 'Gautam R. Dhanuka',
    email: 'gautam.dhanuka@grdpharma.in',
    depot: 'Guwahati Corporate HQ',
    icon: Building2,
    badge: 'Board & Governance'
  },
  {
    roleId: 'warehouse-staff',
    roleName: 'Warehouse Controller',
    user: 'Pranabesh Bora',
    email: 'pranabesh.bora@grdpharma.in',
    depot: 'Rani cGMP Plant',
    icon: Warehouse,
    badge: 'Production & Batches'
  },
  {
    roleId: 'distributor',
    roleName: 'Distributor Desk',
    user: 'Bipul Goswami',
    email: 'bipul@pragjyotishmedico.in',
    depot: 'Assam & Barak C&F',
    icon: Users,
    badge: 'Channel Partner'
  }
];

const PORTAL_BASE_URL = import.meta.env.VITE_PORTAL_URL || 'http://localhost:5175';

export default function PortalLoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('abhijit.sarma@grdpharma.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);

  if (!isOpen) return null;

  const handleSelectRole = (index) => {
    setSelectedRoleIndex(index);
    setEmail(QUICK_ROLES[index].email);
    setPassword('GRD-Secure-2026!');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const activeRole = QUICK_ROLES[selectedRoleIndex]?.roleId || 'supply-chain-manager';
    const targetUrl = `${PORTAL_BASE_URL}/dashboard?role=${activeRole}`;

    setTimeout(() => {
      setIsLoading(false);
      setLoginSuccess(true);
      setTimeout(() => {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
        setLoginSuccess(false);
        onClose();
      }, 400);
    }, 400);
  };

  const handleDirectLaunch = () => {
    const activeRole = QUICK_ROLES[selectedRoleIndex]?.roleId || 'supply-chain-manager';
    window.open(`${PORTAL_BASE_URL}/dashboard?role=${activeRole}`, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-navy-100 overflow-hidden z-10 my-8"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-navy-950 text-white p-6 sm:p-7 relative overflow-hidden">
            {/* Luminous Top Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-terracotta-500 via-terracotta-400 to-terracotta-600" />
            
            {/* Subtle background glow */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-terracotta-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-bold tracking-widest text-terracotta-400 uppercase font-sans">
                    NESFIC-I-09 · Stream 1 Solution
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                    PharmaPredict <span className="text-terracotta-400">AI</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-navy-800 text-terracotta-300 border border-terracotta-500/30">
                    Staff Portal
                  </span>
                </div>
                <p className="text-xs text-navy-200/80 leading-relaxed max-w-md">
                  Secure access for GR Dhanuka Group supply-chain teams, Rani formulation plant, and certified Northeast distributors.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-7 space-y-5 bg-[#FCFDFD]">
            {/* Persona Quick Select */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-navy-900">
                  Quick Role Pre-fill
                </span>
                <span className="text-[11px] text-gray-500">Click to switch login profile</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ROLES.map((r, idx) => {
                  const Icon = r.icon;
                  const isSelected = selectedRoleIndex === idx;
                  return (
                    <button
                      key={r.roleName}
                      type="button"
                      onClick={() => handleSelectRole(idx)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-navy-50/90 border-navy-900 shadow-xs ring-1 ring-navy-900' 
                          : 'bg-white border-navy-100 hover:border-navy-300 hover:bg-navy-50/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-navy-900 text-white' : 'bg-navy-100 text-navy-800'
                        }`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold text-navy-950 truncate">{r.roleName}</div>
                          <div className="text-[10px] text-gray-500 truncate">{r.user}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 pt-1">
              {loginSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-950 text-sm">Authenticated Successfully</h4>
                  <p className="text-xs text-emerald-700">Opening PharmaPredict AI Portal on port 5175...</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                      Work Email / Portal ID
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent transition-all bg-white"
                        placeholder="username@grdpharma.in"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-navy-900">
                        Password
                      </label>
                      <a 
                        href="#forgot" 
                        onClick={(e) => { e.preventDefault(); alert('Please contact IT Helpdesk at support@grdpharma.in or Guwahati HQ.'); }}
                        className="text-[11px] text-terracotta-600 hover:text-terracotta-700 font-medium"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent transition-all bg-white font-sans"
                        placeholder="••••••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-gray-300 text-navy-900 focus:ring-navy-900"
                      />
                      <span className="text-xs text-gray-600">Keep session active on this workstation</span>
                    </label>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-full bg-navy-900 hover:bg-navy-950 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy-800 focus:ring-offset-2"
                    >
                      {isLoading ? (
                        <span>Authenticating Credentials...</span>
                      ) : (
                        <>
                          <span>Sign In to PharmaPredict Portal</span>
                          <ArrowRight className="w-4 h-4 text-terracotta-400" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleDirectLaunch}
                      className="w-full py-2.5 rounded-full bg-terracotta-50 hover:bg-terracotta-100 text-terracotta-700 font-semibold text-xs flex items-center justify-center gap-1.5 border border-terracotta-200 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Direct Open Portal (http://localhost:5175)</span>
                    </button>
                  </div>
                </>
              )}
            </form>

            {/* Bottom Security Assurance */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                256-bit TLS Encrypted
              </span>
              <span>GRD Pharmaceuticals IT Services</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
