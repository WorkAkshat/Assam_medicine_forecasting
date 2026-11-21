const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  
  // Mobile
  const pageMobile = await browser.newPage();
  await pageMobile.setViewport({ width: 390, height: 844, isMobile: true });
  await pageMobile.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await pageMobile.evaluate(() => window.scrollTo(0, 1600));
  await new Promise(r => setTimeout(r, 1000));
  await pageMobile.screenshot({ path: path.resolve('C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/hygiene-cards-mobile-full-cover.png') });

  // Tablet
  const pageTablet = await browser.newPage();
  await pageTablet.setViewport({ width: 768, height: 1024 });
  await pageTablet.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await pageTablet.evaluate(() => window.scrollTo(0, 1300));
  await new Promise(r => setTimeout(r, 1000));
  await pageTablet.screenshot({ path: path.resolve('C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/hygiene-cards-tablet-full-cover.png') });

  console.log('Mobile and tablet screenshots captured');
  await browser.close();
})();
