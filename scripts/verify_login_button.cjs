const puppeteer = require('../website/node_modules/puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/fixed-portal-login-button.png' });
  
  const button = await page.$('button[title*="Portal Login"]');
  if (button) {
    await button.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/portal-login-closeup.png' });
  }

  await browser.close();
  console.log('Fixed portal login screenshots captured successfully!');
})().catch(e => {
  console.error(e);
  process.exit(1);
});
