const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  
  // 1. Desktop full page & key sections
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/about', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ 
    path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/about-revamp-full.png', 
    fullPage: true 
  });

  // Awards section screenshot specifically
  const awardsElem = await page.$('#awards');
  if (awardsElem) {
    await awardsElem.screenshot({ 
      path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/about-awards-section.png' 
    });
  }

  // 2. Mobile full page
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844 });
  await mobilePage.goto('http://localhost:5173/about', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  await mobilePage.screenshot({ 
    path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/about-revamp-mobile.png', 
    fullPage: true 
  });

  await browser.close();
  console.log('Saved about screenshots successfully!');
})();
