const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 2400 });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: sans-serif; background: #0B1A12; color: white; padding: 24px; margin: 0; }
          h2 { color: #F59E0B; margin-bottom: 8px; border-bottom: 1px solid #1E3A2B; padding-bottom: 8px; }
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 32px; }
          .card { background: #132A1C; border-radius: 12px; padding: 16px; border: 1px solid #234E35; }
          .card h3 { margin-top: 0; color: #34D399; }
          img { width: 100%; height: auto; border-radius: 8px; background: white; object-fit: contain; }
          .banner img { max-height: 280px; }
          .square img { max-height: 320px; }
        </style>
      </head>
      <body>
        <h1>Provided Images Inspection Gallery</h1>
        
        <h2>Official Company Logo</h2>
        <div class="card" style="max-width: 400px; margin-bottom: 30px;">
          <h3>Logo.png (1254 x 1254)</h3>
          <img src="http://localhost:5173/provided/Logo.png" style="background:#FCFDFB; padding:16px;" />
        </div>

        <h2>Wide Landscape Banners (P1 - P4)</h2>
        <div class="grid">
          <div class="card banner">
            <h3>P1 image.png (1927 x 816)</h3>
            <img src="http://localhost:5173/provided/P1%20image.png" />
          </div>
          <div class="card banner">
            <h3>P2 image.png (1927 x 816)</h3>
            <img src="http://localhost:5173/provided/P2%20image.png" />
          </div>
          <div class="card banner">
            <h3>P3 image.png (1928 x 815)</h3>
            <img src="http://localhost:5173/provided/P3%20image.png" />
          </div>
          <div class="card banner">
            <h3>P4 image.png (1927 x 816)</h3>
            <img src="http://localhost:5173/provided/P4%20image.png" />
          </div>
        </div>

        <h2>Square Product Cards (P5 - P8)</h2>
        <div class="grid">
          <div class="card square">
            <h3>P5 image.png (1254 x 1254)</h3>
            <img src="http://localhost:5173/provided/P5%20image.png" />
          </div>
          <div class="card square">
            <h3>P6 image.png (1254 x 1254)</h3>
            <img src="http://localhost:5173/provided/P6%20image.png" />
          </div>
          <div class="card square">
            <h3>P7 image.png (1254 x 1254)</h3>
            <img src="http://localhost:5173/provided/P7%20image.png" />
          </div>
          <div class="card square">
            <h3>P8 image.png (1254 x 1254)</h3>
            <img src="http://localhost:5173/provided/P8%20image.png" />
          </div>
        </div>
      </body>
    </html>
  `;

  await page.setContent(html);
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ 
    path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/provided-images-gallery.png',
    fullPage: true 
  });

  console.log('Saved provided-images-gallery.png successfully!');
  await browser.close();
})();
