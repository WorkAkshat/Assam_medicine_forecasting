import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// The five NESFIC-I-09 targets the planning system is built to move, measured against an agreed pilot baseline.
const TARGETS = [
  { value: '20%', label: 'more accurate demand forecasts' },
  { value: '20%', label: 'fewer stock-outs at depots and chemists' },
  { value: '15%', label: 'less excess and slow-moving stock' },
  { value: '15%', label: 'lower losses to expiry' },
  { value: '10 pts', label: 'higher order fulfilment' },
];

const STEPS = [
  ['Read the signals', 'Weekly sales from every depot, combined with monsoon rainfall, flood alerts, malaria and dengue seasons, deworming days and festival calendars.'],
  ['Forecast each medicine', 'Five models compete on recent weeks for every medicine at every depot; the best blend wins, with an honest likely range.'],
  ['Plan the order', 'Safety stock sized to each route’s real lead time, first-expiry-first picking, and transfers that move surplus to where it will sell.'],
];

export default function ForecastSection({ onOpenPortal }) {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-forest-950 py-16 text-white sm:py-24">
      <div className="site-container grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="text-sm font-medium text-muga-300">Supply planning for the Northeast</p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Fewer empty shelves in Silchar. Less expired stock in Guwahati.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
            Our distribution network crosses the Brahmaputra valley, the Barak valley and five hill states. Lead times swing with every monsoon. We now forecast demand for each medicine at each depot, every week, and plan replenishment from it.
          </p>
          <button
            type="button"
            onClick={onOpenPortal}
            className="mt-8 inline-flex items-center rounded-full bg-muga-400 px-6 py-3 text-sm font-semibold text-forest-950 transition-colors hover:bg-muga-300"
          >
            Open the control tower
          </button>
        </div>

        <div className="lg:col-span-7">
          <ol className="grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-3">
            {STEPS.map(([title, body], i) => (
              <motion.li
                key={title}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="bg-forest-950 p-5"
              >
                <span className="font-display text-sm text-muga-300">Step {i + 1}</span>
                <h3 className="mt-2 font-display text-lg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{body}</p>
              </motion.li>
            ))}
          </ol>

          <div className="mt-10">
            <p className="text-sm text-white/55">What the 12–16 week Assam pilot is measured on</p>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-5">
              {TARGETS.map((t) => (
                <div key={t.label} className="border-t border-white/15 pt-3">
                  <dt className="font-display text-2xl text-white">{t.value}</dt>
                  <dd className="mt-1 text-[13px] leading-snug text-white/60">{t.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
