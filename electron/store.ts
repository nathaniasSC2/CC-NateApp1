import fs from 'fs';
import path from 'path';
import { app } from 'electron';

export interface TeamRecord {
  id: string;
  name: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  color: string | null;
  alternateColor: string | null;
  logo: string | null;
  location: string;
  updatedAt: number;
}

export interface GameRecord {
  id: string;
  season: number;
  seasonType: number;
  week: number;
  date: string;
  timestamp: number;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  statusDetail: string | null;
  period: number;
  clock: string | null;
  venue: string | null;
  city: string | null;
  state: string | null;
  completed: number;
  inProgress: number;
  detailsLastFetched?: number;
  updatedAt: number;
}

export interface PlayerStatRecord {
  id: number;
  gameId: string;
  teamId: string;
  playerId: string;
  playerName: string;
  position: string | null;
  category: string;
  stats: string;
}

export interface TeamGameStatRecord {
  id: number;
  gameId: string;
  teamId: string;
  category: string;
  statType: string;
  statValue: string;
}

interface StoreData {
  teams: Record<string, TeamRecord>;
  games: Record<string, GameRecord>;
  playerStats: Record<string, PlayerStatRecord[]>;
  gameStats: Record<string, TeamGameStatRecord[]>;
  settings: Record<string, string>;
}

function emptyData(): StoreData {
  return { teams: {}, games: {}, playerStats: {}, gameStats: {}, settings: {} };
}

let data: StoreData = emptyData();
let filePath = '';
let saveTimer: NodeJS.Timeout | null = null;

export function initStore(): void {
  filePath = path.join(app.getPath('userData'), 'nfl-dashboard-data.json');
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      data = { ...emptyData(), ...parsed };
    }
  } catch (error) {
    console.error('Failed to load store, starting fresh:', error);
    data = emptyData();
  }
  console.log('Store initialized at:', filePath);
}

export function getStore(): StoreData {
  return data;
}

// Debounced write so bursts of updates only hit disk once
export function persist(): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(persistNow, 500);
}

export function persistNow(): void {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  try {
    const tmpPath = filePath + '.tmp';
    fs.writeFileSync(tmpPath, JSON.stringify(data));
    fs.renameSync(tmpPath, filePath);
  } catch (error) {
    console.error('Failed to persist store:', error);
  }
}

export function getSetting(key: string): string | null {
  return data.settings[key] ?? null;
}

export function setSetting(key: string, value: string): void {
  data.settings[key] = value;
  persist();
}
