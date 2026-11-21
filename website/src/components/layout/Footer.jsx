import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Building2, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  X, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  FileCheck2,
  Factory
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../common/Logo';

// Custom clean SVG Social Media Icons
function LinkedInIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

function TwitterXIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function FacebookIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
    </svg>
  );
}

function InstagramIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function YouTubeIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.26 5 12 5 12 5s-6.26 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2C2 8.76 2 12 2 12s0 3.24.42 4.81a2.5 2.5 0 0 0 1.76 1.77C5.74 19 12 19 12 19s6.26 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77C22 15.24 22 12 22 12s0-3.24-.42-4.81zM10 15V9l5.2 3-5.2 3z"/>
    </svg>
  );
}

export default function Footer({ onOpenEnquiry, onOpenPortalLogin }) {
  const [activeLegalModal, setActiveLegalModal] = useState(null);

  // Exact authentic social links from https://grdpharma.in/
  const socialLinks = [
    { name: 'Facebook', icon: FacebookIcon, href: 'https://www.facebook.com/grd.pharma', label: 'Connect with GRD on Facebook' },
    { name: 'Instagram', icon: InstagramIcon, href: 'https://www.instagram.com/grd.pharma/', label: 'Follow GRD on Instagram' },
    { name: 'Twitter', icon: TwitterXIcon, href: 'https://twitter.com/grd_pharma', label: 'Follow GRD on Twitter' },
    { name: 'Email', icon: Mail, href: 'mailto:mail@grdpharma.in', label: 'Email GRD Trade Desk' },
  ];

  return (
    <>
      <footer className="relative bg-[#040D1A] text-white overflow-hidden border-t border-forest-900/90">
        
        {/* High-Resolution Laboratory & Pharmaceutical Facility Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-45"
          style={{ backgroundImage: `url('/images/footer-bg.jpg')` }}
        />
        
        {/* Multi-layered Glassmorphic & Vignette Overlay for Crisp Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040D1A]/94 via-[#071526]/88 to-[#02070F]/96 pointer-events-none" />

        {/* Luminous Top Terracotta Dividing Line */}
        <div className="relative h-[2.5px] w-full bg-gradient-to-r from-transparent via-terracotta-500 to-transparent shadow-[0_0_12px_rgba(200,90,46,0.6)]" />

        <div className="site-container relative z-10 pt-10 sm:pt-14 pb-8">
          
          {/* Main 4-Column Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-8 border-b border-forest-800/70">
            
            {/* Column 1: Brand, Affiliation, Badges & Social Links (4.5 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Logo variant="light" />
              
              <p className="text-forest-200/90 text-xs sm:text-sm leading-relaxed max-w-sm">
                Formulating and marketing high-quality pharmaceutical medicines and personal hygiene products. Committed to improving everyday health and well-being across 8 Northeastern states since 2006.
              </p>

              {/* Verified Trust Badges */}
              <div className="flex flex-wrap gap-2 pt-0.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-forest-900/80 text-forest-100 border border-forest-700/60 text-xs font-medium shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-terracotta-400" />
                  cGMP Certified Facility
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-forest-900/80 text-forest-100 border border-forest-700/60 text-xs font-medium shadow-sm">
                  <Award className="w-3.5 h-3.5 text-terracotta-400" />
                  ISO 9001:2015 QMS
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-forest-900/80 text-forest-100 border border-forest-700/60 text-xs font-medium shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-terracotta-400" />
                  NABL Tested Batches
                </span>
              </div>

              {/* Dhanuka Heritage & Social Icons */}
              <div className="pt-2 space-y-3">
                <p className="text-[11px] text-forest-300/80 font-medium">
                  A Unit of Dhanuka Group &bull; Over 100 Years of Commercial Heritage
                </p>

                {/* Social Media Links Bar */}
                <div className="flex items-center gap-2.5 pt-1">
                  {socialLinks.map((s) => {
                    const IconComponent = s.icon;
                    return (
                      <motion.a
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.12, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-8 h-8 rounded-full bg-forest-900/80 hover:bg-terracotta-500 text-forest-200 hover:text-white border border-forest-700/60 flex items-center justify-center transition-all duration-300 shadow-sm"
                        aria-label={s.label}
                        title={s.name}
                      >
                        <IconComponent className="w-4 h-4" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links (2.5 cols) */}
            <div className="lg:col-span-2 space-y-3.5">
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold tracking-widest text-terracotta-400 uppercase">Navigation</h4>
                <h5 className="font-serif font-bold text-base text-white">Quick Links</h5>
                <div className="w-8 h-0.5 bg-terracotta-500 rounded-full" />
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-forest-200/85">
                <li>
                  <Link to="/" className="hover:text-terracotta-400 hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    <ChevronRight className="w-3 h-3 text-terracotta-400/80" /> Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-terracotta-400 hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    <ChevronRight className="w-3 h-3 text-terracotta-400/80" /> About GRD
                  </Link>
                </li>
                <li>
                  <Link to="/pharmaceutical-products" className="hover:text-terracotta-400 hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    <ChevronRight className="w-3 h-3 text-terracotta-400/80" /> Products Portfolio
                  </Link>
                </li>
                <li>
                  <Link to="/hygiene-products" className="hover:text-terracotta-400 hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    <ChevronRight className="w-3 h-3 text-terracotta-400/80" /> Hygiene Range
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-terracotta-400 hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    <ChevronRight className="w-3 h-3 text-terracotta-400/80" /> Contact Us
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveLegalModal('quality')}
                    className="hover:text-terracotta-400 hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-terracotta-400/80" /> Quality Assurance
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onOpenPortalLogin && onOpenPortalLogin()}
                    className="text-terracotta-400 hover:text-terracotta-300 font-semibold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-terracotta-400" />
                    <span>PharmaPredict AI Portal</span>
                    <span className="text-[10px] bg-terracotta-500/25 text-terracotta-300 px-1.5 py-0.5 rounded font-sans font-bold">LOGIN</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Formulations Portfolio (2.5 cols) */}
            <div className="lg:col-span-3 space-y-3.5">
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold tracking-widest text-terracotta-400 uppercase">Medicines</h4>
                <h5 className="font-serif font-bold text-base text-white">Our Formulations</h5>
                <div className="w-8 h-0.5 bg-terracotta-500 rounded-full" />
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-forest-200/85">
                <li>
                  <Link to="/pharmaceutical-products?category=tablets" className="hover:text-terracotta-400 hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    <span className="text-terracotta-400 font-bold">&bull;</span> Tablets Formulations
                  </Link>
                </li>
                <li>
                  <Link to="/pharmaceutical-products?category=capsules" className="hover:text-terracotta-400 hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    <span className="text-terracotta-400 font-bold">&bull;</span> Pellets &amp; Capsules
                  </Link>
                </li>
                <li>
                  <Link to="/pharmaceutical-products?category=syrups" className="hover:text-terracotta-400 hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    <span className="text-terracotta-400 font-bold">&bull;</span> Syrups &amp; Expectorants
                  </Link>
                </li>
                <li>
                  <Link to="/pharmaceutical-products?category=suspensions" className="hover:text-terracotta-400 hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    <span className="text-terracotta-400 font-bold">&bull;</span> Oral Suspensions
                  </Link>
                </li>
                <li>
                  <Link to="/product/handuser-c" className="hover:text-terracotta-400 hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    <span className="text-terracotta-400 font-bold">&bull;</span> Handuser-C (ABHR Pioneer)
                  </Link>
                </li>
                <li>
                  <Link to="/hygiene-products" className="hover:text-terracotta-400 hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    <span className="text-terracotta-400 font-bold">&bull;</span> Surface &amp; Liquid Hand Wash
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Locations & Contact Details (3 cols) */}
            <div className="lg:col-span-3 space-y-3.5">
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold tracking-widest text-terracotta-400 uppercase">Reach Us</h4>
                <h5 className="font-serif font-bold text-base text-white">Get in Touch</h5>
                <div className="w-8 h-0.5 bg-terracotta-500 rounded-full" />
              </div>

              <div className="space-y-2.5 text-xs text-forest-200/90">
                {/* Head Office Card */}
                <div className="flex items-start gap-2.5 bg-forest-900/60 backdrop-blur-sm p-2.5 rounded-2xl border border-forest-800/80 hover:border-forest-700 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-terracotta-500/20 text-terracotta-400 flex items-center justify-center shrink-0 border border-terracotta-500/30">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block text-white text-xs font-semibold">Head Office – Guwahati</strong>
                    <span className="text-[11px] text-forest-300 leading-tight">Dhanuka Complex, Block-B, Athgaon, Guwahati, Assam — 781001</span>
                  </div>
                </div>

                {/* Branch Office Card (New Delhi) */}
                <div className="flex items-start gap-2.5 bg-forest-900/60 backdrop-blur-sm p-2.5 rounded-2xl border border-forest-800/80 hover:border-forest-700 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-terracotta-500/20 text-terracotta-400 flex items-center justify-center shrink-0 border border-terracotta-500/30">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block text-white text-xs font-semibold">Branch Office – New Delhi</strong>
                    <span className="text-[11px] text-forest-300 leading-tight">R-193, Greater Kailash Part 1, New Delhi — 110048</span>
                  </div>
                </div>

                {/* Factory Card */}
                <div className="flex items-start gap-2.5 bg-forest-900/60 backdrop-blur-sm p-2.5 rounded-2xl border border-forest-800/80 hover:border-forest-700 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-terracotta-500/20 text-terracotta-400 flex items-center justify-center shrink-0 border border-terracotta-500/30">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block text-white text-xs font-semibold">Factory – Rani Industrial Area</strong>
                    <span className="text-[11px] text-forest-300 leading-tight">D-15, Rani Industrial Area, Rani, Kamrup, Assam — 781131</span>
                  </div>
                </div>

                {/* Phone & Email Strip */}
                <div className="pt-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-terracotta-400 shrink-0" />
                    <a href="tel:+919706001000" className="text-xs text-forest-200 hover:text-white font-medium">
                      +91-9706001000 / +91-7099071000
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-terracotta-400 shrink-0" />
                    <span className="text-[11px] text-forest-300">
                      Mon – Sat: 9:30 AM – 6:30 PM (IST)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-terracotta-400 shrink-0" />
                    <a href="mailto:contact@grdpharma.in" className="text-xs text-forest-200 hover:text-white font-medium">
                      contact@grdpharma.in
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Legal Policy Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-forest-300/70 gap-3">
            <p>© 2026 GRD Pharmaceuticals (A Unit of Dhanuka Group). All Rights Reserved.</p>
            
            <div className="flex items-center gap-4 text-[11px] sm:text-xs">
              <button 
                onClick={() => setActiveLegalModal('privacy')}
                className="hover:text-terracotta-400 transition-colors"
              >
                Privacy Policy
              </button>
              <span>&bull;</span>
              <button 
                onClick={() => setActiveLegalModal('terms')}
                className="hover:text-terracotta-400 transition-colors"
              >
                Terms &amp; Conditions
              </button>
              <span>&bull;</span>
              <button 
                onClick={() => setActiveLegalModal('quality')}
                className="hover:text-terracotta-400 transition-colors"
              >
                Quality Assurance
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Interactive Legal & Quality Policy Modals */}
      <AnimatePresence>
        {activeLegalModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-gray-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto border border-forest-100"
            >
              <button
                onClick={() => setActiveLegalModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-500 focus:outline-none"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {activeLegalModal === 'privacy' && (
                <div className="space-y-4">
                  <span className="text-xs uppercase font-bold tracking-widest text-terracotta-600 block">Governance</span>
                  <h3 className="text-2xl font-serif font-bold text-forest-900">Privacy Policy</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    GRD Pharmaceuticals respects your privacy and is dedicated to safeguarding commercial and personal data. When you submit commercial enquiries or contact our Guwahati corporate office or Rani facility, we collect business contact details strictly to process quotations, fulfill trade orders, and communicate regarding medicinal or hygiene product batches.
                  </p>
                  <h4 className="text-sm font-bold text-forest-900 pt-2">Data Protection Standards</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    We implement industry-standard technical measures aligned with Indian information technology regulations. Your information is never sold, leased, or disclosed to third-party marketing entities.
                  </p>
                  <p className="text-[11px] text-gray-400 pt-3 border-t">GRD Pharmaceuticals &bull; Athgaon, Guwahati, Assam</p>
                </div>
              )}

              {activeLegalModal === 'terms' && (
                <div className="space-y-4">
                  <span className="text-xs uppercase font-bold tracking-widest text-terracotta-600 block">Regulatory</span>
                  <h3 className="text-2xl font-serif font-bold text-forest-900">Terms &amp; Conditions</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    All product details, therapeutic indications, and formulation descriptions presented on this website are intended exclusively for verified healthcare professionals, licensed pharmacies, hospitals, and authorised trade distributors.
                  </p>
                  <h4 className="text-sm font-bold text-forest-900 pt-2">Regulatory Compliance</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    All allopathic pharmaceutical formulations (tablets, capsules, syrups, suspensions) are manufactured in our GMP-licensed facility in Rani, Kamrup, Assam in accordance with the Drugs and Cosmetics Act of India.
                  </p>
                  <p className="text-[11px] text-gray-400 pt-3 border-t">GRD Pharmaceuticals &bull; A Unit of Dhanuka Group</p>
                </div>
              )}

              {activeLegalModal === 'quality' && (
                <div className="space-y-4">
                  <span className="text-xs uppercase font-bold tracking-widest text-terracotta-600 block">Quality Assurance</span>
                  <h3 className="text-2xl font-serif font-bold text-forest-900">Quality Assurance Policy</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    GRD Pharmaceuticals maintains an unwavering commitment to international quality standards:
                  </p>
                  <ul className="text-xs text-gray-600 space-y-2 list-disc pl-5">
                    <li><strong>cGMP Compliance:</strong> Our manufacturing plant in Rani Industrial Area adheres strictly to good manufacturing practices.</li>
                    <li><strong>ISO 9001:2015:</strong> Total Quality Management System covering raw material inspection, in-process testing, and batch release.</li>
                    <li><strong>NABL Batch Certification:</strong> Every finished drug batch undergoes quantitative testing at NABL-accredited third-party laboratories.</li>
                  </ul>
                  <p className="text-[11px] text-gray-400 pt-3 border-t">Quality Assurance Division &bull; Rani Industrial Area, Kamrup, Assam</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
