# AMPUDB — update script (run after any changes)
# Run via update_github.bat

try {
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

} catch {
    Write-Host ""
    Write-Host "ERROR: $_" -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to close"
