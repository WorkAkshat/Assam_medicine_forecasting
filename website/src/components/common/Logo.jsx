import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ variant = 'dark', className = '' }) {
  const isLight = variant === 'light';

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0 ${className}`}>
      {/* Official GRD Monogram Emblem from Logo.png */}
      <div className={`relative rounded-full p-0.5 transition-transform duration-300 group-hover:scale-105 shrink-0 ${
        isLight ? 'bg-white/10 ring-1 ring-white/20' : ''
      }`}>
        <img
          src="/images/products/grd-logo.webp"
          alt="GRD Pharmaceuticals Official Logo"
          className="w-9 h-9 sm:w-11 sm:h-11 object-contain block"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onError={(e) => {
            if (e.currentTarget.src.endsWith('.webp')) {
              e.currentTarget.src = '/images/products/grd-logo.png';
            } else if (!e.currentTarget.src.includes('provided')) {
              e.currentTarget.src = '/provided/Logo.png';
            }
          }}
        />
      </div>

      <div className="flex flex-col justify-center shrink-0">
        <div className="flex items-baseline gap-1 sm:gap-1.5 leading-none">
          <span className={`font-serif text-lg sm:text-2xl font-black tracking-tight transition-colors ${
            isLight ? 'text-white' : 'text-forest-900 group-hover:text-forest-700'
          }`}>
            GRD
          </span>
          <span className={`text-sm sm:text-lg font-bold tracking-tight leading-none whitespace-nowrap ${
            isLight ? 'text-white' : 'text-forest-900'
          }`}>
            Pharmaceuticals
          </span>
        </div>
        <span className={`text-[9px] sm:text-[11px] font-semibold tracking-wide leading-none mt-0.5 sm:mt-1 whitespace-nowrap ${
          isLight ? 'text-forest-200' : 'text-forest-700/80'
        }`}>
          A Unit of Dhanuka Group
        </span>
      </div>
    </Link>
  );
}
