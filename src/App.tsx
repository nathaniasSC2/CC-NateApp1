import { useState, useEffect, useCallback } from 'react';
import { Team, Game, GameDetails } from './types';
import Dashboard from './components/Dashboard';
import TeamCarousel from './components/TeamCarousel';
import GameSchedule from './components/GameSchedule';
import GameDetailsPane from './components/GameDetailsPane';
import LiveGamesBar from './components/LiveGamesBar';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [nextGameOverall, setNextGameOverall] = useState<Game | null>(null);
  const [favoriteTeam, setFavoriteTeam] = useState<string | null>(null);
  const [favoriteTeamNextGame, setFavoriteTeamNextGame] = useState<Game | null>(null);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamSchedule, setTeamSchedule] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
  const [liveGames, setLiveGames] = useState<Game[]>([]);
  const [pinnedGameIds, setPinnedGameIds] = useState<string[]>([]);

  const refreshOverview = useCallback(async (favTeamId: string | null) => {
    const [nextGame, live, teams] = await Promise.all([
      window.electronAPI.getNextGameOverall(),
      window.electronAPI.getLiveGames(),
      window.electronAPI.getAllTeams(),
    ]);
    setNextGameOverall(nextGame);
    setLiveGames(live);
    setAllTeams(teams);
    if (favTeamId) {
      setFavoriteTeamNextGame(await window.electronAPI.getTeamNextGame(favTeamId));
    }
    return teams;
  }, []);

  useEffect(() => {
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live score pushes from the main process keep every view current
  useEffect(() => {
    const unsubscribeLive = window.electronAPI.onLiveScores(() => {
      refreshOverview(favoriteTeam);
      if (selectedTeam) {
        window.electronAPI.getTeamSchedule(selectedTeam.id).then(setTeamSchedule);
      }
      if (selectedGame && selectedGame.completed !== 1) {
        window.electronAPI.getGameDetails(selectedGame.id).then(setGameDetails);
      }
    });
    const unsubscribePinned = window.electronAPI.onPinnedChanged(setPinnedGameIds);
    return () => {
      unsubscribeLive();
      unsubscribePinned();
    };
  }, [favoriteTeam, selectedTeam, selectedGame, refreshOverview]);

  useEffect(() => {
    if (favoriteTeam) {
      window.electronAPI.getTeamNextGame(favoriteTeam).then(setFavoriteTeamNextGame);
    } else {
      setFavoriteTeamNextGame(null);
    }
  }, [favoriteTeam]);

  useEffect(() => {
    if (selectedTeam) {
      window.electronAPI.getTeamSchedule(selectedTeam.id).then(setTeamSchedule);
    }
  }, [selectedTeam]);

  useEffect(() => {
    if (selectedGame) {
      window.electronAPI.getGameDetails(selectedGame.id).then(setGameDetails);
    } else {
      setGameDetails(null);
    }
  }, [selectedGame]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setSyncing(true);
      await window.electronAPI.syncNFLData();
      setSyncing(false);

      const favTeam = await window.electronAPI.getFavoriteTeam();
      setFavoriteTeam(favTeam);

      const teams = await refreshOverview(favTeam);
      const pinned = await window.electronAPI.getPinnedGameIds();
      setPinnedGameIds(pinned);

      // Default the schedule view to your favorite team, else the first team
      const defaultTeam = teams.find(t => t.id === favTeam) ?? teams[0] ?? null;
      setSelectedTeam(defaultTeam);

      setLoading(false);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setLoading(false);
      setSyncing(false);
    }
  };

  const handleSetFavoriteTeam = async (teamId: string) => {
    await window.electronAPI.setFavoriteTeam(teamId);
    setFavoriteTeam(teamId);
  };

  const handleTogglePin = async (game: Game) => {
    if (pinnedGameIds.includes(game.id)) {
      await window.electronAPI.unpinGame(game.id);
    } else {
      await window.electronAPI.pinGame(game.id);
    }
  };

  const handleSelectLiveGame = (game: Game) => {
    // Jump the schedule view to one of the teams playing, then open the game
    const team = allTeams.find(t => t.id === game.homeTeamId || t.id === game.awayTeamId);
    if (team) setSelectedTeam(team);
    setSelectedGame(game);
  };

  const handleRefresh = async () => {
    setSyncing(true);
    try {
      await window.electronAPI.syncNFLData();
      await refreshOverview(favoriteTeam);
      if (selectedTeam) {
        setTeamSchedule(await window.electronAPI.getTeamSchedule(selectedTeam.id));
      }
      if (selectedGame) {
        setGameDetails(await window.electronAPI.getGameDetails(selectedGame.id));
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="app loading">
        <div className="loading-content">
          <div className="spinner"></div>
          <h2>Loading NFL Dashboard...</h2>
          {syncing && <p>Syncing data from ESPN API...</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Dashboard
        nextGameOverall={nextGameOverall}
        favoriteTeamNextGame={favoriteTeamNextGame}
        favoriteTeam={favoriteTeam}
        allTeams={allTeams}
        onSetFavoriteTeam={handleSetFavoriteTeam}
        onRefresh={handleRefresh}
        syncing={syncing}
      />

      <LiveGamesBar
        liveGames={liveGames}
        pinnedGameIds={pinnedGameIds}
        onTogglePin={handleTogglePin}
        onSelectGame={handleSelectLiveGame}
      />

      <div className="main-content">
        <div className="schedule-section">
          <GameSchedule
            team={selectedTeam}
            schedule={teamSchedule}
            selectedGame={selectedGame}
            pinnedGameIds={pinnedGameIds}
            onSelectGame={setSelectedGame}
            onTogglePin={handleTogglePin}
          />
        </div>

        {selectedGame && (
          <div className="details-section">
            <GameDetailsPane
              gameDetails={gameDetails}
              pinnedGameIds={pinnedGameIds}
              onTogglePin={handleTogglePin}
            />
          </div>
        )}
      </div>

      <TeamCarousel
        teams={allTeams}
        selectedTeam={selectedTeam}
        favoriteTeam={favoriteTeam}
        onSelectTeam={setSelectedTeam}
        onSetFavoriteTeam={handleSetFavoriteTeam}
      />
    </div>
  );
}

export default App;
