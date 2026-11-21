import puppeteer from 'puppeteer';

async function captureWide() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/desktop-1920-viewport.png' });
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/desktop-1920-full.png', fullPage: true });

  await browser.close();
  console.log('1920px Wide screenshots captured successfully!');
}

captureWide();
