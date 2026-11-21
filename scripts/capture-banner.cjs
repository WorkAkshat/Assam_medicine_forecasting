const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h3'));
    const bannerHeading = headings.find(h => h.textContent.includes('Handuser-C'));
    if (bannerHeading) {
      bannerHeading.closest('div.rounded-3xl, div.rounded-4xl').scrollIntoView({ block: 'start' });
    }
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/handuser-c-banner-mobile-full.png' });
  await browser.close();
  console.log('Captured full banner on mobile');
})();
