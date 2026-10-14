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
    run('git config user.name "Arsh Mittal"');
    run('git config user.email "arshmittal@bytebros.team"');
    run('git add -A');
    run('git commit -m "deploy: update gh-pages with strict role-based authentication and portal access"');
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
