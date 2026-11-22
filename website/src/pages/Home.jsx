import React from 'react';
import { 
  Hero, 
  PharmaSection, 
  HygieneSection, 
  AboutSection, 
  PresenceSection,
  ForecastSection,
  SEO 
} from '@/components';

export default function Home({ onOpenEnquiry, onOpenPortal }) {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="GRD Pharmaceuticals | A Unit of Dhanuka Group - Guwahati, Assam"
        description="GRD Pharmaceuticals is a premier manufacturer of high-quality pharmaceutical formulations and hospital-grade hygiene solutions across Northeast India. Established in 2006, Guwahati & Rani, Assam."
      />
      {/* Hero Section with Integrated Value Highlights */}
      <Hero onOpenEnquiry={onOpenEnquiry} />

      {/* Demand forecasting & replenishment (NESFIC-I-09) */}
      <ForecastSection onOpenPortal={onOpenPortal} />

      {/* Pharmaceutical Formulations Portfolio Section */}
      <PharmaSection />

      {/* Hygiene & Sanitization Products Section */}
      <HygieneSection />

      {/* About GRD Pharmaceuticals & Dhanuka Group Legacy */}
      <AboutSection />

      {/* Regional Logistics & Distribution Presence Section */}
      <PresenceSection />
    </div>
  );
}
