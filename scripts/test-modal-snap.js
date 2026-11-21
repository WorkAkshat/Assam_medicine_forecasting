import puppeteer from 'puppeteer';

async function captureModal() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Click on the Header "Enquiry" button to open modal
  const enquiryBtn = await page.$('button[aria-label="Open trade enquiry dialog"]');
  if (enquiryBtn) {
    await enquiryBtn.click();
  } else {
    // Or evaluate opening modal by clicking any enquiry trigger
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.includes('Enquiry'));
      if (btn) btn.click();
    });
  }

  // Wait for modal animation
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ 
    path: 'C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/new-modal-view.png' 
  });

  await browser.close();
  console.log('Modal screenshot captured at new-modal-view.png');
}

captureModal();
