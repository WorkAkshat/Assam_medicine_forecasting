import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  FlaskConical,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Trophy,
  Medal,
  Factory,
  Zap,
  Wheat,
  Stethoscope,
  Hotel,
  Check,
  Star,
  ExternalLink,
  MapPin,
  Clock,
  Send
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '@/components';

export default function About({ onOpenEnquiry }) {
  const [expandedAwards, setExpandedAwards] = useState({});
  const [showFullHeritage, setShowFullHeritage] = useState(false);

  const toggleAward = (index) => {
    setExpandedAwards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  // Dhanuka Group Diversified Verticals (Authentic from grdpharma.in)
  const groupVerticals = [
    {
      name: 'Pharmaceuticals',
      tagline: 'Formulation & Manufacturing',
      desc: 'cGMP & ISO 9001:2015 allopathic manufacturing, contract formulation & regional C&F services.',
      icon: FlaskConical,
      badge: 'Core Division'
    },
    {
      name: 'Cosmetics & Personal Care',
      tagline: 'Consumer Wellness',
      desc: 'High-efficacy skincare, liquid hygiene soaps, and infection-prevention products.',
      icon: Sparkles,
      badge: 'Consumer FMCG'
    },
    {
      name: 'Surgicals & Medical Supplies',
      tagline: 'Institutional Healthcare',
      desc: 'Hospital-grade surgical consumables, infection barrier products, and clinical supplies.',
      icon: Stethoscope,
      badge: 'Hospital Supplies'
    },
    {
      name: 'Power & Infrastructure',
      tagline: 'Energy & Regional Utility',
      desc: 'Strategic investments and participation in conventional and renewable power generation.',
      icon: Zap,
      badge: 'Infrastructure'
    },
    {
      name: 'Food Grains & Edible Oil',
      tagline: 'Agro Commodities & Milling',
      desc: 'Over a century of agricultural commodity trading, grain processing, and edible oil logistics.',
      icon: Wheat,
      badge: '100+ Yr Heritage'
    },
    {
      name: 'Hospitality (Hotel Millennium)',
      tagline: 'Guwahati Business Landmark',
      desc: 'Premier hospitality destination in the heart of Guwahati offering business banqueting & executive stays.',
      icon: Hotel,
      badge: 'Guwahati Landmark'
    }
  ];

  // Leadership Spotlight Award (Times Group)
  const leadershipAward = {
    year: '2020',
    awardName: 'TIMES STELLAR BRANDS AND ICONS (ASSAM AND NORTHEAST)',
    title: '“Visionary Leader in Assam and North East”',
    recipient: 'Mr. Ghanshyam Das Dhanuka',
    designation: 'Founding Partner, GRD Pharmaceuticals',
    conferredBy: 'The Times Group',
    summary: 'Conferred in recognition of transformative industrial leadership, advancing regional healthcare self-reliance, and setting pioneering pharmaceutical manufacturing benchmarks across Assam and the North-Eastern States of India.'
  };

  // Institutional & Multinational Healthcare Partner Awards (Authentic from grdpharma.in)
  const partnerAwards = [
    {
      year: '2018–19',
      awardName: 'BEST PERFORMANCE CERTIFICATE',
      title: 'Flawless Supply to 38 AMRIT Pharmacies',
      conferredBy: 'HLL LIFECARE LTD. (Govt. of India Enterprise)',
      summary: 'Awarded for exemplary timely supply of affordable life-saving medicines across all 38 AMRIT pharmacy stores situated in the North-Eastern States.',
      badge: 'Govt. Public Health'
    },
    {
      year: '2018 & 2019',
      awardName: 'BUSINESS EXCELLENCE AWARD',
      title: 'Consistent SAHYOG Award',
      conferredBy: "Dr. Reddy's Laboratories",
      summary: 'Presented in recognition of consistent collaboration, supply dependability, operational discipline, and shared healthcare excellence.',
      badge: 'Pharma Excellence'
    },
    {
      year: '2016 & 2018',
      awardName: 'EXCELLENCE & APPRECIATION',
      title: 'Institutional Healthcare Contribution',
      conferredBy: 'Abbott Healthcare (EPD Division)',
      summary: 'Honoured for outstanding supply chain fulfillment, hospital support, and dependable distribution for Abbott’s Established Pharmaceuticals Division.',
      badge: 'Hospital Supply'
    },
    {
      year: '2015',
      awardName: 'ROLL OF HONOUR',
      title: 'JJMI Channel Partner Forum',
      conferredBy: 'Johnson & Johnson',
      summary: 'Conferred at Guwahati honoring exceptional regional partnership, clinical stewardship, and institutional supply excellence.',
      badge: 'Channel Leadership'
    }
  ];

  // Concise Journey Milestones
  const milestones = [
    {
      year: '1920s',
      title: 'Centennial Group Heritage',
      desc: 'Dhanuka Group commences over a century of enterprise based out of Guwahati, growing to employ over 750 people.'
    },
    {
      year: '2006',
      title: 'GRD Pharmaceuticals Founded',
      desc: 'Allopathic manufacturing plant established at Rani, Kamrup for tablets, capsules, syrups, suspensions, and C&F.'
    },
    {
      year: '2012',
      title: 'Handuser-C: 1st in Northeast',
      desc: 'Pioneered Alcohol-Based Handrubs (ABHR) as the first regional manufacturer, setting hospital hygiene standards.'
    },
    {
      year: '2015–19',
      title: 'National & Govt. Honours',
      desc: 'Recognised by Govt. of India Enterprise HLL Lifecare (38 AMRIT stores), Dr. Reddy’s, Abbott, and Johnson & Johnson.'
    },
    {
      year: '2020+',
      title: 'Visionary Regional Leadership',
      desc: 'Mr. Ghanshyam Das Dhanuka honoured by The Times Group; facility dual-testing with ISO 9001:2015 & cGMP compliance.'
    }
  ];

  return (
    <div className="bg-cream-50 min-h-screen">
      <SEO
        title="About Us & Heritage | GRD Pharmaceuticals - Dhanuka Group Legacy"
        description="Learn about GRD Pharmaceuticals, established in 2006 under the century-old Dhanuka Group in Guwahati. Discover our cGMP manufacturing plant in Rani, Assam and dual-testing quality standards."
      />
      
      {/* 1. Hero Header Banner with Cinematic cGMP Cleanroom Background */}
      <section className="relative text-white py-12 sm:py-14 lg:py-16 overflow-hidden bg-forest-950 border-b border-forest-800/80">
        {/* Full-Width Background Image with Subtle Zoom Motion & High Visibility */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: `url('/images/hero-about-bg.webp')`,
              backgroundPosition: 'right 35%'
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
            className="max-w-3xl space-y-4"
          >
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-forest-200/80 font-medium">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-forest-400/60 shrink-0" />
              <span className="text-white font-medium">About Us</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              Dedicated to Improving Everyday Health &amp; Well-being
            </h1>

            <p className="text-forest-100 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
              Part of the century-old Dhanuka Group in Guwahati, GRD Pharmaceuticals combines cGMP formulation standards with trusted healthcare distribution, supplying state medical colleges, national agencies, and communities across Northeast India.
            </p>

            {/* Top Stat Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="px-3.5 py-2 rounded-2xl bg-forest-900/70 border border-forest-700/60">
                <span className="block text-base sm:text-lg font-serif font-bold text-white">100+ Yrs</span>
                <span className="text-[11px] text-forest-200">Group Legacy</span>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-forest-900/70 border border-forest-700/60">
                <span className="block text-base sm:text-lg font-serif font-bold text-terracotta-400">750+</span>
                <span className="text-[11px] text-forest-200">Workforce</span>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-forest-900/70 border border-forest-700/60">
                <span className="block text-base sm:text-lg font-serif font-bold text-white">cGMP Plant</span>
                <span className="text-[11px] text-forest-200">Rani, Assam</span>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-forest-900/70 border border-forest-700/60">
                <span className="block text-base sm:text-lg font-serif font-bold text-white">Pioneer 2012</span>
                <span className="text-[11px] text-forest-200">1st NE Handrub</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Act 1: Who We Are & Heritage */}
      <section className="section-spacing bg-white border-b border-forest-50">
        <div className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Narrative (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <div className="w-10 h-1 bg-terracotta-500 rounded-full" />
                <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 block">
                  Our Background &amp; Heritage
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-forest-900 leading-tight">
                  Over a Century of Trust, Industrial Heritage &amp; Community Care
                </h2>
              </div>

              <div className="space-y-3.5 text-gray-700 leading-relaxed text-sm sm:text-base font-light">
                <p>
                  <strong>GRD Pharmaceuticals</strong> is the core healthcare division of the <strong>Dhanuka Group</strong>, a trusted business house established in Guwahati for <strong>over 100 years</strong>, employing over <strong>750 people directly and indirectly</strong> across diverse industrial sectors.
                </p>
                <p>
                  Established in <strong>2006</strong>, we actively manufacture and market pharmaceutical <strong>tablets, capsules, syrups, and suspensions</strong>. In addition to our own formulations, our facility undertakes <strong>contract manufacturing</strong> and provides comprehensive <strong>C&amp;F (Carrying &amp; Forwarding) services</strong> across the North-Eastern States.
                </p>

                {/* Progressive Disclosure for Deep Heritage Chronicles */}
                {showFullHeritage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.25 }}
                    className="p-4 rounded-2xl bg-cream-100/60 border border-forest-100 text-xs sm:text-sm text-gray-600 space-y-2.5 font-light"
                  >
                    <p>
                      The Dhanuka Group's century-long industrial journey in Assam began with agro-commodity trade, milling, and distribution infrastructure. GRD Pharmaceuticals was founded in 2006 to establish high-standard indigenous allopathic manufacturing in Guwahati.
                    </p>
                    <p>
                      In 2012, GRD became the first indigenous pharmaceutical manufacturer in Northeast India to produce Alcohol-Based Handrubs (ABHR) under the brand <strong>Handuser-C®</strong>. Today, the facility operates with cGMP compliance, ISO 9001:2015 certified quality systems, and a strict dual-testing policy ensuring every production batch is validated at NABL accredited laboratories.
                    </p>
                  </motion.div>
                )}

                <div>
                  <button
                    type="button"
                    onClick={() => setShowFullHeritage(!showFullHeritage)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 transition-colors cursor-pointer pt-0.5"
                  >
                    <span>{showFullHeritage ? 'Show Less History' : 'Read Full Heritage Story'}</span>
                    {showFullHeritage ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-cream-50 border border-forest-100/80">
                  <span className="font-semibold text-forest-900 block mb-0.5">Established 2006</span>
                  <span className="text-gray-500 font-light">cGMP pharmaceutical formulation plant at Rani, Assam.</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-cream-50 border border-forest-100/80">
                  <span className="font-semibold text-forest-900 block mb-0.5">Dual-Testing Policy</span>
                  <span className="text-gray-500 font-light">Internal QC plus mandatory NABL laboratory release.</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-cream-50 border border-forest-100/80">
                  <span className="font-semibold text-forest-900 block mb-0.5">Institutional Reach</span>
                  <span className="text-gray-500 font-light">Approved supplier to Army, Railways &amp; Medical Colleges.</span>
                </div>
              </div>
            </div>

            {/* Right Photo & Quality Badge (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-3xl overflow-hidden shadow-card border border-forest-100 bg-forest-50">
                <img
                  src="/images/about-microscope.webp"
                  alt="Microscopic analytical testing at GRD Pharmaceuticals"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = '/images/about-microscope.png';
                  }}
                />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-forest-900/90 text-white text-xs font-semibold backdrop-blur-sm shadow-sm">
                  cGMP &amp; ISO 9001:2015
                </div>
              </div>

              {/* Quality & Dual-Testing Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-forest-900 text-white space-y-2.5 shadow-md border border-forest-800">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-terracotta-400 shrink-0" />
                  <h4 className="font-serif font-bold text-base text-white">Dual-Testing Quality Policy</h4>
                </div>
                <p className="text-xs text-forest-200/90 leading-relaxed font-light">
                  Besides in-house Quality Control testing, <strong>samples from each production batch are tested at NABL accredited laboratories</strong>. Our QMS is ISO 9001:2015 certified, and our plant operates under strict GMP standards.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-terracotta-300 font-medium">
                  <span className="px-2 py-0.5 rounded-md bg-forest-800 border border-forest-700">✓ In-House QC</span>
                  <span className="px-2 py-0.5 rounded-md bg-forest-800 border border-forest-700">✓ NABL Accredited</span>
                  <span className="px-2 py-0.5 rounded-md bg-forest-800 border border-forest-700">✓ GMP &amp; ISO</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Act 2: Manufacturing Capabilities & C&F Services */}
      <section className="section-spacing bg-cream-50/60 border-b border-forest-50">
        <div className="site-container">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="w-10 h-1 bg-terracotta-500 rounded-full mx-auto" />
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 block">
              Facility &amp; Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-forest-900">
              Manufacturing &amp; Logistics Capabilities
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm font-light">
              High-volume formulation and regional carrying &amp; forwarding from our Rani facility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center border border-forest-100">
                <Factory className="w-5 h-5 text-forest-900" />
              </div>
              <h3 className="font-serif font-bold text-lg text-forest-900">Tablets &amp; Capsules</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-light">
                Film-coated, uncoated, enteric-coated solid dosages, and sustained-release pellets in hard gelatin.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center border border-forest-100">
                <FlaskConical className="w-5 h-5 text-forest-900" />
              </div>
              <h3 className="font-serif font-bold text-lg text-forest-900">Syrups &amp; Suspensions</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-light">
                Palatable paediatric and adult cough syrups, haematinics, digestive enzymes, and antacids.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center border border-forest-100">
                <Award className="w-5 h-5 text-forest-900" />
              </div>
              <h3 className="font-serif font-bold text-lg text-forest-900">Contract Manufacturing</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-light">
                Custom commercial formulations, pilot batches, and third-party PCD production under strict cGMP.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center border border-forest-100">
                <Building2 className="w-5 h-5 text-forest-900" />
              </div>
              <h3 className="font-serif font-bold text-lg text-forest-900">C&amp;F Services</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-light">
                Carrying &amp; Forwarding network with temperature-controlled warehousing across all 8 Northeastern States.
              </p>
            </div>

          </div>

          {/* Plant Location Strip */}
          <div className="mt-6 p-4 rounded-2xl bg-white border border-forest-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-terracotta-600 shrink-0" />
              <span><strong>cGMP Production Unit:</strong> D-15, Rani Industrial Area, Rani, Kamrup, Assam (PIN - 781131)</span>
            </div>
            <Link to="/contact" className="text-forest-900 hover:text-terracotta-600 font-semibold inline-flex items-center gap-1">
              <span>View Plant Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. Act 3: Hygiene Pioneer Milestone (Concise Innovation Spotlight - No Image Duplication) */}
      <section className="section-spacing bg-white border-b border-forest-50">
        <div className="site-container">
          
          <div className="rounded-3xl bg-gradient-to-br from-forest-950 via-forest-900 to-[#061224] text-white p-6 sm:p-8 lg:p-9 shadow-xl border border-forest-800/80 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-forest-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-2.5 max-w-3xl">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight leading-tight">
                1st in Northeast India to Produce Alcohol-Based Handrubs
              </h3>

              <p className="text-forest-100 text-xs sm:text-sm font-light leading-relaxed max-w-2xl">
                In 2012, GRD Pharmaceuticals pioneered modern infection control in Northeast India by formulating hospital-grade Alcohol-Based Handrubs under the brand <strong>Handuser-C®</strong>. Approved supplier to State Health Missions, Government Medical Colleges, Indian Army, and Indian Railways.
              </p>

              {/* Institutional supply footprint */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs text-forest-200">
                <span className="px-3 py-1 rounded-full bg-forest-900/80 border border-forest-700/70 font-medium">
                  ✓ WHO-Standard Formula
                </span>
                <span className="px-3 py-1 rounded-full bg-forest-900/80 border border-forest-700/70 font-medium">
                  ✓ NABL Tested Batches
                </span>
                <span className="px-3 py-1 rounded-full bg-forest-900/80 border border-forest-700/70 font-medium">
                  ✓ Army &amp; Railways Supply
                </span>
              </div>
            </div>

            <div className="relative z-10 shrink-0">
              <Link
                to="/hygiene-products"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-white hover:bg-forest-50 text-forest-950 font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
              >
                <span>View Hygiene Formulations</span>
                <ArrowRight className="w-4 h-4 text-forest-900" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Act 4: Journey Timeline */}
      <section className="section-spacing bg-cream-50/50 border-b border-forest-50">
        <div className="site-container">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="w-10 h-1 bg-terracotta-500 rounded-full mx-auto" />
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 block">
              Key Milestones
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">
              Our Journey Through the Decades
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {milestones.map((m) => (
              <div 
                key={m.year}
                className="bg-white p-5 rounded-3xl border border-forest-100 shadow-card hover:shadow-card-hover transition-all space-y-2 group"
              >
                <span className="text-xl font-serif font-bold text-terracotta-600 block">
                  {m.year}
                </span>
                <h4 className="font-serif font-bold text-sm text-forest-900 group-hover:text-forest-700 transition-colors">
                  {m.title}
                </h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Act 5: Industry Recognitions & Institutional Accolades */}
      <section className="section-spacing bg-white border-b border-forest-50" id="awards">
        <div className="site-container">
          
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <div className="w-10 h-1 bg-terracotta-500 rounded-full mx-auto" />
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 block">
              Verified Industry Honours
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-forest-900">
              Awards &amp; Institutional Recognitions
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm font-light leading-relaxed">
              Honoured by state agencies, national institutions, and premier healthcare corporations for supply excellence and visionary leadership.
            </p>
          </div>

          {/* Grand Leadership Spotlight (Times Group) */}
          <div className="mb-7 p-6 sm:p-9 rounded-3xl bg-gradient-to-br from-forest-900 via-forest-950 to-[#061224] text-white border border-terracotta-400/40 shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
              <div className="lg:col-span-8 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-terracotta-500 text-white font-sans text-xs font-bold">
                    {leadershipAward.year}
                  </span>
                  <span className="px-3 py-0.5 rounded-full bg-forest-800 border border-forest-700 text-terracotta-300 text-xs font-semibold">
                    {leadershipAward.awardName}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-xl sm:text-2xl lg:text-3xl text-white">
                  {leadershipAward.title}
                </h3>

                <p className="text-forest-100 text-xs sm:text-sm leading-relaxed font-light">
                  {leadershipAward.summary}
                </p>

                <div className="flex items-center gap-2.5 pt-1 text-xs">
                  <Star className="w-4 h-4 fill-terracotta-400 text-terracotta-400 shrink-0" />
                  <span className="font-serif font-bold text-white">
                    Awarded to {leadershipAward.recipient} ({leadershipAward.designation})
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 p-5 rounded-2xl bg-forest-950/70 border border-forest-800 text-center space-y-1">
                <Trophy className="w-10 h-10 text-terracotta-400 mx-auto mb-1" />
                <span className="text-[11px] uppercase tracking-wider text-terracotta-300 block">Conferred By</span>
                <strong className="text-base font-serif font-bold text-white block">{leadershipAward.conferredBy}</strong>
                <span className="text-[11px] text-forest-300">Times Stellar Brands &amp; Icons</span>
              </div>
            </div>
          </div>

          {/* 4 Partner Accolades Grid with Progressive Disclosure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {partnerAwards.map((item, idx) => {
              const isExpanded = !!expandedAwards[idx];
              return (
                <div
                  key={item.title}
                  className="p-5 rounded-3xl bg-cream-50/70 border border-forest-100 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold font-sans px-2.5 py-0.5 rounded-full bg-forest-900 text-white">
                        {item.year}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-forest-800 border border-forest-100">
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-600 block line-clamp-1">
                        {item.awardName}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-forest-900 leading-snug group-hover:text-forest-700 transition-colors">
                        {item.title}
                      </h4>
                    </div>

                    {/* Progressive Disclosure: Collapsed / Expanded Citation */}
                    {isExpanded ? (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.25 }}
                        className="text-[11px] text-gray-600 leading-relaxed font-light"
                      >
                        {item.summary}
                      </motion.p>
                    ) : (
                      <p className="text-[11px] text-gray-600 leading-relaxed font-light line-clamp-2">
                        {item.summary}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleAward(idx)}
                      className="text-[11px] font-semibold text-terracotta-600 hover:text-terracotta-700 inline-flex items-center gap-1 transition-colors cursor-pointer pt-0.5"
                    >
                      <span>{isExpanded ? 'Hide Citation' : 'Read Citation'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-forest-100/70 text-[11px] text-forest-900 font-medium flex items-center justify-between">
                    <span className="truncate">By: {item.conferredBy}</span>
                    <Medal className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. Act 6: Dhanuka Group Diversified Footprint */}
      <section className="section-spacing bg-cream-50/60 border-b border-forest-50">
        <div className="site-container">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="w-10 h-1 bg-terracotta-500 rounded-full mx-auto" />
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 block">
              Centennial Group Footprint
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">
              Dhanuka Group Diversified Verticals
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm font-light">
              Over a century of diversified mercantile, manufacturing, and community leadership based out of Guwahati.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {groupVerticals.map((v) => {
              const IconComp = v.icon;
              return (
                <div
                  key={v.name}
                  className="p-5 sm:p-6 rounded-3xl bg-white border border-forest-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center border border-forest-100 group-hover:bg-forest-900 group-hover:text-white transition-colors">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cream-100 text-terracotta-600 border border-terracotta-200">
                        {v.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-base text-forest-900 group-hover:text-forest-700 transition-colors">
                        {v.name}
                      </h4>
                      <p className="text-xs font-semibold text-terracotta-600 mb-1">
                        {v.tagline}
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed font-light">
                        {v.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. Regional Logistics Footprint Strip (Concise, Non-Repeating) */}
      <section className="py-8 sm:py-10 bg-cream-50/70 border-b border-forest-50">
        <div className="site-container">
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-forest-100 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600 block">
                Regional Logistics Footprint
              </span>
              <h4 className="font-serif font-bold text-lg sm:text-xl text-forest-900">
                Direct Distribution Across all 8 Northeastern States
              </h4>
              <p className="text-xs text-gray-500 font-light">
                Supplying Assam, Meghalaya, Arunachal Pradesh, Nagaland, Manipur, Mizoram, Tripura &amp; Sikkim from our Guwahati Corporate HQ and Rani cGMP Facility.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs transition-all shadow-sm shrink-0 cursor-pointer"
            >
              <span>View Offices &amp; Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Final Action CTA (Matching Reference Image 2) */}
      <section className="py-10 sm:py-12 bg-white">
        <div className="site-container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="p-6 sm:p-8 lg:p-9 rounded-3xl bg-gradient-to-br from-forest-950 via-forest-900 to-[#061224] text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl border border-forest-800/80 relative overflow-hidden"
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

            <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => onOpenEnquiry && onOpenEnquiry('Commercial & Institutional Partnerships')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg cursor-pointer whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                <span>Request Commercial Proposal</span>
              </button>
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-full bg-white hover:bg-forest-50 text-forest-950 font-semibold text-xs sm:text-sm transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>Contact Corporate Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
