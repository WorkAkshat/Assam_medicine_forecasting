const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Homepage Hygiene Section (banner without top bar)
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
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
      path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/homepage-banner-removed-bar.png',
      clip: { x: 0, y: Math.max(0, hygieneSection.y - 30), width: 1440, height: Math.min(hygieneSection.height + 60, 1600) }
    });
    console.log('1. Captured homepage-banner-removed-bar.png');
  }

  // 2. Hygiene Products Page (top banner without top bar)
  await page.goto('http://localhost:5173/hygiene-products', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 300));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/hygiene-page-removed-bar.png',
    clip: { x: 0, y: 200, width: 1440, height: 750 }
  });
  console.log('2. Captured hygiene-page-removed-bar.png');

  await browser.close();
  console.log('All captures complete!');
})();
