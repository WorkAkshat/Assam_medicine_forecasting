const fs = require('fs');

const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/live-site-home.html', 'utf-8');

// Find all <a> tags
const linkMatches = html.match(/<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis) || [];
console.log('--- ALL LINKS ---');
const cleanLinks = [];
linkMatches.forEach(l => {
  const hrefMatch = l.match(/href=["']([^"']+)["']/i);
  const text = l.replace(/<[^>]+>/g, '').trim();
  if (hrefMatch && hrefMatch[1] && !hrefMatch[1].startsWith('#') && !hrefMatch[1].startsWith('javascript:')) {
    cleanLinks.push({ href: hrefMatch[1], text });
  }
});
console.log(JSON.stringify(cleanLinks, null, 2));

// Find all headings
console.log('\n--- HEADINGS ---');
const headings = html.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gis) || [];
headings.forEach(h => {
  console.log(h.replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' '));
});
