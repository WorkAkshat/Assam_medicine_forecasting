import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

// Fixed world parameters for the built-in sample data; planners only change planning settings.
const BASE = { seed: 7, monsoon: 1, leadShock: 0 };
export const DEFAULT_SETTINGS = { serviceBoost: 0, redistribute: true };

const SETTINGS_KEY = 'grd_planning_settings_v1';
const UPLOADS_KEY = 'grd_uploads_v1';
const RESULT_KEY = 'grd_engine_result_v2';

const EngineContext = createContext(null);

function read(storage, key, fallback) {
  try {
    const raw = window[storage].getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write(storage, key, value) {
  try {
    if (value == null) window[storage].removeItem(key);
    else window[storage].setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

const EMPTY_UPLOADS = { sales: [], stock: [], files: [], version: '' };

export function EngineProvider({ children }) {
  const workerRef = useRef(null);
  const pending = useRef(new Map());
  const seq = useRef(0);
  const seriesCache = useRef(new Map());
  const runId = useRef(0);
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS, ...read('localStorage', SETTINGS_KEY, {}) }));
  const [uploads, setUploadsState] = useState(() => read('localStorage', UPLOADS_KEY, EMPTY_UPLOADS));
  const scenarioRef = useRef({ ...BASE, ...settings });
  const uploadsRef = useRef(uploads);
  const cacheSig = (sc, up) => JSON.stringify(sc) + (up?.version || '');
  const [state, setState] = useState(() => {
    const cached = read('sessionStorage', RESULT_KEY, null);
    const ok = cached && cached.sig === cacheSig({ ...BASE, ...settings }, uploads);
    return { status: ok ? 'ready' : 'idle', data: ok ? cached.data : null, error: null };
  });

  const call = useCallback((type, payload) => {
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('../engine/engine.worker.js', import.meta.url), { type: 'module' });
      workerRef.current.onmessage = (e) => {
        const { id, ok, result, error } = e.data;
        const p = pending.current.get(id);
        if (!p) return;
        pending.current.delete(id);
        if (ok) p.resolve(result);
        else p.reject(new Error(error));
      };
    }
    const id = ++seq.current;
    return new Promise((resolve, reject) => {
      pending.current.set(id, { resolve, reject });
      workerRef.current.postMessage({ id, type, payload });
    });
  }, []);

  const execute = useCallback(
    (nextSettings, nextUploads) => {
      const sc = { ...BASE, ...nextSettings };
      const up = nextUploads;
      scenarioRef.current = sc;
      uploadsRef.current = up;
      const myRun = ++runId.current;
      setState((s) => ({ ...s, status: s.data ? 'refreshing' : 'running' }));
      return call('run', { scenario: sc, uploads: up, uploadsVersion: up.version }).then(
        (data) => {
          if (myRun !== runId.current) return;
          seriesCache.current.clear();
          setState({ status: 'ready', data, error: null });
          write('sessionStorage', RESULT_KEY, { sig: cacheSig(sc, up), data });
        },
        (error) => {
          if (myRun !== runId.current) return;
          setState((s) => ({ ...s, status: 'error', error }));
        },
      );
    },
    [call],
  );

  const updateSettings = useCallback(
    (patch) => {
      const next = { ...settings, ...patch };
      setSettings(next);
      write('localStorage', SETTINGS_KEY, next);
      return execute(next, uploadsRef.current);
    },
    [settings, execute],
  );

  /** Replace or merge GRD's own data, then re-run the engine on it. */
  const setUploads = useCallback(
    (next) => {
      const up = { ...EMPTY_UPLOADS, ...next, version: String(Date.now()) };
      setUploadsState(up);
      const stored = write('localStorage', UPLOADS_KEY, up);
      execute(settings, up);
      return stored;
    },
    [settings, execute],
  );

  const getSeries = useCallback(
    (key) => {
      if (!seriesCache.current.has(key)) {
        const p = call('series', { key, scenario: scenarioRef.current, uploads: uploadsRef.current, uploadsVersion: uploadsRef.current.version }).catch((e) => {
          seriesCache.current.delete(key);
          throw e;
        });
        seriesCache.current.set(key, p);
      }
      return seriesCache.current.get(key);
    },
    [call],
  );

  const refresh = useCallback(() => execute(settings, uploadsRef.current), [execute, settings]);

  useEffect(() => {
    if (!state.data) execute(settings, uploads);
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ ...state, settings, updateSettings, uploads, setUploads, refresh, getSeries }),
    [state, settings, updateSettings, uploads, setUploads, refresh, getSeries],
  );
  return <EngineContext.Provider value={value}>{children}</EngineContext.Provider>;
}

export function useEngine() {
  const ctx = useContext(EngineContext);
  if (!ctx) throw new Error('useEngine must be used inside <EngineProvider>');
  return ctx;
}
