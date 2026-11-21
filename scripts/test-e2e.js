import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log('Testing Homepage...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/e2e-homepage.png', fullPage: true });

  console.log('Testing Enquiry Modal...');
  const enquiryBtn = await page.waitForSelector('button[aria-label="Open trade enquiry form"]');
  await enquiryBtn.click();
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/e2e-enquiry-modal.png' });

  // Close modal
  const closeBtn = await page.waitForSelector('button[aria-label="Close modal"]');
  await closeBtn.click();
  await new Promise(r => setTimeout(r, 400));

  console.log('Testing About page...');
  await page.goto('http://localhost:5173/about', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/e2e-about.png', fullPage: true });

  console.log('Testing Pharmaceutical Products page...');
  await page.goto('http://localhost:5173/pharmaceutical-products', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/e2e-pharma.png', fullPage: true });

  console.log('Testing Hygiene Products page...');
  await page.goto('http://localhost:5173/hygiene-products', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/e2e-hygiene.png', fullPage: true });

  console.log('Testing Product Details page...');
  await page.goto('http://localhost:5173/product/handuser-c', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/e2e-product-detail.png', fullPage: true });

  console.log('Testing Contact page...');
  await page.goto('http://localhost:5173/contact', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/e2e-contact.png', fullPage: true });

  console.log('Testing Mobile Viewport...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/e2e-homepage-mobile.png', fullPage: false });

  await browser.close();
  console.log('All E2E screenshot tests completed successfully!');
}

run().catch(err => {
  console.error('Error running puppeteer test:', err);
  process.exit(1);
});
