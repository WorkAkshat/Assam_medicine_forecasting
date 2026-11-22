// Runs the forecasting engine off the main thread so the UI never stalls.
import { runEngine, seriesDetail } from './engine.js';

let lastScenario = null;
let lastUploads = null;

self.onmessage = (e) => {
  const { id, type, payload } = e.data;
  try {
    let result = null;
    if (type === 'run') {
      result = runEngine(payload.scenario, payload.uploads);
      lastScenario = JSON.stringify(payload.scenario) + (payload.uploadsVersion || '');
      lastUploads = payload.uploads;
    } else if (type === 'series') {
      // The page may have painted from a cached result; rebuild the engine state on demand.
      const sig = JSON.stringify(payload.scenario) + (payload.uploadsVersion || '');
      if (sig !== lastScenario) {
        runEngine(payload.scenario, payload.uploads ?? lastUploads);
        lastScenario = sig;
      }
      result = seriesDetail(payload.key);
    }
    self.postMessage({ id, ok: true, result });
  } catch (err) {
    self.postMessage({ id, ok: false, error: String((err && err.stack) || err) });
  }
};
