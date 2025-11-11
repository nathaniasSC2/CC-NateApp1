import { useState, useEffect } from 'react';
import { Team, Game, GameDetails } from './types';
import Dashboard from './components/Dashboard';
import TeamCarousel from './components/TeamCarousel';
import GameSchedule from './components/GameSchedule';
import GameDetailsPane from './components/GameDetailsPane';
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

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (favoriteTeam) {
      loadFavoriteTeamData();
    }
  }, [favoriteTeam]);

  useEffect(() => {
    if (selectedTeam) {
      loadTeamSchedule(selectedTeam.id);
    }
  }, [selectedTeam]);

  useEffect(() => {
    if (selectedGame) {
      loadGameDetails(selectedGame.id);
    } else {
      setGameDetails(null);
    }
  }, [selectedGame]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setSyncing(true);

      // Sync data from ESPN
      await window.electronAPI.syncNFLData();
      setSyncing(false);

      // Load all teams
      const teams = await window.electronAPI.getAllTeams();
      setAllTeams(teams);

      // Load next game overall
      const nextGame = await window.electronAPI.getNextGameOverall();
      setNextGameOverall(nextGame);

      // Load favorite team
      const favTeam = await window.electronAPI.getFavoriteTeam();
      setFavoriteTeam(favTeam);

      // Set first team as selected by default
      if (teams.length > 0) {
        setSelectedTeam(teams[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setLoading(false);
      setSyncing(false);
    }
  };

  const loadFavoriteTeamData = async () => {
    if (!favoriteTeam) return;

    try {
      const nextGame = await window.electronAPI.getTeamNextGame(favoriteTeam);
      setFavoriteTeamNextGame(nextGame);
    } catch (error) {
      console.error('Error loading favorite team data:', error);
    }
  };

  const loadTeamSchedule = async (teamId: string) => {
    try {
      const schedule = await window.electronAPI.getTeamSchedule(teamId);
      setTeamSchedule(schedule);
    } catch (error) {
      console.error('Error loading team schedule:', error);
    }
  };

  const loadGameDetails = async (gameId: string) => {
    try {
      const details = await window.electronAPI.getGameDetails(gameId);
      setGameDetails(details);
    } catch (error) {
      console.error('Error loading game details:', error);
    }
  };

  const handleSetFavoriteTeam = async (teamId: string) => {
    try {
      await window.electronAPI.setFavoriteTeam(teamId);
      setFavoriteTeam(teamId);
    } catch (error) {
      console.error('Error setting favorite team:', error);
    }
  };

  const handleRefresh = async () => {
    setSyncing(true);
    try {
      await window.electronAPI.syncNFLData();

      // Reload current data
      const nextGame = await window.electronAPI.getNextGameOverall();
      setNextGameOverall(nextGame);

      if (favoriteTeam) {
        const nextFavGame = await window.electronAPI.getTeamNextGame(favoriteTeam);
        setFavoriteTeamNextGame(nextFavGame);
      }

      if (selectedTeam) {
        await loadTeamSchedule(selectedTeam.id);
      }

      if (selectedGame) {
        await loadGameDetails(selectedGame.id);
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

      <div className="main-content">
        <div className="schedule-section">
          <GameSchedule
            team={selectedTeam}
            schedule={teamSchedule}
            selectedGame={selectedGame}
            onSelectGame={setSelectedGame}
          />
        </div>

        {selectedGame && (
          <div className="details-section">
            <GameDetailsPane gameDetails={gameDetails} />
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
