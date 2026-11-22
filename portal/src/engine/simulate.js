// Outcome back-test: replays the most recent weeks of demand twice — once with current manual
// ordering practice and once with the recommended policy — from the same starting stock, demand
// and lead-time shocks. The difference is what the five outcome KPIs measure.
import { SKUS, LOCATIONS, HISTORY_WEEKS } from './catalog.js';
import { rngFor, normal } from './rng.js';
import { fitSignalModel, withLevelAt, signalForecast, sesForecast, modelSigma } from './models.js';
import { computePolicy, realisedLeadWeeks, roundPack, planRedistribution, haversineKm } from './policy.js';

export const SIM_WEEKS = 26;

export function initialState(world) {
  const w0 = HISTORY_WEEKS - SIM_WEEKS;
  const seed = world.scenario.seed;
  return world.series.map((s, idx) => {
    const r = rngFor(seed, idx, 99991);
    let ma = 0;
    for (let i = w0 - 8; i < w0; i += 1) ma += s.y[i] / 8;
    // Status-quo stock is uneven: most depots hold ~5 weeks, ~15% are badly overstocked.
    const overstocked = r() < 0.15;
    const cover = overstocked ? 14 + r() * 22 : Math.min(20, Math.max(0.5, Math.exp(Math.log(5) + 0.6 * normal(r))));
    const total = Math.round(ma * cover);
    const shelf = s.sku.shelf;
    const parts = [
      [0.2, 0.05 + r() * 0.3],
      [0.3, 0.3 + r() * 0.3],
      [0.5, 0.6 + r() * 0.35],
    ];
    return {
      batches: parts.map(([p, life]) => ({ q: Math.round(total * p), exp: w0 + Math.round(shelf * life) })).filter((b) => b.q > 0),
      pipe: [],
    };
  });
}

const cloneState = (st) => st.map((s) => ({ batches: s.batches.map((b) => ({ ...b })), pipe: s.pipe.map((p) => ({ ...p })) }));
const sumQ = (arr) => arr.reduce((a, b) => a + b.q, 0);

function newCounters() {
  return { demand: 0, served: 0, demandWeeks: 0, stockoutWeeks: 0, expiredValue: 0, servedValue: 0, invValue: 0, excessValue: 0, transfers: 0, transferUnits: 0, orders: 0, weekly: [] };
}

/** Pre-compute per-series AI models fitted at the start of the simulation window (no look-ahead). */
export function prepareAi(world) {
  const w0 = HISTORY_WEEKS - SIM_WEEKS;
  return world.series.map((s) => {
    const sig = world.signals[s.li];
    const model = fitSignalModel(s.y, w0, world.phases, sig.actual);
    const sigma = Math.max(1, modelSigma(model, s.y, w0, world.phases, sig.actual));
    return { model, sigma };
  });
}

export function aiForecast(world, s, prep, w, H) {
  const sig = world.signals[s.li];
  const m = withLevelAt(prep.model, s.y, w, world.phases, sig.actual);
  const a = signalForecast(m, w, H, world.phases, sig.expected).forecast;
  const b = sesForecast(s.y, w, H);
  const out = new Float64Array(H);
  for (let h = 0; h < H; h += 1) out[h] = 0.8 * a[h] + 0.2 * b[h];
  return out;
}

const distance = (a, b) => haversineKm(a, b);

export function runPolicy(world, policy, aiPrep, start) {
  const { scenario } = world;
  const w0 = HISTORY_WEEKS - SIM_WEEKS;
  const state = cloneState(start);
  const c = newCounters();
  const lastStockout = new Uint8Array(world.series.length);
  const pols = new Array(world.series.length);

  for (let w = w0; w < HISTORY_WEEKS; w += 1) {
    let wkDemand = 0;
    let wkServed = 0;
    let wkInv = 0;
    for (let idx = 0; idx < world.series.length; idx += 1) {
      const s = world.series[idx];
      const st = state[idx];
      const price = s.sku.price;
      // 1. receive
      if (st.pipe.length) {
        const arriving = st.pipe.filter((p) => p.arr <= w);
        if (arriving.length) {
          arriving.forEach((p) => st.batches.push({ q: p.q, exp: p.exp }));
          st.pipe = st.pipe.filter((p) => p.arr > w);
        }
      }
      // 2. serve demand — AI enforces FEFO; without expiry visibility, picking order is effectively random.
      if (policy === 'ai') st.batches.sort((a, b) => a.exp - b.exp);
      else if (st.batches.length > 1) {
        const pr = rngFor(scenario.seed, idx, w + 31337);
        for (let i = st.batches.length - 1; i > 0; i -= 1) {
          const j = Math.floor(pr() * (i + 1));
          [st.batches[i], st.batches[j]] = [st.batches[j], st.batches[i]];
        }
      }
      const D = s.y[w];
      let need = D;
      for (const b of st.batches) {
        if (need <= 0) break;
        const take = Math.min(b.q, need);
        b.q -= take;
        need -= take;
      }
      const served = D - need;
      c.demand += D;
      c.served += served;
      c.servedValue += served * price;
      wkDemand += D * price;
      wkServed += served * price;
      if (D > 0) {
        c.demandWeeks += 1;
        if (need > 0) c.stockoutWeeks += 1;
      }
      lastStockout[idx] = need > 0 ? 1 : 0;
      // 3. expire
      st.batches = st.batches.filter((b) => {
        if (b.q > 0 && b.exp <= w) {
          c.expiredValue += b.q * price;
          return false;
        }
        return b.q > 0;
      });
      const onHand = sumQ(st.batches);
      // 4. measure stock value and excess against the actual demand that follows
      let fwd = 0;
      let n = 0;
      for (let k = w + 1; k <= Math.min(HISTORY_WEEKS - 1, w + 8); k += 1) {
        fwd += s.y[k];
        n += 1;
      }
      if (n === 0) {
        for (let k = w - 3; k <= w; k += 1) fwd += s.y[k];
        n = 4;
      }
      const fwdAvg = fwd / n;
      c.invValue += onHand * price;
      wkInv += onHand * price;
      c.excessValue += Math.max(0, onHand - 10 * fwdAvg) * price;

      if (policy === 'ai') {
        const f = aiForecast(world, s, aiPrep[idx], w + 1, 8);
        pols[idx] = computePolicy({ f, sigma: aiPrep[idx].sigma, sku: s.sku, loc: s.loc, scenario, floodLevel: world.signals[s.li].expected.flood[w + 1] || 0, serviceBoost: scenario.serviceBoost || 0 });
      }
    }

    // 5. AI only: move at-risk / surplus stock to depots that need it *before* placing new orders
    if (policy === 'ai' && scenario.redistribute !== false) {
      for (let si = 0; si < SKUS.length; si += 1) {
        const nodes = [];
        for (let li = 0; li < LOCATIONS.length; li += 1) {
          const idx = si * LOCATIONS.length + li;
          const st = state[idx];
          const onHand = sumQ(st.batches);
          nodes.push({ idx, li, loc: LOCATIONS[li], onHand, position: onHand + sumQ(st.pipe), pol: pols[idx], batches: st.batches });
        }
        const moves = planRedistribution(nodes, w, distance);
        for (const m of moves) {
          state[m.from.idx].batches = m.from.batches;
          state[m.to.idx].pipe.push({ q: m.q, arr: w + 1, exp: m.exp });
          c.transfers += 1;
          c.transferUnits += m.q;
        }
      }
    }

    // 6. ordering decision
    for (let idx = 0; idx < world.series.length; idx += 1) {
      const s = world.series[idx];
      const st = state[idx];
      const onHand = sumQ(st.batches);
      const flood = world.signals[s.li].actual.flood[w];
      const position = onHand + sumQ(st.pipe);
      let q = 0;
      const r = rngFor(scenario.seed, idx, w);
      if (policy === 'manual') {
        // Today's habit: a monthly indent sized to "about five weeks of last month's sales",
        // adjusted by judgement, occasionally missed, plus an emergency re-order after a stock-out.
        const review = (w - w0 + s.li) % 4 === 0 && r() > 0.1;
        const panic = lastStockout[idx] && r() < 0.6;
        if (review || panic) {
          let ma = 0;
          for (let k = w - 3; k <= w; k += 1) ma += s.y[k] / 4;
          let coverWeeks = 5 * Math.exp(0.3 * normal(r));
          if (panic) coverWeeks *= 1.5;
          q = roundPack(ma * coverWeeks - position);
        }
      } else if (position < pols[idx].S) {
        q = roundPack(pols[idx].S - position);
      }
      if (q > 0) {
        const lr = rngFor(scenario.seed, idx, w + 7777);
        const lw = realisedLeadWeeks(s.loc, scenario, flood, world.signals[s.li].disruption[w], normal(lr));
        const arr = w + lw;
        st.pipe.push({ q, arr, exp: arr + Math.round(s.sku.shelf * (0.75 + 0.2 * lr())) });
        c.orders += 1;
      }
    }
    c.weekly.push({ w, fill: wkDemand ? wkServed / wkDemand : 1, inv: wkInv });
  }
  return { counters: c, state };
}

export function summarise(c) {
  const weeks = SIM_WEEKS;
  return {
    fillRate: c.demand ? c.served / c.demand : 1,
    stockoutIncidence: c.demandWeeks ? c.stockoutWeeks / c.demandWeeks : 0,
    excessShare: c.invValue ? c.excessValue / c.invValue : 0,
    expiryLoss: c.servedValue + c.expiredValue ? c.expiredValue / (c.servedValue + c.expiredValue) : 0,
    expiredValue: c.expiredValue,
    avgInventoryValue: c.invValue / weeks,
    transfers: c.transfers,
    transferUnits: c.transferUnits,
    orders: c.orders,
    weekly: c.weekly,
  };
}
