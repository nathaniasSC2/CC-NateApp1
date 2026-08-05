# Release v0.2.0 — Pinnable Live Game Widgets

**Release Date:** August 5, 2026

## Download & Run (No Build Required!)

**[NFL-Dashboard-v0.2.0-win64.exe](./NFL-Dashboard-v0.2.0-win64.exe)** (68 MB, Windows 64-bit portable)

1. Download the .exe
2. Double-click it — that's it. No installer, no dependencies, no build step.

> **Note:** The executable is unsigned, so Windows SmartScreen may warn you on first
> launch. Click **More info → Run anyway**.

## What's New in v0.2.0

### 📌 Pinnable Game Widgets (the big one)
- Pin any live or upcoming game as a **small always-on-top window** on your monitor
- Drag it anywhere, follow the score while you work, game, or browse
- Live score, quarter, and clock update automatically every 45 seconds
- Pin from the live games bar, any schedule row, or the game details pane
- Pin as many games as you want — they stack neatly on your screen

### 🔴 Live Games Bar
- A strip below the dashboard shows every NFL game in progress right now
- One-click pin button on each live game
- Click a live game to jump straight to its details

### ⚡ Auto-Refreshing Live Scores
- While any game is live (or any widget is pinned), scores refresh in the
  background — no more manual refresh clicking
- Live in-game player stats in the details pane, updating as the game runs

### 🧠 Smarter App
- **No more native modules** — the SQLite dependency was replaced with a pure-JS
  store. `npm install` now works on any Node version with **no Windows SDK, no
  Visual Studio, no build tools**. (This fixes the v0.1.0 build failure.)
- **Dynamic season detection** — the app now always syncs the correct NFL season
  instead of a hardcoded year (also fixes an inverted date-range bug in v0.1.0)
- **Team records (W-L-T)** shown in the carousel, schedule header, and dashboard
- **Kickoff countdown** ("Kickoff in 2 days") for upcoming games
- Schedule auto-scrolls to your team's next game
- Favorite team's schedule opens by default on launch
- "Next NFL Game" card becomes "Happening Now" with live scores during games

## Building from Source

Building is now trivial on every platform (no native compilation):

```cmd
setup-and-build.bat      # Windows one-click
```
```bash
./setup-and-build.sh     # Linux/macOS
```

## System Requirements

- Windows 10 or later (64-bit) for the prebuilt exe
- Internet connection for ESPN data sync
- ~200 MB free disk space

## License

MIT
