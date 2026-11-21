const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });

  // 1. Pharma page
  const page1 = await browser.newPage();
  await page1.setViewport({ width: 1440, height: 900 });
  await page1.goto('http://localhost:5173/pharmaceutical-products', { waitUntil: 'networkidle2' });
  await page1.evaluate(() => window.scrollTo(0, 450));
  await new Promise(r => setTimeout(r, 1000));
  await page1.screenshot({ path: path.resolve('C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/pharma-page-authentic.png') });

  // 2. Hygiene page with WHO guidelines
  const page2 = await browser.newPage();
  await page2.setViewport({ width: 1440, height: 900 });
  await page2.goto('http://localhost:5173/hygiene-products', { waitUntil: 'networkidle2' });
  await page2.evaluate(() => window.scrollTo(0, 2200));
  await new Promise(r => setTimeout(r, 1000));
  await page2.screenshot({ path: path.resolve('C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/hygiene-page-who-guidelines.png') });

  // 3. Product details Handuser-C
  const page3 = await browser.newPage();
  await page3.setViewport({ width: 1440, height: 900 });
  await page3.goto('http://localhost:5173/product/handuser-c', { waitUntil: 'networkidle2' });
  await page3.evaluate(() => window.scrollTo(0, 450));
  await new Promise(r => setTimeout(r, 1000));
  await page3.screenshot({ path: path.resolve('C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/handuser-c-authentic-details.png') });

  console.log('All authentic verification screenshots captured');
  await browser.close();
})();
