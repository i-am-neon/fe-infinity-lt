@echo off
echo Building FE Infinity for Windows (without signing)...

rem Set environment variables to disable signing
set CSC_IDENTITY_AUTO_DISCOVERY=false

rem Build with electron-builder and custom config
npx electron-builder --win --config.win.signAndEditExecutable=false --config.win.forceCodeSigning=false --config.win.certificateFile=null

if %ERRORLEVEL% EQU 0 (
  echo Build completed successfully!
  echo Installer should be in the release directory
) else (
  echo Build failed with error code %ERRORLEVEL%
)

pause