import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  ShieldCheck, 
  Package, 
  Thermometer, 
  FileText, 
  Mail, 
  Send,
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '@/components';
import { PRODUCTS_CATALOG, HYGIENE_PRODUCTS, PHARMA_CATEGORIES } from '../data/products';

export default function ProductDetails({ onOpenEnquiry }) {
  const { slug } = useParams();
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  // Find product from either catalog or hygiene
  const product = useMemo(() => {
    const pharma = PRODUCTS_CATALOG.find((p) => p.slug === slug || p.id === slug);
    if (pharma) return { ...pharma, type: 'pharmaceutical' };

    const hygiene = HYGIENE_PRODUCTS.find((p) => p.slug === slug || p.id === slug || p.altSlug === slug);
    if (hygiene) return { ...hygiene, type: 'hygiene' };

    // Fallback: search by category slug
    const cat = PHARMA_CATEGORIES.find((c) => c.slug === slug);
    if (cat) {
      return {
        id: cat.id,
        slug: cat.slug,
        name: `${cat.name} Formulations`,
        categoryName: cat.name,
        type: 'category-overview',
        image: cat.image,
        bgTint: cat.bgTint,
        description: cat.description,
        composition: 'Multiple pharmacopeial combinations (IP / BP / USP)',
        indication: cat.tagline,
        packaging: 'Blister / Alu-Alu / Strip / Bottles',
        storage: 'Store below 25°C-30°C in dry conditions protected from direct light.',
      };
    }

    return null;
  }, [slug]);

  // Related products
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    if (product.type === 'hygiene') {
      return HYGIENE_PRODUCTS.filter((p) => p.slug !== slug).slice(0, 3);
    }
    return PRODUCTS_CATALOG.filter((p) => p.category === product.category && p.slug !== slug).slice(0, 3);
  }, [product, slug]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-cream-50 text-center">
        <AlertCircle className="w-12 h-12 text-terracotta-500 mb-3" />
        <h2 className="text-2xl font-serif font-bold text-forest-900 mb-2">Formulation Not Found</h2>
        <p className="text-sm text-gray-600 mb-6 max-w-md">
          The requested formulation details may have moved or been updated. Please browse our product catalog or contact our trade desk.
        </p>
        <Link
          to="/pharmaceutical-products"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest-900 text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 min-h-screen">
      <SEO
        title={`${product.name} | Specifications & Supply | GRD Pharmaceuticals`}
        description={product.shortDesc || product.description || `Official technical specifications and packaging details for ${product.name} manufactured by GRD Pharmaceuticals in Rani, Assam.`}
        image={product.image}
        type="product"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          image: product.image,
          description: product.shortDesc || product.description,
          brand: {
            '@type': 'Brand',
            name: product.brandName || 'GRD Pharmaceuticals'
          },
          manufacturer: {
            '@type': 'Organization',
            name: 'GRD Pharmaceuticals (A Unit of Dhanuka Group)'
          },
          category: product.categoryName || product.category
        }}
      />
      
      {/* Product Details Hero Banner with High-Tech Analytical Lab Background */}
      <section className="relative text-white py-12 sm:py-14 lg:py-16 overflow-hidden bg-forest-950 border-b border-forest-800/80 mb-8 sm:mb-10">
        {/* Full-Width Background Image with Subtle Zoom Motion & High Visibility */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: `url('/images/hero-research-bg.webp')`,
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
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl space-y-3.5"
          >
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-forest-200/80 font-medium">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-forest-400/60 shrink-0" />
              {product.type === 'hygiene' ? (
                <Link to="/hygiene-products" className="hover:text-white transition-colors">Hygiene Products</Link>
              ) : (
                <Link to="/pharmaceutical-products" className="hover:text-white transition-colors">Pharmaceutical Products</Link>
              )}
              <ChevronRight className="w-3 h-3 text-forest-400/60 shrink-0" />
              <span className="text-white font-medium truncate max-w-xs">{product.name}</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-forest-100 text-sm sm:text-base leading-relaxed font-light max-w-2xl">
              {product.indication || product.description}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="site-container pb-12 sm:pb-16">
        
        {/* Product Hero Details Container */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-card border border-forest-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Product Image & Badges (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-3xl bg-white aspect-square overflow-hidden border border-forest-100 shadow-card">
                <img
                  src={product.image}
                  alt={`${product.name} - ${product.categoryName || product.category || 'Formulation'} by GRD Pharmaceuticals`}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  onError={(e) => {
                    if (product.fallbackImage) e.currentTarget.src = product.fallbackImage;
                  }}
                />
                <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-forest-900/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
                  {product.categoryName || product.category || 'Formulation'}
                </span>
              </div>

              {/* Verified Quality Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-cream-100 border border-forest-100/60 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-forest-700 shrink-0" />
                  <div>
                    <strong className="block text-forest-900 font-semibold">cGMP Unit</strong>
                    <span className="text-gray-500 text-[11px]">Rani Industrial Area</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-cream-100 border border-forest-100/60 flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-forest-700 shrink-0" />
                  <div>
                    <strong className="block text-forest-900 font-semibold">ISO 9001:2015</strong>
                    <span className="text-gray-500 text-[11px]">Certified QMS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Technical Details & Inquiry Action (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600 block">
                  {product.categoryName || product.category}
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-forest-900 leading-tight">
                  {product.name}
                </h2>
                {product.subtitle && (
                  <p className="text-sm font-medium text-forest-700">
                    {product.subtitle}
                  </p>
                )}
              </div>

              {/* Composition Box */}
              {product.composition && (
                <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-100 space-y-1">
                  <span className="text-xs font-bold text-forest-900 uppercase tracking-wider block">
                    Composition / Active Ingredients
                  </span>
                  <p className="text-sm text-forest-900 font-medium">
                    {product.composition}
                  </p>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-forest-900">
                  Therapeutic Overview &amp; Profile
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {product.description || product.shortDesc}
                </p>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {product.indication && (
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                      Indications
                    </span>
                    <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                      {product.indication}
                    </p>
                  </div>
                )}

                {product.dosage && (
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                      Dosage Guidance
                    </span>
                    <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                      {product.dosage}
                    </p>
                  </div>
                )}

                {(product.packaging || product.packSizes) && (
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                      Packaging / Pack Sizes
                    </span>
                    <p className="text-xs sm:text-sm text-gray-800 font-medium">
                      {product.packaging || product.packSizes?.join(', ')}
                    </p>
                  </div>
                )}

                {product.storage && (
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                      Storage Conditions
                    </span>
                    <p className="text-xs sm:text-sm text-gray-800">
                      {product.storage}
                    </p>
                  </div>
                )}
              </div>

              {/* Product features with progressive disclosure */}
              {product.features && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-900 block">
                    Key Formulation Features
                  </span>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
                    {(showAllFeatures ? product.features : product.features.slice(0, 3)).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {product.features.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setShowAllFeatures(!showAllFeatures)}
                      className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 inline-flex items-center gap-1 transition-colors cursor-pointer pt-1"
                    >
                      <span>{showAllFeatures ? 'Show Fewer Features' : `View All ${product.features.length} Features`}</span>
                      {showAllFeatures ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              )}

              {/* Usage & Clinical Application Instructions */}
              {product.usageInstructions && (
                <div className="p-4 rounded-2xl bg-forest-50/60 border border-forest-100/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest-900">
                    <FileText className="w-4 h-4 text-forest-700" />
                    <span>Usage &amp; Application Directions</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-light">
                    {product.usageInstructions}
                  </p>
                </div>
              )}

              {/* Appropriate Safety & Precautions Information */}
              {(product.safetyWarnings || product.safetyWarning) && (
                <div className="p-4 rounded-2xl bg-[#FFF8F5] border border-terracotta-200/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-terracotta-800">
                    <AlertTriangle className="w-4 h-4 text-terracotta-600 shrink-0" />
                    <span>Safety Information &amp; Precautions</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-light">
                    {product.safetyWarnings || product.safetyWarning}
                  </p>
                </div>
              )}

              {/* Authentic Certifications & Regulatory Standards (No Invented Claims) */}
              {product.certifications && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                    Verified Quality Standards &bull; Rani Plant Facility
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.certifications.map((cert, cIdx) => (
                      <span
                        key={cIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-100 text-forest-900 border border-forest-200/70 text-[11px] font-medium"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
                        <span>{cert}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Enquiry Button CTA */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4 items-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onOpenEnquiry && onOpenEnquiry(product.name)}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-sm shadow-md transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>Request Trade Quotation / Enquiry</span>
                </motion.button>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to={product.type === 'hygiene' ? '/hygiene-products' : '/pharmaceutical-products'}
                    className="inline-block px-6 py-3.5 rounded-full bg-white hover:bg-forest-50 text-forest-900 border border-gray-300 font-medium text-sm transition-all shadow-sm"
                  >
                    Browse More Formulations
                  </Link>
                </motion.div>
              </div>

            </div>

          </div>
        </motion.div>

        {/* Flagship Innovation Spotlight specifically for Handuser-C */}
        {product.id === 'handuser-c' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.5 }}
            className="mt-8 rounded-3xl bg-gradient-to-br from-forest-950 via-forest-900 to-[#061224] p-6 sm:p-8 lg:p-9 text-white border border-forest-800/80 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-forest-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-10 w-64 h-64 bg-terracotta-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3 max-w-3xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
                Handuser-C: Northeast India's First <span className="text-terracotta-300 font-normal">Alcohol-Based Hand Rub</span>
              </h2>

              <p className="text-forest-100 text-xs sm:text-sm font-light leading-relaxed max-w-2xl">
                Formulated to international hospital-grade standards. Supplying key government medical colleges, the Indian Army, Indian Railways, and private healthcare institutions across Northeast India.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1 text-xs text-forest-200">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/80 border border-forest-700/70 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" /> Hospital-Grade ABHR
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/80 border border-forest-700/70 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" /> NABL Tested Formulation
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/80 border border-forest-700/70 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" /> Indian Army &amp; Railways Supply
                </span>
              </div>
            </div>

            <div className="relative z-10 shrink-0">
              <button
                onClick={() => onOpenEnquiry && onOpenEnquiry('Handuser-C Institutional Supply')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-forest-50 text-forest-950 font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Enquire Institutional Supply</span>
                <ArrowRight className="w-4 h-4 text-forest-900" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Official Product Feature Banner if available */}
        {product.banner && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "150px" }}
            transition={{ duration: 0.5 }}
            className="mt-8 rounded-3xl overflow-hidden border border-forest-100 shadow-card bg-white"
          >
            <img
              src={product.banner}
              alt={`${product.name} Official Product Banner`}
              className="w-full h-auto block"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                if (product.fallbackImage) e.currentTarget.src = product.fallbackImage;
              }}
            />
          </motion.div>
        )}

        {/* Related Formulations */}
        {relatedProducts.length > 0 && (
          <div className="mt-14 space-y-6">
            <div className="space-y-2">
              <div className="w-10 h-1 bg-terracotta-500 rounded-full" />
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">
                Related Formulations in this Category
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel, index) => (
                <motion.div
                  key={rel.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "150px" }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    to={`/product/${rel.slug}`}
                    className="group bg-white p-5 rounded-3xl border border-forest-100 shadow-card hover:shadow-card-hover transition-all flex items-center gap-4 h-full"
                  >
                    <div className="w-16 h-16 bg-[#EBF2EC] rounded-2xl flex items-center justify-center p-2 shrink-0">
                      <img 
                        src={rel.image} 
                        alt={rel.name} 
                        className="w-full h-full object-contain"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          if (rel.fallbackImage) e.currentTarget.src = rel.fallbackImage;
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-forest-900 group-hover:text-forest-700 transition-colors line-clamp-1">
                        {rel.name}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {rel.composition || rel.subtitle}
                      </p>
                      <span className="text-[11px] font-semibold text-terracotta-600 inline-block mt-1">
                        View Details &rarr;
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Commercial & Institutional Partnerships Banner (Image 2 Style) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "100px" }}
          transition={{ duration: 0.5 }}
          className="mt-12 sm:mt-14 mb-6 rounded-3xl bg-gradient-to-br from-forest-950 via-forest-900 to-[#061224] p-6 sm:p-8 lg:p-9 text-white border border-forest-800/80 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6"
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
              onClick={() => onOpenEnquiry && onOpenEnquiry(`Commercial Proposal for ${product.name}`)}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
            >
              <Send className="w-4 h-4" />
              <span>Request Commercial Proposal</span>
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
