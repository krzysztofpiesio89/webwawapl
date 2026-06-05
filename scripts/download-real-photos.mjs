import fs from 'fs';
import path from 'path';
import https from 'https';

const architectDir = path.join(process.cwd(), 'public', 'images', 'industries', 'architect');
const accountantDir = path.join(process.cwd(), 'public', 'images', 'industries', 'accountant');

if (!fs.existsSync(architectDir)) {
  fs.mkdirSync(architectDir, { recursive: true });
}
if (!fs.existsSync(accountantDir)) {
  fs.mkdirSync(accountantDir, { recursive: true });
}

// Function to download file supporting redirects
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    function get(targetUrl) {
      https.get(targetUrl, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          get(response.headers.location);
          return;
        }
        if (response.statusCode !== 200) {
          reject(new Error(`Status code: ${response.statusCode} for URL: ${targetUrl}`));
          return;
        }
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }).on('error', (err) => {
        if (fs.existsSync(dest)) {
          fs.unlinkSync(dest);
        }
        reject(err);
      });
    }
    get(url);
  });
}

// Cleanup existing SVGs in those directories to force fallback to downloaded PNGs
function cleanupSvgs(dir) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      if (file.endsWith('.svg')) {
        const filePath = path.join(dir, file);
        fs.unlinkSync(filePath);
        console.log(`Removed local SVG to force PNG reload: ${filePath}`);
      }
    });
  }
}

const images = [
  // Architect
  {
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(architectDir, 'main.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(architectDir, 'architect.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(architectDir, 'interiorDesigner.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1558904541-efa8c1a68f6f?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(architectDir, 'landscapeArchitect.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(architectDir, 'urbanPlanner.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(architectDir, 'structuralEngineer.png')
  },

  // Accountant
  {
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(accountantDir, 'main.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(accountantDir, 'accountant.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(accountantDir, 'accountingOffice.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(accountantDir, 'auditor.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(accountantDir, 'financialAdvisor.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(accountantDir, 'payrollSpecialist.png')
  }
];

async function run() {
  console.log("Cleaning up old SVGs...");
  cleanupSvgs(architectDir);
  cleanupSvgs(accountantDir);

  console.log("Downloading premium real photography assets from Unsplash...");
  
  for (const img of images) {
    console.log(`Downloading ${path.basename(img.dest)}...`);
    try {
      await downloadFile(img.url, img.dest);
      console.log(`Success -> saved to ${img.dest}`);
    } catch (err) {
      console.error(`Error downloading ${img.dest}:`, err.message);
    }
  }
  
  console.log("All premium photos downloaded successfully!");
}

run();
