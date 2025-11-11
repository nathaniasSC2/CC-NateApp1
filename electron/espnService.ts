import axios from 'axios';
import { getDatabase } from './database';

const ESPN_API_BASE = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';
const CURRENT_SEASON = 2025;
const SEASON_TYPE = 2; // Regular season

interface Team {
  id: string;
  name: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  color?: string;
  alternateColor?: string;
  logo?: string;
  location: string;
}

interface Game {
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
  venue: string | null;
  city: string | null;
  state: string | null;
  completed: boolean;
  inProgress: boolean;
}

export async function syncNFLData(): Promise<void> {
  console.log('Starting NFL data sync...');
  const db = getDatabase();

  try {
    // Fetch teams first
    const teamsResponse = await axios.get(`${ESPN_API_BASE}/teams`, {
      params: { limit: 100 }
    });

    const teams = teamsResponse.data.sports[0].leagues[0].teams;

    const insertTeam = db.prepare(`
      INSERT OR REPLACE INTO teams
      (id, name, abbreviation, displayName, shortDisplayName, color, alternateColor, logo, location, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const teamData of teams) {
      const team = teamData.team;
      insertTeam.run(
        team.id,
        team.name,
        team.abbreviation,
        team.displayName,
        team.shortDisplayName,
        team.color || null,
        team.alternateColor || null,
        team.logos?.[0]?.href || null,
        team.location,
        Date.now()
      );
    }

    console.log(`Synced ${teams.length} teams`);

    // Fetch current season schedule
    const scheduleResponse = await axios.get(`${ESPN_API_BASE}/scoreboard`, {
      params: {
        limit: 1000,
        dates: `${CURRENT_SEASON}0901-${CURRENT_SEASON}0228` // Sept to Feb
      }
    });

    const events = scheduleResponse.data.events || [];

    const insertGame = db.prepare(`
      INSERT OR REPLACE INTO games
      (id, season, seasonType, week, date, timestamp, homeTeamId, awayTeamId,
       homeScore, awayScore, status, venue, city, state, completed, inProgress, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const event of events) {
      const competition = event.competitions[0];
      const homeTeam = competition.competitors.find((c: any) => c.homeAway === 'home');
      const awayTeam = competition.competitors.find((c: any) => c.homeAway === 'away');

      const status = event.status.type.state;
      const completed = status === 'post';
      const inProgress = status === 'in';

      insertGame.run(
        event.id,
        event.season.year,
        event.season.type,
        event.week.number,
        event.date,
        new Date(event.date).getTime(),
        homeTeam.team.id,
        awayTeam.team.id,
        completed || inProgress ? parseInt(homeTeam.score) : null,
        completed || inProgress ? parseInt(awayTeam.score) : null,
        status,
        competition.venue?.fullName || null,
        competition.venue?.address?.city || null,
        competition.venue?.address?.state || null,
        completed ? 1 : 0,
        inProgress ? 1 : 0,
        Date.now()
      );
    }

    console.log(`Synced ${events.length} games`);
  } catch (error) {
    console.error('Error syncing NFL data:', error);
    throw error;
  }
}

export async function getNextGameOverall(): Promise<any> {
  const db = getDatabase();
  const now = Date.now();

  const game = db.prepare(`
    SELECT g.*,
           ht.displayName as homeTeamName, ht.abbreviation as homeTeamAbbr,
           ht.logo as homeTeamLogo, ht.color as homeTeamColor,
           at.displayName as awayTeamName, at.abbreviation as awayTeamAbbr,
           at.logo as awayTeamLogo, at.color as awayTeamColor
    FROM games g
    JOIN teams ht ON g.homeTeamId = ht.id
    JOIN teams at ON g.awayTeamId = at.id
    WHERE g.completed = 0 AND g.timestamp > ?
    ORDER BY g.timestamp ASC
    LIMIT 1
  `).get(now);

  return game;
}

export async function getTeamNextGame(teamId: string): Promise<any> {
  const db = getDatabase();
  const now = Date.now();

  const game = db.prepare(`
    SELECT g.*,
           ht.displayName as homeTeamName, ht.abbreviation as homeTeamAbbr,
           ht.logo as homeTeamLogo, ht.color as homeTeamColor,
           at.displayName as awayTeamName, at.abbreviation as awayTeamAbbr,
           at.logo as awayTeamLogo, at.color as awayTeamColor
    FROM games g
    JOIN teams ht ON g.homeTeamId = ht.id
    JOIN teams at ON g.awayTeamId = at.id
    WHERE (g.homeTeamId = ? OR g.awayTeamId = ?)
      AND g.completed = 0
      AND g.timestamp > ?
    ORDER BY g.timestamp ASC
    LIMIT 1
  `).get(teamId, teamId, now);

  return game;
}

export async function getAllTeams(): Promise<Team[]> {
  const db = getDatabase();
  const teams = db.prepare(`
    SELECT * FROM teams
    ORDER BY location, name
  `).all() as Team[];

  return teams;
}

export async function getTeamSchedule(teamId: string): Promise<any[]> {
  const db = getDatabase();

  const games = db.prepare(`
    SELECT g.*,
           ht.displayName as homeTeamName, ht.abbreviation as homeTeamAbbr,
           ht.logo as homeTeamLogo, ht.color as homeTeamColor,
           at.displayName as awayTeamName, at.abbreviation as awayTeamAbbr,
           at.logo as awayTeamLogo, at.color as awayTeamColor
    FROM games g
    JOIN teams ht ON g.homeTeamId = ht.id
    JOIN teams at ON g.awayTeamId = at.id
    WHERE g.homeTeamId = ? OR g.awayTeamId = ?
    ORDER BY g.timestamp ASC
  `).all(teamId, teamId);

  return games;
}

export async function getGameDetails(gameId: string): Promise<any> {
  const db = getDatabase();

  // Get basic game info
  const game = db.prepare(`
    SELECT g.*,
           ht.displayName as homeTeamName, ht.abbreviation as homeTeamAbbr,
           ht.logo as homeTeamLogo, ht.color as homeTeamColor,
           at.displayName as awayTeamName, at.abbreviation as awayTeamAbbr,
           at.logo as awayTeamLogo, at.color as awayTeamColor
    FROM games g
    JOIN teams ht ON g.homeTeamId = ht.id
    JOIN teams at ON g.awayTeamId = at.id
    WHERE g.id = ?
  `).get(gameId);

  if (!game) return null;

  // If game is completed and we haven't fetched details recently, fetch from API
  if (game.completed && (!game.detailsLastFetched || Date.now() - game.detailsLastFetched > 3600000)) {
    await fetchGameStats(gameId);
  }

  // Get player stats
  const playerStats = db.prepare(`
    SELECT * FROM player_stats
    WHERE gameId = ?
    ORDER BY teamId, category
  `).all(gameId);

  // Get team stats
  const teamStats = db.prepare(`
    SELECT * FROM game_stats
    WHERE gameId = ?
  `).all(gameId);

  // If no stats available and game not played, get season averages
  if (playerStats.length === 0 && !game.completed) {
    const homeSeasonStats = db.prepare(`
      SELECT * FROM season_stats
      WHERE teamId = ? AND season = ?
      ORDER BY category
      LIMIT 20
    `).all(game.homeTeamId, game.season);

    const awaySeasonStats = db.prepare(`
      SELECT * FROM season_stats
      WHERE teamId = ? AND season = ?
      ORDER BY category
      LIMIT 20
    `).all(game.awayTeamId, game.season);

    return {
      ...game,
      playerStats: [],
      teamStats: [],
      seasonStats: {
        home: homeSeasonStats,
        away: awaySeasonStats
      }
    };
  }

  return {
    ...game,
    playerStats,
    teamStats,
    seasonStats: null
  };
}

async function fetchGameStats(gameId: string): Promise<void> {
  try {
    const response = await axios.get(`${ESPN_API_BASE}/summary`, {
      params: { event: gameId }
    });

    const db = getDatabase();
    const data = response.data;

    // Clear existing stats
    db.prepare('DELETE FROM player_stats WHERE gameId = ?').run(gameId);
    db.prepare('DELETE FROM game_stats WHERE gameId = ?').run(gameId);

    // Insert team stats
    if (data.boxscore?.teams) {
      const insertTeamStat = db.prepare(`
        INSERT INTO game_stats (gameId, teamId, category, statType, statValue)
        VALUES (?, ?, ?, ?, ?)
      `);

      for (const team of data.boxscore.teams) {
        if (team.statistics) {
          for (const stat of team.statistics) {
            insertTeamStat.run(
              gameId,
              team.team.id,
              'team',
              stat.name,
              stat.displayValue
            );
          }
        }
      }
    }

    // Insert player stats
    if (data.boxscore?.players) {
      const insertPlayerStat = db.prepare(`
        INSERT INTO player_stats (gameId, teamId, playerId, playerName, position, category, stats)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const teamData of data.boxscore.players) {
        const teamId = teamData.team.id;

        for (const category of teamData.statistics || []) {
          const categoryName = category.name;

          for (const athlete of category.athletes || []) {
            insertPlayerStat.run(
              gameId,
              teamId,
              athlete.athlete.id,
              athlete.athlete.displayName,
              athlete.athlete.position?.abbreviation || null,
              categoryName,
              JSON.stringify(athlete.stats)
            );
          }
        }
      }
    }

    // Update game's detailsLastFetched timestamp
    db.prepare('UPDATE games SET detailsLastFetched = ? WHERE id = ?').run(Date.now(), gameId);

    console.log(`Fetched stats for game ${gameId}`);
  } catch (error) {
    console.error(`Error fetching game stats for ${gameId}:`, error);
  }
}
