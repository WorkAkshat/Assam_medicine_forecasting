import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
    error: (msg, duration) => addToast(msg, 'error', duration)
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}

      {/* Floating Global Toast Container */}
      <div className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-md sm:max-w-lg w-auto pointer-events-none">
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';
          const isWarning = t.type === 'warning';

          const borderStyle = isError
            ? 'border-rose-500/40'
            : isWarning
            ? 'border-amber-500/40'
            : isSuccess
            ? 'border-emerald-500/30'
            : 'border-navy-700/80';

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-navy-900 text-white border shadow-2xl text-xs font-medium animate-in slide-in-from-top-2 fade-in duration-200 ${borderStyle}`}
            >
              <div className="shrink-0">
                {isSuccess && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
                {isError && (
                  <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                )}
                {isWarning && (
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                )}
                {!isSuccess && !isError && !isWarning && (
                  <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div className="flex-1 font-medium leading-relaxed pr-1 text-white">
                {t.message}
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="shrink-0 text-slate-300 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      toast: {
        success: (m) => console.log('[Toast Success]', m),
        info: (m) => console.log('[Toast Info]', m),
        warning: (m) => console.warn('[Toast Warning]', m),
        error: (m) => console.error('[Toast Error]', m)
      }
    };
  }
  return context;
}
