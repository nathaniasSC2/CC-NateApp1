import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path from 'path';
import { initStore, persistNow, getSetting, setSetting } from './store';
import {
  syncNFLData,
  syncLiveGames,
  hasLiveGames,
  getNextGameOverall,
  getTeamSchedule,
  getGameDetails,
  getAllTeams,
  getTeamNextGame,
  getLiveGames,
  getGame,
} from './espnService';

const LIVE_POLL_INTERVAL = 45000;

let mainWindow: BrowserWindow | null = null;
const widgetWindows = new Map<string, BrowserWindow>();
let livePoller: NodeJS.Timeout | null = null;

const devServerUrl = process.env.VITE_DEV_SERVER_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null);
const indexHtml = path.join(__dirname, '../dist/index.html');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#0a0e27',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#0a0e27',
      symbolColor: '#ffffff',
    },
  });

  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(indexHtml);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function broadcast(channel: string, payload: unknown) {
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) {
      win.webContents.send(channel, payload);
    }
  }
}

function notifyPinnedChanged() {
  broadcast('pinned-games-changed', Array.from(widgetWindows.keys()));
}

function createWidgetWindow(gameId: string) {
  const existing = widgetWindows.get(gameId);
  if (existing && !existing.isDestroyed()) {
    existing.focus();
    return;
  }

  const { workArea } = screen.getPrimaryDisplay();
  const width = 330;
  const height = 130;
  const index = widgetWindows.size;

  const widget = new BrowserWindow({
    width,
    height,
    x: workArea.x + workArea.width - width - 24,
    y: workArea.y + 24 + index * (height + 14),
    frame: false,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    backgroundColor: '#0a0e27',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  widget.setAlwaysOnTop(true, 'floating');

  if (devServerUrl) {
    widget.loadURL(`${devServerUrl}#/widget/${gameId}`);
  } else {
    widget.loadFile(indexHtml, { hash: `/widget/${gameId}` });
  }

  widget.on('closed', () => {
    widgetWindows.delete(gameId);
    notifyPinnedChanged();
  });

  widgetWindows.set(gameId, widget);
  notifyPinnedChanged();
  ensureLivePoller();
}

async function pollLiveScores() {
  // Only poll while someone is watching: a live game exists or widgets are open
  if (widgetWindows.size === 0 && !hasLiveGames()) return;
  try {
    const updated = await syncLiveGames();
    if (updated.length > 0) {
      broadcast('live-scores-updated', updated);
    }
  } catch (error) {
    console.error('Live score poll failed:', error);
  }
}

function ensureLivePoller() {
  if (!livePoller) {
    livePoller = setInterval(pollLiveScores, LIVE_POLL_INTERVAL);
  }
}

app.whenReady().then(() => {
  initStore();
  createWindow();
  ensureLivePoller();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  persistNow();
});

// --- Data IPC ---

ipcMain.handle('sync-nfl-data', async () => {
  try {
    await syncNFLData();
    return { success: true };
  } catch (error) {
    console.error('Error syncing NFL data:', error);
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('sync-live', async () => {
  try {
    return await syncLiveGames();
  } catch (error) {
    console.error('Error syncing live games:', error);
    return [];
  }
});

ipcMain.handle('get-next-game-overall', async () => {
  try {
    return await getNextGameOverall();
  } catch (error) {
    console.error('Error getting next game:', error);
    return null;
  }
});

ipcMain.handle('get-team-next-game', async (_event, teamId: string) => {
  try {
    return await getTeamNextGame(teamId);
  } catch (error) {
    console.error('Error getting team next game:', error);
    return null;
  }
});

ipcMain.handle('get-all-teams', async () => {
  try {
    return await getAllTeams();
  } catch (error) {
    console.error('Error getting teams:', error);
    return [];
  }
});

ipcMain.handle('get-team-schedule', async (_event, teamId: string) => {
  try {
    return await getTeamSchedule(teamId);
  } catch (error) {
    console.error('Error getting team schedule:', error);
    return [];
  }
});

ipcMain.handle('get-game-details', async (_event, gameId: string) => {
  try {
    return await getGameDetails(gameId);
  } catch (error) {
    console.error('Error getting game details:', error);
    return null;
  }
});

ipcMain.handle('get-game', async (_event, gameId: string) => {
  try {
    return getGame(gameId);
  } catch (error) {
    console.error('Error getting game:', error);
    return null;
  }
});

ipcMain.handle('get-live-games', async () => {
  try {
    return await getLiveGames();
  } catch (error) {
    console.error('Error getting live games:', error);
    return [];
  }
});

ipcMain.handle('set-favorite-team', async (_event, teamId: string) => {
  try {
    setSetting('favoriteTeam', teamId);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('get-favorite-team', async () => {
  return getSetting('favoriteTeam');
});

// --- Widget IPC ---

ipcMain.handle('pin-game', async (_event, gameId: string) => {
  createWidgetWindow(gameId);
  // Kick a live sync right away so a fresh widget doesn't wait a full interval
  pollLiveScores();
  return { success: true };
});

ipcMain.handle('unpin-game', async (_event, gameId: string) => {
  const widget = widgetWindows.get(gameId);
  if (widget && !widget.isDestroyed()) {
    widget.close();
  } else {
    widgetWindows.delete(gameId);
    notifyPinnedChanged();
  }
  return { success: true };
});

ipcMain.handle('get-pinned-game-ids', async () => {
  return Array.from(widgetWindows.keys());
});
