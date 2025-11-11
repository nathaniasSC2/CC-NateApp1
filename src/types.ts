export interface Team {
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

export interface Game {
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
  completed: number;
  inProgress: number;
  homeTeamName: string;
  homeTeamAbbr: string;
  homeTeamLogo: string;
  homeTeamColor: string;
  awayTeamName: string;
  awayTeamAbbr: string;
  awayTeamLogo: string;
  awayTeamColor: string;
}

export interface PlayerStat {
  id: number;
  gameId: string;
  teamId: string;
  playerId: string;
  playerName: string;
  position: string | null;
  category: string;
  stats: string;
}

export interface TeamStat {
  id: number;
  gameId: string;
  teamId: string;
  category: string;
  statType: string;
  statValue: string;
}

export interface SeasonStat {
  id: number;
  teamId: string;
  playerId: string;
  playerName: string;
  position: string | null;
  season: number;
  category: string;
  stats: string;
}

export interface GameDetails extends Game {
  playerStats: PlayerStat[];
  teamStats: TeamStat[];
  seasonStats: {
    home: SeasonStat[];
    away: SeasonStat[];
  } | null;
}

declare global {
  interface Window {
    electronAPI: {
      syncNFLData: () => Promise<{ success: boolean; error?: string }>;
      getNextGameOverall: () => Promise<Game | null>;
      getTeamNextGame: (teamId: string) => Promise<Game | null>;
      getAllTeams: () => Promise<Team[]>;
      getTeamSchedule: (teamId: string) => Promise<Game[]>;
      getGameDetails: (gameId: string) => Promise<GameDetails | null>;
      setFavoriteTeam: (teamId: string) => Promise<{ success: boolean; error?: string }>;
      getFavoriteTeam: () => Promise<string | null>;
    };
  }
}
