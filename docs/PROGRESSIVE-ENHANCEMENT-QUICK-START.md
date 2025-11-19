# Progressive Enhancement - Quick Start Guide

**TL;DR for implementing the tiered approach to VERSION 3**

---

## The Big Idea

Transform VERSION 3 from a heavy 140MB app into THREE experiences:
- **Core:** 30MB, 200ms load (everyone)
- **Enhanced:** 70MB, 400ms load (most users)
- **Premium:** 140MB, 600ms load (power users)

**Same codebase. Auto-detected. User-controllable.**

---

## Visual Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Visits App                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Capability Detection  │
        │  - Memory (2GB-16GB+)  │
        │  - CPU (2-8+ cores)    │
        │  - Network (2G-WiFi)   │
        │  - Browser features    │
        │  - Performance test    │
        └────────┬───────────────┘
                 │
      ┌──────────┴──────────┐
      │  Calculate Score    │
      │     (0-100)         │
      └──────────┬──────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
┌───────┐   ┌─────────┐  ┌────────┐
│ CORE  │   │ENHANCED │  │PREMIUM │
│<45pts │   │45-74pts │  │ 75+pts │
└───┬───┘   └────┬────┘  └───┬────┘
    │            │           │
    ▼            ▼           ▼
┌────────┐  ┌─────────┐ ┌──────────┐
│ 30MB   │  │  70MB   │ │  140MB   │
│ 200ms  │  │  400ms  │ │  600ms   │
│Basic UI│  │Charts   │ │Full V3   │
└────────┘  └─────────┘ └──────────┘
```

---

## 10-Minute Implementation Plan

### Step 1: Create Capability Detector (2 min)

```bash
# Create utility file
mkdir -p src/utils
touch src/utils/capabilityDetector.ts
```

Copy the `CapabilityDetector` class from the full strategy doc.

**What it does:** Scores device 0-100 based on memory, CPU, network, features.

---

### Step 2: Create Tier Selector (2 min)

```bash
touch src/utils/tierSelector.ts
```

Copy the `TierSelector` class from the strategy doc.

**What it does:** Chooses tier based on score or user preference.

---

### Step 3: Modify Entry Point (3 min)

Update `src/main.tsx`:

```typescript
import { tierSelector } from './utils/tierSelector';

async function bootstrap() {
  const tier = await tierSelector.getTier();
  
  let App;
  if (tier === 'core') {
    App = await import('./apps/CoreApp');
  } else if (tier === 'enhanced') {
    App = await import('./apps/EnhancedApp');
  } else {
    App = await import('./apps/PremiumApp');
  }
  
  // Render App...
}

bootstrap();
```

**What it does:** Loads only the tier-specific code.

---

### Step 4: Create App Variants (3 min setup)

```bash
mkdir -p src/apps
touch src/apps/CoreApp.tsx
touch src/apps/EnhancedApp.tsx
touch src/apps/PremiumApp.tsx
```

**Start simple:**
- `CoreApp`: Copy current `App.tsx`, remove heavy features
- `EnhancedApp`: Copy current `App.tsx`, add some features
- `PremiumApp`: Copy current `App.tsx`, keep all features

---

## What to Include in Each Tier

### Core Tier (30MB)
✅ Schedules & scores (text)  
✅ Team selection  
✅ Game details (basic)  
✅ Favorite team  
❌ No charts  
❌ No player profiles  
❌ No predictions  
❌ No analytics  

**Dependencies:** React, Axios, date-fns (minimal)

---

### Enhanced Tier (70MB)
✅ Everything in Core  
✅ Player stats (current season)  
✅ Simple charts (Chart.js)  
✅ Team standings  
✅ Search  
✅ CSV export  
✅ Themes  
❌ No advanced analytics  
❌ No historical data  
❌ No PDF export  

**Dependencies:** + React Router, Chart.js, Service Worker

---

### Premium Tier (140MB)
✅ Everything in Enhanced  
✅ Player profiles  
✅ Advanced analytics  
✅ Recharts (animated)  
✅ Predictions  
✅ Playoffs  
✅ Historical data  
✅ PDF export  
✅ News feed  
✅ Fantasy integration  

**Dependencies:** Full VERSION 3 stack

---

## Configure Vite for Code Splitting

Update `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'core-vendor': ['react', 'react-dom'],
          'enhanced-router': ['react-router-dom'],
          'premium-charts': ['recharts'],
          'premium-export': ['jspdf', 'html2canvas']
        }
      }
    }
  }
});
```

---

## User Settings Panel

Add a settings panel so users can override auto-detection:

```typescript
// In your settings component
import { tierSelector } from '../utils/tierSelector';

function Settings() {
  const [tier, setTier] = useState('auto');
  
  const handleChange = (newTier) => {
    tierSelector.setUserPreference(newTier);
    window.location.reload(); // Reload with new tier
  };
  
  return (
    <select value={tier} onChange={(e) => handleChange(e.target.value)}>
      <option value="auto">Auto (Recommended)</option>
      <option value="core">Core (Fastest)</option>
      <option value="enhanced">Enhanced (Balanced)</option>
      <option value="premium">Premium (All Features)</option>
    </select>
  );
}
```

---

## Performance Targets

| Tier | Bundle | Load | Memory |
|------|--------|------|--------|
| Core | 30MB | 200ms | 60MB |
| Enhanced | 70MB | 400ms | 100MB |
| Premium | 140MB | 600ms | 160MB |

---

## Testing Checklist

### Test Core Tier
- [ ] Works on 2GB RAM device
- [ ] Works on 2G network
- [ ] Works on IE11
- [ ] Loads in <250ms
- [ ] Bundle <35MB

### Test Enhanced Tier
- [ ] Works on 4GB RAM device
- [ ] Works on 3G network
- [ ] Charts render properly
- [ ] Service worker caches data
- [ ] Loads in <450ms

### Test Premium Tier
- [ ] All VERSION 3 features work
- [ ] Recharts animations smooth
- [ ] PDF export works
- [ ] Push notifications work
- [ ] Loads in <600ms

### Test Auto-Detection
- [ ] Low-end device → Core
- [ ] Mid-range device → Enhanced
- [ ] High-end device → Premium
- [ ] User can manually override

---

## Common Patterns

### Adaptive Component

```typescript
import { tierSelector } from '../utils/tierSelector';

function GameCard({ game }) {
  const [tier, setTier] = useState('core');
  
  useEffect(() => {
    tierSelector.getTier().then(setTier);
  }, []);
  
  if (tier === 'core') {
    return <SimpleCard game={game} />;
  }
  
  if (tier === 'enhanced') {
    return <EnhancedCard game={game} />;
  }
  
  return <PremiumCard game={game} />;
}
```

---

### Conditional Feature Loading

```typescript
// Only load if Enhanced or Premium
if (tier !== 'core') {
  const Charts = await import('../components/Charts');
  // Use Charts...
}

// Only load if Premium
if (tier === 'premium') {
  const Analytics = await import('../features/analytics');
  // Use Analytics...
}
```

---

### Fallback for Missing Features

```typescript
function PlayerProfile({ playerId }) {
  const [tier, setTier] = useState('core');
  
  if (tier === 'core') {
    return (
      <div className="upgrade-prompt">
        <p>Player profiles are available in Enhanced tier</p>
        <button onClick={() => upgradeTier()}>Upgrade Experience</button>
      </div>
    );
  }
  
  return <PlayerProfileComponent playerId={playerId} />;
}
```

---

## Bundle Size Optimization Tips

### Core Tier
1. Remove Recharts → save 15MB
2. Remove PDF export libs → save 12MB
3. Remove React Router → save 3MB
4. Use minimal icons → save 5MB
5. Compress team logos to 32x32 → save 2MB
6. Remove lodash → save 3MB
**Total saved: 40MB** (140MB → 100MB → ~30MB with other optimizations)

### Enhanced Tier
1. Use Chart.js instead of Recharts → save 10MB
2. Remove PDF export → save 12MB
3. Limit historical data → save 15MB
**Total saved: 37MB** (140MB → ~70MB with other optimizations)

### Premium Tier
Keep everything, but lazy load:
- Charts loaded on demand → faster initial load
- News loaded in background → better perceived performance
- Historical data loaded when requested → less memory

---

## Progressive Loading Strategy

```
Initial Load (all tiers):
├── HTML shell (instant)
├── Critical CSS (inline, <10KB)
├── Capability detector (5KB)
└── Tier selector (2KB)

Then load tier-specific:
├── Core: 30MB bundle
├── Enhanced: 70MB bundle  
└── Premium: 140MB bundle

Background (after initial render):
├── Service worker
├── Preload common routes
└── Cache team logos
```

---

## Offline Support by Tier

### Core Tier
- Cache: localStorage (5MB max)
- TTL: 5 minutes for scores
- Fallback: Show cached data with warning

### Enhanced Tier
- Cache: IndexedDB (50MB max)
- TTL: 30 seconds for scores
- Fallback: Full offline mode with Service Worker

### Premium Tier
- Cache: IndexedDB (200MB max)
- TTL: 15 seconds for scores
- Fallback: Advanced offline with background sync

---

## Migration Path from Current App

### Week 1: Setup
- [ ] Add capability detection
- [ ] Create tier selector
- [ ] Split current app into 3 variants

### Week 2: Core Tier
- [ ] Strip down to essentials
- [ ] Optimize bundle
- [ ] Test on low-end devices

### Week 3: Enhanced Tier
- [ ] Add mid-tier features
- [ ] Implement simple charts
- [ ] Add service worker

### Week 4: Premium Tier
- [ ] Keep current VERSION 3 features
- [ ] Add lazy loading
- [ ] Optimize performance

### Week 5: Polish
- [ ] User settings panel
- [ ] Tier upgrade prompts
- [ ] Cross-device testing

---

## Expected Results

### Before (Current VERSION 3)
- Bundle: 140MB
- Load: 600ms
- Works on: High-end devices only
- 2G load: 30+ seconds
- Low-end device: Crashes or unusable

### After (Progressive Enhancement)
- Core: 30MB, 200ms, works on everything
- Enhanced: 70MB, 400ms, works on most devices
- Premium: 140MB, 600ms, works on high-end
- 2G load (Core): 5 seconds
- Low-end device: Fast and functional

---

## Quick Wins

1. **Instant improvement:** Users get faster load times
2. **Broader reach:** App works on low-end devices
3. **Better SEO:** Faster core = better lighthouse scores
4. **User satisfaction:** Everyone gets optimal experience
5. **Data savings:** Mobile users save bandwidth

---

## Troubleshooting

**Q: Auto-detection puts me in Core but I want Premium**  
A: Add manual override in settings panel

**Q: How do I test different tiers?**  
A: Use Chrome DevTools device emulation + throttling

**Q: Can users upgrade tiers without reload?**  
A: Not easily - tier determines bundle. Need reload.

**Q: What if capability detection fails?**  
A: Defaults to Enhanced tier (safe middle ground)

**Q: Does this work with Electron?**  
A: Yes! Electron always gets Premium tier (desktop = powerful)

---

## Next Steps

1. Read full strategy: `PROGRESSIVE-ENHANCEMENT-STRATEGY.md`
2. Implement capability detection
3. Create app variants
4. Test on various devices
5. Deploy and monitor

---

## Resources

- Full Strategy: `/docs/PROGRESSIVE-ENHANCEMENT-STRATEGY.md`
- VERSION 3 Spec: `/docs/IMPLEMENTATION-GUIDE-V3.md`
- Version Comparison: `/docs/VERSION-COMPARISON-AND-RANKINGS.md`

---

**Remember:** Progressive enhancement is about **making it work for everyone**, then **making it better for those who can handle it**. Start with Core, enhance for capable devices.

---

*End of Quick Start Guide*
