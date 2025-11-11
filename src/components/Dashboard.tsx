import { Team, Game } from '../types';
import { format } from 'date-fns';
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

  const formatGameTime = (timestamp: number) => {
    return format(new Date(timestamp), 'EEE, MMM d @ h:mm a');
  };

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
          <h3>Next NFL Game</h3>
          {nextGameOverall ? (
            <div className="game-info">
              <div className="teams">
                <div className="team">
                  <img src={nextGameOverall.awayTeamLogo} alt={nextGameOverall.awayTeamName} />
                  <span className="team-name">{nextGameOverall.awayTeamAbbr}</span>
                </div>
                <span className="vs">@</span>
                <div className="team">
                  <img src={nextGameOverall.homeTeamLogo} alt={nextGameOverall.homeTeamName} />
                  <span className="team-name">{nextGameOverall.homeTeamAbbr}</span>
                </div>
              </div>
              <div className="game-time">{formatGameTime(nextGameOverall.timestamp)}</div>
              {nextGameOverall.venue && (
                <div className="game-location">
                  {nextGameOverall.venue}, {nextGameOverall.city}
                </div>
              )}
            </div>
          ) : (
            <p className="no-game">No upcoming games</p>
          )}
        </div>

        <div className="game-card favorite-team-game">
          <h3>
            {favoriteTeamData ? (
              <>
                <img src={favoriteTeamData.logo} alt={favoriteTeamData.name} className="team-logo-small" />
                {favoriteTeamData.displayName} - Next Game
              </>
            ) : (
              'Your Team - Next Game'
            )}
          </h3>
          {favoriteTeamNextGame && favoriteTeam ? (
            <div className="game-info">
              <div className="teams">
                <div className="team">
                  <img src={favoriteTeamNextGame.awayTeamLogo} alt={favoriteTeamNextGame.awayTeamName} />
                  <span className="team-name">{favoriteTeamNextGame.awayTeamAbbr}</span>
                </div>
                <span className="vs">@</span>
                <div className="team">
                  <img src={favoriteTeamNextGame.homeTeamLogo} alt={favoriteTeamNextGame.homeTeamName} />
                  <span className="team-name">{favoriteTeamNextGame.homeTeamAbbr}</span>
                </div>
              </div>
              <div className="game-time">{formatGameTime(favoriteTeamNextGame.timestamp)}</div>
              {favoriteTeamNextGame.venue && (
                <div className="game-location">
                  {favoriteTeamNextGame.venue}, {favoriteTeamNextGame.city}
                </div>
              )}
            </div>
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
