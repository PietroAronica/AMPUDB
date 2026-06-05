# AMPUDB — update script (run after any changes)
# Right-click → "Run with PowerShell", or run from any terminal.

$ErrorActionPreference = "Stop"

$siteDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $siteDir

Write-Host "Working in: $siteDir" -ForegroundColor Cyan

git add .
$msg = Read-Host "Commit message (or press Enter for 'Update site')"
if ([string]::IsNullOrWhiteSpace($msg)) { $msg = "Update site" }
git commit -m $msg
git push

Write-Host "Done!" -ForegroundColor Green
