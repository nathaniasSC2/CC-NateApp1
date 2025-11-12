# NFL Dashboard - Releases

Download the latest version of the NFL Dashboard application.

## Latest Release

### [v0.1.0 - Initial Release](./v0.1.0/) (November 11, 2025)

**Build from Source:**
- See [build instructions](./v0.1.0/README.md#build-from-source-recommended)
- Windows, macOS, and Linux supported
- ~5 minutes to build

**What's New:**
- Initial release with full feature set
- ESPN API integration for real-time NFL data
- Beautiful team carousel
- Game schedules and detailed statistics
- Favorite team selection
- SQLite local database

See the [v0.1.0 release notes](./v0.1.0/README.md) for full details.

---

## All Releases

| Version | Date | Status |
|---------|------|--------|
| [v0.1.0](./v0.1.0/) | Nov 11, 2025 | Build from source |

---

## Installation Instructions

### Building from Source (All Platforms)

**Quick Start - Windows:**
```cmd
setup-and-build.bat    # One-click setup & build
run-app.bat            # Run the app
```

**Quick Start - Linux/Mac:**
```bash
./setup-and-build.sh   # One-click setup & build
```

**Manual Commands:**
```bash
# Clone the repository
git clone <repository-url>
cd CC-NateApp1

# Install dependencies
npm install

# For development
npm run electron:dev

# Build for your platform
npm run build        # Auto-detect platform
npm run build:win    # Windows
```

See the main [README.md](../README.md) for more details.
