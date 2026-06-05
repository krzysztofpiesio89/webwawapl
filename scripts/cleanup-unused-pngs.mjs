import fs from 'fs';
import path from 'path';

const dirs = [
  path.join(process.cwd(), 'public', 'images', 'industries', 'architect'),
  path.join(process.cwd(), 'public', 'images', 'industries', 'accountant')
];

console.log("Cleaning up copied lawyer PNG files from architect and accountant directories...");

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      if (file.endsWith('.png')) {
        const filePath = path.join(dir, file);
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted: ${filePath}`);
        } catch (err) {
          console.error(`Error deleting ${filePath}:`, err.message);
        }
      }
    });
  }
});

console.log("Cleanup completed!");
