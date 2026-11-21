import React from 'react';
import { MapPin, Building2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PresenceSection() {
  return (
    <section className="section-spacing bg-white">
      <div className="site-container">
        
        {/* Soft Light Blue Container matching refined clinical aesthetic */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl sm:rounded-4xl bg-[#EDF4FA] p-6 sm:p-8 lg:p-10 overflow-hidden border border-forest-100"
        >
          {/* Subtle decorative wave pattern in background */}
          <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-forest-200/30 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* Left Block (5 cols): Our Presence Heading & Text */}
            <div className="lg:col-span-5 space-y-3">
              <div className="w-12 h-1 bg-terracotta-500 rounded-full" />
              <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-serif font-bold text-forest-900 tracking-tight leading-tight">
                Our Presence
              </h2>
              <p className="text-forest-900/80 text-sm sm:text-base leading-relaxed">
                Our operations are based in Northeast India, with our head office in Guwahati and a manufacturing facility at Rani, Assam.
              </p>
            </div>

            {/* Right Cards (7 cols): Head Office & Factory White Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Card 1: Head Office */}
              <motion.div whileHover={{ y: -4 }}>
                <Link
                  to="/contact"
                  className="group flex items-center gap-4 bg-white p-6 rounded-2xl sm:rounded-3xl shadow-card hover:shadow-card-hover border border-forest-100/60 transition-all duration-300 h-full"
                >
                  <div className="w-12 h-12 rounded-2xl bg-terracotta-50 border border-terracotta-200 flex items-center justify-center text-terracotta-600 group-hover:bg-terracotta-500 group-hover:text-white transition-all duration-300 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-lg text-forest-900 group-hover:text-forest-700 transition-colors">
                      Head Office
                    </h3>
                    <p className="text-sm text-gray-500">
                      Guwahati, Assam
                    </p>
                  </div>
                  <div className="text-gray-400 group-hover:text-terracotta-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>

              {/* Card 2: Factory */}
              <motion.div whileHover={{ y: -4 }}>
                <Link
                  to="/contact"
                  className="group flex items-center gap-4 bg-white p-6 rounded-2xl sm:rounded-3xl shadow-card hover:shadow-card-hover border border-forest-100/60 transition-all duration-300 h-full"
                >
                  <div className="w-12 h-12 rounded-2xl bg-terracotta-50 border border-terracotta-200 flex items-center justify-center text-terracotta-600 group-hover:bg-terracotta-500 group-hover:text-white transition-all duration-300 shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-lg text-forest-900 group-hover:text-forest-700 transition-colors">
                      Factory
                    </h3>
                    <p className="text-sm text-gray-500">
                      Rani, Assam
                    </p>
                  </div>
                  <div className="text-gray-400 group-hover:text-terracotta-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
