@echo off
rem Windows Icon Fix Script
rem This script must be run on Windows after installing the application
rem It uses Resource Hacker to directly inject the icon into the executable

echo ===== FE Infinity Icon Fix =====
echo This script will fix the application icon on Windows

rem Get the install location - typically in Program Files or AppData
set INSTALL_DIR=%LOCALAPPDATA%\Programs\fe-infinity
set EXE_PATH=%INSTALL_DIR%\FE Infinity.exe

rem Check if the executable exists
if not exist "%EXE_PATH%" (
  echo ERROR: Application not found at %EXE_PATH%
  echo Please check your installation or provide the correct path
  goto :EOF
)

echo Found application at: %EXE_PATH%

rem Download Resource Hacker if not already present
set RH_ZIP=%TEMP%\reshacker.zip
set RH_PATH=%TEMP%\ResourceHacker\ResourceHacker.exe

if not exist "%RH_PATH%" (
  echo Downloading Resource Hacker...
  powershell -Command "Invoke-WebRequest -Uri 'http://www.angusj.com/resourcehacker/reshacker_setup.exe' -OutFile '%TEMP%\reshacker_setup.exe'"
  echo Installing Resource Hacker...
  start /wait %TEMP%\reshacker_setup.exe /VERYSILENT /SUPPRESSMSGBOXES /DIR="%TEMP%\ResourceHacker"
)

rem Check if Resource Hacker was installed
if not exist "%RH_PATH%" (
  echo ERROR: Failed to install Resource Hacker
  goto :EOF
)

rem Get our custom icon
set ICON_PATH=%INSTALL_DIR%\resources\app.asar.unpacked\resources\icon.ico
if not exist "%ICON_PATH%" (
  set ICON_PATH=%INSTALL_DIR%\resources\app.asar.unpacked\icons\icons\win\icon.ico
)

if not exist "%ICON_PATH%" (
  echo ERROR: Icon file not found
  goto :EOF
)

echo Found icon at: %ICON_PATH%

rem Backup the original executable
echo Creating backup of original executable...
copy "%EXE_PATH%" "%EXE_PATH%.backup"

rem Use Resource Hacker to change the icon
echo Changing application icon...
"%RH_PATH%" -open "%EXE_PATH%" -save "%EXE_PATH%" -action addoverwrite -res "%ICON_PATH%" -mask ICONGROUP,1,1033

echo Clearing icon cache...
taskkill /f /im explorer.exe
ie4uinit.exe -ClearIconCache
ie4uinit.exe -show
start explorer.exe

echo Done! The application icon should now be updated.
echo You may need to restart your computer for the icon change to take effect.
pause