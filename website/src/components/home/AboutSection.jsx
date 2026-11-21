import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section className="section-spacing bg-white">
      <div className="site-container">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          
          {/* Left Column: Microscope Lab Image matching reference (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 order-2 lg:order-1"
          >
            <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden shadow-card border border-forest-100 group bg-forest-50/50">
              <img
                src="/images/about-microscope.webp"
                alt="Scientist conducting microscopic drug quality analysis at GRD Pharmaceuticals"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = '/images/about-microscope.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Right Column: About GRD Pharmaceuticals matching reference text (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="lg:col-span-7 order-1 lg:order-2 space-y-6"
          >
            
            <div className="space-y-2.5">
              <div className="w-12 h-1 bg-terracotta-500 rounded-full" />
              <span className="text-xs uppercase font-bold tracking-widest text-terracotta-600 block">
                Corporate Heritage
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-serif font-bold text-forest-900 leading-tight">
                About <span className="font-extrabold text-forest-800">GRD Pharmaceuticals</span>
              </h2>
            </div>

            <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-light">
              GRD Pharmaceuticals is the core healthcare division of the century-old Dhanuka Group in Guwahati. Established in 2006, we actively manufacture and market allopathic tablets, capsules, syrups, and suspensions with cGMP certified manufacturing and regional C&amp;F logistics.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs sm:text-sm text-gray-700 font-medium">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
                <span>State-of-the-art Rani industrial plant</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
                <span>NABL accredited testing protocols</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
                <span>Dhanuka Group 100+ year business legacy</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
                <span>Direct supply across 8 northeastern states</span>
              </div>
            </div>

            <div className="pt-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white hover:bg-forest-50 text-forest-900 font-semibold text-xs sm:text-sm border border-forest-900 transition-all shadow-sm hover:shadow cursor-pointer group"
                >
                  <span>Know More About Us</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
