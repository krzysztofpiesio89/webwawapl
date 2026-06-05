import fs from 'fs';
import path from 'path';
import https from 'https';

const beautyDir = path.join(process.cwd(), 'public', 'images', 'industries', 'beauty');

if (!fs.existsSync(beautyDir)) {
  fs.mkdirSync(beautyDir, { recursive: true });
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
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(beautyDir, 'main.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(beautyDir, 'beautician.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(beautyDir, 'hairdresser.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(beautyDir, 'cosmetologist.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(beautyDir, 'masseur.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(beautyDir, 'personalTrainer.png')
  }
];

async function run() {
  console.log("Downloading premium real photography assets for Beauty & Health industry...");
  
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
  
  console.log("All beauty photos downloaded successfully!");
}

run();
