import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

function subscribe(channel: string, callback: (payload: any) => void): () => void {
  const listener = (_event: IpcRendererEvent, payload: any) => callback(payload);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

contextBridge.exposeInMainWorld('electronAPI', {
  syncNFLData: () => ipcRenderer.invoke('sync-nfl-data'),
  syncLive: () => ipcRenderer.invoke('sync-live'),
  getNextGameOverall: () => ipcRenderer.invoke('get-next-game-overall'),
  getTeamNextGame: (teamId: string) => ipcRenderer.invoke('get-team-next-game', teamId),
  getAllTeams: () => ipcRenderer.invoke('get-all-teams'),
  getTeamSchedule: (teamId: string) => ipcRenderer.invoke('get-team-schedule', teamId),
  getGameDetails: (gameId: string) => ipcRenderer.invoke('get-game-details', gameId),
  getGame: (gameId: string) => ipcRenderer.invoke('get-game', gameId),
  getLiveGames: () => ipcRenderer.invoke('get-live-games'),
  setFavoriteTeam: (teamId: string) => ipcRenderer.invoke('set-favorite-team', teamId),
  getFavoriteTeam: () => ipcRenderer.invoke('get-favorite-team'),
  pinGame: (gameId: string) => ipcRenderer.invoke('pin-game', gameId),
  unpinGame: (gameId: string) => ipcRenderer.invoke('unpin-game', gameId),
  getPinnedGameIds: () => ipcRenderer.invoke('get-pinned-game-ids'),
  onLiveScores: (callback: (games: any[]) => void) => subscribe('live-scores-updated', callback),
  onPinnedChanged: (callback: (gameIds: string[]) => void) => subscribe('pinned-games-changed', callback),
});
