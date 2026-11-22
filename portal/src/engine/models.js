// Forecasting model zoo. All models forecast weekly units for one SKU × location series.
import { SIGNALS } from './catalog.js';

export const MODELS = [
  { id: 'manual', name: 'Manual rule (4-week average)', short: 'Manual', baseline: true },
  { id: 'snaive', name: 'Same week last year', short: 'Last year' },
  { id: 'ses', name: 'Exponential smoothing', short: 'Smoothing' },
  { id: 'croston', name: 'Croston–SBA (intermittent)', short: 'Croston' },
  { id: 'signal', name: 'Signal-aware regression', short: 'Signal' },
];

export function manualForecast(y, o, H) {
  let s = 0;
  let n = 0;
  for (let i = Math.max(0, o - 4); i < o; i += 1) {
    s += y[i];
    n += 1;
  }
  return new Float64Array(H).fill(n ? s / n : 0);
}

export function snaiveForecast(y, o, H) {
  const out = new Float64Array(H);
  const fallback = manualForecast(y, o, 1)[0];
  for (let h = 0; h < H; h += 1) {
    const i = o + h - 52;
    if (i < 0) {
      out[h] = fallback;
      continue;
    }
    // Light smoothing over neighbouring weeks of last year
    let s = 0;
    let n = 0;
    for (let k = -1; k <= 1; k += 1) {
      const j = i + k;
      if (j >= 0 && j < o) {
        s += y[j] * (k === 0 ? 2 : 1);
        n += k === 0 ? 2 : 1;
      }
    }
    out[h] = n ? s / n : fallback;
  }
  return out;
}

export function sesForecast(y, o, H, alpha = 0.25) {
  let level = 0;
  const init = Math.min(8, o);
  for (let i = 0; i < init; i += 1) level += y[i] / init;
  for (let i = init; i < o; i += 1) level += alpha * (y[i] - level);
  return new Float64Array(H).fill(Math.max(0, level));
}

export function crostonForecast(y, o, H, alpha = 0.12) {
  let z = 0;
  let p = 1;
  let q = 1;
  let started = false;
  for (let i = 0; i < o; i += 1) {
    if (y[i] > 0) {
      if (!started) {
        z = y[i];
        p = q;
        started = true;
      } else {
        z += alpha * (y[i] - z);
        p += alpha * (q - p);
      }
      q = 1;
    } else {
      q += 1;
    }
  }
  const f = started ? (1 - alpha / 2) * (z / p) : 0;
  return new Float64Array(H).fill(Math.max(0, f));
}

// ---------- Signal-aware ridge regression ----------

export const FEATURE_GROUPS = ['intercept', 'trend', 'season', 'season', 'season', 'season', ...SIGNALS];
const K = FEATURE_GROUPS.length;

function featureRow(out, w, phase, sig) {
  const a = 2 * Math.PI * phase;
  out[0] = 1;
  out[1] = w / 52;
  out[2] = Math.sin(a);
  out[3] = Math.cos(a);
  out[4] = Math.sin(2 * a);
  out[5] = Math.cos(2 * a);
  for (let j = 0; j < SIGNALS.length; j += 1) out[6 + j] = sig[SIGNALS[j]][w];
  return out;
}

function solve(A, b, n) {
  // Gaussian elimination with partial pivoting; A is n×n row-major Float64Array (mutated).
  for (let c = 0; c < n; c += 1) {
    let piv = c;
    for (let r = c + 1; r < n; r += 1) if (Math.abs(A[r * n + c]) > Math.abs(A[piv * n + c])) piv = r;
    if (piv !== c) {
      for (let k = 0; k < n; k += 1) {
        const t = A[c * n + k];
        A[c * n + k] = A[piv * n + k];
        A[piv * n + k] = t;
      }
      const t = b[c];
      b[c] = b[piv];
      b[piv] = t;
    }
    const d = A[c * n + c] || 1e-9;
    for (let r = c + 1; r < n; r += 1) {
      const f = A[r * n + c] / d;
      if (f === 0) continue;
      for (let k = c; k < n; k += 1) A[r * n + k] -= f * A[c * n + k];
      b[r] -= f * b[c];
    }
  }
  const x = new Float64Array(n);
  for (let r = n - 1; r >= 0; r -= 1) {
    let s = b[r];
    for (let k = r + 1; k < n; k += 1) s -= A[r * n + k] * x[k];
    x[r] = s / (A[r * n + r] || 1e-9);
  }
  return x;
}

/**
 * Fit on weeks [0, o) using actual signals, then forecast weeks [o, o+H) using the signals
 * that would be *expected* at the origin (climatology + calendar) — no look-ahead.
 */
export function fitSignalModel(y, o, phases, sigActual, lambda = 2) {
  const start = Math.max(0, o - 156);
  const XtX = new Float64Array(K * K);
  const Xty = new Float64Array(K);
  const row = new Float64Array(K);
  const mean = new Float64Array(K);
  const n = o - start;
  for (let w = start; w < o; w += 1) {
    featureRow(row, w, phases[w], sigActual);
    const t = Math.log1p(y[w]);
    for (let i = 0; i < K; i += 1) {
      mean[i] += row[i] / n;
      Xty[i] += row[i] * t;
      for (let j = i; j < K; j += 1) XtX[i * K + j] += row[i] * row[j];
    }
  }
  for (let i = 0; i < K; i += 1) {
    for (let j = 0; j < i; j += 1) XtX[i * K + j] = XtX[j * K + i];
    if (i > 0) XtX[i * K + i] += lambda;
  }
  const beta = solve(XtX, Xty, K);
  // Residuals for level correction + smearing
  let smear = 0;
  const resid = [];
  for (let w = start; w < o; w += 1) {
    featureRow(row, w, phases[w], sigActual);
    let eta = 0;
    for (let i = 0; i < K; i += 1) eta += beta[i] * row[i];
    const r = Math.log1p(y[w]) - eta;
    resid.push(r);
    smear += Math.exp(r) / n;
  }
  const last = resid.slice(-4);
  const level = last.reduce((a, b) => a + b, 0) / Math.max(1, last.length);
  return { beta, smear, level, mean, origin: o };
}

/** Re-anchor a fitted model to the latest actuals (cheap weekly update without refitting). */
export function withLevelAt(model, y, w, phases, sigActual) {
  const row = new Float64Array(K);
  let s = 0;
  let n = 0;
  for (let t = Math.max(0, w - 4); t < w; t += 1) {
    featureRow(row, t, phases[t], sigActual);
    let eta = 0;
    for (let i = 0; i < K; i += 1) eta += model.beta[i] * row[i];
    s += Math.log1p(y[t]) - eta;
    n += 1;
  }
  return { ...model, level: n ? s / n : model.level };
}

/** In-sample weekly error (units) over the last 52 training weeks. */
export function modelSigma(model, y, o, phases, sigActual) {
  const row = new Float64Array(K);
  let ss = 0;
  let n = 0;
  for (let t = Math.max(0, o - 52); t < o; t += 1) {
    featureRow(row, t, phases[t], sigActual);
    let eta = 0;
    for (let i = 0; i < K; i += 1) eta += model.beta[i] * row[i];
    const f = Math.max(0, Math.exp(eta) * model.smear - 1);
    ss += (y[t] - f) ** 2;
    n += 1;
  }
  return Math.sqrt(ss / Math.max(1, n));
}

export function signalForecast(model, o, H, phases, sigExpected, withContrib = false) {
  const out = new Float64Array(H);
  const row = new Float64Array(K);
  const contrib = withContrib ? new Float64Array(K) : null;
  let levelSum = 0;
  for (let h = 0; h < H; h += 1) {
    const w = o + h;
    featureRow(row, w, phases[w], sigExpected);
    let eta = 0;
    for (let i = 0; i < K; i += 1) eta += model.beta[i] * row[i];
    const corr = model.level * 0.85 ** (h + 1);
    levelSum += corr / H;
    out[h] = Math.max(0, Math.exp(eta + corr) * model.smear - 1);
    if (contrib) for (let i = 1; i < K; i += 1) contrib[i] += (model.beta[i] * (row[i] - model.mean[i])) / H;
  }
  if (!contrib) return { forecast: out };
  // Collapse into named drivers (log-effects → % uplift vs the series' typical week)
  const groups = {};
  for (let i = 1; i < K; i += 1) {
    const g = FEATURE_GROUPS[i];
    groups[g] = (groups[g] || 0) + contrib[i];
  }
  groups.level = levelSum;
  const drivers = Object.entries(groups)
    .map(([id, e]) => ({ id, effect: Math.exp(e) - 1 }))
    .filter((d) => Math.abs(d.effect) > 0.005)
    .sort((a, b) => Math.abs(b.effect) - Math.abs(a.effect));
  return { forecast: out, drivers };
}
