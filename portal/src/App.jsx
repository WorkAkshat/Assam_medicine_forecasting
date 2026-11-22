import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { SyncProvider } from './hooks/useSyncStatus';
import { ToastProvider } from './hooks/useToast';
import { EngineProvider } from './hooks/useEngine';
import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './components/common/ScrollToTop';
import ErrorBoundary from './components/common/ErrorBoundary';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SyncProvider>
          <ToastProvider>
            <EngineProvider>
              <ScrollToTop />
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </EngineProvider>
          </ToastProvider>
        </SyncProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
