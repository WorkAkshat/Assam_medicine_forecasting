const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  
  // 1. Pharmaceutical Products Page (Dosage Cards with Progressive Disclosure)
  const page1 = await browser.newPage();
  await page1.setViewport({ width: 1440, height: 1000 });
  await page1.goto('http://localhost:5173/pharmaceutical-products', { waitUntil: 'networkidle2' });
  await page1.evaluate(() => window.scrollTo(0, 600));
  await new Promise(r => setTimeout(r, 600));
  await page1.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/pharma-compact-disclosure.png' });

  // 2. Hygiene Products Page (Product Cards & WHO Articles)
  const page2 = await browser.newPage();
  await page2.setViewport({ width: 1440, height: 1000 });
  await page2.goto('http://localhost:5173/hygiene-products', { waitUntil: 'networkidle2' });
  await page2.evaluate(() => window.scrollTo(0, 1600));
  await new Promise(r => setTimeout(r, 600));
  await page2.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/hygiene-compact-cards.png' });

  // Scroll to WHO Articles
  await page2.evaluate(() => window.scrollTo(0, 2600));
  await new Promise(r => setTimeout(r, 600));
  await page2.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/hygiene-who-compact-articles.png' });

  // 3. About Page (Partner Awards with Citation Toggles)
  const page3 = await browser.newPage();
  await page3.setViewport({ width: 1440, height: 1000 });
  await page3.goto('http://localhost:5173/about', { waitUntil: 'networkidle2' });
  await page3.evaluate(() => window.scrollTo(0, 2200));
  await new Promise(r => setTimeout(r, 600));
  await page3.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/about-awards-compact.png' });

  // 4. Product Details Page (Features Disclosure)
  const page4 = await browser.newPage();
  await page4.setViewport({ width: 1440, height: 1000 });
  await page4.goto('http://localhost:5173/product/handuser-c', { waitUntil: 'networkidle2' });
  await page4.evaluate(() => window.scrollTo(0, 500));
  await new Promise(r => setTimeout(r, 600));
  await page4.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/product-details-compact.png' });

  await browser.close();
  console.log('All sitewide consistency screenshots captured successfully');
})();
