const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Hover over "Pharmaceutical Products" link in header
  const links = await page.$$('header nav a');
  let pharmaLink = null;
  for (const l of links) {
    const text = await page.evaluate(el => el.textContent, l);
    if (text.includes('Pharmaceutical Products')) {
      pharmaLink = l;
      break;
    }
  }

  if (pharmaLink) {
    await pharmaLink.hover();
    await new Promise(r => setTimeout(r, 400));

    // 1. Dropdown close-up
    const dropdown = await page.evaluate(() => {
      const el = document.querySelector('header nav .absolute');
      if (el) {
        const rect = el.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      }
      return null;
    });

    if (dropdown) {
      await page.screenshot({
        path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/clean-pharma-dropdown.png',
        clip: {
          x: Math.max(0, dropdown.x - 20),
          y: Math.max(0, dropdown.y - 60),
          width: dropdown.width + 40,
          height: dropdown.height + 80
        }
      });
      console.log('1. Captured clean-pharma-dropdown.png');

      // 2. Full Header with dropdown
      await page.screenshot({
        path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/header-with-clean-dropdown.png',
        clip: { x: 0, y: 0, width: 1440, height: 460 }
      });
      console.log('2. Captured header-with-clean-dropdown.png');
    }
  }

  await browser.close();
})();
