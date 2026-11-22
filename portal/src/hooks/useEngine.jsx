import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export const DEFAULT_SCENARIO = { seed: 7, monsoon: 1, leadShock: 0, serviceBoost: 0, redistribute: true };
const STORE_KEY = 'grd_engine_scenario';
const RESULT_KEY = 'grd_engine_result_v1';

function loadCachedResult(scenario) {
  try {
    const raw = window.sessionStorage.getItem(RESULT_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    return JSON.stringify(cached.scenario) === JSON.stringify(scenario) ? cached.data : null;
  } catch {
    return null;
  }
}

const EngineContext = createContext(null);

function loadScenario() {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (raw) return { ...DEFAULT_SCENARIO, ...JSON.parse(raw) };
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_SCENARIO;
}

export function EngineProvider({ children }) {
  const workerRef = useRef(null);
  const pending = useRef(new Map());
  const seq = useRef(0);
  const seriesCache = useRef(new Map());
  const runId = useRef(0);
  const [scenario, setScenario] = useState(loadScenario);
  const scenarioRef = useRef(scenario);
  const [state, setState] = useState(() => {
    const cached = loadCachedResult(scenario);
    return { status: cached ? 'ready' : 'idle', data: cached, error: null };
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

  const run = useCallback(
    (next) => {
      const sc = { ...DEFAULT_SCENARIO, ...next };
      const myRun = ++runId.current;
      setScenario(sc);
      scenarioRef.current = sc;
      try {
        window.localStorage.setItem(STORE_KEY, JSON.stringify(sc));
      } catch {
        /* ignore */
      }
      setState((s) => ({ ...s, status: s.data ? 'refreshing' : 'running' }));
      return call('run', sc).then(
        (data) => {
          if (myRun !== runId.current) return;
          seriesCache.current.clear();
          setState({ status: 'ready', data, error: null });
          try {
            window.sessionStorage.setItem(RESULT_KEY, JSON.stringify({ scenario: sc, data }));
          } catch {
            /* quota or private mode — the cache is only a speed-up */
          }
        },
        (error) => {
          if (myRun !== runId.current) return;
          setState((s) => ({ ...s, status: 'error', error }));
        },
      );
    },
    [call],
  );

  const getSeries = useCallback(
    (key) => {
      if (!seriesCache.current.has(key)) {
        const p = call('series', { key, scenario: scenarioRef.current }).catch((e) => {
          seriesCache.current.delete(key);
          throw e;
        });
        seriesCache.current.set(key, p);
      }
      return seriesCache.current.get(key);
    },
    [call],
  );

  useEffect(() => {
    // Paint instantly from the session cache when possible; otherwise run the engine now.
    if (!state.data) run(scenario);
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({ ...state, scenario, run, getSeries }), [state, scenario, run, getSeries]);
  return <EngineContext.Provider value={value}>{children}</EngineContext.Provider>;
}

export function useEngine() {
  const ctx = useContext(EngineContext);
  if (!ctx) throw new Error('useEngine must be used inside <EngineProvider>');
  return ctx;
}
