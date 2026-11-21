const puppeteer = require('d:/Improving Medicine Demand Forecasting and Inventory Availability Across Northeast India/website/node_modules/puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52';

async function testLogoFix() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5175/dashboard', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  // Capture close up of top left sidebar
  await page.screenshot({ 
    path: path.join(ARTIFACT_DIR, 'portal-sidebar-logo-fixed.png'),
    clip: { x: 0, y: 0, width: 280, height: 100 }
  });
  console.log('Saved portal-sidebar-logo-fixed.png');

  // Also capture full header + top section
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'portal-dashboard-header-fixed.png'),
    clip: { x: 0, y: 0, width: 1440, height: 350 }
  });
  console.log('Saved portal-dashboard-header-fixed.png');

  await browser.close();
}

testLogoFix();
