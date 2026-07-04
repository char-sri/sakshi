const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

async function buildExe() {
  const rootDir = path.resolve(__dirname, '..');
  const standaloneDir = path.join(rootDir, '.next', 'standalone');

  console.log('1. Copying public directory...');
  await fs.copy(path.join(rootDir, 'public'), path.join(standaloneDir, 'public'));

  console.log('2. Copying .next/static directory...');
  await fs.copy(path.join(rootDir, '.next', 'static'), path.join(standaloneDir, '.next', 'static'));

  console.log('3. Copying SQLite database and schema...');
  // Ensure the Prisma schema and database are in the standalone environment if Prisma needs them at runtime.
  // We'll copy dev.db to the root of standalone where the app expects it (or inside prisma folder depending on connection string).
  // In .env, DATABASE_URL is "file:./dev.db", so it should be in the root of standalone.
  if (fs.existsSync(path.join(rootDir, 'dev.db'))) {
    await fs.copy(path.join(rootDir, 'dev.db'), path.join(standaloneDir, 'dev.db'));
  }
  
  if (fs.existsSync(path.join(rootDir, '.env'))) {
     await fs.copy(path.join(rootDir, '.env'), path.join(standaloneDir, '.env'));
  }

  console.log('4. Building executable with caxa for Windows...');
  
  try {
     const nodeExePath = path.join(standaloneDir, 'node.exe');
     if (!fs.existsSync(nodeExePath)) {
       console.log('Downloading Windows Node.js executable for cross-compilation...');
       execSync(`curl -L -o node.exe https://nodejs.org/dist/v20.12.0/win-x64/node.exe`, { stdio: 'inherit', cwd: standaloneDir });
     }

     console.log('Running caxa...');
     // We bundle the entire standaloneDir (which now includes node.exe)
     // caxa extracts it to a temp dir ({{caxa}}) and runs the command inside it.
     execSync(`npx caxa -i "${standaloneDir}" -o sakshi-app.exe -- "{{caxa}}/node.exe" "{{caxa}}/server.js"`, { stdio: 'inherit', cwd: rootDir });
     console.log('Build completed: sakshi-app.exe generated.');
  } catch (err) {
     console.error('Failed to run caxa', err);
  }
}

buildExe().catch(console.error);
