// Synthetic Northeast India demand + signal generator.
// Encodes monsoon, Brahmaputra floods, vector-borne disease seasons, winter respiratory illness,
// national deworming days and festival effects, plus level shifts and intermittent demand.
import { LOCATIONS, SKUS, SIGNALS, HISTORY_WEEKS, HORIZON, yearPhase, weekYear, weekDate } from './catalog.js';
import { mulberry32, normal, poisson, gamma } from './rng.js';

const TOTAL = HISTORY_WEEKS + HORIZON;

const circ = (p, c) => {
  let d = Math.abs(p - c) % 1;
  return d > 0.5 ? 1 - d : d;
};
const bump = (p, c, w) => Math.exp(-0.5 * (circ(p, c) / w) ** 2);

// Durga Puja Dashami dates (UTC) — shops and depots close around these days.
const PUJA = [Date.UTC(2023, 9, 24), Date.UTC(2024, 9, 12), Date.UTC(2025, 9, 2), Date.UTC(2026, 9, 20), Date.UTC(2027, 9, 9)];

function festivalFlags(w) {
  const t0 = weekDate(w).getTime();
  const t1 = t0 + 7 * 86400000;
  let during = 0;
  let pre = 0;
  for (const d of PUJA) {
    if (d - 3 * 86400000 < t1 && d >= t0) during = 1;
    if (d - 10 * 86400000 < t1 && d - 3 * 86400000 >= t0) pre = 1;
  }
  const y = weekDate(w).getUTCFullYear();
  const bihu = Date.UTC(y, 3, 14);
  if (bihu >= t0 && bihu < t1) during = Math.max(during, 0.6);
  if (bihu - 7 * 86400000 >= t0 && bihu - 7 * 86400000 < t1) pre = Math.max(pre, 0.5);
  return { pre, during };
}

const rainClim = (p) => 0.08 + 0.92 * bump(p, 0.53, 0.085) + 0.22 * bump(p, 0.36, 0.05);
const dengueClim = (p) => bump(p, 0.7, 0.05);
const respClim = (p) => bump(p, 0.03, 0.065) + 0.3 * bump(p, 0.88, 0.035);
const allergyClim = (p) => bump(p, 0.22, 0.05);
const dewormClim = (p) => bump(p, 0.1, 0.014) + bump(p, 0.595, 0.014);
const floodClim = (p) => 0.42 * bump(p, 0.53, 0.06);

/**
 * Build the full synthetic world for a scenario.
 * @param {{seed:number, monsoon:number, leadShock:number}} scenario
 */
export function generateWorld(scenario) {
  const { seed = 7, monsoon = 1 } = scenario;
  const rand = mulberry32(seed);

  // Year-level severities
  const years = {};
  for (let y = 2023; y <= 2028; y += 1) {
    const waves = [];
    const n = 1 + Math.floor(rand() * 3);
    for (let i = 0; i < n; i += 1) waves.push({ c: 0.44 + rand() * 0.18, sev: 0.4 + rand() * 0.9 });
    years[y] = {
      monsoon: 0.75 + rand() * 0.55,
      dengue: 0.6 + rand() * 0.9,
      resp: 0.7 + rand() * 0.6,
      waves,
    };
  }

  const phases = new Float64Array(TOTAL);
  const fest = [];
  for (let w = 0; w < TOTAL; w += 1) {
    phases[w] = yearPhase(w);
    fest.push(festivalFlags(w));
  }

  // signals[locIdx] = { actual: {sig: Float32Array}, expected: {sig: Float32Array}, disruption: Float32Array }
  const signals = LOCATIONS.map((loc) => {
    const actual = {};
    const expected = {};
    SIGNALS.forEach((s) => {
      actual[s] = new Float32Array(TOTAL);
      expected[s] = new Float32Array(TOTAL);
    });
    const disruption = new Float32Array(TOTAL);
    const lr = mulberry32(seed * 31 + loc.id.charCodeAt(0) * 7 + loc.id.charCodeAt(2));
    for (let w = 0; w < TOTAL; w += 1) {
      const p = phases[w];
      const Y = years[weekYear(w)];
      const rainA = Math.max(0, rainClim(p) * Y.monsoon * monsoon * (1 + 0.22 * normal(lr)));
      let flood = 0;
      for (const wave of Y.waves) flood += wave.sev * bump(p, wave.c, 0.022);
      flood = Math.min(1.6, flood * Y.monsoon * monsoon) * loc.flood;
      actual.rain[w] = rainA;
      expected.rain[w] = rainClim(p) * monsoon;
      actual.flood[w] = flood;
      expected.flood[w] = floodClim(p) * monsoon * loc.flood;
      actual.dengue[w] = dengueClim(p) * Y.dengue * loc.urban;
      expected.dengue[w] = dengueClim(p) * loc.urban;
      actual.resp[w] = respClim(p) * Y.resp;
      expected.resp[w] = respClim(p);
      actual.allergy[w] = allergyClim(p);
      expected.allergy[w] = allergyClim(p);
      actual.deworm[w] = dewormClim(p);
      expected.deworm[w] = dewormClim(p);
      actual.festPre[w] = fest[w].pre;
      expected.festPre[w] = fest[w].pre;
      actual.festDuring[w] = fest[w].during;
      expected.festDuring[w] = fest[w].during;
      // Bandhs, landslides and highway blockades — rare, local, hit lead time not demand.
      const hillRisk = loc.leadSd / 2.6;
      disruption[w] = lr() < 0.012 + 0.03 * hillRisk * rainClim(p) ? 2 + lr() * 5 : 0;
    }
    // Derived signals that depend on lagged rain / flood
    for (let w = 0; w < TOTAL; w += 1) {
      let ra = 0;
      let re = 0;
      for (let k = 2; k <= 5; k += 1) {
        const i = Math.max(0, w - k);
        ra += actual.rain[i];
        re += expected.rain[i];
      }
      actual.malaria[w] = loc.malaria * (0.15 + 0.85 * (ra / 4));
      expected.malaria[w] = loc.malaria * (0.15 + 0.85 * (re / 4));
      actual.diarrhoea[w] = 0.15 + 0.45 * actual.rain[w] + 1.1 * actual.flood[w];
      expected.diarrhoea[w] = 0.15 + 0.45 * expected.rain[w] + 1.1 * expected.flood[w];
    }
    return { actual, expected, disruption };
  });

  // Demand history
  const series = [];
  SKUS.forEach((sku, si) => {
    LOCATIONS.forEach((loc, li) => {
      const sr = mulberry32(seed * 1009 + si * 97 + li * 13 + 1);
      const sig = signals[li].actual;
      const base = sku.base * loc.scale * (0.8 + sr() * 0.4);
      // Some series get a structural level shift (new hospital contract / lost tender)
      const shiftAt = sr() < 0.18 ? HISTORY_WEEKS - 10 - Math.floor(sr() * 50) : -1;
      const shift = shiftAt > 0 ? (sr() < 0.7 ? 1.25 + sr() * 0.4 : 0.65 + sr() * 0.15) : 1;
      // Depot-level weekly demand aggregates many chemists, so noise is moderate (NB shape 14–30).
      const dispersion = 14 + sr() * 16;
      const y = new Float32Array(HISTORY_WEEKS);
      for (let w = 0; w < HISTORY_WEEKS; w += 1) {
        let eta = 0;
        for (const [s, c] of Object.entries(sku.drivers)) eta += c * sig[s][w];
        let lam = base * (1 + (sku.trend * w) / 52) * Math.exp(eta);
        if (shiftAt > 0 && w >= shiftAt) lam *= shift;
        lam *= gamma(sr, dispersion) / dispersion;
        y[w] = poisson(sr, lam);
      }
      series.push({ key: `${sku.id}@${loc.id}`, si, li, sku, loc, y, base });
    });
  });

  return { scenario, phases, signals, series, years, total: TOTAL };
}
