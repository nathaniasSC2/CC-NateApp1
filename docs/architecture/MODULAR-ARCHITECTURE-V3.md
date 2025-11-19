# VERSION 3: Modular Architecture Specification

**Transform VERSION 3 from a 10/10 complexity monolith into maintainable building blocks**

---

## Executive Summary

**Problem:** VERSION 3 has 50+ components, 8 services, and 10/10 complexity, scoring only 4.2/10 on Development Practicality.

**Solution:** Modular plugin-based architecture that:
- Reduces perceived complexity through clear separation
- Enables incremental development (build one feature at a time)
- Supports optional/toggleable features
- Simplifies testing and maintenance
- Reduces risk from 9/10 to 4/10

**Result:** Build VERSION 3 like LEGO blocks, not a monolith.

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Module Structure](#module-structure)
3. [Plugin System Design](#plugin-system-design)
4. [Feature Flag Strategy](#feature-flag-strategy)
5. [Dependency Injection](#dependency-injection)
6. [Testing Strategy](#testing-strategy)
7. [Incremental Rollout Plan](#incremental-rollout-plan)
8. [Code Organization](#code-organization)
9. [Implementation Roadmap](#implementation-roadmap)

---

## Core Principles

### 1. Modularity
- Each feature is a self-contained module
- Modules don't depend on each other
- Modules communicate through contracts (interfaces)

### 2. Progressive Enhancement
- Core app works without any optional modules
- Each module adds functionality incrementally
- Graceful degradation if a module fails

### 3. Plugin Architecture
- Modules are "plugged in" at runtime
- Can be enabled/disabled independently
- Easy to add new modules without modifying core

### 4. Testability
- Each module can be tested in isolation
- Mock dependencies easily
- Clear boundaries reduce test complexity

### 5. Incremental Development
- Build and ship one module at a time
- Each module is a complete feature
- Get feedback early and often

---

## Module Structure

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CORE APP                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Router  │  │ Settings │  │  Layout  │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│                                                              │
│  ┌──────────────────────────────────────────────┐          │
│  │         MODULE REGISTRY & LOADER              │          │
│  │  - Discovers available modules                │          │
│  │  - Manages module lifecycle                   │          │
│  │  - Dependency injection container             │          │
│  └──────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
                            ▼
        ┌───────────────────┬───────────────────┬──────────────┐
        ▼                   ▼                   ▼              ▼
┌───────────────┐   ┌───────────────┐   ┌──────────────┐  ┌─────────────┐
│ PLAYER MODULE │   │ANALYTICS MODULE│   │PREDICT MODULE│  │ NEWS MODULE │
├───────────────┤   ├───────────────┤   ├──────────────┤  ├─────────────┤
│ • Service     │   │ • Service     │   │ • Service    │  │ • Service   │
│ • Components  │   │ • Components  │   │ • Components │  │ • Components│
│ • Routes      │   │ • Routes      │   │ • Routes     │  │ • Routes    │
│ • Types       │   │ • Types       │   │ • Types      │  │ • Types     │
│ • Tests       │   │ • Tests       │   │ • Tests      │  │ • Tests     │
└───────────────┘   └───────────────┘   └──────────────┘  └─────────────┘

┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ PLAYOFF MODULE │  │ SEARCH MODULE  │  │ EXPORT MODULE  │
├────────────────┤  ├────────────────┤  ├────────────────┤
│ • Service      │  │ • Service      │  │ • Service      │
│ • Components   │  │ • Components   │  │ • Components   │
│ • Routes       │  │ • Routes       │  │ • Routes       │
│ • Types        │  │ • Types        │  │ • Types        │
│ • Tests        │  │ • Tests        │  │ • Tests        │
└────────────────┘  └────────────────┘  └────────────────┘

┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ FANTASY MODULE │  │ ALERTS MODULE  │  │ SOCIAL MODULE  │
└────────────────┘  └────────────────┘  └────────────────┘
```

### Module Categories

#### Category 1: Core Modules (Always Enabled)
1. **Dashboard Module** - Home page, team schedules, live scores
2. **Settings Module** - User preferences, app configuration

#### Category 2: Data Modules (Independent)
3. **Player Module** - Player profiles, stats, career history
4. **Analytics Module** - Team metrics, league leaders, standings
5. **Playoff Module** - Bracket visualization, playoff scenarios

#### Category 3: Intelligence Modules (Build on Data)
6. **Predictions Module** - Game outcome predictions, confidence scores
7. **Comparison Module** - Team vs team, player vs player

#### Category 4: Content Modules (External Integration)
8. **News Module** - ESPN news feed, team news, player news
9. **Fantasy Module** - Fantasy stats, rankings, projections

#### Category 5: Utility Modules (Cross-cutting)
10. **Search Module** - Global search, advanced filters
11. **Export Module** - CSV/PDF export, sharing
12. **Alerts Module** - Notifications, custom alerts

---

## Module Design Pattern

### Standard Module Structure

Each module follows this template:

```
modules/
└── players/                    # Module name
    ├── index.ts               # Module manifest & registration
    ├── manifest.json          # Module metadata
    ├── services/
    │   ├── PlayerService.ts   # Business logic
    │   └── PlayerCache.ts     # Optional: caching layer
    ├── components/
    │   ├── PlayerProfile.tsx  # UI components
    │   ├── PlayerStats.tsx
    │   └── index.ts           # Component exports
    ├── pages/
    │   └── PlayerPage.tsx     # Route pages
    ├── hooks/
    │   └── usePlayer.ts       # Custom hooks
    ├── types/
    │   └── player.types.ts    # TypeScript types
    ├── utils/
    │   └── playerHelpers.ts   # Pure functions
    ├── tests/
    │   ├── PlayerService.test.ts
    │   └── PlayerProfile.test.tsx
    └── README.md              # Module documentation
```

### Module Manifest (manifest.json)

```json
{
  "id": "players",
  "name": "Player Profiles",
  "version": "1.0.0",
  "description": "Player profiles with career stats and history",
  "category": "data",
  "dependencies": [],
  "optionalDependencies": ["analytics"],
  "defaultEnabled": true,
  "routes": [
    {
      "path": "/player/:playerId",
      "component": "PlayerPage",
      "requiresAuth": false
    }
  ],
  "navigation": [
    {
      "label": "Players",
      "icon": "Users",
      "path": "/players",
      "order": 20
    }
  ],
  "settings": [
    {
      "key": "players.showCollegeInfo",
      "label": "Show college information",
      "type": "boolean",
      "default": true
    }
  ],
  "database": {
    "tables": ["players", "player_career_stats"],
    "migrations": ["002_add_players.ts"]
  },
  "featureFlags": ["player_profiles", "player_search"],
  "permissions": ["database:read", "api:espn"]
}
```

### Module Registration (index.ts)

```typescript
import { Module, ModuleContext } from '@/core/modules';
import { PlayerService } from './services/PlayerService';
import manifest from './manifest.json';

export class PlayerModule implements Module {
  id = manifest.id;
  manifest = manifest;
  
  private service?: PlayerService;
  
  async initialize(context: ModuleContext): Promise<void> {
    console.log(`[${this.id}] Initializing...`);
    
    // Create service instance with dependency injection
    this.service = new PlayerService(
      context.database,
      context.api,
      context.cache
    );
    
    // Register service with DI container
    context.container.register('playerService', this.service);
    
    // Run migrations if needed
    if (context.database) {
      await context.database.runMigrations(manifest.database.migrations);
    }
    
    console.log(`[${this.id}] Initialized successfully`);
  }
  
  async destroy(): Promise<void> {
    console.log(`[${this.id}] Destroying...`);
    this.service?.cleanup();
  }
  
  // Lazy-load components (code splitting)
  async getComponents() {
    return import('./components');
  }
  
  // Lazy-load pages
  async getPages() {
    return import('./pages');
  }
  
  // Health check
  async isHealthy(): Promise<boolean> {
    return this.service?.isConnected() ?? false;
  }
}

// Export singleton instance
export default new PlayerModule();
```

---

## Plugin System Design

### Module Loader

```typescript
// src/core/modules/ModuleLoader.ts

import { Module, ModuleContext, ModuleManifest } from './types';
import { FeatureFlags } from '@/core/featureFlags';
import { DIContainer } from '@/core/di';

export class ModuleLoader {
  private modules: Map<string, Module> = new Map();
  private context: ModuleContext;
  
  constructor(
    private featureFlags: FeatureFlags,
    private container: DIContainer
  ) {
    this.context = {
      database: container.get('database'),
      api: container.get('api'),
      cache: container.get('cache'),
      container: container,
      featureFlags: featureFlags
    };
  }
  
  /**
   * Discover and register all available modules
   */
  async discoverModules(): Promise<void> {
    // Use Vite's glob import for module discovery
    const moduleFiles = import.meta.glob('../../../modules/*/index.ts');
    
    for (const path in moduleFiles) {
      try {
        const moduleExport = await moduleFiles[path]();
        const module = (moduleExport as any).default as Module;
        
        this.registerModule(module);
      } catch (error) {
        console.error(`Failed to load module from ${path}:`, error);
      }
    }
  }
  
  /**
   * Register a module
   */
  registerModule(module: Module): void {
    if (this.modules.has(module.id)) {
      console.warn(`Module ${module.id} is already registered`);
      return;
    }
    
    // Validate manifest
    if (!this.validateManifest(module.manifest)) {
      throw new Error(`Invalid manifest for module ${module.id}`);
    }
    
    this.modules.set(module.id, module);
    console.log(`Registered module: ${module.id}`);
  }
  
  /**
   * Initialize enabled modules
   */
  async initializeModules(): Promise<void> {
    const modulesToInit = Array.from(this.modules.values())
      .filter(m => this.isModuleEnabled(m));
    
    // Sort by dependencies
    const sorted = this.topologicalSort(modulesToInit);
    
    // Initialize in order
    for (const module of sorted) {
      try {
        await module.initialize(this.context);
        console.log(`✓ Module ${module.id} initialized`);
      } catch (error) {
        console.error(`✗ Module ${module.id} failed to initialize:`, error);
        
        // Optional: disable module if it fails
        this.featureFlags.set(`module.${module.id}.enabled`, false);
      }
    }
  }
  
  /**
   * Check if module should be enabled
   */
  private isModuleEnabled(module: Module): boolean {
    // Check feature flag
    const flagKey = `module.${module.id}.enabled`;
    if (!this.featureFlags.get(flagKey, module.manifest.defaultEnabled)) {
      return false;
    }
    
    // Check dependencies
    for (const depId of module.manifest.dependencies || []) {
      if (!this.isModuleEnabled(this.modules.get(depId)!)) {
        console.warn(`Module ${module.id} disabled due to missing dependency: ${depId}`);
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Topological sort to handle dependencies
   */
  private topologicalSort(modules: Module[]): Module[] {
    const sorted: Module[] = [];
    const visited = new Set<string>();
    const temp = new Set<string>();
    
    const visit = (module: Module) => {
      if (temp.has(module.id)) {
        throw new Error(`Circular dependency detected: ${module.id}`);
      }
      if (visited.has(module.id)) return;
      
      temp.add(module.id);
      
      for (const depId of module.manifest.dependencies || []) {
        const dep = this.modules.get(depId);
        if (dep) visit(dep);
      }
      
      temp.delete(module.id);
      visited.add(module.id);
      sorted.push(module);
    };
    
    for (const module of modules) {
      visit(module);
    }
    
    return sorted;
  }
  
  /**
   * Get module by ID
   */
  getModule<T extends Module>(id: string): T | undefined {
    return this.modules.get(id) as T;
  }
  
  /**
   * Get all routes from enabled modules
   */
  getAllRoutes(): Array<{ path: string; component: any }> {
    const routes: any[] = [];
    
    for (const module of this.modules.values()) {
      if (!this.isModuleEnabled(module)) continue;
      
      for (const route of module.manifest.routes || []) {
        routes.push({
          path: route.path,
          component: module.getPages?.(), // Lazy-loaded
          meta: { moduleId: module.id }
        });
      }
    }
    
    return routes;
  }
  
  /**
   * Get all navigation items from enabled modules
   */
  getAllNavigation(): Array<any> {
    const items: any[] = [];
    
    for (const module of this.modules.values()) {
      if (!this.isModuleEnabled(module)) continue;
      
      items.push(...(module.manifest.navigation || []));
    }
    
    // Sort by order
    return items.sort((a, b) => (a.order || 100) - (b.order || 100));
  }
  
  /**
   * Validate module manifest
   */
  private validateManifest(manifest: ModuleManifest): boolean {
    return !!(
      manifest.id &&
      manifest.name &&
      manifest.version
    );
  }
}
```

---

## Feature Flag Strategy

### Feature Flag System

```typescript
// src/core/featureFlags/FeatureFlags.ts

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  rolloutPercentage?: number;
  enabledForUsers?: string[];
  metadata?: Record<string, any>;
}

export class FeatureFlags {
  private flags: Map<string, FeatureFlag> = new Map();
  private storage: Storage;
  
  constructor(storage: Storage = localStorage) {
    this.storage = storage;
    this.loadFromStorage();
  }
  
  /**
   * Register a feature flag
   */
  register(flag: FeatureFlag): void {
    this.flags.set(flag.key, flag);
    this.saveToStorage();
  }
  
  /**
   * Check if a feature is enabled
   */
  isEnabled(key: string, defaultValue = false): boolean {
    const flag = this.flags.get(key);
    
    if (!flag) {
      return defaultValue;
    }
    
    // Check explicit enabled state
    if (!flag.enabled) {
      return false;
    }
    
    // Check rollout percentage
    if (flag.rolloutPercentage !== undefined) {
      return Math.random() * 100 < flag.rolloutPercentage;
    }
    
    // Check user-specific enablement
    const userId = this.getCurrentUserId();
    if (flag.enabledForUsers && userId) {
      return flag.enabledForUsers.includes(userId);
    }
    
    return flag.enabled;
  }
  
  /**
   * Get flag value (alias for isEnabled)
   */
  get(key: string, defaultValue = false): boolean {
    return this.isEnabled(key, defaultValue);
  }
  
  /**
   * Set flag value
   */
  set(key: string, enabled: boolean): void {
    const flag = this.flags.get(key) || { key, enabled };
    flag.enabled = enabled;
    this.flags.set(key, flag);
    this.saveToStorage();
  }
  
  /**
   * Toggle a flag
   */
  toggle(key: string): void {
    const current = this.isEnabled(key);
    this.set(key, !current);
  }
  
  /**
   * Get all flags
   */
  getAll(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }
  
  /**
   * Get flags by category
   */
  getByCategory(category: string): FeatureFlag[] {
    return this.getAll().filter(f => 
      f.metadata?.category === category
    );
  }
  
  private loadFromStorage(): void {
    try {
      const stored = this.storage.getItem('featureFlags');
      if (stored) {
        const flags = JSON.parse(stored);
        for (const flag of flags) {
          this.flags.set(flag.key, flag);
        }
      }
    } catch (error) {
      console.error('Failed to load feature flags:', error);
    }
  }
  
  private saveToStorage(): void {
    try {
      const flags = Array.from(this.flags.values());
      this.storage.setItem('featureFlags', JSON.stringify(flags));
    } catch (error) {
      console.error('Failed to save feature flags:', error);
    }
  }
  
  private getCurrentUserId(): string | null {
    // Implement based on your auth system
    return null;
  }
}
```

### Feature Flag Configuration

```typescript
// src/config/featureFlags.ts

export const FEATURE_FLAGS = {
  // Module toggles
  MODULES: {
    PLAYERS: 'module.players.enabled',
    ANALYTICS: 'module.analytics.enabled',
    PREDICTIONS: 'module.predictions.enabled',
    PLAYOFFS: 'module.playoffs.enabled',
    SEARCH: 'module.search.enabled',
    EXPORT: 'module.export.enabled',
    NEWS: 'module.news.enabled',
    FANTASY: 'module.fantasy.enabled',
    ALERTS: 'module.alerts.enabled',
    SOCIAL: 'module.social.enabled',
  },
  
  // Feature-specific flags
  FEATURES: {
    PLAYER_PROFILES: 'feature.player_profiles',
    PLAYER_SEARCH: 'feature.player_search',
    GAME_PREDICTIONS: 'feature.game_predictions',
    PLAYOFF_BRACKET: 'feature.playoff_bracket',
    HISTORICAL_SEASONS: 'feature.historical_seasons',
    ADVANCED_FILTERS: 'feature.advanced_filters',
    CSV_EXPORT: 'feature.csv_export',
    PDF_EXPORT: 'feature.pdf_export',
    REAL_TIME_ALERTS: 'feature.real_time_alerts',
    NEWS_FEED: 'feature.news_feed',
    FANTASY_INTEGRATION: 'feature.fantasy_integration',
    SOCIAL_SHARING: 'feature.social_sharing',
  },
  
  // Performance flags
  PERFORMANCE: {
    VIRTUAL_SCROLLING: 'perf.virtual_scrolling',
    CODE_SPLITTING: 'perf.code_splitting',
    SERVICE_WORKER: 'perf.service_worker',
    AGGRESSIVE_CACHING: 'perf.aggressive_caching',
  },
  
  // Experimental features
  EXPERIMENTAL: {
    AI_PREDICTIONS: 'experimental.ai_predictions',
    VOICE_COMMANDS: 'experimental.voice_commands',
    DARK_MODE_V2: 'experimental.dark_mode_v2',
  }
};

// Default flag values
export const DEFAULT_FLAGS: FeatureFlag[] = [
  // Core modules (enabled by default)
  { key: FEATURE_FLAGS.MODULES.PLAYERS, enabled: true },
  { key: FEATURE_FLAGS.MODULES.ANALYTICS, enabled: true },
  
  // Optional modules (disabled by default - enable incrementally)
  { key: FEATURE_FLAGS.MODULES.PREDICTIONS, enabled: false },
  { key: FEATURE_FLAGS.MODULES.PLAYOFFS, enabled: false },
  { key: FEATURE_FLAGS.MODULES.SEARCH, enabled: false },
  { key: FEATURE_FLAGS.MODULES.EXPORT, enabled: false },
  { key: FEATURE_FLAGS.MODULES.NEWS, enabled: false },
  { key: FEATURE_FLAGS.MODULES.FANTASY, enabled: false },
  { key: FEATURE_FLAGS.MODULES.ALERTS, enabled: false },
  { key: FEATURE_FLAGS.MODULES.SOCIAL, enabled: false },
  
  // Features
  { key: FEATURE_FLAGS.FEATURES.PLAYER_PROFILES, enabled: true },
  { key: FEATURE_FLAGS.FEATURES.GAME_PREDICTIONS, enabled: false, rolloutPercentage: 25 },
  
  // Performance
  { key: FEATURE_FLAGS.PERFORMANCE.CODE_SPLITTING, enabled: true },
  { key: FEATURE_FLAGS.PERFORMANCE.VIRTUAL_SCROLLING, enabled: true },
  
  // Experimental (disabled)
  { key: FEATURE_FLAGS.EXPERIMENTAL.AI_PREDICTIONS, enabled: false },
];
```

### Using Feature Flags in Components

```typescript
// src/modules/players/components/PlayerProfile.tsx

import { useFeatureFlags } from '@/core/featureFlags';
import { FEATURE_FLAGS } from '@/config/featureFlags';

export const PlayerProfile: React.FC<Props> = ({ playerId }) => {
  const featureFlags = useFeatureFlags();
  
  const showCollegeInfo = featureFlags.isEnabled(
    'players.showCollegeInfo', 
    true
  );
  
  return (
    <div className="player-profile">
      <PlayerHeader player={player} />
      
      {showCollegeInfo && (
        <CollegeInfo college={player.college} />
      )}
      
      <PlayerStats playerId={playerId} />
    </div>
  );
};
```

---

## Dependency Injection

### DI Container

```typescript
// src/core/di/DIContainer.ts

export type Factory<T> = (container: DIContainer) => T;

export class DIContainer {
  private services: Map<string, any> = new Map();
  private factories: Map<string, Factory<any>> = new Map();
  private singletons: Map<string, any> = new Map();
  
  /**
   * Register a singleton service
   */
  registerSingleton<T>(key: string, factory: Factory<T>): void {
    this.factories.set(key, factory);
  }
  
  /**
   * Register a transient service (new instance each time)
   */
  registerTransient<T>(key: string, factory: Factory<T>): void {
    this.factories.set(key, factory);
  }
  
  /**
   * Register an existing instance
   */
  register<T>(key: string, instance: T): void {
    this.services.set(key, instance);
  }
  
  /**
   * Get a service instance
   */
  get<T>(key: string): T {
    // Check if instance already exists
    if (this.services.has(key)) {
      return this.services.get(key) as T;
    }
    
    // Check if singleton already created
    if (this.singletons.has(key)) {
      return this.singletons.get(key) as T;
    }
    
    // Create new instance from factory
    const factory = this.factories.get(key);
    if (!factory) {
      throw new Error(`Service not registered: ${key}`);
    }
    
    const instance = factory(this);
    this.singletons.set(key, instance);
    
    return instance;
  }
  
  /**
   * Check if service is registered
   */
  has(key: string): boolean {
    return this.services.has(key) || 
           this.factories.has(key) ||
           this.singletons.has(key);
  }
  
  /**
   * Clear all services (useful for testing)
   */
  clear(): void {
    this.services.clear();
    this.factories.clear();
    this.singletons.clear();
  }
}
```

### Service Registration

```typescript
// src/core/di/serviceRegistry.ts

import { DIContainer } from './DIContainer';
import { Database } from '@/electron/database';
import { ESPNService } from '@/electron/espnService';
import { CacheService } from '@/services/CacheService';

export function registerCoreServices(container: DIContainer): void {
  // Database (singleton)
  container.registerSingleton('database', () => {
    return new Database();
  });
  
  // API Service (singleton)
  container.registerSingleton('api', (c) => {
    const db = c.get<Database>('database');
    return new ESPNService(db);
  });
  
  // Cache Service (singleton)
  container.registerSingleton('cache', () => {
    return new CacheService();
  });
  
  // Logger (singleton)
  container.registerSingleton('logger', () => {
    return console; // Replace with winston or similar
  });
}
```

### Using DI in Modules

```typescript
// src/modules/players/services/PlayerService.ts

import { Database } from '@/electron/database';
import { ESPNService } from '@/electron/espnService';
import { CacheService } from '@/services/CacheService';

export class PlayerService {
  constructor(
    private database: Database,
    private api: ESPNService,
    private cache: CacheService
  ) {}
  
  async getPlayer(playerId: string): Promise<Player> {
    // Try cache first
    const cached = this.cache.get(`player:${playerId}`);
    if (cached) return cached;
    
    // Try database
    const fromDb = this.database.getPlayer(playerId);
    if (fromDb) {
      this.cache.set(`player:${playerId}`, fromDb);
      return fromDb;
    }
    
    // Fetch from API
    const player = await this.api.fetchPlayer(playerId);
    this.database.savePlayer(player);
    this.cache.set(`player:${playerId}`, player);
    
    return player;
  }
}
```

---

## Testing Strategy

### Module Testing Levels

```
┌─────────────────────────────────────────┐
│        E2E TESTS (Integration)          │
│  Test complete user flows across modules│
└─────────────────────────────────────────┘
                  ▲
                  │
┌─────────────────┴─────────────────┐
│     MODULE TESTS (Integration)    │
│  Test module with mocked deps     │
└─────────────────────────────────────┘
                  ▲
                  │
┌─────────────────┴─────────────────┐
│    COMPONENT TESTS (Integration)  │
│  Test UI components               │
└─────────────────────────────────────┘
                  ▲
                  │
┌─────────────────┴─────────────────┐
│      UNIT TESTS (Isolated)        │
│  Test individual functions        │
└─────────────────────────────────────┘
```

### Unit Tests (Services & Utils)

```typescript
// src/modules/players/tests/PlayerService.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PlayerService } from '../services/PlayerService';

describe('PlayerService', () => {
  let service: PlayerService;
  let mockDatabase: any;
  let mockApi: any;
  let mockCache: any;
  
  beforeEach(() => {
    // Create mocks
    mockDatabase = {
      getPlayer: vi.fn(),
      savePlayer: vi.fn(),
    };
    
    mockApi = {
      fetchPlayer: vi.fn(),
    };
    
    mockCache = {
      get: vi.fn(),
      set: vi.fn(),
    };
    
    // Create service with mocked dependencies
    service = new PlayerService(mockDatabase, mockApi, mockCache);
  });
  
  it('should return cached player if available', async () => {
    const mockPlayer = { id: '123', name: 'Tom Brady' };
    mockCache.get.mockReturnValue(mockPlayer);
    
    const result = await service.getPlayer('123');
    
    expect(result).toEqual(mockPlayer);
    expect(mockCache.get).toHaveBeenCalledWith('player:123');
    expect(mockDatabase.getPlayer).not.toHaveBeenCalled();
  });
  
  it('should fetch from database if not cached', async () => {
    const mockPlayer = { id: '123', name: 'Tom Brady' };
    mockCache.get.mockReturnValue(null);
    mockDatabase.getPlayer.mockReturnValue(mockPlayer);
    
    const result = await service.getPlayer('123');
    
    expect(result).toEqual(mockPlayer);
    expect(mockDatabase.getPlayer).toHaveBeenCalledWith('123');
    expect(mockCache.set).toHaveBeenCalledWith('player:123', mockPlayer);
  });
  
  it('should fetch from API if not in database', async () => {
    const mockPlayer = { id: '123', name: 'Tom Brady' };
    mockCache.get.mockReturnValue(null);
    mockDatabase.getPlayer.mockReturnValue(null);
    mockApi.fetchPlayer.mockResolvedValue(mockPlayer);
    
    const result = await service.getPlayer('123');
    
    expect(result).toEqual(mockPlayer);
    expect(mockApi.fetchPlayer).toHaveBeenCalledWith('123');
    expect(mockDatabase.savePlayer).toHaveBeenCalledWith(mockPlayer);
    expect(mockCache.set).toHaveBeenCalledWith('player:123', mockPlayer);
  });
});
```

### Component Tests (React Testing Library)

```typescript
// src/modules/players/tests/PlayerProfile.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlayerProfile } from '../components/PlayerProfile';

vi.mock('@/core/featureFlags', () => ({
  useFeatureFlags: () => ({
    isEnabled: () => true,
  }),
}));

describe('PlayerProfile', () => {
  const mockPlayer = {
    id: '123',
    displayName: 'Tom Brady',
    position: 'QB',
    jerseyNumber: 12,
    college: 'Michigan',
  };
  
  it('should render player information', () => {
    render(<PlayerProfile player={mockPlayer} />);
    
    expect(screen.getByText('Tom Brady')).toBeInTheDocument();
    expect(screen.getByText('QB')).toBeInTheDocument();
    expect(screen.getByText('#12')).toBeInTheDocument();
  });
  
  it('should show college info when feature is enabled', () => {
    render(<PlayerProfile player={mockPlayer} />);
    
    expect(screen.getByText('Michigan')).toBeInTheDocument();
  });
  
  it('should hide college info when feature is disabled', () => {
    vi.mocked(useFeatureFlags).mockReturnValue({
      isEnabled: (key: string) => key !== 'players.showCollegeInfo',
    });
    
    render(<PlayerProfile player={mockPlayer} />);
    
    expect(screen.queryByText('Michigan')).not.toBeInTheDocument();
  });
});
```

### Module Integration Tests

```typescript
// src/modules/players/tests/PlayerModule.integration.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { ModuleLoader } from '@/core/modules';
import { DIContainer } from '@/core/di';
import { FeatureFlags } from '@/core/featureFlags';
import PlayerModule from '../index';

describe('PlayerModule Integration', () => {
  let loader: ModuleLoader;
  let container: DIContainer;
  let featureFlags: FeatureFlags;
  
  beforeEach(() => {
    container = new DIContainer();
    featureFlags = new FeatureFlags();
    loader = new ModuleLoader(featureFlags, container);
    
    // Register core services
    container.register('database', mockDatabase);
    container.register('api', mockApi);
    container.register('cache', mockCache);
  });
  
  it('should initialize successfully', async () => {
    loader.registerModule(PlayerModule);
    await loader.initializeModules();
    
    const service = container.get('playerService');
    expect(service).toBeDefined();
  });
  
  it('should not initialize when feature flag is disabled', async () => {
    featureFlags.set('module.players.enabled', false);
    
    loader.registerModule(PlayerModule);
    await loader.initializeModules();
    
    expect(container.has('playerService')).toBe(false);
  });
});
```

### Test Organization per Module

```
modules/players/tests/
├── unit/
│   ├── PlayerService.test.ts
│   ├── playerHelpers.test.ts
│   └── playerUtils.test.ts
├── components/
│   ├── PlayerProfile.test.tsx
│   ├── PlayerStats.test.tsx
│   └── PlayerCard.test.tsx
├── integration/
│   └── PlayerModule.integration.test.ts
└── e2e/
    └── playerFlow.e2e.test.ts
```

---

## Incremental Rollout Plan

### Phase-by-Phase Module Development

```
PHASE 1: Foundation (Week 1-2)
├─ Core App Infrastructure
│  ├─ Module loader system
│  ├─ Feature flag system
│  ├─ DI container
│  └─ Base module template
├─ Deliverable: Core app with plugin architecture
└─ Risk: Low | Complexity: Medium

PHASE 2: First Module - Players (Week 3-4)
├─ Player Module Development
│  ├─ Player service
│  ├─ Player components
│  ├─ Player routes
│  └─ Unit tests
├─ Deliverable: Working player profiles
└─ Risk: Low | Complexity: Medium

PHASE 3: Second Module - Analytics (Week 5-6)
├─ Analytics Module Development
│  ├─ Standings service
│  ├─ Analytics dashboard
│  ├─ Charts & visualizations
│  └─ Tests
├─ Deliverable: Analytics dashboard
└─ Risk: Low | Complexity: Medium

PHASE 4: Intelligence Module - Predictions (Week 7-8)
├─ Predictions Module Development
│  ├─ Prediction algorithm
│  ├─ Prediction UI
│  ├─ Historical accuracy tracking
│  └─ Tests
├─ Deliverable: Game predictions
└─ Risk: Medium | Complexity: High

PHASE 5: Playoffs Module (Week 9-10)
├─ Playoff Module Development
│  ├─ Bracket visualization
│  ├─ Playoff scenarios
│  ├─ Historical playoffs
│  └─ Tests
├─ Deliverable: Playoff brackets
└─ Risk: Low | Complexity: Medium

PHASE 6: Search Module (Week 11)
├─ Search Module Development
│  ├─ Global search
│  ├─ Advanced filters
│  ├─ Search UI
│  └─ Tests
├─ Deliverable: Search functionality
└─ Risk: Low | Complexity: Low

PHASE 7: Export Module (Week 12)
├─ Export Module Development
│  ├─ CSV export
│  ├─ PDF export
│  ├─ Share features
│  └─ Tests
├─ Deliverable: Export capabilities
└─ Risk: Low | Complexity: Medium

PHASE 8: Content Modules (Week 13-14)
├─ News Module
├─ Fantasy Module
└─ Social Module
└─ Risk: Medium | Complexity: Medium

PHASE 9: Alerts Module (Week 15)
├─ Alerts Module Development
│  ├─ Alert system
│  ├─ Notification service
│  ├─ Background scheduler
│  └─ Tests
├─ Deliverable: Custom alerts
└─ Risk: Medium | Complexity: Medium

PHASE 10: Polish & Optimization (Week 16)
├─ Performance optimization
├─ Bug fixes
├─ Documentation
└─ Risk: Low | Complexity: Low
```

### Decision Gates

After each phase, evaluate:

1. **Quality Gate**
   - All tests passing?
   - Performance acceptable?
   - No critical bugs?

2. **User Feedback Gate**
   - Does the feature work as expected?
   - Is it valuable to users?
   - Any adjustments needed?

3. **Go/No-Go Decision**
   - Continue to next module?
   - Iterate on current module?
   - Pause and reassess?

---

## Code Organization

### Directory Structure

```
src/
├── core/                          # Core framework code
│   ├── modules/
│   │   ├── ModuleLoader.ts       # Module discovery & loading
│   │   ├── Module.types.ts       # Module interfaces
│   │   └── index.ts
│   ├── featureFlags/
│   │   ├── FeatureFlags.ts       # Feature flag system
│   │   ├── useFeatureFlags.ts    # React hook
│   │   └── index.ts
│   ├── di/
│   │   ├── DIContainer.ts        # Dependency injection
│   │   ├── serviceRegistry.ts    # Core service registration
│   │   └── index.ts
│   ├── router/
│   │   ├── AppRouter.tsx         # Main router
│   │   ├── ModuleRoutes.tsx      # Dynamic module routes
│   │   └── index.ts
│   └── components/
│       ├── Layout.tsx            # App layout
│       ├── Navigation.tsx        # Dynamic navigation
│       └── ErrorBoundary.tsx
│
├── modules/                       # Feature modules
│   ├── players/
│   │   ├── index.ts              # Module registration
│   │   ├── manifest.json         # Module manifest
│   │   ├── services/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── tests/
│   │   └── README.md
│   ├── analytics/
│   ├── predictions/
│   ├── playoffs/
│   ├── search/
│   ├── export/
│   ├── news/
│   ├── fantasy/
│   ├── alerts/
│   └── social/
│
├── shared/                        # Shared code (used by modules)
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── index.ts
│   └── types/
│       └── common.types.ts
│
├── config/
│   ├── featureFlags.ts           # Feature flag configuration
│   ├── modules.ts                # Module configuration
│   └── env.ts                    # Environment config
│
├── App.tsx                        # Root component
├── main.tsx                       # Entry point
└── types.ts                       # Global types

electron/
├── services/                      # Backend services
│   ├── BaseService.ts            # Base service class
│   ├── playerService.ts          # Player backend
│   ├── analyticsService.ts
│   ├── predictionService.ts
│   └── index.ts
├── migrations/                    # Database migrations
│   ├── migrationRunner.ts
│   ├── 001_initial.ts
│   ├── 002_add_players.ts
│   └── index.ts
├── database.ts
├── espnService.ts
├── main.ts
└── preload.ts

tests/
├── unit/                          # Unit tests
├── integration/                   # Integration tests
└── e2e/                          # End-to-end tests
```

### Import Path Aliases

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@core/*": ["./src/core/*"],
      "@modules/*": ["./src/modules/*"],
      "@shared/*": ["./src/shared/*"],
      "@config/*": ["./src/config/*"],
      "@electron/*": ["./electron/*"]
    }
  }
}
```

### Naming Conventions

1. **Modules**: lowercase, plural (e.g., `players`, `analytics`)
2. **Components**: PascalCase (e.g., `PlayerProfile`)
3. **Services**: PascalCase + Service suffix (e.g., `PlayerService`)
4. **Hooks**: camelCase + use prefix (e.g., `usePlayer`)
5. **Types**: PascalCase (e.g., `Player`, `PlayerStats`)
6. **Feature Flags**: SCREAMING_SNAKE_CASE (e.g., `PLAYER_PROFILES`)

---

## Implementation Roadmap

### Week 1-2: Foundation

**Goal:** Build the core plugin architecture

**Tasks:**
- [ ] Create module loader system
- [ ] Implement feature flag system
- [ ] Set up DI container
- [ ] Create base module template
- [ ] Update app to use module system
- [ ] Write core tests
- [ ] Documentation

**Deliverable:** Core app with plugin architecture ready

**Success Criteria:**
- Can register and load modules
- Feature flags work
- DI container functional
- Tests passing

---

### Week 3-4: Player Module

**Goal:** First complete module as proof of concept

**Tasks:**
- [ ] Create player module structure
- [ ] Implement player service
- [ ] Build player components
- [ ] Create player pages
- [ ] Add player routes
- [ ] Write tests (unit + integration)
- [ ] Module documentation

**Deliverable:** Working player profile feature

**Success Criteria:**
- Can view player profiles
- Stats load correctly
- Tests passing
- Feature flag toggles module

---

### Week 5-6: Analytics Module

**Goal:** Second module to validate architecture

**Tasks:**
- [ ] Create analytics module structure
- [ ] Implement standings service
- [ ] Build analytics dashboard
- [ ] Create visualizations
- [ ] Add analytics routes
- [ ] Write tests
- [ ] Module documentation

**Deliverable:** Analytics dashboard

**Success Criteria:**
- Standings display correctly
- Charts render properly
- Module works independently
- Tests passing

---

### Week 7-8: Predictions Module

**Goal:** More complex module to test extensibility

**Tasks:**
- [ ] Create predictions module structure
- [ ] Implement prediction algorithm
- [ ] Build prediction UI
- [ ] Add accuracy tracking
- [ ] Write tests
- [ ] Module documentation

**Deliverable:** Game prediction system

**Success Criteria:**
- Predictions generate correctly
- UI displays predictions
- Accuracy tracked over time
- Tests passing

---

### Week 9-16: Remaining Modules

**Goal:** Complete all optional modules

**Tasks:**
- [ ] Playoff module (Week 9-10)
- [ ] Search module (Week 11)
- [ ] Export module (Week 12)
- [ ] News module (Week 13)
- [ ] Fantasy module (Week 13)
- [ ] Social module (Week 14)
- [ ] Alerts module (Week 15)
- [ ] Polish & optimization (Week 16)

**Deliverable:** Complete VERSION 3 with all features

---

## Benefits Summary

### Before Modular Architecture
- ❌ 10/10 complexity
- ❌ 4.2/10 development practicality
- ❌ 9/10 risk
- ❌ Must build everything at once
- ❌ Hard to test
- ❌ Difficult to maintain

### After Modular Architecture
- ✅ 4/10 complexity (per module)
- ✅ 8/10 development practicality
- ✅ 4/10 risk (incremental)
- ✅ Build one feature at a time
- ✅ Easy to test (isolated modules)
- ✅ Simple to maintain
- ✅ Features can be toggled
- ✅ Can ship MVPs faster
- ✅ Team can work in parallel

---

## Complexity Reduction

### Perceived Complexity per Module

Instead of one 10/10 complexity project, you have:
- 1 × 6/10 (Core architecture)
- 10 × 3-4/10 (Individual modules)

**Total effort is the same, but risk and mental load are dramatically reduced.**

---

## Success Metrics

1. **Development Velocity**
   - Target: Ship one module every 2 weeks
   - Measure: Time from start to production

2. **Code Quality**
   - Target: 80%+ test coverage per module
   - Measure: Code coverage reports

3. **Reliability**
   - Target: <1% error rate per module
   - Measure: Error monitoring

4. **Performance**
   - Target: <100ms module load time
   - Measure: Performance profiling

5. **Developer Experience**
   - Target: New module in <1 day setup
   - Measure: Time to create new module from template

---

## Conclusion

This modular architecture transforms VERSION 3 from:
- **Risky monolith** → **Safe incremental development**
- **10/10 complexity** → **4/10 per module**
- **All or nothing** → **Progressive enhancement**
- **Hard to test** → **Easy isolated testing**
- **Long time to value** → **Ship features incrementally**

**You can now build VERSION 3 like LEGO blocks, not a monolith.**

Each module is:
- Self-contained
- Independently testable
- Optionally enabled
- Easy to understand
- Low risk to add

Start with the core (2 weeks), then add one module at a time (2 weeks each). After 4 weeks, you have a working app with players. After 6 weeks, add analytics. After 16 weeks, you have the full VERSION 3.

**Risk reduced. Complexity managed. Success likely.**

---

**End of Modular Architecture Specification**
