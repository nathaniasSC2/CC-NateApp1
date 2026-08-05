@echo off
setlocal
echo ===================================
echo NFL Dashboard - Desktop Shortcut
echo ===================================
echo.

rem Prefer the prebuilt release exe, fall back to a locally built one
set "EXE="
if exist "%~dp0releases\v0.2.0\NFL-Dashboard-v0.2.0-win64.exe" (
    set "EXE=%~dp0releases\v0.2.0\NFL-Dashboard-v0.2.0-win64.exe"
) else (
    for %%f in ("%~dp0release\NFL Dashboard*.exe") do set "EXE=%%~ff"
)

if not defined EXE (
    echo ERROR: No app executable found.
    echo.
    echo Expected one of:
    echo   releases\v0.2.0\NFL-Dashboard-v0.2.0-win64.exe  (comes with the repo)
    echo   release\NFL Dashboard *.exe                     (from setup-and-build.bat)
    echo.
    echo Run setup-and-build.bat first, or pull the latest repo.
    echo.
    pause
    exit /b 1
)

echo Found app: %EXE%
echo Creating desktop shortcut...

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell;" ^
  "$desktop = [Environment]::GetFolderPath('Desktop');" ^
  "$s = $ws.CreateShortcut((Join-Path $desktop 'NFL Dashboard.lnk'));" ^
  "$s.TargetPath = '%EXE%';" ^
  "$s.WorkingDirectory = '%~dp0';" ^
  "$s.Description = 'NFL Dashboard - schedules, scores, and pinnable live game widgets';" ^
  "$s.Save()"

if %errorlevel% neq 0 (
    echo ERROR: Failed to create the shortcut.
    pause
    exit /b 1
)

echo.
echo ===================================
echo DONE!
echo ===================================
echo.
echo "NFL Dashboard" is now on your desktop - double-click it to launch.
echo (First launch: Windows SmartScreen may warn because the app is
echo  unsigned. Click "More info" then "Run anyway".)
echo.
pause
