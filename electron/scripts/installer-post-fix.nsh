; This script runs after installation is complete
; It attempts to fix the Windows icon after installation

!macro customInstall
  ; Start copying the icon
  DetailPrint "Setting up application icon..."
  
  ; Copy the icon file to the application exe
  SetOutPath "$INSTDIR"
  
  ; Check if the icon file exists in resources
  IfFileExists "$INSTDIR\resources\app.ico" 0 checkAlt
    DetailPrint "Found icon at: $INSTDIR\resources\app.ico"
    File /oname=$PLUGINSDIR\rcedit.exe "$INSTDIR\resources\app.asar.unpacked\tools\rcedit-x64.exe"
    nsExec::ExecToLog '"$PLUGINSDIR\rcedit.exe" "$INSTDIR\FE Infinity.exe" --set-icon "$INSTDIR\resources\app.ico"'
    Goto iconFinished
  
  checkAlt:
  ; Check in alternate location
  IfFileExists "$INSTDIR\app.ico" 0 iconMissing
    DetailPrint "Found icon at alternate location: $INSTDIR\app.ico"
    File /oname=$PLUGINSDIR\rcedit.exe "$INSTDIR\resources\app.asar.unpacked\tools\rcedit-x64.exe"
    nsExec::ExecToLog '"$PLUGINSDIR\rcedit.exe" "$INSTDIR\FE Infinity.exe" --set-icon "$INSTDIR\app.ico"'
    Goto iconFinished
  
  iconMissing:
    DetailPrint "Icon file not found. Icon will not be applied automatically."
    DetailPrint "You can run fix-icon.bat from the installation directory to apply the icon later."
  
  iconFinished:
    ; Clear the icon cache
    DetailPrint "Clearing Windows icon cache..."
    nsExec::ExecToLog "ie4uinit.exe -ClearIconCache"
    nsExec::ExecToLog "ie4uinit.exe -show"
    
    DetailPrint "Icon setup complete."
!macroend 