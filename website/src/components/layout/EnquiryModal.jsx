import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Send, 
  Building2, 
  Mail, 
  Phone, 
  User, 
  ChevronDown, 
  FileText,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { validateEmail, validatePhone, submitFormPayload } from '@/utils/security';

export default function EnquiryModal({ isOpen, onClose, initialProduct = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    inquiryType: 'Pharma Distribution & Trade',
    productOfInterest: initialProduct || '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (initialProduct) {
      setFormData((prev) => ({ ...prev, productOfInterest: initialProduct }));
    }
  }, [initialProduct]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFieldChange = (field, value) => {
    let sanitizedVal = value;

    if (field === 'name') {
      sanitizedVal = value.replace(/[^a-zA-Z\s'.-]/g, '').slice(0, 70);
    } else if (field === 'phone') {
      sanitizedVal = value.replace(/[^0-9+\s()-]/g, '').slice(0, 15);
    } else if (field === 'email') {
      sanitizedVal = value.trim().slice(0, 80);
    } else if (field === 'organization' || field === 'productOfInterest') {
      sanitizedVal = value.slice(0, 100);
    } else if (field === 'message') {
      sanitizedVal = value.slice(0, 1000);
    }

    setFormData(prev => ({ ...prev, [field]: sanitizedVal }));

    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s'.-]{2,70}$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Please enter at least 2 characters';
    } else if (!nameRegex.test(formData.name.trim())) {
      newErrors.name = 'Please enter letters only';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Official Email address is required';
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    const cleanDigits = formData.phone.replace(/[^0-9]/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (cleanDigits.length < 10) {
      newErrors.phone = 'Enter a valid 10-digit mobile number';
    } else if (cleanDigits.length > 15) {
      newErrors.phone = 'Phone number cannot exceed 15 digits';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Enter a valid contact number (10-15 digits)';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please specify requirements or batch size';
    } else if (formData.message.trim().length < 8) {
      newErrors.message = 'Please provide at least 8 characters describing your requirement';
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Requirement details cannot exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitFormPayload('/api/enquiry', formData);
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'Submission failed. Please check your connection or contact our corporate office.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      organization: '',
      inquiryType: 'Pharma Distribution & Trade',
      productOfInterest: '',
      message: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={resetAndClose}
        className="fixed inset-0 bg-forest-950/85 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 14 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[640px] bg-white rounded-3xl sm:rounded-4xl shadow-2xl border border-forest-100 overflow-hidden z-10 my-auto"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Top Header Banner with Deep Navy Glassmorphism & Subtle Pharma Watermark */}
        <div className="relative bg-gradient-to-br from-forest-950 via-forest-900 to-[#061224] text-white px-7 sm:px-9 pt-7 pb-6 overflow-hidden border-b border-forest-800/80">
          
          {/* Subtle Photographic Cleanroom / R&D Watermark */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-35">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('/images/hero-research-bg.webp')` }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 via-forest-950/80 to-forest-900/60 pointer-events-none" />

          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-48 h-48 bg-terracotta-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-[1.75rem] font-serif font-bold text-white tracking-tight leading-snug">
                Commercial &amp; Trade Enquiry
              </h2>
              <p className="text-xs sm:text-sm text-forest-200/90 leading-relaxed max-w-md font-light">
                Connect directly with our Guwahati headquarters &amp; Rani formulation plant for institutional tenders, distribution, and manufacturing.
              </p>
            </div>

            <button
              onClick={resetAndClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all shrink-0 border border-white/10 focus:outline-none cursor-pointer"
              aria-label="Close enquiry modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 max-h-[calc(88vh-130px)] overflow-y-auto">
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center space-y-5"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border-2 border-blue-200 shadow-sm">
                <CheckCircle2 className="w-9 h-9 text-blue-600" />
              </div>
              
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-serif font-bold text-forest-900">
                  Enquiry Transmitted Successfully
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                  Thank you for connecting with <strong className="text-forest-900 font-semibold">GRD Pharmaceuticals</strong>. Our commercial team will review your specifications and contact you within 24 business hours.
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-forest-900 hover:bg-forest-800 text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
                >
                  Return to Website
                </button>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-forest-50 hover:bg-forest-100 text-forest-900 font-semibold text-sm transition-all border border-forest-100 cursor-pointer"
                >
                  Submit Another Query
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                
                {/* Full Name */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-forest-900">
                      Your Full Name <span className="text-terracotta-500">*</span>
                    </label>
                    <span className="text-[10px] text-gray-400">Max 70</span>
                  </div>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      maxLength={70}
                      value={formData.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      placeholder="e.g. Dr. Rajesh Baruah"
                      className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl bg-[#F4F6F9] border ${
                        errors.name ? 'border-red-500 bg-red-50/20' : 'border-gray-200 focus:border-forest-700'
                      } focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-700/10 transition-all text-forest-900 placeholder:text-gray-400`}
                    />
                  </div>
                  {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-forest-900">
                      Email Address <span className="text-terracotta-500">*</span>
                    </label>
                    <span className="text-[10px] text-gray-400">Max 80</span>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      maxLength={80}
                      value={formData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      placeholder="e.g. rajesh@healthcare.in"
                      className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl bg-[#F4F6F9] border ${
                        errors.email ? 'border-red-500 bg-red-50/20' : 'border-gray-200 focus:border-forest-700'
                      } focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-700/10 transition-all text-forest-900 placeholder:text-gray-400`}
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                </div>

              </div>

              {/* Row 2: Phone & Hospital / Entity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                
                {/* Phone */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-forest-900">
                      Phone / Mobile Number <span className="text-terracotta-500">*</span>
                    </label>
                    <span className="text-[10px] text-gray-400">10-15 digits</span>
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      maxLength={15}
                      value={formData.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl bg-[#F4F6F9] border ${
                        errors.phone ? 'border-red-500 bg-red-50/20' : 'border-gray-200 focus:border-forest-700'
                      } focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-700/10 transition-all text-forest-900 placeholder:text-gray-400`}
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                </div>

                {/* Organization / Entity */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-forest-900">
                      Hospital / Pharmacy / Entity
                    </label>
                    <span className="text-[10px] text-gray-400">Max 100</span>
                  </div>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      maxLength={100}
                      value={formData.organization}
                      onChange={(e) => handleFieldChange('organization', e.target.value)}
                      placeholder="e.g. Apex Hospital or Agency"
                      className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl bg-[#F4F6F9] border border-gray-200 focus:border-forest-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-700/10 transition-all text-forest-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

              </div>

              {/* Row 3: Inquiry Nature & Product of Interest */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                
                {/* Inquiry Nature Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1.5">
                    Inquiry Nature
                  </label>
                  <div className="relative">
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full pl-3.5 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl bg-[#F4F6F9] border border-gray-200 focus:border-forest-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-700/10 transition-all text-forest-900 appearance-none cursor-pointer"
                    >
                      <option value="Pharma Distribution & Trade">Pharma Distribution &amp; Trade</option>
                      <option value="Hospital & Institutional Supply">Hospital &amp; Institutional Supply</option>
                      <option value="Third-Party Contract Manufacturing">Third-Party Contract Manufacturing</option>
                      <option value="Hygiene Bulk Orders">Hygiene &amp; Sanitization Bulk Order</option>
                      <option value="Govt & Defence Supplies">Govt / Defence / Railways Tender</option>
                      <option value="General Commercial Query">General Commercial Query</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Product / Formulation of Interest */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-forest-900">
                      Product / Formulation of Interest
                    </label>
                    <span className="text-[10px] text-gray-400">Max 100</span>
                  </div>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      maxLength={100}
                      value={formData.productOfInterest}
                      onChange={(e) => handleFieldChange('productOfInterest', e.target.value)}
                      placeholder="e.g. Handuser-C, Tablets, Syrups"
                      className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl bg-[#F4F6F9] border border-gray-200 focus:border-forest-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-700/10 transition-all text-forest-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

              </div>

              {/* Message / Specifications */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-forest-900">
                    Enquiry Details &amp; Volume Requirements <span className="text-terracotta-500">*</span>
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
                  placeholder="Specify target batch volume, desired pack size, delivery timeline, or dosage specifications..."
                  className={`w-full p-3.5 text-xs sm:text-sm rounded-xl bg-[#F4F6F9] border ${
                    errors.message ? 'border-red-500 bg-red-50/20' : 'border-gray-200 focus:border-forest-700'
                  } focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-700/10 transition-all text-forest-900 placeholder:text-gray-400 resize-none`}
                />
                {errors.message && <p className="text-[11px] text-red-500 mt-1">{errors.message}</p>}
              </div>

              {submitError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {submitError}
                </div>
              )}

              {/* Form Action Bar & Trust Strip */}
              <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3.5">
                
                {/* Trust guarantee pill */}
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 order-2 sm:order-1">
                  <Lock className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
                  <span>Strict Commercial Confidentiality Guaranteed</span>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end order-1 sm:order-2">
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-gray-600 hover:text-forest-900 hover:bg-forest-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-7 py-2.5 sm:py-3 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-70 whitespace-nowrap cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Submitting Enquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Commercial Enquiry</span>
                      </>
                    )}
                  </motion.button>
                </div>

              </div>

            </form>
          )}
        </div>

      </motion.div>

    </div>
  );
}
