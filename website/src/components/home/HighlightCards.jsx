import React from 'react';
import { Award, Factory, ShieldCheck, Handshake } from 'lucide-react';
import { motion } from 'framer-motion';
import { COMPANY_HIGHLIGHTS } from '../../data/products';

const iconMap = {
  Award: Award,
  Factory: Factory,
  ShieldCheck: ShieldCheck,
  Handshake: Handshake,
};

export default function HighlightCards({ className = '' }) {
  return (
    <div className={`site-container ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {COMPANY_HIGHLIGHTS.map((item, index) => {
          const Icon = iconMap[item.icon] || ShieldCheck;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
              whileHover={{ y: -4 }}
              className="group relative bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-forest-100/80 shadow-[0_4px_20px_-4px_rgba(10,25,47,0.06)] hover:shadow-[0_12px_28px_-4px_rgba(10,25,47,0.12)] transition-all duration-300 overflow-hidden"
            >
              {/* Subtle terracotta hover accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-terracotta-500 transition-colors duration-300" />

              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800 group-hover:bg-terracotta-50 group-hover:text-terracotta-600 group-hover:border-terracotta-200 transition-all duration-300 shadow-sm shrink-0">
                  <Icon className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-serif font-extrabold text-forest-900 group-hover:text-forest-800 tracking-tight">
                      {item.stat}
                    </span>
                    <span className="text-xs font-bold text-terracotta-600 uppercase tracking-wider">
                      {item.unit}
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="text-sm sm:text-base font-serif font-bold text-forest-900 group-hover:text-forest-800 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
