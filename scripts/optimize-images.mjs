import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const publicDir = path.join(process.cwd(), 'public');
const limitBytes = 150 * 1024; // 150 KB

function scanDir(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath, results);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
        if (stat.size > limitBytes) {
          results.push({
            path: fullPath,
            relativePath: path.relative(process.cwd(), fullPath),
            ext,
            sizeKB: (stat.size / 1024).toFixed(2),
            bytes: stat.size
          });
        }
      }
    }
  }
  return results;
}

async function main() {
  console.log('Scanning for images > 150 KB...');
  const largeImages = scanDir(publicDir);
  console.log(`Found ${largeImages.length} images exceeding 150 KB.`);
  
  if (largeImages.length === 0) {
    console.log('All images are already under 150 KB.');
    return;
  }

  console.log('Launching headless browser via Puppeteer...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Load a blank page to execute canvas scripts
  await page.goto('about:blank');

  for (const imgInfo of largeImages) {
    console.log(`Optimizing: ${imgInfo.relativePath} (${imgInfo.sizeKB} KB)`);
    try {
      const originalBuffer = fs.readFileSync(imgInfo.path);
      const base64Data = originalBuffer.toString('base64');
      
      let mimeType = 'image/png';
      if (imgInfo.ext === '.jpg' || imgInfo.ext === '.jpeg') mimeType = 'image/jpeg';
      if (imgInfo.ext === '.webp') mimeType = 'image/webp';

      const result = await page.evaluate(async (base64, mime) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            let width = img.width;
            let height = img.height;
            const maxDim = 1200; // standard web image max width/height
            
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // We compress to image/jpeg because it has quality compression.
            // Even if the original is .png, browsers will decode JPEG perfectly.
            let quality = 0.82;
            let dataUrl = canvas.toDataURL('image/jpeg', quality);
            let approxSize = (dataUrl.length - dataUrl.indexOf(',') - 1) * 0.75;

            while (approxSize > 150 * 1024 && quality > 0.3) {
              quality -= 0.05;
              dataUrl = canvas.toDataURL('image/jpeg', quality);
              approxSize = (dataUrl.length - dataUrl.indexOf(',') - 1) * 0.75;
            }

            // If it is still too large, downscale it further to 800px max dimension
            if (approxSize > 150 * 1024) {
              const smallerMax = 800;
              let sWidth = img.width;
              let sHeight = img.height;
              if (sWidth > smallerMax || sHeight > smallerMax) {
                if (sWidth > sHeight) {
                  sHeight = Math.round((sHeight * smallerMax) / sWidth);
                  sWidth = smallerMax;
                } else {
                  sWidth = Math.round((sWidth * smallerMax) / sHeight);
                  sHeight = smallerMax;
                }
              }
              
              canvas.width = sWidth;
              canvas.height = sHeight;
              ctx.drawImage(img, 0, 0, sWidth, sHeight);

              quality = 0.75;
              dataUrl = canvas.toDataURL('image/jpeg', quality);
              approxSize = (dataUrl.length - dataUrl.indexOf(',') - 1) * 0.75;

              while (approxSize > 150 * 1024 && quality > 0.2) {
                quality -= 0.05;
                dataUrl = canvas.toDataURL('image/jpeg', quality);
                approxSize = (dataUrl.length - dataUrl.indexOf(',') - 1) * 0.75;
              }
            }

            resolve({
              dataUrl,
              width: canvas.width,
              height: canvas.height,
              size: approxSize
            });
          };
          img.onerror = (e) => reject(new Error('Failed to load image'));
          img.src = `data:${mime};base64,${base64}`;
        });
      }, base64Data, mimeType);

      const base64Clean = result.dataUrl.split(',')[1];
      const optimizedBuffer = Buffer.from(base64Clean, 'base64');
      
      fs.writeFileSync(imgInfo.path, optimizedBuffer);
      
      const newSizeKB = (optimizedBuffer.length / 1024).toFixed(2);
      console.log(`  -> SUCCESS: New size is ${newSizeKB} KB (Dimensions: ${result.width}x${result.height})`);

    } catch (err) {
      console.error(`  -> FAILED to optimize ${imgInfo.relativePath}:`, err.message);
    }
  }

  await browser.close();
  console.log('Optimization complete!');
}

main().catch(err => {
  console.error('Fatal error:', err);
});
