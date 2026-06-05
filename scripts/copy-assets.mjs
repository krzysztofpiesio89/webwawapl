import fs from 'fs';
import path from 'path';

const sourceDir = `C:\\Users\\Wiktoria\\.gemini\\antigravity-ide\\brain\\e117e2fa-6833-49c1-9249-2f157315afff`;
const targetDir = path.join(process.cwd(), 'public', 'images', 'industries', 'doctor');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const mappings = {
  'doctor_main_1780606263446.png': 'main.png',
  'doctor_psychiatrist_1780606276978.png': 'psychiatrist.png',
  'doctor_gynecologist_1780606291672.png': 'gynecologist.png',
  'doctor_dentist_1780606305594.png': 'dentist.png',
  'doctor_veterinarian_1780606319511.png': 'veterinarian.png'
};

console.log("Copying images from brain directory to target directory...");
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

