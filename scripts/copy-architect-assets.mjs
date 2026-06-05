import fs from 'fs';
import path from 'path';

const sourceDir = path.join(process.cwd(), 'public', 'images', 'industries', 'lawyer');
const targetDir = path.join(process.cwd(), 'public', 'images', 'industries', 'architect');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const targetFiles = [
  'main.png',
  'architect.png',
  'interiorDesigner.png',
  'landscapeArchitect.png',
  'urbanPlanner.png',
  'structuralEngineer.png'
];

console.log("Copying generic architect placeholder images (using main placeholder)...");
const srcPath = path.join(sourceDir, 'main.png');
if (!fs.existsSync(srcPath)) {
  console.error(`Source placeholder main.png not found in ${sourceDir}`);
  process.exit(1);
}
for (const targetFile of targetFiles) {
  const destPath = path.join(targetDir, targetFile);
  console.log(`Copying main.png -> ${targetFile}...`);
  fs.copyFileSync(srcPath, destPath);
  console.log(`Saved -> ${destPath}`);
}
console.log("All architect placeholder images copied successfully!");
