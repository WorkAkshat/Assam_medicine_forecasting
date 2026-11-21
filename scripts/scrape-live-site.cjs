const https = require('https');
const fs = require('fs');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, url).href;
        }
        return fetchPage(redirectUrl).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  const homeHtml = await fetchPage('https://grdpharma.in/');
  fs.writeFileSync('C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/live-site-home.html', homeHtml);

  // Extract all links
  const hrefs = new Set();
  const regex = /href=["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(homeHtml)) !== null) {
    const raw = match[1];
    if (raw.startsWith('http://grdpharma.in') || raw.startsWith('https://grdpharma.in') || (raw.startsWith('/') && !raw.startsWith('//'))) {
      hrefs.add(raw);
    }
  }

  console.log('Found links:');
  const uniqueUrls = Array.from(hrefs);
  uniqueUrls.forEach(u => console.log(' - ' + u));

  // Write unique URLs to inspect
  fs.writeFileSync('C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/live-site-links.json', JSON.stringify(uniqueUrls, null, 2));
})();
