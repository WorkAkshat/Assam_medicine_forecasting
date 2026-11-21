import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import HighlightCards from './HighlightCards';

export default function Hero({ onOpenEnquiry }) {
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
            
            {/* Small company label */}
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest uppercase text-forest-700 bg-forest-50 px-3.5 py-1.5 rounded-full border border-forest-100/80 shadow-sm">
                GRD PHARMACEUTICALS
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.3rem] xl:text-[3.8rem] font-serif font-extrabold text-forest-900 leading-[1.08] tracking-tight">
                Healthcare,
                <br />
                <span className="font-serif italic font-normal text-forest-700 block mt-1">
                  Made with Care.
                </span>
              </h1>
              {/* Terracotta horizontal accent bar */}
              <div className="w-14 h-1.5 bg-terracotta-500 rounded-full mt-3.5" />
            </div>

            {/* Short company introduction */}
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-lg">
              A trusted name in pharmaceutical and hygiene products, committed to improving everyday health and well-being across Northeast India.
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
              
              {/* Image Container with Organic Curved boundary matching reference */}
              <div className="relative rounded-3xl sm:rounded-4xl lg:rounded-[2.5rem] overflow-hidden shadow-2xl border border-forest-100/80 bg-white aspect-[16/10]">
                <img
                  src="/images/hero-lab.webp"
                  alt="Scientist working in GRD modern pharmaceutical laboratory"
                  className="w-full h-full object-cover object-center transform hover:scale-[1.01] transition-transform duration-700"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero-lab.png';
                  }}
                />

                {/* Subtle soft organic wave overlay at bottom right matching reference */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/10 via-transparent to-transparent" />
              </div>

              {/* Floating verified badge */}
              <div className="hidden sm:flex absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-forest-100 items-center gap-3 z-10">
                <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-bold text-forest-900">cGMP &amp; ISO Certified</p>
                  <p className="text-[11px] text-gray-500">Rani Industrial Area, Assam</p>
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
