# VERSION 3: Feature-Rich Advanced - Implementation Guide

**Comprehensive Guide for Building the Ultimate NFL Dashboard**

---

## Overview

This guide walks you through implementing VERSION 3, transforming your NFL Dashboard into a comprehensive analytics platform with player profiles, predictions, multi-season support, and much more.

**Timeline:** 50-62 days (395-495 hours)
**Skill Level:** Advanced
**Team Size:** 1-2 developers recommended
**Risk Level:** High

---

## Pre-Implementation Setup

### Install All Dependencies

```bash
# Routing
npm install react-router-dom
npm install --save-dev @types/react-router-dom

# Charts & Visualizations
npm install recharts

# Forms & Validation
npm install react-hook-form zod

# Export Functionality
npm install papaparse jspdf jspdf-autotable html2canvas
npm install --save-dev @types/papaparse

# Icons & UI
npm install lucide-react

# Scheduling
npm install node-cron
npm install --save-dev @types/node-cron

# Utilities
npm install lodash date-fns-tz
npm install --save-dev @types/lodash

# Logging
npm install winston
```

---

## Architecture Overview

```
src/
├── pages/           # Route-based pages
├── features/        # Feature modules (player, analytics, predictions)
├── components/      # Shared UI components
├── contexts/        # React contexts for state
├── hooks/           # Custom hooks
├── services/        # API & data services (moved from electron/)
├── utils/           # Utility functions
└── types/           # TypeScript definitions

electron/
├── services/        # Backend services (player, prediction, etc.)
├── migrations/      # Database migrations
└── utils/           # Backend utilities
```

---

## Phase 1: Foundation & Infrastructure (Weeks 1-2)

**Time:** 20-25 hours | **Priority:** CRITICAL

### Step 1.1: Database Migration System (6 hours)

**Create `electron/migrations/migrationRunner.ts`:**
```typescript
import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

interface Migration {
  version: number;
  name: string;
  up: (db: Database.Database) => void;
  down: (db: Database.Database) => void;
}

export class MigrationRunner {
  private db: Database.Database;
  private migrationsPath: string;

  constructor(db: Database.Database, migrationsPath: string) {
    this.db = db;
    this.migrationsPath = migrationsPath;
    this.ensureMigrationsTable();
  }

  private ensureMigrationsTable() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version INTEGER UNIQUE NOT NULL,
        name TEXT NOT NULL,
        applied_at INTEGER NOT NULL
      )
    `);
  }

  private getAppliedMigrations(): number[] {
    const rows = this.db.prepare('SELECT version FROM migrations ORDER BY version').all();
    return rows.map((row: any) => row.version);
  }

  async runMigrations(migrations: Migration[]) {
    const applied = this.getAppliedMigrations();
    const pending = migrations.filter(m => !applied.includes(m.version));

    if (pending.length === 0) {
      console.log('No pending migrations');
      return;
    }

    console.log(`Running ${pending.length} migrations...`);

    for (const migration of pending) {
      try {
        console.log(`Applying migration ${migration.version}: ${migration.name}`);

        this.db.exec('BEGIN TRANSACTION');
        migration.up(this.db);

        this.db.prepare(`
          INSERT INTO migrations (version, name, applied_at)
          VALUES (?, ?, ?)
        `).run(migration.version, migration.name, Date.now());

        this.db.exec('COMMIT');
        console.log(`✓ Migration ${migration.version} applied successfully`);
      } catch (error) {
        this.db.exec('ROLLBACK');
        console.error(`✗ Migration ${migration.version} failed:`, error);
        throw error;
      }
    }
  }
}
```

---

### Step 1.2: Create Initial Migrations (8 hours)

**Create `electron/migrations/002_add_players.ts`:**
```typescript
import Database from 'better-sqlite3';

export const migration = {
  version: 2,
  name: 'add_players',

  up: (db: Database.Database) => {
    db.exec(`
      -- Players table
      CREATE TABLE IF NOT EXISTS players (
        id TEXT PRIMARY KEY,
        teamId TEXT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        displayName TEXT NOT NULL,
        jerseyNumber INTEGER,
        position TEXT,
        height TEXT,
        weight INTEGER,
        college TEXT,
        draftYear INTEGER,
        draftRound INTEGER,
        draftPick INTEGER,
        birthDate TEXT,
        photoUrl TEXT,
        active INTEGER DEFAULT 1,
        updatedAt INTEGER NOT NULL,
        FOREIGN KEY (teamId) REFERENCES teams(id)
      );

      -- Player career stats
      CREATE TABLE IF NOT EXISTS player_career_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playerId TEXT NOT NULL,
        season INTEGER NOT NULL,
        teamId TEXT NOT NULL,
        gamesPlayed INTEGER,
        gamesStarted INTEGER,
        statCategory TEXT NOT NULL,
        stats TEXT NOT NULL,
        updatedAt INTEGER NOT NULL,
        FOREIGN KEY (playerId) REFERENCES players(id),
        FOREIGN KEY (teamId) REFERENCES teams(id),
        UNIQUE(playerId, season, statCategory)
      );

      -- Indexes
      CREATE INDEX IF NOT EXISTS idx_players_team ON players(teamId);
      CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);
      CREATE INDEX IF NOT EXISTS idx_player_career_stats_player
        ON player_career_stats(playerId, season);
    `);
  },

  down: (db: Database.Database) => {
    db.exec(`
      DROP TABLE IF EXISTS player_career_stats;
      DROP TABLE IF EXISTS players;
    `);
  }
};
```

**Create `electron/migrations/003_add_advanced_features.ts`:**
```typescript
export const migration = {
  version: 3,
  name: 'add_advanced_features',

  up: (db: Database.Database) => {
    db.exec(`
      -- Standings
      CREATE TABLE IF NOT EXISTS standings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        season INTEGER NOT NULL,
        seasonType INTEGER NOT NULL,
        week INTEGER,
        teamId TEXT NOT NULL,
        division TEXT NOT NULL,
        conference TEXT NOT NULL,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        ties INTEGER DEFAULT 0,
        winPct REAL,
        divisionRank INTEGER,
        conferenceRank INTEGER,
        streak TEXT,
        updatedAt INTEGER NOT NULL,
        FOREIGN KEY (teamId) REFERENCES teams(id)
      );

      -- Predictions
      CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gameId TEXT NOT NULL,
        predictionType TEXT NOT NULL,
        predictedWinnerId TEXT,
        homeTeamProbability REAL,
        awayTeamProbability REAL,
        predictedHomeScore INTEGER,
        predictedAwayScore INTEGER,
        confidence REAL,
        factors TEXT,
        correct INTEGER,
        createdAt INTEGER NOT NULL,
        FOREIGN KEY (gameId) REFERENCES games(id),
        FOREIGN KEY (predictedWinnerId) REFERENCES teams(id)
      );

      -- Playoff brackets
      CREATE TABLE IF NOT EXISTS playoff_brackets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        season INTEGER NOT NULL,
        round TEXT NOT NULL,
        gameId TEXT,
        team1Id TEXT,
        team2Id TEXT,
        winnerId TEXT,
        FOREIGN KEY (gameId) REFERENCES games(id),
        FOREIGN KEY (team1Id) REFERENCES teams(id),
        FOREIGN KEY (team2Id) REFERENCES teams(id),
        FOREIGN KEY (winnerId) REFERENCES teams(id)
      );

      -- News
      CREATE TABLE IF NOT EXISTS news (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        content TEXT,
        sourceUrl TEXT,
        imageUrl TEXT,
        category TEXT,
        publishedDate TEXT,
        teamId TEXT,
        playerId TEXT,
        fetchedAt INTEGER NOT NULL,
        FOREIGN KEY (teamId) REFERENCES teams(id),
        FOREIGN KEY (playerId) REFERENCES players(id)
      );

      -- Alerts
      CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        alertType TEXT NOT NULL,
        enabled INTEGER DEFAULT 1,
        teamId TEXT,
        playerId TEXT,
        timingMinutes INTEGER,
        FOREIGN KEY (teamId) REFERENCES teams(id),
        FOREIGN KEY (playerId) REFERENCES players(id)
      );

      -- Favorite games
      CREATE TABLE IF NOT EXISTS favorite_games (
        gameId TEXT PRIMARY KEY,
        addedAt INTEGER NOT NULL,
        notes TEXT,
        FOREIGN KEY (gameId) REFERENCES games(id)
      );

      -- Indexes
      CREATE INDEX IF NOT EXISTS idx_standings_season ON standings(season, week);
      CREATE INDEX IF NOT EXISTS idx_predictions_game ON predictions(gameId);
      CREATE INDEX IF NOT EXISTS idx_news_team ON news(teamId);
      CREATE INDEX IF NOT EXISTS idx_news_published ON news(publishedDate);
    `);
  },

  down: (db: Database.Database) => {
    db.exec(`
      DROP TABLE IF EXISTS favorite_games;
      DROP TABLE IF EXISTS alerts;
      DROP TABLE IF EXISTS news;
      DROP TABLE IF EXISTS playoff_brackets;
      DROP TABLE IF EXISTS predictions;
      DROP TABLE IF EXISTS standings;
    `);
  }
};
```

---

### Step 1.3: Router Setup (6 hours)

**Create `src/Router.tsx`:**
```typescript
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const PlayerPage = lazy(() => import('./pages/PlayerPage'));
const StandingsPage = lazy(() => import('./pages/StandingsPage'));
const PlayoffsPage = lazy(() => import('./pages/PlayoffsPage'));
const PredictionsPage = lazy(() => import('./pages/PredictionsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/player/:playerId" element={<PlayerPage />} />
          <Route path="/standings" element={<StandingsPage />} />
          <Route path="/playoffs" element={<PlayoffsPage />} />
          <Route path="/predictions" element={<PredictionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
```

---

## Phase 2: Player System (Weeks 3-4)

**Time:** 30-40 hours | **Priority:** HIGH

### Step 2.1: Player Service (12 hours)

**Create `electron/services/playerService.ts`:**
```typescript
import axios from 'axios';
import { getDatabase } from '../database';
import { Player, PlayerCareerStats } from '../../src/types';

const ESPN_API_BASE = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';

export async function fetchAndStorePlayer(playerId: string): Promise<Player> {
  try {
    const response = await axios.get(`${ESPN_API_BASE}/athletes/${playerId}`);
    const data = response.data;

    const player: Player = {
      id: playerId,
      teamId: data.team?.id || null,
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: data.displayName,
      jerseyNumber: parseInt(data.jersey) || null,
      position: data.position?.abbreviation || null,
      height: data.height || null,
      weight: parseInt(data.weight) || null,
      college: data.college?.name || null,
      draftYear: data.draft?.year || null,
      draftRound: data.draft?.round || null,
      draftPick: data.draft?.selection || null,
      birthDate: data.dateOfBirth || null,
      photoUrl: data.headshot?.href || null,
      active: data.active ? 1 : 0,
      updatedAt: Date.now()
    };

    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO players (
        id, teamId, firstName, lastName, displayName,
        jerseyNumber, position, height, weight, college,
        draftYear, draftRound, draftPick, birthDate,
        photoUrl, active, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      player.id,
      player.teamId,
      player.firstName,
      player.lastName,
      player.displayName,
      player.jerseyNumber,
      player.position,
      player.height,
      player.weight,
      player.college,
      player.draftYear,
      player.draftRound,
      player.draftPick,
      player.birthDate,
      player.photoUrl,
      player.active,
      player.updatedAt
    );

    return player;
  } catch (error) {
    console.error(`Error fetching player ${playerId}:`, error);
    throw error;
  }
}

export function getPlayer(playerId: string): Player | null {
  const db = getDatabase();
  const player = db.prepare('SELECT * FROM players WHERE id = ?').get(playerId);
  return player as Player | null;
}

export function searchPlayers(query: string): Player[] {
  const db = getDatabase();
  const players = db.prepare(`
    SELECT * FROM players
    WHERE displayName LIKE ? OR firstName LIKE ? OR lastName LIKE ?
    ORDER BY displayName
    LIMIT 20
  `).all(`%${query}%`, `%${query}%`, `%${query}%`);

  return players as Player[];
}

export async function fetchPlayerCareerStats(playerId: string): Promise<void> {
  try {
    const response = await axios.get(`${ESPN_API_BASE}/athletes/${playerId}/statistics`);
    const data = response.data;

    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO player_career_stats (
        playerId, season, teamId, gamesPlayed, gamesStarted,
        statCategory, stats, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Process and store stats by season
    // (Implementation depends on ESPN API structure)

  } catch (error) {
    console.error(`Error fetching player stats ${playerId}:`, error);
    throw error;
  }
}
```

---

### Step 2.2: Player Profile Page (16 hours)

**Create `src/pages/PlayerPage.tsx`:**
```typescript
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Award } from 'lucide-react';
import { Player, PlayerCareerStats } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PlayerStatsTable from '../components/players/PlayerStatsTable';
import PlayerCharts from '../components/players/PlayerCharts';
import './PlayerPage.css';

const PlayerPage: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const navigate = useNavigate();

  const [player, setPlayer] = useState<Player | null>(null);
  const [careerStats, setCareerStats] = useState<PlayerCareerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlayerData();
  }, [playerId]);

  const loadPlayerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch player info
      const playerData = await window.electronAPI.getPlayer(playerId!);
      if (!playerData) {
        // Fetch from API if not in database
        await window.electronAPI.fetchPlayer(playerId!);
        const newData = await window.electronAPI.getPlayer(playerId!);
        setPlayer(newData);
      } else {
        setPlayer(playerData);
      }

      // Fetch career stats
      const stats = await window.electronAPI.getPlayerCareerStats(playerId!);
      setCareerStats(stats);

    } catch (err) {
      setError('Failed to load player data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !player) {
    return (
      <div className="error-page">
        <p>{error || 'Player not found'}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="player-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="player-header">
        <div className="player-photo">
          {player.photoUrl ? (
            <img src={player.photoUrl} alt={player.displayName} />
          ) : (
            <div className="photo-placeholder">
              {player.firstName[0]}{player.lastName[0]}
            </div>
          )}
        </div>

        <div className="player-info">
          <h1>{player.displayName}</h1>
          <div className="player-meta">
            <span className="jersey-number">#{player.jerseyNumber}</span>
            <span className="position">{player.position}</span>
          </div>

          <div className="player-details">
            {player.height && player.weight && (
              <div className="detail">
                <Calendar size={16} />
                {player.height} | {player.weight} lbs
              </div>
            )}
            {player.college && (
              <div className="detail">
                <Award size={16} />
                {player.college}
              </div>
            )}
            {player.draftYear && (
              <div className="detail">
                <MapPin size={16} />
                Draft: {player.draftYear} | Rd {player.draftRound} | Pick {player.draftPick}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="player-content">
        <div className="tabs">
          <button className="tab active">Career Stats</button>
          <button className="tab">Game Log</button>
          <button className="tab">News</button>
        </div>

        <PlayerStatsTable stats={careerStats} />
        <PlayerCharts stats={careerStats} />
      </div>
    </div>
  );
};

export default PlayerPage;
```

---

## Phase 3: Advanced Analytics (Weeks 5-6)

**Time:** 40-50 hours | **Priority:** HIGH

### Step 3.1: Standings Service (12 hours)

**Create `electron/services/standingsService.ts`:**
```typescript
import axios from 'axios';
import { getDatabase } from '../database';
import { Standing } from '../../src/types';

const ESPN_API_BASE = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';

export async function fetchAndStoreStandings(season: number = 2025): Promise<void> {
  try {
    const response = await axios.get(`${ESPN_API_BASE}/standings?season=${season}`);
    const data = response.data;

    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO standings (
        season, seasonType, week, teamId, division, conference,
        wins, losses, ties, winPct, divisionRank, conferenceRank,
        streak, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Process standings data
    for (const entry of data.standings) {
      stmt.run(
        season,
        2, // Regular season
        null, // Current week
        entry.team.id,
        entry.division?.name || 'Unknown',
        entry.conference?.name || 'Unknown',
        entry.stats.find((s: any) => s.name === 'wins')?.value || 0,
        entry.stats.find((s: any) => s.name === 'losses')?.value || 0,
        entry.stats.find((s: any) => s.name === 'ties')?.value || 0,
        parseFloat(entry.stats.find((s: any) => s.name === 'winPercent')?.value || '0'),
        entry.divisionRank || null,
        entry.conferenceRank || null,
        entry.streak || null,
        Date.now()
      );
    }

    console.log('Standings updated successfully');
  } catch (error) {
    console.error('Error fetching standings:', error);
    throw error;
  }
}

export function getStandings(season: number = 2025): Standing[] {
  const db = getDatabase();
  const standings = db.prepare(`
    SELECT s.*, t.displayName, t.abbreviation, t.logo, t.color
    FROM standings s
    JOIN teams t ON s.teamId = t.id
    WHERE s.season = ?
    ORDER BY s.conference, s.division, s.divisionRank
  `).all(season);

  return standings as Standing[];
}

export function getDivisionStandings(division: string, season: number = 2025): Standing[] {
  const db = getDatabase();
  const standings = db.prepare(`
    SELECT s.*, t.displayName, t.abbreviation, t.logo
    FROM standings s
    JOIN teams t ON s.teamId = t.id
    WHERE s.season = ? AND s.division = ?
    ORDER BY s.divisionRank
  `).all(season, division);

  return standings as Standing[];
}
```

---

### Step 3.2: Analytics Dashboard (20 hours)

**Create `src/pages/AnalyticsPage.tsx`:**
```typescript
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Award } from 'lucide-react';
import TeamMetrics from '../components/analytics/TeamMetrics';
import LeagueLeaders from '../components/analytics/LeagueLeaders';
import StandingsTable from '../components/analytics/StandingsTable';
import PerformanceCharts from '../components/analytics/PerformanceCharts';
import { Team, Standing } from '../types';
import './AnalyticsPage.css';

const AnalyticsPage: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      const standingsData = await window.electronAPI.getStandings();
      setStandings(standingsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <div className="header-title">
          <BarChart3 size={32} />
          <h1>Advanced Analytics</h1>
        </div>
        <div className="header-controls">
          {/* Team selector, season selector, etc. */}
        </div>
      </header>

      <div className="analytics-grid">
        <div className="analytics-section standings-section">
          <h2>
            <Award size={24} />
            NFL Standings
          </h2>
          <StandingsTable standings={standings} onSelectTeam={setSelectedTeam} />
        </div>

        <div className="analytics-section metrics-section">
          <h2>
            <TrendingUp size={24} />
            Team Metrics
          </h2>
          {selectedTeam ? (
            <TeamMetrics team={selectedTeam} />
          ) : (
            <p className="no-selection">Select a team to view metrics</p>
          )}
        </div>

        <div className="analytics-section leaders-section">
          <h2>Statistical Leaders</h2>
          <LeagueLeaders />
        </div>

        {selectedTeam && (
          <div className="analytics-section charts-section">
            <h2>Performance Trends</h2>
            <PerformanceCharts team={selectedTeam} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
```

---

## Phase 4: Game Predictions (Weeks 7-8)

**Time:** 30-40 hours | **Priority:** MEDIUM

### Step 4.1: Prediction Algorithm (16 hours)

**Create `electron/utils/predictionEngine.ts`:**
```typescript
import { getDatabase } from '../database';
import { Game, Team } from '../../src/types';

interface PredictionFactors {
  homeFieldAdvantage: number;
  recentForm: number;
  headToHead: number;
  offensiveRating: number;
  defensiveRating: number;
}

export interface GamePrediction {
  gameId: string;
  homeTeamProbability: number;
  awayTeamProbability: number;
  predictedHomeScore: number;
  predictedAwayScore: number;
  predictedWinnerId: string;
  confidence: number;
  factors: PredictionFactors;
}

const WEIGHTS = {
  homeFieldAdvantage: 0.15,
  recentForm: 0.30,
  headToHead: 0.10,
  offensiveRating: 0.25,
  defensiveRating: 0.20
};

export function predictGame(game: Game): GamePrediction {
  const db = getDatabase();

  // Calculate factors
  const homeFieldAdvantage = calculateHomeFieldAdvantage();
  const recentForm = calculateRecentForm(game.homeTeamId, game.awayTeamId);
  const headToHead = calculateHeadToHead(game.homeTeamId, game.awayTeamId);
  const offensiveRating = calculateOffensiveRating(game.homeTeamId, game.awayTeamId);
  const defensiveRating = calculateDefensiveRating(game.homeTeamId, game.awayTeamId);

  const factors: PredictionFactors = {
    homeFieldAdvantage,
    recentForm,
    headToHead,
    offensiveRating,
    defensiveRating
  };

  // Calculate weighted probability
  const homeAdvantage =
    homeFieldAdvantage * WEIGHTS.homeFieldAdvantage +
    recentForm * WEIGHTS.recentForm +
    headToHead * WEIGHTS.headToHead +
    offensiveRating * WEIGHTS.offensiveRating +
    defensiveRating * WEIGHTS.defensiveRating;

  // Convert to probability (50% base + advantage)
  const homeTeamProbability = Math.max(0.1, Math.min(0.9, 0.5 + homeAdvantage));
  const awayTeamProbability = 1 - homeTeamProbability;

  // Predict scores (simplified)
  const avgScore = 24; // NFL average
  const predictedHomeScore = Math.round(avgScore + (homeTeamProbability - 0.5) * 20);
  const predictedAwayScore = Math.round(avgScore + (awayTeamProbability - 0.5) * 20);

  const predictedWinnerId = homeTeamProbability > 0.5 ? game.homeTeamId : game.awayTeamId;

  // Calculate confidence (distance from 50%)
  const confidence = Math.abs(homeTeamProbability - 0.5) * 2;

  return {
    gameId: game.id,
    homeTeamProbability: Math.round(homeTeamProbability * 100) / 100,
    awayTeamProbability: Math.round(awayTeamProbability * 100) / 100,
    predictedHomeScore,
    predictedAwayScore,
    predictedWinnerId,
    confidence: Math.round(confidence * 100) / 100,
    factors
  };
}

function calculateHomeFieldAdvantage(): number {
  // Home teams win ~57% historically
  return 0.07; // 7% advantage
}

function calculateRecentForm(homeTeamId: string, awayTeamId: string): number {
  const db = getDatabase();

  // Get last 5 games for each team
  const homeGames = db.prepare(`
    SELECT * FROM games
    WHERE (homeTeamId = ? OR awayTeamId = ?) AND completed = 1
    ORDER BY timestamp DESC
    LIMIT 5
  `).all(homeTeamId, homeTeamId);

  const awayGames = db.prepare(`
    SELECT * FROM games
    WHERE (homeTeamId = ? OR awayTeamId = ?) AND completed = 1
    ORDER BY timestamp DESC
    LIMIT 5
  `).all(awayTeamId, awayTeamId);

  const homeWins = homeGames.filter((g: any) => {
    if (g.homeTeamId === homeTeamId) return g.homeScore > g.awayScore;
    return g.awayScore > g.homeScore;
  }).length;

  const awayWins = awayGames.filter((g: any) => {
    if (g.homeTeamId === awayTeamId) return g.homeScore > g.awayScore;
    return g.awayScore > g.homeScore;
  }).length;

  const homeWinPct = homeWins / 5;
  const awayWinPct = awayWins / 5;

  // Return normalized advantage (-0.2 to +0.2)
  return (homeWinPct - awayWinPct) * 0.4 - 0.2;
}

function calculateHeadToHead(homeTeamId: string, awayTeamId: string): number {
  const db = getDatabase();

  const h2hGames = db.prepare(`
    SELECT * FROM games
    WHERE ((homeTeamId = ? AND awayTeamId = ?) OR
           (homeTeamId = ? AND awayTeamId = ?))
      AND completed = 1
    ORDER BY timestamp DESC
    LIMIT 3
  `).all(homeTeamId, awayTeamId, awayTeamId, homeTeamId);

  if (h2hGames.length === 0) return 0;

  const homeWins = h2hGames.filter((g: any) => {
    if (g.homeTeamId === homeTeamId) return g.homeScore > g.awayScore;
    return g.awayScore > g.homeScore;
  }).length;

  const winPct = homeWins / h2hGames.length;
  return (winPct - 0.5) * 0.2; // -0.1 to +0.1
}

function calculateOffensiveRating(homeTeamId: string, awayTeamId: string): number {
  // Simplified - use points per game
  const db = getDatabase();

  const homePPG = getTeamAvgPointsScored(homeTeamId);
  const awayPPG = getTeamAvgPointsScored(awayTeamId);

  const nflAvg = 24;
  const homeDiff = (homePPG - nflAvg) / nflAvg;
  const awayDiff = (awayPPG - nflAvg) / nflAvg;

  return (homeDiff - awayDiff) * 0.15; // -0.15 to +0.15
}

function calculateDefensiveRating(homeTeamId: string, awayTeamId: string): number {
  // Simplified - use points allowed per game
  const db = getDatabase();

  const homePPGA = getTeamAvgPointsAllowed(homeTeamId);
  const awayPPGA = getTeamAvgPointsAllowed(awayTeamId);

  const nflAvg = 24;
  // Lower is better for defense
  const homeDiff = (nflAvg - homePPGA) / nflAvg;
  const awayDiff = (nflAvg - awayPPGA) / nflAvg;

  return (homeDiff - awayDiff) * 0.15; // -0.15 to +0.15
}

function getTeamAvgPointsScored(teamId: string): number {
  const db = getDatabase();
  const games = db.prepare(`
    SELECT homeScore, awayScore, homeTeamId
    FROM games
    WHERE (homeTeamId = ? OR awayTeamId = ?) AND completed = 1
    LIMIT 10
  `).all(teamId, teamId);

  if (games.length === 0) return 24;

  const totalPoints = games.reduce((sum: number, g: any) => {
    return sum + (g.homeTeamId === teamId ? g.homeScore : g.awayScore);
  }, 0);

  return totalPoints / games.length;
}

function getTeamAvgPointsAllowed(teamId: string): number {
  const db = getDatabase();
  const games = db.prepare(`
    SELECT homeScore, awayScore, homeTeamId
    FROM games
    WHERE (homeTeamId = ? OR awayTeamId = ?) AND completed = 1
    LIMIT 10
  `).all(teamId, teamId);

  if (games.length === 0) return 24;

  const totalPoints = games.reduce((sum: number, g: any) => {
    return sum + (g.homeTeamId === teamId ? g.awayScore : g.homeScore);
  }, 0);

  return totalPoints / games.length;
}
```

---

## Remaining Phases (Abbreviated)

### Phase 5: Playoffs & Multi-Season (Weeks 9-10)
- Playoff bracket visualization
- Season selector
- Historical data fetching

### Phase 6: Search & Filters (Weeks 11-12)
- Global search implementation
- Advanced filtering
- Saved filter presets

### Phase 7: Export Functionality (Week 13)
- CSV export
- PDF generation
- Share features

### Phase 8: Notifications & News (Week 14)
- Alert system
- News integration
- Background scheduler

### Phase 9: Fantasy & Social (Week 15)
- Fantasy stats
- Social sharing
- Activity tracking

### Phase 10: Polish & Testing (Weeks 16+)
- Bug fixes
- Performance optimization
- User testing
- Documentation

---

## Complete Checklist

### Infrastructure ✅
- [ ] Database migrations
- [ ] Router setup
- [ ] Context providers
- [ ] Error boundaries

### Core Features ✅
- [ ] Player profiles
- [ ] Career stats
- [ ] Standings
- [ ] Analytics dashboard

### Advanced Features
- [ ] Game predictions
- [ ] Playoff brackets
- [ ] Multi-season support
- [ ] Search & filters
- [ ] Export (CSV/PDF)
- [ ] Notifications
- [ ] News feed
- [ ] Fantasy integration

### Polish
- [ ] Charts & visualizations
- [ ] Responsive design
- [ ] Performance optimization
- [ ] Accessibility
- [ ] Testing

---

## Success Metrics

✅ All 14 feature categories implemented
✅ Database optimized (<100ms queries)
✅ UI polished and responsive
✅ Prediction accuracy >60%
✅ User engagement +200%

---

**Congratulations!** You've built VERSION 3: The ultimate NFL Dashboard

This is now a comprehensive NFL analytics platform that rivals professional sports apps.
