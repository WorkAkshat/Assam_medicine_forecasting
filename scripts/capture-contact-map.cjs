const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/contact', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Full page
  await page.screenshot({ 
    path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/contact-with-map-full.png',
    fullPage: true
  });

  // Scroll down to the map section
  await page.evaluate(() => {
    window.scrollTo(0, 750);
  });
  await new Promise(r => setTimeout(r, 400));

  await page.screenshot({ 
    path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/contact-map-section.png',
    clip: { x: 0, y: 720, width: 1440, height: 750 }
  });

  await browser.close();
  console.log('Saved contact map screenshots successfully!');
})();
