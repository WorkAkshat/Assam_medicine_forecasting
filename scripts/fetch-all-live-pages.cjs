const https = require('https');
const fs = require('fs');
const path = require('path');

const pages = [
  'about.html',
  'HANDUSER-C.html',
  'SURFOUSER-A.html',
  'ENVOUSER-5.html',
  'Personal-and-Societal-Hygiene.html',
  'WHO-Guidelines.html',
  'Kinds-of-Handwashes.html',
  'Historical-perspective-on-hand-hygiene-in-health-care.html'
];

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

function stripHtml(html) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

(async () => {
  const allData = {};
  for (const page of pages) {
    const url = `https://grdpharma.in/${page}`;
    try {
      console.log('Fetching', url);
      const html = await fetchPage(url);
      const text = stripHtml(html);
      allData[page] = text;
      console.log(` -> Fetched ${page} (${text.length} chars)`);
    } catch (err) {
      console.error(` -> Failed ${page}:`, err.message);
    }
  }

  // Also extract text from homepage
  const homeHtml = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/live-site-home.html', 'utf-8');
  allData['index.html'] = stripHtml(homeHtml);

  fs.writeFileSync('C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/live-site-all-content.json', JSON.stringify(allData, null, 2));
  console.log('Saved all content to live-site-all-content.json');
})();
