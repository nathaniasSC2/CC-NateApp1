# NFL Dashboard

A beautiful, bloat-free Electron application for tracking NFL schedules, scores, and stats using ESPN's API.

## Features

- **Real-time Data Sync**: Automatically syncs NFL schedules and scores from ESPN API
- **Smart Updates**: Only checks for differences when app loads to minimize API calls
- **Dashboard Overview**:
  - Next NFL game happening (league-wide)
  - Next game for your favorite team
- **Team Carousel**: Beautiful carousel to quickly switch between all NFL teams
- **Team Schedules**: Clean, easy-to-read schedule view showing:
  - Completed games with scores
  - Upcoming games with dates and locations
  - Win/Loss indicators
- **Game Details**: Click any game to view:
  - Full game information
  - Team statistics
  - Player statistics (for completed games)
  - Season averages (for upcoming games)
- **Favorite Team**: Set and track your favorite team across sessions

## Tech Stack

- **Electron**: Desktop application framework
- **React**: UI framework with TypeScript
- **Vite**: Fast build tool and dev server
- **SQLite**: Local database for efficient data storage
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

## Usage

1. **First Launch**: The app will automatically sync NFL data from ESPN API
2. **Select Favorite Team**: Use the dropdown in the top-right to set your favorite team
3. **Browse Teams**: Use the carousel at the bottom to switch between teams
4. **View Schedule**: Click on any team in the carousel to see their schedule
5. **Game Details**: Click on any game in the schedule to see detailed stats
6. **Refresh Data**: Click the refresh button to update scores and schedules

## Database

The app uses SQLite to store:
- Team information (logos, colors, names)
- Game schedules and scores
- Player and team statistics
- User preferences (favorite team)

Data is stored locally in your system's user data directory and persists across sessions.

## API

This app uses ESPN's public API endpoints:
- Scoreboard: `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`
- Teams: `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams`
- Game Summary: `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary`

## Development

The project structure:
```
├── electron/           # Electron main process
│   ├── main.ts        # Main process entry
│   ├── preload.ts     # Preload script
│   ├── database.ts    # SQLite database layer
│   └── espnService.ts # ESPN API integration
├── src/               # React frontend
│   ├── components/    # React components
│   ├── types.ts       # TypeScript types
│   ├── App.tsx        # Main App component
│   └── main.tsx       # React entry point
└── package.json       # Dependencies and scripts
```

## License

MIT
