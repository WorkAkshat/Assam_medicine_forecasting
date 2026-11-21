import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // 1. Homepage
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  
  // Smooth scroll down to trigger all animations
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0); // scroll back to top
          resolve();
        }
      }, 80);
    });
  });

  // Wait a short moment for animations to settle
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/homepage-1920-viewport.png' });
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/homepage-1920-full.png', fullPage: true });

  // 2. About page
  await page.goto('http://localhost:5173/#/about', { waitUntil: 'networkidle0' });
  await page.evaluate(async () => {
    window.scrollBy(0, 800);
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/about-1920-full.png', fullPage: true });

  // 3. Pharma Products
  await page.goto('http://localhost:5173/#/pharmaceutical-products', { waitUntil: 'networkidle0' });
  await page.evaluate(async () => {
    window.scrollBy(0, 800);
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/pharma-1920-full.png', fullPage: true });

  // 4. Contact
  await page.goto('http://localhost:5173/#/contact', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/contact-1920-full.png', fullPage: true });

  // 5. Mobile 390x844
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/mobile-home-390.png' });

  await browser.close();
  console.log('All comprehensive screenshots successfully captured!');
}
run();
