import axios from 'axios';
import { getStore, persist, GameRecord, TeamRecord } from './store';

const ESPN_API_BASE = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';

// NFL seasons are labeled by the year they start in. Games from January and
// February belong to the season that started the previous calendar year.
export function currentSeason(): number {
  const now = new Date();
  return now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
}

function upsertGameFromEvent(event: any): GameRecord | null {
  const store = getStore();
  const competition = event.competitions?.[0];
  if (!competition) return null;

  const homeTeam = competition.competitors?.find((c: any) => c.homeAway === 'home');
  const awayTeam = competition.competitors?.find((c: any) => c.homeAway === 'away');
  if (!homeTeam || !awayTeam) return null;

  const state = event.status?.type?.state ?? 'pre';
  const completed = state === 'post';
  const inProgress = state === 'in';
  const parseScore = (v: any) => {
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? null : n;
  };

  const existing = store.games[event.id];
  const game: GameRecord = {
    id: event.id,
    season: event.season?.year ?? currentSeason(),
    seasonType: event.season?.type ?? 2,
    week: event.week?.number ?? 0,
    date: event.date,
    timestamp: new Date(event.date).getTime(),
    homeTeamId: homeTeam.team.id,
    awayTeamId: awayTeam.team.id,
    homeScore: completed || inProgress ? parseScore(homeTeam.score) : null,
    awayScore: completed || inProgress ? parseScore(awayTeam.score) : null,
    status: state,
    statusDetail: event.status?.type?.shortDetail ?? null,
    period: event.status?.period ?? 0,
    clock: event.status?.displayClock ?? null,
    venue: competition.venue?.fullName ?? null,
    city: competition.venue?.address?.city ?? null,
    state: competition.venue?.address?.state ?? null,
    completed: completed ? 1 : 0,
    inProgress: inProgress ? 1 : 0,
    detailsLastFetched: existing?.detailsLastFetched,
    updatedAt: Date.now(),
  };

  store.games[event.id] = game;
  return game;
}

export async function syncNFLData(): Promise<void> {
  console.log('Starting NFL data sync...');
  const store = getStore();

  const teamsResponse = await axios.get(`${ESPN_API_BASE}/teams`, {
    params: { limit: 100 },
  });

  const teams = teamsResponse.data.sports[0].leagues[0].teams;
  for (const teamData of teams) {
    const team = teamData.team;
    store.teams[team.id] = {
      id: team.id,
      name: team.name,
      abbreviation: team.abbreviation,
      displayName: team.displayName,
      shortDisplayName: team.shortDisplayName,
      color: team.color || null,
      alternateColor: team.alternateColor || null,
      logo: team.logos?.[0]?.href || null,
      location: team.location,
      updatedAt: Date.now(),
    };
  }
  console.log(`Synced ${teams.length} teams`);

  // Full season sweep: August through the Super Bowl in February of next year
  const season = currentSeason();
  const scheduleResponse = await axios.get(`${ESPN_API_BASE}/scoreboard`, {
    params: {
      limit: 1000,
      dates: `${season}0801-${season + 1}0301`,
    },
  });

  const events = scheduleResponse.data.events || [];
  for (const event of events) {
    upsertGameFromEvent(event);
  }
  console.log(`Synced ${events.length} games for the ${season} season`);
  persist();
}

// Lightweight refresh: hits the current scoreboard (this week only) to pick up
// live score/clock changes without re-sweeping the whole season.
export async function syncLiveGames(): Promise<any[]> {
  const response = await axios.get(`${ESPN_API_BASE}/scoreboard`);
  const events = response.data.events || [];
  const updated: GameRecord[] = [];
  for (const event of events) {
    const game = upsertGameFromEvent(event);
    if (game) updated.push(game);
  }
  if (updated.length > 0) persist();
  return updated.map(joinGame).filter(Boolean);
}

function joinGame(game: GameRecord | undefined | null): any {
  if (!game) return null;
  const store = getStore();
  const home = store.teams[game.homeTeamId];
  const away = store.teams[game.awayTeamId];
  if (!home || !away) return null;
  return {
    ...game,
    homeTeamName: home.displayName,
    homeTeamAbbr: home.abbreviation,
    homeTeamLogo: home.logo,
    homeTeamColor: home.color,
    awayTeamName: away.displayName,
    awayTeamAbbr: away.abbreviation,
    awayTeamLogo: away.logo,
    awayTeamColor: away.color,
  };
}

function allGamesSorted(): GameRecord[] {
  return Object.values(getStore().games).sort((a, b) => a.timestamp - b.timestamp);
}

export function hasLiveGames(): boolean {
  return Object.values(getStore().games).some(g => g.inProgress === 1);
}

export async function getNextGameOverall(): Promise<any> {
  const now = Date.now();
  // A game that kicked off is still "next" while it's live
  const live = allGamesSorted().find(g => g.inProgress === 1);
  if (live) return joinGame(live);
  const next = allGamesSorted().find(g => g.completed === 0 && g.timestamp > now);
  return joinGame(next);
}

export async function getTeamNextGame(teamId: string): Promise<any> {
  const now = Date.now();
  const teamGames = allGamesSorted().filter(
    g => g.homeTeamId === teamId || g.awayTeamId === teamId
  );
  const live = teamGames.find(g => g.inProgress === 1);
  if (live) return joinGame(live);
  const next = teamGames.find(g => g.completed === 0 && g.timestamp > now);
  return joinGame(next);
}

export async function getLiveGames(): Promise<any[]> {
  return allGamesSorted()
    .filter(g => g.inProgress === 1)
    .map(joinGame)
    .filter(Boolean);
}

export function getGame(gameId: string): any {
  return joinGame(getStore().games[gameId]);
}

export async function getAllTeams(): Promise<any[]> {
  const store = getStore();
  const records: Record<string, { wins: number; losses: number; ties: number }> = {};
  for (const game of Object.values(store.games)) {
    if (game.completed !== 1 || game.homeScore === null || game.awayScore === null) continue;
    for (const [teamId, own, opp] of [
      [game.homeTeamId, game.homeScore, game.awayScore] as const,
      [game.awayTeamId, game.awayScore, game.homeScore] as const,
    ]) {
      records[teamId] ??= { wins: 0, losses: 0, ties: 0 };
      if (own > opp) records[teamId].wins++;
      else if (own < opp) records[teamId].losses++;
      else records[teamId].ties++;
    }
  }

  return Object.values(store.teams)
    .sort((a, b) => a.location.localeCompare(b.location) || a.name.localeCompare(b.name))
    .map((team: TeamRecord) => ({
      ...team,
      wins: records[team.id]?.wins ?? 0,
      losses: records[team.id]?.losses ?? 0,
      ties: records[team.id]?.ties ?? 0,
    }));
}

export async function getTeamSchedule(teamId: string): Promise<any[]> {
  return allGamesSorted()
    .filter(g => g.homeTeamId === teamId || g.awayTeamId === teamId)
    .map(joinGame)
    .filter(Boolean);
}

export async function getGameDetails(gameId: string): Promise<any> {
  const store = getStore();
  const game = store.games[gameId];
  if (!game) return null;

  const refetchAfter = game.inProgress === 1 ? 60000 : 3600000;
  if (
    (game.completed === 1 || game.inProgress === 1) &&
    (!game.detailsLastFetched || Date.now() - game.detailsLastFetched > refetchAfter)
  ) {
    await fetchGameStats(gameId);
  }

  return {
    ...joinGame(store.games[gameId]),
    playerStats: store.playerStats[gameId] ?? [],
    teamStats: store.gameStats[gameId] ?? [],
    seasonStats: null,
  };
}

async function fetchGameStats(gameId: string): Promise<void> {
  try {
    const response = await axios.get(`${ESPN_API_BASE}/summary`, {
      params: { event: gameId },
    });

    const store = getStore();
    const data = response.data;
    let rowId = 0;

    const teamStats: any[] = [];
    if (data.boxscore?.teams) {
      for (const team of data.boxscore.teams) {
        for (const stat of team.statistics ?? []) {
          teamStats.push({
            id: ++rowId,
            gameId,
            teamId: team.team.id,
            category: 'team',
            statType: stat.label ?? stat.name,
            statValue: stat.displayValue,
          });
        }
      }
    }

    const playerStats: any[] = [];
    if (data.boxscore?.players) {
      for (const teamData of data.boxscore.players) {
        const teamId = teamData.team.id;
        for (const category of teamData.statistics ?? []) {
          for (const athlete of category.athletes ?? []) {
            playerStats.push({
              id: ++rowId,
              gameId,
              teamId,
              playerId: athlete.athlete.id,
              playerName: athlete.athlete.displayName,
              position: athlete.athlete.position?.abbreviation ?? null,
              category: category.text ?? category.name,
              stats: JSON.stringify(athlete.stats),
            });
          }
        }
      }
    }

    store.gameStats[gameId] = teamStats;
    store.playerStats[gameId] = playerStats;
    if (store.games[gameId]) {
      store.games[gameId].detailsLastFetched = Date.now();
    }
    persist();
    console.log(`Fetched stats for game ${gameId}`);
  } catch (error) {
    console.error(`Error fetching game stats for ${gameId}:`, error);
  }
}
