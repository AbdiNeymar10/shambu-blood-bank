const fs = require('fs');
const path = require('path');

const dirs = ['about', 'availability', 'become-a-donor', 'blog', 'campaigns', 'contact', 'donate', 'request', 'page.tsx'];
const target = path.join(__dirname, 'app', '(public)');

if (!fs.existsSync(target)) {
  fs.mkdirSync(target, { recursive: true });
}

for (const dir of dirs) {
  const source = path.join(__dirname, 'app', dir);
  const dest = path.join(target, dir);
  try {
    fs.renameSync(source, dest);
    console.log(`Moved ${dir}`);
  } catch (err) {
    console.error(`Failed to move ${dir}:`, err);
  }
}
