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
echo (No native modules - works on any Node version, no build tools needed)
echo.
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Check your internet connection and try again.
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
echo Your app is ready: release\NFL Dashboard 0.2.0.exe (portable)
echo Just double-click it to run!
echo.
pause
