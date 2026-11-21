const fs = require('fs');
const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/brain/bab718ba-1283-4835-b724-e78b5940ea52/live-site-home.html', 'utf8');
const pos = html.indexOf('Factory Address');
console.log(html.slice(pos, pos + 800).replace(/<[^>]+>/g, '\n').replace(/\n\s*\n/g, '\n'));
