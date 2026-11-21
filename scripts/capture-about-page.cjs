const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/about-us', { waitUntil: 'networkidle2' });
  
  // Scroll down to quality section
  await page.evaluate(() => {
    window.scrollTo(0, 800);
  });
  await new Promise(r => setTimeout(r, 1200));

  const artifactPath = path.resolve('C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/about-page-quality-section.png');
  await page.screenshot({ path: artifactPath, fullPage: false });
  console.log('Saved to', artifactPath);
  await browser.close();
})();
