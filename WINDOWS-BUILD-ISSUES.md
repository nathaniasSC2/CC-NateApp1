# Windows Build Issues - Troubleshooting Guide

> **⚠️ HISTORICAL DOCUMENT — this only applies to v0.1.0.**
> As of **v0.2.0**, the native `better-sqlite3` dependency was replaced with a
> pure-JS store. `npm install` no longer compiles anything, so none of the fixes
> below are needed. If you're seeing these errors, update to the latest code.

## Issue: Windows SDK Not Found

If you see this error:
```
error MSB8036: The Windows SDK version 10.0.26100.0 was not found
```

This means `better-sqlite3` (our database library) needs to compile native code and requires the Windows SDK.

## Quick Fix Options

### Option 1: Install Windows Build Tools (Easiest)

Open **PowerShell as Administrator** and run:

```powershell
npm install -g windows-build-tools
```

This installs:
- Python 2.7
- Visual Studio Build Tools
- Windows SDK

**Then try again:**
```cmd
setup-and-build.bat
```

### Option 2: Install Windows SDK Manually

1. Download **Windows SDK** from Microsoft:
   - https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/

2. Install it with default options

3. Or install via Visual Studio Installer:
   - Open **Visual Studio Installer**
   - Click **Modify** on your Visual Studio 2022
   - Go to **Individual Components** tab
   - Search for "Windows 10 SDK" or "Windows 11 SDK"
   - Check the SDK version (10.0.26100.0 or latest)
   - Click **Modify** to install

**Then try again:**
```cmd
setup-and-build.bat
```

### Option 3: Use Prebuilt Binary (Fastest)

If you just want to run the app without building:

1. Check if there's a prebuilt release in `releases/v0.1.0/`
2. Extract and run `NFL Dashboard.exe`

## Alternative: Use Node.js LTS Version

Your Node.js version (v24.1.0) is very new. Sometimes native modules work better with LTS versions.

1. Download Node.js **LTS (v22.x)** from https://nodejs.org/
2. Install it
3. Try again:
   ```cmd
   setup-and-build.bat
   ```

## Still Having Issues?

### Check Your Setup:

```cmd
node --version          # Should show v18.x, v20.x, or v22.x (LTS recommended)
npm --version          # Should be 9.x or 10.x
python --version       # Should be installed
```

### Detailed Error Diagnosis:

```cmd
npm config get msvs_version
```

If empty, set Visual Studio version:
```cmd
npm config set msvs_version 2022
```

### Clean Install:

```cmd
# Remove old files
rmdir /s /q node_modules
del package-lock.json

# Try again
npm install
```

## Common Issues

### Issue: "Python not found"
**Solution:** Install Python 3.x from https://www.python.org/downloads/

### Issue: "Visual Studio not found"
**Solution:** Install Visual Studio 2022 Community (free) from https://visualstudio.microsoft.com/

### Issue: "MSBuild failed"
**Solution:** Make sure Visual Studio has "Desktop development with C++" workload installed

## Need More Help?

Create an issue with:
1. Your Node.js version (`node --version`)
2. Your npm version (`npm --version`)
3. Your Visual Studio version
4. The full error message

---

**Quick Success Path:**
1. Use Node.js LTS (v22.x)
2. Install windows-build-tools: `npm install -g windows-build-tools`
3. Run: `setup-and-build.bat`
