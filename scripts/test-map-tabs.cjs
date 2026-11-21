const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/contact', { waitUntil: 'networkidle0' });

  // Scroll to map
  await page.evaluate(() => window.scrollTo(0, 1100));
  await new Promise(r => setTimeout(r, 400));

  // Click on "Head Office" tab
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Head Office')) {
      await b.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ 
    path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/contact-map-tab-headoffice.png',
    clip: { x: 0, y: 1000, width: 1440, height: 750 }
  });

  await browser.close();
  console.log('Saved contact-map-tab-headoffice.png successfully!');
})();
