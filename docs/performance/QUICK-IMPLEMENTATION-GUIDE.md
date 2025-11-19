# Player Profile Performance Optimization - Quick Implementation Guide

**Quick Start:** Get 70%+ performance improvements in 4 weeks

---

## 🚀 Quick Wins (Implement First)

### 1. Code Splitting (Day 1-2) - Save 3.2MB

```bash
# Install dependencies
npm install @loadable/component
```

```typescript
// src/Router.tsx
import loadable from '@loadable/component';

const PlayerProfile = loadable(() => import('./pages/PlayerProfilePage'));
const PlayerStats = loadable(() => import('./pages/PlayerStatsPage'));
```

**Impact:** -40% bundle size immediately

---

### 2. Image Optimization (Day 2-3) - Save 200ms

```typescript
// src/components/PlayerPhoto.tsx
function PlayerPhoto({ url, alt }) {
  const webpUrl = url + '?format=webp&w=400&quality=80';
  
  return (
    <img
      src={webpUrl}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}
```

**Impact:** -70% image load time

---

### 3. Database Indexes (Day 3) - Save 350ms

```sql
-- Add to migration
CREATE INDEX idx_players_search ON players(displayName, position);
CREATE INDEX idx_stats_player ON player_career_stats(playerId, season DESC);
```

**Impact:** -85% query time

---

### 4. React.memo (Day 4) - Save 100ms

```typescript
// Wrap expensive components
export const PlayerStatsCard = React.memo(({ stats }) => {
  return <StatsDisplay stats={stats} />;
});

// Add comparison function for complex props
export const PlayerChart = React.memo(
  ({ data }) => <Chart data={data} />,
  (prev, next) => prev.data === next.data
);
```

**Impact:** -60% unnecessary re-renders

---

## 📦 Phase 1: Foundation (Week 1)

### Caching Implementation

```typescript
// src/services/cache.ts
class SimpleCache<T> {
  private cache = new Map<string, { data: T; expires: number }>();
  private ttl = 5 * 60 * 1000; // 5 minutes

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + this.ttl
    });
  }
}

export const playerCache = new SimpleCache<Player>();

// Usage
async function getPlayer(id: string): Promise<Player> {
  const cached = playerCache.get(id);
  if (cached) return cached;

  const player = await fetchPlayer(id);
  playerCache.set(id, player);
  return player;
}
```

---

## 🎯 Phase 2: Progressive Loading (Week 2)

### Skeleton Screens

```typescript
// src/components/PlayerSkeleton.tsx
export function PlayerSkeleton() {
  return (
    <div className="player-skeleton">
      <div className="skeleton-photo" />
      <div className="skeleton-text" />
      <div className="skeleton-stats">
        <div className="skeleton-stat" />
        <div className="skeleton-stat" />
        <div className="skeleton-stat" />
      </div>
    </div>
  );
}
```

```css
/* Animated skeleton */
.skeleton-photo {
  width: 200px;
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Progressive Data Loading

```typescript
// src/hooks/usePlayerData.ts
export function usePlayerData(playerId: string) {
  const [basicInfo, setBasicInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [gameLog, setGameLog] = useState(null);

  useEffect(() => {
    // Load in priority order
    loadBasicInfo(playerId).then(setBasicInfo);
    
    setTimeout(() => {
      loadStats(playerId).then(setStats);
    }, 100);
    
    setTimeout(() => {
      loadGameLog(playerId).then(setGameLog);
    }, 200);
  }, [playerId]);

  return { basicInfo, stats, gameLog };
}
```

---

## 📊 Phase 3: Virtual Scrolling (Week 3)

### Install react-window

```bash
npm install react-window
npm install --save-dev @types/react-window
```

### Basic Implementation

```typescript
// src/components/VirtualGameLog.tsx
import { FixedSizeList } from 'react-window';

export function VirtualGameLog({ games }: { games: Game[] }) {
  const Row = ({ index, style }) => (
    <div style={style} className="game-row">
      <span>{games[index].date}</span>
      <span>{games[index].opponent}</span>
      <span>{games[index].result}</span>
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={games.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

**Before:** Rendering 200 games = 300ms  
**After:** Rendering 200 games = 45ms

---

## 🔧 Phase 4: Optimization (Week 4)

### Bundle Analysis

```bash
# Add to package.json
"scripts": {
  "analyze": "vite build --mode analyze"
}

# Run analysis
npm run analyze
```

### Performance Monitoring

```typescript
// src/utils/monitor.ts
export function measurePageLoad() {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Page Load Time:', perfData.duration);
  });
}

// Usage
useEffect(() => {
  const start = performance.now();
  
  return () => {
    const duration = performance.now() - start;
    console.log('Component lifecycle:', duration);
  };
}, []);
```

---

## 📈 Performance Checklist

### Must-Have Optimizations

- [ ] Code splitting for routes
- [ ] Lazy load images
- [ ] Database indexes
- [ ] React.memo for expensive components
- [ ] Basic caching layer

### High-Impact Optimizations

- [ ] Virtual scrolling for tables
- [ ] Progressive data loading
- [ ] IndexedDB caching
- [ ] WebP images
- [ ] Skeleton screens

### Advanced Optimizations

- [ ] Service Worker
- [ ] Prefetching
- [ ] Web Workers
- [ ] Request debouncing
- [ ] Memory leak prevention

---

## 🎯 Target Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Page Load | <200ms | Chrome DevTools Performance |
| Bundle Size | <5MB | `npm run analyze` |
| Memory | <25MB | Chrome DevTools Memory |
| Cache Hit | >85% | Custom analytics |

---

## 🔍 Testing Performance

### Quick Performance Test

```typescript
// tests/performance.test.ts
import { performance } from 'perf_hooks';

test('Player profile loads fast', async () => {
  const start = performance.now();
  
  // Render component
  render(<PlayerProfile playerId="123" />);
  
  // Wait for data
  await waitFor(() => screen.getByText(/player name/i));
  
  const duration = performance.now() - start;
  expect(duration).toBeLessThan(200);
});
```

### Chrome DevTools Workflow

1. Open DevTools → Performance tab
2. Click Record
3. Navigate to player profile
4. Stop recording
5. Check "Load" event timing

**Target:** Blue line (DOMContentLoaded) < 200ms

---

## 🚨 Common Pitfalls

### ❌ Don't Do This

```typescript
// Fetching data in render
function PlayerProfile({ playerId }) {
  const player = fetchPlayer(playerId); // ❌ Blocks render
  return <div>{player.name}</div>;
}

// Creating components in render
function PlayerCard({ player }) {
  const Row = () => <div>{player.name}</div>; // ❌ New component every render
  return <Row />;
}
```

### ✅ Do This Instead

```typescript
// Use hooks for data fetching
function PlayerProfile({ playerId }) {
  const { data: player } = usePlayer(playerId); // ✅ Async loading
  return <div>{player?.name}</div>;
}

// Define components outside
const Row = ({ player }) => <div>{player.name}</div>;

function PlayerCard({ player }) {
  return <Row player={player} />; // ✅ Stable reference
}
```

---

## 📚 Code Patterns

### Pattern 1: Lazy Component Loading

```typescript
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));

function PlayerStats() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <HeavyChart />
    </Suspense>
  );
}
```

### Pattern 2: Data Prefetching

```typescript
function PlayerCard({ playerId }) {
  // Prefetch on hover
  const handleHover = () => {
    playerCache.prefetch(playerId);
  };

  return (
    <div onMouseEnter={handleHover}>
      <Link to={`/player/${playerId}`}>View Profile</Link>
    </div>
  );
}
```

### Pattern 3: Memoized Calculations

```typescript
function PlayerStats({ games }) {
  const averages = useMemo(() => {
    return calculateAverages(games); // Expensive calculation
  }, [games]);

  return <StatsDisplay averages={averages} />;
}
```

---

## 🎓 Next Steps

1. **Read full spec:** `/docs/performance/PLAYER-PROFILE-OPTIMIZATION-SPEC.md`
2. **Start with Quick Wins:** Implement code splitting and image optimization
3. **Follow weekly plan:** Complete each phase in order
4. **Measure everything:** Use Chrome DevTools to validate improvements
5. **Iterate:** Continue optimizing based on metrics

---

## 💡 Pro Tips

### Tip 1: Always Measure First

```typescript
// Before optimization
console.time('Player Load');
loadPlayer(id);
console.timeEnd('Player Load');
```

### Tip 2: Optimize Perceived Performance

```typescript
// Show skeleton immediately, load data in background
return loading ? <Skeleton /> : <Content />;
```

### Tip 3: Cache Aggressively

```typescript
// 5 minutes for player data (changes rarely)
const CACHE_TTL = 5 * 60 * 1000;
```

### Tip 4: Virtual Scroll Everything >50 Rows

```typescript
if (items.length > 50) {
  return <VirtualList items={items} />;
}
return <RegularList items={items} />;
```

---

## 📞 Support

- **Full Specification:** See `PLAYER-PROFILE-OPTIMIZATION-SPEC.md`
- **Performance Budgets:** Defined in spec section 7.2
- **Troubleshooting:** Spec section 12

**Ready to optimize? Start with Quick Wins! 🚀**
