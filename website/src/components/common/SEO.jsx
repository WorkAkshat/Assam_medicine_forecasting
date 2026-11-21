import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_TITLE = 'GRD Pharmaceuticals | A Unit of Dhanuka Group - Guwahati, Assam';
const DEFAULT_DESC = 'GRD Pharmaceuticals is a premier manufacturer of high-quality pharmaceutical formulations and hospital-grade hygiene solutions across Northeast India. Established in 2006, Guwahati & Rani, Assam.';
const SITE_URL = 'https://grdpharma.in';
const DEFAULT_IMAGE = `${SITE_URL}/images/products/p1-complete-range.webp`;

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  image = DEFAULT_IMAGE,
  type = 'website',
  schema = null,
}) {
  const location = useLocation();
  const canonicalUrl = `${SITE_URL}${location.pathname}`;

  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper to set or create meta tag
    const setMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMeta('description', description);
    setMeta('robots', 'index, follow, max-image-preview:large');

    // 3. OpenGraph / Facebook
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:type', type, true);
    setMeta('og:image', image.startsWith('http') ? image : `${SITE_URL}${image}`, true);
    setMeta('og:site_name', 'GRD Pharmaceuticals', true);
    setMeta('og:locale', 'en_IN', true);

    // 4. Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image.startsWith('http') ? image : `${SITE_URL}${image}`);

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // 6. JSON-LD Structured Data Schema
    let scriptTag = document.getElementById('json-ld-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const defaultSchema = {
      '@context': 'https://schema.org',
      '@type': 'MedicalBusiness',
      name: 'GRD Pharmaceuticals',
      legalName: 'GRD Pharmaceuticals (A Unit of Dhanuka Group)',
      url: SITE_URL,
      logo: `${SITE_URL}/images/products/grd-logo.webp`,
      foundingDate: '2006',
      parentOrganization: {
        '@type': 'Organization',
        name: 'Dhanuka Group'
      },
      address: [
        {
          '@type': 'PostalAddress',
          streetAddress: 'Dhanuka Complex, Block - B, Sati Joymati Road, Athgaon',
          addressLocality: 'Guwahati',
          addressRegion: 'Assam',
          postalCode: '781001',
          addressCountry: 'IN'
        },
        {
          '@type': 'PostalAddress',
          streetAddress: 'D-15, Rani Industrial Area, Rani',
          addressLocality: 'Kamrup',
          addressRegion: 'Assam',
          postalCode: '781131',
          addressCountry: 'IN'
        }
      ],
      telephone: '+91-97060-01000',
      email: 'contact@grdpharma.in'
    };

    scriptTag.textContent = JSON.stringify(schema || defaultSchema);

  }, [title, description, image, type, canonicalUrl, schema]);

  return null;
}
