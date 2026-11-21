const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  
  // 1. Desktop full page walkthrough
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto('http://localhost:5173/about', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/about-redesigned-top.png' });

  // Scroll to Act 1 & 2
  await page.evaluate(() => {
    window.scrollTo(0, 650);
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/about-redesigned-heritage-capabilities.png' });

  // Scroll to Hygiene & Milestones
  await page.evaluate(() => {
    window.scrollTo(0, 1600);
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/about-redesigned-hygiene-milestones.png' });

  // Scroll to Awards & Verticals
  await page.evaluate(() => {
    window.scrollTo(0, 2400);
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/about-redesigned-awards-verticals.png' });

  // 2. Mobile view
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await mobilePage.goto('http://localhost:5173/about', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  await mobilePage.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/about-redesigned-mobile-top.png' });

  await mobilePage.evaluate(() => {
    window.scrollTo(0, 800);
  });
  await new Promise(r => setTimeout(r, 600));
  await mobilePage.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/about-redesigned-mobile-heritage.png' });

  await browser.close();
  console.log('All about screenshots captured');
})();
