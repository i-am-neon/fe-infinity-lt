; Custom NSIS script to avoid code signing
; Modifications to electron-builder's default NSIS script
; This will be automatically included if present

!macro customInit
  ; Disable signature check
  SetCompressor /SOLID lzma
  !define UNSIGNED_APP
  !define SKIP_UAC_PLUGIN_TESTS
!macroend

!macro customInstall
  ; Custom installation steps can go here if needed
  DetailPrint "Installing unsigned application"
!macroend