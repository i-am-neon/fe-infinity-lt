; This script runs after installation is complete
; It attempts to fix the Windows icon after installation
; Includes process management for handling application closure

!include nsProcess.nsh

!macro customPreInstall
  ; Load the nsProcess plugin
  InitPluginsDir
  File /oname=$PLUGINSDIR\nsProcess.dll "${NSISDIR}\Plugins\x86-unicode\nsProcess.dll"

  ; Attempt to gracefully close any running instances of the application
  DetailPrint "Checking for running instances of FE Infinity..."
  
  ; Try multiple approaches to close the application
  
  ; Method 1: Use taskkill to forcefully terminate processes
  DetailPrint "Trying to close FE Infinity using taskkill..."
  nsExec::ExecToLog 'taskkill /f /im "FE Infinity.exe" /t'
  
  ; Wait a moment to let the process terminate
  Sleep 2000
  
  ; Method 2: Use nsProcess to detect and close processes
  ${nsProcess::FindProcess} "FE Infinity.exe" $R0
  ${If} $R0 == 0
    DetailPrint "FE Infinity is running. Attempting to close..."
    ${nsProcess::KillProcess} "FE Infinity.exe" $R0
    ${If} $R0 == 0
      DetailPrint "Successfully closed FE Infinity using nsProcess."
    ${Else}
      DetailPrint "Could not close FE Infinity automatically. Error code: $R0"
    ${EndIf}
  ${Else}
    DetailPrint "FE Infinity process not detected."
  ${EndIf}
  
  ; Method 3: Try again with alternate executable name
  ${nsProcess::FindProcess} "fe-infinity.exe" $R0
  ${If} $R0 == 0
    DetailPrint "fe-infinity.exe is running. Attempting to close..."
    ${nsProcess::KillProcess} "fe-infinity.exe" $R0
  ${EndIf}
  
  ; Final check if application is still running
  ${nsProcess::FindProcess} "FE Infinity.exe" $R0
  ${If} $R0 == 0
    ; Process is still running, give the user another chance
    MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "FE Infinity is still running and could not be closed automatically. Please close it manually and click Retry." IDRETRY retryClose IDCANCEL abort
    abort:
      Abort "Installation canceled: FE Infinity could not be closed."
    retryClose:
      Goto finalCheck
  ${EndIf}
  
  finalCheck:
  ; Double-check if the process is still running
  ${nsProcess::FindProcess} "FE Infinity.exe" $R0
  ${If} $R0 == 0
    ; Process is still running, last chance to close
    MessageBox MB_YESNO|MB_ICONEXCLAMATION "FE Infinity is still running. Would you like to proceed anyway? (Not recommended)" IDYES continue IDNO retry
    retry:
      Goto finalCheck
  ${EndIf}
  
  continue:
  ; Clean up nsProcess plugin
  ${nsProcess::Unload}
!macroend

!macro customInstall
  ; Start icon setup
  DetailPrint "Setting up application icon..."
  
  ; Set variables to track resources
  StrCpy $R1 "0" ; Found icon flag
  StrCpy $R2 "0" ; Found rcedit flag
  
  ; Check multiple locations for tool and icon, but don't use File commands
  DetailPrint "Checking for icon resources..."
  
  ; First look for icon
  IfFileExists "$INSTDIR\resources\app.ico" foundIcon
  IfFileExists "$INSTDIR\app.ico" foundIconAlt
  Goto noIcon
  
  foundIcon:
    StrCpy $R1 "$INSTDIR\resources\app.ico"
    DetailPrint "Found icon at: $R1"
    Goto checkTool
    
  foundIconAlt:
    StrCpy $R1 "$INSTDIR\app.ico"
    DetailPrint "Found icon at alternate location: $R1"
    Goto checkTool
    
  noIcon:
    DetailPrint "Icon file not found. Icon will not be applied automatically."
    Goto iconFinished
    
  checkTool:
    ; Now look for the rcedit tool without using File commands
    DetailPrint "Looking for rcedit utility..."
    
    ; Check various locations 
    IfFileExists "$INSTDIR\tools\rcedit-x64.exe" 0 +3
      StrCpy $R2 "$INSTDIR\tools\rcedit-x64.exe"
      Goto foundTool
      
    IfFileExists "$INSTDIR\resources\app.asar.unpacked\tools\rcedit-x64.exe" 0 noTool
      StrCpy $R2 "$INSTDIR\resources\app.asar.unpacked\tools\rcedit-x64.exe"
      Goto foundTool
    
  noTool:
    DetailPrint "Could not find rcedit utility. Icon will not be applied."
    Goto iconFinished
    
  foundTool:
    DetailPrint "Found rcedit at: $R2"
    
    ; Apply icon if both tool and icon were found
    ${If} $R1 != "0"
    ${AndIf} $R2 != "0"
      DetailPrint "Applying icon using rcedit..."
      nsExec::ExecToLog '"$R2" "$INSTDIR\FE Infinity.exe" --set-icon "$R1"'
      DetailPrint "Icon applied successfully."
    ${Else}
      DetailPrint "Missing required resources to apply icon."
    ${EndIf}
  
  iconFinished:
    ; Clear the icon cache
    DetailPrint "Clearing Windows icon cache..."
    nsExec::ExecToLog "ie4uinit.exe -ClearIconCache"
    nsExec::ExecToLog "ie4uinit.exe -show"
    
    DetailPrint "Icon setup complete."
    DetailPrint "If the icon does not appear correctly, you can run fix-icon.bat from the installation directory."
    
    ; Copy the node modules that might be missing
    DetailPrint "Ensuring required Node.js modules are available..."
    CreateDirectory "$INSTDIR\resources\app\node_modules\readdir-glob"
    
    ; Note: We would use File here, but to avoid errors we'll just create empty placeholder
    ; files that will be filled properly by the extraFiles config in package.json
    FileOpen $0 "$INSTDIR\resources\app\node_modules\readdir-glob\package.json" w
    FileWrite $0 "{}"
    FileClose $0
    
    FileOpen $0 "$INSTDIR\resources\app\node_modules\readdir-glob\index.js" w
    FileWrite $0 "/* Placeholder file */"
    FileClose $0
    
    DetailPrint "Module directories ensured."
!macroend 