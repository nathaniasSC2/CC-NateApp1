import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { initDatabase, getDatabase } from './database';
import { syncNFLData, getNextGameOverall, getTeamSchedule, getGameDetails, getAllTeams, getTeamNextGame } from './espnService';

let mainWindow: BrowserWindow | null = null;

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
      symbolColor: '#ffffff'
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  // Initialize database
  await initDatabase();

  createWindow();

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

// IPC Handlers
ipcMain.handle('sync-nfl-data', async () => {
  try {
    await syncNFLData();
    return { success: true };
  } catch (error) {
    console.error('Error syncing NFL data:', error);
    return { success: false, error: (error as Error).message };
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

ipcMain.handle('set-favorite-team', async (_event, teamId: string) => {
  try {
    const db = getDatabase();
    db.prepare('DELETE FROM settings WHERE key = ?').run('favoriteTeam');
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('favoriteTeam', teamId);
    return { success: true };
  } catch (error) {
    console.error('Error setting favorite team:', error);
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('get-favorite-team', async () => {
  try {
    const db = getDatabase();
    const result = db.prepare('SELECT value FROM settings WHERE key = ?').get('favoriteTeam') as { value: string } | undefined;
    return result?.value || null;
  } catch (error) {
    console.error('Error getting favorite team:', error);
    return null;
  }
});
