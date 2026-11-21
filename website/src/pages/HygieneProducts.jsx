import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Droplets, SprayCan, Package, ChevronRight, ChevronDown, ChevronUp, CheckCircle2, ArrowRight, BookOpen, FileText, ExternalLink, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '@/components';
import { HYGIENE_PRODUCTS, HYGIENE_BANNERS, HYGIENE_ARTICLES } from '../data/products';

export default function HygieneProducts({ onOpenEnquiry }) {
  const [expandedArticles, setExpandedArticles] = useState({});
  const [expandedProducts, setExpandedProducts] = useState({});

  const toggleArticle = (id) => {
    setExpandedArticles(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleProduct = (id) => {
    setExpandedProducts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  return (
    <div className="bg-cream-50 min-h-screen">
      <SEO
        title="Hygiene & Sanitization Products | Handuser-C, SurfoUser-A | GRD Pharmaceuticals"
        description="Discover hospital-grade infection control and hygiene products by GRD Pharmaceuticals: Handuser-C (Northeast's 1st ABHR), SurfoUser-A surface sanitizer, and EnvoUser-5 environmental disinfectant."
      />
      
      {/* Page Hero Banner with Clinical Infection Control Suite Background */}
      <section className="relative text-white py-12 sm:py-14 lg:py-16 overflow-hidden bg-forest-950 border-b border-forest-800/80">
        {/* Full-Width Background Image with Subtle Zoom Motion & High Visibility */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: `url('/images/hero-hygiene-bg.webp')`,
              backgroundPosition: 'right 45%'
            }}
          />
        </div>

        {/* Directional Navy Scrim: Opaque on left for text readability, clear on right for vivid image display */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-950/80 to-forest-950/50 lg:from-forest-950/90 lg:via-forest-950/45 lg:to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-forest-950/20 lg:from-forest-950/30 lg:via-transparent lg:to-transparent pointer-events-none" />

        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-terracotta-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

        <div className="site-container relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl space-y-3.5"
          >
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-forest-200/80 font-medium">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-forest-400/60 shrink-0" />
              <span className="text-white font-medium">Hygiene Products</span>
            </nav>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              Hygiene &amp; Sanitization Products
            </h1>
            
            <p className="text-forest-100 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
              Everyday hygiene and hospital-grade infection control solutions engineered for healthcare institutions, corporate workplaces, public transport, and households across Northeast India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 1. Official Portfolio Showcase: Complete Range of Sanitization Products (P1 image) - Full Cover Grand Display */}
      <section className="section-spacing bg-white border-b border-forest-50/80">
        <div className="site-container space-y-6 sm:space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-50 border border-forest-200 text-forest-800 text-xs font-semibold uppercase tracking-wider">
              Institutional &amp; Healthcare Portfolio
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-forest-900 tracking-tight">
              Complete Range of Sanitization Products
            </h2>
            <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
              Safe Hands • Safe Surfaces • Safe Environment — Formulated to hospital-grade standards and supplied to State Health Missions, Government Medical Colleges, Indian Army, Indian Railways, and healthcare institutions across Northeast India.
            </p>
          </div>

          {/* Full Cover Showcase Banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55 }}
            className="rounded-3xl sm:rounded-4xl overflow-hidden border border-forest-100 shadow-xl bg-white"
          >
            <div className="w-full bg-white flex items-center justify-center">
              <img
                src="/images/products/p1-complete-range.webp"
                alt="GRD Complete Range of Sanitization Products - Safe Hands, Safe Surfaces, Safe Environment"
                className="w-full h-auto block"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = '/images/products/p1-complete-range.png';
                }}
              />
            </div>

            {/* Quality and Supply Footprint Strip */}
            <div className="bg-forest-50/60 border-t border-forest-100 px-4 py-3 sm:px-6 sm:py-3.5 flex flex-wrap items-center justify-around gap-3 text-xs text-forest-900 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest-700" /> Safe Hands (Handuser-C &amp; Handuser-G)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest-700" /> Safe Surfaces (SurfoUser-A)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest-700" /> Safe Environment (EnvoUser-5)
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-forest-700" /> NABL Tested &bull; Govt Approved Rates
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Complete Hygiene Portfolio Grid (P5, P6, P7, P8 Cards) - Compact 4-Column Grid */}
      <section className="section-spacing">
        <div className="site-container">
          
          <div className="space-y-2 mb-8 sm:mb-10">
            <div className="w-10 h-1 bg-terracotta-500 rounded-full" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-forest-900 tracking-tight">
              The Complete Hygiene &amp; Sanitization Line
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm max-w-2xl font-light leading-relaxed">
              From personal pocket-sized protection to 5-litre bulk institutional refills with authentic GRD formulation standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HYGIENE_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-3xl overflow-hidden border border-forest-100 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 group"
              >
                <div className="p-4 sm:p-5 flex flex-col space-y-3">
                  
                  {/* Product visual with authentic provided packaging - Full Cover square */}
                  <div className="w-full aspect-square rounded-2xl overflow-hidden border border-forest-100/80 shadow-xs bg-white">
                    <img
                      src={prod.image}
                      alt={`${prod.name} authentic pack - ${prod.category} by GRD Pharmaceuticals`}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        if (prod.fallbackImage) e.currentTarget.src = prod.fallbackImage;
                      }}
                    />
                  </div>

                  {/* Product details */}
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-terracotta-600 tracking-wider uppercase block">
                        {prod.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-forest-900 leading-snug line-clamp-1 group-hover:text-forest-700 transition-colors">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {prod.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed font-light line-clamp-2">
                      {prod.shortDesc}
                    </p>

                    {/* Pack sizes badges */}
                    <div className="pt-0.5">
                      <p className="text-[10px] font-semibold text-gray-500 mb-1">Available Pack Sizes:</p>
                      <div className="flex flex-wrap gap-1">
                        {prod.packSizes.slice(0, 3).map((size) => (
                          <span
                            key={size}
                            className="px-2 py-0.5 rounded bg-forest-50 text-forest-800 text-[10px] font-medium border border-forest-100"
                          >
                            {size}
                          </span>
                        ))}
                        {prod.packSizes.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded bg-forest-50 text-gray-500 text-[10px] font-medium">
                            +{prod.packSizes.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progressive Disclosure Toggle */}
                    {expandedProducts[prod.id] ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.25 }}
                        className="p-2.5 rounded-xl bg-forest-50/70 border border-forest-100/80 text-[11px] space-y-1.5 text-left"
                      >
                        <p className="text-forest-900 font-medium">
                          <strong>Active:</strong> {prod.composition}
                        </p>
                        {prod.usageInstructions && (
                          <p className="text-gray-600 font-light">
                            <strong>Usage:</strong> {prod.usageInstructions}
                          </p>
                        )}
                        {prod.safetyWarnings && (
                          <p className="text-terracotta-700 font-light pt-0.5 border-t border-forest-100/60">
                            <strong>Safety:</strong> {prod.safetyWarnings}
                          </p>
                        )}
                      </motion.div>
                    ) : null}

                    <div className="pt-0.5">
                      <button
                        type="button"
                        onClick={() => toggleProduct(prod.id)}
                        className="text-[11px] font-semibold text-terracotta-600 hover:text-terracotta-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>{expandedProducts[prod.id] ? 'Hide Specs' : 'View Key Specs'}</span>
                        {expandedProducts[prod.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="bg-forest-50/50 px-4 py-3 border-t border-forest-50 flex items-center justify-between gap-2">
                  <Link
                    to={`/product/${prod.slug}`}
                    className="text-xs font-semibold text-forest-800 hover:text-terracotta-600 transition-colors inline-flex items-center gap-1"
                  >
                    <span>Specs</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  <button
                    onClick={() => onOpenEnquiry && onOpenEnquiry(prod.name)}
                    className="px-3.5 py-1.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-[11px] font-semibold transition-colors shadow-xs cursor-pointer"
                  >
                    Enquire
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 4. Specialized Decontamination Campaigns: P2 (EnvoUser-5) & P4 (SurfoUser-A) */}
          <div className="mt-14 space-y-6">
            <div className="space-y-1.5">
              <div className="w-12 h-1.5 bg-terracotta-500 rounded-full" />
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">
                Specialized Disinfection Campaigns
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Large area aerial fogging and instant multi-surface protection for clinics, transportation, and workplaces.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* EnvoUser-5 Banner (P2 image) */}
              <div className="rounded-3xl overflow-hidden border border-forest-100 shadow-card hover:shadow-card-hover transition-all duration-300 bg-white flex flex-col justify-between group">
                <div className="relative overflow-hidden bg-gray-50">
                  <img
                    src="/images/products/p2-envouser-banner.webp"
                    alt="EnvoUser-5 Environment Sanitizer Banner"
                    className="w-full h-auto block"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = '/images/products/p2-envouser-banner.png';
                    }}
                  />
                </div>
                <div className="p-5 bg-white border-t border-forest-50 flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">Unlock to Safe, Sanitized Surroundings</span>
                  <Link
                    to="/product/environment-sanitizer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-900 hover:text-terracotta-600 transition-colors"
                  >
                    <span>Product Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* SurfoUser-A Banner (P4 image) */}
              <div className="rounded-3xl overflow-hidden border border-forest-100 shadow-card hover:shadow-card-hover transition-all duration-300 bg-white flex flex-col justify-between group">
                <div className="relative overflow-hidden bg-gray-50">
                  <img
                    src="/images/products/p4-surfouser-banner.webp"
                    alt="SurfoUser-A Surface Sanitizer Banner"
                    className="w-full h-auto block"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = '/images/products/p4-surfouser-banner.png';
                    }}
                  />
                </div>
                <div className="p-5 bg-white border-t border-forest-50 flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">Safe for Gadgets, Vehicles, Hard &amp; Soft Surfaces</span>
                  <Link
                    to="/product/surface-sanitizer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-900 hover:text-terracotta-600 transition-colors"
                  >
                    <span>Product Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Authentic Hygiene & WHO Guidelines Knowledge Hub (Directly from grdpharma.in) */}
          <div className="mt-16 space-y-8">
            <div className="space-y-2">
              <div className="w-12 h-1.5 bg-terracotta-500 rounded-full" />
              <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600 block">
                Educational Knowledge Hub &bull; As Published on grdpharma.in
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">
                WHO Guidelines &amp; Hygiene Standards
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
                Official health guidance and clinical infection prevention principles published by GRD Pharmaceuticals in accordance with World Health Organization (WHO) protocols.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {HYGIENE_ARTICLES && HYGIENE_ARTICLES.map((article) => (
                <div 
                  key={article.id}
                  className="p-6 sm:p-7 rounded-3xl bg-white border border-forest-100 shadow-card hover:shadow-card-hover transition-all space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-terracotta-600" />
                      <span className="text-[11px] font-bold text-terracotta-600 uppercase tracking-wider">
                        {article.tagline}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-lg text-forest-900 leading-snug">
                      {article.title}
                    </h4>

                    <p className="text-xs text-gray-600 leading-relaxed font-light">
                      {article.summary}
                    </p>

                    {/* Progressive Disclosure for WHO Guidelines */}
                    {expandedArticles[article.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.25 }}
                        className="pt-2 border-t border-forest-50 space-y-2"
                      >
                        {article.content.slice(0, 3).map((paragraph, pIdx) => (
                          <p key={pIdx} className="text-xs text-gray-700 leading-relaxed flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-forest-700 shrink-0 mt-1.5" />
                            <span>{paragraph}</span>
                          </p>
                        ))}
                      </motion.div>
                    )}

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => toggleArticle(article.id)}
                        className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>{expandedArticles[article.id] ? 'Hide Guidance' : 'Read Full Guidance'}</span>
                        {expandedArticles[article.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-gray-400 font-medium">Source: grdpharma.in</span>
                    <button
                      onClick={() => onOpenEnquiry && onOpenEnquiry(`Inquiry about ${article.title}`)}
                      className="text-forest-900 hover:text-terracotta-600 font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Consult Hygiene Desk</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
