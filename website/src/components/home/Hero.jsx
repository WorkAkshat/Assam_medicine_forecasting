import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import HighlightCards from './HighlightCards';

const HeroScene = lazy(() => import('./HeroScene'));

function useCan3D() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let gl = false;
    try {
      const c = document.createElement('canvas');
      gl = !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch {
      gl = false;
    }
    setOk(gl && !reduce);
  }, []);
  return ok;
}

export default function Hero({ onOpenEnquiry }) {
  const can3D = useCan3D();
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FCFDFB] via-[#FAFCFA] to-white pt-6 pb-0 sm:pt-8">
      
      {/* Background soft ambient accents */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-forest-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Content Grid */}
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          
          {/* Left Column (5 cols on desktop) */}
          <motion.div 
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 xl:col-span-5 space-y-5 sm:space-y-6 pt-1 lg:pt-0"
          >
            
            <p className="text-sm font-medium text-forest-600">GRD Pharmaceuticals, Rani, Assam · since 2006</p>

            <div className="space-y-2">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] xl:text-[3.9rem] font-semibold text-forest-950 leading-[1.04] tracking-[-0.02em]">
                Medicines made in Assam, ready where the Northeast needs them.
              </h1>
            </div>

            {/* Short company introduction */}
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-lg">
              Tablets, capsules, syrups and hygiene products from our cGMP plant at Rani, now planned with demand forecasting so depots from Dibrugarh to Aizawl stay stocked through monsoon, floods and festival weeks.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1.5">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/pharmaceutical-products"
                  className="inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 rounded-full bg-forest-900 hover:bg-forest-800 text-white font-medium text-sm sm:text-base shadow-sm hover:shadow-md transition-all group"
                >
                  <span>Explore Our Products</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/about"
                  className="inline-flex items-center px-7 sm:px-8 py-3.5 rounded-full bg-white hover:bg-forest-50 text-forest-900 font-medium text-sm sm:text-base border border-gray-300 hover:border-forest-700 transition-all shadow-sm"
                >
                  About GRD
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Hero Laboratory Visual with Organic Curve (7 cols on desktop) */}
          <motion.div 
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-7 xl:col-span-7 relative"
          >
            <div className="relative w-full">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800 aspect-[16/11] sm:aspect-[16/10]">
                {can3D ? (
                  <Suspense fallback={null}>
                    <HeroScene />
                  </Suspense>
                ) : (
                  <img
                    src="/images/hero-lab.webp"
                    alt="Scientist working in GRD's pharmaceutical laboratory"
                    className="h-full w-full object-cover opacity-90"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero-lab.png';
                    }}
                  />
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-forest-950/90 to-transparent p-5 sm:p-6">
                  <div>
                    <p className="font-display text-lg text-white sm:text-xl">20 formulations, 13 depots, 8 states</p>
                    <p className="text-sm text-white/65">Move your pointer to turn the shelf</p>
                  </div>
                  <span className="hidden rounded-full bg-muga-400 px-3 py-1 text-xs font-semibold text-forest-950 sm:inline">cGMP & ISO certified</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Company Highlights Section - Directly connected and close to Hero */}
      <div className="mt-7 sm:mt-9 lg:mt-10">
        <HighlightCards />
      </div>

      {/* Subtle Curved Wave Divider into next section matching reference */}
      <div className="w-full overflow-hidden leading-none pt-2 sm:pt-3 pointer-events-none">
        <svg
          className="relative block w-full h-5 sm:h-7 lg:h-8 text-white"
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 C320,50 960,60 1440,15 L1440,60 L0,60 Z"
            fill="currentColor"
          />
        </svg>
      </div>

    </section>
  );
}
