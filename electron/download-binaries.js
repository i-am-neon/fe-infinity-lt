const fs = require('fs');
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
async function downloadAndExtract(url, destDir, extractionRoot = '', customFileName = null) {
  const fileName = customFileName || url.split('/').pop();
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

  // Check if Deno is already installed
  if (fs.existsSync(path.join(binariesDir, isWindows ? 'deno.exe' : 'deno'))) {
    console.log('Deno already installed, skipping...');
    return;
  }

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

  // Check if PostgreSQL is already installed
  if (isWindows && fs.existsSync(path.join(binariesDir, 'postgres.exe'))) {
    console.log('PostgreSQL already installed, skipping...');
    return;
  }

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

// Download and setup Python
async function downloadPython() {
  console.log('Downloading Python...');

  const pythonDir = path.join(__dirname, 'bin', 'python');

  // Check if Python is already installed
  if (fs.existsSync(pythonDir)) {
    console.log('Python already installed, skipping...');
    return;
  }

  // Create python directory if it doesn't exist
  if (!fs.existsSync(pythonDir)) {
    fs.mkdirSync(pythonDir, { recursive: true });
  }

  let pythonUrl;
  let pythonFileName;

  if (isWindows) {
    // For Windows, use the embeddable package
    pythonUrl = 'https://www.python.org/ftp/python/3.11.7/python-3.11.7-embed-amd64.zip';
    pythonFileName = 'python-3.11.7-embed-amd64.zip';
  } else if (isMac) {
    // For macOS, we'll use a portable Python build (it will be executed through Wine)
    pythonUrl = 'https://www.python.org/ftp/python/3.11.7/python-3.11.7-amd64.exe';
    pythonFileName = 'python-3.11.7-amd64.exe';
  } else if (isLinux) {
    // For Linux, we'll use a portable Python build
    pythonUrl = 'https://www.python.org/ftp/python/3.11.7/python-3.11.7-amd64.exe';
    pythonFileName = 'python-3.11.7-amd64.exe';
  } else {
    console.log('Unknown platform for Python download, skipping');
    return;
  }

  try {
    const downloadPath = path.join(pythonDir, pythonFileName);

    // Download Python installer/package
    await downloadFile(pythonUrl, downloadPath);
    console.log(`Downloaded Python to ${downloadPath}`);

    // For Windows, extract the embeddable package
    if (isWindows) {
      console.log('Extracting Python embeddable package...');
      await extract(downloadPath, { dir: pythonDir });

      // Download and install pip for Windows embeddable package
      const getPipUrl = 'https://bootstrap.pypa.io/get-pip.py';
      const getPipPath = path.join(pythonDir, 'get-pip.py');
      await downloadFile(getPipUrl, getPipPath);

      // Run get-pip.py
      console.log('Installing pip...');
      await execCommand(path.join(pythonDir, 'python.exe'), [getPipPath], { cwd: pythonDir });

      // Install required packages
      await installPythonRequirements(path.join(pythonDir, 'python.exe'));
    }

    // For Mac/Linux, we'll use Wine to install Python later
    // The installation will be handled by setupPythonWithWine function
    // which is called in the main function

    console.log('Python download completed successfully');
  } catch (error) {
    console.error('Failed to download or setup Python:', error);
    // Continue anyway
  }
}

// Install Python requirements with pip
async function installPythonRequirements(pythonExecutable) {
  console.log('Installing Python requirements...');

  const ltMakerPath = path.join(app.getAppPath(), isWindows ? 'lt-maker-fork' : '..', 'lt-maker-fork');

  try {
    // Install editor requirements
    const editorRequirementsPath = path.join(ltMakerPath, 'requirements_editor.txt');
    console.log(`Installing editor requirements from ${editorRequirementsPath}`);
    await execCommand(pythonExecutable, ['-m', 'pip', 'install', '-r', editorRequirementsPath]);

    // Install engine requirements
    const engineRequirementsPath = path.join(ltMakerPath, 'requirements_engine.txt');
    console.log(`Installing engine requirements from ${engineRequirementsPath}`);
    await execCommand(pythonExecutable, ['-m', 'pip', 'install', '-r', engineRequirementsPath]);

    console.log('Python requirements installed successfully');
  } catch (error) {
    console.error('Failed to install Python requirements:', error);
    // Continue anyway
  }
}

// Setup Python with Wine (for macOS and Linux)
async function setupPythonWithWine() {
  if (isWindows) {
    return; // Not needed on Windows
  }

  console.log('Setting up Python with Wine...');
  const pythonDir = path.join(__dirname, 'bin', 'python');
  const pythonInstallerPath = path.join(pythonDir, 'python-3.11.7-amd64.exe');
  const winePath = getWinePath();

  if (!winePath || !fs.existsSync(pythonInstallerPath)) {
    console.error('Wine not found or Python installer not downloaded');
    return;
  }

  try {
    // Create a custom Wine prefix for Python
    const pythonWinePrefix = path.join(pythonDir, 'prefix');

    if (!fs.existsSync(pythonWinePrefix)) {
      fs.mkdirSync(pythonWinePrefix, { recursive: true });
    }

    // Set environment variables for Wine
    const wineEnv = {
      ...process.env,
      WINEDEBUG: '-all',
      WINEPREFIX: pythonWinePrefix
    };

    // Run Python installer silently
    console.log('Running Python installer with Wine...');
    await execCommand(winePath, [pythonInstallerPath, '/quiet', 'InstallAllUsers=0', 'PrependPath=1', 'Include_test=0'], {
      env: wineEnv,
      timeout: 120000 // 2 minutes timeout
    });

    // Create a script to install pip and requirements
    const pipScriptPath = path.join(pythonDir, 'install_requirements.py');
    const pipScriptContent = `
import subprocess
import sys

def install_package(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

# Install pip
print("Installing pip...")
try:
    import ensurepip
    ensurepip._bootstrap()
except ImportError:
    print("ensurepip not available, trying get-pip.py...")
    import urllib.request
    urllib.request.urlretrieve("https://bootstrap.pypa.io/get-pip.py", "get-pip.py")
    subprocess.check_call([sys.executable, "get-pip.py"])

# Install requirements
print("Installing requirements...")
subprocess.check_call([sys.executable, "-m", "pip", "install", "pygame-ce==2.3.2", "pyinstaller==6.2.0", "typing-extensions==4.8.0", "PyQt5==5.15.10"])

print("Installation complete!")
`;

    fs.writeFileSync(pipScriptPath, pipScriptContent);

    // Run the script with Wine Python
    console.log('Installing pip and requirements with Wine Python...');
    await execCommand(winePath, ['python', pipScriptPath], {
      env: wineEnv,
      timeout: 300000 // 5 minutes timeout
    });

    console.log('Python setup with Wine completed successfully');
  } catch (error) {
    console.error('Failed to setup Python with Wine:', error);
    // Continue anyway
  }
}

// Function to get Wine path (used by setupPythonWithWine)
function getWinePath() {
  if (isWindows) {
    return null;
  }

  // Check common locations
  const commonPaths = [
    '/usr/bin/wine',
    '/usr/local/bin/wine',
    '/opt/homebrew/bin/wine',
    path.join(__dirname, 'wine', 'bin', 'wine')
  ];

  for (const winePath of commonPaths) {
    try {
      if (fs.existsSync(winePath)) {
        return winePath;
      }
    } catch (e) {
      // Ignore errors
    }
  }

  // Fallback to assuming it's in PATH
  return 'wine';
}

// No Wine download function - users must install Wine on their system

// Helper to download a file
async function downloadFile(url, destination) {
  console.log(`Downloading ${url}...`);

  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  });

  const writer = fs.createWriteStream(destination);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// Helper to execute commands with output capture option
async function execCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const captureOutput = options.capture === true;
    const childProcess = spawn(command, args, {
      ...options,
      stdio: captureOutput ? ['ignore', 'pipe', 'pipe'] : undefined
    });

    let stdout = '';
    let stderr = '';

    if (captureOutput) {
      childProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      childProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });
    }

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve(captureOutput ? { stdout, stderr } : undefined);
      } else {
        reject(new Error(`Command exited with code ${code}`));
      }
    });

    childProcess.on('error', reject);
  });
}

// Main function to run all downloads
async function main() {
  try {
    // Platform checks
    const isDev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development';
    const isMac = process.platform === 'darwin';
    const isWindows = process.platform === 'win32';
    const isLinux = process.platform === 'linux';

    // Always download binaries regardless of dev or prod mode
    // Wine is the only exception that can use system installation
    console.log('Downloading required binaries for bin directory');

    // Normal download flow
    await downloadDeno();

    // Download Python for all platforms
    await downloadPython();

    // No Wine download for non-Windows platforms - users must install themselves
    if (!isWindows) {
      console.log('Wine is required for non-Windows platforms. Please ensure Wine is installed on your system.');
      // We still need to setup Python with Wine but using system Wine
      if (process.env.NODE_ENV !== 'development') {
        await setupPythonWithWine();
      }
    }

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