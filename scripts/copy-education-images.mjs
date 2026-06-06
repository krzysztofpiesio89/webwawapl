import fs from 'fs';
import path from 'path';

const src = "C:/Users/Wiktoria/.gemini/antigravity-ide/brain/f2e56fef-1dfd-48a6-94aa-65cc4f4a7438/education_main_1780773839567.png";
const targetDir = "d:/webwawa.pl/public/images/industries/education";
const target = path.join(targetDir, "main.png");

console.log('Rozpoczynanie kopiowania wygenerowanej grafiki AI dla branży edukacji...');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Utworzono katalog: ${targetDir}`);
}

try {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, target);
    console.log(`Skopiowano: ${src} -> ${target}`);
    console.log('Kopiowanie zakończone sukcesem!');
  } else {
    console.error(`Brak pliku źródłowego: ${src}`);
  }
} catch (err) {
  console.error('Błąd podczas kopiowania pliku:', err.message);
}
