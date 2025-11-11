import { Team, Game } from '../types';
import { format } from 'date-fns';
import './GameSchedule.css';

interface GameScheduleProps {
  team: Team | null;
  schedule: Game[];
  selectedGame: Game | null;
  onSelectGame: (game: Game) => void;
}

function GameSchedule({ team, schedule, selectedGame, onSelectGame }: GameScheduleProps) {
  const formatGameDate = (timestamp: number) => {
    return format(new Date(timestamp), 'EEE, MMM d');
  };

  const formatGameTime = (timestamp: number) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  if (!team) {
    return (
      <div className="game-schedule">
        <h2>Select a team to view schedule</h2>
      </div>
    );
  }

  return (
    <div className="game-schedule">
      <div className="schedule-header">
        <img src={team.logo} alt={team.name} className="team-logo" />
        <h2>{team.displayName} Schedule</h2>
      </div>

      <div className="schedule-list">
        {schedule.length === 0 ? (
          <p className="no-games">No games scheduled</p>
        ) : (
          schedule.map(game => {
            const isHome = game.homeTeamId === team.id;
            const opponent = isHome ? {
              name: game.awayTeamName,
              abbr: game.awayTeamAbbr,
              logo: game.awayTeamLogo
            } : {
              name: game.homeTeamName,
              abbr: game.homeTeamAbbr,
              logo: game.homeTeamLogo
            };

            const isCompleted = game.completed === 1;
            const isInProgress = game.inProgress === 1;
            const teamScore = isHome ? game.homeScore : game.awayScore;
            const opponentScore = isHome ? game.awayScore : game.homeScore;
            const won = isCompleted && teamScore !== null && opponentScore !== null && teamScore > opponentScore;
            const lost = isCompleted && teamScore !== null && opponentScore !== null && teamScore < opponentScore;

            return (
              <div
                key={game.id}
                className={`game-item ${selectedGame?.id === game.id ? 'selected' : ''} ${isCompleted ? 'completed' : ''} ${isInProgress ? 'in-progress' : ''} ${won ? 'won' : ''} ${lost ? 'lost' : ''}`}
                onClick={() => onSelectGame(game)}
              >
                <div className="game-week">Week {game.week}</div>
                <div className="game-date">{formatGameDate(game.timestamp)}</div>

                <div className="game-matchup">
                  <div className="game-location-badge">
                    {isHome ? 'vs' : '@'}
                  </div>
                  <div className="opponent">
                    <img src={opponent.logo} alt={opponent.name} />
                    <span className="opponent-abbr">{opponent.abbr}</span>
                  </div>
                </div>

                {isCompleted || isInProgress ? (
                  <div className="game-score">
                    <span className={teamScore !== null && opponentScore !== null && teamScore > opponentScore ? 'winning' : ''}>
                      {teamScore}
                    </span>
                    <span className="score-separator">-</span>
                    <span className={teamScore !== null && opponentScore !== null && opponentScore > teamScore ? 'winning' : ''}>
                      {opponentScore}
                    </span>
                  </div>
                ) : (
                  <div className="game-time">{formatGameTime(game.timestamp)}</div>
                )}

                {isInProgress && <div className="live-badge">LIVE</div>}
                {isCompleted && won && <div className="result-badge win">W</div>}
                {isCompleted && lost && <div className="result-badge loss">L</div>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default GameSchedule;
