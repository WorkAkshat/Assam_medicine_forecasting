const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });
  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#0B1E13; display:flex; flex-direction:column; gap:24px; padding:24px;">
        <div>
          <h3 style="color:#C85A2E;font-family:sans-serif;margin:0 0 8px;">1. About Banner (Scientist & Lab)</h3>
          <img src="http://localhost:5173/images/banner-about.jpg" style="width:100%; border-radius:12px; border:1px solid #1B4D31;"/>
        </div>
        <div>
          <h3 style="color:#C85A2E;font-family:sans-serif;margin:0 0 8px;">2. Pharma Banner (Formulations & Chemistry)</h3>
          <img src="http://localhost:5173/images/banner-pharma.jpg" style="width:100%; border-radius:12px; border:1px solid #1B4D31;"/>
        </div>
        <div>
          <h3 style="color:#C85A2E;font-family:sans-serif;margin:0 0 8px;">3. Hygiene Banner (Cleanroom & Disinfection)</h3>
          <img src="http://localhost:5173/images/banner-hygiene.jpg" style="width:100%; border-radius:12px; border:1px solid #1B4D31;"/>
        </div>
        <div>
          <h3 style="color:#C85A2E;font-family:sans-serif;margin:0 0 8px;">4. Contact Banner (Corporate Infrastructure)</h3>
          <img src="http://localhost:5173/images/banner-contact.jpg" style="width:100%; border-radius:12px; border:1px solid #1B4D31;"/>
        </div>
      </body>
    </html>
  `;
  await page.setContent(html);
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/banners-preview.png', fullPage: true });
  await browser.close();
  console.log('Saved banners-preview.png successfully');
})();
