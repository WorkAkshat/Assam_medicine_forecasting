// Runs the forecasting engine off the main thread so the UI never stalls.
import { runEngine, seriesDetail } from './engine.js';

let lastScenario = null;

self.onmessage = (e) => {
  const { id, type, payload } = e.data;
  try {
    let result = null;
    if (type === 'run') {
      result = runEngine(payload);
      lastScenario = JSON.stringify(payload);
    } else if (type === 'series') {
      // The page may have painted from a cached result; rebuild the engine state on demand.
      if (JSON.stringify(payload.scenario) !== lastScenario) {
        runEngine(payload.scenario);
        lastScenario = JSON.stringify(payload.scenario);
      }
      result = seriesDetail(payload.key);
    }
    self.postMessage({ id, ok: true, result });
  } catch (err) {
    self.postMessage({ id, ok: false, error: String((err && err.stack) || err) });
  }
};
