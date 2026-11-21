const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const routes = [
    '/',
    '/about',
    '/pharmaceutical-products',
    '/hygiene-products',
    '/product/handuser-c',
    '/product/surface-sanitizer',
    '/product/environment-sanitizer',
    '/contact'
  ];

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console error on ${page.url()}: ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    errors.push(`Page crash error on ${page.url()}: ${err.message}`);
  });

  console.log('Testing all routes on http://localhost:5173...');
  for (const route of routes) {
    const res = await page.goto('http://localhost:5173' + route, { waitUntil: 'networkidle0' });
    const status = res.status();
    const title = await page.title();
    console.log(`Route ${route.padEnd(30)} -> HTTP ${status} | Title: "${title}"`);
    if (status >= 400) {
      errors.push(`Route ${route} returned HTTP ${status}`);
    }
  }

  await browser.close();

  if (errors.length > 0) {
    console.error('\nErrors detected:');
    errors.forEach(e => console.error(' - ' + e));
    process.exit(1);
  } else {
    console.log('\nAll 8 tested routes loaded with HTTP 200 and ZERO console errors!');
  }
})();
