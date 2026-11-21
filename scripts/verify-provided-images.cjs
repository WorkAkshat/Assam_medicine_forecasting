const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // 1. Homepage Header & Logo
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ 
    path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/homepage-header-logo.png',
    clip: { x: 0, y: 0, width: 1440, height: 160 }
  });
  console.log('1. Captured homepage-header-logo.png');

  // 2. Homepage Hygiene Section
  const hygieneSection = await page.evaluate(() => {
    const el = document.querySelector('section.bg-\\[\\#F9FAF8\\]') || Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Hygiene & Sanitization Products'));
    if (el) {
      const rect = el.getBoundingClientRect();
      return { y: rect.top + window.scrollY, height: rect.height };
    }
    return null;
  });

  if (hygieneSection) {
    await page.evaluate((y) => window.scrollTo(0, y - 50), hygieneSection.y);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({
      path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/homepage-hygiene-section.png',
      clip: { x: 0, y: Math.max(0, hygieneSection.y - 30), width: 1440, height: Math.min(hygieneSection.height + 60, 1600) }
    });
    console.log('2. Captured homepage-hygiene-section.png');
  }

  // Helper to scroll page to trigger all in-view animations
  async function scrollPage(p) {
    await p.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 100);
      });
    });
    await new Promise(r => setTimeout(r, 600));
  }

  // 3. Hygiene Products Page full capture
  await page.goto('http://localhost:5173/hygiene-products', { waitUntil: 'networkidle0' });
  await scrollPage(page);
  await page.screenshot({
    path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/hygiene-page-full.png',
    fullPage: true
  });
  console.log('3. Captured hygiene-page-full.png');

  // 4. Product Details for Handuser-C
  await page.goto('http://localhost:5173/product/handuser-c', { waitUntil: 'networkidle0' });
  await scrollPage(page);
  await page.screenshot({
    path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/product-handuser-c.png',
    fullPage: true
  });
  console.log('4. Captured product-handuser-c.png');

  // 5. Footer with new Logo
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  const footerRect = await page.evaluate(() => {
    const f = document.querySelector('footer');
    if (f) {
      const rect = f.getBoundingClientRect();
      return { y: rect.top + window.scrollY, height: rect.height };
    }
    return null;
  });

  if (footerRect) {
    await page.evaluate((y) => window.scrollTo(0, y), footerRect.y);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({
      path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/footer-with-new-logo.png',
      clip: { x: 0, y: footerRect.y, width: 1440, height: footerRect.height }
    });
    console.log('5. Captured footer-with-new-logo.png');
  }

  // 6. Mobile Viewport for Hygiene Products Page
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/hygiene-products', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/hygiene-page-mobile.png',
    fullPage: true
  });
  console.log('6. Captured hygiene-page-mobile.png');

  await browser.close();
  console.log('All verification screenshots complete!');
})();
