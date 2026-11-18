const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

function deploy() {
  const distDir = path.resolve(__dirname, '..', 'frontend', 'dist');
  if (!fs.existsSync(distDir) || !fs.existsSync(path.join(distDir, 'index.html'))) {
    console.error('Error: frontend/dist does not exist or index.html missing. Run npm run build first.');
    process.exit(1);
  }

  // Ensure 404.html exists for GitHub Pages SPA routing
  fs.copyFileSync(path.join(distDir, 'index.html'), path.join(distDir, '404.html'));
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'homesetu-ghpages-'));
  console.log('Copying dist files to temp directory:', tempDir);
  
  // Recursive copy
  fs.cpSync(distDir, tempDir, { recursive: true });

  const run = (cmd) => {
    console.log('> ' + cmd);
    return execSync(cmd, { cwd: tempDir, stdio: 'inherit' });
  };

  try {
    run('git init');
    run('git checkout -b gh-pages');
    run('git config user.name "Aryan"');
    run('git config user.email "aryanguptaji686@gmail.com"');
    run('git add -A');
    run('git commit -m "deploy: update GitHub Pages with latest frontend build"');
    run('git remote add origin https://github.com/aryangupta42/homesetu.git');
    run('git push origin gh-pages --force');
    console.log('✅ Successfully deployed frontend/dist to gh-pages branch!');
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore cleanup error
    }
  }
}

deploy();
