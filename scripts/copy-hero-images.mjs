import fs from 'fs';
import path from 'path';

const src1 = "C:/Users/Wiktoria/.gemini/antigravity-ide/brain/610092ea-e924-47d0-b56f-48b496a4ef7d/workspace_code_1780581629355.png";
const src2 = "C:/Users/Wiktoria/.gemini/antigravity-ide/brain/610092ea-e924-47d0-b56f-48b496a4ef7d/team_meeting_1780581646210.png";

const targetDir = "d:/webwawa.pl/public/images";
const target1 = path.join(targetDir, "workspace_code.png");
const target2 = path.join(targetDir, "team_meeting.png");

console.log('Rozpoczynanie kopiowania wygenerowanych grafik AI...');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

try {
  if (fs.existsSync(src1)) {
    fs.copyFileSync(src1, target1);
    console.log(`Skopiowano: ${src1} -> ${target1}`);
  } else {
    console.error(`Brak pliku źródłowego: ${src1}`);
  }

  if (fs.existsSync(src2)) {
    fs.copyFileSync(src2, target2);
    console.log(`Skopiowano: ${src2} -> ${target2}`);
  } else {
    console.error(`Brak pliku źródłowego: ${src2}`);
  }
  
  console.log('Kopiowanie zakończone sukcesem!');
} catch (err) {
  console.error('Błąd podczas kopiowania plików:', err.message);
}
