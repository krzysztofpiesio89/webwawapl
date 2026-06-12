import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basePath = path.join(__dirname, '../src/app', '[lang]', 'industries', '[city]');

console.log('Starting directory renaming...');
console.log('Base path:', basePath);

// 1. Rename [brand] to [industry]
const oldBrandPath = path.join(basePath, '[brand]');
const newIndustryPath = path.join(basePath, '[industry]');

if (fs.existsSync(oldBrandPath)) {
  fs.renameSync(oldBrandPath, newIndustryPath);
  console.log('✓ Renamed [brand] to [industry]');
} else {
  console.log('ℹ [brand] directory already renamed or not found.');
}

// 2. Rename [model] to [profession] inside [industry]
const targetIndustryPath = fs.existsSync(newIndustryPath) ? newIndustryPath : oldBrandPath;
const oldModelPath = path.join(targetIndustryPath, '[model]');
const newProfessionPath = path.join(targetIndustryPath, '[profession]');

if (fs.existsSync(oldModelPath)) {
  fs.renameSync(oldModelPath, newProfessionPath);
  console.log('✓ Renamed [model] to [profession]');
} else {
  console.log('ℹ [model] directory already renamed or not found.');
}

// 3. Rename [series] to [service] inside [profession]
const targetProfessionPath = fs.existsSync(newProfessionPath) ? newProfessionPath : oldModelPath;
const oldSeriesPath = path.join(targetProfessionPath, '[series]');
const newServicePath = path.join(targetProfessionPath, '[service]');

if (fs.existsSync(oldSeriesPath)) {
  fs.renameSync(oldSeriesPath, newServicePath);
  console.log('✓ Renamed [series] to [service]');
} else {
  console.log('ℹ [series] directory already renamed or not found.');
}

console.log('Renaming process finished!');
