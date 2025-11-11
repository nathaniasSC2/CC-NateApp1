import { GameDetails } from '../types';
import { format } from 'date-fns';
import './GameDetailsPane.css';

interface GameDetailsPaneProps {
  gameDetails: GameDetails | null;
}

function GameDetailsPane({ gameDetails }: GameDetailsPaneProps) {
  if (!gameDetails) {
    return (
      <div className="game-details-pane">
        <div className="no-game-selected">
          <p>Select a game to view details</p>
        </div>
      </div>
    );
  }

  const formatGameTime = (timestamp: number) => {
    return format(new Date(timestamp), 'EEEE, MMMM d, yyyy @ h:mm a');
  };

  const isCompleted = gameDetails.completed === 1;
  const isInProgress = gameDetails.inProgress === 1;

  const parseStats = (statsJson: string) => {
    try {
      return JSON.parse(statsJson);
    } catch {
      return [];
    }
  };

  return (
    <div className="game-details-pane">
      <div className="game-header">
        <h3>Game Details</h3>
        {isInProgress && <span className="live-indicator">LIVE</span>}
      </div>

      <div className="game-overview">
        <div className="teams-display">
          <div className="team-display">
            <img src={gameDetails.awayTeamLogo} alt={gameDetails.awayTeamName} />
            <div className="team-name">{gameDetails.awayTeamName}</div>
            {(isCompleted || isInProgress) && (
              <div className="team-score">{gameDetails.awayScore}</div>
            )}
          </div>

          <div className="vs-separator">@</div>

          <div className="team-display">
            <img src={gameDetails.homeTeamLogo} alt={gameDetails.homeTeamName} />
            <div className="team-name">{gameDetails.homeTeamName}</div>
            {(isCompleted || isInProgress) && (
              <div className="team-score">{gameDetails.homeScore}</div>
            )}
          </div>
        </div>

        <div className="game-info-details">
          <div className="info-row">
            <span className="label">Date:</span>
            <span className="value">{formatGameTime(gameDetails.timestamp)}</span>
          </div>
          {gameDetails.venue && (
            <div className="info-row">
              <span className="label">Venue:</span>
              <span className="value">{gameDetails.venue}</span>
            </div>
          )}
          {gameDetails.city && (
            <div className="info-row">
              <span className="label">Location:</span>
              <span className="value">{gameDetails.city}{gameDetails.state ? `, ${gameDetails.state}` : ''}</span>
            </div>
          )}
          <div className="info-row">
            <span className="label">Week:</span>
            <span className="value">Week {gameDetails.week}</span>
          </div>
        </div>
      </div>

      <div className="stats-section">
        {isCompleted ? (
          <>
            {gameDetails.teamStats && gameDetails.teamStats.length > 0 && (
              <div className="team-stats">
                <h4>Team Statistics</h4>
                <div className="stats-grid">
                  {gameDetails.teamStats.map(stat => (
                    <div key={stat.id} className="stat-item">
                      <span className="stat-label">{stat.statType}:</span>
                      <span className="stat-value">{stat.statValue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {gameDetails.playerStats && gameDetails.playerStats.length > 0 ? (
              <div className="player-stats">
                <h4>Player Statistics</h4>
                {Object.entries(
                  gameDetails.playerStats.reduce((acc, stat) => {
                    if (!acc[stat.category]) acc[stat.category] = [];
                    acc[stat.category].push(stat);
                    return acc;
                  }, {} as Record<string, typeof gameDetails.playerStats>)
                ).map(([category, stats]) => (
                  <div key={category} className="stat-category">
                    <h5>{category}</h5>
                    <div className="players-list">
                      {stats.map(stat => {
                        const statValues = parseStats(stat.stats);
                        return (
                          <div key={stat.id} className="player-stat">
                            <div className="player-name">
                              {stat.playerName}
                              {stat.position && <span className="position"> ({stat.position})</span>}
                            </div>
                            <div className="player-stat-values">
                              {Array.isArray(statValues) && statValues.join(' • ')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-stats">
                <p>Detailed statistics not yet available</p>
              </div>
            )}
          </>
        ) : (
          <div className="awaiting-stats">
            <h4>Game Preview</h4>
            <p>This game has not been played yet.</p>

            {gameDetails.seasonStats && (
              <>
                <h5>Season Averages Available</h5>
                <p className="stats-note">Click refresh after the game to see detailed statistics</p>

                {gameDetails.seasonStats.home.length > 0 && (
                  <div className="season-stats">
                    <h6>{gameDetails.homeTeamName} - Top Players</h6>
                    <div className="players-preview">
                      {gameDetails.seasonStats.home.slice(0, 5).map(stat => (
                        <div key={stat.id} className="player-preview">
                          <span className="player-name">{stat.playerName}</span>
                          {stat.position && <span className="position">({stat.position})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {gameDetails.seasonStats.away.length > 0 && (
                  <div className="season-stats">
                    <h6>{gameDetails.awayTeamName} - Top Players</h6>
                    <div className="players-preview">
                      {gameDetails.seasonStats.away.slice(0, 5).map(stat => (
                        <div key={stat.id} className="player-preview">
                          <span className="player-name">{stat.playerName}</span>
                          {stat.position && <span className="position">({stat.position})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default GameDetailsPane;
