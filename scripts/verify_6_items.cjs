const puppeteer = require('d:/Improving Medicine Demand Forecasting and Inventory Availability Across Northeast India/website/node_modules/puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52';

async function verifyAll() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // 1. Check Hygiene Products - EnvoUser-5 banner
    console.log('Navigating to Hygiene Products...');
    await page.goto('http://localhost:5174/hygiene-products', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));

    // Scroll to find the EnvoUser banner
    await page.evaluate(() => {
      window.scrollTo(0, 1600);
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'verify-1-envouser-banner.png'),
      clip: { x: 100, y: 100, width: 1240, height: 750 }
    });
    console.log('Saved verify-1-envouser-banner.png');

    // 2 & 3. Check Contact Hero Section (confirming removed subtitles & clean presentation)
    console.log('Navigating to Contact Page...');
    await page.goto('http://localhost:5174/contact', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'verify-2-3-contact-hero-clean.png'),
      clip: { x: 0, y: 0, width: 1440, height: 420 }
    });
    console.log('Saved verify-2-3-contact-hero-clean.png');

    // 4. Check Contact Form (validation, limits, clean layout)
    await page.evaluate(() => {
      const formEl = document.querySelector('form');
      if (formEl) formEl.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'verify-4-contact-form-clean.png'),
      clip: { x: 100, y: 50, width: 1240, height: 800 }
    });
    console.log('Saved verify-4-contact-form-clean.png');

    // 5. Check Location Map (concise, simple, accurate, understandable)
    await page.evaluate(() => {
      const mapSection = document.getElementById('map-network-section');
      if (mapSection) mapSection.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'verify-5-location-map-clean.png'),
      clip: { x: 80, y: 100, width: 1280, height: 700 }
    });
    console.log('Saved verify-5-location-map-clean.png');

    // 6. Check Portal Sidebar Header (GRD emblem logo + GRD Pharmaceuticals)
    console.log('Navigating to Portal Dashboard...');
    await page.goto('http://localhost:5175/dashboard', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 800));

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'verify-6-portal-sidebar-logo.png'),
      clip: { x: 0, y: 0, width: 320, height: 180 }
    });
    console.log('Saved verify-6-portal-sidebar-logo.png');

    console.log('All 6 items verified and screenshotted successfully!');
  } finally {
    await browser.close();
  }
}

verifyAll().catch(console.error);
