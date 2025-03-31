# FE Infinity Diagnostic Tools

This directory contains utility scripts and documentation for diagnosing and fixing issues with the Python environment in FE Infinity.

## Scripts

### `test_python.sh`

Basic diagnostic tool for testing if the bundled Python environment is properly set up and running. This script:
- Verifies Python executable exists
- Tests Python execution with Wine (on macOS/Linux)
- Checks for critical modules (pygame, numpy, etc.)
- Runs a full diagnostic if `diagnose_python.py` is available

Usage:
```bash
./test_python.sh
```

### `verify_wine_python.sh`

Advanced Wine and Python environment verification tool for macOS/Linux. This script performs:
- Wine installation checks
- Python executable verification
- Module import testing
- File system access tests through Wine
- Z: drive mapping checks
- Batch file execution testing
- LT Maker access checks

Usage:
```bash
./verify_wine_python.sh
```

### `fix_python_permissions.sh`

Helper script to fix permissions for Python executables on macOS/Linux. This is needed because Wine requires executable permissions on Python binaries.

Usage:
```bash
./fix_python_permissions.sh
```

### `diagnose_python.py`

Python diagnostic script that can be run with the bundled Python to check:
- Python environment settings
- Module availability
- Pygame subsystems
- Critical file access

Usage:
```bash
# On Windows
python.exe diagnose_python.py

# On macOS/Linux with Wine
wine python.exe diagnose_python.py
```

## Documentation

### `BUNDLED_PYTHON_SETUP.md`

Detailed documentation explaining how Python is bundled and used within the FE Infinity Electron application, including directory structure, execution process, and environment variables.

### `BUNDLED_PYTHON_TROUBLESHOOTING.md`

Comprehensive troubleshooting guide for common issues when using the bundled Python environment, especially on macOS with Wine.