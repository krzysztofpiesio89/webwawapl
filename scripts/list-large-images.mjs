import fs from 'fs';
import path from 'path';

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
      if (['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) {
        if (stat.size > limitBytes) {
          results.push({
            path: path.relative(process.cwd(), fullPath),
            sizeKB: (stat.size / 1024).toFixed(2),
            bytes: stat.size
          });
        }
      }
    }
  }
  return results;
}

const largeImages = scanDir(publicDir);
console.log(JSON.stringify(largeImages, null, 2));
