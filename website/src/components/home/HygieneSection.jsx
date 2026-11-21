import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { HYGIENE_PRODUCTS } from '../../data/products';
import SectionHeader from '../common/SectionHeader';

export default function HygieneSection() {
  return (
    <section className="section-spacing bg-[#FAFBFD] border-t border-forest-100/70">
      <div className="site-container">
        
        {/* Section Header with Terracotta Accent matching reference */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-7">
          <SectionHeader
            title="Hygiene & Sanitization Products"
            subtitle="Everyday hygiene solutions for a cleaner and safer environment."
          />

          <Link
            to="/hygiene-products"
            className="hidden sm:inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-forest-800 hover:text-terracotta-600 transition-colors group mb-1 shrink-0"
          >
            <span>Explore Hygiene Range</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Cards in Row matching reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {HYGIENE_PRODUCTS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.45, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="h-full"
            >
              <Link
                to={`/product/${item.slug}`}
                className="group flex flex-col h-full rounded-3xl overflow-hidden bg-white shadow-card hover:shadow-card-hover border border-forest-100/70 transition-all duration-300"
              >
                {/* Full-Cover Edge-to-Edge Product Artwork */}
                <div className="relative w-full aspect-square overflow-hidden bg-white">
                  <img
                    src={item.image}
                    alt={`${item.name} - Hospital grade infection control by GRD Pharmaceuticals`}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      if (item.fallbackImage) e.currentTarget.src = item.fallbackImage;
                    }}
                  />
                </div>

                {/* Bottom Bar: Icon + Product Name + Arrow Icon */}
                <div className="bg-white px-5 py-4 flex items-center justify-between border-t border-forest-50 mt-auto">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Category icon */}
                    <div className="w-6 h-6 flex items-center justify-center text-forest-800 group-hover:text-terracotta-600 transition-colors shrink-0">
                      {item.id === 'handuser-c' && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="6" width="20" height="12" rx="2" />
                          <path d="M12 12h.01" />
                        </svg>
                      )}
                      {(item.id === 'environment-sanitizer' || item.id === 'hand-sanitizer') && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 2h4" />
                          <path d="M12 2v4" />
                          <rect x="7" y="6" width="10" height="14" rx="3" />
                          <circle cx="12" cy="13" r="2" />
                        </svg>
                      )}
                      {item.id === 'surface-sanitizer' && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m3 3 3 9-3 3 2 3h4l2-3-3-9" />
                          <path d="M14 4h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" />
                          <path d="M14 2v4" />
                        </svg>
                      )}
                      {item.id === 'liquid-hand-wash' && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2v4" />
                          <path d="M9 2h6" />
                          <rect x="6" y="6" width="12" height="15" rx="3" />
                          <path d="M12 11v5" />
                        </svg>
                      )}
                    </div>

                    <span className="font-serif font-bold text-sm sm:text-base text-forest-900 group-hover:text-forest-700 transition-colors leading-snug line-clamp-1">
                      {item.name}
                    </span>
                  </div>

                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 group-hover:text-terracotta-500 group-hover:translate-x-1 transition-all shrink-0 ml-2">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/hygiene-products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest-900 text-white text-sm font-semibold shadow-sm"
          >
            <span>Explore Hygiene Range</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Green Authority Banner highlighting Handuser-C (Northeast India's First ABHR in 2012) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 sm:mt-9 rounded-3xl sm:rounded-4xl bg-gradient-to-br from-forest-950 via-forest-900 to-[#061224] text-white p-7 sm:p-9 lg:p-10 shadow-xl relative overflow-hidden border border-forest-700/60"
        >
          {/* Subtle ambient background glow */}
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-forest-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 -bottom-10 w-64 h-64 bg-terracotta-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-10">
            <div className="space-y-3 max-w-3xl">
              <h3 className="text-2xl sm:text-3xl lg:text-[2rem] font-serif font-bold text-white leading-snug">
                Handuser-C® — Northeast India’s 1st Hand Sanitizer
              </h3>

              <p className="text-forest-100/90 text-sm sm:text-base leading-relaxed font-light">
                Hospital-grade antiseptic hand rub formulated to WHO standards. Trusted by government medical colleges, the Indian Army, and Indian Railways across Northeast India.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-800/60 border border-forest-700/60 text-xs text-forest-100 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-terracotta-400 shrink-0" />
                  Hospital-Grade Sanitizer
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-800/60 border border-forest-700/60 text-xs text-forest-100 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-terracotta-400 shrink-0" />
                  WHO-Standard Formula
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-800/60 border border-forest-700/60 text-xs text-forest-100 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-terracotta-400 shrink-0" />
                  Supplied to Army &amp; Railways
                </span>
              </div>
            </div>

            <div className="shrink-0 w-full sm:w-auto flex items-center pt-2 lg:pt-0">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link
                  to="/product/handuser-c"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-white hover:bg-forest-50 text-forest-900 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all group whitespace-nowrap"
                >
                  <span>Explore Handuser-C</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
