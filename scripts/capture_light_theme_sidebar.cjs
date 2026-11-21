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

    // 1. Capture Dashboard with new light theme sidebar
    console.log('Navigating to http://localhost:5175/dashboard...');
    await page.goto('http://localhost:5175/dashboard', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 800));

    // Full screen capture
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'light-theme-portal-full.png')
    });
    console.log('Saved light-theme-portal-full.png');

    // Close-up of Sidebar
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'light-theme-sidebar-closeup.png'),
      clip: { x: 0, y: 0, width: 280, height: 950 }
    });
    console.log('Saved light-theme-sidebar-closeup.png');

    // 2. Navigate to Demand Forecasting to see active state on light theme
    console.log('Navigating to http://localhost:5175/demand-forecasting...');
    await page.goto('http://localhost:5175/demand-forecasting', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 800));

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'light-theme-sidebar-demand-forecast.png'),
      clip: { x: 0, y: 0, width: 280, height: 950 }
    });
    console.log('Saved light-theme-sidebar-demand-forecast.png');

  } finally {
    await browser.close();
  }
}

capture().catch(console.error);
