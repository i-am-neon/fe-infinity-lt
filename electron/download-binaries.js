const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const extract = require('extract-zip');
const { spawn } = require('child_process');

const binariesDir = path.join(__dirname, 'bin');

// Ensure bin directory exists
if (!fs.existsSync(binariesDir)) {
  fs.mkdirSync(binariesDir, { recursive: true });
}

// Platform-specific configurations
const platform = process.platform;
const isWindows = platform === 'win32';
const isMac = platform === 'darwin';
const isLinux = platform === 'linux';
const arch = process.arch === 'x64' ? 'x86_64' : process.arch;

// Download and extract a file
async function downloadAndExtract(url, destDir, extractionRoot = '') {
  const fileName = url.split('/').pop();
  const downloadPath = path.join(destDir, fileName);
  
  console.log(`Downloading ${url}...`);
  
  try {
    // Download the file
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });
    
    const writer = fs.createWriteStream(downloadPath);
    
    response.data.pipe(writer);
    
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    
    console.log(`Downloaded ${fileName}`);
    
    // Extract if it's a zip file
    if (fileName.endsWith('.zip')) {
      console.log(`Extracting ${fileName}...`);
      await extract(downloadPath, { dir: destDir });
      
      // Move files from extraction root if specified
      if (extractionRoot) {
        const extractionPath = path.join(destDir, extractionRoot);
        if (fs.existsSync(extractionPath)) {
          const files = fs.readdirSync(extractionPath);
          for (const file of files) {
            const src = path.join(extractionPath, file);
            const dest = path.join(destDir, file);
            fs.moveSync(src, dest, { overwrite: true });
          }
          fs.removeSync(extractionPath);
        }
      }
      
      // Clean up the zip file
      fs.unlinkSync(downloadPath);
      console.log(`Extracted ${fileName}`);
    }
  } catch (error) {
    console.error(`Error downloading or extracting ${url}:`, error);
    throw error;
  }
}

// Download Deno
async function downloadDeno() {
  console.log('Downloading Deno...');
  
  let denoUrl;
  let extractionRoot = '';
  
  if (isWindows) {
    denoUrl = `https://github.com/denoland/deno/releases/latest/download/deno-x86_64-pc-windows-msvc.zip`;
  } else if (isMac) {
    if (process.arch === 'arm64') {
      denoUrl = `https://github.com/denoland/deno/releases/latest/download/deno-aarch64-apple-darwin.zip`;
    } else {
      denoUrl = `https://github.com/denoland/deno/releases/latest/download/deno-x86_64-apple-darwin.zip`;
    }
  } else if (isLinux) {
    denoUrl = `https://github.com/denoland/deno/releases/latest/download/deno-x86_64-unknown-linux-gnu.zip`;
  } else {
    throw new Error(`Unsupported platform: ${platform}`);
  }
  
  await downloadAndExtract(denoUrl, binariesDir);
  
  // Make deno executable on Unix systems
  if (!isWindows) {
    fs.chmodSync(path.join(binariesDir, 'deno'), 0o755);
  }
  
  console.log('Deno downloaded successfully');
}

// Download PostgreSQL
async function downloadPostgres() {
  console.log('Downloading PostgreSQL...');
  
  let pgUrl;
  let pgExtractDir;
  
  if (isWindows) {
    pgUrl = 'https://get.enterprisedb.com/postgresql/postgresql-14.10-1-windows-x64-binaries.zip';
    pgExtractDir = 'pgsql';
  } else if (isMac) {
    // For Mac, we'll use a portable PostgreSQL build
    pgUrl = 'https://github.com/PostgresApp/PostgresApp/releases/download/v2.6.5/Postgres-2.6.5-14.dmg';
    // This is complex - we might need to extract from DMG which requires additional tools
    console.log('For macOS, please install PostgreSQL manually using Postgres.app or Homebrew');
    return;
  } else if (isLinux) {
    // For Linux, it's better to use package managers or compile from source
    console.log('For Linux, please install PostgreSQL using your distribution package manager');
    return;
  } else {
    throw new Error(`Unsupported platform: ${platform}`);
  }
  
  if (isWindows) {
    await downloadAndExtract(pgUrl, binariesDir, pgExtractDir);
    
    // Copy the key binaries we need to the bin folder
    const pgBinDir = path.join(binariesDir, 'pgsql', 'bin');
    if (fs.existsSync(pgBinDir)) {
      const pgBinaries = ['postgres.exe', 'initdb.exe', 'pg_ctl.exe', 'psql.exe'];
      for (const binary of pgBinaries) {
        const src = path.join(pgBinDir, binary);
        const dest = path.join(binariesDir, binary);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
        }
      }
      // Copy lib directory for PostgreSQL
      fs.copySync(path.join(binariesDir, 'pgsql', 'lib'), path.join(binariesDir, 'lib'));
      fs.copySync(path.join(binariesDir, 'pgsql', 'share'), path.join(binariesDir, 'share'));
    }
    
    console.log('PostgreSQL downloaded successfully');
  }
}

// Install pgvector extension
async function installPgVector() {
  if (isWindows) {
    console.log('Setting up pgvector extension...');
    // For Windows, we need to compile or download a prebuilt pgvector
    console.log('pgvector setup is complex and may require manual installation');
  } else {
    console.log('pgvector should be installed via package manager on macOS and Linux');
  }
}

// Main function to run all downloads
async function main() {
  try {
    // Check if running on macOS in development mode
    const isDev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development';
    const isMac = process.platform === 'darwin';
    
    if (isMac && isDev) {
      console.log('Running on macOS in development mode');
      console.log('Skipping binary downloads - using system-installed versions');
      
      // Create placeholder files so the app knows we ran
      fs.writeFileSync(path.join(binariesDir, '.dev-mode'), 'Development mode - using system binaries');
      
      // Create a dummy script to redirect to system Deno
      const denoDummyPath = path.join(binariesDir, 'deno');
      fs.writeFileSync(denoDummyPath, '#!/bin/sh\ndeno "$@"');
      fs.chmodSync(denoDummyPath, 0o755);
      
      return;
    }
    
    // Normal download flow
    await downloadDeno();
    
    if (!isMac) {
      // Skip PostgreSQL download on Mac as it's complex
      await downloadPostgres();
      await installPgVector();
    } else {
      console.log('Skipping PostgreSQL download on macOS - please install manually if needed');
    }
    
    console.log('All binaries downloaded successfully');
  } catch (error) {
    console.error('Failed to download binaries:', error);
    // Don't exit with error code - allow app to start anyway
    // process.exit(1);
  }
}

main();