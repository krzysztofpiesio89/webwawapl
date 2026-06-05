import fs from 'fs';
import path from 'path';
import https from 'https';

const automotiveDir = path.join(process.cwd(), 'public', 'images', 'industries', 'automotive');

if (!fs.existsSync(automotiveDir)) {
  fs.mkdirSync(automotiveDir, { recursive: true });
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

const images = [
  {
    url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(automotiveDir, 'main.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(automotiveDir, 'carRental.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(automotiveDir, 'leasing.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(automotiveDir, 'carBuying.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(automotiveDir, 'mechanic.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(automotiveDir, 'carParts.png')
  }
];

async function run() {
  console.log("Downloading premium real photography assets for Automotive industry...");
  
  for (const img of images) {
    if (fs.existsSync(img.dest)) {
      console.log(`File ${path.basename(img.dest)} already exists. Skipping download...`);
      continue;
    }
    console.log(`Downloading ${path.basename(img.dest)}...`);
    try {
      await downloadFile(img.url, img.dest);
      console.log(`Success -> saved to ${img.dest}`);
    } catch (err) {
      console.error(`Error downloading ${img.dest}:`, err.message);
    }
  }
  
  console.log("All automotive photos downloaded successfully!");
}

run();
