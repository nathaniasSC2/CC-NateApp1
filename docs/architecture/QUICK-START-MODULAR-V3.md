# Quick Start: Modular VERSION 3

**Get started with modular architecture in 3 days**

---

## Overview

This guide helps you implement the core modular architecture in **3 days**, then add your first module (Players) in the next **2 days**.

**Timeline:**
- Day 1: Core infrastructure (Module loader, DI container)
- Day 2: Feature flags, routing
- Day 3: Testing setup, documentation
- Day 4-5: First module (Players)

---

## Day 1: Core Infrastructure

### Morning: Module Loader (4 hours)

1. **Create core directories**

```bash
mkdir -p src/core/{modules,di,featureFlags,router}
mkdir -p src/modules
mkdir -p src/shared/{components,hooks,utils,types}
```

2. **Create module types**

```typescript
// src/core/modules/Module.types.ts
import { Database } from '@/electron/database';
import { DIContainer } from '@/core/di';
import { FeatureFlags } from '@/core/featureFlags';

export interface ModuleContext {
  database: Database;
  api: any;
  cache: any;
  container: DIContainer;
  featureFlags: FeatureFlags;
}

export interface ModuleRoute {
  path: string;
  component: string;
  requiresAuth?: boolean;
  meta?: Record<string, any>;
}

export interface ModuleNavigation {
  label: string;
  icon: string;
  path: string;
  order?: number;
}

export interface ModuleManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  category: 'core' | 'data' | 'intelligence' | 'content' | 'utility';
  dependencies?: string[];
  optionalDependencies?: string[];
  defaultEnabled: boolean;
  routes?: ModuleRoute[];
  navigation?: ModuleNavigation[];
  settings?: any[];
  database?: {
    tables: string[];
    migrations: string[];
  };
  featureFlags?: string[];
  permissions?: string[];
}

export interface Module {
  id: string;
  manifest: ModuleManifest;
  
  initialize(context: ModuleContext): Promise<void>;
  destroy(): Promise<void>;
  getComponents?(): Promise<any>;
  getPages?(): Promise<any>;
  isHealthy?(): Promise<boolean>;
}
```

3. **Create module loader** (Use code from main architecture doc)

4. **Test module loader**

```typescript
// src/core/modules/ModuleLoader.test.ts
import { describe, it, expect } from 'vitest';
import { ModuleLoader } from './ModuleLoader';

describe('ModuleLoader', () => {
  it('should register a module', () => {
    const loader = new ModuleLoader(mockFeatureFlags, mockContainer);
    const module = createMockModule();
    
    loader.registerModule(module);
    
    expect(loader.getModule(module.id)).toBe(module);
  });
});
```

### Afternoon: DI Container (4 hours)

1. **Create DI container** (Use code from main architecture doc)

2. **Register core services**

```typescript
// src/core/di/serviceRegistry.ts
import { DIContainer } from './DIContainer';

export function registerCoreServices(container: DIContainer): void {
  // Database
  container.registerSingleton('database', async () => {
    const { getDatabase } = await import('@/electron/database');
    return getDatabase();
  });
  
  // Cache
  container.registerSingleton('cache', () => {
    return new Map(); // Simple cache for now
  });
  
  // Logger
  container.registerSingleton('logger', () => {
    return console;
  });
}
```

3. **Test DI container**

```typescript
// src/core/di/DIContainer.test.ts
import { describe, it, expect } from 'vitest';
import { DIContainer } from './DIContainer';

describe('DIContainer', () => {
  it('should register and retrieve services', () => {
    const container = new DIContainer();
    const service = { name: 'test' };
    
    container.register('test', service);
    
    expect(container.get('test')).toBe(service);
  });
  
  it('should create singletons only once', () => {
    const container = new DIContainer();
    let callCount = 0;
    
    container.registerSingleton('counter', () => {
      callCount++;
      return { count: callCount };
    });
    
    const first = container.get('counter');
    const second = container.get('counter');
    
    expect(first).toBe(second);
    expect(callCount).toBe(1);
  });
});
```

---

## Day 2: Feature Flags & Routing

### Morning: Feature Flags (4 hours)

1. **Create feature flag system** (Use code from main architecture doc)

2. **Create React hook**

```typescript
// src/core/featureFlags/useFeatureFlags.ts
import { useContext, createContext } from 'react';
import { FeatureFlags } from './FeatureFlags';

const FeatureFlagsContext = createContext<FeatureFlags | null>(null);

export const FeatureFlagsProvider = FeatureFlagsContext.Provider;

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within FeatureFlagsProvider');
  }
  return context;
};
```

3. **Configure default flags**

```typescript
// src/config/featureFlags.ts
export const FEATURE_FLAGS = {
  MODULES: {
    PLAYERS: 'module.players.enabled',
    ANALYTICS: 'module.analytics.enabled',
  },
};

export const DEFAULT_FLAGS = [
  { key: FEATURE_FLAGS.MODULES.PLAYERS, enabled: true },
  { key: FEATURE_FLAGS.MODULES.ANALYTICS, enabled: false },
];
```

### Afternoon: Dynamic Routing (4 hours)

1. **Create dynamic router**

```typescript
// src/core/router/AppRouter.tsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useModuleRoutes } from './useModuleRoutes';
import LoadingSpinner from '@/shared/components/LoadingSpinner';

export const AppRouter: React.FC = () => {
  const moduleRoutes = useModuleRoutes();
  
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          {/* Core routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Module routes */}
          {moduleRoutes.map(route => (
            <Route 
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
```

2. **Create hook to get module routes**

```typescript
// src/core/router/useModuleRoutes.ts
import { useMemo } from 'react';
import { useModuleLoader } from '@/core/modules';

export const useModuleRoutes = () => {
  const loader = useModuleLoader();
  
  return useMemo(() => {
    return loader.getAllRoutes();
  }, [loader]);
};
```

---

## Day 3: Testing & Polish

### Morning: Testing Setup (4 hours)

1. **Configure Vitest**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
});
```

2. **Create test utilities**

```typescript
// tests/testUtils.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { FeatureFlagsProvider } from '@/core/featureFlags';
import { DIContainer } from '@/core/di';

export function renderWithProviders(
  component: React.ReactElement,
  options = {}
) {
  const container = new DIContainer();
  const featureFlags = new FeatureFlags();
  
  return render(
    <FeatureFlagsProvider value={featureFlags}>
      {component}
    </FeatureFlagsProvider>,
    options
  );
}
```

### Afternoon: Documentation & Integration (4 hours)

1. **Update App.tsx**

```typescript
// src/App.tsx
import React, { useEffect, useState } from 'react';
import { AppRouter } from '@/core/router/AppRouter';
import { FeatureFlagsProvider } from '@/core/featureFlags/useFeatureFlags';
import { ModuleLoaderProvider } from '@/core/modules/useModuleLoader';
import { DIContainer } from '@/core/di';
import { FeatureFlags } from '@/core/featureFlags';
import { ModuleLoader } from '@/core/modules';
import { registerCoreServices } from '@/core/di/serviceRegistry';
import { DEFAULT_FLAGS } from '@/config/featureFlags';

export const App: React.FC = () => {
  const [initialized, setInitialized] = useState(false);
  const [container] = useState(() => new DIContainer());
  const [featureFlags] = useState(() => {
    const ff = new FeatureFlags();
    DEFAULT_FLAGS.forEach(flag => ff.register(flag));
    return ff;
  });
  const [loader] = useState(() => new ModuleLoader(featureFlags, container));
  
  useEffect(() => {
    const init = async () => {
      // Register core services
      registerCoreServices(container);
      
      // Discover and initialize modules
      await loader.discoverModules();
      await loader.initializeModules();
      
      setInitialized(true);
    };
    
    init();
  }, []);
  
  if (!initialized) {
    return <div>Initializing...</div>;
  }
  
  return (
    <FeatureFlagsProvider value={featureFlags}>
      <ModuleLoaderProvider value={loader}>
        <AppRouter />
      </ModuleLoaderProvider>
    </FeatureFlagsProvider>
  );
};
```

2. **Create index exports**

```typescript
// src/core/modules/index.ts
export * from './Module.types';
export * from './ModuleLoader';
export * from './useModuleLoader';

// src/core/di/index.ts
export * from './DIContainer';
export * from './serviceRegistry';

// src/core/featureFlags/index.ts
export * from './FeatureFlags';
export * from './useFeatureFlags';
```

---

## Day 4-5: First Module (Players)

### Day 4 Morning: Module Structure

1. **Create module directory**

```bash
mkdir -p src/modules/players/{services,components,pages,hooks,types,utils,tests}
```

2. **Create manifest**

```json
// src/modules/players/manifest.json
{
  "id": "players",
  "name": "Player Profiles",
  "version": "1.0.0",
  "description": "Player profiles with career stats",
  "category": "data",
  "dependencies": [],
  "defaultEnabled": true,
  "routes": [
    {
      "path": "/player/:playerId",
      "component": "PlayerPage"
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
  "featureFlags": ["player_profiles"]
}
```

### Day 4 Afternoon: Service Layer

1. **Create player service** (Use template from MODULE-TEMPLATE.md)

2. **Write service tests**

3. **Test service independently**

```bash
npm test src/modules/players/tests/unit
```

### Day 5 Morning: UI Layer

1. **Create components**
   - PlayerCard
   - PlayerStats
   - PlayerProfile

2. **Create page**
   - PlayerPage

3. **Add styles**

### Day 5 Afternoon: Integration

1. **Register module**

```typescript
// src/modules/players/index.ts
import { Module, ModuleContext } from '@/core/modules';
import { PlayerService } from './services/PlayerService';
import manifest from './manifest.json';

export class PlayerModule implements Module {
  id = manifest.id;
  manifest = manifest;
  private service?: PlayerService;
  
  async initialize(context: ModuleContext): Promise<void> {
    this.service = new PlayerService(
      context.database,
      context.api,
      context.cache
    );
    
    context.container.register('playerService', this.service);
  }
  
  async destroy(): Promise<void> {
    await this.service?.cleanup();
  }
  
  async getPages() {
    return import('./pages');
  }
}

export default new PlayerModule();
```

2. **Test module loads**

```bash
npm run dev
# Check console for "[players] Initialized successfully"
```

3. **Navigate to player page**

```
http://localhost:5173/player/123
```

---

## Testing Checklist

After 5 days, you should have:

### Core Architecture
- [ ] Module loader works
- [ ] DI container functional
- [ ] Feature flags toggle correctly
- [ ] Dynamic routing loads module routes
- [ ] All core tests passing

### First Module
- [ ] Player module registers
- [ ] Player service fetches data
- [ ] Player page renders
- [ ] Navigation shows Players link
- [ ] Can toggle module with feature flag
- [ ] All module tests passing

---

## Verification Commands

```bash
# Run all tests
npm test

# Run core tests only
npm test src/core

# Run module tests only
npm test src/modules/players

# Check coverage
npm test -- --coverage

# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

---

## Success Metrics

You've successfully implemented modular architecture if:

1. ✅ Module loader discovers and loads modules
2. ✅ Feature flags can enable/disable modules
3. ✅ DI container provides dependencies
4. ✅ First module (Players) works end-to-end
5. ✅ Can add new modules without touching core
6. ✅ Tests are passing
7. ✅ Build succeeds

---

## Next Steps

After completing the quick start:

1. **Add second module** (Analytics)
   - Validates architecture scales
   - Tests module independence
   - ~2 days

2. **Add third module** (Predictions)
   - Tests complex modules
   - Validates dependency handling
   - ~2-3 days

3. **Continue with remaining modules**
   - One module every 1-2 weeks
   - Each module is self-contained
   - Low risk, incremental value

---

## Troubleshooting

### Module not loading
- Check manifest.json syntax
- Verify module exports default instance
- Check feature flag is enabled
- Look for initialization errors in console

### Tests failing
- Ensure vitest.config.ts has correct aliases
- Check mock setup in tests/setup.ts
- Verify imports use correct paths

### Routes not working
- Check route path in manifest
- Verify getPages() returns valid component
- Check AppRouter includes module routes

### DI errors
- Ensure services registered before use
- Check service dependencies exist
- Verify singleton vs transient registration

---

## Quick Reference

### Create a new module

```bash
# 1. Create directory
mkdir -p src/modules/my-module/{services,components,pages,tests}

# 2. Copy template files
cp docs/architecture/templates/* src/modules/my-module/

# 3. Update manifest.json with your module details

# 4. Implement service, components, pages

# 5. Write tests

# 6. Module auto-discovered on next run
```

### Enable/disable a module

```typescript
// In app or settings
featureFlags.set('module.myModule.enabled', true);
```

### Register a service

```typescript
// In module's initialize()
context.container.register('myService', this.service);
```

### Get a service

```typescript
// In another service
const myService = container.get('myService');
```

---

## Resources

- **Full Architecture Spec:** `/docs/architecture/MODULAR-ARCHITECTURE-V3.md`
- **Module Template:** `/docs/architecture/MODULE-TEMPLATE.md`
- **Original V3 Guide:** `/docs/IMPLEMENTATION-GUIDE-V3.md`

---

**You're ready to build modular VERSION 3!**

Start with Day 1 and work through sequentially. By Day 5, you'll have a working modular architecture with your first feature module.
