import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';
import { EngineProvider } from './hooks/useEngine';
import { RoleProvider } from './hooks/useRole';
import AppShell from './components/layout/AppShell';
import ErrorBoundary from './components/common/ErrorBoundary';

const Overview = lazy(() => import('./pages/Overview'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Replenishment = lazy(() => import('./pages/Replenishment'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Expiry = lazy(() => import('./pages/Expiry'));
const Demand = lazy(() => import('./pages/Demand'));
const ForecastDetail = lazy(() => import('./pages/ForecastDetail'));
const Network = lazy(() => import('./pages/Network'));
const Medicines = lazy(() => import('./pages/Medicines'));
const Performance = lazy(() => import('./pages/Performance'));
const DataSources = lazy(() => import('./pages/DataSources'));
const Settings = lazy(() => import('./pages/Settings'));

export default function App() {
  return (
    <BrowserRouter>
      <RoleProvider>
        <ToastProvider>
          <EngineProvider>
            <ErrorBoundary>
              <Routes>
                <Route element={<AppShell />}>
                  <Route index element={<Overview />} />
                  <Route path="alerts" element={<Alerts />} />
                  <Route path="replenishment" element={<Replenishment />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="expiry" element={<Expiry />} />
                  <Route path="demand" element={<Demand />} />
                  <Route path="demand/series" element={<ForecastDetail />} />
                  <Route path="network" element={<Network />} />
                  <Route path="medicines" element={<Medicines />} />
                  <Route path="performance" element={<Performance />} />
                  <Route path="data" element={<DataSources />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </ErrorBoundary>
          </EngineProvider>
        </ToastProvider>
      </RoleProvider>
    </BrowserRouter>
  );
}
