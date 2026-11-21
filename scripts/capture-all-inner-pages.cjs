const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52';

const pagesToTest = [
  { name: 'inner-about-desktop', url: 'http://localhost:5173/about', width: 1440, height: 900 },
  { name: 'inner-about-mobile', url: 'http://localhost:5173/about', width: 390, height: 844 },
  { name: 'inner-pharma-desktop', url: 'http://localhost:5173/pharmaceutical-products', width: 1440, height: 900 },
  { name: 'inner-pharma-mobile', url: 'http://localhost:5173/pharmaceutical-products', width: 390, height: 844 },
  { name: 'inner-hygiene-desktop', url: 'http://localhost:5173/hygiene-products', width: 1440, height: 900 },
  { name: 'inner-hygiene-mobile', url: 'http://localhost:5173/hygiene-products', width: 390, height: 844 },
  { name: 'inner-contact-desktop', url: 'http://localhost:5173/contact', width: 1440, height: 900 },
  { name: 'inner-contact-mobile', url: 'http://localhost:5173/contact', width: 390, height: 844 },
  { name: 'inner-product-desktop', url: 'http://localhost:5173/product/handuser-c-disinfectant-wipes', width: 1440, height: 900 },
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  
  for (const item of pagesToTest) {
    const page = await browser.newPage();
    await page.setViewport({ width: item.width, height: item.height });
    await page.goto(item.url, { waitUntil: 'networkidle0' });
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 600));

    const outPath = path.join(ARTIFACT_DIR, `${item.name}.png`);
    await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: item.width, height: Math.min(item.height, 650) } });
    console.log(`Saved ${item.name}.png`);
    await page.close();
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
})();
