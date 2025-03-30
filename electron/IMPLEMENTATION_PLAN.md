# Implementation Plan for Bundled Python Fix

Based on the diagnostics run, we identified that the issue is with the hardcoded Windows paths in the bundled Python environment. This plan outlines the steps to fix the issue by using a standard embeddable Python package.

## Step 1: Create a New Embeddable Python Bundle (on Windows)

1. **Download the embeddable package**:
   - Go to https://www.python.org/downloads/windows/
   - Download "Windows embeddable package (64-bit)" for Python 3.11.7
   - Example filename: `python-3.11.7-embed-amd64.zip`

2. **Extract and set up the package**:
   ```batch
   mkdir python_embed
   cd python_embed
   :: Extract the downloaded package
   tar -xf python-3.11.7-embed-amd64.zip
   
   :: Edit python311._pth to uncomment the import site line
   :: Change "#import site" to "import site"
   ```

3. **Install pip**:
   ```batch
   :: Download get-pip.py
   curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
   
   :: Install pip
   python.exe get-pip.py
   
   :: Create a helper batch file for pip
   echo @echo off > python-pip.bat
   echo "%~dp0python.exe" "%~dp0Scripts\pip.exe" %* >> python-pip.bat
   ```

4. **Install requirements**:
   ```batch
   :: Create site-packages directory if needed
   mkdir Lib\site-packages

   :: Install required packages
   python-pip.bat install -r path\to\lt-maker-fork\requirements_engine.txt
   ```

5. **Create zip archive**:
   ```batch
   :: Clean up unnecessary files
   del get-pip.py
   
   :: Archive the whole directory
   cd ..
   7z a win_python_env.zip python_embed\*
   ```

## Step 2: Integration with Electron App

1. **Copy the new Python bundle**:
   - Place `win_python_env.zip` in the `electron/` directory

2. **Replace download-binaries.js**:
   - Review the updated file at `electron/download-binaries-updated.js`
   - Replace the existing file with the updated version:
   ```bash
   mv electron/download-binaries-updated.js electron/download-binaries.js
   ```

3. **Clear existing Python installation**:
   ```bash
   rm -rf electron/bin/python
   ```

4. **Run the updated download-binaries script**:
   ```bash
   cd electron
   node download-binaries.js
   ```

## Step 3: Test the Updated Python Environment

1. **Test on Windows** (if available):
   ```batch
   cd electron\bin\python
   python.exe -c "import sys; print(f'Python version: {sys.version}')"
   python.exe -c "import pygame; print(f'Pygame version: {pygame.__version__}')"
   ```

2. **Test on macOS with Wine**:
   ```bash
   cd electron/bin/python
   chmod +x test_python.sh
   ./test_python.sh
   ```

3. **Test the full application**:
   ```bash
   cd electron
   npm run dev  # or whatever command starts your app
   ```

## Step 4: Verify Permissions are Correct

If you encounter permission issues on macOS, make sure all executable files have proper permissions:

```bash
# Set execute permissions on all .exe files
find electron/bin/python -name "*.exe" -exec chmod +x {} \;

# Set execute permissions on all .sh files
find electron/bin/python -name "*.sh" -exec chmod +x {} \;
```

## Fallback Options

If you continue to have issues with the Python embeddable package, consider these alternatives:

1. **Fix the game-runner.js implementation** to bypass the wrapper script and directly utilize pythonw.exe
2. **Create a custom batch file** that sets up the environment properly for running Python
3. **Use a custom Wine prefix** to isolate the Python environment from other Wine applications

## Notes on the Solution

Using the embeddable Python package has these advantages:

1. **No hardcoded paths**: The embeddable package is designed to be relocatable
2. **Self-contained**: All necessary dependencies are included within the package
3. **Cleaner implementation**: Fewer workarounds and special cases needed
4. **Better compatibility**: Works reliably on both Windows and macOS (via Wine)

This approach replaces the current bundled Python environment with a clean, relocatable implementation that will work properly on all platforms.