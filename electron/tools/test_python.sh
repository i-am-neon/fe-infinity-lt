#!/bin/bash
# FE Infinity Python Diagnostic Tool
#
# This script checks if the bundled Python environment is properly set up
# and can run essential modules for LT Maker.

# Terminal colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}=== FE Infinity Python Diagnostic Tool ===${NC}"
echo "Testing in directory: $SCRIPT_DIR"
echo

# App and Python directories
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PYTHON_DIR="$APP_DIR/bin/python"
PYTHON_EMBED_DIR="$PYTHON_DIR/python_embed"

# Check for Wine on macOS/Linux
if [[ "$OSTYPE" != "win32" && "$OSTYPE" != "msys" && "$OSTYPE" != "cygwin" ]]; then
    echo -e "${BLUE}Checking Wine installation...${NC}"
    if command -v wine >/dev/null 2>&1; then
        WINE_VERSION=$(wine --version)
        echo -e "${GREEN}✓ Wine is installed: $WINE_VERSION${NC}"
    else
        echo -e "${RED}✗ Wine is NOT installed. Please install Wine:${NC}"
        echo "   macOS: brew install --cask --no-quarantine wine-stable"
        echo "   Linux: Use your package manager (apt, dnf, etc.) to install wine"
        echo
        echo -e "${RED}Cannot continue without Wine on macOS/Linux${NC}"
        exit 1
    fi
    echo
fi

# Ensure the Python executable is present
if [[ "$OSTYPE" != "win32" && "$OSTYPE" != "msys" && "$OSTYPE" != "cygwin" ]]; then
    PYTHON_EXE="$PYTHON_EMBED_DIR/python.exe"
    PYTHON_CMD="wine $PYTHON_EXE"
else
    PYTHON_EXE="$PYTHON_EMBED_DIR/python.exe"
    PYTHON_CMD="$PYTHON_EXE"
fi

# Check if Python exists
echo -e "${BLUE}Checking Python installation...${NC}"
if [ -f "$PYTHON_EXE" ]; then
    echo -e "${GREEN}✓ Python executable exists at: $PYTHON_EXE${NC}"
    # Set executable permission if on Unix
    if [[ "$OSTYPE" != "win32" && "$OSTYPE" != "msys" && "$OSTYPE" != "cygwin" ]]; then
        chmod +x "$PYTHON_EXE"
        echo "  Set executable permission"
    fi
else
    echo -e "${RED}✗ Python executable NOT found at: $PYTHON_EXE${NC}"
    echo "  This is a critical error - bundled Python is missing."
    exit 1
fi
echo

# Test if Python can run
echo -e "${BLUE}Testing Python execution...${NC}"
if [[ "$OSTYPE" != "win32" && "$OSTYPE" != "msys" && "$OSTYPE" != "cygwin" ]]; then
    # On macOS/Linux, use Wine
    if wine "$PYTHON_EXE" -c "import sys; print(f'Python {sys.version} is working')" >/dev/null 2>&1; then
        PYTHON_VERSION=$(wine "$PYTHON_EXE" -c "import sys; print(sys.version.split()[0])")
        echo -e "${GREEN}✓ Python $PYTHON_VERSION is working with Wine${NC}"
    else
        echo -e "${RED}✗ Python CANNOT run with Wine${NC}"
        echo "  This is a critical error - Python cannot execute."
        echo "  Try running manually: wine $PYTHON_EXE -c \"print('hello')\""
        
        # Try running native Python as a fallback
        echo -e "${YELLOW}Trying system Python as a fallback...${NC}"
        if command -v python3 >/dev/null 2>&1; then
            PY_VERSION=$(python3 -V)
            echo -e "${GREEN}✓ System Python is available: $PY_VERSION${NC}"
            echo "  You can try using system Python instead of the bundled version."
        else
            echo -e "${RED}✗ System Python is NOT available${NC}"
        fi
        exit 1
    fi
else
    # On Windows, run directly
    if "$PYTHON_EXE" -c "import sys; print(f'Python {sys.version} is working')" >/dev/null 2>&1; then
        PYTHON_VERSION=$("$PYTHON_EXE" -c "import sys; print(sys.version.split()[0])")
        echo -e "${GREEN}✓ Python $PYTHON_VERSION is working${NC}"
    else
        echo -e "${RED}✗ Python CANNOT run${NC}"
        echo "  This is a critical error - Python cannot execute."
        exit 1
    fi
fi
echo

# Test if critical modules are available
echo -e "${BLUE}Testing critical modules...${NC}"
MODULES=("pygame" "numpy" "PyQt5" "typing_extensions")

for MODULE in "${MODULES[@]}"; do
    if [[ "$OSTYPE" != "win32" && "$OSTYPE" != "msys" && "$OSTYPE" != "cygwin" ]]; then
        # Using Wine
        if wine "$PYTHON_EXE" -c "import $MODULE; print('$MODULE is available')" >/dev/null 2>&1; then
            MODULE_VERSION=$(wine "$PYTHON_EXE" -c "import $MODULE; print(getattr($MODULE, '__version__', 'unknown'))" 2>/dev/null || echo "unknown")
            echo -e "${GREEN}✓ $MODULE is available ($MODULE_VERSION)${NC}"
        else
            echo -e "${RED}✗ $MODULE is NOT available${NC}"
            echo "  This module is required for LT Maker to function properly."
            echo "  Try installing it with: wine $PYTHON_EXE -m pip install $MODULE"
        fi
    else
        # Windows native
        if "$PYTHON_EXE" -c "import $MODULE; print('$MODULE is available')" >/dev/null 2>&1; then
            MODULE_VERSION=$("$PYTHON_EXE" -c "import $MODULE; print(getattr($MODULE, '__version__', 'unknown'))" 2>/dev/null || echo "unknown")
            echo -e "${GREEN}✓ $MODULE is available ($MODULE_VERSION)${NC}"
        else
            echo -e "${RED}✗ $MODULE is NOT available${NC}"
            echo "  This module is required for LT Maker to function properly."
            echo "  Try installing it with: $PYTHON_EXE -m pip install $MODULE"
        fi
    fi
done
echo

# Run the full diagnostic script if it exists
DIAGNOSTIC_SCRIPT="$SCRIPT_DIR/diagnose_python.py"
if [ -f "$DIAGNOSTIC_SCRIPT" ]; then
    echo -e "${BLUE}Running full diagnostic script...${NC}"
    echo
    
    if [[ "$OSTYPE" != "win32" && "$OSTYPE" != "msys" && "$OSTYPE" != "cygwin" ]]; then
        # Using Wine
        wine "$PYTHON_EXE" "$DIAGNOSTIC_SCRIPT"
    else
        # Windows native
        "$PYTHON_EXE" "$DIAGNOSTIC_SCRIPT"
    fi
    echo
else
    echo -e "${YELLOW}Diagnostic script not found at: $DIAGNOSTIC_SCRIPT${NC}"
    echo "Skipping full diagnostics."
    echo
fi

# Results summary
echo -e "${BLUE}=== Diagnostic Summary ===${NC}"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}The Python environment appears to be properly configured.${NC}"
    echo "If you're still experiencing issues, please check the troubleshooting guide:"
    echo -e "  ${BLUE}BUNDLED_PYTHON_TROUBLESHOOTING.md${NC}"
else
    echo -e "${RED}There were issues with the Python environment.${NC}"
    echo "Please review the errors above and check the troubleshooting guide:"
    echo -e "  ${BLUE}BUNDLED_PYTHON_TROUBLESHOOTING.md${NC}"
fi

# Save the output to a log file
LOG_FILE="$SCRIPT_DIR/test_results.txt"
echo "Saving results to: $LOG_FILE"
echo "Test completed at: $(date)"
echo

# Make the script executable
chmod +x "$0"