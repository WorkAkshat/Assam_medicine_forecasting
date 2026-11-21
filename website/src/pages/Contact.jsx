import React, { useState } from 'react';
import { 
  MapPin, 
  Building2, 
  Building,
  Factory,
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Check,
  Navigation,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEO } from '@/components';
import { validateEmail, validatePhone, submitFormPayload } from '@/utils/security';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    inquiryType: 'Hospital & Institutional Supply',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Progressive Disclosure: "View Details" state per office card
  const [expandedOffice, setExpandedOffice] = useState({});

  // Active Map Location Tab
  const [activeMapTab, setActiveMapTab] = useState('head-office');

  const handleFieldChange = (field, value) => {
    let sanitizedVal = value;

    if (field === 'firstName' || field === 'lastName') {
      // Allow only letters, spaces, hyphens, and apostrophes up to 50 chars
      sanitizedVal = value.replace(/[^a-zA-Z\s'-]/g, '').slice(0, 50);
    } else if (field === 'phone') {
      // Allow only numbers, +, spaces, hyphens, and parentheses up to 15 chars
      sanitizedVal = value.replace(/[^0-9+\s()-]/g, '').slice(0, 15);
    } else if (field === 'email') {
      sanitizedVal = value.trim().slice(0, 80);
    } else if (field === 'organization') {
      sanitizedVal = value.slice(0, 100);
    } else if (field === 'message') {
      sanitizedVal = value.slice(0, 1000);
    }

    setFormData(prev => ({ ...prev, [field]: sanitizedVal }));

    // Real-time error clearing as user types
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleOfficeDetails = (id) => {
    setExpandedOffice(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const inquiryOptions = [
    'Hospital & Institutional Supply',
    'Contract Manufacturing & PCD',
    'C&F Regional Distribution',
    'Government Tenders',
    'General Trade Enquiry'
  ];

  const validate = () => {
    const errs = {};
    const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;

    // First Name
    const trimmedFirst = formData.firstName.trim();
    if (!trimmedFirst) {
      errs.firstName = 'First name is required';
    } else if (trimmedFirst.length < 2) {
      errs.firstName = 'First name must be at least 2 characters';
    } else if (!nameRegex.test(trimmedFirst)) {
      errs.firstName = 'Only letters and spaces are allowed';
    }

    // Last Name
    const trimmedLast = formData.lastName.trim();
    if (!trimmedLast) {
      errs.lastName = 'Last name is required';
    } else if (trimmedLast.length < 2) {
      errs.lastName = 'Last name must be at least 2 characters';
    } else if (!nameRegex.test(trimmedLast)) {
      errs.lastName = 'Only letters and spaces are allowed';
    }

    // Email
    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      errs.email = 'Email address is required';
    } else if (!validateEmail(trimmedEmail)) {
      errs.email = 'Enter a valid email address (e.g. name@company.com)';
    }

    // Phone
    const cleanDigits = formData.phone.replace(/[^0-9]/g, '');
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (cleanDigits.length < 10) {
      errs.phone = 'Enter a valid 10-digit mobile number';
    } else if (cleanDigits.length > 15) {
      errs.phone = 'Phone number cannot exceed 15 digits';
    } else if (!validatePhone(formData.phone)) {
      errs.phone = 'Enter a valid contact number';
    }

    // Message
    const trimmedMessage = formData.message.trim();
    if (!trimmedMessage) {
      errs.message = 'Please enter your message or requirement details';
    } else if (trimmedMessage.length < 10) {
      errs.message = 'Please provide at least 10 characters describing your requirement';
    } else if (formData.message.length > 1000) {
      errs.message = 'Message cannot exceed 1000 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitFormPayload('/api/contact', formData);
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'Submission failed. Please call our direct line.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3 Verified Official Addresses from grdpharma.in
  const officeLocations = [
    {
      id: 'head-office',
      officeName: 'Head Office — Guwahati',
      shortName: 'Head Office (Guwahati)',
      subtitle: 'Corporate Headquarters',
      tag: 'Guwahati, Assam',
      isPrimary: true,
      addressLines: [
        'Dhanuka Complex, Block - B,',
        'Sati Joymati Road, Athgaon,',
        'Guwahati, Kamrup (M), Assam, PIN - 781001'
      ],
      phones: [
        { label: 'Mobile', numbers: ['+91 97060 01000', '+91 70990 71000'] },
        { label: 'Landline', numbers: ['0361-24739241'] }
      ],
      email: 'contact@grdpharma.in',
      hours: 'Mon – Sat: 9:30 AM – 6:30 PM',
      icon: Building2,
      mapUrl: 'https://maps.google.com/?q=Dhanuka+Complex+Block+B+Sati+Joymati+Road+Athgaon+Guwahati+Assam+781001',
      osmEmbedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=91.6900%2C26.1550%2C91.7900%2C26.1950&layer=mapnik&marker=26.1770%2C91.7410',
      details: {
        role: 'Central corporate operations, commercial trade, PCD partnerships, and institutional supply across Northeast India.',
        landmark: 'Dhanuka Complex Block-B, near Athgaon Flyover'
      }
    },
    {
      id: 'factory',
      officeName: 'Factory & Manufacturing Plant',
      shortName: 'Factory (Rani Plant)',
      subtitle: 'cGMP Formulation Plant',
      tag: 'Rani, Kamrup (Assam)',
      isPrimary: false,
      addressLines: [
        'GRD Pharmaceuticals,',
        'D-15, Rani Industrial Area, Rani,',
        'Kamrup, Assam, PIN - 781131'
      ],
      phones: [
        { label: 'Plant Mobile', numbers: ['+91 94357 32217', '+91 94354 01000'] }
      ],
      email: 'factory@grdpharma.in',
      hours: 'Mon – Sat: 8:30 AM – 5:30 PM',
      icon: Factory,
      mapUrl: 'https://maps.google.com/?q=GRD+Pharmaceuticals+Rani+Industrial+Area+Kamrup+Assam+781131',
      osmEmbedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=91.5500%2C26.0400%2C91.6700%2C26.0900&layer=mapnik&marker=26.0655%2C91.6110',
      details: {
        role: 'cGMP manufacturing of tablets, capsules, syrups, suspensions, and Handuser-C® antiseptic handrubs.',
        landmark: 'D-15 Rani Industrial Estate, 15 km from Guwahati Airport'
      }
    },
    {
      id: 'branch-office',
      officeName: 'Branch Office — New Delhi',
      shortName: 'Branch Office (New Delhi)',
      subtitle: 'Regional Office',
      tag: 'New Delhi',
      isPrimary: false,
      addressLines: [
        'R-193, Greater Kailash Part 1,',
        'New Delhi, PIN - 110048'
      ],
      phones: [
        { label: 'Mobile', numbers: ['+91 70990 01000', '+91 98641 01000'] }
      ],
      email: 'info@grdpharma.in',
      hours: 'Mon – Sat: 10:00 AM – 6:00 PM',
      icon: Building,
      mapUrl: 'https://maps.google.com/?q=R-193+Greater+Kailash+Part+1+New+Delhi+110048',
      osmEmbedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=77.1850%2C28.5350%2C77.2850%2C28.5700&layer=mapnik&marker=28.5528%2C77.2372',
      details: {
        role: 'Northern region partner coordination, central ministry liaison, and national institutional supply alignment.',
        landmark: 'Near M-Block Market, Greater Kailash 1'
      }
    }
  ];

  const currentOfficeForMap = officeLocations.find(loc => loc.id === activeMapTab) || officeLocations[0];

  return (
    <div className="bg-cream-50 min-h-screen">
      <SEO
        title="Contact Us | Guwahati HQ, Delhi Branch & Rani Plant | GRD Pharmaceuticals"
        description="Contact GRD Pharmaceuticals corporate headquarters in Guwahati, New Delhi office, or our cGMP formulation plant in Rani, Assam for trade and institutional enquiries."
      />
      
      {/* 1. Concise Hero Section with Corporate Headquarters & Logistics Background */}
      <section className="relative text-white py-10 sm:py-12 overflow-hidden bg-forest-950 border-b border-forest-800/80">
        {/* Full-Width Background Image with Subtle Zoom Motion & High Visibility */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: `url('/images/hero-contact-bg.webp')`,
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
            transition={{ duration: 0.4 }}
            className="max-w-2xl space-y-2.5"
          >
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-forest-200/80 font-medium">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-forest-400/60 shrink-0" />
              <span className="text-white font-medium">Contact Us</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              Contact Us
            </h1>

            {/* Quick Contact Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-forest-200">
              <a 
                href="tel:9706001000"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/80 hover:bg-forest-800 text-white border border-forest-700/60 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-terracotta-400" />
                <span>+91 97060 01000</span>
              </a>
              <a 
                href="mailto:contact@grdpharma.in"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/80 hover:bg-forest-800 text-white border border-forest-700/60 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-terracotta-400" />
                <span>contact@grdpharma.in</span>
              </a>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/60 text-forest-300 border border-forest-700/40">
                <Check className="w-3.5 h-3.5 text-sky-400" /> Response &lt; 24 Hrs
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Main Contact Form & Presence Cards */}
      <section className="py-10 sm:py-12">
        <div className="site-container">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* LEFT COLUMN: Clean Enquiry Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-card">
                
                <div className="mb-5 space-y-1 pb-3.5 border-b border-forest-50">
                  <div className="w-8 h-1 bg-terracotta-500 rounded-full mb-1.5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600 block">
                    Direct Enquiry
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">
                    Send Us a Message
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-sm font-light">
                    We will review your requirement and respond within 24 hours.
                  </p>
                </div>

                {isSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-10 text-center space-y-3"
                  >
                    <div className="w-12 h-12 bg-forest-50 text-forest-700 rounded-2xl flex items-center justify-center mx-auto border border-forest-200">
                      <CheckCircle2 className="w-7 h-7 text-forest-700" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-forest-900">
                      Enquiry Received
                    </h3>
                    <p className="text-gray-600 max-w-sm mx-auto text-xs sm:text-sm font-light">
                      Thank you. Our commercial team has received your message and will reach out shortly.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({
                            firstName: '',
                            lastName: '',
                            email: '',
                            phone: '',
                            organization: '',
                            inquiryType: 'Hospital & Institutional Supply',
                            message: '',
                          });
                        }}
                        className="px-5 py-2 rounded-full bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition-colors cursor-pointer"
                      >
                        Send Another Message
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Enquiry Type Selector */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-forest-900 mb-2">
                        Requirement Type <span className="text-terracotta-600">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5">
                        {inquiryOptions.map((opt) => {
                          const isActive = formData.inquiryType === opt;
                          return (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => setFormData({ ...formData, inquiryType: opt })}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-center transition-all border cursor-pointer ${
                                isActive
                                  ? 'bg-forest-900 text-white border-forest-900 shadow-xs'
                                  : 'bg-[#F9FAF9] text-gray-700 border-gray-200 hover:border-forest-300 hover:bg-white'
                              } ${opt === inquiryOptions[inquiryOptions.length - 1] ? 'col-span-2 sm:col-span-1' : ''}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Row 1: Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-medium text-gray-700">
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <span className="text-[10px] text-gray-400">Max 50</span>
                        </div>
                        <input
                          type="text"
                          maxLength={50}
                          value={formData.firstName}
                          onChange={(e) => handleFieldChange('firstName', e.target.value)}
                          placeholder="e.g. Rahul"
                          className={`w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F9FAF9] border ${
                            errors.firstName ? 'border-red-500 bg-red-50/20' : 'border-gray-200 focus:border-forest-700 focus:bg-white'
                          } focus:outline-none focus:ring-2 focus:ring-forest-700/10 transition-all`}
                        />
                        {errors.firstName && <p className="text-[11px] text-red-500 mt-1 pl-1 font-medium">{errors.firstName}</p>}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-medium text-gray-700">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <span className="text-[10px] text-gray-400">Max 50</span>
                        </div>
                        <input
                          type="text"
                          maxLength={50}
                          value={formData.lastName}
                          onChange={(e) => handleFieldChange('lastName', e.target.value)}
                          placeholder="e.g. Sharma"
                          className={`w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F9FAF9] border ${
                            errors.lastName ? 'border-red-500 bg-red-50/20' : 'border-gray-200 focus:border-forest-700 focus:bg-white'
                          } focus:outline-none focus:ring-2 focus:ring-forest-700/10 transition-all`}
                        />
                        {errors.lastName && <p className="text-[11px] text-red-500 mt-1 pl-1 font-medium">{errors.lastName}</p>}
                      </div>
                    </div>

                    {/* Row 2: Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-medium text-gray-700">
                            Email ID <span className="text-red-500">*</span>
                          </label>
                          <span className="text-[10px] text-gray-400">Max 80</span>
                        </div>
                        <input
                          type="email"
                          maxLength={80}
                          value={formData.email}
                          onChange={(e) => handleFieldChange('email', e.target.value)}
                          placeholder="name@company.com"
                          className={`w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F9FAF9] border ${
                            errors.email ? 'border-red-500 bg-red-50/20' : 'border-gray-200 focus:border-forest-700 focus:bg-white'
                          } focus:outline-none focus:ring-2 focus:ring-forest-700/10 transition-all`}
                        />
                        {errors.email && <p className="text-[11px] text-red-500 mt-1 pl-1 font-medium">{errors.email}</p>}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-medium text-gray-700">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <span className="text-[10px] text-gray-400">10-15 digits</span>
                        </div>
                        <input
                          type="tel"
                          maxLength={15}
                          value={formData.phone}
                          onChange={(e) => handleFieldChange('phone', e.target.value)}
                          placeholder="+91 97060 01000"
                          className={`w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F9FAF9] border ${
                            errors.phone ? 'border-red-500 bg-red-50/20' : 'border-gray-200 focus:border-forest-700 focus:bg-white'
                          } focus:outline-none focus:ring-2 focus:ring-forest-700/10 transition-all`}
                        />
                        {errors.phone && <p className="text-[11px] text-red-500 mt-1 pl-1 font-medium">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Row 3: Organization (Optional) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-gray-700">
                          Hospital / Company Name <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <span className="text-[10px] text-gray-400">Max 100</span>
                      </div>
                      <input
                        type="text"
                        maxLength={100}
                        value={formData.organization}
                        onChange={(e) => handleFieldChange('organization', e.target.value)}
                        placeholder="e.g. Guwahati Healthcare Trust"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F9FAF9] border border-gray-200 focus:border-forest-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-700/10 transition-all"
                      />
                    </div>

                    {/* Row 4: Message */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-gray-700">
                          Message &amp; Requirement <span className="text-red-500">*</span>
                        </label>
                        <span className={`text-[11px] font-sans ${
                          formData.message.length >= 950 ? 'text-red-500 font-bold' : formData.message.length >= 800 ? 'text-amber-600' : 'text-gray-400'
                        }`}>
                          {formData.message.length} / 1000
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        maxLength={1000}
                        value={formData.message}
                        onChange={(e) => handleFieldChange('message', e.target.value)}
                        placeholder="Mention products, dosage forms, or inquiry details..."
                        className={`w-full p-3 text-sm rounded-xl bg-[#F9FAF9] border ${
                          errors.message ? 'border-red-500 bg-red-50/20' : 'border-gray-200 focus:border-forest-700 focus:bg-white'
                        } focus:outline-none focus:ring-2 focus:ring-forest-700/10 transition-all resize-y`}
                      />
                      {errors.message && <p className="text-[11px] text-red-500 mt-1 pl-1 font-medium">{errors.message}</p>}
                    </div>

                    {submitError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                        {submitError}
                      </div>
                    )}

                    {/* Submit Bar */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm disabled:opacity-60 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <span>Sending...</span>
                        ) : (
                          <>
                            <span>Send Enquiry</span>
                            <Send className="w-3.5 h-3.5 text-terracotta-400" />
                          </>
                        )}
                      </button>

                      <span className="text-[11px] text-gray-500 flex items-center gap-1.5 font-light">
                        <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0" />
                        100% Confidential
                      </span>
                    </div>

                  </form>
                )}

              </div>
            </div>

            {/* RIGHT COLUMN: Official Locations (5 cols) */}
            <div className="lg:col-span-5 space-y-3.5">
              
              <div className="space-y-0.5 pb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600 block">
                  Our Locations
                </span>
                <h3 className="font-serif font-bold text-2xl text-forest-900">
                  Offices &amp; Plant
                </h3>
                <p className="text-xs text-gray-500 font-light">
                  Guwahati Corporate HQ, New Delhi Desk, and Rani Plant.
                </p>
              </div>

              {/* 3 Location Cards */}
              <div className="space-y-2.5">
                {officeLocations.map((loc) => {
                  const IconComp = loc.icon;
                  const isExpanded = !!expandedOffice[loc.id];

                  return (
                    <div
                      key={loc.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all bg-white shadow-card hover:shadow-card-hover ${
                        loc.isPrimary ? 'border-forest-200 ring-1 ring-forest-900/5' : 'border-forest-100'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2.5 pb-2 border-b border-forest-50">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            loc.isPrimary
                              ? 'bg-forest-900 text-white shadow-xs'
                              : 'bg-forest-50 text-forest-800 border border-forest-100'
                          }`}>
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-sans font-bold text-sm text-forest-900 leading-tight">
                              {loc.officeName}
                            </h4>
                            <p className="text-[11px] text-gray-500 font-light">
                              {loc.subtitle}
                            </p>
                          </div>
                        </div>

                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                          loc.isPrimary
                            ? 'bg-forest-50 text-forest-900 border border-forest-200'
                            : 'bg-cream-100 text-gray-700 border border-gray-200'
                        }`}>
                          {loc.tag}
                        </span>
                      </div>

                      {/* Address */}
                      <div className="text-xs text-gray-600 leading-relaxed font-light pt-2 space-y-0.5">
                        {loc.addressLines.map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))}
                      </div>

                      {/* Phone */}
                      <div className="mt-2 pt-2 border-t border-forest-50 space-y-1">
                        {loc.phones.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-700">
                            <Phone className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
                            <span className="text-gray-500 text-[11px]">{p.label}:</span>
                            <div className="flex items-center gap-1.5 font-medium">
                              {p.numbers.map((num, nIdx) => (
                                <a
                                  key={nIdx}
                                  href={`tel:${num.replace(/[^0-9]/g, '')}`}
                                  className="text-forest-900 hover:text-terracotta-600 hover:underline transition-colors"
                                >
                                  {num}{nIdx < p.numbers.length - 1 ? ',' : ''}
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Expandable Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 pt-2 border-t border-forest-100 text-xs text-gray-600 space-y-1 font-light overflow-hidden bg-cream-50 -mx-4 sm:-mx-5 px-4 sm:px-5 py-2 -mb-2 rounded-b-2xl"
                          >
                            <p><strong className="text-forest-900 font-medium">Focus:</strong> {loc.details.role}</p>
                            <p><strong className="text-forest-900 font-medium">Landmark:</strong> {loc.details.landmark}</p>
                            <p className="text-[11px] text-gray-500 flex items-center gap-1 pt-0.5">
                              <Clock className="w-3 h-3 text-forest-700" />
                              <span>{loc.hours}</span>
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Actions */}
                      <div className="mt-2.5 pt-2 border-t border-forest-50 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => toggleOfficeDetails(loc.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-terracotta-600 hover:text-terracotta-700 cursor-pointer"
                        >
                          <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMapTab(loc.id);
                              const mapEl = document.getElementById('map-network-section');
                              if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-forest-800 hover:text-forest-900 hover:underline cursor-pointer"
                          >
                            <MapPin className="w-3 h-3 text-forest-700" />
                            <span>Map</span>
                          </button>

                          <a
                            href={loc.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-terracotta-600 hover:text-terracotta-700"
                          >
                            <span>Directions</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Direct Email Box */}
              <div className="p-3.5 rounded-2xl bg-forest-900 text-white space-y-1.5 shadow-sm text-xs">
                <div className="flex items-center justify-between border-b border-forest-800 pb-1.5">
                  <div className="flex items-center gap-2 font-semibold">
                    <Mail className="w-4 h-4 text-terracotta-400" />
                    <span>Direct Emails</span>
                  </div>
                  <span className="text-[11px] text-forest-200 font-light">Mon – Sat</span>
                </div>
                <div className="space-y-0.5 text-forest-100 font-light">
                  <p>
                    Commercial Enquiries:{' '}
                    <a href="mailto:contact@grdpharma.in" className="font-medium text-terracotta-300 hover:underline">
                      contact@grdpharma.in
                    </a>
                  </p>
                  <p>
                    Corporate &amp; Plant Desk:{' '}
                    <a href="mailto:info@grdpharma.in" className="font-medium text-terracotta-300 hover:underline">
                      info@grdpharma.in
                    </a>
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 3. Concise, Simple & Accurate Location Map Section */}
      <section id="map-network-section" className="pb-14 pt-2">
        <div className="site-container">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-forest-100 shadow-card space-y-4">
            
            {/* Clean Header with Single 3-Tab Facility Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-forest-50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-forest-50 text-terracotta-600 flex items-center justify-center border border-forest-100">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-forest-900 leading-tight">
                      Location Map
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-light pl-10">
                  Select a facility to view its exact map location &amp; get direct navigation
                </p>
              </div>

              {/* Single Clear 3-Tab Switcher */}
              <div className="inline-flex p-1 bg-cream-100/90 rounded-xl border border-forest-100 max-w-full overflow-x-auto">
                {officeLocations.map((loc) => {
                  const isActive = activeMapTab === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setActiveMapTab(loc.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-forest-900 text-white shadow-xs font-semibold'
                          : 'text-gray-600 hover:text-forest-900 hover:bg-white/60'
                      }`}
                    >
                      {loc.shortName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Facility Information Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-cream-50 border border-forest-100 text-xs">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-forest-900 text-sm">{currentOfficeForMap.officeName}</span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-forest-100 text-forest-900 border border-forest-200">
                    {currentOfficeForMap.tag}
                  </span>
                </div>
                <p className="text-gray-600 font-light">
                  {currentOfficeForMap.addressLines.join(' ')}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-500 text-[11px] pt-0.5">
                  <span>Landmark: <strong className="text-gray-700 font-normal">{currentOfficeForMap.details.landmark}</strong></span>
                  <span>Direct Desk: <strong className="text-gray-700 font-normal">{currentOfficeForMap.phones[0].numbers[0]}</strong></span>
                </div>
              </div>

              <a
                href={currentOfficeForMap.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold text-xs inline-flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions on Google Maps</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            </div>

            {/* Interactive Embedded Map Container */}
            <div className="relative rounded-2xl overflow-hidden border border-forest-200/80 shadow-inner bg-cream-100 h-[340px] sm:h-[400px]">
              <iframe
                title={`Interactive Map - ${currentOfficeForMap.officeName}`}
                src={currentOfficeForMap.osmEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />

              {/* Floating Google Maps pill on bottom-right of map */}
              <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
                <a
                  href={currentOfficeForMap.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-forest-900/95 hover:bg-forest-900 text-white text-[11px] font-medium shadow-md backdrop-blur-sm border border-forest-700/60 inline-flex items-center gap-1.5 transition-all"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-terracotta-400" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
