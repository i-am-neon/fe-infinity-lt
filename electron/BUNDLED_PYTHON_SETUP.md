# Bundled Python Setup for FE Infinity

This document outlines the process for creating a pre-packaged Python environment with all dependencies pre-installed for FE Infinity.

## Overview

Instead of trying to install Python dependencies at runtime, we'll create a pre-built Python environment with all necessary packages installed. This environment will be bundled with the application and used directly, eliminating the need for any runtime installation.

## Requirements

- We need Python environments that can be used by:
  - Windows users (using Windows Python directly)
  - macOS users (using Windows Python through Wine - **REQUIRED**)
- All dependencies must be pre-installed
- The environments must be portable and work with the Electron app structure

## Important Note for macOS

**macOS MUST use Wine to run the Windows Python environment.** We do not support using native macOS Python. 
Wine is a required dependency for macOS users:

- macOS users must install Wine using: `brew install --cask --no-quarantine wine-stable`
- The application will use the Windows Python environment through Wine on macOS

## Setup Process

### Create Windows Python Environment

Since we're exclusively using Windows Python (even on macOS through Wine), we only need to create a single Windows Python environment. You can create this environment either on a Windows machine or using Wine on macOS.

#### Option 1: Using a Windows Machine

1. Setup Windows VM or Machine
   - Use a Windows 10/11 system or VM

2. Download Python 3.11 for Windows
   - Download from https://www.python.org/downloads/windows/
   - Get Python 3.11.7 (64-bit) - regular installer, not embeddable package
   - We need a full Python installation with pip

3. Set Up Python Environment

```batch
:: Create a virtual environment
python -m venv win_python_env
cd win_python_env
Scripts\activate

:: Install all dependencies from the requirements_engine.txt file
:: Assuming you've cloned the repository
pip install -r \path\to\lt-maker-fork\requirements_engine.txt

:: Verify the installation worked
python -c "import pygame; print(f'Pygame is installed: {pygame.__version__}')"
python -c "import typing_extensions; print('Typing extensions is installed')"

:: Create a distributable archive of the environment
:: You can use 7-Zip
cd ..
7z a win_python_env.zip win_python_env\*
```

#### Option 2: Using Wine on macOS

If you don't have access to a Windows machine, you can create the Windows Python environment directly on macOS using Wine:

1. Install Wine on macOS (if not already installed)
   ```bash
   brew install --cask --no-quarantine wine-stable
   ```

2. Download Python 3.11.7 for Windows
   - Download from https://www.python.org/downloads/windows/
   - Get the 64-bit installer (.exe file)

3. Install Python using Wine
   ```bash
   # Navigate to your download directory
   cd ~/Downloads
   # Run the Python installer with Wine
   wine python-3.11.7-amd64.exe
   ```
   - Follow the installer prompts
   - Make sure to check "Add Python to PATH" option

4. Create a virtual environment and install dependencies
   ```bash
   # Open a Wine command prompt
   wine cmd
   ```

   Then in the Wine command prompt:
   ```
   # Create a virtual environment (use Windows-style paths)
   python -m venv C:\win_python_env
   cd C:\win_python_env
   Scripts\activate

   # Install requirements (adjust the path to your lt-maker-fork directory)
   # If your repository is at ~/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork
   # then in Wine it would be at Z:\Users\your-username\Documents\Dev\personal\Infinit\fe-infinity-lt\lt-maker-fork
   pip install -r Z:\path\to\lt-maker-fork\requirements_engine.txt

   # Verify installation
   python -c "import pygame; print(f'Pygame is installed: {pygame.__version__}')"
   python -c "import typing_extensions; print('Typing extensions is installed')"
   
   # Exit the Wine command prompt
   exit
   ```

5. Create a distributable archive
   - Navigate to where Wine stores its C: drive (usually ~/.wine/drive_c/)
   - Archive the win_python_env directory
   ```bash
   cd ~/.wine/drive_c/
   zip -r win_python_env.zip win_python_env
   ```

### Test with Wine on macOS 

Before packaging, test that the Windows Python environment works with Wine on macOS:

```bash
# On macOS, with Wine installed
wine /path/to/win_python_env/Scripts/python.exe -c "import pygame; print('Pygame works!')"
```

### Prepare the Windows Python Environment

#### If using Windows:

```batch
:: Clean up unnecessary files to reduce size
cd win_python_env
rmdir /s /q Scripts\pip*
rmdir /s /q Scripts\setuptools*
rmdir /s /q Lib\site-packages\pip
rmdir /s /q Lib\site-packages\setuptools
rmdir /s /q Lib\site-packages\__pycache__

:: Create a streamlined package
cd ..
7z a win_python_env.zip win_python_env\*
```

#### If using Wine on macOS:

```bash
# Open Wine command prompt
wine cmd
```

Then in the Wine command prompt:
```
:: Clean up unnecessary files to reduce size
cd C:\win_python_env
rmdir /s /q Scripts\pip*
rmdir /s /q Scripts\setuptools*
rmdir /s /q Lib\site-packages\pip
rmdir /s /q Lib\site-packages\setuptools
rmdir /s /q Lib\site-packages\__pycache__
exit
```

Then back in macOS terminal:
```bash
# Create a streamlined package
cd ~/.wine/drive_c/
zip -r win_python_env.zip win_python_env
```

### Integrate with Electron App

#### Directory Structure

```
electron/
├── bin/
│   ├── python/
│   │   └── win/  # Windows Python environment for both platforms
│   └── deno/     # Deno binaries
```

#### Download Binaries Script

```javascript
async function downloadPython() {
  console.log('Setting up bundled Python environment...');
  
  const pythonBaseDir = path.join(__dirname, 'bin', 'python');
  
  // Create base directory if it doesn't exist
  if (!fs.existsSync(pythonBaseDir)) {
    fs.mkdirSync(pythonBaseDir, { recursive: true });
  }
  
  // Set up Windows Python environment for both platforms
  const winPythonDir = path.join(pythonBaseDir);
  if (!fs.existsSync(winPythonDir)) {
    fs.mkdirSync(winPythonDir, { recursive: true });
    
    // Extract Windows Python bundle
    const winPythonBundle = path.join(__dirname, 'resources', 'win_python_env.zip');
    console.log(`Extracting Windows Python from ${winPythonBundle}...`);
    
    // Extract using extract-zip
    await extract(winPythonBundle, { dir: winPythonDir });
    console.log('Windows Python environment extracted successfully');
  }
  
  console.log('Python environment set up successfully');
}
```

#### Game Runner

Update `game-runner.js` to handle platform differences:

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

// Run game with appropriate Python based on platform
async function runGame(projectPath) {
  const platform = process.platform;
  const ltMakerPath = getLtMakerPath();
  const pythonBaseDir = path.join(app.getAppPath(), 'bin', 'python');
  const pythonPath = getPythonPath();
  
  // Set environment variables
  const pythonEnv = {
    ...process.env,
    PYTHONPATH: ltMakerPath,
    PYTHONUNBUFFERED: '1',
    PYTHONHOME: pythonBaseDir
  };
  
  if (platform === 'darwin') {
    // On macOS, run Windows Python through Wine
    console.log('Using Windows Python through Wine on macOS');
    
    // Get Wine path
    const winePath = getWinePath();
    if (!winePath) {
      throw new Error('Wine is required but not installed. Please install Wine using: brew install --cask --no-quarantine wine-stable');
    }
    
    pythonEnv.WINEDEBUG = '-all'; // Suppress Wine debug messages
    
    // Run through Wine
    const pythonProcess = spawn(
      winePath,
      [pythonPath, path.join(ltMakerPath, 'run_engine_for_project.py'), projectPath],
      {
        cwd: ltMakerPath,
        env: pythonEnv,
        stdio: 'inherit'
      }
    );
    
    // Handle process events...
  } else {
    // On Windows, use Python directly
    console.log(`Using native Python for Windows: ${pythonPath}`);
    
    // Run native Python
    const pythonProcess = spawn(
      pythonPath,
      [path.join(ltMakerPath, 'run_engine_for_project.py'), projectPath],
      {
        cwd: ltMakerPath,
        env: pythonEnv,
        stdio: 'inherit'
      }
    );
    
    // Handle process events...
  }
}
```

### File Structure

After implementation, your file structure will look like this:

```
electron/
├── bin/
│   ├── deno/
│   │   └── deno  # or deno.exe on Windows
│   └── python/
│       ├── python.exe
│       ├── Scripts/
│       │   └── ...
│       ├── Lib/
│       │   ├── site-packages/
│       │   │   ├── pygame/
│       │   │   ├── typing_extensions.py
│       │   │   └── ... (other packages)
│       │   └── ... (standard library)
│       └── ... (other Python files)
├── resources/
│   └── win_python_env.zip  # Windows Python backup
└── ... (other electron files)
```

## Wine Requirements on macOS

macOS users must install Wine to run the application. This is a requirement, not an option. The application will not run on macOS without Wine.

To install Wine on macOS:

```bash
brew install --cask --no-quarantine wine-stable
```

The application will verify Wine is installed before running and display an error message if it's not found.

## Troubleshooting

1. **Wine Compatibility**: Ensure Wine is compatible with the macOS version. Newer macOS versions may have compatibility issues with Wine.

2. **Wine Prefix**: Consider creating a custom Wine prefix for the application to prevent conflicts with other Wine applications.

3. **Python Installation**: Ensure the bundled Python has all necessary dependencies installed, as macOS users will depend entirely on the Windows Python environment.

4. **Environment Variables**: Ensure `PYTHONPATH` and other environment variables are correctly set for both Windows and Wine on macOS.

5. **Working Directory**: Make sure the working directory is correct when launching Python through Wine, as some modules might use relative paths.

## Example Test Script for macOS

### Testing the Bundled Python Environment

```bash
#!/bin/bash
cd "$(dirname "$0")"
PYTHON_EXE="./bin/python/python.exe"
wine "$PYTHON_EXE" -c "import sys; print(f'Python version: {sys.version}')"
wine "$PYTHON_EXE" -c "import pygame; print(f'Pygame version: {pygame.__version__}')"
wine "$PYTHON_EXE" -c "import typing_extensions; print('Typing extensions imported successfully')"
echo "Test complete!"
```

### Testing Your Wine Python Installation During Setup

If you're creating the Python environment using Wine on your Mac, you can verify it's working correctly with:

```bash
# Test Python installation in Wine
wine ~/.wine/drive_c/Python311/python.exe -c "import sys; print(f'Python version: {sys.version}')"

# Test the virtual environment after creation
wine ~/.wine/drive_c/win_python_env/Scripts/python.exe -c "import sys; print(f'Python version: {sys.version}')"
wine ~/.wine/drive_c/win_python_env/Scripts/python.exe -c "import pygame; print(f'Pygame version: {pygame.__version__}')"
```

### Finding the Wine C: Drive

On macOS, the Wine C: drive is typically located at:
- `~/.wine/drive_c/` for the default Wine prefix
- If using a custom Wine prefix (WINEPREFIX), it would be at `$WINEPREFIX/drive_c/`

When working with Wine on macOS, you may need to convert between macOS paths and Wine paths:
- Windows path `C:\file.txt` corresponds to macOS path `~/.wine/drive_c/file.txt`
- macOS path `/Users/username/Documents` is accessible in Wine as `Z:\Users\username\Documents`

## Conclusion

This approach uses a single Windows Python environment on both Windows and macOS (through Wine). The Windows Python environment has all dependencies pre-installed, avoiding any runtime installation. While this requires macOS users to install Wine, it provides consistent behavior across platforms and simplifies maintenance by having only one Python environment to manage.