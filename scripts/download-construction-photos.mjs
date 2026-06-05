import fs from 'fs';
import path from 'path';
import https from 'https';

const constructionDir = path.join(process.cwd(), 'public', 'images', 'industries', 'construction');

if (!fs.existsSync(constructionDir)) {
  fs.mkdirSync(constructionDir, { recursive: true });
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
    url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(constructionDir, 'main.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(constructionDir, 'generalBuilder.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(constructionDir, 'renovator.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(constructionDir, 'electrician.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(constructionDir, 'plumber.png')
  },
  {
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&h=630&q=80',
    dest: path.join(constructionDir, 'interiorFinisher.png')
  }
];

async function run() {
  console.log("Downloading premium real photography assets for Construction industry...");
  
  for (const img of images) {
    console.log(`Downloading ${path.basename(img.dest)}...`);
    try {
      await downloadFile(img.url, img.dest);
      console.log(`Success -> saved to ${img.dest}`);
    } catch (err) {
      console.error(`Error downloading ${img.dest}:`, err.message);
    }
  }
  
  console.log("All construction photos downloaded successfully!");
}

run();
