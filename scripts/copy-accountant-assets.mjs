import fs from 'fs';
import path from 'path';

const sourceDir = path.join(process.cwd(), 'public', 'images', 'industries', 'lawyer');
const targetDir = path.join(process.cwd(), 'public', 'images', 'industries', 'accountant');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const mappings = {
  'main.png': 'main.png',
  'adwokat.png': 'accountant.png',
  'kancelaria-prawna.png': 'accountingOffice.png',
  'notariusz.png': 'auditor.png',
  'radca-prawny.png': 'payrollSpecialist.png',
  'doradca-podatkowy.png': 'financialAdvisor.png'
};

console.log("Copying accountant placeholder images from lawyer directory...");
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
