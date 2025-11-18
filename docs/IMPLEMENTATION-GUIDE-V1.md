# VERSION 1: Performance-Optimized - Implementation Guide

**Quick Start Guide for Fast Implementation**

---

## Overview

This guide will walk you through implementing all performance optimizations from VERSION 1 in a structured, phase-by-phase approach.

**Total Time:** 11-14.5 days (86-116 hours)
**Skill Level:** Intermediate-Advanced React
**Risk Level:** Medium

---

## Pre-Implementation Checklist

- [ ] Create a new branch: `feature/performance-optimizations`
- [ ] Backup current database
- [ ] Install React DevTools Profiler
- [ ] Set up performance benchmarking
- [ ] Create baseline performance metrics

### Baseline Performance Test

```bash
# Run app and measure current performance
npm run electron:dev

# In DevTools Console:
performance.mark('app-start');
// Wait for app to fully load
performance.mark('app-loaded');
performance.measure('load-time', 'app-start', 'app-loaded');
console.table(performance.getEntriesByType('measure'));
```

Record your baseline:
- Initial load time: ______ ms
- Memory usage: ______ MB
- FPS during scroll: ______

---

## Phase 1: React Optimizations (Week 1)

**Time:** 16-24 hours | **Priority:** HIGH

### Step 1.1: Memo All Components (4 hours)

**Dashboard.tsx**
```typescript
import React, { useMemo, useCallback } from 'react';

const Dashboard = React.memo(({
  allTeams,
  favoriteTeam,
  nextGameOverall,
  favoriteTeamNextGame,
  onRefresh,
  onSetFavoriteTeam
}: DashboardProps) => {
  // Component logic

  return (
    // JSX
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.favoriteTeam === nextProps.favoriteTeam &&
    prevProps.nextGameOverall?.id === nextProps.nextGameOverall?.id &&
    prevProps.favoriteTeamNextGame?.id === nextProps.favoriteTeamNextGame?.id
  );
});

export default Dashboard;
```

**Files to modify:**
- `src/components/Dashboard.tsx`
- `src/components/TeamCarousel.tsx`
- `src/components/GameSchedule.tsx`
- `src/components/GameDetailsPane.tsx`

**Checkpoint:** Render count should drop by ~40%

---

### Step 1.2: Add useMemo for Computations (3 hours)

**Example in Dashboard.tsx:**
```typescript
const Dashboard = React.memo(({ ... }) => {
  // Memoize expensive computations
  const favoriteTeamData = useMemo(
    () => allTeams.find(t => t.id === favoriteTeam),
    [allTeams, favoriteTeam]
  );

  const formattedNextGame = useMemo(() => {
    if (!nextGameOverall) return null;
    return {
      ...nextGameOverall,
      formattedDate: format(new Date(nextGameOverall.timestamp), 'EEE, MMM d @ h:mm a')
    };
  }, [nextGameOverall]);

  const formattedFavoriteGame = useMemo(() => {
    if (!favoriteTeamNextGame) return null;
    return {
      ...favoriteTeamNextGame,
      formattedDate: format(new Date(favoriteTeamNextGame.timestamp), 'EEE, MMM d @ h:mm a')
    };
  }, [favoriteTeamNextGame]);

  // Rest of component
});
```

**Files to modify:**
- `src/components/Dashboard.tsx` (date formatting)
- `src/components/GameSchedule.tsx` (filtered games)
- `src/App.tsx` (team lookup)

---

### Step 1.3: Add useCallback for Handlers (3 hours)

**Example in App.tsx:**
```typescript
function App() {
  // State declarations...

  const handleSetFavoriteTeam = useCallback(async (teamId: string) => {
    try {
      await window.electronAPI.setFavoriteTeam(teamId);
      setFavoriteTeam(teamId);
      loadFavoriteTeamNextGame(teamId);
    } catch (error) {
      console.error('Error setting favorite team:', error);
    }
  }, []); // No dependencies - uses latest state automatically

  const handleSelectTeam = useCallback((team: Team) => {
    setSelectedTeam(team);
    if (team) {
      loadTeamSchedule(team.id);
    } else {
      setSchedule([]);
    }
  }, []); // No dependencies

  const handleSelectGame = useCallback((game: Game) => {
    setSelectedGame(game);
    if (game && !game.completed) {
      loadGameDetails(game.id);
    }
  }, []); // No dependencies

  const handleRefresh = useCallback(async () => {
    setSyncing(true);
    try {
      await syncNFLData();
    } finally {
      setSyncing(false);
    }
  }, []); // No dependencies

  // Rest of component
}
```

**Checkpoint:** Function identity should remain stable across renders

---

### Step 1.4: Optimize Date-fns (2 hours)

**Create utility file: `src/utils/dateFormatter.ts`**
```typescript
import format from 'date-fns/format';

const formatCache = new Map<number, string>();

export function formatGameTime(timestamp: number): string {
  const cached = formatCache.get(timestamp);
  if (cached) return cached;

  const formatted = format(new Date(timestamp), 'EEE, MMM d @ h:mm a');
  formatCache.set(timestamp, formatted);

  // Clear cache when it gets too large
  if (formatCache.size > 1000) {
    const firstKey = formatCache.keys().next().value;
    formatCache.delete(firstKey);
  }

  return formatted;
}

export function formatGameDate(timestamp: number): string {
  const cached = formatCache.get(timestamp + 1); // Offset to avoid collision
  if (cached) return cached;

  const formatted = format(new Date(timestamp), 'MMM d, yyyy');
  formatCache.set(timestamp + 1, formatted);
  return formatted;
}

export function clearFormatCache() {
  formatCache.clear();
}
```

**Update imports in all components:**
```typescript
// Before:
import { format } from 'date-fns';

// After:
import { formatGameTime, formatGameDate } from '../utils/dateFormatter';
```

---

### Step 1.5: Add Debounced Refresh (2 hours)

**Create hook: `src/hooks/useDebounce.ts`**
```typescript
import { useRef, useMemo } from 'react';

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useMemo(() => {
    return ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T;
  }, [callback, delay]);
}
```

**Use in App.tsx:**
```typescript
import { useDebounce } from './hooks/useDebounce';

function App() {
  // ... state

  const syncNFLData = async () => {
    // ... sync logic
  };

  const debouncedSync = useDebounce(syncNFLData, 2000);

  const handleRefresh = useCallback(async () => {
    setSyncing(true);
    try {
      await debouncedSync();
    } finally {
      setSyncing(false);
    }
  }, [debouncedSync]);

  // ...
}
```

---

## Phase 2: Virtualization (Week 2)

**Time:** 12-16 hours | **Priority:** HIGH

### Step 2.1: Install react-window (15 min)

```bash
npm install react-window
npm install --save-dev @types/react-window
```

---

### Step 2.2: Virtualize Team Carousel (6 hours)

**Create new component: `src/components/VirtualizedTeamCarousel.tsx`**
```typescript
import React, { useCallback, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import './TeamCarousel.css';

interface VirtualizedTeamCarouselProps {
  teams: Team[];
  selectedTeam: Team | null;
  favoriteTeam: string | null;
  onSelectTeam: (team: Team) => void;
  onSetFavoriteTeam: (teamId: string) => void;
}

const TeamCard = React.memo(({
  team,
  isSelected,
  isFavorite,
  onSelect,
  onSetFavorite
}: TeamCardProps) => {
  const handleClick = useCallback(() => {
    onSelect(team);
  }, [team, onSelect]);

  const handleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSetFavorite(team.id);
  }, [team.id, onSetFavorite]);

  return (
    <div
      className={`team-card ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      {isFavorite && <span className="favorite-badge">★</span>}
      <img src={team.logo} alt={team.name} />
      <div className="team-info">
        <span className="team-abbreviation">{team.abbreviation}</span>
      </div>
      <button
        className="favorite-button"
        onClick={handleFavorite}
        aria-label={`Set ${team.name} as favorite`}
      >
        {isFavorite ? '★' : '☆'}
      </button>
    </div>
  );
}, (prev, next) => (
  prev.team.id === next.team.id &&
  prev.isSelected === next.isSelected &&
  prev.isFavorite === next.isFavorite
));

const VirtualizedTeamCarousel: React.FC<VirtualizedTeamCarouselProps> = React.memo(({
  teams,
  selectedTeam,
  favoriteTeam,
  onSelectTeam,
  onSetFavoriteTeam
}) => {
  const listRef = useRef<List>(null);

  const Row = useCallback(({ index, style }: any) => {
    const team = teams[index];
    return (
      <div style={style}>
        <TeamCard
          team={team}
          isSelected={selectedTeam?.id === team.id}
          isFavorite={favoriteTeam === team.id}
          onSelect={onSelectTeam}
          onSetFavorite={onSetFavoriteTeam}
        />
      </div>
    );
  }, [teams, selectedTeam, favoriteTeam, onSelectTeam, onSetFavoriteTeam]);

  return (
    <div className="team-carousel-container">
      <List
        ref={listRef}
        height={140}
        itemCount={teams.length}
        itemSize={116}
        layout="horizontal"
        width={window.innerWidth - 120}
        overscanCount={3}
      >
        {Row}
      </List>
    </div>
  );
});

export default VirtualizedTeamCarousel;
```

**Replace in App.tsx:**
```typescript
// Before:
import TeamCarousel from './components/TeamCarousel';

// After:
import VirtualizedTeamCarousel from './components/VirtualizedTeamCarousel';

// In JSX:
<VirtualizedTeamCarousel
  teams={allTeams}
  selectedTeam={selectedTeam}
  favoriteTeam={favoriteTeam}
  onSelectTeam={handleSelectTeam}
  onSetFavoriteTeam={handleSetFavoriteTeam}
/>
```

**Checkpoint:** Carousel should render only ~10-12 visible teams

---

### Step 2.3: Virtualize Game Schedule (6 hours)

**Create: `src/components/VirtualizedGameSchedule.tsx`**
```typescript
import React, { useCallback, useRef, useEffect } from 'react';
import { VariableSizeList as List } from 'react-window';
import { formatGameTime } from '../utils/dateFormatter';
import './GameSchedule.css';

const GameItem = React.memo(({
  game,
  isSelected,
  onSelect
}: GameItemProps) => {
  const handleClick = useCallback(() => {
    onSelect(game);
  }, [game, onSelect]);

  return (
    <div
      className={`game-item ${game.completed ? 'completed' : 'upcoming'} ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      {/* Game item content */}
    </div>
  );
}, (prev, next) => (
  prev.game.id === next.game.id &&
  prev.isSelected === next.isSelected
));

const VirtualizedGameSchedule: React.FC<GameScheduleProps> = React.memo(({
  schedule,
  selectedTeam,
  selectedGame,
  onSelectGame
}) => {
  const listRef = useRef<List>(null);

  const getItemSize = useCallback(() => 90, []);

  const Row = useCallback(({ index, style }: any) => {
    const game = schedule[index];
    return (
      <div style={style}>
        <GameItem
          game={game}
          isSelected={selectedGame?.id === game.id}
          onSelect={onSelectGame}
        />
      </div>
    );
  }, [schedule, selectedGame, onSelectGame]);

  // Auto-scroll to selected game
  useEffect(() => {
    if (selectedGame && listRef.current) {
      const index = schedule.findIndex(g => g.id === selectedGame.id);
      if (index !== -1) {
        listRef.current.scrollToItem(index, 'center');
      }
    }
  }, [selectedGame, schedule]);

  if (!selectedTeam) {
    return <div className="no-selection">Select a team to view schedule</div>;
  }

  return (
    <div className="game-schedule-container">
      <List
        ref={listRef}
        height={600}
        itemCount={schedule.length}
        itemSize={getItemSize}
        width="100%"
        overscanCount={2}
      >
        {Row}
      </List>
    </div>
  );
});

export default VirtualizedGameSchedule;
```

**Checkpoint:** Only ~7-8 visible games rendered

---

## Phase 3: Code Splitting & Lazy Loading (Days 9-11)

**Time:** 8-12 hours | **Priority:** HIGH

### Step 3.1: Implement Lazy Loading (4 hours)

**Update App.tsx:**
```typescript
import React, { Suspense, lazy } from 'react';

// Lazy load heavy components
const Dashboard = lazy(() => import('./components/Dashboard'));
const GameDetailsPane = lazy(() => import('./components/GameDetailsPane'));
const VirtualizedGameSchedule = lazy(() => import('./components/VirtualizedGameSchedule'));

function App() {
  return (
    <div className="app">
      <Suspense fallback={<LoadingSpinner />}>
        <Dashboard {...dashboardProps} />
      </Suspense>

      <Suspense fallback={<div className="loading-placeholder">Loading schedule...</div>}>
        <VirtualizedGameSchedule {...scheduleProps} />
      </Suspense>

      {selectedGame && (
        <Suspense fallback={<div className="loading-placeholder">Loading game details...</div>}>
          <GameDetailsPane game={selectedGame} />
        </Suspense>
      )}
    </div>
  );
}
```

**Create loading component: `src/components/LoadingSpinner.tsx`**
```typescript
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);

export default LoadingSpinner;
```

---

### Step 3.2: Configure Vite for Code Splitting (2 hours)

**Update `vite.config.ts`:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-date': ['date-fns'],
          'vendor-virtual': ['react-window'],
        }
      },
      treeshake: {
        moduleSideEffects: false
      }
    }
  }
});
```

---

## Phase 4: Database Optimizations (Days 12-14)

**Time:** 12-16 hours | **Priority:** HIGH

### Step 4.1: Add Enhanced Indexes (2 hours)

**Update `electron/database.ts`:**
```typescript
export function initializeDatabase() {
  // ... existing schema creation

  // ENHANCED INDEXES
  db.exec(`
    -- Optimize upcoming games query
    CREATE INDEX IF NOT EXISTS idx_games_upcoming
      ON games(completed, timestamp)
      WHERE completed = 0;

    -- Optimize team schedule query
    CREATE INDEX IF NOT EXISTS idx_games_team_schedule
      ON games(homeTeamId, awayTeamId, timestamp);

    -- Optimize player stats query
    CREATE INDEX IF NOT EXISTS idx_player_stats_game_team
      ON player_stats(gameId, teamId, category);

    -- Optimize team lookup
    CREATE INDEX IF NOT EXISTS idx_teams_lookup
      ON teams(id, displayName, logo);

    -- Composite index for complex queries
    CREATE INDEX IF NOT EXISTS idx_games_composite
      ON games(homeTeamId, awayTeamId, completed, timestamp);
  `);

  console.log('Enhanced database indexes created');
}
```

---

### Step 4.2: Implement Query Cache (4 hours)

**Create `electron/cache.ts`:**
```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class QueryCache {
  private cache = new Map<string, CacheEntry<any>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl: number = 60000) {
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  invalidate(pattern: string) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
  }
}

export const queryCache = new QueryCache();
```

**Update `electron/espnService.ts`:**
```typescript
import { queryCache } from './cache';

export function getAllTeams(): Team[] {
  const cacheKey = 'teams:all';
  const cached = queryCache.get<Team[]>(cacheKey);
  if (cached) {
    console.log('[CACHE HIT] getAllTeams');
    return cached;
  }

  const db = getDatabase();
  const teams = db.prepare('SELECT * FROM teams ORDER BY location, name').all() as Team[];

  queryCache.set(cacheKey, teams, 300000); // 5 min TTL
  return teams;
}

export function getNextGameOverall(): Game | null {
  const cacheKey = 'game:next';
  const cached = queryCache.get<Game | null>(cacheKey);
  if (cached !== null) {
    console.log('[CACHE HIT] getNextGameOverall');
    return cached;
  }

  const db = getDatabase();
  const now = Date.now();

  const game = db.prepare(`
    SELECT g.*,
           ht.displayName as homeTeamName, ht.abbreviation as homeTeamAbbr,
           ht.logo as homeTeamLogo, ht.color as homeTeamColor,
           at.displayName as awayTeamName, at.abbreviation as awayTeamAbbr,
           at.logo as awayTeamLogo, at.color as awayTeamColor
    FROM games g
    JOIN teams ht ON g.homeTeamId = ht.id
    JOIN teams at ON g.awayTeamId = at.id
    WHERE g.completed = 0 AND g.timestamp > ?
    ORDER BY g.timestamp ASC
    LIMIT 1
  `).get(now) as Game | undefined;

  const result = game || null;
  queryCache.set(cacheKey, result, 60000); // 1 min TTL
  return result;
}

// Invalidate cache on sync
export async function syncAllData() {
  // ... sync logic

  // Clear cache after sync
  queryCache.clear();
  console.log('[CACHE] Cleared after sync');
}
```

**Checkpoint:** Queries should be <5ms on cache hit

---

## Phase 5: Bundle Optimization (Days 15-17)

**Time:** 6-8 hours | **Priority:** MEDIUM

### Step 5.1: Optimize CSS (3 hours)

**Update `vite.config.ts`:**
```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    },
    devSourcemap: false
  },
  build: {
    cssCodeSplit: true,
    minify: 'esbuild',
    cssMinify: true
  }
});
```

**Convert to CSS Modules (optional but recommended):**

Rename: `Dashboard.css` → `Dashboard.module.css`

Update component:
```typescript
import styles from './Dashboard.module.css';

function Dashboard() {
  return <div className={styles.dashboardContainer}>...</div>;
}
```

---

### Step 5.2: Tree Shaking Configuration (2 hours)

**Update `vite.config.ts`:**
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      }
    }
  }
});
```

---

## Phase 6: Testing & Validation (Days 18-20)

**Time:** 16-20 hours | **Priority:** HIGH

### Step 6.1: Performance Profiling (4 hours)

**Create test script: `scripts/performance-test.js`**
```javascript
const { performance } = require('perf_hooks');

async function testPerformance() {
  console.log('Running performance tests...\n');

  // Test 1: Initial load time
  const start = performance.now();
  // ... load app
  const loadTime = performance.now() - start;

  console.log(`Initial Load: ${loadTime.toFixed(2)}ms`);

  // Test 2: Memory usage
  const memUsage = process.memoryUsage();
  console.log(`Memory: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`);

  // More tests...
}

testPerformance();
```

**Run profiling:**
```bash
node scripts/performance-test.js
```

---

### Step 6.2: Bundle Analysis (2 hours)

```bash
npm install --save-dev webpack-bundle-analyzer

# Add to package.json scripts:
"analyze": "vite-bundle-visualizer"

npm run analyze
```

Review bundle and identify any remaining opportunities.

---

### Step 6.3: Manual Testing Checklist (6 hours)

- [ ] Load app and verify <500ms initial load
- [ ] Test team carousel scrolling (should be 60 FPS)
- [ ] Test game schedule scrolling (should be smooth)
- [ ] Verify cache working (check console logs)
- [ ] Test refresh functionality (debounced)
- [ ] Test on low-spec machine
- [ ] Measure memory usage (<100MB)
- [ ] Verify all features still work
- [ ] Test offline behavior
- [ ] Verify no console errors

---

## Validation & Benchmarking

### Before/After Comparison

| Metric | Before | Target | Actual |
|--------|--------|--------|--------|
| Initial load | 1200ms | <500ms | ___ms |
| Memory | 185MB | <100MB | ___MB |
| Bundle size | 114MB | <75MB | ___MB |
| Carousel FPS | 52 | 60 | ___ |
| Schedule FPS | 48 | 60 | ___ |

### Success Criteria

✅ All metrics meet or exceed targets
✅ No regressions in functionality
✅ No new console errors
✅ User testing shows improved experience

---

## Rollout Plan

### Gradual Rollout

1. **Beta test** (Days 21-24): Internal testing
2. **Soft launch** (Days 25-27): 10% of users
3. **Monitor** (Days 28-30): Check for issues
4. **Full launch** (Day 31): All users

### Rollback Plan

If issues arise:
```bash
git checkout main
npm install
npm run build
```

Keep old version available as fallback.

---

## Troubleshooting

### Issue: Virtual scrolling breaks drag functionality

**Solution:** Disable drag in virtualized carousel or implement custom drag handling

### Issue: Lazy loading causes flash

**Solution:** Improve loading placeholders, add skeleton screens

### Issue: Cache not invalidating

**Solution:** Add manual cache clear button in settings

### Issue: Bundle size not reducing

**Solution:** Check for duplicate dependencies, review imports

---

## Next Steps After V1

Once V1 is complete and stable:

1. Gather user feedback
2. Measure performance improvements
3. Consider adding V2 UX features
4. Or add selective V3 features
5. Continuous optimization

---

## Resources

- React DevTools Profiler: https://react.dev/learn/react-developer-tools
- react-window docs: https://react-window.vercel.app/
- Vite optimization: https://vitejs.dev/guide/build.html
- Performance API: https://developer.mozilla.org/en-US/docs/Web/API/Performance

---

**Congratulations!** You've implemented VERSION 1: Performance-Optimized

Your app should now be significantly faster and more efficient. Monitor metrics and iterate as needed.
