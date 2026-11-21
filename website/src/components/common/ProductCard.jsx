import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ item, basePath = '/pharmaceutical-products', index = 0 }) {
  const targetUrl = `${basePath}?category=${item.slug || item.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Link
        to={targetUrl}
        className="group flex flex-col h-full rounded-3xl overflow-hidden bg-white shadow-card hover:shadow-card-hover border border-forest-100/70 transition-all duration-300"
      >
        {/* Top Image Container with Pastel Background matching reference */}
        <div className={`relative w-full h-48 sm:h-52 lg:h-56 ${item.bgTint || 'bg-[#EBF2EC]'} flex items-center justify-center p-5 overflow-hidden`}>
          <img
            src={item.image}
            alt={`${item.name} pharmaceutical dosage formulations by GRD Pharmaceuticals`}
            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              if (item.fallbackImage) e.currentTarget.src = item.fallbackImage;
            }}
          />
        </div>

        {/* Bottom Bar: Icon + Category Name + Arrow Icon matching reference */}
        <div className="bg-white px-5 py-4 flex items-center justify-between border-t border-forest-50 mt-auto">
          <div className="flex items-center gap-3">
            {/* Custom crisp SVG category icons matching reference */}
            <div className="w-6 h-6 flex items-center justify-center text-forest-800 group-hover:text-terracotta-600 transition-colors">
              {item.id === 'tablets' && (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="12" rx="9" ry="5" />
                  <line x1="6" y1="12" x2="18" y2="12" />
                </svg>
              )}
              {item.id === 'capsules' && (
                <svg className="w-5 h-5 rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="3" width="12" height="18" rx="6" />
                  <line x1="6" y1="12" x2="18" y2="12" />
                </svg>
              )}
              {item.id === 'syrups' && (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3h6v3H9z" />
                  <path d="M8 6h8a2 2 0 0 1 2 2v11a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V8a2 2 0 0 1 2-2z" />
                  <line x1="6" y1="13" x2="18" y2="13" />
                </svg>
              )}
              {item.id === 'suspensions' && (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 2v7.31L4.69 18.25A2 2 0 0 0 6.4 21h11.2a2 2 0 0 0 1.71-2.75L14 9.31V2" />
                  <path d="M8.5 2h7" />
                  <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
                </svg>
              )}
              {!['tablets', 'capsules', 'syrups', 'suspensions'].includes(item.id) && (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              )}
            </div>

            <span className="font-serif font-bold text-base sm:text-lg text-forest-900 group-hover:text-forest-700 transition-colors">
              {item.name}
            </span>
          </div>

          <div className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 group-hover:text-terracotta-500 group-hover:translate-x-1 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
