const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  
  // 1. Desktop dropdown hover
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Hover over "Pharmaceutical Products"
  const navLink = await page.$('nav a[href="/pharmaceutical-products"]');
  if (navLink) {
    await navLink.hover();
    await new Promise(r => setTimeout(r, 400));
  }

  // Screenshot the dropdown area specifically
  await page.screenshot({ 
    path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/new-dropdown-hover.png',
    clip: { x: 450, y: 15, width: 440, height: 420 }
  });

  // Also full header slice
  await page.screenshot({ 
    path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/new-dropdown-full-header.png',
    clip: { x: 0, y: 0, width: 1440, height: 450 }
  });

  console.log('Saved dropdown screenshots successfully!');
  await browser.close();
})();
