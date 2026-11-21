import puppeteer from 'puppeteer';

async function captureFooter() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Scroll to footer
  await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (footer) footer.scrollIntoView();
  });

  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ 
    path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/new-footer-view.png' 
  });

  await browser.close();
  console.log('Footer screenshot captured successfully!');
}

captureFooter();
