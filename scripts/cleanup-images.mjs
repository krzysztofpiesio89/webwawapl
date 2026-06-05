import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicImagesDir = path.join(__dirname, '..', 'public', 'images');
const galleryDir = path.join(publicImagesDir, 'gallery');

const filesToDelete = [
  'inspection.png',
  'logo.png',
  'logo_new.png',
  'office.png',
  'og-share.png',
  'skupautwawa.webp',
  'tow-truck.png',
  'transaction.png',
  'user-logo.png'
];

console.log('Rozpoczynanie usuwania starych grafik motoryzacyjnych...');

// 1. Usuwanie plików z public/images
filesToDelete.forEach(file => {
  const filePath = path.join(publicImagesDir, file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`Usunięto: ${file}`);
    } catch (err) {
      console.error(`Błąd podczas usuwania ${file}:`, err.message);
    }
  } else {
    console.log(`Nie znaleziono pliku: ${file}`);
  }
});

// 2. Czyszczenie katalogu gallery
if (fs.existsSync(galleryDir)) {
  try {
    const galleryFiles = fs.readdirSync(galleryDir);
    galleryFiles.forEach(file => {
      const filePath = path.join(galleryDir, file);
      fs.unlinkSync(filePath);
      console.log(`Usunięto z galerii: ${file}`);
    });
  } catch (err) {
    console.error('Błąd podczas czyszczenia galerii:', err.message);
  }
} else {
  console.log('Katalog galerii nie istnieje.');
}

console.log('Czyszczenie grafik zakończone!');
