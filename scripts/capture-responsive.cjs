const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  
  // 1. Mobile (390 x 844 - iPhone 12/13/14)
  const pageMobile = await browser.newPage();
  await pageMobile.setViewport({ width: 390, height: 844, isMobile: true });
  await pageMobile.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await pageMobile.evaluate(() => window.scrollTo(0, 2600));
  await new Promise(r => setTimeout(r, 1000));
  await pageMobile.screenshot({
    path: path.resolve('C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/hygiene-banner-mobile.png')
  });

  // 2. Tablet (768 x 1024 - iPad)
  const pageTablet = await browser.newPage();
  await pageTablet.setViewport({ width: 768, height: 1024 });
  await pageTablet.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await pageTablet.evaluate(() => window.scrollTo(0, 2100));
  await new Promise(r => setTimeout(r, 1000));
  await pageTablet.screenshot({
    path: path.resolve('C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/hygiene-banner-tablet.png')
  });

  console.log('Mobile and tablet captured');
  await browser.close();
})();
