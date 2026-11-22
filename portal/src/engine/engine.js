// Orchestrates one engine run: load data → back-test → forecast → measure outcomes → recommend.
import { SKUS, LOCATIONS, HUB, HISTORY_WEEKS, HORIZON, SIGNALS, SIGNAL_LABELS, SEGMENTS, weekDate } from './catalog.js';
import { generateWorld, weekIndexOf } from './generate.js';
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

export function runEngine(scenario, uploads = null) {
  const t0 = performance.now();
  const world = generateWorld(scenario, uploads);
  const stockByKey = new Map();
  (uploads?.stock || []).forEach((r) => {
    const exp = weekIndexOf(r.expiry);
    const q = Number(r.qty);
    if (exp == null || !Number.isFinite(q) || q <= 0) return;
    const k = `${r.sku}@${r.depot}`;
    if (!stockByKey.has(k)) stockByKey.set(k, []);
    stockByKey.get(k).push({ q, exp, batch: r.batch || '' });
  });
  const bt = backtest(world);
  const n = HISTORY_WEEKS;

  // Outcome measurement: current ordering practice vs the recommended policy, same stock and demand.
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
    const simState = manualRun.state[idx];
    const uploadedStock = stockByKey.get(s.key);
    const st = uploadedStock ? { batches: uploadedStock.map((b) => ({ ...b })), pipe: [] } : simState;
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
      last4: s.y[n - 1] + s.y[n - 2] + s.y[n - 3] + s.y[n - 4],
      segMix: SEGMENTS.map((g) => {
        let v = 0;
        for (let k = 1; k <= 13; k += 1) v += s.seg[g.id][n - k];
        return v;
      }),
      source: uploadedStock ? (s.source === 'synthetic' ? 'stock-uploaded' : 'uploaded') : s.source,
      sigma: b.sigma,
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

  // Network demand value: history and forecast with an aggregated likely range
  const trend = [];
  for (let w = n - 78; w < n; w += 1) {
    let v = 0;
    const segV = {};
    SEGMENTS.forEach((g) => (segV[g.id] = 0));
    world.series.forEach((s) => {
      v += s.y[w] * s.sku.price;
      SEGMENTS.forEach((g) => (segV[g.id] += s.seg[g.id][w] * s.sku.price));
    });
    trend.push({ date: weekDate(w).toISOString(), actual: v, ...segV });
  }
  for (let h = 0; h < HORIZON; h += 1) {
    let v = 0;
    let varSum = 0;
    live.forEach((r) => {
      const price = SKUS[world.series[r.idx].si].price;
      v += r._ens[h] * price;
      varSum += (r.sigma * Math.sqrt(1 + 0.08 * h) * price) ** 2;
    });
    const sd = Math.sqrt(varSum);
    trend.push({ date: weekDate(n + h).toISOString(), forecast: v, band: [Math.max(0, v - 1.2816 * sd), v + 1.2816 * sd] });
  }

  // Alerts: what a planner should act on today
  const alerts = [];
  const locName = Object.fromEntries(LOCATIONS.map((l) => [l.id, l.name]));
  const skuOf = Object.fromEntries(SKUS.map((k) => [k.id, k]));
  live.forEach((r) => {
    const sku = skuOf[r.sku];
    const days = Math.max(0, Math.round(r.coverWeeks * 7));
    if (r.status === 'critical') {
      alerts.push({ id: `so-${r.key}`, type: 'stockout', severity: sku.ved === 'V' ? 'high' : 'medium', key: r.key, sku: r.sku, loc: r.loc,
        title: `${sku.name} at ${locName[r.loc]} may run out ${days <= 1 ? 'within a day' : `in about ${days} days`}`,
        detail: `${Math.round(r.pStockout * 100)}% chance of a stock-out before the next delivery (${r.leadWeeks.toFixed(1)} wk lead time). Suggested order ${Math.round(r.order)} ${sku.unit}s.`, value: r.orderValue });
    }
    if (r.atRiskValue > 3000) {
      alerts.push({ id: `ex-${r.key}`, type: 'expiry', severity: r.nearestExpiry != null && r.nearestExpiry <= 8 ? 'high' : 'medium', key: r.key, sku: r.sku, loc: r.loc,
        title: `${sku.name} at ${locName[r.loc]}: stock worth ₹${Math.round(r.atRiskValue / 1000)}k will expire unsold`,
        detail: `Nearest batch expires in ${r.nearestExpiry} weeks. Move it to a depot that will sell it in time, or run a scheme.`, value: r.atRiskValue });
    }
    if (r.last4 > 20 && r.next4 / r.last4 > 1.35) {
      alerts.push({ id: `up-${r.key}`, type: 'surge', severity: 'medium', key: r.key, sku: r.sku, loc: r.loc,
        title: `Demand for ${sku.name} at ${locName[r.loc]} expected to rise ${Math.round((r.next4 / r.last4 - 1) * 100)}%`,
        detail: `Next 4 weeks ${Math.round(r.next4)} vs ${Math.round(r.last4)} in the last 4. Driver: ${(r.drivers[0] && (SIGNAL_LABELS[r.drivers[0].id] || r.drivers[0].id)) || 'trend'}.`, value: (r.next4 - r.last4) * sku.price });
    }
    if (r.excessValue > 20000) {
      alerts.push({ id: `xs-${r.key}`, type: 'excess', severity: 'low', key: r.key, sku: r.sku, loc: r.loc,
        title: `${sku.name} at ${locName[r.loc]} holds ${Math.round(r.coverWeeks)} weeks of stock`,
        detail: `₹${Math.round(r.excessValue / 1000)}k above 12 weeks of need is tying up working capital.`, value: r.excessValue });
    }
  });
  LOCATIONS.forEach((loc, li) => {
    const lt = leadTime(loc, scenario, world.signals[li].expected.flood[n] || 0);
    if (lt.sdDays / Math.max(1, lt.days) > 0.38) {
      alerts.push({ id: `lt-${loc.id}`, type: 'transport', severity: 'low', loc: loc.id,
        title: `Unreliable deliveries to ${loc.name}`, detail: `Lead time ${lt.days.toFixed(1)} ± ${lt.sdDays.toFixed(1)} days on ${loc.route}. Safety stock there is sized up to cover it.`, value: 0 });
    }
  });
  const sevRank = { high: 0, medium: 1, low: 2 };
  alerts.sort((a, b) => sevRank[a.severity] - sevRank[b.severity] || b.value - a.value);

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
    trend,
    alerts,
    segments: SEGMENTS,
    dataQuality: world.quality,
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
  for (let w = from; w < n; w += 1) {
    const row = { w, date: weekDate(w).toISOString(), actual: s.y[w] };
    SEGMENTS.forEach((g) => (row[g.id] = s.seg[g.id][w]));
    history.push(row);
  }
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
