import { Team, Game } from '../types';
import { format, formatDistanceToNowStrict } from 'date-fns';
import './Dashboard.css';

interface DashboardProps {
  nextGameOverall: Game | null;
  favoriteTeamNextGame: Game | null;
  favoriteTeam: string | null;
  allTeams: Team[];
  onSetFavoriteTeam: (teamId: string) => void;
  onRefresh: () => void;
  syncing: boolean;
}

function GameCard({ game }: { game: Game }) {
  const isLive = game.inProgress === 1;

  return (
    <div className="game-info">
      <div className="teams">
        <div className="team">
          <img src={game.awayTeamLogo} alt={game.awayTeamName} />
          <span className="team-name">{game.awayTeamAbbr}</span>
          {isLive && <span className="team-live-score">{game.awayScore}</span>}
        </div>
        <span className="vs">@</span>
        <div className="team">
          <img src={game.homeTeamLogo} alt={game.homeTeamName} />
          <span className="team-name">{game.homeTeamAbbr}</span>
          {isLive && <span className="team-live-score">{game.homeScore}</span>}
        </div>
      </div>

      {isLive ? (
        <div className="game-time live-now">
          <span className="live-dot-small" />
          {game.statusDetail || 'LIVE'}
        </div>
      ) : (
        <>
          <div className="game-time">
            {format(new Date(game.timestamp), 'EEE, MMM d @ h:mm a')}
          </div>
          <div className="kickoff-countdown">
            Kickoff in {formatDistanceToNowStrict(new Date(game.timestamp))}
          </div>
        </>
      )}

      {game.venue && (
        <div className="game-location">
          {game.venue}{game.city ? `, ${game.city}` : ''}
        </div>
      )}
    </div>
  );
}

function Dashboard({
  nextGameOverall,
  favoriteTeamNextGame,
  favoriteTeam,
  allTeams,
  onSetFavoriteTeam,
  onRefresh,
  syncing
}: DashboardProps) {
  const favoriteTeamData = allTeams.find(t => t.id === favoriteTeam);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>NFL Dashboard</h1>
        <div className="dashboard-actions">
          <select
            className="favorite-team-select"
            value={favoriteTeam || ''}
            onChange={(e) => onSetFavoriteTeam(e.target.value)}
          >
            <option value="">Select Favorite Team</option>
            {allTeams.map(team => (
              <option key={team.id} value={team.id}>
                {team.displayName}
              </option>
            ))}
          </select>
          <button
            className={`refresh-btn ${syncing ? 'syncing' : ''}`}
            onClick={onRefresh}
            disabled={syncing}
          >
            {syncing ? '⟳ Syncing...' : '↻ Refresh'}
          </button>
        </div>
      </div>

      <div className="dashboard-games">
        <div className="game-card next-game-overall">
          <h3>{nextGameOverall?.inProgress === 1 ? 'Happening Now' : 'Next NFL Game'}</h3>
          {nextGameOverall ? (
            <GameCard game={nextGameOverall} />
          ) : (
            <p className="no-game">No upcoming games</p>
          )}
        </div>

        <div className="game-card favorite-team-game">
          <h3>
            {favoriteTeamData ? (
              <>
                <img src={favoriteTeamData.logo} alt={favoriteTeamData.name} className="team-logo-small" />
                {favoriteTeamData.displayName}
                {favoriteTeamData.wins !== undefined && (
                  <span className="header-record">
                    ({favoriteTeamData.wins}-{favoriteTeamData.losses}{favoriteTeamData.ties ? `-${favoriteTeamData.ties}` : ''})
                  </span>
                )}
                {' '}- Next Game
              </>
            ) : (
              'Your Team - Next Game'
            )}
          </h3>
          {favoriteTeamNextGame && favoriteTeam ? (
            <GameCard game={favoriteTeamNextGame} />
          ) : (
            <p className="no-game">
              {favoriteTeam ? 'No upcoming games' : 'Select a favorite team above'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
