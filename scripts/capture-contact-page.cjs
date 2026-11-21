const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  
  // 1. Desktop Contact Us Page
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/contact', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ 
    path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/contact-revamp-desktop.png',
    clip: { x: 0, y: 350, width: 1440, height: 850 }
  });

  await page.screenshot({ 
    path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/contact-revamp-full.png',
    fullPage: true
  });

  // 2. Mobile Contact Us Page
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844 });
  await mobilePage.goto('http://localhost:5173/contact', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  await mobilePage.screenshot({ 
    path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/contact-revamp-mobile.png',
    fullPage: true
  });

  await browser.close();
  console.log('Saved contact screenshots successfully!');
})();
