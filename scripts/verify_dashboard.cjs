const puppeteer = require('../website/node_modules/puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // 1440px desktop
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5175/dashboard', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/fixed-dashboard-header.png' });

  // Closeup of header
  const header = await page.$('.border-b.border-slate-200\\/80');
  if (header) {
    await header.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/dashboard-header-closeup.png' });
  }

  // 1200px laptop
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto('http://localhost:5175/dashboard', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/fixed-dashboard-1200px.png' });

  await browser.close();
  console.log('Dashboard screenshots captured successfully!');
})().catch(e => {
  console.error(e);
  process.exit(1);
});
