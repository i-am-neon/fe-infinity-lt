# Bundled Python Setup for FE Infinity

This document outlines the process for creating a pre-packaged Python environment with all dependencies pre-installed for FE Infinity.

## Overview

Instead of trying to install Python dependencies at runtime, we'll use a portable Python environment with all necessary packages pre-installed. This environment will be bundled with the application and used directly, eliminating the need for any runtime installation.

## Requirements

- We need a portable Python environment that can be used by:
  - Windows users (using Windows Python directly)
  - macOS users (using Windows Python through Wine - **REQUIRED**)
- All dependencies must be pre-installed
- The environment must be portable and work with the Electron app structure

## Important Note for macOS

**macOS MUST use Wine to run the Windows Python environment.** We do not support using native macOS Python. 
Wine is a required dependency for macOS users:

- macOS users must install Wine using: `brew install --cask --no-quarantine wine-stable`
- The application will use the Windows Python environment through Wine on macOS

## Setup Process Using Embeddable Python Package (Windows Instructions)

Using the Python embeddable package is the most reliable method for creating a portable environment because it's specifically designed to be self-contained without hardcoded paths.

### Step 1: Download the Python Embeddable Package

1. **Download the Python embeddable package** from the official Python website
   - Go to https://www.python.org/downloads/windows/
   - Download "Windows embeddable package (64-bit)" for Python 3.11.7
   - Example: `python-3.11.7-embed-amd64.zip`
   - Place this file in `electron/resources/` (create this directory if needed)

### Step 2: Set Up the Environment (Windows Only)

1. **Create the python_embed directory and extract the package**
   ```powershell
   # Create directory
   mkdir python_embed
   cd python_embed
   
   # Extract the downloaded package (adjust path as needed)
   tar -xf ..\resources\python-3.11.7-embed-amd64.zip
   
   # Verify extraction worked
   ls
   ```

2. **Enable pip and site-packages**
   ```powershell
   # Check that python311._pth exists and uncomment the import site line if needed
   # The file should contain "import site" (not "#import site")
   cat python311._pth
   ```

3. **Install pip**
   ```powershell
   # Download get-pip.py
   curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
   
   # Install pip
   .\python.exe get-pip.py
   
   # Create site-packages directory
   mkdir Lib\site-packages
   ```

### Step 3: Install Required Packages

1. **Install packages directly using pip module**
   ```powershell
   # Install packages using pip as a module (more reliable than batch scripts)
   .\python.exe -m pip install -r ..\resources\requirements_editor.txt
   ```

   > **Note:** If you get an error about pip not being found, try:
   > ```powershell
   > .\python.exe -m ensurepip
   > .\python.exe -m pip install -r ..\resources\requirements_editor.txt
   > ```

2. **Verify installation worked**
   ```powershell
   # Test that pygame works
   .\python.exe -c "import pygame; print(f'Pygame is installed: {pygame.__version__}')"
   
   # Test that typing_extensions works
   .\python.exe -c "import typing_extensions; print('Typing extensions is installed')"
   ```

### Step 4: Package for Distribution

1. **Create a distributable archive**
   ```powershell
   # Optional: Clean up unnecessary files to reduce size
   del get-pip.py
   
   # Archive the whole directory using PowerShell (equivalent to 7z)
   cd ..
   Compress-Archive -Path .\python_embed\* -DestinationPath .\win_python_env.zip
   ```

2. **Move the zip to your project**
   - The zip file should be in `electron/win_python_env.zip` 
   - Make sure this file is included in your version control

## Troubleshooting Common Issues

### Issue: pip module not found
If you encounter "No module named pip" after installing pip:
```powershell
# Try using ensurepip which is built into Python
.\python.exe -m ensurepip
# Then install requirements
.\python.exe -m pip install -r ..\resources\requirements_editor.txt
```

### Issue: Python package installation fails
If package installation fails, check:
1. Your internet connection
2. That the requirements_editor.txt file exists in the specified path
3. Try installing packages one by one to identify problematic dependencies

### Issue: Unicode/encoding errors
If you see strange characters (like '■o') in command output:
1. Try running the command in cmd.exe instead of PowerShell
2. Or use direct Python commands instead of batch files

### Step 5: Integrate with Electron App

1. Update `download-binaries.js` to extract and set up the environment

```javascript
async function downloadPython() {
  console.log('Setting up bundled Python environment...');
  
  const pythonBaseDir = path.join(__dirname, 'bin', 'python');
  
  // Create base directory if it doesn't exist
  if (!fs.existsSync(pythonBaseDir)) {
    fs.mkdirSync(pythonBaseDir, { recursive: true });
  }
  
  // Check if Python is already installed
  if (fs.existsSync(path.join(pythonBaseDir, 'python.exe'))) {
    console.log('Python already installed, skipping...');
    return;
  }
  
  try {
    // Extract Windows Python bundle
    const winPythonBundle = path.join(__dirname, 'win_python_env.zip');
    console.log(`Extracting embeddable Python from ${winPythonBundle}...`);
    
    // Extract using extract-zip
    await extract(winPythonBundle, { dir: pythonBaseDir });
    console.log('Embeddable Python environment extracted successfully');
    
    // Make sure Python executable is marked as executable on Unix systems
    if (process.platform !== 'win32') {
      const pythonExePath = path.join(pythonBaseDir, 'python.exe');
      if (fs.existsSync(pythonExePath)) {
        fs.chmodSync(pythonExePath, 0o755);
        console.log('Added executable permission to python.exe');
      }
    }
  } catch (error) {
    console.error('Failed to set up Python environment:', error);
    // Continue anyway but log the issue
  }
  
  console.log('Python environment set up successfully');
}
```

2. Update `game-runner.js` to use the correct paths:

```javascript
// Get Python path based on platform
function getPythonPath() {
  const platform = process.platform;
  const pythonBaseDir = path.join(app.getAppPath(), 'bin', 'python');
  
  if (platform === 'win32') {
    // Use Windows Python directly
    return path.join(pythonBaseDir, 'python.exe');
  } else if (platform === 'darwin') {
    // On macOS, use Windows Python through Wine
    return path.join(pythonBaseDir, 'python.exe'); // Will be used with Wine
  }
  
  // Fallback (should not reach here)
  throw new Error('Unsupported platform: ' + platform);
}
```

## Expected Directory Structure

After implementation, your file structure will look like this:

```
electron/
├── bin/
│   ├── deno/
│   │   └── deno  # or deno.exe on Windows
│   └── python/
│       ├── python.exe
│       ├── pythonw.exe
│       ├── python311.dll
│       ├── python-pip.bat
│       ├── python311._pth
│       ├── Scripts/
│       │   ├── pip.exe
│       │   └── ... (other scripts)
│       ├── Lib/
│       │   └── site-packages/
│       │       ├── pygame/
│       │       ├── typing_extensions.py
│       │       └── ... (other packages)
├── win_python_env.zip  # Python bundle backup
└── ... (other electron files)
```

## Testing the Embeddable Python

### On Windows

```batch
cd electron\bin\python
python.exe -c "import sys; print(f'Python version: {sys.version}')"
python.exe -c "import pygame; print(f'Pygame version: {pygame.__version__}')"
```

### On macOS with Wine

```bash
cd electron/bin/python
wine python.exe -c "import sys; print(f'Python version: {sys.version}')"
wine python.exe -c "import pygame; print(f'Pygame version: {pygame.__version__}')"
```

## Troubleshooting

### Common Issues

1. **Python Cannot Find Modules**
   - Make sure the `python311._pth` file has the line `import site` uncommented
   - Check that the packages are installed in the `Lib/site-packages` directory

2. **Permission Issues on macOS**
   - Ensure all .exe files have execute permission: `chmod +x python.exe pythonw.exe Scripts/*.exe`

3. **Wine Z: Drive Issues**
   - Make sure paths in batch files use the Z: drive correctly for absolute paths
   - Example: macOS path `/Users/username/Documents` should be referenced as `Z:\Users\username\Documents`

4. **Path Too Long Errors**
   - Try to keep directory structures simple and avoid deeply nested paths
   - Windows has path length limitations that can cause issues

## Wine Requirements on macOS

macOS users must install Wine to run the application. This is a requirement, not an option.

To install Wine on macOS:

```bash
brew install --cask --no-quarantine wine-stable
```

The application will verify Wine is installed before running and display an error message if it's not found.

## Diagnostic Script for macOS

If you encounter issues with Python execution through Wine, run this diagnostic script:

```bash
#!/bin/bash
# Save as electron/bin/python/test_python.sh
cd "$(dirname "$0")"
echo "Testing Python with Wine..."

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
```

Make this script executable and run it:
```bash
chmod +x test_python.sh
./test_python.sh
```

## Conclusion

Using a Python embeddable package ensures a reliable, portable Python environment that works correctly across platforms. This approach eliminates issues with hardcoded paths that can occur when bundling a virtual environment.