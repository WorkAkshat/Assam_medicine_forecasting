import sharp from 'sharp';

async function generateAllBanners() {
  const width = 1920;
  const height = 550;

  // ==========================================
  // 1. ABOUT US BANNER (Scientist & R&D Lab)
  // ==========================================
  const aboutSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="aboutGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#04140B" stop-opacity="0.98"/>
          <stop offset="42%" stop-color="#061D11" stop-opacity="0.90"/>
          <stop offset="65%" stop-color="#092819" stop-opacity="0.50"/>
          <stop offset="85%" stop-color="#0A2F1E" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#04140B" stop-opacity="0.60"/>
        </linearGradient>
        <linearGradient id="aboutVert" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#020905" stop-opacity="0.6"/>
          <stop offset="50%" stop-color="transparent" stop-opacity="0"/>
          <stop offset="100%" stop-color="#020905" stop-opacity="0.85"/>
        </linearGradient>
        <pattern id="aboutHex" width="60" height="103.92" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 60 17.32 L 60 51.96 L 30 69.28 L 0 51.96 L 0 17.32 Z" fill="none" stroke="#48BB78" stroke-width="0.75" stroke-opacity="0.12"/>
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#aboutGrad)"/>
      <rect width="${width}" height="${height}" fill="url(#aboutVert)"/>
      <rect width="${width}" height="${height}" fill="url(#aboutHex)"/>
      <!-- Soft ambient emerald & warm terracotta highlights -->
      <circle cx="1400" cy="240" r="340" fill="#1B4D31" fill-opacity="0.45" filter="blur(80px)"/>
      <circle cx="1700" cy="180" r="260" fill="#C85A2E" fill-opacity="0.20" filter="blur(90px)"/>
    </svg>
  `;

  await sharp('public/images/about-microscope.png')
    .resize(width, height, { fit: 'cover', position: 'right top' })
    .blur(1)
    .modulate({ brightness: 1.05, saturation: 1.2 })
    .composite([{ input: Buffer.from(aboutSvg), blend: 'over' }])
    .jpeg({ quality: 95 })
    .toFile('public/images/banner-about.jpg');

  console.log('✓ banner-about.jpg created');

  // ==========================================
  // 2. PHARMA PRODUCTS BANNER (Formulation Lab)
  // ==========================================
  const pharmaSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pharmaGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#04120A" stop-opacity="0.97"/>
          <stop offset="38%" stop-color="#061C11" stop-opacity="0.88"/>
          <stop offset="62%" stop-color="#082516" stop-opacity="0.45"/>
          <stop offset="85%" stop-color="#092E1B" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#04120A" stop-opacity="0.55"/>
        </linearGradient>
        <linearGradient id="pharmaVert" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#020804" stop-opacity="0.6"/>
          <stop offset="50%" stop-color="transparent" stop-opacity="0"/>
          <stop offset="100%" stop-color="#020804" stop-opacity="0.85"/>
        </linearGradient>
        <pattern id="pharmaHex" width="70" height="121.24" patternUnits="userSpaceOnUse">
          <path d="M 35 0 L 70 20.2 L 70 60.62 L 35 80.82 L 0 60.62 L 0 20.2 Z" fill="none" stroke="#38A169" stroke-width="0.75" stroke-opacity="0.12"/>
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#pharmaGrad)"/>
      <rect width="${width}" height="${height}" fill="url(#pharmaVert)"/>
      <rect width="${width}" height="${height}" fill="url(#pharmaHex)"/>
      <circle cx="1350" cy="250" r="350" fill="#0D5C3A" fill-opacity="0.5" filter="blur(80px)"/>
      <circle cx="1650" cy="220" r="280" fill="#319795" fill-opacity="0.22" filter="blur(90px)"/>
    </svg>
  `;

  await sharp('public/images/hero-lab.png')
    .resize(width, height, { fit: 'cover', position: 'right' })
    .blur(1)
    .modulate({ brightness: 0.95, saturation: 1.15 })
    .composite([{ input: Buffer.from(pharmaSvg), blend: 'over' }])
    .jpeg({ quality: 95 })
    .toFile('public/images/banner-pharma.jpg');

  console.log('✓ banner-pharma.jpg created');

  // ==========================================
  // 3. HYGIENE PRODUCTS BANNER (Cleanroom & Antiseptic Care)
  // ==========================================
  const hygieneSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hygieneGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#021109" stop-opacity="0.98"/>
          <stop offset="38%" stop-color="#041A0E" stop-opacity="0.90"/>
          <stop offset="60%" stop-color="#072B19" stop-opacity="0.45"/>
          <stop offset="85%" stop-color="#0B3E25" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#021109" stop-opacity="0.60"/>
        </linearGradient>
        <linearGradient id="hygieneVert" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#010804" stop-opacity="0.6"/>
          <stop offset="50%" stop-color="transparent" stop-opacity="0"/>
          <stop offset="100%" stop-color="#010804" stop-opacity="0.88"/>
        </linearGradient>
        <pattern id="hygieneGrid" width="48" height="48" patternUnits="userSpaceOnUse">
          <circle cx="24" cy="24" r="1.5" fill="#4FD1C5" fill-opacity="0.20"/>
          <path d="M 0 24 L 48 24 M 24 0 L 24 48" stroke="#319795" stroke-width="0.5" stroke-opacity="0.10"/>
        </pattern>
        <!-- Shield Icon Graphic -->
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4FD1C5" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#38A169" stop-opacity="0.05"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#hygieneGrad)"/>
      <rect width="${width}" height="${height}" fill="url(#hygieneVert)"/>
      <rect width="${width}" height="${height}" fill="url(#hygieneGrid)"/>

      <circle cx="1450" cy="275" r="360" fill="#004D40" fill-opacity="0.6" filter="blur(80px)"/>
      <circle cx="1700" cy="220" r="280" fill="#319795" fill-opacity="0.35" filter="blur(90px)"/>

      <!-- Cleanroom protective shield outline -->
      <path d="M 1520 100 Q 1660 90 1760 135 C 1760 310 1660 400 1520 460 C 1380 400 1280 310 1280 135 Q 1380 90 1520 100 Z" 
            fill="url(#shieldGrad)" stroke="#4FD1C5" stroke-width="1.8" stroke-opacity="0.4"/>
      <!-- Inner cross badge -->
      <path d="M 1520 220 L 1520 340 M 1460 280 L 1580 280" stroke="#4FD1C5" stroke-width="8" stroke-linecap="round" stroke-opacity="0.5"/>
      <circle cx="1520" cy="280" r="75" stroke="#4FD1C5" stroke-width="1.5" stroke-dasharray="6 6" fill="none" stroke-opacity="0.5"/>
    </svg>
  `;

  await sharp('public/images/footer-bg.jpg')
    .resize(width, height, { fit: 'cover', position: 'center' })
    .blur(1)
    .modulate({ brightness: 0.95, saturation: 1.25, hue: 170 })
    .composite([{ input: Buffer.from(hygieneSvg), blend: 'over' }])
    .jpeg({ quality: 95 })
    .toFile('public/images/banner-hygiene.jpg');

  console.log('✓ banner-hygiene.jpg created');

  // ==========================================
  // 4. CONTACT US BANNER (Corporate Facility & Northeast Regional Logistics)
  // ==========================================
  const contactSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="contactGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#03120A" stop-opacity="0.98"/>
          <stop offset="38%" stop-color="#051D10" stop-opacity="0.90"/>
          <stop offset="60%" stop-color="#082A18" stop-opacity="0.48"/>
          <stop offset="85%" stop-color="#0D3B23" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#03120A" stop-opacity="0.65"/>
        </linearGradient>
        <linearGradient id="contactVert" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#010804" stop-opacity="0.6"/>
          <stop offset="50%" stop-color="transparent" stop-opacity="0"/>
          <stop offset="100%" stop-color="#010804" stop-opacity="0.88"/>
        </linearGradient>
        <pattern id="contactGrid" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="1.5" fill="#48BB78" fill-opacity="0.16"/>
          <path d="M 0 30 L 60 30 M 30 0 L 30 60" stroke="#2F855A" stroke-width="0.5" stroke-opacity="0.10"/>
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#contactGrad)"/>
      <rect width="${width}" height="${height}" fill="url(#contactVert)"/>
      <rect width="${width}" height="${height}" fill="url(#contactGrid)"/>

      <circle cx="1450" cy="275" r="350" fill="#144A2F" fill-opacity="0.55" filter="blur(80px)"/>
      <circle cx="1700" cy="200" r="280" fill="#C85A2E" fill-opacity="0.22" filter="blur(90px)"/>

      <!-- High-tech Northeast Hub & Logistics Network Nodes -->
      <g stroke="#38A169" stroke-opacity="0.5" stroke-width="1.8" fill="none">
        <line x1="1350" y1="280" x2="1480" y2="200" stroke-dasharray="5 5"/>
        <line x1="1480" y1="200" x2="1620" y2="220" />
        <line x1="1480" y1="200" x2="1540" y2="340" stroke-dasharray="5 5"/>
        <line x1="1620" y1="220" x2="1750" y2="170" />
        <line x1="1620" y1="220" x2="1690" y2="330" stroke-dasharray="5 5"/>
        <line x1="1540" y1="340" x2="1690" y2="330" />
      </g>

      <!-- Rani Plant Hub Node (Guwahati) -->
      <circle cx="1480" cy="200" r="16" fill="#C85A2E" fill-opacity="0.35"/>
      <circle cx="1480" cy="200" r="7" fill="#C85A2E"/>
      <circle cx="1480" cy="200" r="26" stroke="#C85A2E" stroke-width="1.8" stroke-opacity="0.7" fill="none"/>
      <text x="1480" y="155" font-family="sans-serif" font-size="13" font-weight="bold" fill="#FBD38D" text-anchor="middle" letter-spacing="1">RANI MANUFACTURING PLANT</text>
      <text x="1480" y="172" font-family="sans-serif" font-size="11" fill="#E2E8F0" text-anchor="middle">Guwahati, Kamrup (Assam)</text>

      <!-- Network Nodes (Northeast Distribution Hubs) -->
      <circle cx="1350" cy="280" r="6" fill="#48BB78"/>
      <text x="1350" y="308" font-family="sans-serif" font-size="11" font-weight="600" fill="#CBD5E0" text-anchor="middle">Lower Assam &amp; Bengal</text>

      <circle cx="1620" cy="220" r="6" fill="#48BB78"/>
      <text x="1620" y="248" font-family="sans-serif" font-size="11" font-weight="600" fill="#CBD5E0" text-anchor="middle">Upper Assam &amp; Arunachal</text>

      <circle cx="1540" cy="340" r="6" fill="#48BB78"/>
      <text x="1540" y="368" font-family="sans-serif" font-size="11" font-weight="600" fill="#CBD5E0" text-anchor="middle">Meghalaya &amp; Barak Valley</text>

      <circle cx="1750" cy="170" r="5" fill="#48BB78"/>
      <text x="1750" y="198" font-family="sans-serif" font-size="11" font-weight="600" fill="#CBD5E0" text-anchor="middle">Nagaland</text>

      <circle cx="1690" cy="330" r="5" fill="#48BB78"/>
      <text x="1690" y="358" font-family="sans-serif" font-size="11" font-weight="600" fill="#CBD5E0" text-anchor="middle">Manipur &amp; Mizoram</text>
    </svg>
  `;

  await sharp('public/images/about-microscope.png')
    .resize(width, height, { fit: 'cover', position: 'center' })
    .blur(1.2)
    .modulate({ brightness: 0.85, saturation: 1.0 })
    .composite([{ input: Buffer.from(contactSvg), blend: 'over' }])
    .jpeg({ quality: 95 })
    .toFile('public/images/banner-contact.jpg');

  console.log('✓ banner-contact.jpg created');
}

generateAllBanners();
