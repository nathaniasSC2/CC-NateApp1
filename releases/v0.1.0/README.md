# Release v0.1.0 - Initial Release

**Release Date:** November 11, 2025

This is the initial release of the NFL Dashboard application - a beautiful, bloat-free Electron app for tracking NFL schedules, scores, and statistics.

## Download

**Note:** Due to file size limitations, the pre-built Windows executable is not included in the repository.

### Build from Source (Recommended)

1. Clone this repository
2. Install Node.js 18 or later
3. Run the following commands:

```bash
npm install
npm run build:win
```

4. The Windows executable will be in `release/win-unpacked/`
5. Run `NFL Dashboard.exe`

**Windows Build Note:** Building on Windows will produce a signed, portable executable. Building on Linux/Mac using cross-compilation tools will produce an unsigned executable that may trigger Windows Defender warnings.

### Pre-built Binary (External)

A pre-built Windows executable (114 MB) is available on request or can be hosted externally due to GitHub's file size limitations.

## Features

- **Real-time Data Sync**: Automatically syncs NFL schedules and scores from ESPN API
- **Smart Updates**: Only checks for differences when app loads to minimize API calls
- **Dashboard Overview**:
  - Next NFL game happening (league-wide)
  - Next game for your favorite team
- **Team Carousel**: Beautiful carousel to quickly switch between all NFL teams
- **Team Schedules**: Clean, easy-to-read schedule view showing completed games with scores and upcoming games with dates
- **Game Details**: Click any game to view detailed team and player statistics
- **Favorite Team**: Set and track your favorite team across sessions

## Technical Details

- **Platform:** Electron-based desktop application
- **Framework:** React + TypeScript
- **Database:** SQLite for local data storage
- **API:** ESPN public API for NFL data
- **Version:** 0.1.0

## Known Issues

- First launch requires internet connection to sync NFL data
- Season stats for upcoming games are limited
- No application icon (uses default Electron icon)

## System Requirements

### Windows
- Windows 10 or later (64-bit)
- 200 MB free disk space
- Active internet connection for data sync

## Build from Source

If you prefer to build from source:

```bash
git clone <repository-url>
cd CC-NateApp1
npm install
npm run electron:dev  # Development mode
npm run build:win     # Build for Windows
```

## Feedback & Issues

Please report any issues or suggestions through the repository's issue tracker.

## License

MIT License - See LICENSE file for details
