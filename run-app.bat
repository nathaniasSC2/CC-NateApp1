@echo off
echo Starting NFL Dashboard...
echo.

set "EXE="
for %%f in ("release\NFL Dashboard*.exe") do set "EXE=%%f"

if defined EXE (
    echo Launching %EXE%...
    start "" "%EXE%"
    timeout /t 2 >nul
    exit /b 0
)

if exist "release\win-unpacked\NFL Dashboard.exe" (
    echo Launching NFL Dashboard...
    start "" "release\win-unpacked\NFL Dashboard.exe"
    timeout /t 2 >nul
    exit /b 0
)

echo ERROR: App not found!
echo Please run setup-and-build.bat first to build the application.
echo.
pause
exit /b 1
