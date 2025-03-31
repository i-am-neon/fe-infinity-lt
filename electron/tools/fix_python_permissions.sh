#!/bin/bash
# Script to fix permissions for bundled Python on macOS
# This is needed because Wine requires executable permissions on Python binaries

# Terminal colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}=== Fixing Python permissions for Wine compatibility ===${NC}"
echo "Running in: $SCRIPT_DIR"

# Check if we're on macOS or Linux
if [[ "$OSTYPE" == "darwin"* || "$OSTYPE" == "linux"* ]]; then
    echo "Detected platform: $OSTYPE - proceeding with permission fixes"
else
    echo -e "${RED}This script is only needed on macOS or Linux. Exiting.${NC}"
    exit 0
fi

# Define the Python directory
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PYTHON_DIR="$APP_DIR/bin/python"
PYTHON_EMBED_DIR="$PYTHON_DIR/python_embed"

if [ ! -d "$PYTHON_DIR" ]; then
    echo -e "${RED}Python directory not found at: $PYTHON_DIR${NC}"
    echo "Please check your installation."
    exit 1
fi

echo "Setting executable permissions on all .exe files in Python directories..."

# Fix permissions in the main Python directory
if [ -d "$PYTHON_DIR" ]; then
    echo "Processing: $PYTHON_DIR"
    find "$PYTHON_DIR" -name "*.exe" -type f -exec chmod +x {} \;
    find "$PYTHON_DIR" -name "*.dll" -type f -exec chmod +x {} \;
    
    # Also fix Python script itself if it exists
    if [ -f "$PYTHON_DIR/python" ]; then
        echo "Making python script executable"
        chmod +x "$PYTHON_DIR/python"
    fi
fi

# Fix permissions in the python_embed directory
if [ -d "$PYTHON_EMBED_DIR" ]; then
    echo "Processing: $PYTHON_EMBED_DIR"
    find "$PYTHON_EMBED_DIR" -name "*.exe" -type f -exec chmod +x {} \;
    find "$PYTHON_EMBED_DIR" -name "*.dll" -type f -exec chmod +x {} \;
    find "$PYTHON_EMBED_DIR" -name "*.pyd" -type f -exec chmod +x {} \;
fi

echo -e "${GREEN}Permissions fixed successfully!${NC}"
echo "You should now be able to run Python through Wine."
echo "If you still have issues, please check the troubleshooting guide."

# Run the test script if available
TEST_SCRIPT="$SCRIPT_DIR/test_python.sh"
if [ -f "$TEST_SCRIPT" ]; then
    echo -e "${BLUE}Running Python test script to verify permissions...${NC}"
    echo
    bash "$TEST_SCRIPT"
fi

exit 0