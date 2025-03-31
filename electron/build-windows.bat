@echo off
echo ---------------------------------------------
echo    Building FE Infinity for Windows
echo ---------------------------------------------
echo.

REM Set environment variables
set CSC_IDENTITY_AUTO_DISCOVERY=false
set APP_NAME=FE Infinity

echo 1. Preparing environment...
if not exist resources mkdir resources

REM Copy icon to resources directory
echo 2. Setting up application icon...
if exist icons\icons\win\icon.ico (
    copy /Y icons\icons\win\icon.ico resources\icon.ico
    echo Icon copied to resources folder
) else (
    echo Warning: Icon file not found at icons\icons\win\icon.ico
)

echo 3. Running build script...
node scripts\build-windows.js

if %ERRORLEVEL% EQU 0 (
  echo.
  echo ============================================================
  echo    Build successful! Installer is in the release folder.
  echo ============================================================
) else (
  echo.
  echo ============================================================
  echo    Build failed with error code %ERRORLEVEL%
  echo    See the output above for details.
  echo ============================================================
)

pause