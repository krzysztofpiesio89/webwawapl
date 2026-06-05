import fs from 'fs';
import path from 'path';

const sourceDir = `C:\\Users\\Wiktoria\\.gemini\\antigravity-ide\\brain\\e117e2fa-6833-49c1-9249-2f157315afff`;
const targetDir = path.join(process.cwd(), 'public', 'images', 'industries', 'lawyer');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const mappings = {
  'lawyer_main_1780607577887.png': 'main.png',
  'lawyer_adwokat_1780607590051.png': 'adwokat.png',
  'lawyer_radca_prawny_1780607603639.png': 'radca-prawny.png',
  'lawyer_notariusz_1780607614653.png': 'notariusz.png',
  'lawyer_komornik_1780607624976.png': 'komornik.png',
  'lawyer_kancelaria_prawna_1780607636916.png': 'kancelaria-prawna.png',
  'lawyer_doradca_podatkowy_1780607649514.png': 'doradca-podatkowy.png'
};

console.log("Copying lawyer images from brain directory to target directory...");
for (const [sourceFile, targetFile] of Object.entries(mappings)) {
  const srcPath = path.join(sourceDir, sourceFile);
  const destPath = path.join(targetDir, targetFile);
  
  if (fs.existsSync(srcPath)) {
    console.log(`Copying ${sourceFile} -> ${targetFile}...`);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Saved -> ${destPath}`);
  } else {
    console.warn(`Source file not found: ${srcPath}`);
  }
}
console.log("Copying completed successfully!");
