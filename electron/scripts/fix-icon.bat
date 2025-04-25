@echo off
echo ==================================
echo    FE Infinity Icon Fix Utility
echo ==================================
echo.
echo This tool will fix the application icon.
echo You may need to run this as Administrator.
echo.

setlocal

rem Check if running with admin rights
net session >nul 2>&1
if %errorlevel% neq 0 (
  echo ERROR: This script requires administrator privileges.
  echo Please right-click on this file and select "Run as administrator".
  echo.
  pause
  exit /b 1
)

rem Set paths for the application
set "APP_DIR=%~dp0.."
set "JS_SCRIPT=%APP_DIR%\resources\post-install-icon-fix.js"

if not exist "%JS_SCRIPT%" (
  echo ERROR: Icon fix script not found at:
  echo %JS_SCRIPT%
  echo.
  
  rem Try alternative locations
  set "ALT_SCRIPT=%APP_DIR%\post-install-icon-fix.js"
  if exist "%ALT_SCRIPT%" (
    set "JS_SCRIPT=%ALT_SCRIPT%"
    echo Found script at alternate location.
  ) else (
    echo Script not found at alternate location.
    echo Icon fix cannot proceed.
    pause
    exit /b 1
  )
)

echo Running icon fix script...
node "%JS_SCRIPT%"

if %errorlevel% equ 0 (
  echo.
  echo Icon fix applied successfully!
  echo You may need to restart your computer for the changes to take effect.
) else (
  echo.
  echo Icon fix failed with error code %errorlevel%.
  echo Please check the output above for details.
)

echo.
pause 