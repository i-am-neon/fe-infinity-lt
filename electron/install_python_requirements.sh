#!/bin/bash
# Script to install Python requirements for Wine Python environment

# Set Wine configuration
export WINEDEBUG=-all
export WINEDLLOVERRIDES=mscoree,mshtml=

# Get paths
ELECTRON_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_DIR="$ELECTRON_DIR/bin/python/python_embed"
PYTHON_EXE="$PYTHON_DIR/python.exe"
LT_MAKER_PATH="$ELECTRON_DIR/../lt-maker-fork"
REQUIREMENTS_FILE="$LT_MAKER_PATH/requirements_editor.txt"

echo "=== Python Package Installation for Wine ==="
echo "Python directory: $PYTHON_DIR"
echo "Python executable: $PYTHON_EXE"
echo "Requirements file: $REQUIREMENTS_FILE"

# Check Wine is available
if ! command -v wine &> /dev/null; then
    echo "ERROR: Wine is not installed or not in PATH"
    echo "Please install Wine using: brew install --cask --no-quarantine wine-stable"
    exit 1
fi

echo "Wine version: $(wine --version)"

# Check Python executable exists
if [ ! -f "$PYTHON_EXE" ]; then
    echo "ERROR: Python executable not found at $PYTHON_EXE"
    exit 1
fi

# Create a Python script to install pip and packages
INSTALL_SCRIPT="$ELECTRON_DIR/install_packages.py"
cat > "$INSTALL_SCRIPT" << 'EOF'
import os
import sys
import subprocess

print(f"Python version: {sys.version}")
print(f"Executable: {sys.executable}")
print(f"Path: {sys.path}")

# Try to enable site-packages
try:
    python_dir = os.path.dirname(sys.executable)
    pth_file = os.path.join(python_dir, "python311._pth")
    if os.path.exists(pth_file):
        with open(pth_file, 'r') as f:
            content = f.read()
        
        if '#import site' in content:
            content = content.replace('#import site', 'import site')
            with open(pth_file, 'w') as f:
                f.write(content)
            print(f"Enabled site-packages in {pth_file}")
except Exception as e:
    print(f"Error enabling site-packages: {e}")

# Install pip if needed
try:
    import pip
    print(f"pip already installed: {pip.__version__}")
except ImportError:
    print("pip not found, installing...")
    try:
        import urllib.request
        print("Downloading get-pip.py...")
        urllib.request.urlretrieve("https://bootstrap.pypa.io/get-pip.py", "get-pip.py")
        print("Installing pip...")
        subprocess.check_call([sys.executable, "get-pip.py"])
        print("pip installed successfully")
    except Exception as e:
        print(f"Error installing pip: {e}")
        sys.exit(1)

# Install packages from requirements file
requirements_file = sys.argv[1] if len(sys.argv) > 1 else None
if not requirements_file or not os.path.exists(requirements_file):
    print(f"ERROR: Requirements file not found: {requirements_file}")
    sys.exit(1)

print(f"Installing packages from {requirements_file}")
try:
    # First update pip itself
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", "pip", "--no-warn-script-location"])
    print("pip upgraded successfully")
    
    # Then install from requirements file
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", requirements_file, "--no-warn-script-location"])
    print("All packages from requirements file installed successfully")
except Exception as e:
    print(f"Error installing packages: {e}")
    
    # Try installing critical packages individually
    try:
        print("Trying to install packages individually...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pygame-ce==2.3.2", "--no-warn-script-location"])
        print("pygame-ce installed successfully")
        
        subprocess.check_call([sys.executable, "-m", "pip", "install", "typing-extensions==4.8.0", "--no-warn-script-location"])
        print("typing-extensions installed successfully")
        
        subprocess.check_call([sys.executable, "-m", "pip", "install", "PyQt5==5.15.10", "--no-warn-script-location"])
        print("PyQt5 installed successfully")
    except Exception as e2:
        print(f"Error installing individual packages: {e2}")
        sys.exit(1)

# Verify critical packages
try:
    import pygame
    print(f"pygame installed successfully: {pygame.__version__}")
except ImportError as e:
    print(f"Failed to import pygame after installation: {e}")
    sys.exit(1)

try:
    import typing_extensions
    print("typing_extensions installed successfully")
except ImportError as e:
    print(f"Failed to import typing_extensions after installation: {e}")
    sys.exit(1)

try:
    import PyQt5
    print("PyQt5 installed successfully")
except ImportError as e:
    print(f"Failed to import PyQt5 after installation: {e}")
    sys.exit(1)

print("All packages installed and verified successfully!")
EOF

echo "Running Python package installer..."
wine "$PYTHON_EXE" "$INSTALL_SCRIPT" "$REQUIREMENTS_FILE"

if [ $? -eq 0 ]; then
    echo "SUCCESS: Python packages installed correctly!"
    echo "You should now be able to run the game within Electron."
    exit 0
else
    echo "ERROR: Package installation failed. See errors above."
    exit 1
fi