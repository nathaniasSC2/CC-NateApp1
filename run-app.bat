@echo off
echo Starting NFL Dashboard...
echo.

if not exist "release\win-unpacked\NFL Dashboard.exe" (
    echo ERROR: App not found!
    echo Please run setup-and-build.bat first to build the application.
    echo.
    pause
    exit /b 1
)

echo Launching NFL Dashboard...
start "" "release\win-unpacked\NFL Dashboard.exe"
echo.
echo App launched! Check your taskbar.
echo.
timeout /t 2 >nul
