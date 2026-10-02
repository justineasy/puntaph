# start.ps1 — PUNTA launcher
# Always runs from this script's folder (E:\freebuff), no matter where PowerShell opens.
# Usage:  powershell -ExecutionPolicy Bypass -File .\start.ps1
#         ...or right-click the file -> "Run with PowerShell"

Set-Location -LiteralPath $PSScriptRoot
Write-Host ""
Write-Host "  PUNTA - project root: $PSScriptRoot" -ForegroundColor Cyan
Write-Host ""

# `dev` = local dev server | `build` = typecheck + production build | `preview` = serve dist/
$task = 'dev'
npm run $task
