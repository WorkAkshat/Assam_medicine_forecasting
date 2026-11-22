// Orchestrates one full engine run: generate → backtest → forecast → simulate pilot → recommend.
import { SKUS, LOCATIONS, HUB, HISTORY_WEEKS, HORIZON, SIGNALS, SIGNAL_LABELS, weekDate } from './catalog.js';
import { generateWorld } from './generate.js';
import { MODELS, manualForecast, snaiveForecast, sesForecast, crostonForecast, fitSignalModel, signalForecast } from './models.js';
import { computePolicy, stockoutProbability, roundPack, expiryAtRisk, planRedistribution, haversineKm, leadTime } from './policy.js';
import { initialState, prepareAi, runPolicy, summarise, SIM_WEEKS } from './simulate.js';

const BT_H = 4;
const ENS_MODELS = ['snaive', 'ses', 'croston', 'signal'];
const PRIOR = { snaive: 0.5, ses: 0.42, croston: 0.48, signal: 0.32 };

function forecastAll(world, s, o, H, withContrib = false) {
  const sig = world.signals[s.li];
  const m = fitSignalModel(s.y, o, world.phases, sig.actual);
  const sf = signalForecast(m, o, H, world.phases, sig.expected, withContrib);
  return {
    manual: manualForecast(s.y, o, H),
    snaive: snaiveForecast(s.y, o, H),
    ses: sesForecast(s.y, o, H),
    croston: crostonForecast(s.y, o, H),
    signal: sf.forecast,
    drivers: sf.drivers,
  };
}

function ensembleWeights(err, act, level) {
  const P = 4 * Math.max(1, level);
  const raw = {};
  let tot = 0;
  for (const m of ENS_MODELS) {
    const e = (err[m] + PRIOR[m] * P) / (act + P);
    raw[m] = 1 / (e + 0.02) ** 2;
    tot += raw[m];
  }
  for (const m of ENS_MODELS) raw[m] /= tot;
  return raw;
}

function blend(fc, weights, H) {
  const out = new Float64Array(H);
  for (const m of ENS_MODELS) for (let h = 0; h < H; h += 1) out[h] += weights[m] * fc[m][h];
  return out;
}

function backtest(world) {
  const n = HISTORY_WEEKS;
  const origins = [];
  for (let o = n - 28; o <= n - 4; o += 4) origins.push(o);
  const ids = [...MODELS.map((m) => m.id), 'ensemble'];
  const global = Object.fromEntries(ids.map((m) => [m, 0]));
  const bucket = Object.fromEntries(ids.map((m) => [m, 0])); // 4-week planning-bucket error
  let globalAct = 0;
  const byLoc = LOCATIONS.map(() => ({ manual: 0, ensemble: 0, act: 0 }));
  const bySku = SKUS.map(() => ({ manual: 0, ensemble: 0, act: 0 }));
  const perSeries = world.series.map((s) => {
    const err = Object.fromEntries(ids.map((m) => [m, 0]));
    let act = 0;
    let sq = 0;
    let cnt = 0;
    const points = [];
    let level = 0;
    for (let i = n - 12; i < n; i += 1) level += s.y[i] / 12;
    for (const o of origins) {
      const fc = forecastAll(world, s, o, BT_H);
      const wts = ensembleWeights(err, act, level);
      fc.ensemble = blend(fc, wts, BT_H);
      let bAct = 0;
      for (let h = 0; h < BT_H; h += 1) bAct += s.y[o + h];
      for (const m of ids) {
        let bf = 0;
        for (let h = 0; h < BT_H; h += 1) bf += fc[m][h];
        bucket[m] += Math.abs(bf - bAct);
      }
      for (let h = 0; h < BT_H; h += 1) {
        const a = s.y[o + h];
        for (const m of ids) err[m] += Math.abs(fc[m][h] - a);
        act += a;
        sq += (fc.ensemble[h] - a) ** 2;
        cnt += 1;
        points.push({ w: o + h, ens: fc.ensemble[h], manual: fc.manual[h] });
      }
    }
    for (const m of ids) global[m] += err[m];
    globalAct += act;
    byLoc[s.li].manual += err.manual;
    byLoc[s.li].ensemble += err.ensemble;
    byLoc[s.li].act += act;
    bySku[s.si].manual += err.manual;
    bySku[s.si].ensemble += err.ensemble;
    bySku[s.si].act += act;
    return {
      err,
      act,
      sigma: Math.max(1, Math.sqrt(sq / Math.max(1, cnt))),
      weights: ensembleWeights(err, act, level),
      points,
      level,
    };
  });
  const wape = Object.fromEntries(ids.map((m) => [m, global[m] / Math.max(1, globalAct)]));
  const bucketWape = Object.fromEntries(ids.map((m) => [m, bucket[m] / Math.max(1, globalAct)]));
  return {
    bucketWape,
    origins,
    horizon: BT_H,
    wape,
    perSeries,
    byLoc: byLoc.map((b, li) => ({ id: LOCATIONS[li].id, manual: b.manual / b.act, ensemble: b.ensemble / b.act })),
    bySku: bySku.map((b, si) => ({ id: SKUS[si].id, manual: b.manual / b.act, ensemble: b.ensemble / b.act })),
  };
}

function explain(drivers, pol, loc, sku) {
  const parts = [];
  (drivers || [])
    .filter((d) => d.id !== 'trend' && Math.abs(d.effect) >= 0.06)
    .slice(0, 2)
    .forEach((d) => parts.push(`${SIGNAL_LABELS[d.id] || d.id} ${d.effect > 0 ? '+' : ''}${Math.round(d.effect * 100)}%`));
  parts.push(`${pol.L.toFixed(1)} wk lead time ±${(pol.sL * 7).toFixed(1)} d`);
  if (sku.ved === 'V') parts.push('vital medicine: 98% service');
  return parts.join(' · ');
}

let cache = null;

export function runEngine(scenario) {
  const t0 = performance.now();
  const world = generateWorld(scenario);
  const bt = backtest(world);
  const n = HISTORY_WEEKS;

  // Pilot simulation: manual habits vs AI policy from identical starting stock.
  const start = initialState(world);
  const prep = prepareAi(world);
  const manualRun = runPolicy(world, 'manual', prep, start);
  const aiRun = runPolicy(world, 'ai', prep, start);
  const base = summarise(manualRun.counters);
  const ai = summarise(aiRun.counters);

  // Live decision support on today's (status-quo) network state.
  const live = world.series.map((s, idx) => {
    const fc = forecastAll(world, s, n, HORIZON, true);
    const b = bt.perSeries[idx];
    const ens = blend(fc, b.weights, HORIZON);
    const st = manualRun.state[idx];
    const onHand = st.batches.reduce((a, x) => a + x.q, 0);
    const inbound = st.pipe.reduce((a, x) => a + x.q, 0);
    const floodNext = world.signals[s.li].expected.flood[n] || 0;
    const pol = computePolicy({ f: ens, sigma: b.sigma, sku: s.sku, loc: s.loc, scenario, floodLevel: floodNext, serviceBoost: scenario.serviceBoost || 0 });
    const position = onHand + inbound;
    const order = position < pol.S ? roundPack(pol.S - position) : 0;
    const pStock = stockoutProbability(position, pol, b.sigma);
    const exp = expiryAtRisk(st.batches, pol.dAvg, n);
    const coverWeeks = pol.dAvg > 0 ? onHand / pol.dAvg : 99;
    const excessUnits = Math.max(0, onHand - Math.max(12 * pol.dAvg, 1.6 * pol.S));
    let status = 'healthy';
    if (pStock > 0.5 || (onHand === 0 && pol.dAvg > 0.5)) status = 'critical';
    else if (pStock > 0.2) status = 'watch';
    else if (exp.atRisk * s.sku.price > 2000 || excessUnits > 0) status = 'excess';
    const wape = b.act ? b.err.ensemble / b.act : 0;
    return {
      key: s.key,
      idx,
      sku: s.sku.id,
      loc: s.loc.id,
      onHand,
      inbound,
      position,
      dAvg: pol.dAvg,
      ss: pol.ss,
      rop: pol.rop,
      S: pol.S,
      leadWeeks: pol.L,
      order,
      orderValue: order * s.sku.price,
      pStockout: pStock,
      coverWeeks,
      atRisk: exp.atRisk,
      atRiskValue: exp.atRisk * s.sku.price,
      nearestExpiry: st.batches.length ? Math.min(...st.batches.map((x) => x.exp)) - n : null,
      excessUnits,
      excessValue: excessUnits * s.sku.price,
      stockValue: onHand * s.sku.price,
      status,
      wape,
      wapeManual: b.act ? b.err.manual / b.act : 0,
      next4: ens.slice(0, 4).reduce((a, v) => a + v, 0),
      drivers: (fc.drivers || []).slice(0, 4),
      reason: explain(fc.drivers, pol, s.loc, s.sku),
      _ens: ens,
      _fc: fc,
      _pol: pol,
      _batches: st.batches.map((x) => ({ ...x })),
      _pipe: st.pipe.map((x) => ({ ...x })),
    };
  });

  // Live redistribution suggestions
  const transfers = [];
  for (let si = 0; si < SKUS.length; si += 1) {
    const nodes = LOCATIONS.map((loc, li) => {
      const r = live[si * LOCATIONS.length + li];
      return { idx: r.idx, li, loc, onHand: r.onHand, position: r.position, pol: r._pol, batches: r._batches.map((x) => ({ ...x })) };
    });
    planRedistribution(nodes, n, haversineKm).forEach((m) =>
      transfers.push({
        sku: SKUS[si].id,
        from: m.from.loc.id,
        to: m.to.loc.id,
        q: m.q,
        value: m.q * SKUS[si].price,
        expiresInWeeks: m.exp - n,
        km: Math.round(haversineKm(m.from.loc, m.to.loc)),
      }),
    );
  }
  transfers.sort((a, b) => b.value - a.value);

  const locations = LOCATIONS.map((loc, li) => {
    const rows = live.filter((r) => r.loc === loc.id);
    const value = rows.reduce((a, r) => a + r.stockValue, 0) || 1;
    const risk = rows.reduce((a, r) => a + r.pStockout * Math.max(r.dAvg, 1) * SKUS.find((k) => k.id === r.sku).price, 0) / rows.reduce((a, r) => a + Math.max(r.dAvg, 1) * SKUS.find((k) => k.id === r.sku).price, 0);
    const lt = leadTime(loc, scenario, world.signals[li].expected.flood[n] || 0);
    const excessValue = rows.reduce((a, r) => a + r.excessValue, 0);
    const atRiskValue = rows.reduce((a, r) => a + r.atRiskValue, 0);
    const health = Math.max(0, Math.min(100, Math.round(100 * (1 - risk) - 30 * ((excessValue + atRiskValue) / value))));
    return {
      ...loc,
      critical: rows.filter((r) => r.status === 'critical').length,
      watch: rows.filter((r) => r.status === 'watch').length,
      excess: rows.filter((r) => r.status === 'excess').length,
      healthy: rows.filter((r) => r.status === 'healthy').length,
      stockValue: value,
      orderValue: rows.reduce((a, r) => a + r.orderValue, 0),
      excessValue,
      atRiskValue,
      risk,
      health,
      leadDays: lt.days,
      leadSdDays: lt.sdDays,
      km: Math.round(haversineKm(HUB, loc)),
      wapeManual: bt.byLoc[li].manual,
      wape: bt.byLoc[li].ensemble,
    };
  });

  // Network outlook: expected driver intensity next 12 weeks vs last 12 weeks.
  const outlook = SIGNALS.filter((s) => !s.startsWith('fest')).map((sig) => {
    let past = 0;
    let next = 0;
    world.signals.forEach((sg) => {
      for (let k = 1; k <= 12; k += 1) {
        past += sg.actual[sig][n - k];
        next += sg.expected[sig][n + k - 1];
      }
    });
    return { id: sig, label: SIGNAL_LABELS[sig], past: past / (12 * LOCATIONS.length), next: next / (12 * LOCATIONS.length) };
  });

  const pct = (a, b) => (a ? (a - b) / a : 0);
  const kpis = {
    // Accuracy is scored on the 4-week planning bucket each replenishment decision is sized on.
    accuracy: { baseline: 1 - bt.bucketWape.manual, ai: 1 - bt.bucketWape.ensemble, gain: pct(bt.bucketWape.manual, bt.bucketWape.ensemble), target: 0.2, weekly: { baseline: 1 - bt.wape.manual, ai: 1 - bt.wape.ensemble } },
    stockout: { baseline: base.stockoutIncidence, ai: ai.stockoutIncidence, gain: pct(base.stockoutIncidence, ai.stockoutIncidence), target: 0.2 },
    excess: { baseline: base.excessShare, ai: ai.excessShare, gain: pct(base.excessShare, ai.excessShare), target: 0.15 },
    expiry: { baseline: base.expiryLoss, ai: ai.expiryLoss, gain: pct(base.expiryLoss, ai.expiryLoss), target: 0.15 },
    service: { baseline: base.fillRate, ai: ai.fillRate, gain: ai.fillRate - base.fillRate, target: 0.1 },
  };

  const publicRows = live.map(({ _ens, _fc, _pol, _batches, _pipe, ...r }) => r);
  cache = { world, bt, live, scenario };

  return {
    scenario,
    asOf: weekDate(n).toISOString(),
    weeks: { history: HISTORY_WEEKS, horizon: HORIZON, sim: SIM_WEEKS },
    elapsedMs: Math.round(performance.now() - t0),
    kpis,
    sim: {
      manual: { ...base, weekly: base.weekly },
      ai: { ...ai, weekly: ai.weekly },
      weekDates: base.weekly.map((x) => weekDate(x.w).toISOString()),
    },
    backtest: { wape: bt.wape, bucketWape: bt.bucketWape, byLoc: bt.byLoc, bySku: bt.bySku, origins: bt.origins.length, horizon: bt.horizon },
    locations,
    rows: publicRows,
    transfers: transfers.slice(0, 40),
    outlook,
    totals: {
      series: live.length,
      stockValue: live.reduce((a, r) => a + r.stockValue, 0),
      orderValue: live.reduce((a, r) => a + r.orderValue, 0),
      orders: live.filter((r) => r.order > 0).length,
      critical: live.filter((r) => r.status === 'critical').length,
      watch: live.filter((r) => r.status === 'watch').length,
      excess: live.filter((r) => r.status === 'excess').length,
      atRiskValue: live.reduce((a, r) => a + r.atRiskValue, 0),
      excessValue: live.reduce((a, r) => a + r.excessValue, 0),
    },
  };
}

export function seriesDetail(key) {
  if (!cache) return null;
  const { world, bt, live } = cache;
  const r = live.find((x) => x.key === key);
  if (!r) return null;
  const s = world.series[r.idx];
  const b = bt.perSeries[r.idx];
  const n = HISTORY_WEEKS;
  const from = n - 78;
  const history = [];
  for (let w = from; w < n; w += 1) history.push({ w, date: weekDate(w).toISOString(), actual: s.y[w] });
  const forecast = [];
  for (let h = 0; h < HORIZON; h += 1) {
    const sd = b.sigma * Math.sqrt(1 + 0.08 * h);
    const e = r._ens[h];
    forecast.push({
      w: n + h,
      date: weekDate(n + h).toISOString(),
      ensemble: e,
      p10: Math.max(0, e - 1.2816 * sd),
      p90: e + 1.2816 * sd,
      manual: r._fc.manual[h],
      snaive: r._fc.snaive[h],
      ses: r._fc.ses[h],
      croston: r._fc.croston[h],
      signal: r._fc.signal[h],
    });
  }
  const sig = world.signals[s.li];
  const relevant = Object.keys(s.sku.drivers).filter((k) => !k.startsWith('fest'));
  const signals = [];
  for (let w = from; w < n + HORIZON; w += 1) {
    const row = { w, date: weekDate(w).toISOString() };
    relevant.forEach((k) => {
      row[k] = w < n ? sig.actual[k][w] : sig.expected[k][w];
    });
    signals.push(row);
  }
  const models = MODELS.map((m) => ({ ...m, wape: b.act ? b.err[m.id] / b.act : 0, weight: b.weights[m.id] || 0 }));
  models.push({ id: 'ensemble', name: 'Weighted ensemble', short: 'Ensemble', wape: b.act ? b.err.ensemble / b.act : 0, weight: 1 });
  return {
    key,
    row: Object.fromEntries(Object.entries(r).filter(([k]) => !k.startsWith('_'))),
    history,
    forecast,
    backtestPoints: b.points.map((p) => ({ ...p, date: weekDate(p.w).toISOString(), actual: s.y[p.w] })),
    signals,
    relevantSignals: relevant,
    models,
    sigma: b.sigma,
    policy: r._pol,
    batches: r._batches.map((x) => ({ ...x, weeksLeft: x.exp - n })),
    pipe: r._pipe.map((x) => ({ ...x, inWeeks: x.arr - n })),
  };
}
