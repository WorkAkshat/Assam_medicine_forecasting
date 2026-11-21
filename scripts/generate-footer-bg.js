import sharp from 'sharp';

async function makeStunningFooterBg() {
  const width = 1920;
  const height = 1080;

  const svgLighting = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Deep rich forest green gradient overlay for high contrast readability -->
        <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#04120B" stop-opacity="0.94"/>
          <stop offset="20%" stop-color="#071F13" stop-opacity="0.86"/>
          <stop offset="65%" stop-color="#092819" stop-opacity="0.88"/>
          <stop offset="100%" stop-color="#030C07" stop-opacity="0.98"/>
        </linearGradient>

        <!-- Edge darkening for crisp typography -->
        <linearGradient id="sideVignette" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#030C07" stop-opacity="0.6"/>
          <stop offset="50%" stop-color="#030C07" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="#030C07" stop-opacity="0.6"/>
        </linearGradient>

        <!-- Subtle scientific molecular pattern -->
        <pattern id="hexPattern" width="70" height="121.24" patternUnits="userSpaceOnUse">
          <path d="M 35 0 L 70 20.2 L 70 60.62 L 35 80.82 L 0 60.62 L 0 20.2 Z" fill="none" stroke="#48BB78" stroke-width="0.7" stroke-opacity="0.08"/>
          <path d="M 35 60.62 L 70 80.82 L 70 121.24 L 35 141.44 L 0 121.24 L 0 80.82 Z" fill="none" stroke="#48BB78" stroke-width="0.7" stroke-opacity="0.08"/>
          <circle cx="35" cy="0" r="2" fill="#C85A2E" fill-opacity="0.15"/>
        </pattern>
      </defs>

      <!-- Background overlay layers -->
      <rect width="${width}" height="${height}" fill="url(#vignette)"/>
      <rect width="${width}" height="${height}" fill="url(#sideVignette)"/>
      <rect width="${width}" height="${height}" fill="url(#hexPattern)"/>

      <!-- Ambient volumetric illumination -->
      <circle cx="280" cy="200" r="420" fill="#1E5435" fill-opacity="0.25" filter="blur(90px)"/>
      <circle cx="1600" cy="380" r="480" fill="#143E26" fill-opacity="0.32" filter="blur(100px)"/>
      <circle cx="960" cy="880" r="500" fill="#C85A2E" fill-opacity="0.08" filter="blur(110px)"/>
    </svg>
  `;

  await sharp('public/images/hero-lab.png')
    .resize(width, height, { fit: 'cover', position: 'center' })
    .blur(2) // subtle soft focus so lab environment and scientist silhouette are clearly visible
    .modulate({ brightness: 0.5, saturation: 0.8, hue: 130 })
    .composite([
      {
        input: Buffer.from(svgLighting),
        blend: 'over'
      }
    ])
    .jpeg({ quality: 95 })
    .toFile('public/images/footer-bg.jpg');

  console.log('High-quality footer-bg.jpg generated successfully!');
}

makeStunningFooterBg();
