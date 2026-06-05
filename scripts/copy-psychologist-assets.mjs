import fs from 'fs';
import path from 'path';

const sourceDir = `C:\\Users\\Wiktoria\\.gemini\\antigravity-ide\\brain\\a2c284e2-e3e1-4980-a5bd-e84f83f50bf5`;
const targetDir = path.join(process.cwd(), 'public', 'images', 'industries', 'psychologist');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const mappings = {
  'psychologist_main_1780614168320.png': 'main.png',
  'psychologist_general_1780614183960.png': 'psychologist.png',
  'psychotherapist_main_1780614196793.png': 'psychotherapist.png',
  'child_psychologist_1780614208915.png': 'childPsychologist.png',
  'couple_therapist_1780614220656.png': 'coupleTherapist.png',
  // Fallback for addictionTherapist as the quota was exhausted
  'couple_therapist_1780614220656.png': 'addictionTherapist.png'
};

console.log("Copying psychologist images from brain directory to target directory...");
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
