@echo off
echo ---------------------------------------------
echo    Building FE Infinity for Windows
echo ---------------------------------------------
echo.

set CSC_IDENTITY_AUTO_DISCOVERY=false

echo Running simplified Windows build script...
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