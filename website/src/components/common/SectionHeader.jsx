import React from 'react';
import { motion } from 'framer-motion';

export default function SectionHeader({
  kicker = '',
  title,
  subtitle = '',
  align = 'left',
  className = '',
}) {
  const isCenter = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`space-y-2.5 ${isCenter ? 'text-center mx-auto' : ''} ${className}`}
    >
      {/* Terracotta horizontal accent bar */}
      <div className={`w-14 h-1.5 bg-terracotta-500 rounded-full ${isCenter ? 'mx-auto' : ''}`} />

      {kicker && (
        <span className="text-xs uppercase font-bold tracking-widest text-terracotta-600 block">
          {kicker}
        </span>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-serif font-bold text-forest-900 tracking-tight leading-[1.15]">
        {title}
      </h2>

      {subtitle && (
        <p className={`text-gray-600 text-sm sm:text-base leading-relaxed ${isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
