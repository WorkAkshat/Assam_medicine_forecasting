import puppeteer from 'puppeteer';
import sharp from 'sharp';

async function testFooter() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  // 1. Desktop 1440
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Scroll to bottom
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/footer-redesign-desktop.png' });

  // 2. Mobile 390
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/footer-redesign-mobile.png' });

  await browser.close();
  console.log('Footer screenshots captured!');
}

testFooter();
