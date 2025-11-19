# Module Template Guide

**Quick reference for creating new modules in VERSION 3**

---

## Creating a New Module

### Step 1: Generate Module Structure

```bash
# Run the module generator
npm run create-module <module-name>

# Example:
npm run create-module players
```

### Step 2: Module Directory Structure

```
modules/your-module/
├── index.ts                    # Module registration
├── manifest.json               # Module configuration
├── README.md                   # Module documentation
├── services/
│   ├── YourModuleService.ts   # Business logic
│   └── index.ts
├── components/
│   ├── YourComponent.tsx      # UI components
│   └── index.ts
├── pages/
│   └── YourPage.tsx           # Route pages
├── hooks/
│   └── useYourHook.ts         # Custom hooks
├── types/
│   └── yourModule.types.ts    # TypeScript types
├── utils/
│   └── yourHelpers.ts         # Utility functions
└── tests/
    ├── unit/
    ├── components/
    └── integration/
```

---

## Template Files

### 1. Module Index (index.ts)

```typescript
import { Module, ModuleContext } from '@/core/modules';
import { YourModuleService } from './services/YourModuleService';
import manifest from './manifest.json';

export class YourModule implements Module {
  id = manifest.id;
  manifest = manifest;
  
  private service?: YourModuleService;
  
  async initialize(context: ModuleContext): Promise<void> {
    console.log(`[${this.id}] Initializing...`);
    
    // Create service with dependencies
    this.service = new YourModuleService(
      context.database,
      context.api,
      context.cache
    );
    
    // Register service in DI container
    context.container.register('yourModuleService', this.service);
    
    // Run database migrations if needed
    if (context.database && manifest.database?.migrations) {
      for (const migration of manifest.database.migrations) {
        await context.database.runMigration(migration);
      }
    }
    
    console.log(`[${this.id}] Initialized successfully`);
  }
  
  async destroy(): Promise<void> {
    console.log(`[${this.id}] Destroying...`);
    await this.service?.cleanup();
  }
  
  async getComponents() {
    return import('./components');
  }
  
  async getPages() {
    return import('./pages');
  }
  
  async isHealthy(): Promise<boolean> {
    return this.service?.isReady() ?? false;
  }
}

export default new YourModule();
```

### 2. Module Manifest (manifest.json)

```json
{
  "id": "your-module",
  "name": "Your Module Name",
  "version": "1.0.0",
  "description": "Brief description of what this module does",
  "category": "data",
  "author": "Your Name",
  
  "dependencies": [],
  "optionalDependencies": [],
  
  "defaultEnabled": true,
  
  "routes": [
    {
      "path": "/your-route/:id",
      "component": "YourPage",
      "requiresAuth": false,
      "meta": {
        "title": "Your Page Title"
      }
    }
  ],
  
  "navigation": [
    {
      "label": "Your Module",
      "icon": "Box",
      "path": "/your-route",
      "order": 50
    }
  ],
  
  "settings": [
    {
      "key": "yourModule.settingName",
      "label": "Setting Display Name",
      "type": "boolean",
      "default": true,
      "description": "What this setting controls"
    }
  ],
  
  "database": {
    "tables": ["your_table"],
    "migrations": ["00X_add_your_table.ts"]
  },
  
  "featureFlags": [
    "your_module_feature_1",
    "your_module_feature_2"
  ],
  
  "permissions": [
    "database:read",
    "database:write",
    "api:espn"
  ]
}
```

### 3. Service Template (services/YourModuleService.ts)

```typescript
import { Database } from '@/electron/database';
import { ESPNService } from '@/electron/espnService';
import { CacheService } from '@/services/CacheService';
import { YourData } from '../types/yourModule.types';

export class YourModuleService {
  private ready = false;
  
  constructor(
    private database: Database,
    private api: ESPNService,
    private cache: CacheService
  ) {
    this.initialize();
  }
  
  private async initialize(): Promise<void> {
    // Any async initialization
    this.ready = true;
  }
  
  /**
   * Get data with caching
   */
  async getData(id: string): Promise<YourData | null> {
    // Try cache first
    const cacheKey = `yourModule:${id}`;
    const cached = this.cache.get<YourData>(cacheKey);
    if (cached) {
      return cached;
    }
    
    // Try database
    const fromDb = await this.getFromDatabase(id);
    if (fromDb) {
      this.cache.set(cacheKey, fromDb, 300000); // 5 min TTL
      return fromDb;
    }
    
    // Fetch from API
    const fromApi = await this.fetchFromApi(id);
    if (fromApi) {
      await this.saveToDatabase(fromApi);
      this.cache.set(cacheKey, fromApi, 300000);
      return fromApi;
    }
    
    return null;
  }
  
  private async getFromDatabase(id: string): Promise<YourData | null> {
    const result = this.database.prepare(
      'SELECT * FROM your_table WHERE id = ?'
    ).get(id);
    
    return result as YourData | null;
  }
  
  private async fetchFromApi(id: string): Promise<YourData | null> {
    try {
      const response = await this.api.fetch(`/your-endpoint/${id}`);
      return response.data;
    } catch (error) {
      console.error('API fetch failed:', error);
      return null;
    }
  }
  
  private async saveToDatabase(data: YourData): Promise<void> {
    this.database.prepare(`
      INSERT OR REPLACE INTO your_table (id, field1, field2, updatedAt)
      VALUES (?, ?, ?, ?)
    `).run(data.id, data.field1, data.field2, Date.now());
  }
  
  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    // Close connections, clear timers, etc.
    this.ready = false;
  }
  
  /**
   * Health check
   */
  isReady(): boolean {
    return this.ready;
  }
}
```

### 4. Component Template (components/YourComponent.tsx)

```typescript
import React from 'react';
import { useFeatureFlags } from '@/core/featureFlags';
import { YourData } from '../types/yourModule.types';
import './YourComponent.css';

interface YourComponentProps {
  data: YourData;
  onAction?: () => void;
}

export const YourComponent: React.FC<YourComponentProps> = ({ 
  data, 
  onAction 
}) => {
  const featureFlags = useFeatureFlags();
  
  const showAdvanced = featureFlags.isEnabled(
    'yourModule.advancedFeatures',
    false
  );
  
  return (
    <div className="your-component">
      <h3>{data.title}</h3>
      <p>{data.description}</p>
      
      {showAdvanced && (
        <div className="advanced-section">
          {/* Advanced features */}
        </div>
      )}
      
      {onAction && (
        <button onClick={onAction}>
          Take Action
        </button>
      )}
    </div>
  );
};
```

### 5. Page Template (pages/YourPage.tsx)

```typescript
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { YourComponent } from '../components/YourComponent';
import { YourData } from '../types/yourModule.types';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import ErrorMessage from '@/shared/components/ErrorMessage';

export const YourPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [data, setData] = useState<YourData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadData();
  }, [id]);
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await window.electronAPI.yourModule.getData(id!);
      setData(result);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }
  
  if (error || !data) {
    return (
      <ErrorMessage 
        message={error || 'Data not found'}
        onRetry={loadData}
        onBack={() => navigate(-1)}
      />
    );
  }
  
  return (
    <div className="your-page">
      <YourComponent data={data} />
    </div>
  );
};

export default YourPage;
```

### 6. Custom Hook (hooks/useYourData.ts)

```typescript
import { useState, useEffect } from 'react';
import { YourData } from '../types/yourModule.types';

export const useYourData = (id: string) => {
  const [data, setData] = useState<YourData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await window.electronAPI.yourModule.getData(id);
        
        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, [id]);
  
  const refetch = async () => {
    // Trigger reload
  };
  
  return { data, loading, error, refetch };
};
```

### 7. Types (types/yourModule.types.ts)

```typescript
export interface YourData {
  id: string;
  field1: string;
  field2: number;
  createdAt: number;
  updatedAt: number;
}

export interface YourDataFilter {
  searchTerm?: string;
  sortBy?: 'field1' | 'field2' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export type YourDataStatus = 'active' | 'inactive' | 'pending';
```

### 8. Test Template (tests/unit/YourModuleService.test.ts)

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { YourModuleService } from '../../services/YourModuleService';

describe('YourModuleService', () => {
  let service: YourModuleService;
  let mockDatabase: any;
  let mockApi: any;
  let mockCache: any;
  
  beforeEach(() => {
    mockDatabase = {
      prepare: vi.fn(() => ({
        get: vi.fn(),
        run: vi.fn(),
      })),
    };
    
    mockApi = {
      fetch: vi.fn(),
    };
    
    mockCache = {
      get: vi.fn(),
      set: vi.fn(),
    };
    
    service = new YourModuleService(mockDatabase, mockApi, mockCache);
  });
  
  it('should return cached data when available', async () => {
    const mockData = { id: '123', field1: 'test' };
    mockCache.get.mockReturnValue(mockData);
    
    const result = await service.getData('123');
    
    expect(result).toEqual(mockData);
    expect(mockCache.get).toHaveBeenCalledWith('yourModule:123');
  });
  
  // Add more tests...
});
```

### 9. README Template (README.md)

```markdown
# Your Module Name

Brief description of what this module does.

## Features

- Feature 1
- Feature 2
- Feature 3

## Usage

### As a User

1. Navigate to Your Module section
2. Do something
3. See results

### As a Developer

```typescript
import { useYourData } from '@modules/your-module/hooks';

const MyComponent = () => {
  const { data, loading } = useYourData('123');
  
  if (loading) return <div>Loading...</div>;
  
  return <div>{data?.field1}</div>;
};
```

## Configuration

### Feature Flags

- `yourModule.advancedFeatures` - Enable advanced features
- `yourModule.experimentalUI` - Use experimental UI

### Settings

- `yourModule.settingName` - What this setting does

## Database Schema

### your_table

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key |
| field1 | TEXT | Description |
| field2 INTEGER | Description |
| updatedAt | INTEGER | Timestamp |

## API

### Electron API

```typescript
window.electronAPI.yourModule.getData(id: string): Promise<YourData>
```

## Testing

```bash
# Run all tests
npm test modules/your-module

# Run unit tests
npm test modules/your-module/tests/unit

# Run with coverage
npm test -- --coverage modules/your-module
```

## Dependencies

- Core: database, api, cache
- Optional: analytics (for enhanced features)

## Roadmap

- [ ] Future feature 1
- [ ] Future feature 2
```

---

## Module Categories

### Data Modules
Focus on data retrieval and display

**Examples:** Players, Analytics, Standings

### Intelligence Modules
Add computed insights and predictions

**Examples:** Predictions, Comparisons

### Content Modules
Integrate external content

**Examples:** News, Fantasy, Social

### Utility Modules
Provide cross-cutting functionality

**Examples:** Search, Export, Alerts

---

## Module Development Checklist

### Phase 1: Setup
- [ ] Create module directory structure
- [ ] Create manifest.json
- [ ] Implement module index.ts
- [ ] Create README.md

### Phase 2: Service Layer
- [ ] Create service class
- [ ] Implement data fetching
- [ ] Add caching logic
- [ ] Add error handling
- [ ] Write service tests

### Phase 3: UI Layer
- [ ] Create components
- [ ] Create pages
- [ ] Add routes
- [ ] Implement custom hooks
- [ ] Write component tests

### Phase 4: Integration
- [ ] Register module
- [ ] Add feature flags
- [ ] Set up database migrations
- [ ] Configure settings
- [ ] Write integration tests

### Phase 5: Polish
- [ ] Add loading states
- [ ] Add error states
- [ ] Optimize performance
- [ ] Write documentation
- [ ] Code review

---

## Best Practices

### 1. Keep Modules Independent
- Don't import directly from other modules
- Use DI container for shared services
- Communicate through events if needed

### 2. Use Feature Flags
- Wrap new features in flags
- Enable gradual rollout
- Easy rollback if issues

### 3. Write Tests First
- Start with service tests
- Add component tests
- Finish with integration tests

### 4. Document Everything
- Update README.md
- Add JSDoc comments
- Include usage examples

### 5. Optimize Performance
- Lazy load components
- Cache aggressively
- Use React.memo
- Debounce expensive operations

---

## Common Patterns

### Caching Pattern

```typescript
async getData(id: string): Promise<Data> {
  const cacheKey = `module:${id}`;
  
  // Cache → Database → API
  return this.cache.get(cacheKey) 
    ?? await this.getFromDb(id)
    ?? await this.fetchFromApi(id);
}
```

### Error Handling Pattern

```typescript
try {
  const data = await service.getData(id);
  return { data, error: null };
} catch (error) {
  console.error('Failed to load:', error);
  return { data: null, error: error.message };
}
```

### Loading State Pattern

```typescript
const [state, setState] = useState({
  data: null,
  loading: true,
  error: null
});

useEffect(() => {
  const load = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const data = await fetchData();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error });
    }
  };
  load();
}, [dependency]);
```

---

## Quick Commands

```bash
# Create new module
npm run create-module <name>

# Run module tests
npm test modules/<name>

# Build module
npm run build:module <name>

# Enable module
npm run enable-module <name>

# Disable module
npm run disable-module <name>
```

---

**You're ready to create your first module!**
