const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  
  // Scroll down to hygiene cards
  await page.evaluate(() => {
    window.scrollTo(0, 1100);
  });
  await new Promise(r => setTimeout(r, 1200));

  const artifactPath = path.resolve('C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/hygiene-cards-full-cover.png');
  await page.screenshot({ path: artifactPath, fullPage: false });
  console.log('Saved to', artifactPath);
  await browser.close();
})();
