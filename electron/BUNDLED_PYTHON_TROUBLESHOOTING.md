# Bundled Python on macOS Troubleshooting Report

## Issue Summary

The Electron application attempts to use Windows Python through Wine on macOS, but is encountering issues when trying to run the Python executable through Wine. The problem appears to be related to path handling between the macOS filesystem and Wine's virtual Windows filesystem.

## Attempted Solutions

Several approaches were tried to fix the issue:

1. **Path Quoting and Escaping**:
   - Added proper quotes around Python executable and script paths
   - Fixed path separators by converting Unix `/` to Windows `\`
   - Used proper escaping for backslashes in Windows paths

2. **Wine Path Mappings**:
   - Attempted to use Wine's Z: drive mapping for accessing Unix paths
   - Converted absolute macOS paths to Wine-compatible Windows paths
   - Created a path conversion function to handle different path formats

3. **Simplified Execution Strategy**:
   - Changed from executing Python with a complex `-c` command to using a script file
   - Created a Python script file with the necessary imports and code
   - Used a simpler command line to execute Python with the script file

4. **Improved Batch File Approach**:
   - Added diagnostic output to verify Python and script existence
   - Created a Python script inline using echo commands in the batch file
   - Added detailed error checking and path verification

5. **Enhanced Wine Execution**:
   - Created a Bash wrapper script to run Wine with correct environment
   - Added detailed debugging information to diagnose Wine issues
   - Used full absolute paths for all file references

## Current Status

Despite these attempts, the application is still encountering an error. The logs show:

```
Python executable NOT found
Python script found
Starting game engine...
Can't recognize '"Z:\Users\silver\Documents\Dev\personal\Infinit\fe-infinity-lt\electron\bin\python\python.exe" run_game_simple.py' as an internal or external command, or batch script.
Game process closed with code 49
```

The key issues appear to be:

1. The bundled Python executable is not found in Wine's filesystem (`Python executable NOT found`)
2. The command syntax is not recognized by the Windows command prompt through Wine

## Root Cause Analysis

Based on the error messages and our troubleshooting, the root cause is likely one of these issues:

1. **Missing Python Environment**: The Python executable file exists on the macOS filesystem but is not properly accessible within the Wine virtual filesystem. Wine's Z: drive mapping (which maps to the Unix root) may not be working as expected.

2. **Path Format Issues**: The conversion between Unix and Windows paths may be incorrect or inconsistent, leading to Wine being unable to locate the executable.

3. **Wine Configuration**: The Wine prefix might not be properly set up, or Wine may be unable to properly execute the Python executable.

4. **Command Syntax**: The way the command is being constructed may not be valid Windows command syntax when passed through Wine.

## Next Steps

Here are recommended approaches to resolve the issue:

1. **Verify Wine and Python Setup**:
   - Test a simple Wine Python execution directly from the command line, outside Electron
   - Verify the Python executable is properly extracted and has execute permissions
   - Check that Wine can access the Python directory using a simple test script

2. **Test Direct Wine Python Execution**:
   - Create a simple test script in the terminal:
   ```bash
   wine cmd /c "dir Z:\Users\silver\Documents\Dev\personal\Infinit\fe-infinity-lt\electron\bin\python"
   wine Z:\Users\silver\Documents\Dev\personal\Infinit\fe-infinity-lt\electron\bin\python\python.exe -c "print('Hello from Python')"
   ```

3. **Alternative Wine Command Syntax**:
   - Try using `wine start` or direct execution without `cmd /c`
   - Use Windows-style paths exclusively within Wine commands
   - Experiment with different quotes and escaping patterns

4. **Restructure Wine Integration**:
   - Consider creating a Wine-specific Python launcher script
   - Use a simpler, more reliable approach to Wine/Python integration
   - Package the Python environment in a way that's better structured for Wine access

5. **Last Resort Options**:
   - Consider using a native macOS Python installation with a compatibility layer
   - Explore containerization options like Docker for running the Python code
   - Evaluate alternatives to Wine for running Windows Python on macOS

## Technical Details

### Environment Information
- **macOS Version**: 15.3.2
- **Architecture**: arm64
- **Wine Version**: /opt/homebrew/bin/wine
- **Python Path**: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron/bin/python/python.exe
- **Project Structure**:
  - Electron app in `/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron`
  - LT Maker fork in `/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork`
  - Bundled Python in `/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron/bin/python`

### Wine Path Mapping
Wine maps the Unix filesystem to the Z: drive. For example:
- Unix path: `/Users/silver/Documents`
- Wine path: `Z:\Users\silver\Documents`

This mapping is critical for accessing files from the host filesystem within Wine.

### Python Script Setup
The application creates a Python script that:
1. Adds the LT Maker path to the Python import path
2. Sets the PYTHONPATH environment variable
3. Imports the run_engine_for_project module
4. Calls the main function with the project path

### Wine Script Execution
The execution strategy uses multiple layers:
1. A Bash script that sets up the environment and calls Wine
2. Wine running cmd.exe with a batch file
3. The batch file setting up the Python environment and running Python
4. Python executing the game engine code

Each layer adds complexity and potential points of failure.

## Conclusion

The issue appears to be primarily related to Wine's ability to access and execute the bundled Python environment from within the Electron application. A more direct and simpler approach to Wine/Python integration may be needed, with careful attention to path handling and Wine filesystem access.

Testing outside the Electron application first to establish a working Wine/Python execution pattern is recommended before integrating this into the Electron codebase.

## Logs:

```
(base) silver@Silver electron % pnpm dev

> fe-infinity@1.0.0 dev /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron
> concurrently "cd ../client && pnpm dev" "wait-on http://localhost:5173 && electron . --dev"

[0] 
[0] > client@0.0.0 dev /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/client
[0] > vite
[0] 
[0] 
[0]   VITE v6.2.1  ready in 220 ms
[0] 
[0]   ➜  Local:   http://localhost:5173/
[0]   ➜  Network: use --host to expose
[1] Electron app logs initialized at: /Users/silver/Library/Logs/FE Infinity/electron-2025-03-30T19-42-25-826Z.log 
[1] Application starting {
[1]   version: '1.0.0',
[1]   environment: undefined,
[1]   platform: 'darwin',
[1]   arch: 'arm64',
[1]   appPath: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron',
[1]   resourcesPath: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron/node_modules/.pnpm/electron@35.0.0/node_modules/electron/dist/Electron.app/Contents/Resources',
[1]   userDataPath: '/Users/silver/Library/Application Support/FE Infinity'
[1] }
[1] Wine is installed and available in PATH 
[1] Set macOS dock icon from local path 
[1] Splash window created 
[1] Set environment variables {
[1]   ELECTRON_LOG_DIR: '/Users/silver/Library/Logs/FE Infinity',
[1]   APP_PATH: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron',
[1]   RESOURCES_PATH: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron/node_modules/.pnpm/electron@35.0.0/node_modules/electron/dist/Electron.app/Contents/Resources',
[1]   USER_DATA_PATH: '/Users/silver/Library/Application Support/FE Infinity'
[1] }
[1] macOS version: 15.3.2 
[1] Homebrew path: /opt/homebrew/bin/brew 
[1] Deno via Homebrew: Not installed 
[1] Deno in PATH: /Users/silver/.deno/bin/deno 
[1] Server directory exists: true {
[1]   path: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/server'
[1] }
[1] LT Maker directory exists: true {
[1]   path: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork'
[1] }
[1] Initializing Python environment for game engine... 
[1] Preparing Python environment by pre-installing dependencies... 
[1] Skipping dependency pre-installation on non-Windows platform 
[1] Python environment initialized 
[1] Starting server components... 
[1] Starting server components { isDev: true, platform: 'darwin' }
[1] Bundled Python: found {
[1]   path: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron/bin/python/python'
[1] }
[1] Found Wine in PATH: /opt/homebrew/bin/wine 
[1] Using bundled Python with Wine: /opt/homebrew/bin/wine 
[1] Starting Deno server... 
[1] Using bundled Deno: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron/bin/deno 
[1] Using bundled Deno: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron/bin/deno
[1] Starting Deno server with command: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron/bin/deno 
[1] Starting Deno server with command: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron/bin/deno
[1] Path information {
[1]   electronAppRoot: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron',
[1]   resourcesPath: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron/node_modules/.pnpm/electron@35.0.0/node_modules/electron/dist/Electron.app/Contents/Resources',
[1]   ltMakerPath: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork',
[1]   serverPath: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/server'
[1] }
[1] Electron app root path: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron
[1] Resources path: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron/node_modules/.pnpm/electron@35.0.0/node_modules/electron/dist/Electron.app/Contents/Resources
[1] LT Maker path: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork
[1] Server path: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/server
[1] LT Maker directory exists 
[1] LT Maker directory exists
[1] Using log directory for Deno server: /Users/silver/Library/Logs/FE Infinity 
[1] Deno server command {
[1]   command: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron/bin/deno',
[1]   args: [ 'run', '--allow-all', 'server.ts' ],
[1]   cwd: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/server',
[1]   env: {
[1]     ELECTRON_APP_ROOT: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron',
[1]     RESOURCES_PATH: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron/node_modules/.pnpm/electron@35.0.0/node_modules/electron/dist/Electron.app/Contents/Resources',
[1]     LT_MAKER_PATH: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork',
[1]     SERVER_DIR: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/server',
[1]     DENO_ENV: 'development'
[1]   }
[1] }
[1] 2025-03-30 14:42:26.495 Electron[29719:995720] +[IMKClient subclass]: chose IMKClient_Modern
[1] 2025-03-30 14:42:26.495 Electron[29719:995720] +[IMKInputSession subclass]: chose IMKInputSession_Modern
[1] Deno server output: Running in Electron environment, using SQLite at: /Users/silver/Library/Application Support/FE Infinity/data/sqlite.db
[1]  
[1] Deno server: Running in Electron environment, using SQLite at: /Users/silver/Library/Application Support/FE Infinity/data/sqlite.db
[1] 
[1] All server components started successfully 
[1] All server components started successfully
[1] Server components started successfully 
[1] Starting game launcher HTTP server on port 8989... 
[1] Running in development mode
[1] Main window created 
[1] Game launcher HTTP server running on port 8989 
[1] Game launcher HTTP server started successfully
[1] Deno server output: Starting server - Electron, Development, OS: darwin
[1] Initializing vector database for Electron environment...
[1] Initializing vector database for Electron environment...
[1] Initializing vector database at: /Users/silver/Library/Application Support/FE Infinity/vector-db-data
[1] Server initialized, starting HTTP server...
[1] Listening on http://localhost:8000/
[1]  
[1] Deno server: Starting server - Electron, Development, OS: darwin
[1] Initializing vector database for Electron environment...
[1] Initializing vector database for Electron environment...
[1] Initializing vector database at: /Users/silver/Library/Application Support/FE Infinity/vector-db-data
[1] Server initialized, starting HTTP server...
[1] Listening on http://localhost:8000/
[1] 
[1] Deno server output: Loaded 36 vectors for maps
[1] Loaded 56 vectors for portraits-male
[1] Loaded 44 vectors for portraits-female
[1] Loaded 68 vectors for music
[1] Loaded 151 vectors for items
[1] Vector database initialized
[1] Found 36 existing map vectors
[1] Vectors already exist, skipping seeding
[1] Vector database initialization complete
[1]  
[1] Deno server: Loaded 36 vectors for maps
[1] Loaded 56 vectors for portraits-male
[1] Loaded 44 vectors for portraits-female
[1] Loaded 68 vectors for music
[1] Loaded 151 vectors for items
[1] Vector database initialized
[1] Found 36 existing map vectors
[1] Vectors already exist, skipping seeding
[1] Vector database initialization complete
[1] 
[1] Deno server output: Vector database initialized for Electron
[1]  
[1] Deno server: Vector database initialized for Electron
[1] 
[1] [29719:0330/144227.060181:ERROR:CONSOLE(1)] "Request Autofill.enable failed. {"code":-32601,"message":"'Autofill.enable' wasn't found"}", source: devtools://devtools/bundled/core/protocol_client/protocol_client.js (1)
[1] [29719:0330/144227.060223:ERROR:CONSOLE(1)] "Request Autofill.setAddresses failed. {"code":-32601,"message":"'Autofill.setAddresses' wasn't found"}", source: devtools://devtools/bundled/core/protocol_client/protocol_client.js (1)
[1] Deno server output: [Path Resolver] Found lt-maker-fork at: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork
[1] [Path Resolver] Search path sequence: Current working directory: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/server -> Running in Electron environment -> Trying path: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron/lt-maker-fork -> Trying path: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork
[1]  
[1] Deno server: [Path Resolver] Found lt-maker-fork at: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork
[1] [Path Resolver] Search path sequence: Current working directory: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/server -> Running in Electron environment -> Trying path: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron/lt-maker-fork -> Trying path: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork
[1] 
[1] Deno server output: [Path Resolver] Accessing: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork/testing_proj.ltproj/metadata.json
[1]  
[1] Deno server: [Path Resolver] Accessing: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork/testing_proj.ltproj/metadata.json
[1] 
[1] Deno server output: Found metadata.json at /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork/testing_proj.ltproj/metadata.json
[1] Running game in Electron environment: testing_proj.ltproj
[1]  
[1] Deno server: Found metadata.json at /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork/testing_proj.ltproj/metadata.json
[1] Running game in Electron environment: testing_proj.ltproj
[1] 
[1] Deno server output: Attempting to run game: testing_proj.ltproj
[1]  
[1] Deno server: Attempting to run game: testing_proj.ltproj
[1] 
[1] Received run-game request { body: '{"projectPath":"testing_proj.ltproj"}' }
[1] Found lt-maker-fork at: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork 
[1] Looking for project at: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork/testing_proj.ltproj 
[1] HTTP endpoint received request to run game: testing_proj.ltproj 
[1] Running game with Wine {
[1]   projectPath: 'testing_proj.ltproj',
[1]   appPath: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron',
[1]   resourcesPath: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron/node_modules/.pnpm/electron@35.0.0/node_modules/electron/dist/Electron.app/Contents/Resources',
[1]   platform: 'darwin',
[1]   arch: 'arm64'
[1] }
[1] Path resolution for game launcher {
[1]   appPath: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron',
[1]   ltMakerPath: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork'
[1] }
[1] Found Wine in PATH: /opt/homebrew/bin/wine
[1] Using Wine at: /opt/homebrew/bin/wine 
[1] Running game with normalized path: testing_proj.ltproj 
[1] Using existing Wine prefix: /Users/silver/.wine
[1] Python environment variables {
[1]   PYTHONPATH: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork:/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron/bin/python/Lib/site-packages',
[1]   PYTHONHOME: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron/bin/python'
[1] }
[1] Using Python executable with Wine: /Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/electron/bin/python/python.exe 
[1] Created temporary batch file: /var/folders/gb/ptv_xdk90xq4m2qqvqs7bcn00000gn/T/run_game.bat 
[1] Batch file content: @echo off
[1] cd /d "Z:\Users\silver\Documents\Dev\personal\Infinit\fe-infinity-lt\lt-maker-fork"
[1] set PYTHONPATH=Z:\Users\silver\Documents\Dev\personal\Infinit\fe-infinity-lt\lt-maker-fork
[1] 
[1] REM Debug information
[1] echo Python executable: "Z:\Users\silver\Documents\Dev\personal\Infinit\fe-infinity-lt\electron\bin\python\python.exe"
[1] echo Python script: "Z:\var\folders\gb\ptv_xdk90xq4m2qqvqs7bcn00000gn\T\run_game.py"
[1] echo Current directory: d%
[1] 
[1] REM Check if Python executable exists
[1] if exist "Z:\Users\silver\Documents\Dev\personal\Infinit\fe-infinity-lt\electron\bin\python\python.exe" (
[1]     echo Python executable found
[1] ) else (
[1]     echo Python executable NOT found
[1] )
[1] 
[1] REM Check if the Python script exists
[1] if exist "Z:\var\folders\gb\ptv_xdk90xq4m2qqvqs7bcn00000gn\T\run_game.py" (
[1]     echo Python script found
[1] ) else (
[1]     echo Python script NOT found
[1] )
[1] 
[1] REM Create a simplified script inline
[1] echo import sys > run_game_simple.py
[1] echo import os >> run_game_simple.py
[1] echo sys.path.insert(0, r'Z:\Users\silver\Documents\Dev\personal\Infinit\fe-infinity-lt\lt-maker-fork') >> run_game_simple.py
[1] echo os.environ['PYTHONPATH'] = r'Z:\Users\silver\Documents\Dev\personal\Infinit\fe-infinity-lt\lt-maker-fork' + os.pathsep + os.environ.get('PYTHONPATH', '') >> run_game_simple.py
[1] echo import run_engine_for_project >> run_game_simple.py
[1] echo run_engine_for_project.main('testing_proj.ltproj') >> run_game_simple.py
[1] 
[1] REM Run the game with proper Python configuration
[1] echo Starting game engine...
[1] "Z:\Users\silver\Documents\Dev\personal\Infinit\fe-infinity-lt\electron\bin\python\python.exe" run_game_simple.py
[1] 
[1] Executing command: /opt/homebrew/bin/wine cmd /c /var/folders/gb/ptv_xdk90xq4m2qqvqs7bcn00000gn/T/run_game.bat {
[1]   cwd: '/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork',
[1]   wineDebug: '-all',
[1]   winePrefix: '/Users/silver/.wine'
[1] }
[1] Created Wine wrapper script at /var/folders/gb/ptv_xdk90xq4m2qqvqs7bcn00000gn/T/run-wine.sh 
[1] Script content: #!/bin/bash
[1] # Run Wine with the enhanced batch file that installs dependencies
[1] cd "/Users/silver/Documents/Dev/personal/Infinit/fe-infinity-lt/lt-maker-fork"
[1] export WINEDEBUG=-all
[1] export WINEPREFIX=/Users/silver/.wine
[1] 
[1] # Set Python environment variables
[1] export PYTHONIOENCODING=utf-8
[1] export PYTHONUNBUFFERED=1
[1] 
[1] # Debug info to help diagnose path issues
[1] echo "Running Wine with batch file at: /var/folders/gb/ptv_xdk90xq4m2qqvqs7bcn00000gn/T/run_game.bat"
[1] echo "Wine executable: /opt/homebrew/bin/wine"
[1] echo "Wine batch path: Z:\var\folders\gb\ptv_xdk90xq4m2qqvqs7bcn00000gn\T\run_game.bat"
[1] 
[1] # Make sure the batch file is accessible to Wine
[1] ls -la "/var/folders/gb/ptv_xdk90xq4m2qqvqs7bcn00000gn/T/run_game.bat"
[1] 
[1] # Run Wine with cmd to execute the batch file using Wine's Z: drive mapping for absolute paths
[1] "/opt/homebrew/bin/wine" cmd /c "Z:\var\folders\gb\ptv_xdk90xq4m2qqvqs7bcn00000gn\T\run_game.bat" 2>&1 
[1] Running wine wrapper at: /var/folders/gb/ptv_xdk90xq4m2qqvqs7bcn00000gn/T/run-wine.sh 
[1] Executing: /bin/bash /var/folders/gb/ptv_xdk90xq4m2qqvqs7bcn00000gn/T/run-wine.sh 
[1] Game stdout: Running Wine with batch file at: /var/folders/gb/ptv_xdk90xq4m2qqvqs7bcn00000gn/T/run_game.bat
[1] Wine executable: /opt/homebrew/bin/wine
[1] Wine batch path: Z:\var\folders\gb\ptv_xdk90xq4m2qqvqs7bcn00000gn\T\run_game.bat 
[1] Game stdout: -rw-r--r--@ 1 silver  staff  1604 Mar 30 14:42 /var/folders/gb/ptv_xdk90xq4m2qqvqs7bcn00000gn/T/run_game.bat 
[1] Game stdout: 2025-03-30 14:42:30.138 wine-preloader[29772:996211] +[IMKClient subclass]: chose IMKClient_Modern 
[1] Game stdout: Python executable: "Z:\Users\silver\Documents\Dev\personal\Infinit\fe-infinity-lt\electron\bin\python\python.exe" 
[1] Game stdout: Python script: "Z:\var\folders\gb\ptv_xdk90xq4m2qqvqs7bcn00000gn\T\run_game.py" 
[1] Game stdout: Current directory: Z:\Users\silver\Documents\Dev\personal\Infinit\fe-infinity-lt\lt-maker-fork 
[1] Game stdout:  
[1] Game stdout: Python executable NOT found 
[1] Game stdout: Python script found 
[1] Game stdout:  
[1] Game stdout: Starting game engine... 
[1] Game stdout: Can't recognize '"Z:\Users\silver\Documents\Dev\personal\Infinit\fe-infinity-lt\electron\bin\python\python.exe" run_game_simple.py' as an internal or external command, or batch script. 
[1] Game process closed with code 49 
[1] Game launch requested successfully 
[1] Wine process exited with non-zero code: 49
```
