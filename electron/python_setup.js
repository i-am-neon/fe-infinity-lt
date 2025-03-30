/**
 * Python Setup Utilities for FE Infinity
 * 
 * This module handles Python environment setup and package installation
 * for the bundled Python in the Electron app.
 */

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

// Get the path to the project's lt-maker-fork directory
function getLtMakerPath() {
  return path.resolve(__dirname, '..', 'lt-maker-fork');
}

// Create Python installation script
function createPythonInstallScript() {
  console.log('Creating Python installation script...');
  
  const pythonDir = path.join(__dirname, 'bin', 'python');
  const installScriptPath = path.join(pythonDir, 'install_dependencies.py');
  
  // Create a Python script to install requirements
  const scriptContent = `#!/usr/bin/env python
"""
install_dependencies.py - Ensures required Python packages are installed for LT-Maker

This script checks for and installs pip and the required packages
from the requirements files in the lt-maker-fork directory. It should
be run during application setup and before running any LT-Maker Python code.
"""

import os
import sys
import subprocess
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('install_dependencies')

def ensure_pip_installed():
    """Ensures pip is installed in the bundled Python."""
    logger.info("Checking for pip installation...")
    
    try:
        # Try importing pip to check if it's installed
        import pip
        logger.info(f"pip is already installed (version {pip.__version__})")
        return True
    except ImportError:
        logger.info("pip not found, installing it...")
        
        # Get the directory where this script is located
        script_dir = os.path.dirname(os.path.abspath(__file__))
        get_pip_path = os.path.join(script_dir, "get-pip.py")
        
        if not os.path.exists(get_pip_path):
            logger.error(f"get-pip.py not found at {get_pip_path}")
            return False
        
        try:
            # Run get-pip.py to install pip
            subprocess.check_call([sys.executable, get_pip_path])
            logger.info("pip installed successfully")
            
            # Ensure pip is in the correct site-packages by modifying python311._pth
            pth_path = os.path.join(script_dir, "python311._pth")
            if os.path.exists(pth_path):
                with open(pth_path, 'r') as f:
                    content = f.read()
                
                if '#import site' in content:
                    content = content.replace('#import site', 'import site')
                    with open(pth_path, 'w') as f:
                        f.write(content)
                    logger.info("Enabled site-packages in python311._pth")
            
            # Verify pip is now available
            try:
                import pip
                logger.info(f"Verified pip installation (version {pip.__version__})")
                return True
            except ImportError:
                logger.error("pip still not available after installation")
                return False
                
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to install pip: {e}")
            return False

def find_lt_maker_path():
    """Find the lt-maker-fork directory."""
    # Start with the possible locations
    if hasattr(sys, '_MEIPASS'):  # For PyInstaller
        base_dir = sys._MEIPASS
    else:
        base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Look for lt-maker-fork in various locations
    possible_locations = [
        # Relative to this script in development
        os.path.abspath(os.path.join(base_dir, "..", "..", "..", "lt-maker-fork")),
        # In electron app directory
        os.path.abspath(os.path.join(base_dir, "..", "..", "lt-maker-fork")),
        # In packaged app Resources
        os.path.abspath(os.path.join(base_dir, "..", "..", "..", "Resources", "lt-maker-fork")),
    ]
    
    # Try to find lt-maker-fork directory
    for location in possible_locations:
        if os.path.exists(location) and os.path.isdir(location):
            logger.info(f"Found lt-maker-fork at: {location}")
            return location
    
    # Check Windows path format through Wine if on macOS/Linux
    if sys.platform in ("darwin", "linux"):
        for location in possible_locations:
            win_path = location.replace("/", "\\\\")
            if os.path.exists(win_path) and os.path.isdir(win_path):
                logger.info(f"Found lt-maker-fork at Windows path: {win_path}")
                return win_path
    
    logger.error("Could not find lt-maker-fork directory")
    return None

def install_requirements(lt_maker_path):
    """Install packages from requirements_engine.txt."""
    requirements_file = os.path.join(lt_maker_path, "requirements_engine.txt")
    
    if not os.path.exists(requirements_file):
        logger.error(f"Requirements file not found: {requirements_file}")
        return False
    
    logger.info(f"Installing packages from {requirements_file}")
    
    try:
        # Make sure pip module is available directly in site-packages
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "--upgrade", "pip"
        ])
        
        # Install the requirements with --no-cache-dir to ensure fresh installation
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "-r", requirements_file, "--no-cache-dir"
        ])
        
        logger.info("Requirements installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"Failed to install requirements: {e}")
        return False

def verify_installations():
    """Verify that critical packages are installed."""
    required_packages = ['pygame', 'typing_extensions']
    all_installed = True
    
    for package in required_packages:
        try:
            # Try to import the module without actually importing it
            # This uses a more reliable approach than __import__
            import importlib.util
            spec = importlib.util.find_spec(package)
            if spec is None:
                logger.error(f"{package} is NOT installed")
                all_installed = False
            else:
                # Get package version if available
                try:
                    module = importlib.import_module(package)
                    version = getattr(module, '__version__', 'unknown version')
                    logger.info(f"{package} is installed ({version})")
                except ImportError:
                    logger.info(f"{package} is installed (version unknown)")
        except ImportError:
            # Fallback for older Python versions
            try:
                __import__(package)
                logger.info(f"{package} is installed (version check not available)")
            except ImportError:
                logger.error(f"{package} is NOT installed")
                all_installed = False
    
    return all_installed

def main():
    """Main function to set up Python packages."""
    logger.info(f"Setting up Python packages for LT-Maker (Python {sys.version})")
    
    # Make sure pip is installed
    if not ensure_pip_installed():
        logger.error("Failed to ensure pip is installed")
        return False
    
    # Find the lt-maker-fork directory
    lt_maker_path = find_lt_maker_path()
    if not lt_maker_path:
        logger.error("Could not find lt-maker-fork directory, cannot install requirements")
        return False
    
    # Install required packages from requirements_engine.txt
    if not install_requirements(lt_maker_path):
        logger.error("Failed to install required packages")
        return False
    
    # Verify that critical packages are installed
    if not verify_installations():
        logger.warning("Not all required packages are installed properly")
        return False
    
    logger.info("All required packages installed successfully")
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
`;

  // Write the script to file
  fs.writeFileSync(installScriptPath, scriptContent);
  console.log(`Created Python installation script at ${installScriptPath}`);
  
  // Make it executable on Unix systems
  if (process.platform !== 'win32') {
    try {
      fs.chmodSync(installScriptPath, 0o755);
    } catch (error) {
      console.error('Failed to make script executable:', error);
    }
  }
  
  return installScriptPath;
}

// Run the Python installation script for the appropriate platform
async function runPythonInstallScript() {
  console.log('Running Python dependency installation script...');
  
  const pythonDir = path.join(__dirname, 'bin', 'python');
  const installScriptPath = path.join(pythonDir, 'install_dependencies.py');
  
  if (!fs.existsSync(installScriptPath)) {
    console.error('Python installation script not found. Creating it...');
    createPythonInstallScript();
  }
  
  if (process.platform === 'win32') {
    // On Windows, execute directly
    const pythonPath = path.join(pythonDir, 'python.exe');
    
    return new Promise((resolve, reject) => {
      const process = spawn(pythonPath, [installScriptPath], {
        stdio: 'inherit' // Show output in console
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          console.log('Python dependencies installed successfully');
          resolve();
        } else {
          console.error(`Python dependency installation failed with code ${code}`);
          reject(new Error(`Installation failed with code ${code}`));
        }
      });
      
      process.on('error', (err) => {
        console.error('Failed to run Python installation script:', err);
        reject(err);
      });
    });
  } else {
    // On macOS/Linux, we need to run with Wine
    console.log('Checking Wine availability for Python setup...');
    
    // Check if Wine is available
    try {
      const wineOutput = execSync('which wine || echo "not found"', { encoding: 'utf8' }).trim();
      
      if (wineOutput === 'not found') {
        console.warn('Wine not found, cannot install Python dependencies during setup');
        console.warn('Wine is required to run the application on macOS');
        return;
      }
      
      console.log(`Found Wine at: ${wineOutput}`);
      
      // Create a batch file to run the Python script with Wine
      const batchPath = path.join(pythonDir, 'install_deps.bat');
      const pythonExe = path.join(pythonDir, 'python.exe').replace(/\\/g, '\\\\');
      const scriptPath = installScriptPath.replace(/\\/g, '\\\\');
      
      const batchContent = `@echo off
${pythonExe} "${scriptPath}"
exit %ERRORLEVEL%
`;
      
      fs.writeFileSync(batchPath, batchContent);
      
      // Create a shell script to run the batch file with Wine
      const shellPath = path.join(pythonDir, 'install_deps.sh');
      const shellContent = `#!/bin/bash
export WINEDEBUG=-all
wine cmd /c "${batchPath.replace(/\\/g, '/')}"
exit $?
`;
      
      fs.writeFileSync(shellPath, shellContent);
      fs.chmodSync(shellPath, 0o755);
      
      console.log('Created Wine installation wrapper scripts');
      
      // Run the shell script
      return new Promise((resolve, reject) => {
        console.log('Running Python dependency installation with Wine...');
        console.log('This may take a while, especially on first run');
        
        const process = spawn('/bin/bash', [shellPath], {
          stdio: 'inherit' // Show output in console
        });
        
        process.on('close', (code) => {
          if (code === 0) {
            console.log('Python dependencies installed successfully with Wine');
            resolve();
          } else {
            console.warn(`Python dependency installation failed with code ${code}`);
            console.warn('Please ensure Wine is properly installed and configured');
            resolve(); // Resolve anyway to continue
          }
        });
        
        process.on('error', (err) => {
          console.error('Failed to run Python installation with Wine:', err);
          console.warn('Please ensure Wine is properly installed and configured');
          resolve(); // Resolve anyway to continue
        });
      });
    } catch (error) {
      console.error('Error checking Wine availability:', error);
      console.warn('Wine is required to run the application on macOS');
    }
  }
}

module.exports = {
  createPythonInstallScript,
  runPythonInstallScript
};