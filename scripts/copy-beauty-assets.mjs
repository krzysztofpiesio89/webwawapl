import fs from 'fs';
import path from 'path';

const src = "C:/Users/Wiktoria/.gemini/antigravity-ide/brain/a2c284e2-e3e1-4980-a5bd-e84f83f50bf5/beautician_treatment_1780658021402.png";
const targetDir = "d:/webwawa.pl/public/images/industries/beauty";
const target = path.join(targetDir, "beautician.png");

console.log('Rozpoczynanie kopiowania wygenerowanej grafiki AI dla Kosmetyczki...');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
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
