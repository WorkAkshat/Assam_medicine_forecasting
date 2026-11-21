const puppeteer = require('d:/Improving Medicine Demand Forecasting and Inventory Availability Across Northeast India/website/node_modules/puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52';

async function verifyMap() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    await page.goto('http://localhost:5174/contact', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));

    await page.evaluate(() => {
      const section = document.getElementById('map-network-section');
      if (section) section.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'verify-5-location-map-exact.png')
    });
    console.log('Saved verify-5-location-map-exact.png');

  } finally {
    await browser.close();
  }
}

verifyMap().catch(console.error);
