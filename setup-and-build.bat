@echo off
echo ===================================
echo NFL Dashboard - Quick Setup
echo ===================================
echo.

echo [1/3] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo Node.js: OK
node --version
echo.

echo [2/3] Installing dependencies...
echo This may take a few minutes...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies: OK
echo.

echo [3/3] Building Windows application...
echo This will take 2-5 minutes...
call npm run build:win
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo.

echo ===================================
echo BUILD COMPLETE!
echo ===================================
echo.
echo Your app is ready in: release\win-unpacked\
echo.
echo To run the app:
echo   1. Go to: release\win-unpacked\
echo   2. Double-click: NFL Dashboard.exe
echo.
echo Or run this script: run-app.bat
echo.
pause
