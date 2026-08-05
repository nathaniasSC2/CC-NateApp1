# NFL Dashboard

A beautiful, bloat-free Electron application for tracking NFL schedules, scores, and stats using ESPN's API.

> **Just want to run it?** Grab the portable exe from
> [releases/v0.2.0](./releases/v0.2.0/) — download, double-click, done.

## Features

- **📌 Pinnable Game Widgets** *(new in v0.2.0)*: Pin any live or upcoming game
  as a small always-on-top window — drag it anywhere on your monitor and follow
  the score while you do other things. Scores, quarter, and clock update live.
- **🔴 Live Games Bar** *(new)*: Every in-progress NFL game in one strip, with
  one-click pinning and live scores
- **⚡ Auto-Refreshing Scores** *(new)*: While games are live, scores update in
  the background every 45 seconds — across the main window and all pinned widgets
- **Real-time Data Sync**: Automatically syncs NFL schedules and scores from ESPN API
- **Smart Updates**: Only checks for differences when app loads to minimize API calls
- **Dashboard Overview**:
  - Next NFL game happening (league-wide) — becomes "Happening Now" with live scores
  - Next game for your favorite team, with a kickoff countdown
- **Team Carousel**: Beautiful carousel to quickly switch between all NFL teams,
  now with W-L records
- **Team Schedules**: Clean, easy-to-read schedule view showing:
  - Completed games with scores and Win/Loss indicators
  - Upcoming games with dates and locations
  - Auto-scrolls to the team's next game
- **Game Details**: Click any game to view:
  - Full game information
  - Team statistics
  - Player statistics (live during games and after completion)
- **Favorite Team**: Set and track your favorite team across sessions — their
  schedule opens by default

## Tech Stack

- **Electron**: Desktop application framework
- **React**: UI framework with TypeScript
- **Vite**: Fast build tool and dev server
- **Pure-JS local store**: JSON-backed persistence — zero native modules, so
  installs need no compilers or SDKs on any platform
- **ESPN API**: Real-time NFL data source
- **date-fns**: Date formatting and manipulation

## Quick Start

### ⚡ One-Click Setup & Build (Windows)

**Option 1: Batch Script (Recommended)**
```cmd
setup-and-build.bat
```

**Option 2: PowerShell**
```powershell
.\setup-and-build.ps1
```

This will:
1. Check Node.js installation
2. Install all dependencies
3. Build the Windows application (~5 minutes)
4. Create `release\win-unpacked\NFL Dashboard.exe`

Then run:
```cmd
run-app.bat
```

Or navigate to `release\win-unpacked\` and double-click `NFL Dashboard.exe`

### 🛠️ Development Mode

**Quick start:**
```cmd
dev.bat
```

Or manually:
```bash
npm install
npm run electron:dev
```

### 🐧 Linux / macOS

```bash
./setup-and-build.sh
```

## Manual Installation

If you prefer manual setup:

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run electron:dev
```

3. Build for production:
```bash
npm run build        # Auto-detect platform
npm run build:win    # Windows specifically
```

## Troubleshooting

### Prerequisites

- **Node.js**: any recent version (v18+) — that's it!

As of **v0.2.0** the app has no native modules, so there is nothing to compile
during `npm install`. No Windows SDK, no Visual Studio, no build-essential, no
Xcode tools. If you hit SDK errors on the old v0.1.0 code, just pull the latest —
that dependency is gone. ([Historical guide](./WINDOWS-BUILD-ISSUES.md))

## Usage

1. **First Launch**: The app will automatically sync NFL data from ESPN API
2. **Select Favorite Team**: Use the dropdown in the top-right to set your favorite team
3. **Browse Teams**: Use the carousel at the bottom to switch between teams
4. **View Schedule**: Click on any team in the carousel to see their schedule
5. **Game Details**: Click on any game in the schedule to see detailed stats
6. **Refresh Data**: Click the refresh button to update scores and schedules

## Data Storage

The app persists a local JSON store (in your system's user data directory)
containing:
- Team information (logos, colors, names, records)
- Game schedules, scores, and live status
- Player and team statistics
- User preferences (favorite team)

Writes are debounced and atomic, and data persists across sessions.

## API

This app uses ESPN's public API endpoints:
- Scoreboard: `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`
- Teams: `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams`
- Game Summary: `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary`

## Development

The project structure:
```
├── electron/           # Electron main process
│   ├── main.ts        # Main process entry, widget windows, live poller
│   ├── preload.ts     # Preload script (IPC bridge)
│   ├── store.ts       # Pure-JS JSON persistence layer
│   └── espnService.ts # ESPN API integration + queries
├── src/               # React frontend
│   ├── components/    # React components
│   ├── types.ts       # TypeScript types
│   ├── App.tsx        # Main App component
│   └── main.tsx       # React entry point
└── package.json       # Dependencies and scripts
```

## License

MIT
