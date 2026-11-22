import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  ShieldCheck, 
  Award, 
  Factory, 
  CheckCircle2, 
  ArrowRight,
  Send,
  Building2,
  FileCheck2,
  Truck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '@/components';
import { PHARMA_CATEGORIES, EXTENDED_PHARMA_PORTFOLIO } from '../data/products';
import { PARTNER_AWARDS } from '../data/company';

export default function PharmaceuticalProducts({ onOpenEnquiry }) {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showTestingSpecs, setShowTestingSpecs] = useState(false);

  const toggleCategory = (id) => {
    setExpandedCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="bg-cream-50 min-h-screen">
      <SEO
        title="Pharmaceutical Formulations | Tablets, Capsules, Syrups | GRD Pharmaceuticals"
        description="Explore GRD Pharmaceuticals' cGMP-certified dosage forms: tablets of various combinations, hard gelatin capsules, oral syrups, and suspensions manufactured in Rani, Kamrup, Assam."
      />
      
      {/* 1. Page Hero Banner with Automated Formulation Production Background */}
      <section className="relative text-white py-12 sm:py-14 lg:py-16 overflow-hidden bg-forest-950 border-b border-forest-800/80">
        {/* Full-Width Background Image with Subtle Zoom Motion & High Visibility */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: `url('/images/hero-pharma-bg.webp')`,
              backgroundPosition: 'right 40%'
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
              <span className="text-white font-medium">Pharmaceutical Formulations</span>
            </nav>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              Pharmaceutical Formulations
            </h1>
            
            <p className="text-forest-100 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
              Established in 2006, GRD Pharmaceuticals actively manufactures and markets pharmaceutical tablets, capsules, syrups and suspensions of various combinations from our GMP certified plant at Rani, Assam.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenEnquiry && onOpenEnquiry('Pharmaceutical Formulations Inquiry')}
                className="inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition-all duration-300 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Commercial Formulation Enquiry</span>
              </button>

              <button
                onClick={() => onOpenEnquiry && onOpenEnquiry('Contract Manufacturing Inquiry')}
                className="inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 backdrop-blur-sm transition-all duration-300 cursor-pointer"
              >
                <span>Contract Manufacturing</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Official Statement from grdpharma.in */}
      <section className="py-10 bg-white border-b border-forest-100/70">
        <div className="site-container">
          <div className="p-6 sm:p-8 lg:p-9 rounded-3xl bg-[#F6FAF7] border border-forest-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
                Official Company Statement
              </span>
              <p className="text-forest-900 font-serif text-lg sm:text-xl font-medium leading-relaxed">
                “Established in 2006, we actively manufacture and market pharmaceutical tablets, capsules, syrups and suspensions of various combinations. Our manufacturing facility is also geared to undertake contract manufacturing and our marketing team can also provide C&F services for our clients.”
              </p>
              <p className="text-xs text-gray-500 font-semibold tracking-wide">
                — GRD Pharmaceuticals &bull; A Unit of Dhanuka Group (Guwahati, Assam)
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-semibold text-forest-800">
              <span className="px-3.5 py-1.5 rounded-full bg-white border border-forest-200 shadow-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                GMP Certified Plant
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white border border-forest-200 shadow-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                ISO 9001:2015 QMS
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white border border-forest-200 shadow-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                NABL Lab Tested Batches
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Dosage Formulations Capabilities */}
      <section className="section-spacing">
        <div className="site-container">
          
          <div className="max-w-2xl mb-8 sm:mb-12">
            <div className="w-12 h-1 bg-terracotta-500 rounded-full mb-3" />
            <span className="text-xs uppercase font-bold tracking-widest text-terracotta-600 block mb-1">
              Manufacturing Spectrum
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-forest-900">
              Formulation Dosage Forms
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2 leading-relaxed">
              Manufactured under strict Good Manufacturing Practices (GMP) and ISO 9001:2015 certified quality systems at our Rani industrial facility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PHARMA_CATEGORIES.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="bg-white rounded-3xl overflow-hidden border border-forest-100 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`p-6 ${cat.bgTint} flex items-center justify-center border-b border-forest-50`}>
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-40 h-28 object-contain transform hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        if (cat.fallbackImage) e.currentTarget.src = cat.fallbackImage;
                      }}
                    />
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-serif font-bold text-xl text-forest-900">
                      {cat.name}
                    </h3>
                    <p className="text-xs font-semibold text-terracotta-600">
                      {cat.tagline}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed font-light">
                      {cat.description}
                    </p>

                    {/* Progressive Disclosure Toggle */}
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className="text-[11px] font-semibold text-terracotta-600 hover:text-terracotta-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>{expandedCategories[cat.id] ? 'Hide Formulations' : 'View Formulations (3+)'}</span>
                        {expandedCategories[cat.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>

                    {expandedCategories[cat.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.25 }}
                        className="pt-2 space-y-2 border-t border-gray-100"
                      >
                        {cat.highlights && cat.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-forest-900 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                        {cat.storage && (
                          <p className="text-[11px] text-gray-500 pt-1 leading-relaxed">
                            <strong>Storage:</strong> {cat.storage}
                          </p>
                        )}
                        {cat.safetyWarning && (
                          <p className="text-[11px] text-terracotta-700 font-medium pt-0.5 leading-relaxed">
                            <strong>Regulatory:</strong> {cat.safetyWarning}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => onOpenEnquiry && onOpenEnquiry(`${cat.name} Formulations Inquiry`)}
                    className="w-full py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold text-center transition-colors shadow-sm cursor-pointer"
                  >
                    Enquire for {cat.name}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Extended Portfolio: Dry Syrup & Injectables */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {EXTENDED_PHARMA_PORTFOLIO.filter(item => item.id === 'dry-syrup' || item.id === 'injectables').map((item) => (
              <div 
                key={item.id} 
                className="p-6 rounded-3xl bg-white border border-forest-100 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-terracotta-600 uppercase tracking-widest">
                    Product Portfolio
                  </span>
                  <h4 className="font-serif font-bold text-lg text-forest-900">{item.name}</h4>
                  <p className="text-xs text-gray-600 max-w-md">{item.description}</p>
                </div>

                <button
                  onClick={() => onOpenEnquiry && onOpenEnquiry(`${item.name} Inquiry`)}
                  className="px-5 py-2.5 rounded-full border border-forest-800 text-forest-900 hover:bg-forest-50 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
                >
                  Enquire Now
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Quality Policy: Dual-Testing & NABL Protocols */}
      <section className="section-spacing bg-white border-y border-forest-100/70">
        <div className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-card border border-forest-100">
                <img
                  src="/images/about-microscope.webp"
                  alt="Quality control and analytical testing at GRD Pharmaceuticals"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = '/images/about-microscope.png';
                  }}
                />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-forest-900/90 text-white text-xs font-semibold backdrop-blur-sm">
                  cGMP &amp; ISO 9001:2015
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <div className="w-12 h-1 bg-terracotta-500 rounded-full" />
                <span className="text-xs uppercase font-bold tracking-widest text-terracotta-600 block">
                  Quality Assurance
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">
                  Dual-Testing Quality Framework
                </h3>
              </div>

              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                We at GRD, direct a strong focus towards Quality. That is why, besides an internal Quality Control process and test, we also have <strong>samples from each production batch tested at NABL accredited laboratories</strong>. Our Quality Management System is also <strong>ISO 9001:2015 certified</strong>, besides our production unit also being a <strong>GMP certified plant</strong>.
              </p>

              {/* Progressive Disclosure for Detailed Analytical Standards */}
              {showTestingSpecs && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.25 }}
                  className="p-4 rounded-2xl bg-forest-50/70 border border-forest-100 text-xs text-gray-700 space-y-2 font-light"
                >
                  <p>
                    <strong>Independent NABL Verification:</strong> Every batch undergoes independent chromatographic purity assays, dissolution profiling, microbial limit testing, and physical validation before release.
                  </p>
                  <p>
                    <strong>Zone IVb Stability Validation:</strong> Formulations are accelerated stability-tested to withstand extreme tropical humidity and heat prevalent across Northeast India.
                  </p>
                </motion.div>
              )}

              <div>
                <button
                  type="button"
                  onClick={() => setShowTestingSpecs(!showTestingSpecs)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 transition-colors cursor-pointer"
                >
                  <span>{showTestingSpecs ? 'Hide Testing Protocols' : 'View Testing Protocols'}</span>
                  {showTestingSpecs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-gray-700 font-medium">
                <div className="p-3.5 rounded-2xl bg-forest-50/70 border border-forest-100 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Internal Quality Control Process &amp; Tests</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-forest-50/70 border border-forest-100 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Each Batch Tested at NABL Labs</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-forest-50/70 border border-forest-100 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>ISO 9001:2015 Certified QMS</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-forest-50/70 border border-forest-100 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>GMP Certified Manufacturing Plant</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Contract Manufacturing & C&F Services */}
      <section className="section-spacing">
        <div className="site-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1: Contract Manufacturing */}
            <div className="p-6 sm:p-8 rounded-3xl bg-forest-900 text-white space-y-4 shadow-xl border border-forest-800 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-forest-800 border border-forest-700 flex items-center justify-center text-terracotta-400">
                  <Factory className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-terracotta-400 block">
                  Third-Party Production
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Contract Manufacturing
                </h3>
                <p className="text-forest-200 text-xs sm:text-sm leading-relaxed font-light">
                  Our manufacturing facility at Rani Industrial Area is fully geared to undertake third-party contract manufacturing for pharmaceutical clients. We offer high-capacity tableting, capsule filling, syrup processing, and quality validation.
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => onOpenEnquiry && onOpenEnquiry('Third-Party Contract Manufacturing Proposal')}
                  className="w-full sm:w-auto px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm hover:shadow cursor-pointer"
                >
                  Request Contract Manufacturing Proposal
                </button>
              </div>
            </div>

            {/* Card 2: C&F Services */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white text-forest-950 space-y-4 shadow-card border border-forest-100 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 block">
                  Supply Chain &amp; Logistics
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-forest-900">
                  C&amp;F Services
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-light">
                  Our marketing team can also provide Carrying &amp; Forwarding (C&amp;F) services for our clients across Northeast India, backed by over a century of Dhanuka Group trade and distribution infrastructure.
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => onOpenEnquiry && onOpenEnquiry('C&F Services Partnership Inquiry')}
                  className="w-full sm:w-auto px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm hover:shadow cursor-pointer"
                >
                  Explore C&amp;F Partnerships
                </button>
              </div>
            </div>

          </div>

          {/* Institutional & Commercial Banner (Exact Reference Image 2) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="mt-8 sm:mt-10 rounded-3xl bg-gradient-to-br from-forest-950 via-forest-900 to-[#061224] p-6 sm:p-8 lg:p-9 text-white border border-forest-800/80 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-forest-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                Commercial &amp; Institutional Partnerships
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight leading-tight">
                Partner with Northeast India's Trusted Pharmaceutical Manufacturer
              </h3>
              <p className="text-forest-100 text-xs sm:text-sm font-light leading-relaxed max-w-2xl">
                Approved supplier to State Health Missions, Government Medical Colleges, Indian Army, Indian Railways, third-party PCD pharma, and regional healthcare distributors.
              </p>
            </div>
            <div className="relative z-10 shrink-0">
              <button
                onClick={() => onOpenEnquiry && onOpenEnquiry('Commercial & Institutional Proposal')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                <span>Request Commercial Proposal</span>
              </button>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
