const puppeteer = require('d:/Improving Medicine Demand Forecasting and Inventory Availability Across Northeast India/website/node_modules/puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52';

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 950 });

    // 1. Dashboard
    console.log('Capturing Dashboard...');
    await page.goto('http://localhost:5175/dashboard', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'easy-portal-dashboard.png') });

    // 2. Demand Forecasting
    console.log('Capturing Demand Forecast...');
    await page.goto('http://localhost:5175/demand-forecasting', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'easy-portal-demand-forecast.png') });

    // 3. Stockout Risk
    console.log('Capturing Stockout Risk...');
    await page.goto('http://localhost:5175/stockout-risk', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'easy-portal-stockout-risk.png') });

    // 4. Replenishment
    console.log('Capturing Replenishment...');
    await page.goto('http://localhost:5175/smart-replenishment', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'easy-portal-replenishment.png') });

    console.log('All screenshots captured successfully!');
  } finally {
    await browser.close();
  }
}

capture().catch(console.error);
