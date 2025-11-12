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
    echo Recommended: Use Node.js LTS version (v22.x)
    echo.
    pause
    exit /b 1
)
echo Node.js: OK
node --version
echo.
echo NOTE: If you encounter build errors, Node.js LTS (v22.x) is recommended
echo Current version:
node --version | findstr /C:"v24" >nul
if %errorlevel% equ 0 (
    echo WARNING: You're using a very new Node.js version.
    echo If you get errors, try Node.js LTS v22.x from https://nodejs.org/
    echo.
)
echo.

echo [2/3] Installing dependencies...
echo This may take a few minutes...
echo.
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ===================================
    echo ERROR: Failed to install dependencies
    echo ===================================
    echo.
    echo Common causes:
    echo 1. Missing Windows SDK or Build Tools
    echo 2. Node.js version too new
    echo.
    echo SOLUTIONS:
    echo.
    echo Option 1 - Install Windows Build Tools (PowerShell as Admin):
    echo   npm install -g windows-build-tools
    echo.
    echo Option 2 - Use Node.js LTS:
    echo   Download from https://nodejs.org/ (v22.x LTS)
    echo.
    echo Option 3 - Install Windows SDK:
    echo   Via Visual Studio Installer or from Microsoft
    echo.
    echo For detailed help, see: WINDOWS-BUILD-ISSUES.md
    echo.
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
