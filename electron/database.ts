import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

export async function initDatabase(): Promise<void> {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'nfl-dashboard.db');

  db = new Database(dbPath);

  // Enable WAL mode for better concurrency
  db.pragma('journal_mode = WAL');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      abbreviation TEXT NOT NULL,
      displayName TEXT NOT NULL,
      shortDisplayName TEXT NOT NULL,
      color TEXT,
      alternateColor TEXT,
      logo TEXT,
      location TEXT,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      season INTEGER NOT NULL,
      seasonType INTEGER NOT NULL,
      week INTEGER NOT NULL,
      date TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      homeTeamId TEXT NOT NULL,
      awayTeamId TEXT NOT NULL,
      homeScore INTEGER,
      awayScore INTEGER,
      status TEXT NOT NULL,
      venue TEXT,
      city TEXT,
      state TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      inProgress INTEGER NOT NULL DEFAULT 0,
      detailsLastFetched INTEGER,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (homeTeamId) REFERENCES teams(id),
      FOREIGN KEY (awayTeamId) REFERENCES teams(id)
    );

    CREATE TABLE IF NOT EXISTS game_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gameId TEXT NOT NULL,
      teamId TEXT NOT NULL,
      category TEXT NOT NULL,
      statType TEXT NOT NULL,
      statValue TEXT NOT NULL,
      FOREIGN KEY (gameId) REFERENCES games(id),
      FOREIGN KEY (teamId) REFERENCES teams(id)
    );

    CREATE TABLE IF NOT EXISTS player_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gameId TEXT NOT NULL,
      teamId TEXT NOT NULL,
      playerId TEXT NOT NULL,
      playerName TEXT NOT NULL,
      position TEXT,
      category TEXT NOT NULL,
      stats TEXT NOT NULL,
      FOREIGN KEY (gameId) REFERENCES games(id),
      FOREIGN KEY (teamId) REFERENCES teams(id)
    );

    CREATE TABLE IF NOT EXISTS season_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teamId TEXT NOT NULL,
      playerId TEXT NOT NULL,
      playerName TEXT NOT NULL,
      position TEXT,
      season INTEGER NOT NULL,
      category TEXT NOT NULL,
      stats TEXT NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (teamId) REFERENCES teams(id)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_games_date ON games(date);
    CREATE INDEX IF NOT EXISTS idx_games_teams ON games(homeTeamId, awayTeamId);
    CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
    CREATE INDEX IF NOT EXISTS idx_game_stats_game ON game_stats(gameId);
    CREATE INDEX IF NOT EXISTS idx_player_stats_game ON player_stats(gameId);
    CREATE INDEX IF NOT EXISTS idx_season_stats_team ON season_stats(teamId, season);
  `);

  console.log('Database initialized at:', dbPath);
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
