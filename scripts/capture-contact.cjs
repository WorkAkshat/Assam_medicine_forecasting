const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  
  // 1. Desktop full viewport
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1050 });
  await page.goto('http://localhost:5173/contact', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/contact-redesigned-desktop-top.png' });

  // Scroll to form and offices
  await page.evaluate(() => {
    window.scrollTo(0, 400);
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/contact-redesigned-desktop-form.png' });

  // Scroll to map
  await page.evaluate(() => {
    window.scrollTo(0, 1100);
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/contact-redesigned-desktop-map.png' });

  // 2. Mobile view
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await mobilePage.goto('http://localhost:5173/contact', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  await mobilePage.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/contact-redesigned-mobile-top.png' });

  await mobilePage.evaluate(() => {
    window.scrollTo(0, 700);
  });
  await new Promise(r => setTimeout(r, 600));
  await mobilePage.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/contact-redesigned-mobile-form.png' });

  await browser.close();
  console.log('All contact screenshots captured successfully');
})();
