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
  wins?: number;
  losses?: number;
  ties?: number;
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
  statusDetail: string | null;
  period: number;
  clock: string | null;
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
      syncLive: () => Promise<Game[]>;
      getNextGameOverall: () => Promise<Game | null>;
      getTeamNextGame: (teamId: string) => Promise<Game | null>;
      getAllTeams: () => Promise<Team[]>;
      getTeamSchedule: (teamId: string) => Promise<Game[]>;
      getGameDetails: (gameId: string) => Promise<GameDetails | null>;
      getGame: (gameId: string) => Promise<Game | null>;
      getLiveGames: () => Promise<Game[]>;
      setFavoriteTeam: (teamId: string) => Promise<{ success: boolean; error?: string }>;
      getFavoriteTeam: () => Promise<string | null>;
      pinGame: (gameId: string) => Promise<{ success: boolean }>;
      unpinGame: (gameId: string) => Promise<{ success: boolean }>;
      getPinnedGameIds: () => Promise<string[]>;
      onLiveScores: (callback: (games: Game[]) => void) => () => void;
      onPinnedChanged: (callback: (gameIds: string[]) => void) => () => void;
    };
  }
}
