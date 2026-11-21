import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Header, Footer, EnquiryModal, PortalLoginModal, ScrollToTop } from '@/components';

// Route Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import PharmaceuticalProducts from '@/pages/PharmaceuticalProducts';
import HygieneProducts from '@/pages/HygieneProducts';
import ProductDetails from '@/pages/ProductDetails';
import Contact from '@/pages/Contact';

function AnimatedRoutes({ onOpenEnquiry }) {
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
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home onOpenEnquiry={onOpenEnquiry} />} />
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
          <AnimatedRoutes onOpenEnquiry={handleOpenEnquiry} />
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
