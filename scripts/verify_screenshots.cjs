const puppeteer = require('../website/node_modules/puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Excess Inventory
  console.log('Capturing Excess Inventory...');
  await page.goto('http://localhost:5175/excess-inventory', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/fixed-excess-inventory.png' });

  // 2. Stockout Risk
  console.log('Capturing Stockout Risk...');
  await page.goto('http://localhost:5175/stockout-risk', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/fixed-stockout-risk.png' });

  // 3. Expiry Management
  console.log('Capturing Expiry Management...');
  await page.goto('http://localhost:5175/expiry-management', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/fixed-fefo-expiry.png' });

  // 4. Logistics
  console.log('Capturing Logistics...');
  await page.goto('http://localhost:5175/logistics-monitoring', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/fixed-logistics.png' });

  await browser.close();
  console.log('Successfully captured all screenshots!');
})().catch(e => {
  console.error(e);
  process.exit(1);
});
