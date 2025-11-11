import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  syncNFLData: () => ipcRenderer.invoke('sync-nfl-data'),
  getNextGameOverall: () => ipcRenderer.invoke('get-next-game-overall'),
  getTeamNextGame: (teamId: string) => ipcRenderer.invoke('get-team-next-game', teamId),
  getAllTeams: () => ipcRenderer.invoke('get-all-teams'),
  getTeamSchedule: (teamId: string) => ipcRenderer.invoke('get-team-schedule', teamId),
  getGameDetails: (gameId: string) => ipcRenderer.invoke('get-game-details', gameId),
  setFavoriteTeam: (teamId: string) => ipcRenderer.invoke('set-favorite-team', teamId),
  getFavoriteTeam: () => ipcRenderer.invoke('get-favorite-team'),
});
