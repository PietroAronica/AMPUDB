# AMPUDB — GitHub push script
# Run via push_to_github.bat (recommended), or from an open PowerShell window.

try {
    $ErrorActionPreference = "Stop"

    $siteDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    Set-Location $siteDir
    Write-Host "Working in: $siteDir" -ForegroundColor Cyan

    # ── 1. Check git is installed ────────────────────────────────────────────
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        throw "git not found. Install Git from https://git-scm.com/download/win and rerun."
    }
    Write-Host "git found: $(git --version)" -ForegroundColor Green

    # ── 2. Create .gitignore ─────────────────────────────────────────────────
    @"
__pycache__/
*.py[cod]
.DS_Store
Thumbs.db
*.bak
"@ | Set-Content .gitignore -Encoding UTF8
    Write-Host "Created .gitignore" -ForegroundColor Green

    # ── 3. Initialise git ────────────────────────────────────────────────────
    # Remove any broken/partial .git folder left over from a previous attempt
    if (Test-Path ".git") {
        Write-Host "Removing existing .git folder..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force ".git"
    }
    git init
    git config user.email "pietro.g.a.aronica@gmail.com"
    git config user.name  "Pietro Aronica"
    Write-Host "Git repo initialised" -ForegroundColor Green

    # ── 4. Stage and commit ──────────────────────────────────────────────────
    git add .
    git commit -m "Initial AMPUDB site (v10 data, category filtering)"
    git branch -M main

    # ── 5. Add remote and push ───────────────────────────────────────────────
    $remote = git remote
    if ($remote -notcontains "origin") {
        git remote add origin https://github.com/PietroAronica/AMPUDB.git
    }

    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    Write-Host "(If prompted, use your GitHub username + Personal Access Token as password)" -ForegroundColor Yellow
    Write-Host ""
    git push -u origin main

    Write-Host ""
    Write-Host "Done! Repo: https://github.com/PietroAronica/AMPUDB" -ForegroundColor Green
    Write-Host "Add collaborators: Settings -> Collaborators" -ForegroundColor Cyan

} catch {
    Write-Host ""
    Write-Host "ERROR: $_" -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to close"
