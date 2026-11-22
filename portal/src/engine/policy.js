// Inventory policy maths: lead-time-aware safety stock, order-up-to levels, FEFO expiry risk
// and lateral redistribution between depots.
import { VED_Z } from './catalog.js';
import { normCdf } from './rng.js';

export const REVIEW_WEEKS = 1;

/** Expected lead time in weeks (weekly bucketed arrivals) and its std-dev. */
export function leadTime(loc, scenario, floodLevel = 0) {
  const shock = 1 + (scenario.leadShock || 0);
  const days = (loc.leadDays * shock + 1) * (1 + 1.5 * floodLevel);
  const sdDays = loc.leadSd * shock * (1 + floodLevel);
  return { L: days / 7 + 0.5, sL: sdDays / 7, days, sdDays };
}

export function realisedLeadWeeks(loc, scenario, floodLevel, disruptionDays, z) {
  const shock = 1 + (scenario.leadShock || 0);
  const days = (loc.leadDays * shock + 1) * (1 + 1.5 * floodLevel) + loc.leadSd * shock * z + disruptionDays;
  return Math.max(1, Math.ceil(Math.max(0.5, days) / 7));
}

/**
 * @param f weekly forecast starting next week
 * @param sigma weekly forecast error std-dev (units)
 */
export function computePolicy({ f, sigma, sku, loc, scenario, floodLevel = 0, serviceBoost = 0 }) {
  const { L, sL } = leadTime(loc, scenario, floodLevel);
  const cover = L + REVIEW_WEEKS;
  let need = 0;
  const whole = Math.floor(cover);
  for (let h = 0; h < whole; h += 1) need += f[Math.min(h, f.length - 1)];
  need += (cover - whole) * f[Math.min(whole, f.length - 1)];
  const dAvg = need / cover;
  const z = VED_Z[sku.ved] + serviceBoost;
  const ss = z * Math.sqrt(cover * sigma * sigma + dAvg * dAvg * sL * sL);
  let S = need + ss;
  // Shelf-life guard: never stock more than ~a third of shelf life (max 16 weeks) of demand.
  const cap = dAvg * Math.min(sku.shelf * 0.35, 16);
  S = Math.min(S, Math.max(cap, need * 1.15));
  const rop = dAvg * L + ss;
  return { L, sL, cover, dAvg, ss, S, rop, z, need };
}

export function stockoutProbability(position, pol, sigma) {
  const sd = Math.sqrt(pol.cover * sigma * sigma + pol.dAvg * pol.dAvg * pol.sL * pol.sL) || 1;
  return 1 - normCdf((position - pol.need) / sd);
}

export const roundPack = (q, pack = 10) => (q <= 0 ? 0 : Math.ceil(q / pack) * pack);

/** Units in each batch that FEFO consumption at dAvg/week will not clear before expiry. */
export function expiryAtRisk(batches, dAvg, week) {
  const sorted = [...batches].sort((a, b) => a.exp - b.exp);
  let consumedBefore = 0;
  let atRisk = 0;
  const detail = [];
  for (const b of sorted) {
    const sellable = Math.max(0, dAvg * Math.max(0, b.exp - week) - consumedBefore);
    const risk = Math.max(0, b.q - sellable);
    consumedBefore += Math.min(b.q, sellable);
    atRisk += risk;
    detail.push({ ...b, risk, weeksLeft: b.exp - week });
  }
  return { atRisk, detail };
}

/**
 * Greedy lateral redistribution for one SKU across depots.
 * nodes: [{li, loc, onHand, position, pol, batches}]
 * Returns transfers [{from, to, q, exp}] and mutates batches on the source node.
 */
export function planRedistribution(nodes, week, distance, minQty = 10) {
  const surplus = [];
  const deficit = [];
  for (const n of nodes) {
    const { atRisk } = expiryAtRisk(n.batches, n.pol.dAvg, week);
    const excess = Math.max(0, n.onHand - 2.2 * n.pol.S);
    const s = Math.max(atRisk, excess);
    if (s >= Math.max(minQty, 0.5 * n.pol.dAvg)) surplus.push({ n, s });
    const d = n.pol.S - n.position; // a transfer can replace (part of) this week's factory order
    if (d > 0) deficit.push({ n, d });
  }
  surplus.sort((a, b) => b.s - a.s);
  const transfers = [];
  for (const src of surplus) {
    let left = src.s;
    const targets = deficit
      .filter((t) => t.d > 0 && t.n !== src.n)
      .sort((a, b) => distance(src.n.loc, a.n.loc) - distance(src.n.loc, b.n.loc));
    for (const t of targets) {
      if (left < minQty) break;
      // Move the soonest-expiring stock first, but only what the destination can sell in time.
      const batches = [...src.n.batches].sort((a, b) => a.exp - b.exp);
      for (const b of batches) {
        if (left < minQty || t.d < minQty) break;
        const sellable = t.n.pol.dAvg * Math.max(0, b.exp - week - 1) * 0.9;
        const q = Math.floor(Math.min(b.q, left, t.d, sellable) / minQty) * minQty;
        if (q < minQty) continue;
        b.q -= q;
        left -= q;
        t.d -= q;
        transfers.push({ from: src.n, to: t.n, q, exp: b.exp });
      }
    }
    src.n.batches = src.n.batches.filter((b) => b.q > 0);
  }
  return transfers;
}

export function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s)) * 1.35; // road factor
}
