#!/bin/bash
# Comprehensive Wine Python verification script
# This script can be run from anywhere to diagnose Wine/Python issues

# Terminal colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# App paths
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PYTHON_DIR="$APP_DIR/bin/python"
LT_MAKER_DIR="$(cd "$APP_DIR/../lt-maker-fork" 2>/dev/null || echo "$APP_DIR/lt-maker-fork")"

# Print app paths for debugging
echo "APP_DIR: $APP_DIR"
echo "PYTHON_DIR: $PYTHON_DIR"
echo "LT_MAKER_DIR: $LT_MAKER_DIR"

echo -e "${YELLOW}================================================${NC}"
echo -e "${YELLOW}     Wine Python Environment Verification      ${NC}"
echo -e "${YELLOW}================================================${NC}"

# Function to test if a command exits successfully
test_cmd() {
    local cmd="$1"
    local desc="$2"
    
    echo -e "${BLUE}Testing: $desc${NC}"
    echo -e "${YELLOW}Command: $cmd${NC}"
    
    eval "$cmd" > /tmp/wine_python_test.out 2>&1
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✓ Success (exit code: $exit_code)${NC}"
        echo -e "${YELLOW}Output: $(cat /tmp/wine_python_test.out | head -n 3)${NC}"
        if [ "$(wc -l < /tmp/wine_python_test.out)" -gt 3 ]; then
            echo -e "${YELLOW}(output truncated...)${NC}"
        fi
        
        # Increment success counter
        SUCCESS_COUNT=$((SUCCESS_COUNT+1))
    else
        echo -e "${RED}✗ Failed (exit code: $exit_code)${NC}"
        echo -e "${RED}Error output:${NC}"
        cat /tmp/wine_python_test.out
    fi
    echo ""
    
    return $exit_code
}

# Initialize success counter
SUCCESS_COUNT=0

# 1. Check Wine installation
echo -e "${YELLOW}1. Checking Wine installation${NC}"
WINE_PATH=$(which wine)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Wine found at: $WINE_PATH${NC}"
    WINE_VERSION=$(wine --version)
    echo -e "${GREEN}✓ Wine version: $WINE_VERSION${NC}"
    SUCCESS_COUNT=$((SUCCESS_COUNT+1))
else
    echo -e "${RED}✗ Wine not found in PATH. Please install Wine using: brew install --cask --no-quarantine wine-stable${NC}"
    exit 1
fi

# 2. Check Python executable
echo -e "\n${YELLOW}2. Checking Python executables${NC}"
PYTHON_EXES=(
    "$PYTHON_DIR/python_embed/python.exe"  # Primary location
    "$PYTHON_DIR/win_python_env/Scripts/python.exe"  # Windows venv location
    "$PYTHON_DIR/python.exe"  # Alternative location
)

FOUND_PYTHON=0
for PYTHON_EXE in "${PYTHON_EXES[@]}"; do
    if [ -f "$PYTHON_EXE" ]; then
        echo -e "${GREEN}✓ Python executable found at: $PYTHON_EXE${NC}"
        FOUND_PYTHON=1
        WORKING_PYTHON="$PYTHON_EXE"
        
        # Check file type
        FILE_TYPE=$(file "$PYTHON_EXE")
        echo -e "${YELLOW}  File type: $FILE_TYPE${NC}"
        
        # Check permissions
        PERMS=$(ls -la "$PYTHON_EXE" | awk '{print $1}')
        echo -e "${YELLOW}  Permissions: $PERMS${NC}"
        
        # Make executable if needed
        if [[ "$PERMS" != *x* ]]; then
            echo -e "${YELLOW}  Adding execute permission...${NC}"
            chmod +x "$PYTHON_EXE"
        fi
        
        break  # Use the first Python we find
    else
        echo -e "${RED}✗ Python executable not found at: $PYTHON_EXE${NC}"
    fi
done

if [ $FOUND_PYTHON -eq 0 ]; then
    echo -e "${RED}✗ No Python executables found. Cannot proceed.${NC}"
    exit 1
fi

# 3. Check Wine Z: drive mapping
echo -e "\n${YELLOW}3. Testing Wine Z: drive mapping${NC}"
test_cmd "wine cmd /c 'dir Z:\\'" "Wine Z: drive listing"

# 4. Try to run Python with Wine
echo -e "\n${YELLOW}4. Testing Python execution through Wine${NC}"
test_cmd "wine \"$WORKING_PYTHON\" -c \"print('Hello from Wine Python')\"" "Basic Python execution"

# 5. Check Python imports
echo -e "\n${YELLOW}5. Testing Python imports${NC}"
test_cmd "wine \"$WORKING_PYTHON\" -c \"import sys; print('Python version:', sys.version)\"" "Python version"
test_cmd "wine \"$WORKING_PYTHON\" -c \"import os; print('Current dir:', os.getcwd())\"" "OS module"
test_cmd "wine \"$WORKING_PYTHON\" -c \"try: import pygame; print('Pygame version:', pygame.__version__); except ImportError: print('Pygame NOT found')\"" "Pygame import"
test_cmd "wine \"$WORKING_PYTHON\" -c \"try: import typing_extensions; print('typing_extensions found'); except ImportError: print('typing_extensions NOT found')\"" "typing_extensions import"

# 6. Test Python import paths
echo -e "\n${YELLOW}6. Testing Python import paths${NC}"
# Create a temporary script to print sys.path
TEMP_SCRIPT="/tmp/print_path.py"
cat > "$TEMP_SCRIPT" <<EOF
import sys
print("Python import paths:")
for i, path in enumerate(sys.path):
    print(f"{i}: {path}")
EOF

test_cmd "wine \"$WORKING_PYTHON\" \"Z:$TEMP_SCRIPT\"" "Python import paths"

# 7. Test LT Maker import
echo -e "\n${YELLOW}7. Testing LT Maker import${NC}"
# Create a temporary script that tries to import from LT Maker
TEMP_LT_SCRIPT="/tmp/test_lt_import.py"
cat > "$TEMP_LT_SCRIPT" <<EOF
import sys
import os

print(f"Current directory: {os.getcwd()}")

# Add LT Maker to Python path
lt_maker_path = r'Z:${LT_MAKER_DIR}'
print(f"LT Maker path: {lt_maker_path}")
print(f"Path exists: {os.path.exists(lt_maker_path)}")

sys.path.insert(0, lt_maker_path)
print(f"Added LT Maker to path: {sys.path[0]}")

# Try to import
try:
    # First try importing a simple module
    from app import constants
    print("Successfully imported app.constants")
    
    # Try importing run_engine_for_project
    try:
        import run_engine_for_project
        print("Successfully imported run_engine_for_project")
    except ImportError as e:
        print(f"Could not import run_engine_for_project: {e}")
except Exception as e:
    print(f"Import error: {e}")
    import traceback
    traceback.print_exc()
    
# List files in LT Maker directory
try:
    files = os.listdir(lt_maker_path)
    print(f"Files in LT Maker directory (first 5): {files[:5]}")
except Exception as e:
    print(f"Error listing LT Maker files: {e}")
EOF

test_cmd "wine \"$WORKING_PYTHON\" \"Z:$TEMP_LT_SCRIPT\"" "LT Maker import"

# 8. Test writing a file with Wine Python
echo -e "\n${YELLOW}8. Testing file writing with Wine Python${NC}"
TEMP_WRITE_SCRIPT="/tmp/test_write.py"
cat > "$TEMP_WRITE_SCRIPT" <<EOF
import os

# Write to a file in both Windows C: drive and Z: drive
test_file_c = r'C:\\wine_python_test_file.txt'
test_file_z = r'Z:${SCRIPT_DIR}/wine_python_test_file.txt'

print(f"Writing to C: drive: {test_file_c}")
try:
    with open(test_file_c, 'w') as f:
        f.write("Test file written by Wine Python to C:")
    print(f"Successfully wrote to {test_file_c}")
except Exception as e:
    print(f"C: drive file operation error: {e}")

print(f"Writing to Z: drive: {test_file_z}")
try:
    with open(test_file_z, 'w') as f:
        f.write("Test file written by Wine Python to Z:")
    print(f"Successfully wrote to {test_file_z}")
except Exception as e:
    print(f"Z: drive file operation error: {e}")
EOF

test_cmd "wine \"$WORKING_PYTHON\" \"Z:$TEMP_WRITE_SCRIPT\"" "File write test"

# Check if the Z: drive file was created
if [ -f "${SCRIPT_DIR}/wine_python_test_file.txt" ]; then
    echo -e "${GREEN}✓ Successfully wrote file to host filesystem${NC}"
    cat "${SCRIPT_DIR}/wine_python_test_file.txt"
    rm "${SCRIPT_DIR}/wine_python_test_file.txt"
else
    echo -e "${RED}✗ Failed to write file to host filesystem${NC}"
fi

# 9. Test batch file execution
echo -e "\n${YELLOW}9. Testing batch file execution${NC}"
TEMP_BATCH="/tmp/test_wine_python.bat"
cat > "$TEMP_BATCH" <<EOF
@echo off
echo Running Python from batch file...
cd /d "Z:${SCRIPT_DIR}"
set PYTHONPATH=Z:${LT_MAKER_DIR}
echo Current directory: %cd%
echo PYTHONPATH: %PYTHONPATH%
"${WORKING_PYTHON}" -c "import sys, os; print('Python from batch:', sys.version); print('Working dir:', os.getcwd()); print('PYTHONPATH:', os.environ.get('PYTHONPATH', 'Not set'))"
echo Batch file execution complete
EOF

test_cmd "wine cmd /c \"Z:$TEMP_BATCH\"" "Batch file execution"

# 10. Test full game launch simulation
echo -e "\n${YELLOW}10. Testing simplified game launch${NC}"
GAME_BATCH="/tmp/test_game_simple.bat"
cat > "$GAME_BATCH" <<EOF
@echo off
cd /d "Z:${LT_MAKER_DIR}"
set PYTHONPATH=Z:${LT_MAKER_DIR}

echo Python executable: "Z:${WORKING_PYTHON}"
echo LT Maker path: Z:${LT_MAKER_DIR}
echo Current directory: %cd%

echo Creating test script...
echo import sys > test_run.py
echo import os >> test_run.py
echo sys.path.insert(0, r'Z:${LT_MAKER_DIR}') >> test_run.py
echo print(f"Python version: {sys.version}") >> test_run.py
echo print(f"Working directory: {os.getcwd()}") >> test_run.py
echo print(f"PYTHONPATH: {os.environ.get('PYTHONPATH', 'Not set')}") >> test_run.py
echo try: >> test_run.py
echo     from app import constants >> test_run.py
echo     print("Successfully imported app.constants") >> test_run.py
echo except Exception as e: >> test_run.py
echo     print(f"Import error: {e}") >> test_run.py

echo Running test script...
"Z:${WORKING_PYTHON}" test_run.py
EOF

test_cmd "wine cmd /c \"Z:$GAME_BATCH\"" "Simplified game launch"

# 11. Test Python with pip installation (if needed)
echo -e "\n${YELLOW}11. Testing pip availability${NC}"
test_cmd "wine \"$WORKING_PYTHON\" -m pip --version" "Pip availability"

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Pip not available, attempting to install...${NC}"
    test_cmd "wine \"$WORKING_PYTHON\" -m ensurepip" "Install pip using ensurepip"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Pip installed successfully${NC}"
        test_cmd "wine \"$WORKING_PYTHON\" -m pip --version" "Verify pip installation"
    else
        echo -e "${RED}✗ Failed to install pip${NC}"
    fi
fi

echo -e "\n${YELLOW}==============================================${NC}"
echo -e "${YELLOW}                Summary Report                 ${NC}"
echo -e "${YELLOW}==============================================${NC}"

echo -e "${YELLOW}Wine: $WINE_PATH ($WINE_VERSION)${NC}"
echo -e "${YELLOW}Working Python: $WORKING_PYTHON${NC}"
echo -e "${YELLOW}LT Maker directory: $LT_MAKER_DIR${NC}"
echo -e "${YELLOW}Tests passed: $SUCCESS_COUNT / 11${NC}"

# Check if most tests succeeded
if [ $SUCCESS_COUNT -gt 7 ]; then
    echo -e "${GREEN}The environment appears to be mostly working!${NC}"
else
    echo -e "${RED}There appear to be significant issues with the Wine Python environment.${NC}"
fi

echo -e "\n${YELLOW}Recommendations:${NC}"
echo "1. Ensure Wine is properly configured (run 'winecfg' to check)"
echo "2. Verify Python executable permissions (chmod +x)"
echo "3. Check that the Z: drive mapping works in Wine"
echo "4. Add execute permissions to all .exe files: find $PYTHON_DIR -name \"*.exe\" -exec chmod +x {} \\;"
echo "5. If pygame is missing, install it: wine \"$WORKING_PYTHON\" -m pip install pygame"
echo "6. If all else fails, try resetting the Wine prefix: rm -rf ~/.wine && winecfg"

# Save output to a log file
LOG_FILE="$SCRIPT_DIR/test_results.txt"
echo "Saving test results to: $LOG_FILE"
echo "Test run at $(date)" > "$LOG_FILE"
echo "Wine: $WINE_PATH ($WINE_VERSION)" >> "$LOG_FILE"
echo "Python: $WORKING_PYTHON" >> "$LOG_FILE"
echo "Tests passed: $SUCCESS_COUNT / 11" >> "$LOG_FILE"
echo "==============================================" >> "$LOG_FILE"
cat /tmp/wine_python_test.out >> "$LOG_FILE"

# Make script executable
chmod +x "$0"

exit 0