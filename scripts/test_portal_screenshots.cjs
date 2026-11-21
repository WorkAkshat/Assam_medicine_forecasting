const puppeteer = require('d:/Improving Medicine Demand Forecasting and Inventory Availability Across Northeast India/website/node_modules/puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52';

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const routes = [
    { url: 'http://localhost:5175/dashboard', name: 'portal-dashboard.png' },
    { url: 'http://localhost:5175/pilot-kpis', name: 'portal-pilot-kpis.png' },
    { url: 'http://localhost:5175/demand-forecasting', name: 'portal-demand-forecasting.png' },
    { url: 'http://localhost:5175/inventory', name: 'portal-inventory.png' },
    { url: 'http://localhost:5175/smart-replenishment', name: 'portal-replenishment.png' },
    { url: 'http://localhost:5175/stockout-risk', name: 'portal-stockout-risk.png' },
    { url: 'http://localhost:5175/logistics-monitoring', name: 'portal-logistics.png' }
  ];

  for (const r of routes) {
    console.log(`Navigating to ${r.url}...`);
    try {
      await page.goto(r.url, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(r => setTimeout(r, 1000));
      const outPath = path.join(ARTIFACT_DIR, r.name);
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`Saved screenshot to ${outPath}`);
    } catch (err) {
      console.error(`Failed capturing ${r.url}:`, err.message);
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully.');
}

capture();
