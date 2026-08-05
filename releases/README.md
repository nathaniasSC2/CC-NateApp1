# NFL Dashboard - Releases

## Latest Release

### [v0.2.0 — Pinnable Live Game Widgets](./v0.2.0/) (August 5, 2026)

**Download and run — no build required:**
- **[NFL-Dashboard-v0.2.0-win64.exe](./v0.2.0/NFL-Dashboard-v0.2.0-win64.exe)** (68 MB, Windows portable)

**Highlights:**
- 📌 Pin live/upcoming games as always-on-top mini widgets on your desktop
- 🔴 Live games bar with one-click pinning
- ⚡ Auto-refreshing live scores every 45s (no manual refresh)
- 🧠 No native modules — building from source now needs zero build tools
- Team W-L records, kickoff countdowns, dynamic season detection

See the [v0.2.0 release notes](./v0.2.0/README.md) for full details.

---

## All Releases

| Version | Date | Download |
|---------|------|----------|
| [v0.2.0](./v0.2.0/) | Aug 5, 2026 | [Windows x64 portable exe](./v0.2.0/NFL-Dashboard-v0.2.0-win64.exe) |
| [v0.1.0](./v0.1.0/) | Nov 11, 2025 | Build from source |

---

## Installation

### Windows (prebuilt)
Download the .exe above and double-click it. Windows SmartScreen may warn about
the unsigned executable — click **More info → Run anyway**.

### Building from Source (All Platforms)

As of v0.2.0 there are no native modules, so any recent Node.js works with no
extra build tools:

```cmd
setup-and-build.bat    # Windows one-click setup & build
run-app.bat            # Run the built app
```
```bash
./setup-and-build.sh   # Linux/Mac
```

See the main [README.md](../README.md) for more details.
