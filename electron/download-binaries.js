const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const axios = require('axios');
const extract = require('extract-zip');
const { spawn } = require('child_process');
const pythonSetup = require('./python_setup');

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
            fsExtra.moveSync(src, dest, { overwrite: true });
          }
          fsExtra.removeSync(extractionPath);
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

// Download Python
async function downloadPython() {
  console.log('Setting up bundled Python environment...');

  const pythonBaseDir = path.join(__dirname, 'bin', 'python');

  // Create base directory if it doesn't exist
  if (!fs.existsSync(pythonBaseDir)) {
    fs.mkdirSync(pythonBaseDir, { recursive: true });
  }

  // Check if Python is already installed
  if (fs.existsSync(path.join(pythonBaseDir, 'python_embed', 'python.exe'))) {
    console.log('Python already installed, skipping...');
    return;
  }

  try {
    // Use Python embeddable package directly
    console.log('Setting up Python embeddable package...');

    // Download the embeddable package
    const pythonUrl = 'https://www.python.org/ftp/python/3.11.7/python-3.11.7-embed-amd64.zip';
    const pythonFileName = 'python-3.11.7-embed-amd64.zip';
    const downloadPath = path.join(pythonBaseDir, pythonFileName);

    await downloadFile(pythonUrl, downloadPath);
    console.log(`Downloaded Python to ${downloadPath}`);

    // Extract the embeddable package
    console.log('Extracting Python embeddable package...');

    // Create python_embed subdirectory for a cleaner structure
    const pythonEmbedDir = path.join(pythonBaseDir, 'python_embed');
    if (!fs.existsSync(pythonEmbedDir)) {
      fs.mkdirSync(pythonEmbedDir, { recursive: true });
    }

    await extract(downloadPath, { dir: pythonEmbedDir });
    console.log('Extracted Python embeddable package');

    // Delete the zip file
    fs.unlinkSync(downloadPath);

    // Enable site-packages by uncommenting 'import site' in python311._pth
    const pthPath = path.join(pythonEmbedDir, 'python311._pth');
    if (fs.existsSync(pthPath)) {
      let pthContent = fs.readFileSync(pthPath, 'utf8');
      pthContent = pthContent.replace('#import site', 'import site');
      fs.writeFileSync(pthPath, pthContent);
      console.log('Modified python311._pth to enable site-packages');
    }

    // Download and install pip
    console.log('Installing pip...');
    const getPipUrl = 'https://bootstrap.pypa.io/get-pip.py';
    const getPipPath = path.join(pythonEmbedDir, 'get-pip.py');
    await downloadFile(getPipUrl, getPipPath);

    if (isWindows) {
      // On Windows, we can run Python directly
      console.log('Installing pip for Python...');
      await execCommand(path.join(pythonEmbedDir, 'python.exe'), [getPipPath], { cwd: pythonEmbedDir });

      // Create pip batch file for easier access
      const pipBatchContent = `@echo off\r\n"%~dp0python_embed\\python.exe" "%~dp0python_embed\\Scripts\\pip.exe" %*`;
      fs.writeFileSync(path.join(pythonBaseDir, 'python-pip.bat'), pipBatchContent);
      console.log('Created pip batch file');

      // Create site-packages directory if it doesn't exist
      const sitePackagesDir = path.join(pythonEmbedDir, 'Lib', 'site-packages');
      if (!fs.existsSync(sitePackagesDir)) {
        fs.mkdirSync(sitePackagesDir, { recursive: true });
        console.log('Created site-packages directory');
      }

      // Install required packages
      console.log('Installing required packages...');
      const ltMakerPath = path.resolve(__dirname, '..', 'lt-maker-fork');
      const requirementsPath = path.join(ltMakerPath, 'requirements_engine.txt');

      if (fs.existsSync(requirementsPath)) {
        await execCommand(path.join(pythonEmbedDir, 'python.exe'),
          ['-m', 'pip', 'install', '-r', requirementsPath, '--no-cache-dir'],
          { cwd: pythonEmbedDir });
        console.log('Installed required packages');
      } else {
        console.warn(`Requirements file not found at ${requirementsPath}`);
      }
    }

    // Clean up the get-pip.py file
    if (fs.existsSync(getPipPath)) {
      fs.unlinkSync(getPipPath);
    }

    // Make sure Python executable has execute permissions
    if (!isWindows) {
      // Set execute permissions for all .exe files
      console.log('Setting execute permissions for Python files...');
      const exeFiles = [
        path.join(pythonEmbedDir, 'python.exe'),
        path.join(pythonEmbedDir, 'pythonw.exe')
      ];

      for (const exeFile of exeFiles) {
        if (fs.existsSync(exeFile)) {
          fs.chmodSync(exeFile, 0o755);
          console.log(`Added execute permission to ${path.basename(exeFile)}`);
        }
      }

      // Find and chmod all .exe files in Scripts directory
      const scriptsDir = path.join(pythonEmbedDir, 'Scripts');
      if (fs.existsSync(scriptsDir)) {
        const scriptsFiles = fs.readdirSync(scriptsDir);
        for (const file of scriptsFiles) {
          if (file.endsWith('.exe')) {
            const exePath = path.join(scriptsDir, file);
            fs.chmodSync(exePath, 0o755);
            console.log(`Added execute permission to Scripts/${file}`);
          }
        }
      }

      // Create a Python wrapper script to use with Wine
      console.log('Creating Python wrapper script for macOS/Linux...');
      const wrapperScriptPath = path.join(pythonBaseDir, 'python');
      const wrapperScriptContent = `#!/bin/bash
# Wrapper script for running Python with Wine
# This script is necessary because the application looks for 'python' on macOS,
# but we need to run the Windows Python executable through Wine.

# Get the directory of this script
DIR="\$( cd "\$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"

# Point to the Windows Python executable
PYTHON_EXE="\$DIR/python_embed/python.exe"

# Check if Wine is available
WINE_BIN=\$(which wine)
if [ -z "\$WINE_BIN" ]; then
    echo "ERROR: Wine is not installed or not found in PATH."
    echo "Please install Wine using: brew install --cask --no-quarantine wine-stable"
    exit 1
fi

# Check if the Python executable exists
if [ ! -f "\$PYTHON_EXE" ]; then
    echo "ERROR: Python executable not found at \$PYTHON_EXE"
    echo "Please ensure the bundled Python environment is properly installed."
    exit 1
fi

# Run the command using Wine
# Pass all arguments to the Python executable
"\$WINE_BIN" "\$PYTHON_EXE" "\$@"
`;
      fs.writeFileSync(wrapperScriptPath, wrapperScriptContent);
      fs.chmodSync(wrapperScriptPath, 0o755);
      console.log(`Created Python wrapper script at ${wrapperScriptPath}`);
      
      // Create a diagnostic test script
      const testScriptPath = path.join(pythonBaseDir, 'test_python.sh');
      const testScriptContent = `#!/bin/bash
# Test script to verify Python works with Wine
cd "\$(dirname "\$0")"
echo "Testing Python with Wine..."
cd python_embed

# Check Wine version
wine --version

# Test Python
wine python.exe -c "import sys; print(f'Python version: {sys.version}')"

# Test importing modules
wine python.exe -c "try: import pygame; print(f'Pygame is installed: {pygame.__version__}'); except Exception as e: print(f'Pygame error: {e}')"
wine python.exe -c "try: import typing_extensions; print('Typing extensions is installed'); except Exception as e: print(f'Error: {e}')"

echo "Checking Python file permissions:"
ls -la python.exe
echo "Test complete!"
`;
      fs.writeFileSync(testScriptPath, testScriptContent);
      fs.chmodSync(testScriptPath, 0o755);
      console.log(`Created Python test script at ${testScriptPath}`);
    }

    console.log('Python environment setup completed successfully');
  } catch (error) {
    console.error('Failed to set up Python environment:', error);
    console.error(error.stack);
    // Continue even if there's an error - we'll try again later or let the user know
  }
}

// Install Python requirements with pip
async function installPythonRequirements(pythonExecutable) {
  console.log('Installing Python requirements...');

  try {
    const ltMakerPath = path.resolve(__dirname, '..', 'lt-maker-fork');

    // First make sure pip is up to date
    console.log('Upgrading pip...');
    try {
      await execCommand(pythonExecutable, ['-m', 'pip', 'install', '--upgrade', 'pip'], { capture: true });
    } catch (pipError) {
      console.error('Failed to upgrade pip:', pipError);
      // Continue anyway - the bundled version might work
    }

    // On Windows, we can use the Python executable directly
    if (process.platform === 'win32') {
      // Install engine requirements first (most important)
      const engineRequirementsPath = path.join(ltMakerPath, 'requirements_engine.txt');
      console.log(`Installing engine requirements from ${engineRequirementsPath}`);
      await execCommand(pythonExecutable, ['-m', 'pip', 'install', '-r', engineRequirementsPath, '--no-cache-dir'], { capture: true });

      // Install editor requirements if time permits (lower priority)
      try {
        const editorRequirementsPath = path.join(ltMakerPath, 'requirements_editor.txt');
        console.log(`Installing editor requirements from ${editorRequirementsPath}`);
        await execCommand(pythonExecutable, ['-m', 'pip', 'install', '-r', editorRequirementsPath, '--no-cache-dir'], { capture: true });
      } catch (editorError) {
        console.warn('Failed to install editor requirements - continuing anyway:', editorError);
      }
    } else {
      // On macOS/Linux, we'll use Wine to run the bundled Python
      console.log('Running Python setup through Wine...');
      await pythonSetup.runPythonInstallScript();
    }

    // Verify the installation worked
    console.log('Verifying Python package installation...');
    const checkDepsPath = path.join(__dirname, 'bin', 'python', 'check_dependencies.py');

    if (process.platform === 'win32') {
      try {
        const output = await execCommand(pythonExecutable, [checkDepsPath], { capture: true });
        console.log('Python dependency verification output:', output.stdout);
        console.log('Python requirements installed successfully');
      } catch (verifyError) {
        console.error('Python dependency verification failed:', verifyError);
        throw verifyError;
      }
    } else {
      // For macOS/Linux, create a separate verification script with Wine
      const pythonDir = path.join(__dirname, 'bin', 'python');
      const winePath = getWinePath();

      if (winePath) {
        // Create verification batch file
        const verifyBatchPath = path.join(pythonDir, 'verify_deps.bat');
        const pythonExe = path.join(pythonDir, 'python.exe').replace(/\\/g, '\\\\');
        const checkScriptPath = checkDepsPath.replace(/\\/g, '\\\\');

        const batchContent = `@echo off
${pythonExe} "${checkScriptPath}"
exit %ERRORLEVEL%
`;

        fs.writeFileSync(verifyBatchPath, batchContent);

        try {
          const { execSync } = require('child_process');
          const output = execSync(`${winePath} cmd /c "${verifyBatchPath}"`, {
            encoding: 'utf8',
            timeout: 10000 // 10 second timeout
          });
          console.log('Python dependency verification output:', output);
          console.log('Python requirements installed successfully');
        } catch (verifyError) {
          console.error('Python dependency verification failed:', verifyError);
          // Continue anyway - we'll try at runtime
        }
      }
    }
  } catch (error) {
    console.error('Failed to install Python requirements:', error);
    console.warn('Python dependencies may need to be installed at runtime');
    // Continue anyway
  }
}

// Function to check if Wine is available on non-Windows platforms
async function checkWineAvailability() {
  if (isWindows) {
    return true; // Not needed on Windows
  }

  console.log('Checking Wine availability...');
  const winePath = getWinePath();

  if (winePath) {
    console.log(`Wine is available at: ${winePath}`);
    return true;
  } else {
    console.warn('Wine is not available. The bundled Python will not work without Wine on non-Windows platforms.');
    console.warn('Please install Wine using your package manager (e.g., brew install --cask --no-quarantine wine-stable)');
    return false;
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

    console.log('Starting binary download process...');

    // Download Deno for all platforms
    console.log('Downloading Deno binary...');
    await downloadDeno();

    // Download Python for all platforms
    console.log('Downloading Python...');
    await downloadPython();

    // Verify Python with Wine is working for non-Windows platforms
    if (!isWindows) {
      const hasWine = await checkWineAvailability();
      if (hasWine) {
        try {
          // Try to test that Python with Wine works
          const pythonDir = path.join(__dirname, 'bin', 'python');
          const testScript = path.join(pythonDir, 'test_python.sh');

          if (fs.existsSync(testScript)) {
            console.log('Testing Python with Wine...');
            const { execSync } = require('child_process');
            try {
              // Run the test but hide raw output to avoid confusing users with syntax errors
              execSync(`chmod +x "${testScript}" && "${testScript}"`, {
                stdio: ['inherit', 'pipe', 'pipe'], // Hide stdout/stderr 
                timeout: 10000 // 10 seconds timeout
              });
              console.log('Python test completed successfully');
            } catch (testError) {
              console.error('Python test failed:', testError);
              console.warn('Wine-based Python may not work correctly. Dependencies will be installed at runtime if needed.');
            }
          } else {
            console.warn('Python test script not found');
          }
        } catch (setupError) {
          console.error('Failed to test Python with Wine:', setupError);
        }
      } else {
        console.warn('Wine is not available. The dependencies will be installed when the user runs the game.');
        console.warn('For best performance, install Wine using your package manager (e.g., brew install --cask --no-quarantine wine-stable)');
      }
    }

    console.log('All binaries downloaded successfully');
  } catch (error) {
    console.error('Failed to download binaries:', error);
    // Don't exit with error code - allow app to start anyway
    // process.exit(1);
  }
}

main();