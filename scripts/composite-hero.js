const sharp = require('sharp');
const fs = require('fs');

async function processImage() {
  // Read and resize logo
  const logoBuffer = await sharp('public/images/user-logo.png')
    .resize({ width: 160 })
    .toBuffer();

  // Create SVG for the text (phone number) on the hood
  const svgOverlay = `
    <svg width="640" height="640" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(140, 450) rotate(-8) skewX(25)">
        <text font-family="sans-serif" font-size="20" font-weight="900" fill="#1e293b">+48 692 752 306</text>
      </g>
    </svg>
  `;

  // Composite them together
  await sharp('public/images/hero-warsaw-tow.png')
    .composite([
      { input: logoBuffer, top: 380, left: 260 },
      { input: Buffer.from(svgOverlay), top: 0, left: 0 }
    ])
    .toFile('public/images/hero-final.png');

  console.log("Image composited successfully.");
}

processImage().catch(console.error);
