const puppeteer = require('d:/Improving Medicine Demand Forecasting and Inventory Availability Across Northeast India/website/node_modules/puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52';

async function testLoginModal() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Desktop Test
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  // 1. Capture Header with Portal Login button
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'website-header-portal-button.png'), clip: { x: 0, y: 0, width: 1440, height: 120 } });
  console.log('Saved website-header-portal-button.png');

  // 2. Click Portal Login button
  const portalBtn = await page.$('button[aria-label="PharmaPredict AI Portal Login"]');
  if (portalBtn) {
    await portalBtn.click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'website-portal-login-modal.png') });
    console.log('Saved website-portal-login-modal.png');
  } else {
    console.error('Portal Login button not found!');
  }

  // Mobile Test
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844 });
  await mobilePage.goto('http://localhost:5174/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  // Click hamburger menu
  const menuBtn = await mobilePage.$('button[aria-label="Toggle navigation menu"]');
  if (menuBtn) {
    await menuBtn.click();
    await new Promise(r => setTimeout(r, 500));
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'website-mobile-portal-login.png') });
    console.log('Saved website-mobile-portal-login.png');
  }

  await browser.close();
  console.log('Done testing Portal Login Modal.');
}

testLoginModal();
