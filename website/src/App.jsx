import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Header, Footer, EnquiryModal, PortalLoginModal, ScrollToTop } from '@/components';

// Route Pages
import Home from '@/pages/Home';
const About = lazy(() => import('@/pages/About'));
const PharmaceuticalProducts = lazy(() => import('@/pages/PharmaceuticalProducts'));
const HygieneProducts = lazy(() => import('@/pages/HygieneProducts'));
const ProductDetails = lazy(() => import('@/pages/ProductDetails'));
const Contact = lazy(() => import('@/pages/Contact'));

function AnimatedRoutes({ onOpenEnquiry, onOpenPortal }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="w-full"
      >
        <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home onOpenEnquiry={onOpenEnquiry} onOpenPortal={onOpenPortal} />} />
          <Route path="/about" element={<About onOpenEnquiry={onOpenEnquiry} />} />
          <Route 
            path="/pharmaceutical-products" 
            element={<PharmaceuticalProducts onOpenEnquiry={onOpenEnquiry} />} 
          />
          <Route 
            path="/hygiene-products" 
            element={<HygieneProducts onOpenEnquiry={onOpenEnquiry} />} 
          />
          <Route 
            path="/product/:slug" 
            element={<ProductDetails onOpenEnquiry={onOpenEnquiry} />} 
          />
          <Route path="/contact" element={<Contact />} />
          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryInitialProduct, setEnquiryInitialProduct] = useState('');
  const [isPortalLoginOpen, setIsPortalLoginOpen] = useState(false);

  const handleOpenEnquiry = (productName = '') => {
    setEnquiryInitialProduct(productName || '');
    setIsEnquiryOpen(true);
  };

  const handleCloseEnquiry = () => {
    setIsEnquiryOpen(false);
    setEnquiryInitialProduct('');
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-cream-50 font-sans text-forest-950">
        
        {/* Navigation Header */}
        <Header 
          onOpenEnquiry={() => handleOpenEnquiry()} 
          onOpenPortalLogin={() => setIsPortalLoginOpen(true)}
        />

        {/* Dynamic Route Pages with Smooth Page Transitions */}
        <main className="flex-grow">
          <AnimatedRoutes onOpenEnquiry={handleOpenEnquiry} onOpenPortal={() => setIsPortalLoginOpen(true)} />
        </main>

        {/* Global Footer */}
        <Footer 
          onOpenEnquiry={handleOpenEnquiry} 
          onOpenPortalLogin={() => setIsPortalLoginOpen(true)}
        />

        {/* Global Enquiry Modal */}
        <EnquiryModal
          isOpen={isEnquiryOpen}
          onClose={handleCloseEnquiry}
          initialProduct={enquiryInitialProduct}
        />

        {/* PharmaPredict AI Portal Login Modal */}
        <PortalLoginModal
          isOpen={isPortalLoginOpen}
          onClose={() => setIsPortalLoginOpen(false)}
        />

      </div>
    </Router>
  );
}
