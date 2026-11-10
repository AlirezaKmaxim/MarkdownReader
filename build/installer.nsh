; Registers the app in Windows "Open with" suggestions and Settings > Default apps.
; electron-builder's fileAssociations only sets the extension's default class,
; which Windows 10/11 ignores in favour of the user's UserChoice.

!define MRP_PROGID "MarkdownReaderPro.md"
!define MRP_EXE "MarkdownReaderPro.exe"
!define MRP_CAPS "Software\MarkdownReaderPro\Capabilities"

!macro customInstall
  ; ProgID
  WriteRegStr SHELL_CONTEXT "Software\Classes\${MRP_PROGID}" "" "Markdown Document"
  WriteRegStr SHELL_CONTEXT "Software\Classes\${MRP_PROGID}\DefaultIcon" "" "$INSTDIR\${MRP_EXE},0"
  WriteRegStr SHELL_CONTEXT "Software\Classes\${MRP_PROGID}\shell\open\command" "" '"$INSTDIR\${MRP_EXE}" "%1"'

  ; "Open with" list
  WriteRegStr SHELL_CONTEXT "Software\Classes\.md\OpenWithProgids" "${MRP_PROGID}" ""
  WriteRegStr SHELL_CONTEXT "Software\Classes\.markdown\OpenWithProgids" "${MRP_PROGID}" ""

  ; Application registration
  WriteRegStr SHELL_CONTEXT "Software\Classes\Applications\${MRP_EXE}" "FriendlyAppName" "${PRODUCT_NAME}"
  WriteRegStr SHELL_CONTEXT "Software\Classes\Applications\${MRP_EXE}\DefaultIcon" "" "$INSTDIR\${MRP_EXE},0"
  WriteRegStr SHELL_CONTEXT "Software\Classes\Applications\${MRP_EXE}\shell\open\command" "" '"$INSTDIR\${MRP_EXE}" "%1"'
  WriteRegStr SHELL_CONTEXT "Software\Classes\Applications\${MRP_EXE}\SupportedTypes" ".md" ""
  WriteRegStr SHELL_CONTEXT "Software\Classes\Applications\${MRP_EXE}\SupportedTypes" ".markdown" ""

  ; Settings > Default apps
  WriteRegStr SHELL_CONTEXT "${MRP_CAPS}" "ApplicationName" "${PRODUCT_NAME}"
  WriteRegStr SHELL_CONTEXT "${MRP_CAPS}" "ApplicationDescription" "Markdown reader"
  WriteRegStr SHELL_CONTEXT "${MRP_CAPS}\FileAssociations" ".md" "${MRP_PROGID}"
  WriteRegStr SHELL_CONTEXT "${MRP_CAPS}\FileAssociations" ".markdown" "${MRP_PROGID}"
  WriteRegStr SHELL_CONTEXT "Software\RegisteredApplications" "MarkdownReaderPro" "${MRP_CAPS}"

  System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0, p 0, p 0)'
!macroend

!macro customUnInstall
  DeleteRegValue SHELL_CONTEXT "Software\Classes\.md\OpenWithProgids" "${MRP_PROGID}"
  DeleteRegValue SHELL_CONTEXT "Software\Classes\.markdown\OpenWithProgids" "${MRP_PROGID}"
  DeleteRegKey SHELL_CONTEXT "Software\Classes\${MRP_PROGID}"
  DeleteRegKey SHELL_CONTEXT "Software\Classes\Applications\${MRP_EXE}"
  DeleteRegValue SHELL_CONTEXT "Software\RegisteredApplications" "MarkdownReaderPro"
  DeleteRegKey SHELL_CONTEXT "Software\MarkdownReaderPro"

  System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0, p 0, p 0)'
!macroend
