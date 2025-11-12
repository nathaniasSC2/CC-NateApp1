# NFL Dashboard - Quick Setup Script for Windows
# PowerShell version

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "NFL Dashboard - Quick Setup" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "[1/3] Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js: OK" -ForegroundColor Green
    Write-Host $nodeVersion -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

# Install dependencies
Write-Host "[2/3] Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "Dependencies: OK" -ForegroundColor Green
Write-Host ""

# Build app
Write-Host "[3/3] Building Windows application..." -ForegroundColor Yellow
Write-Host "This will take 2-5 minutes..." -ForegroundColor Gray
npm run build:win
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed" -ForegroundColor Red
    pause
    exit 1
}
Write-Host ""

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "BUILD COMPLETE!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your app is ready in: release\win-unpacked\" -ForegroundColor Yellow
Write-Host ""
Write-Host "To run the app:" -ForegroundColor White
Write-Host "  1. Go to: release\win-unpacked\" -ForegroundColor Gray
Write-Host "  2. Double-click: NFL Dashboard.exe" -ForegroundColor Gray
Write-Host ""
Write-Host "Or run: .\run-app.bat" -ForegroundColor Yellow
Write-Host ""
pause
