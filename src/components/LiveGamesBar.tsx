import { Game } from '../types';
import './LiveGamesBar.css';

interface LiveGamesBarProps {
  liveGames: Game[];
  pinnedGameIds: string[];
  onTogglePin: (game: Game) => void;
  onSelectGame: (game: Game) => void;
}

function LiveGamesBar({ liveGames, pinnedGameIds, onTogglePin, onSelectGame }: LiveGamesBarProps) {
  if (liveGames.length === 0) return null;

  return (
    <div className="live-games-bar">
      <div className="live-games-label">
        <span className="live-dot" />
        LIVE
      </div>
      <div className="live-games-list">
        {liveGames.map(game => {
          const pinned = pinnedGameIds.includes(game.id);
          return (
            <div key={game.id} className="live-game-chip" onClick={() => onSelectGame(game)}>
              <img src={game.awayTeamLogo} alt={game.awayTeamName} />
              <span className="chip-abbr">{game.awayTeamAbbr}</span>
              <span className="chip-score">{game.awayScore}</span>
              <span className="chip-sep">–</span>
              <span className="chip-score">{game.homeScore}</span>
              <span className="chip-abbr">{game.homeTeamAbbr}</span>
              <img src={game.homeTeamLogo} alt={game.homeTeamName} />
              <span className="chip-status">{game.statusDetail || `Q${game.period}`}</span>
              <button
                className={`chip-pin ${pinned ? 'pinned' : ''}`}
                title={pinned ? 'Unpin from desktop' : 'Pin to desktop'}
                onClick={e => {
                  e.stopPropagation();
                  onTogglePin(game);
                }}
              >
                📌
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LiveGamesBar;
