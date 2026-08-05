import { useState, useRef, useEffect } from 'react';
import { Team } from '../types';
import './TeamCarousel.css';

interface TeamCarouselProps {
  teams: Team[];
  selectedTeam: Team | null;
  favoriteTeam: string | null;
  onSelectTeam: (team: Team) => void;
  onSetFavoriteTeam: (teamId: string) => void;
}

function TeamCarousel({ teams, selectedTeam, favoriteTeam, onSelectTeam, onSetFavoriteTeam }: TeamCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    // Scroll to selected team when it changes
    if (selectedTeam && carouselRef.current) {
      const teamElement = carouselRef.current.querySelector(`[data-team-id="${selectedTeam.id}"]`);
      if (teamElement) {
        teamElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedTeam]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="team-carousel-container">
      <button className="carousel-nav left" onClick={() => handleScroll('left')}>
        ‹
      </button>

      <div
        ref={carouselRef}
        className="team-carousel"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {teams.map(team => (
          <div
            key={team.id}
            data-team-id={team.id}
            className={`team-card ${selectedTeam?.id === team.id ? 'selected' : ''} ${favoriteTeam === team.id ? 'favorite' : ''}`}
            onClick={() => onSelectTeam(team)}
            style={{
              borderColor: team.color ? `#${team.color}` : undefined
            }}
          >
            <div className="team-logo-container">
              <img src={team.logo} alt={team.name} />
            </div>
            <div className="team-info">
              <div className="team-abbr">{team.abbreviation}</div>
              <div className="team-name">{team.location}</div>
              {team.wins !== undefined && (team.wins + (team.losses ?? 0) + (team.ties ?? 0)) > 0 && (
                <div className="team-record">
                  {team.wins}-{team.losses}{team.ties ? `-${team.ties}` : ''}
                </div>
              )}
            </div>
            {favoriteTeam === team.id && (
              <div className="favorite-badge">★</div>
            )}
            <button
              className="set-favorite-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSetFavoriteTeam(team.id);
              }}
              title="Set as favorite"
            >
              {favoriteTeam === team.id ? '★' : '☆'}
            </button>
          </div>
        ))}
      </div>

      <button className="carousel-nav right" onClick={() => handleScroll('right')}>
        ›
      </button>
    </div>
  );
}

export default TeamCarousel;
