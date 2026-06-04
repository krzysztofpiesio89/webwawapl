const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, '../src/app'), (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Maps needing 'as Locale'
    const replacements = [
      { regex: /ogLocaleMap\[params\.lang\]/g, replacement: 'ogLocaleMap[params.lang as Locale]' },
      { regex: /ogLocaleMap\[lang\]/g, replacement: 'ogLocaleMap[lang as Locale]' },
      { regex: /htmlLangMap\[params\.lang\]/g, replacement: 'htmlLangMap[params.lang as Locale]' },
      { regex: /htmlLangMap\[lang\]/g, replacement: 'htmlLangMap[lang as Locale]' }
    ];

    replacements.forEach(({regex, replacement}) => {
      if (regex.test(content) && !content.includes(replacement)) {
        content = content.replace(regex, replacement);
        changed = true;
      }
    });

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Patched maps in', filePath);
    }
  }
});
