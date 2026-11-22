import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { RefreshBar } from '../engine/ui';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import RoleSwitcher from './RoleSwitcher';
import { useAuth } from '../../hooks/useAuth';

export default function PortalLayout() {
  const { currentRole } = useAuth();
  const prevRoleRef = useRef(currentRole);
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Automatically open the 1st page (/dashboard) of the newly switched role
  useEffect(() => {
    if (prevRoleRef.current && prevRoleRef.current !== currentRole) {
      navigate('/dashboard');
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    prevRoleRef.current = currentRole;
  }, [currentRole, navigate]);

  // Close mobile sidebar whenever location changes (user navigates to another page)
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-mist-100 flex flex-col font-sans overflow-x-hidden">
      <RefreshBar />
      
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(prev => !prev)}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-in fade-in duration-200">
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            aria-label="Close sidebar drawer"
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] z-50 shadow-2xl animate-in slide-in-from-left duration-250">
            <Sidebar
              isCollapsed={false}
              onToggle={() => setIsMobileSidebarOpen(false)}
              onItemClick={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main App Container */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
      }`}>
        <Topbar
          onMobileToggle={() => setIsMobileSidebarOpen(prev => !prev)}
          onRoleModalToggle={() => setIsRoleModalOpen(true)}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 w-full space-y-6 min-w-0">
          <Suspense
            fallback={
              <div className="space-y-4" aria-busy="true">
                <div className="h-8 w-64 rounded-md bg-mist-200 animate-pulse" />
                <div className="h-48 rounded-lg border border-mist-300/70 bg-white animate-pulse" />
              </div>
            }
          >
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </Suspense>
        </main>

        {/* Global Footer */}
        <footer className="border-t border-mist-300/80 bg-white/70 py-3.5 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-navy-900">GRD Pharmaceuticals</span>
            <span>&bull;</span>
            <span>A Unit of Dhanuka Group</span>
            <span>&bull;</span>
            <span className="font-sans text-terracotta-600 font-semibold">NESFIC-I-09 Pilot</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Demand and replenishment decision support for the Northeast · synthetic data for the application stage
          </p>
        </footer>
      </div>

      {/* Global Modals / Slide-outs */}
      <RoleSwitcher
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />

    </div>
  );
}
