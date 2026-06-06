import fs from 'fs';
import path from 'path';

const mapping = [
  {
    src: 'C:\\Users\\Wiktoria\\.gemini\\antigravity-ide\\brain\\5e8c25c2-df4b-407b-ad9d-0040f13e8a51\\gastronomy_main_1780690861558.png',
    dest: 'main.png'
  },
  {
    src: 'C:\\Users\\Wiktoria\\.gemini\\antigravity-ide\\brain\\5e8c25c2-df4b-407b-ad9d-0040f13e8a51\\gastronomy_restaurant_1780690873725.png',
    dest: 'restaurant.png'
  },
  {
    src: 'C:\\Users\\Wiktoria\\.gemini\\antigravity-ide\\brain\\5e8c25c2-df4b-407b-ad9d-0040f13e8a51\\gastronomy_diet_catering_1780690887135.png',
    dest: 'dietCatering.png'
  },
  {
    src: 'C:\\Users\\Wiktoria\\.gemini\\antigravity-ide\\brain\\5e8c25c2-df4b-407b-ad9d-0040f13e8a51\\gastronomy_food_truck_1780690900456.png',
    dest: 'foodTruck.png'
  },
  {
    src: 'C:\\Users\\Wiktoria\\.gemini\\antigravity-ide\\brain\\5e8c25c2-df4b-407b-ad9d-0040f13e8a51\\gastronomy_cafe_1780690912609.png',
    dest: 'cafe.png'
  },
  {
    src: 'C:\\Users\\Wiktoria\\.gemini\\antigravity-ide\\brain\\5e8c25c2-df4b-407b-ad9d-0040f13e8a51\\gastronomy_catering_company_1780690924509.png',
    dest: 'cateringCompany.png'
  }
];

const destDir = path.join(process.cwd(), 'public', 'images', 'industries', 'gastronomy');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`Created directory: ${destDir}`);
}

mapping.forEach(item => {
  const targetPath = path.join(destDir, item.dest);
  if (fs.existsSync(item.src)) {
    fs.copyFileSync(item.src, targetPath);
    console.log(`Copied: ${path.basename(item.src)} -> public/images/industries/gastronomy/${item.dest}`);
  } else {
    console.error(`Source file not found: ${item.src}`);
  }
});
