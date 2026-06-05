import fs from 'fs';
import path from 'path';

const doctorJsonPath = path.join(process.cwd(), 'data', 'industries', 'doctor.json');
const targetDir = path.join(process.cwd(), 'data', 'industries', 'doctor');

const industryNames = {
  pl: "Lekarz",
  en: "Doctor",
  de: "Arzt",
  uk: "Лікар",
  ru: "Врач",
  zh: "医生"
};

const heroSubtitles = {
  pl: "Dedykowane rozwiązania internetowe, aplikacje medyczne PWA i pozycjonowanie lokalne dla gabinetów lekarskich.",
  en: "Custom websites, PWA medical applications, and local SEO for doctors and medical clinics.",
  de: "Maßgeschneiderte Websites, medizinische PWA-Anwendungen und lokales SEO für Ärzte und Kliniken.",
  uk: "Сучасні сайти, медичні PWA-додатки та локальне SEO для лікарів та приватних кабінетів.",
  ru: "Современные сайты, медицинские PWA-приложения и локальное SEO для врачей и клиник.",
  zh: "为医生 and 诊所量身定制的网站、PWA 医疗应用及本地 SEO 优化。"
};

if (!fs.existsSync(doctorJsonPath)) {
  console.error("doctor.json not found!");
  process.exit(1);
}

const doctorData = JSON.parse(fs.readFileSync(doctorJsonPath, 'utf8'));

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. Split professions (models)
const modelsData = {};
const locales = Object.keys(doctorData.translations);

for (const locale of locales) {
  const trans = doctorData.translations[locale];
  if (trans.models) {
    for (const [profId, profData] of Object.entries(trans.models)) {
      if (!modelsData[profId]) {
        modelsData[profId] = {};
      }
      modelsData[profId][locale] = profData;
    }
  }
}

// Write each profession JSON
for (const [profId, profContent] of Object.entries(modelsData)) {
  const profPath = path.join(targetDir, `${profId}.json`);
  fs.writeFileSync(profPath, JSON.stringify(profContent, null, 2), 'utf8');
  console.log(`Created ${profPath}`);
}

// 2. Build main.json
const mainData = {
  id: doctorData.id,
  slugs: doctorData.slugs,
  translations: {}
};

for (const locale of locales) {
  const trans = doctorData.translations[locale];
  mainData.translations[locale] = {
    industryName: industryNames[locale] || "",
    heroSubtitle: heroSubtitles[locale] || "",
    title: trans.title,
    description: trans.description,
    about: trans.about,
    series: trans.series
  };
}

const mainPath = path.join(targetDir, 'main.json');
fs.writeFileSync(mainPath, JSON.stringify(mainData, null, 2), 'utf8');
console.log(`Created ${mainPath}`);

// 3. Remove original doctor.json
fs.unlinkSync(doctorJsonPath);
console.log(`Removed old ${doctorJsonPath}`);

console.log("Splitting finished successfully!");
