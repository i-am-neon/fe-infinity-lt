# Bundled Python Troubleshooting Guide

This document provides solutions for common issues when using the bundled Python environment in FE Infinity, especially on macOS with Wine.

## Common Issues and Solutions

### Missing Python Dependencies

#### Symptom: "No module named X" errors

```
Error: No module named 'pygame'
```

#### Solutions:

1. **Verify Requirements**:
   ```bash
   # Check requirements_engine.txt
   cat electron/python_embed/requirements_engine.txt
   ```

2. **Install Missing Package**:
   ```bash
   # On Windows
   cd electron/bin/python
   python.exe -m pip install pygame

   # On macOS (through Wine)
   cd electron/bin/python
   wine python.exe -m pip install pygame
   ```

3. **Verify Installation**:
   ```bash
   # Windows
   cd electron/bin/python
   python.exe -c "import pygame; print(pygame.__version__)"

   # macOS with Wine
   cd electron/bin/python
   wine python.exe -c "import pygame; print(pygame.__version__)"
   ```

4. **Check Path Configuration**:
   - Make sure `python311._pth` has `import site` uncommented (not `#import site`)
   - Verify the site-packages directory exists: `electron/bin/python/Lib/site-packages`

### Wine Not Found or Not Working

#### Symptom: Wine-related errors

```
Error: Wine is required but not found: spawnSync wine ENOENT
```

#### Solutions:

1. **Install Wine**:
   ```bash
   # On macOS
   brew install --cask --no-quarantine wine-stable
   
   # Verify installation
   wine --version
   ```

2. **Check Wine in PATH**:
   ```bash
   which wine
   ```

3. **Test Wine Directly**:
   ```bash
   wine cmd /c echo "Wine is working"
   ```

4. **Check Wine Configuration**:
   ```bash
   # Create a basic Wine prefix if needed
   WINEPREFIX=~/.wine winecfg
   ```

### Python Script Execution Failures

#### Symptom: Python script fails to run or crashes immediately

```
Running Python script with Wine
Wine executable: /usr/local/bin/wine
Python script: /var/folders/...
Game process closed with code 1
```

#### Solutions:

1. **Run Script with Debug Output**:
   ```bash
   # Create debugging wrapper
   cat > debug_script.py << 'EOF'
   import sys
   print(f"Python version: {sys.version}")
   print(f"Python path: {sys.path}")
   # Import your actual script
   try:
       import your_script_name
       print("Successfully imported script")
   except Exception as e:
       print(f"Import error: {e}")
   EOF
   
   # Run with Wine
   wine python.exe debug_script.py
   ```

2. **Check File Permissions**:
   ```bash
   # Make sure Python and scripts are executable
   chmod +x electron/bin/python/python.exe
   chmod +x your_script.py
   ```

3. **Check for Wine Path Conversion Issues**:
   - Remember that Windows paths use backslashes `\` not forward slashes `/`
   - Absolute paths need Z: drive prefix (e.g., `/Users/name` → `Z:\Users\name`)

4. **Run Script in Interactive Mode**:
   ```bash
   wine python.exe -i your_script.py
   ```

### Path Resolution Problems

#### Symptom: Files can't be found even when paths look correct

```
FileNotFoundError: [Errno 2] No such file or directory: 'Z:\\path\\to\\file'
```

#### Solutions:

1. **Check Absolute vs. Relative Paths**:
   - When using Wine, absolute paths must be prefixed with `Z:`
   - Example: `/Users/name/path` becomes `Z:\\Users\\name\\path`

2. **Verify Path with Wine**:
   ```bash
   # Test if Wine can see the file
   wine cmd /c dir "Z:\\path\\to\\directory"
   ```

3. **Use Windows-style Path Separators**:
   - Replace all forward slashes with backslashes when using Wine paths
   - Example: `Z:/path/to/file` should be `Z:\\path\\to\\file`

4. **Add Explicit Path to Python Script**:
   ```python
   import sys, os
   # Add paths explicitly
   sys.path.insert(0, r'Z:\path\to\directory')
   print(f"Working directory: {os.getcwd()}")
   print(f"Python path: {sys.path}")
   ```

### Library Loading Errors

#### Symptom: DLL or shared library errors

```
ImportError: DLL load failed: The specified module could not be found
```

#### Solutions:

1. **Check Missing DLLs**:
   ```bash
   wine python.exe -c "import os, sys; print(os.listdir(os.path.dirname(sys.executable)))"
   ```

2. **Re-extract Python Bundle**:
   ```bash
   # Re-extract the bundled Python environment
   cd electron
   rm -rf bin/python
   unzip win_python_env.zip -d bin/python
   ```

3. **Ensure All Runtime Dependencies Are Present**:
   - Check if the error mentions specific DLLs
   - For pygame errors, verify SDL libraries are included

### Performance Issues

#### Symptom: Python runs very slowly through Wine

#### Solutions:

1. **Check Wine Environment**:
   ```bash
   # Disable Wine debug output
   export WINEDEBUG=-all
   # Try a clean Wine prefix
   export WINEPREFIX=~/fe_infinity_wine
   ```

2. **Reduce I/O Operations**:
   - Minimize file reads/writes in Python code
   - Use buffered I/O when possible

3. **Pre-compile Python Modules**:
   ```bash
   wine python.exe -m compileall path/to/modules
   ```

### Wine Configuration on macOS

#### Solutions:

1. **Create a Dedicated Wine Prefix**:
   ```bash
   # Create a clean Wine prefix
   export WINEPREFIX=~/fe_infinity_wine
   wine winecfg
   ```

2. **Configure Wine for Better Python Support**:
   ```bash
   # Set Windows version to 10
   wine winecfg -v win10
   ```

3. **Set Useful Wine Environment Variables**:
   ```bash
   export WINEARCH=win64
   export WINEDLLOVERRIDES=mscoree,mshtml=
   ```

## Diagnostics

### Run the Built-in Test Script

We provide a test script to verify Python setup:

```bash
# Run the diagnostic script
cd electron/bin/python
bash test_python.sh
```

### Create a Custom Diagnostic Script

Create this script in `electron/bin/python/diagnose.py`:

```python
# Save as diagnose.py in electron/bin/python
import sys
import os
import importlib.util

def check_module(module_name):
    """Check if a module can be imported and get its version if available."""
    try:
        module = importlib.import_module(module_name)
        version = getattr(module, '__version__', 'No version info')
        return f"✅ {module_name}: {version}"
    except ImportError as e:
        return f"❌ {module_name}: {e}"
    except Exception as e:
        return f"⚠️ {module_name}: {e}"

# Print system info
print(f"Python version: {sys.version}")
print(f"Platform: {sys.platform}")
print(f"Executable: {sys.executable}")
print(f"Working directory: {os.getcwd()}")

# Print path info
print("\nPython path:")
for p in sys.path:
    print(f"  - {p}")

# Check core modules required by LT Maker
print("\nChecking required modules:")
modules = [
    'pygame', 'numpy', 'PyQt5', 'typing_extensions', 'yaml', 
    'PIL', 'json', 're', 'copy', 'datetime'
]

for module in modules:
    print(check_module(module))

# Check file access
print("\nChecking file access:")
try:
    parent_dir = os.path.dirname(os.path.dirname(os.getcwd()))
    print(f"Parent directory: {parent_dir}")
    print(f"Files: {os.listdir(parent_dir)[:5]}...")  # List just first 5 files
except Exception as e:
    print(f"Error listing files: {e}")

print("\nDiagnostic complete!")
```

Run it with:

```bash
# On Windows
python.exe diagnose.py

# On macOS with Wine
wine python.exe diagnose.py
```

## Advanced Troubleshooting with Wine

### Debug Wine with Logging

```bash
# Enable detailed Wine logging (creates a wine.log file)
WINEDEBUG=+all wine python.exe your_script.py > wine.log 2>&1
```

### Check Wine External Libraries

```bash
# Check external libraries used by Wine
wine ldd python.exe
```

### Use a Python Virtual Environment

If you need a clean setup for testing:

```bash
# Create a Windows virtual environment through Wine
wine python.exe -m venv test_env
# Activate it
wine cmd /c "test_env\\Scripts\\activate.bat && python -c \"import sys; print(sys.executable)\""
```

## When All Else Fails

If the bundled Python environment can't be made to work on your system:

1. Install Python natively: 
   ```bash
   brew install python@3.11
   ```

2. Modify script paths to use the system Python instead of the bundled one

3. Install required dependencies globally:
   ```bash
   pip install -r requirements_engine.txt
   ```

4. Update the app to use your system Python

## Support and Additional Help

If you continue to encounter issues after trying these troubleshooting steps, please:

1. Gather logs from:
   - The Electron app console (available in dev tools)
   - Wine output (captured in `recent_logs.txt`)
   - Any error messages from Python scripts

2. Create an issue in the repository with:
   - Your exact system configuration (OS version, Wine version)
   - Steps to reproduce the problem
   - All relevant logs
   - What you've tried so far