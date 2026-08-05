import { useEffect, useState } from 'react';
import { Game } from '../types';
import { format } from 'date-fns';
import './GameWidget.css';

interface GameWidgetProps {
  gameId: string;
}

function statusLine(game: Game): string {
  if (game.inProgress === 1) {
    return game.statusDetail || `Q${game.period} ${game.clock ?? ''}`.trim();
  }
  if (game.completed === 1) {
    return 'FINAL';
  }
  return format(new Date(game.timestamp), 'EEE h:mm a');
}

function GameWidget({ gameId }: GameWidgetProps) {
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    let mounted = true;
    window.electronAPI.getGame(gameId).then(g => {
      if (mounted) setGame(g);
    });

    const unsubscribe = window.electronAPI.onLiveScores(games => {
      const updated = games.find(g => g.id === gameId);
      if (updated) setGame(updated);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [gameId]);

  if (!game) {
    return (
      <div className="game-widget loading">
        <span>Loading…</span>
      </div>
    );
  }

  const isLive = game.inProgress === 1;
  const showScores = isLive || game.completed === 1;
  const awayWinning = showScores && (game.awayScore ?? 0) > (game.homeScore ?? 0);
  const homeWinning = showScores && (game.homeScore ?? 0) > (game.awayScore ?? 0);

  return (
    <div className={`game-widget ${isLive ? 'live' : ''}`}>
      <div className="widget-status-row">
        {isLive && <span className="widget-live-dot" />}
        <span className="widget-status">{statusLine(game)}</span>
        <button
          className="widget-close"
          title="Unpin"
          onClick={() => window.electronAPI.unpinGame(game.id)}
        >
          ✕
        </button>
      </div>

      <div className="widget-matchup">
        <div className={`widget-team ${awayWinning ? 'winning' : ''}`}>
          <img src={game.awayTeamLogo} alt={game.awayTeamName} />
          <span className="widget-abbr">{game.awayTeamAbbr}</span>
          {showScores && <span className="widget-score">{game.awayScore}</span>}
        </div>

        <span className="widget-at">@</span>

        <div className={`widget-team home ${homeWinning ? 'winning' : ''}`}>
          {showScores && <span className="widget-score">{game.homeScore}</span>}
          <span className="widget-abbr">{game.homeTeamAbbr}</span>
          <img src={game.homeTeamLogo} alt={game.homeTeamName} />
        </div>
      </div>
    </div>
  );
}

export default GameWidget;
