@echo off
echo Starting NFL Dashboard in development mode...
echo.
echo Press Ctrl+C to stop the dev server
echo.

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Installing dependencies first...
    call npm install
)

call npm run electron:dev
