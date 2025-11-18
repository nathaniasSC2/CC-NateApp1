# VERSION 2: ENHANCED UI/UX - DETAILED SPECIFICATION

**Version:** 2.0.0  
**Focus:** User Experience, Accessibility, Error Handling, and Design System  
**Status:** Planning Phase  
**Created:** 2025-11-18

---

## EXECUTIVE SUMMARY

VERSION 2 transforms the NFL Dashboard from a functional MVP into a polished, accessible, and resilient application. This version prioritizes user experience through comprehensive error handling, accessibility compliance (WCAG 2.1 Level AA), offline support, and a modern design system with theme customization.

### Key Objectives
- Achieve WCAG 2.1 Level AA compliance
- Implement comprehensive error handling with user-friendly feedback
- Add offline mode with graceful degradation
- Create a flexible design system with theme support
- Enhance loading states and micro-interactions
- Build user onboarding and help system
- Improve responsive design across all screen sizes

---

## 1. UI/UX IMPROVEMENTS BREAKDOWN

### 1.1 Toast Notification System

#### Overview
Replace all console.error calls with user-visible toast notifications that provide clear, actionable feedback for all operations.

#### Toast Types
- **Success**: Green, checkmark icon, 3s auto-dismiss
- **Error**: Red, X icon, 5s auto-dismiss (user can dismiss)
- **Warning**: Yellow/orange, alert icon, 4s auto-dismiss
- **Info**: Blue, info icon, 3s auto-dismiss
- **Loading**: Blue, spinner, manual dismiss only

#### Toast Positions
- Default: Top-right corner
- Alternative: Top-center for critical messages
- Mobile: Top-center, full width

#### Implementation Details
```
Component: ToastProvider, Toast, useToast hook
Library: Consider react-hot-toast or custom implementation
Props:
  - id: string (unique identifier)
  - type: 'success' | 'error' | 'warning' | 'info' | 'loading'
  - message: string
  - description?: string (optional secondary text)
  - duration?: number (milliseconds, 0 for persistent)
  - action?: { label: string; onClick: () => void }
  - dismissible?: boolean
  - position?: 'top-right' | 'top-center' | 'bottom-right'
```

#### Toast Messages Mapping
- Data sync success: "NFL data updated successfully"
- Data sync error: "Failed to sync NFL data. Check your connection."
- Favorite team set: "Favorite team updated to [Team Name]"
- Network offline: "You're offline. Showing cached data."
- API rate limit: "Too many requests. Please wait a moment."
- Database error: "Local storage error. Please restart the app."

#### Accessibility
- Use aria-live="polite" for non-critical toasts
- Use aria-live="assertive" for errors
- Screen reader announces toast content
- Focus management: preserve focus location after toast appears

---

### 1.2 Loading States & Skeleton Screens

#### Overview
Replace generic spinners with contextual loading indicators and skeleton screens that match content structure.

#### Loading State Types

##### 1.2.1 Initial App Load
- **Current**: Full-screen spinner with text
- **Enhanced**: 
  - Animated logo with pulsing effect
  - Progress bar showing sync stages
  - Stage indicators: "Loading teams → Syncing schedule → Almost ready"
  - Estimated time remaining
  - Background: Themed gradient

##### 1.2.2 Dashboard Cards (Next Game)
- **Skeleton Structure**:
  - Rectangular placeholder for team logos (shimmer animation)
  - Lines for team names
  - Single line for game time
  - Rounded rectangles for venue info
- **Animation**: Left-to-right shimmer gradient

##### 1.2.3 Team Carousel
- **Skeleton**: 
  - Circular placeholders for logos
  - Small rectangles for team abbreviations
  - Cards with border shimmer
- **Count**: Show 10 skeleton cards during initial load

##### 1.2.4 Game Schedule List
- **Skeleton**:
  - Repeating card structure (show 8 items)
  - Week number placeholder
  - Team logo circles
  - Score/time line placeholders
- **Animation**: Staggered appearance (50ms delay between items)

##### 1.2.5 Game Details Pane
- **Skeleton**:
  - Large team logo circles
  - Score rectangles
  - Info rows (date, venue, location)
  - Stat category headers
  - Player stat rows
- **Behavior**: Fade in actual content when loaded

##### 1.2.6 Refresh Operation
- **UI Changes**:
  - Refresh button shows spinner icon (rotates continuously)
  - Button text: "Syncing..."
  - Subtle pulsing effect on data that's being updated
  - Small badge showing "Updated just now" after completion
  - No full-page reload

##### 1.2.7 Progressive Loading
- Load critical data first (next game, favorite team)
- Stream in carousel teams (show as they load)
- Load game details on-demand
- Show partial data with "Loading..." indicators for missing pieces

#### Skeleton Screen Design
```css
Base skeleton element:
  - Background: Linear gradient shimmer
  - Colors: rgba(255,255,255,0.05) to rgba(255,255,255,0.15) (dark theme)
  - Animation: 1.5s ease-in-out infinite
  - Border radius: Match target element
  
Shimmer animation:
  - Move gradient from left (-100%) to right (100%)
  - Smooth easing function
  - Seamless loop
```

---

### 1.3 Error States & Empty States

#### 1.3.1 Error States

##### Network Error
- **Scenario**: ESPN API unreachable
- **Display**:
  - Icon: WiFi with slash
  - Title: "Connection Lost"
  - Message: "Unable to reach ESPN servers. Using cached data."
  - Actions:
    - "Retry Now" button (primary)
    - "View Offline Data" button (secondary)
  - Visual: Muted colors, icon animation
  - Location: Replace affected section, not full-page takeover

##### API Error (4xx/5xx)
- **Scenario**: API returns error
- **Display**:
  - Icon: Warning triangle
  - Title: "Data Unavailable"
  - Message: "ESPN service is temporarily unavailable. [Error code: XXX]"
  - Actions:
    - "Try Again" button
    - "Report Issue" link (opens GitHub issues)
  - Include timestamp of last successful sync

##### Database Error
- **Scenario**: SQLite operation fails
- **Display**:
  - Icon: Database with X
  - Title: "Storage Error"
  - Message: "Unable to save data locally. Please restart the application."
  - Actions:
    - "Restart App" button (electron app.relaunch())
    - "Get Help" button (links to troubleshooting)
  - Critical error style (red theme)

##### No Data Error
- **Scenario**: First load fails completely
- **Display**:
  - Icon: Empty inbox
  - Title: "No Data Available"
  - Message: "We couldn't load any NFL data. Please check your internet connection."
  - Actions:
    - "Retry Connection" button
    - "Check System Status" link
  - Full-page state

#### 1.3.2 Empty States

##### No Favorite Team
- **Location**: Dashboard favorite team card
- **Display**:
  - Icon: Star outline (large, centered)
  - Title: "No Favorite Team Selected"
  - Message: "Choose your favorite team from the dropdown above to see their next game here."
  - Visual: Dashed border, subtle animation on hover
  - Action: Animate/pulse the favorite team dropdown

##### No Upcoming Games
- **Location**: Next game cards
- **Display**:
  - Icon: Calendar with checkmark
  - Title: "No Upcoming Games"
  - Message: "The NFL season has concluded. Check back soon!"
  - Alternate: "Offseason - Season starts in [calculated days]"
  - Visual: Peaceful, end-of-season theme

##### No Game Details Available
- **Location**: Game details pane
- **Display**:
  - Icon: Info circle
  - Title: "Details Not Yet Available"
  - Message: "Game statistics will be available after the game begins."
  - Show: Expected game start time
  - Visual: Soft gradient background

##### Team Schedule Empty
- **Location**: Schedule list
- **Display**:
  - Icon: Calendar
  - Title: "No Games Scheduled"
  - Message: "Schedule information is not available for this team."
  - Actions: "Refresh Data" button
  - Visual: Centered in schedule area

##### Search/Filter No Results
- **Location**: Any filtered list
- **Display**:
  - Icon: Magnifying glass
  - Title: "No Matches Found"
  - Message: "Try adjusting your filters or search terms."
  - Actions: "Clear Filters" button
  - Visual: Light, non-alarming

#### Error Boundary Component
```
Global error boundary that catches React errors:
  - Friendly error screen (not technical stack trace)
  - "Something went wrong" messaging
  - "Reload App" button
  - "Send Error Report" button
  - Logs error to console and optionally to error tracking service
  - Fallback UI matches app theme
```

---

### 1.4 Smooth Transitions & Micro-Interactions

#### 1.4.1 Page/Component Transitions

##### Team Selection
- **Trigger**: Click team in carousel
- **Animation**:
  - Carousel card: Scale to 1.05, glow border (100ms)
  - Schedule: Fade out old content (150ms)
  - Schedule: Slide in new content from right (200ms, ease-out)
  - Timing: Staggered, total 350ms
- **Effect**: Smooth, connected feeling

##### Game Selection
- **Trigger**: Click game in schedule
- **Animation**:
  - Schedule item: Highlight/border animation (100ms)
  - Details pane: Slide in from right if first game selected
  - Details pane: Fade content transition if changing games (200ms)
  - Team logos: Bounce in (150ms, ease-out, 50ms stagger)
- **Effect**: Natural flow of focus

##### Modal/Dialog Open
- **Animation**:
  - Backdrop: Fade in (200ms)
  - Modal: Scale from 0.95 to 1.0 + fade in (250ms, ease-out)
  - Content: Stagger fade-in for sections (50ms delay each)
- **Effect**: Lightweight, polished

##### Theme Toggle
- **Animation**:
  - Entire app: Cross-fade between themes (400ms)
  - Toggle switch: Slide + moon/sun icon transition (200ms)
  - Background gradient: Smooth color transition (400ms)
  - No jarring changes
- **Effect**: Smooth, delightful theme switch

#### 1.4.2 Micro-Interactions

##### Button Interactions
- **Hover**:
  - Background color: Lighten/darken 10% (150ms)
  - Scale: 1.02 (100ms, ease-out)
  - Cursor: pointer
- **Active/Click**:
  - Scale: 0.98 (50ms)
  - Ripple effect from click point (400ms)
- **Disabled**:
  - Opacity: 0.5
  - Cursor: not-allowed
  - No hover effects

##### Favorite Star Button
- **Trigger**: Click to favorite/unfavorite
- **Animation**:
  - Filled star: Pop in with bounce (300ms, bounce easing)
  - Empty star: Scale out (200ms)
  - Color transition: Yellow with glow effect
  - Particle burst (optional, subtle)
- **Sound**: Optional subtle "ding" sound

##### Refresh Button
- **Trigger**: Click refresh
- **Animation**:
  - Button: Rotate 360° (500ms)
  - Icon: Continue rotating during sync
  - Success: Checkmark appears briefly (1s)
- **Feedback**: Toast notification on completion

##### Carousel Scroll
- **Drag**:
  - Cursor: Grab hand while dragging
  - Momentum scroll: Continue movement after release
  - Snap to cards: Gentle snap to nearest card boundary
- **Navigation Arrows**:
  - Fade in on hover (200ms)
  - Pulse animation when at start/end
  - Smooth scroll (300ms ease-in-out)

##### Game Card Hover
- **Animation**:
  - Elevation: Increase shadow (200ms)
  - Border: Subtle glow in team color
  - Transform: translateY(-2px)
  - Background: Slight lighten
- **Selected State**:
  - Persistent glow
  - Left border highlight (3px)
  - Different background shade

##### Score Counter Animation
- **Trigger**: Score updates (live games)
- **Animation**:
  - Number: Count up animation (500ms)
  - Flash/pulse effect (200ms)
  - Highlight change (3s fade out)
- **Effect**: Draw attention to score changes

##### Loading Spinner
- **Styles**:
  - Smooth continuous rotation
  - Gradient color cycling (optional)
  - Size variants: small (16px), medium (32px), large (48px)
  - Consistent speed (1s per rotation)

##### Input Focus
- **Animation**:
  - Border color transition (200ms)
  - Box shadow glow (200ms)
  - Label float up (if applicable)
- **Accessibility**: Clear 2px focus ring

##### Toast Entrance/Exit
- **Enter**:
  - Slide in from top + fade (300ms, ease-out)
  - Slight bounce at end
- **Exit**:
  - Slide up + fade out (200ms, ease-in)
- **Stacking**: New toasts push old ones down

#### 1.4.3 Performance Considerations
- Use CSS transforms (GPU accelerated) over position changes
- Use will-change property for animated elements
- Limit animations to 60fps target
- Reduce motion for users with prefers-reduced-motion
- Batch DOM updates
- Use requestAnimationFrame for JS animations

---

### 1.5 Responsive Design Improvements

#### Current State Analysis
- Basic responsive layout breaks at 1200px
- Details pane becomes full-width on mobile
- No consideration for tablets or medium screens
- Carousel needs touch optimization

#### Enhanced Breakpoints
```
xs: 0-575px (Mobile portrait)
sm: 576-767px (Mobile landscape)
md: 768-991px (Tablet portrait)
lg: 992-1199px (Tablet landscape / Small desktop)
xl: 1200-1399px (Desktop)
xxl: 1400px+ (Large desktop)
```

#### Layout Adaptations

##### Mobile Portrait (xs: 0-575px)
- **Dashboard**:
  - Cards stack vertically
  - Full width cards
  - Favorite team selector: Full width
  - Refresh button: Icon only
- **Carousel**:
  - Show 2-3 teams at once
  - Larger touch targets (60x60px minimum)
  - Swipe gestures enabled
  - Hide navigation arrows (swipe only)
- **Schedule**:
  - Simplified card layout
  - Smaller team logos (32px)
  - Abbreviated team names
  - Stack date/time vertically
- **Details Pane**:
  - Full-screen overlay (slide up from bottom)
  - Close button in top-right
  - Scroll within pane
  - Stats: Single column

##### Mobile Landscape (sm: 576-767px)
- Similar to mobile portrait
- Dashboard: Side-by-side cards (2 columns)
- Carousel: Show 4-5 teams
- Details pane: 70% width overlay from right

##### Tablet Portrait (md: 768-991px)
- **Layout**: 
  - Dashboard: 2-column grid
  - Main content: 60% schedule, 40% details (side-by-side)
  - Carousel: Show 6-8 teams
- **Interactions**:
  - Touch optimized
  - Hover states still functional
  - Larger interactive elements

##### Tablet Landscape / Small Desktop (lg: 992-1199px)
- **Layout**:
  - Dashboard: 2-column grid, more spacious
  - Main content: Current layout (side-by-side)
  - Details pane: 400px fixed width
  - Carousel: Show 8-10 teams
- **UI**: Similar to desktop, slightly condensed

##### Desktop (xl: 1200-1399px)
- Current design, enhanced
- Details pane: 450px
- Carousel: Show 10-12 teams
- Optimal spacing

##### Large Desktop (xxl: 1400px+)
- Maximum content width: 1600px (centered)
- Increased padding and spacing
- Details pane: 500px
- Carousel: Show 12+ teams
- Consider 3-column layout for stats

#### Touch Interactions
- Minimum touch target: 44x44px (Apple HIG) or 48x48px (Material)
- Increase spacing between interactive elements
- Swipe gestures:
  - Carousel: Horizontal swipe
  - Game details: Swipe right to close
  - Schedule list: Pull to refresh (optional)
- Haptic feedback (where supported)
- Long-press for context menus

#### Responsive Typography
```
xs: Base 14px, Headings 18-24px
sm: Base 14px, Headings 20-28px
md: Base 15px, Headings 22-32px
lg: Base 16px, Headings 24-36px
xl: Base 16px, Headings 28-42px
xxl: Base 18px, Headings 32-48px

Line heights: 1.5 for body, 1.2-1.3 for headings
```

#### Responsive Images
- Team logos: Serve appropriate sizes based on display
- Use srcset for high-DPI displays (2x, 3x)
- Lazy load images outside viewport
- Placeholder while loading

#### Orientation Changes
- Detect and handle orientation changes smoothly
- Maintain scroll position where possible
- Re-layout without jarring transitions
- Update layout breakpoint on rotation

---

## 2. ERROR HANDLING STRATEGY

### 2.1 Error Classification System

#### Level 1: Critical Errors (App-Breaking)
- Database initialization failure
- Electron IPC communication failure
- Uncaught React errors (Error Boundary)

**Response**:
- Full-screen error UI
- "Restart App" primary action
- Error details (non-technical)
- Optional: Send error report
- Log to electron-log
- Prevent further operations

#### Level 2: Major Errors (Feature-Breaking)
- ESPN API completely unreachable
- All data sync failures
- Database write failures

**Response**:
- Toast notification (persistent)
- Fallback to cached data
- Disable affected features
- "Retry" action available
- Warning badge on dashboard
- Log error details

#### Level 3: Minor Errors (Degraded Experience)
- Single API endpoint failure
- Partial data load failure
- Image load failure

**Response**:
- Toast notification (auto-dismiss)
- Show partial data
- Placeholder for missing content
- Automatic retry (with backoff)
- Log warning

#### Level 4: Informational (No Error)
- Offline mode activation
- Cache used instead of fresh data
- Rate limiting applied

**Response**:
- Info toast (auto-dismiss)
- Subtle UI indicator
- No action required
- Log info message

### 2.2 Error Recovery Strategies

#### Automatic Retry with Exponential Backoff
```
Retry Policy:
  - Attempt 1: Immediate
  - Attempt 2: 1 second delay
  - Attempt 3: 2 seconds delay
  - Attempt 4: 4 seconds delay
  - Attempt 5: 8 seconds delay
  - Max attempts: 5
  - Give up: Show error, allow manual retry

Apply to:
  - Network requests
  - Database operations
  - File system operations
```

#### Graceful Degradation
- Show cached data with "Last updated" timestamp
- Disable real-time features
- Hide unavailable features gracefully
- Maintain core functionality

#### Offline Queue
- Queue failed operations (favorite team setting, etc.)
- Retry when connection restored
- Show pending operations indicator
- Sync when back online

#### Circuit Breaker Pattern
```
For ESPN API:
  - Track failure rate
  - If >50% failures in 1 minute: Open circuit
  - Circuit open: Use cached data, don't attempt requests
  - After 30 seconds: Try single request (half-open)
  - If successful: Close circuit (resume normal)
  - If failed: Reopen circuit (30s wait)
```

### 2.3 User-Facing Error Messages

#### Guidelines
- No technical jargon
- Clear, concise language
- Explain impact on user
- Provide actionable next steps
- Empathetic tone
- Include help resources

#### Examples

**Good Error Message**:
```
Title: Connection Lost
Message: We can't reach the NFL servers right now. You can still browse your saved data.
Actions: [Try Again] [Continue Offline]
```

**Bad Error Message**:
```
Error: ECONNREFUSED 503
axios.get failed at line 45
```

**Conversion Table**:
| Technical Error | User-Friendly Message |
|----------------|----------------------|
| Network timeout | "Connection is taking too long. Please check your internet." |
| 404 Not Found | "This data is no longer available." |
| 500 Server Error | "ESPN's servers are having issues. We'll try again shortly." |
| 429 Rate Limit | "Too many requests. Please wait a moment." |
| SQLITE_BUSY | "The app is busy. Please wait a moment." |
| SQLITE_CORRUPT | "Data storage error. Please restart the app." |

### 2.4 Error Logging & Monitoring

#### Logging Strategy
```
Tool: electron-log
Levels:
  - error: Critical/Major errors
  - warn: Minor errors, degraded states
  - info: Key operations, state changes
  - debug: Detailed operation logs (dev only)

Log Format:
  [timestamp] [level] [component] message {metadata}

Log Files:
  - Location: User data directory
  - Rotation: Daily, keep 7 days
  - Max size: 10MB per file
```

#### What to Log
- All API requests (URL, duration, status)
- Database operations (query, duration, result)
- Error details (message, stack, context)
- User actions (clicks, navigations) - privacy conscious
- Performance metrics (load times, memory usage)
- State changes (team selection, favorite update)

#### Error Context
Each error log should include:
- Timestamp
- Error type/code
- Error message
- Component/function where error occurred
- User action that triggered error
- Application state snapshot
- Network status
- Device information

#### User Error Reports
- "Report Issue" button on critical errors
- Collect: Error details, logs, system info
- Option to include: User description, contact email
- Privacy: Clear about what's collected
- Action: Create GitHub issue or email
- Anonymize: Remove personal data

### 2.5 Error Prevention

#### Input Validation
- Validate all user inputs client-side
- Show inline validation errors
- Disable submit until valid
- Clear error messages

#### Defensive Coding
- Check for null/undefined before use
- Validate API response structure
- Type guards for TypeScript
- Try-catch around risky operations
- Default values for missing data

#### Testing
- Unit tests for error paths
- Integration tests for API failures
- Simulate network issues
- Test offline scenarios
- Test database failures

---

## 3. OFFLINE MODE & GRACEFUL DEGRADATION

### 3.1 Offline Detection

#### Implementation
```
Component: OfflineProvider + useOnline hook
Detection methods:
  1. navigator.onLine (primary)
  2. Ping ESPN API every 30s (secondary validation)
  3. Failed request tracking (inference)

Events:
  - window 'online' event
  - window 'offline' event
  - Failed request threshold reached

UI Indicator:
  - Banner at top of app (subtle, dismissible)
  - Icon in header (WiFi status)
  - Toast on status change
```

#### Online/Offline States
- **Online**: Normal operation, fresh data
- **Offline**: Cached data, features disabled
- **Limited**: Partial connection, degraded
- **Reconnecting**: Attempting to restore connection

### 3.2 Cached Data Strategy

#### What to Cache
- All team data (logos, names, colors)
- Complete schedule for current season
- Game scores and results
- Game details for viewed games
- User preferences (favorite team)
- Last sync timestamp

#### Cache Storage
```
Primary: SQLite database (already implemented)
Secondary: IndexedDB for large assets (future)
Tertiary: localStorage for preferences

Cache Validation:
  - Check timestamp on load
  - If < 1 hour old: Use cached data
  - If > 1 hour old: Show cached, fetch update in background
  - If > 24 hours old: Show "Data may be outdated" warning
```

#### Cache Updates
- Background sync when online
- Incremental updates (not full refresh)
- Priority queue: Critical data first
- Batch updates to reduce API calls

### 3.3 Feature Degradation Matrix

| Feature | Online | Offline | Limited Connection |
|---------|--------|---------|-------------------|
| View Schedule | Full | Cached | Cached + update attempt |
| View Scores | Real-time | Last cached | Delayed updates |
| View Game Details | Full | Cached only | Basic info only |
| Set Favorite Team | Immediate | Queued | Queued |
| Refresh Data | Fetch new | No-op | Retry |
| Live Game Updates | Real-time | No | Delayed |
| Team Carousel | Full | Cached | Cached |
| Search/Filter | Full | Local only | Local only |

### 3.4 Offline UI Indicators

#### Banner
```
Position: Top of app, below header
Content: "You're offline. Showing saved data from [time]."
Actions: [Dismiss] [Try to Reconnect]
Style: Info blue, icon, non-intrusive
Dismissible: Yes (persists state)
```

#### Status Icon
```
Location: Header, near refresh button
States:
  - Online: Green WiFi icon (or hidden)
  - Offline: Red WiFi-off icon
  - Reconnecting: Yellow WiFi with spinner
Tooltip: Connection status details
```

#### Disabled Features
- Visual: Reduced opacity (0.6)
- Cursor: not-allowed
- Tooltip: "This feature requires an internet connection"
- Icon: Small offline indicator badge

#### Data Freshness
```
Indicator: "Last updated: X minutes ago"
Location: Near refresh button or in footer
Colors:
  - Green: < 5 minutes ago
  - Yellow: 5-60 minutes ago
  - Orange: 1-24 hours ago
  - Red: > 24 hours ago
```

### 3.5 Offline Queue

#### Purpose
Queue operations that require network connectivity for execution when back online.

#### Queued Operations
- Set favorite team
- Manual data refresh requests
- Error reports submission
- Settings sync (future)

#### Implementation
```
Storage: localStorage (JSON array)
Structure: {
  id: uuid,
  operation: 'setFavoriteTeam',
  params: { teamId: '...' },
  timestamp: Date.now(),
  retries: 0
}

Processing:
  - On connection restored: Process queue in order
  - Retry failed operations (max 3 attempts)
  - Remove successful operations
  - Show progress: "Syncing X pending changes..."
  - Show result: Toast notification per operation
```

### 3.6 Background Sync (Future)

#### Service Worker (Web version)
- Background Sync API for web deployment
- Sync data even when app closed
- Push notifications for score updates

#### Electron Background Process
- Periodic sync when app minimized
- Notification for game start times
- Update badge with new scores count

---

## 4. ACCESSIBILITY COMPLIANCE PLAN (WCAG 2.1 LEVEL AA)

### 4.1 Keyboard Navigation

#### Tab Order & Focus Management
```
Tab Order:
  1. Skip to main content link (hidden, appears on focus)
  2. Dashboard header
  3. Favorite team select
  4. Refresh button
  5. Next game cards (focusable, but skip internal elements)
  6. Schedule list items (each game is one tab stop)
  7. Team carousel (left arrow, team cards, right arrow)
  8. Settings/help buttons

Focus Indicators:
  - Visible 2px outline
  - Color: High contrast (blue #4A9EFF or custom theme color)
  - Offset: 2px from element
  - Border radius: Match element shape
  - Never remove outline (don't use outline: none)
```

#### Keyboard Shortcuts
```
Global:
  - Cmd/Ctrl + R: Refresh data
  - Cmd/Ctrl + F: Search/filter (future feature)
  - Cmd/Ctrl + ,: Open settings
  - Escape: Close modals, panels, or details pane
  - ?: Show keyboard shortcuts help

Navigation:
  - Tab: Move focus forward
  - Shift + Tab: Move focus backward
  - Enter/Space: Activate focused element
  - Arrow keys: Navigate within carousels, lists
  
Carousel:
  - Left/Right arrows: Navigate teams
  - Home: First team
  - End: Last team
  - Enter: Select focused team

Schedule List:
  - Up/Down arrows: Navigate games
  - Enter: View game details
  - Escape: Deselect game

Details Pane:
  - Tab: Navigate within
  - Escape: Close pane
```

#### Focus Trapping
- Modals: Trap focus within modal
- Settings panel: Trap focus when open
- First tab: Focus first interactive element
- Last tab: Wrap to first element
- Escape: Close and return focus to trigger

#### Skip Links
```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```
- Positioned offscreen
- Visible on focus
- Jumps to main content area
- Bypasses header and navigation

### 4.2 ARIA Labels & Roles

#### Landmarks
```html
<header role="banner">
  <nav aria-label="Main navigation">...</nav>
</header>

<main role="main" id="main-content">
  <section aria-label="Dashboard">...</section>
  <section aria-label="Team schedule">...</section>
  <aside aria-label="Game details">...</aside>
</main>

<footer role="contentinfo">...</footer>
```

#### Interactive Elements
```html
<!-- Buttons -->
<button aria-label="Refresh NFL data">
  <span aria-hidden="true">↻</span>
</button>

<button 
  aria-label="Set Dallas Cowboys as favorite" 
  aria-pressed="false"
>
  ☆
</button>

<!-- Select -->
<label id="favorite-team-label">Favorite Team</label>
<select 
  aria-labelledby="favorite-team-label"
  aria-describedby="favorite-team-description"
>
  ...
</select>
<p id="favorite-team-description" class="sr-only">
  Select your favorite NFL team to track their schedule
</p>

<!-- Carousel -->
<div 
  role="region" 
  aria-label="NFL Teams"
  aria-describedby="carousel-instructions"
>
  <p id="carousel-instructions" class="sr-only">
    Use arrow keys or swipe to browse teams. Press Enter to select.
  </p>
  <button aria-label="Scroll left">‹</button>
  <div role="list">
    <div role="listitem" tabindex="0" aria-label="Dallas Cowboys">
      ...
    </div>
  </div>
  <button aria-label="Scroll right">›</button>
</div>

<!-- Game Cards -->
<article 
  role="article"
  aria-label="Week 5: Cowboys at Eagles, December 25, 2025 at 4:30 PM"
  tabindex="0"
>
  <div aria-label="Game status: Final score Cowboys 24, Eagles 21">
    ...
  </div>
</article>
```

#### Live Regions
```html
<!-- Toast notifications -->
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
  class="toast-container"
>
  <!-- Toast messages appear here -->
</div>

<!-- Error messages -->
<div 
  role="alert" 
  aria-live="assertive" 
  aria-atomic="true"
>
  <!-- Critical errors appear here -->
</div>

<!-- Loading states -->
<div 
  role="status" 
  aria-live="polite"
  aria-busy="true"
>
  <span class="sr-only">Loading NFL data...</span>
</div>
```

#### State Management
```html
<!-- Loading -->
<button aria-busy="true" aria-label="Syncing data">
  <span class="spinner" aria-hidden="true"></span>
  <span class="sr-only">Syncing...</span>
</button>

<!-- Expanded/Collapsed -->
<button 
  aria-expanded="false"
  aria-controls="settings-panel"
>
  Settings
</button>
<div id="settings-panel" aria-hidden="true">
  ...
</div>

<!-- Selected -->
<div 
  role="tab"
  aria-selected="true"
  tabindex="0"
>
  Schedule
</div>

<!-- Disabled -->
<button 
  disabled 
  aria-disabled="true"
  aria-label="Refresh data (offline)"
>
  Refresh
</button>
```

### 4.3 Screen Reader Support

#### Announcements
```
Page load: "NFL Dashboard. Loading data."
Data loaded: "NFL data loaded. Showing 32 teams."
Team selected: "Dallas Cowboys selected. Showing schedule."
Game selected: "Game details loaded for Cowboys at Eagles."
Favorite set: "Favorite team set to Dallas Cowboys."
Error: "Error: Could not load data. Please try again."
Offline: "Connection lost. Showing saved data."
Online: "Connection restored. Data updated."
```

#### Hidden Text for Screen Readers
```html
<span class="sr-only">Screen reader only text</span>

CSS:
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

#### Meaningful Link Text
```html
<!-- Bad -->
<a href="...">Click here</a>

<!-- Good -->
<a href="...">View Dallas Cowboys schedule</a>

<!-- With context -->
<a href="..." aria-label="View game details for Week 5 Cowboys vs Eagles">
  View details
</a>
```

#### Form Labels
- Every input has associated label
- Use <label> element with for attribute
- Or aria-labelledby
- Placeholder is NOT a label
- Required fields: aria-required="true"
- Error messages: aria-describedby, aria-invalid

#### Content Structure
```html
<!-- Proper heading hierarchy -->
<h1>NFL Dashboard</h1>
  <h2>Next Games</h2>
  <h2>Team Schedule</h2>
    <h3>Week 5</h3>
    <h3>Week 6</h3>

<!-- Lists -->
<ul role="list"> <!-- or <ol> -->
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<!-- Tables (if used) -->
<table>
  <caption>Team Statistics</caption>
  <thead>
    <tr>
      <th scope="col">Player</th>
      <th scope="col">Yards</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Player Name</th>
      <td>125</td>
    </tr>
  </tbody>
</table>
```

### 4.4 Color Contrast & Visual Design

#### Contrast Ratios (WCAG AA)
```
Normal text (< 18pt): 4.5:1 minimum
Large text (≥ 18pt or 14pt bold): 3:1 minimum
UI components and graphics: 3:1 minimum

Testing:
  - Use browser dev tools (Chrome Lighthouse)
  - Online tools: WebAIM Contrast Checker
  - Design tools: Figma plugins

Common Issues:
  - Gray text on gray background
  - Light blue links on white
  - Disabled button states too light
```

#### Color Palette Updates

##### Dark Theme (Current)
```
Background: #0a0e27 (dark blue)
Surface: #1a1f3a (lighter blue)
Primary: #4A9EFF (blue)
Success: #10B981 (green) ✓ AA contrast
Error: #EF4444 (red) ✓ AA contrast
Warning: #F59E0B (orange) ✓ AA contrast
Text Primary: #FFFFFF ✓ AAA contrast
Text Secondary: #B4B8C5 ✓ AA contrast (verify against background)

Updates needed:
  - Verify all text colors meet 4.5:1
  - Adjust team colors overlay for contrast
  - Ensure button states meet 3:1
```

##### Light Theme (New)
```
Background: #F9FAFB (very light gray)
Surface: #FFFFFF (white)
Primary: #2563EB (darker blue)
Success: #059669 (darker green)
Error: #DC2626 (darker red)
Warning: #D97706 (darker orange)
Text Primary: #111827 (almost black)
Text Secondary: #6B7280 (medium gray)

All colors must meet AA contrast requirements
```

#### Non-Color Indicators
- Don't rely on color alone
- Add icons for status (✓ checkmark for win, ✗ for loss)
- Use patterns or textures as secondary indicator
- Text labels for critical info
- Example: "Live" badge for in-progress games (not just color)

#### Focus Indicators
```
Default focus ring:
  - Color: #4A9EFF (blue)
  - Width: 2px
  - Offset: 2px
  - Contrast: 3:1 against background

Alternative for light theme:
  - Color: #2563EB (darker blue)
  - Ensure visibility on all backgrounds
```

### 4.5 Text & Typography

#### Font Sizes
```
Minimum: 14px (body text on mobile)
Recommended: 16px (body text on desktop)
Large text: 18px+ (AA large text standard)

Never below 12px (except legal/copyright)
```

#### Line Height & Spacing
```
Body text: line-height 1.5 (WCAG recommendation)
Headings: line-height 1.2-1.3
Paragraph spacing: 0.75em - 1em

Letter spacing: Normal (avoid condensed fonts)
Word spacing: Normal

Line length: 50-75 characters optimal (80 max)
```

#### Font Choices
```
Current: System fonts (good!)
  -apple-system, BlinkMacSystemFont, 'Segoe UI', ...

Benefits:
  - Familiar to users
  - Optimized for screen
  - Fast loading (no web fonts)
  - Excellent readability

Keep system fonts, don't switch to custom fonts
```

#### Text Alternatives
- All images: alt text
- Decorative images: alt=""
- Complex graphics: Long description
- Icons: aria-label or sr-only text
- Logo: "NFL Dashboard home"

### 4.6 Motion & Animation

#### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

#### Implementation
- Detect user preference
- Disable or greatly reduce animations
- Keep essential functional animations (loading)
- Replace motion with instant state changes
- Don't remove visual feedback entirely

#### Safe Animations
- No flashing faster than 3 times per second
- No large area flashes
- Avoid parallax scrolling
- Minimize rapid movement
- Provide pause controls for auto-playing content

### 4.7 Forms & Input

#### Input Labels
```html
<label for="favorite-team">Favorite Team</label>
<select id="favorite-team" required aria-required="true">
  <option value="">Select team</option>
  ...
</select>
```

#### Error Messages
```html
<input 
  type="text"
  id="search"
  aria-describedby="search-error"
  aria-invalid="true"
>
<span id="search-error" role="alert">
  Please enter at least 3 characters
</span>
```

#### Field Instructions
- Provide clear instructions
- Use aria-describedby for additional info
- Show format examples
- Indicate required fields visually and with aria-required

### 4.8 Testing & Validation

#### Automated Testing Tools
- **axe DevTools**: Browser extension, free tier
- **Lighthouse**: Built into Chrome DevTools
- **WAVE**: Web accessibility evaluation tool
- **pa11y**: CLI tool for CI/CD integration

#### Manual Testing Checklist
- [ ] Keyboard navigation: Tab through entire app
- [ ] Screen reader: Test with NVDA (Windows), VoiceOver (Mac), JAWS
- [ ] Color contrast: Check all text combinations
- [ ] Zoom: Test at 200% zoom level
- [ ] Text resize: Increase browser text size
- [ ] Focus indicators: Visible on all interactive elements
- [ ] Skip links: Working and visible on focus
- [ ] ARIA: Proper roles, labels, states
- [ ] Headings: Logical hierarchy
- [ ] Forms: Labels, error messages, instructions
- [ ] Media: Alt text, captions (if video)
- [ ] Motion: Reduced motion preference respected

#### Screen Reader Testing
- Test with at least 2 screen readers
- Navigate using keyboard only
- Check all interactive elements announced correctly
- Verify state changes are announced
- Test forms submission process
- Check modal/dialog behavior

#### Browser Testing
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Test on mobile browsers
- Verify keyboard support across browsers
- Check focus management

---

## 5. DESIGN SYSTEM ENHANCEMENTS

### 5.1 Theme Architecture

#### Theme Structure
```typescript
interface Theme {
  name: string;
  colors: {
    // Backgrounds
    background: string;
    surface: string;
    surfaceHover: string;
    
    // Primary colors
    primary: string;
    primaryHover: string;
    primaryActive: string;
    
    // Semantic colors
    success: string;
    error: string;
    warning: string;
    info: string;
    
    // Text
    textPrimary: string;
    textSecondary: string;
    textDisabled: string;
    
    // Borders
    border: string;
    borderHover: string;
    
    // Overlays
    overlay: string; // Modal backdrop
    shadow: string;
  };
  
  spacing: {
    xs: string;   // 4px
    sm: string;   // 8px
    md: string;   // 16px
    lg: string;   // 24px
    xl: string;   // 32px
    xxl: string;  // 48px
  };
  
  borderRadius: {
    sm: string;   // 4px
    md: string;   // 8px
    lg: string;   // 12px
    xl: string;   // 16px
    full: string; // 9999px
  };
  
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  
  transitions: {
    fast: string;    // 150ms
    normal: string;  // 300ms
    slow: string;    // 500ms
  };
  
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
}
```

#### Dark Theme Implementation
```typescript
const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: '#0a0e27',
    surface: '#1a1f3a',
    surfaceHover: '#242948',
    
    primary: '#4A9EFF',
    primaryHover: '#60AEFF',
    primaryActive: '#3A8EEF',
    
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    
    textPrimary: '#FFFFFF',
    textSecondary: '#B4B8C5',
    textDisabled: '#6B7280',
    
    border: '#2D3348',
    borderHover: '#3D4358',
    
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  // ... rest of theme
};
```

#### Light Theme Implementation
```typescript
const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceHover: '#F3F4F6',
    
    primary: '#2563EB',
    primaryHover: '#3B82F6',
    primaryActive: '#1D4ED8',
    
    success: '#059669',
    error: '#DC2626',
    warning: '#D97706',
    info: '#2563EB',
    
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textDisabled: '#9CA3AF',
    
    border: '#E5E7EB',
    borderHover: '#D1D5DB',
    
    overlay: 'rgba(0, 0, 0, 0.4)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  // ... rest of theme
};
```

#### Theme Provider
```typescript
// ThemeContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext<{
  theme: Theme;
  themeName: 'dark' | 'light';
  toggleTheme: () => void;
}>({
  theme: darkTheme,
  themeName: 'dark',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState<'dark' | 'light'>('dark');
  const [theme, setTheme] = useState(darkTheme);
  
  useEffect(() => {
    // Load saved preference
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      setThemeName(saved);
      setTheme(saved === 'light' ? lightTheme : darkTheme);
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = themeName === 'dark' ? 'light' : 'dark';
    setThemeName(newTheme);
    setTheme(newTheme === 'light' ? lightTheme : darkTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleTheme }}>
      <div className={`theme-${themeName}`} style={{
        '--color-background': theme.colors.background,
        '--color-surface': theme.colors.surface,
        // ... set all CSS variables
      } as React.CSSProperties}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

#### CSS Variables Approach
```css
:root {
  /* Colors */
  --color-background: var(--theme-background);
  --color-surface: var(--theme-surface);
  /* ... */
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  /* ... */
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 500ms ease;
}

/* Usage */
.button {
  background: var(--color-primary);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  transition: var(--transition-normal);
}
```

### 5.2 Component Library

#### Button Component
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}

// Variants:
// Primary: Filled, primary color
// Secondary: Outlined, primary color border
// Ghost: Transparent, hover effect
// Danger: Red, for destructive actions

// Sizes:
// sm: 32px height, 12px padding, 14px font
// md: 40px height, 16px padding, 16px font
// lg: 48px height, 20px padding, 18px font

// States: default, hover, active, disabled, loading
```

#### Card Component
```typescript
interface CardProps {
  variant: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// Variants:
// default: Background surface color, subtle border
// outlined: Border only, no background
// elevated: Shadow, no border

// Hover: Scale, shadow increase, border glow
```

#### Badge Component
```typescript
interface BadgeProps {
  variant: 'success' | 'error' | 'warning' | 'info' | 'neutral';
  size: 'sm' | 'md';
  children: React.ReactNode;
}

// Usage: LIVE badge, W/L indicators, status badges
```

#### Skeleton Component
```typescript
interface SkeletonProps {
  variant: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

// Usage: Loading placeholders
```

#### Modal Component
```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  children: React.ReactNode;
  actions?: React.ReactNode;
}

// Features:
// - Focus trap
// - Escape key to close
// - Click outside to close
// - Accessible (role="dialog", aria-modal)
```

#### Toast Component
```typescript
// Already specified in section 1.1
```

### 5.3 Typography System

#### Scale
```
Display (48px): Main headings, hero text
H1 (36px): Page titles
H2 (28px): Section headings
H3 (24px): Subsection headings
H4 (20px): Card titles
Body Large (18px): Emphasized body text
Body (16px): Default body text
Body Small (14px): Secondary text
Caption (12px): Helper text, labels
```

#### Weights
```
Regular (400): Body text
Medium (500): Emphasized text
Semibold (600): Headings, buttons
Bold (700): Important headings
```

#### Usage
```css
.text-display {
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.text-h1 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.text-body {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}
```

### 5.4 Spacing System

#### Scale (8px base)
```
xs: 4px (0.5 × base)
sm: 8px (1 × base)
md: 16px (2 × base)
lg: 24px (3 × base)
xl: 32px (4 × base)
xxl: 48px (6 × base)
```

#### Usage Guidelines
- xs: Icon padding, small gaps
- sm: Button padding, small margins
- md: Card padding, section spacing
- lg: Component spacing, section gaps
- xl: Large component padding
- xxl: Page-level spacing

### 5.5 Icon System

#### Icon Library
- Option 1: React Icons (simple, lightweight)
- Option 2: Heroicons (Tailwind's icon set)
- Option 3: Lucide React (modern, consistent)

#### Icon Sizes
```
xs: 12px
sm: 16px
md: 20px
lg: 24px
xl: 32px
```

#### Icon Usage
```typescript
<Icon name="refresh" size="md" color="currentColor" />
<Icon name="wifi-off" size="sm" className="text-error" />
```

#### Icon List (Needed)
- Refresh (↻)
- Star (★/☆)
- WiFi / WiFi-off
- Check / X
- Alert triangle
- Info circle
- Settings (gear)
- Help (?)
- Close (×)
- Search (magnifying glass)
- Filter
- Calendar
- Location pin
- Chevron left/right/up/down
- Menu (hamburger)
- External link

### 5.6 Animation Library

#### Predefined Animations
```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide in from right */
@keyframes slideInRight {
  from { 
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Scale in */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Shimmer (skeleton) */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

/* Pulse */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Spin */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

#### Animation Utilities
```css
.animate-fade-in {
  animation: fadeIn var(--transition-normal);
}

.animate-slide-in-right {
  animation: slideInRight var(--transition-normal);
}

/* etc. */
```

---

## 6. USER FEEDBACK MECHANISMS

### 6.1 Toast Notifications
(Already covered in section 1.1)

### 6.2 Loading Indicators
(Already covered in section 1.2)

### 6.3 Progress Feedback

#### Data Sync Progress
```
Component: ProgressBar
Display during initial load:
  - Steps: "Loading teams → Syncing games → Loading stats"
  - Progress: 0% → 33% → 66% → 100%
  - Visual: Linear progress bar
  - Animation: Smooth fill
  - Time estimate: "About 30 seconds remaining"
```

#### Operation Feedback
- Button state changes (loading spinner)
- Optimistic UI updates (update UI immediately, rollback on error)
- Confirmation messages (toast)
- Success indicators (checkmarks, green borders)

### 6.4 Inline Feedback

#### Form Validation
```
Real-time validation:
  - On blur: Validate field
  - On submit: Validate all fields
  - Show errors inline below field
  - Icon indicator (X for error, ✓ for valid)
  - Border color change (red for error)
```

#### Input Helper Text
```
Below input:
  - Gray text for instructions
  - Red text for errors
  - Green text for success
  - Icon for emphasis
```

### 6.5 Contextual Help

#### Tooltips
```
Component: Tooltip
Trigger: Hover or focus (300ms delay)
Content: Short help text (< 100 chars)
Position: Auto (top, bottom, left, right)
Accessibility: aria-describedby
Style: Dark background, white text, shadow
Arrow: Points to trigger element
```

#### Help Icons
```
Icon: (?) or info circle
Placement: Next to labels or headings
Trigger: Click or hover
Display: Tooltip or popover
Content: Expanded explanation
```

### 6.6 Empty States
(Already covered in section 1.3.2)

### 6.7 Confirmation Dialogs

#### Destructive Actions
```
Trigger: Before permanent/destructive action
Display: Modal dialog
Content:
  - Title: "Are you sure?"
  - Message: Explain consequences
  - Actions: "Cancel" (default focus), "Delete" (danger)
Behavior: Focus on cancel, require explicit confirmation
```

### 6.8 Status Indicators

#### Connection Status
- Icon in header (WiFi/WiFi-off)
- Tooltip: "Connected" or "Offline"
- Color: Green (online), Red (offline), Yellow (reconnecting)

#### Data Freshness
- Timestamp: "Updated 5 minutes ago"
- Color: Green (fresh), Yellow (stale), Red (very stale)
- Location: Near refresh button or in footer

#### Sync Status
- Badge on refresh button: "Syncing..." (spinner)
- Toast: "Sync complete" or "Sync failed"
- Visual: Pulsing indicator on affected data

---

## 7. USER ONBOARDING & HELP SYSTEM

### 7.1 First-Time User Experience

#### Welcome Screen (First Launch Only)
```
Display: Modal overlay after initial data loads
Content:
  - Welcome message: "Welcome to NFL Dashboard!"
  - Key features overview (3-4 bullet points):
    • Track all NFL teams and games
    • Set your favorite team
    • View detailed stats and schedules
    • Automatic updates from ESPN
  - Actions: "Take a Tour" or "Get Started"
Dismissible: "Skip for now" link
Preference: Save "onboarded" flag to localStorage
```

#### Product Tour
```
Component: Interactive overlay tour
Steps:
  1. Dashboard cards: "Here you'll see upcoming NFL games"
  2. Favorite team selector: "Set your favorite team here"
  3. Team carousel: "Browse all NFL teams"
  4. Schedule: "Click any game for details"
  5. Refresh button: "Sync latest scores and schedules"

Implementation:
  - Spotlight: Highlight target element
  - Dim rest of page (overlay)
  - Arrow pointing to element
  - Text bubble with instruction
  - Navigation: "Next", "Back", "Skip Tour"
  - Progress: "Step 2 of 5"
  
Libraries: Reactour, Intro.js, or custom
```

#### Tooltips on First Interaction
```
Show helpful tooltip on first time user:
  - Hovers favorite star: "Set as favorite"
  - Clicks game: "View game details"
  - Scrolls carousel: "Swipe or use arrows to browse"

Dismiss: After first interaction or after 3s
Save: localStorage flag per tooltip
```

### 7.2 Help Panel

#### Help Button
```
Location: Header (next to settings)
Icon: (?) question mark in circle
Label: "Help"
Keyboard shortcut: Cmd/Ctrl + /
```

#### Help Panel Content
```
Display: Slide-in panel from right (or modal)
Sections:
  1. Quick Start Guide
     - How to set favorite team
     - How to view game details
     - How to refresh data
  
  2. Keyboard Shortcuts
     - List all shortcuts
     - Searchable
  
  3. FAQ
     - Common questions
     - Expandable sections
  
  4. Resources
     - GitHub repository link
     - Report an issue link
     - Data source: ESPN link
  
  5. About
     - Version number
     - Credits
     - License (MIT)

Search: Search bar at top of help panel
```

### 7.3 Contextual Help

#### Inline Help Text
```
Location: Below unclear UI elements
Content: Gray text, brief explanation
Example: "Your favorite team's next game will appear here"
```

#### Help Icons
```
Icon: (?) next to complex features
Trigger: Hover or click
Display: Tooltip or popover
Content: Detailed explanation
```

### 7.4 Empty State Guidance
(Covered in section 1.3.2, includes guidance)

### 7.5 Error State Guidance
(Covered in section 2.3, includes next steps)

### 7.6 Keyboard Shortcuts Overlay

#### Shortcut Help
```
Trigger: Press "?" key
Display: Modal overlay
Content: Table of all keyboard shortcuts
Categories:
  - Navigation
  - Actions
  - General
Dismiss: Escape or click outside
```

### 7.7 Tooltips

#### Implementation
```
Component: Tooltip wrapper
Props:
  - content: string | React.ReactNode
  - position: 'top' | 'bottom' | 'left' | 'right' | 'auto'
  - delay: number (default 300ms)
  - maxWidth: number
  
Behavior:
  - Show on hover (after delay)
  - Show on focus (keyboard)
  - Hide on mouse leave
  - Hide on blur
  
Accessibility:
  - aria-describedby
  - role="tooltip"
  - Keyboard accessible
```

### 7.8 Changelog / What's New

#### Feature Announcements
```
Trigger: After app update (version change)
Display: Modal with new features
Content:
  - Version number
  - "What's New in v2.0.0"
  - List of new features (with icons)
  - "Learn More" links
Dismissible: "Got it" button
Preference: Save last seen version
```

---

## 8. SETTINGS PANEL & CUSTOMIZATION

### 8.1 Settings Button

#### Location
```
Position: Header, top-right (near refresh)
Icon: Gear/cog icon
Label: "Settings"
Keyboard shortcut: Cmd/Ctrl + ,
```

### 8.2 Settings Panel Layout

#### Display
```
Type: Slide-in panel from right (400px width)
or: Modal dialog (on small screens)
Background: Surface color (themed)
Header: "Settings" title + Close button (X)
Footer: "Save" and "Cancel" buttons (optional if auto-save)
Content: Scrollable sections
```

#### Sections
```
1. Appearance
2. Data & Sync
3. Notifications (future)
4. Accessibility
5. About
```

### 8.3 Appearance Settings

#### Theme Selection
```
Label: "Theme"
Options:
  - Dark (default)
  - Light
  - Auto (system preference) [future]
Control: Radio buttons or toggle switch
Preview: Live preview while selecting
```

#### Color Scheme (Future Enhancement)
```
Label: "Accent Color"
Options: Color picker or predefined palette
Apply: Change primary color throughout app
Accessibility: Ensure contrast maintained
```

#### Layout Density
```
Label: "Display Density"
Options:
  - Compact: Reduced spacing
  - Comfortable: Default spacing
  - Spacious: Increased spacing
Control: Radio buttons
Apply: Adjust spacing CSS variables
```

#### Font Size
```
Label: "Font Size"
Options:
  - Small (14px base)
  - Medium (16px base, default)
  - Large (18px base)
  - Extra Large (20px base)
Control: Slider or dropdown
Apply: Scale all typography
Accessibility: Helpful for vision impairments
```

### 8.4 Data & Sync Settings

#### Auto-Refresh
```
Label: "Auto-Refresh"
Description: "Automatically sync data in the background"
Control: Toggle switch
Options: On (default) / Off
Interval: 5 minutes (not user-configurable in v2)
```

#### Data Usage
```
Label: "Limit Data Usage"
Description: "Reduce API calls (use cached data when possible)"
Control: Toggle switch
Effect: Increase cache lifetime, reduce sync frequency
```

#### Cache Management
```
Label: "Cache"
Display: "Last synced: X minutes ago"
Display: "Cache size: X MB"
Actions:
  - "Clear Cache" button (destructive)
  - "Sync Now" button
Confirmation: "Are you sure?" dialog before clear
```

### 8.5 Accessibility Settings

#### Reduce Motion
```
Label: "Reduce Motion"
Description: "Minimize animations and transitions"
Control: Toggle switch
Default: Detect from system (prefers-reduced-motion)
Override: Allow user to override system setting
```

#### Keyboard Navigation
```
Label: "Show Focus Indicators"
Description: "Enhanced focus rings for keyboard navigation"
Control: Toggle switch
Default: On
Effect: More prominent focus styles
```

#### Screen Reader
```
Label: "Screen Reader Optimizations"
Description: "Enhanced announcements and labels"
Control: Toggle switch
Default: Auto-detect screen reader
Effect: More verbose ARIA labels
```

### 8.6 Notifications (Future)

#### Desktop Notifications
```
Label: "Desktop Notifications"
Description: "Show notifications for game events"
Control: Toggle switch
Permission: Request browser/OS permission
Events:
  - Favorite team game starting (15 min before)
  - Score updates (live games)
  - Final scores
```

#### Notification Frequency
```
Label: "Update Frequency"
Options:
  - Every score change (live games)
  - Quarter/Half (periodic)
  - Final score only
Control: Radio buttons
```

### 8.7 About Section

#### App Information
```
Display:
  - App name: "NFL Dashboard"
  - Version: "v2.0.0"
  - Last updated: Date
  - Data source: "ESPN API"
  
Links:
  - "View on GitHub" (external link icon)
  - "Report an Issue" (opens GitHub issues)
  - "Check for Updates" (button)
  - "Privacy Policy" (future)
  - "Terms of Service" (future)
  
Credits:
  - "Built with Electron, React, and TypeScript"
  - "Data provided by ESPN"
  
License:
  - "MIT License"
  - Link to LICENSE file
```

#### Diagnostic Information
```
Toggle: "Show Diagnostic Info" (collapsed by default)
Display:
  - Electron version
  - Chrome version
  - Node.js version
  - Platform: OS and version
  - Database path
  - Log file location
  - Last sync timestamp
  - Error count (last session)
  
Actions:
  - "Copy to Clipboard" button (for bug reports)
  - "Open Log Folder" button (opens in file manager)
```

### 8.8 Settings Persistence

#### Storage
```
Location: localStorage (JSON)
Key: 'nfl-dashboard-settings'
Structure: {
  theme: 'dark' | 'light',
  fontSize: 'small' | 'medium' | 'large' | 'xlarge',
  density: 'compact' | 'comfortable' | 'spacious',
  autoRefresh: boolean,
  limitDataUsage: boolean,
  reduceMotion: boolean,
  version: string,
}

Electron Alternative: Store in app user data directory (JSON file)
```

#### Import/Export Settings
```
Feature: Allow users to export/import settings
Format: JSON file
Actions:
  - "Export Settings" (download JSON)
  - "Import Settings" (upload JSON)
Use case: Transfer settings between devices
```

### 8.9 Settings Validation

#### Constraints
- Theme: Must be valid theme name
- Font size: Must be valid size option
- All toggles: Must be boolean
- Validate on load (fallback to defaults if invalid)

#### Migrations
```
Version upgrades:
  - If settings version < app version: Migrate settings
  - Add new defaults for new settings
  - Remove obsolete settings
  - Log migration in console
```

---

## 9. IMPLEMENTATION PRIORITY LIST

### Phase 1: Foundation (Week 1-2) - High Priority

#### 1.1 Design System & Theme Infrastructure
- **Effort**: 16-24 hours
- **Tasks**:
  - Define theme types and structure (4h)
  - Create ThemeProvider and context (4h)
  - Implement CSS variables system (4h)
  - Create dark theme values (2h)
  - Create light theme values (2h)
  - Build theme toggle component (2h)
  - Test theme switching (2h)
- **Deliverable**: Fully functional theme system

#### 1.2 Toast Notification System
- **Effort**: 8-12 hours
- **Tasks**:
  - Choose/install library (1h)
  - Create Toast component (3h)
  - Create ToastProvider (2h)
  - Implement useToast hook (2h)
  - Style toasts for both themes (2h)
  - Add accessibility features (2h)
- **Deliverable**: Working toast system

#### 1.3 Error Handling Foundation
- **Effort**: 12-16 hours
- **Tasks**:
  - Create error boundary component (3h)
  - Replace console.error with toasts (4h)
  - Implement retry logic for API calls (3h)
  - Add error logging (electron-log) (2h)
  - Create error state components (4h)
- **Deliverable**: Comprehensive error handling

### Phase 2: Loading & Feedback (Week 2-3) - High Priority

#### 2.1 Skeleton Screens
- **Effort**: 12-16 hours
- **Tasks**:
  - Create Skeleton base component (2h)
  - Dashboard cards skeleton (2h)
  - Team carousel skeleton (2h)
  - Schedule list skeleton (3h)
  - Game details skeleton (3h)
  - Implement shimmer animation (2h)
  - Test loading states (2h)
- **Deliverable**: Skeleton screens for all major components

#### 2.2 Enhanced Loading States
- **Effort**: 8-12 hours
- **Tasks**:
  - Create ProgressBar component (2h)
  - Implement staged loading (4h)
  - Add loading spinner variants (2h)
  - Improve refresh button feedback (2h)
  - Test loading flows (2h)
- **Deliverable**: Polished loading experience

#### 2.3 Empty States
- **Effort**: 6-8 hours
- **Tasks**:
  - Design empty state layouts (2h)
  - Create EmptyState component (2h)
  - Implement for each scenario (3h)
  - Add illustrations/icons (1h)
- **Deliverable**: User-friendly empty states

### Phase 3: Accessibility (Week 3-4) - High Priority

#### 3.1 Keyboard Navigation
- **Effort**: 16-20 hours
- **Tasks**:
  - Audit current tab order (2h)
  - Fix focus management (4h)
  - Implement keyboard shortcuts (4h)
  - Add skip links (2h)
  - Create keyboard help overlay (3h)
  - Test with keyboard only (3h)
  - Fix issues (2h)
- **Deliverable**: Full keyboard accessibility

#### 3.2 ARIA & Screen Reader Support
- **Effort**: 16-24 hours
- **Tasks**:
  - Add ARIA landmarks (3h)
  - Add ARIA labels to all interactive elements (4h)
  - Implement live regions (3h)
  - Add sr-only text where needed (3h)
  - Test with NVDA (4h)
  - Test with VoiceOver (4h)
  - Fix issues (3h)
- **Deliverable**: Screen reader accessible app

#### 3.3 Color Contrast & Visual Accessibility
- **Effort**: 8-12 hours
- **Tasks**:
  - Audit all color combinations (3h)
  - Fix contrast issues (4h)
  - Add non-color indicators (2h)
  - Test at 200% zoom (2h)
  - Implement reduced motion (1h)
- **Deliverable**: WCAG AA compliant visuals

### Phase 4: Offline & Resilience (Week 4-5) - Medium Priority

#### 4.1 Offline Detection
- **Effort**: 6-8 hours
- **Tasks**:
  - Create OfflineProvider (2h)
  - Implement useOnline hook (2h)
  - Add online/offline event listeners (2h)
  - Test offline scenarios (2h)
- **Deliverable**: Offline detection system

#### 4.2 Offline UI
- **Effort**: 8-12 hours
- **Tasks**:
  - Create offline banner (2h)
  - Add connection status indicator (2h)
  - Update data freshness display (2h)
  - Disable features gracefully (3h)
  - Test offline experience (3h)
- **Deliverable**: User-friendly offline mode

#### 4.3 Offline Queue
- **Effort**: 8-12 hours
- **Tasks**:
  - Implement queue storage (3h)
  - Create queue processing logic (3h)
  - Add queue UI indicators (2h)
  - Test queue functionality (2h)
  - Handle edge cases (2h)
- **Deliverable**: Functional offline queue

### Phase 5: Micro-interactions & Polish (Week 5-6) - Medium Priority

#### 5.1 Transitions & Animations
- **Effort**: 12-16 hours
- **Tasks**:
  - Define animation library (2h)
  - Implement page transitions (4h)
  - Add component transitions (4h)
  - Implement micro-interactions (4h)
  - Test animations (2h)
- **Deliverable**: Smooth, polished animations

#### 5.2 Hover & Focus States
- **Effort**: 8-12 hours
- **Tasks**:
  - Audit all interactive elements (2h)
  - Implement hover effects (4h)
  - Implement focus styles (4h)
  - Test interactions (2h)
- **Deliverable**: Consistent interaction feedback

### Phase 6: Component Library (Week 6-7) - Medium Priority

#### 6.1 Base Components
- **Effort**: 16-24 hours
- **Tasks**:
  - Button component (3h)
  - Card component (3h)
  - Badge component (2h)
  - Modal component (4h)
  - Tooltip component (3h)
  - Input components (4h)
  - Icon system setup (3h)
  - Component documentation (2h)
- **Deliverable**: Reusable component library

#### 6.2 Refactor Existing Components
- **Effort**: 12-16 hours
- **Tasks**:
  - Refactor Dashboard to use new components (4h)
  - Refactor GameSchedule (3h)
  - Refactor TeamCarousel (3h)
  - Refactor GameDetailsPane (3h)
  - Test all refactored components (3h)
- **Deliverable**: Consistent component usage

### Phase 7: Responsive Design (Week 7-8) - Medium Priority

#### 7.1 Mobile Layouts
- **Effort**: 16-24 hours
- **Tasks**:
  - Define breakpoints (2h)
  - Implement mobile dashboard (4h)
  - Implement mobile schedule (4h)
  - Implement mobile carousel (3h)
  - Implement mobile details pane (4h)
  - Add touch gestures (4h)
  - Test on mobile devices (3h)
- **Deliverable**: Full mobile support

#### 7.2 Tablet Layouts
- **Effort**: 8-12 hours
- **Tasks**:
  - Implement tablet layouts (6h)
  - Test on tablets (3h)
  - Adjust spacing and sizing (3h)
- **Deliverable**: Tablet-optimized layouts

#### 7.3 Responsive Typography & Spacing
- **Effort**: 6-8 hours
- **Tasks**:
  - Define responsive scales (2h)
  - Implement responsive typography (2h)
  - Implement responsive spacing (2h)
  - Test across breakpoints (2h)
- **Deliverable**: Responsive design system

### Phase 8: User Onboarding & Help (Week 8-9) - Low Priority

#### 8.1 Welcome & Tour
- **Effort**: 12-16 hours
- **Tasks**:
  - Design welcome screen (2h)
  - Implement welcome modal (3h)
  - Choose/integrate tour library (2h)
  - Create product tour (5h)
  - Test onboarding flow (2h)
  - Handle first-time flags (2h)
- **Deliverable**: User onboarding experience

#### 8.2 Help Panel
- **Effort**: 12-16 hours
- **Tasks**:
  - Design help panel (2h)
  - Implement help panel component (4h)
  - Write help content (3h)
  - Implement search (2h)
  - Add help resources (2h)
  - Test help system (3h)
- **Deliverable**: Comprehensive help system

#### 8.3 Tooltips & Contextual Help
- **Effort**: 6-8 hours
- **Tasks**:
  - Create Tooltip component (3h)
  - Add tooltips throughout app (3h)
  - Test tooltip accessibility (2h)
- **Deliverable**: Contextual help tooltips

### Phase 9: Settings Panel (Week 9-10) - Low Priority

#### 9.1 Settings Infrastructure
- **Effort**: 8-12 hours
- **Tasks**:
  - Create settings storage (2h)
  - Create settings context (3h)
  - Implement settings panel UI (4h)
  - Test settings persistence (3h)
- **Deliverable**: Settings system foundation

#### 9.2 Settings Options
- **Effort**: 12-16 hours
- **Tasks**:
  - Implement appearance settings (4h)
  - Implement data settings (3h)
  - Implement accessibility settings (3h)
  - Implement about section (2h)
  - Add diagnostic info (2h)
  - Test all settings (2h)
- **Deliverable**: Full settings panel

### Phase 10: Testing & Polish (Week 10-11) - Ongoing

#### 10.1 Accessibility Testing
- **Effort**: 16-24 hours
- **Tasks**:
  - Automated testing (axe, Lighthouse) (4h)
  - Manual keyboard testing (4h)
  - Screen reader testing (8h)
  - Fix issues (6h)
  - Retest (2h)
- **Deliverable**: WCAG AA compliance

#### 10.2 Cross-Browser Testing
- **Effort**: 8-12 hours
- **Tasks**:
  - Test on Chrome (2h)
  - Test on Firefox (2h)
  - Test on Safari (2h)
  - Test on Edge (2h)
  - Fix browser-specific issues (2h)
- **Deliverable**: Cross-browser compatibility

#### 10.3 Responsive Testing
- **Effort**: 8-12 hours
- **Tasks**:
  - Test all breakpoints (4h)
  - Test on real devices (4h)
  - Fix responsive issues (4h)
- **Deliverable**: Responsive on all devices

#### 10.4 Performance Optimization
- **Effort**: 8-12 hours
- **Tasks**:
  - Audit performance (2h)
  - Optimize bundle size (2h)
  - Optimize images (2h)
  - Optimize animations (2h)
  - Implement lazy loading (2h)
  - Test performance (2h)
- **Deliverable**: Fast, optimized app

#### 10.5 Final Polish
- **Effort**: 8-12 hours
- **Tasks**:
  - Visual consistency pass (3h)
  - UX consistency pass (3h)
  - Edge case testing (3h)
  - Bug fixes (3h)
- **Deliverable**: Polished, production-ready app

---

## 10. ESTIMATED COMPLEXITY & TIMELINE

### Total Effort Estimate

#### By Phase
| Phase | Priority | Estimated Hours | Duration (Weeks) |
|-------|----------|----------------|------------------|
| 1. Foundation | High | 36-52 | 1-2 |
| 2. Loading & Feedback | High | 26-36 | 1-2 |
| 3. Accessibility | High | 40-56 | 2-3 |
| 4. Offline & Resilience | Medium | 22-32 | 1-2 |
| 5. Micro-interactions | Medium | 20-28 | 1-2 |
| 6. Component Library | Medium | 28-40 | 1-2 |
| 7. Responsive Design | Medium | 30-44 | 2-3 |
| 8. Onboarding & Help | Low | 30-40 | 1-2 |
| 9. Settings Panel | Low | 20-28 | 1-2 |
| 10. Testing & Polish | Ongoing | 48-72 | 2-3 |
| **TOTAL** | | **300-428 hours** | **13-23 weeks** |

### Realistic Timeline

#### Solo Developer (20 hours/week)
- **Minimum**: 15 weeks (3.75 months)
- **Expected**: 18-20 weeks (4.5-5 months)
- **With buffer**: 22-24 weeks (5.5-6 months)

#### Solo Developer (40 hours/week - Full Time)
- **Minimum**: 7.5 weeks (~2 months)
- **Expected**: 9-11 weeks (2.25-2.75 months)
- **With buffer**: 12-14 weeks (3-3.5 months)

#### Team of 2 Developers (40 hours/week each)
- **Minimum**: 4 weeks (1 month)
- **Expected**: 5-6 weeks (1.25-1.5 months)
- **With buffer**: 7-8 weeks (1.75-2 months)

### Complexity Ratings

#### Simple (1-4 hours each)
- Theme toggle component
- Toast notifications (if using library)
- Skeleton component base
- Empty state component
- Badge component
- Button component variations
- Basic ARIA labels
- Skip links

#### Medium (4-12 hours each)
- Theme infrastructure (ThemeProvider, CSS variables)
- Error boundary
- Toast system (custom implementation)
- Skeleton screens for each view
- Progress bar component
- Modal component
- Tooltip component
- Offline detection
- Offline banner
- Settings storage
- Keyboard shortcuts implementation
- Help panel structure

#### Complex (12-24+ hours each)
- Complete accessibility compliance (keyboard + ARIA)
- Screen reader testing and fixes
- Mobile responsive design (all components)
- Product tour system
- Offline queue system
- Component library (all components)
- Comprehensive error handling
- Animation system
- Settings panel (all sections)
- Full responsive design (all breakpoints)

### Risk Factors

#### Technical Challenges
- **Accessibility compliance**: Time-consuming testing and fixes
- **Screen reader testing**: Requires specialized knowledge
- **Touch gesture implementation**: Complex on desktop app
- **Offline queue**: Edge cases and error handling
- **Animation performance**: Must maintain 60fps

#### Scope Creep Risks
- Theme customization (accent colors, etc.)
- Advanced settings options
- Notification system
- Advanced offline features
- Additional onboarding features

### Recommended Approach

#### MVP+ (Minimum Viable Product Plus)
**Focus on High Priority items only**
- **Duration**: 8-12 weeks (solo, 20h/week)
- **Includes**:
  - Theme system (dark/light)
  - Toast notifications
  - Error handling
  - Loading states
  - Basic accessibility (keyboard, ARIA, contrast)
  - Offline detection
  - Basic responsive design
- **Deferred**:
  - Advanced animations
  - Product tour
  - Help panel
  - Settings panel
  - Advanced offline features

#### Full VERSION 2 (As Specified)
**All features from this document**
- **Duration**: 18-24 weeks (solo, 20h/week)
- **Includes**: Everything specified in this document
- **Recommended**: For production-ready, polished application

#### Phased Rollout
**Release incrementally**
- **v2.0**: Foundation + Loading + Basic Accessibility (8 weeks)
- **v2.1**: Full Accessibility + Offline (4 weeks)
- **v2.2**: Responsive + Polish (4 weeks)
- **v2.3**: Onboarding + Settings (4 weeks)
- **Total**: 20 weeks, but with usable releases throughout

---

## 11. DEPENDENCIES & LIBRARIES

### New Dependencies to Add

#### Core UI
```json
{
  "react-hot-toast": "^2.4.1",         // Toast notifications
  "framer-motion": "^10.16.16",       // Animations (optional)
  "react-focus-lock": "^2.9.6",       // Focus trapping for modals
  "react-aria": "^3.31.0",            // Accessible components (optional)
}
```

#### Accessibility
```json
{
  "focus-visible": "^5.2.0",          // :focus-visible polyfill
}
```

#### Onboarding (Optional)
```json
{
  "reactour": "^1.19.0",              // Product tour
  // OR
  "intro.js-react": "^1.0.0",         // Alternative tour library
}
```

#### Development Tools
```json
{
  "@axe-core/react": "^4.8.4",        // Accessibility testing
  "eslint-plugin-jsx-a11y": "^6.8.0", // Accessibility linting
}
```

#### Icons
```json
{
  "react-icons": "^5.0.1",            // Icon library
  // OR
  "lucide-react": "^0.294.0",         // Alternative icons
  // OR
  "@heroicons/react": "^2.1.1",       // Heroicons (Tailwind)
}
```

#### Logging
```json
{
  "electron-log": "^5.0.1",           // Better logging for Electron
}
```

### Current Dependencies (Keep)
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "better-sqlite3": "^9.2.2",
  "axios": "^1.6.5",
  "date-fns": "^3.0.6",
  "electron": "^28.1.4"
}
```

### Library Selection Notes

#### Toast Notifications
- **Recommended**: react-hot-toast
- **Why**: Lightweight, accessible, customizable, good defaults
- **Alternative**: Custom implementation (more control, more work)

#### Animations
- **Recommended**: CSS-only animations (no library)
- **Why**: Best performance, no dependencies
- **Alternative**: framer-motion (if complex animations needed)

#### Icons
- **Recommended**: react-icons
- **Why**: Wide selection, tree-shakeable, popular
- **Alternative**: lucide-react (more consistent design)

#### Product Tour
- **Recommended**: Custom implementation or reactour
- **Why**: More control, simpler
- **Alternative**: intro.js (more features, heavier)

---

## 12. FUTURE ENHANCEMENTS (POST-V2)

### Not Included in VERSION 2, but Consider for VERSION 3+

#### Advanced Features
- **Search & Filtering**: Search games, players, teams
- **Custom Views**: User-configurable dashboard layouts
- **Multiple Favorites**: Track multiple teams
- **Player Tracking**: Follow specific players
- **Notifications**: Desktop/push notifications for game events
- **Sharing**: Share game details, screenshots
- **Export**: Export schedules to calendar (ICS)
- **Statistics Dashboard**: Advanced analytics and charts

#### Data Features
- **Historical Data**: Past seasons, historical stats
- **Predictions**: Win probability, predictions
- **News Integration**: News articles from ESPN or other sources
- **Video Integration**: Highlight clips (if API available)
- **Social Integration**: Twitter integration for discussions

#### UI/UX Enhancements
- **Custom Themes**: User-created themes, team color themes
- **Widget Mode**: Mini dashboard window
- **Picture-in-Picture**: Small always-on-top window
- **Multi-Language**: Internationalization (i18n)
- **Voice Control**: Voice commands (accessibility)

#### Technical Improvements
- **Service Worker**: Better caching for web version
- **Background Sync**: Sync data even when app closed
- **Cloud Sync**: Sync settings across devices
- **Auto-Updates**: Built-in update mechanism
- **Error Tracking**: Sentry or similar service integration
- **Analytics**: Usage analytics (privacy-conscious)

---

## 13. SUCCESS METRICS

### How to Measure VERSION 2 Success

#### Accessibility
- [ ] WCAG 2.1 Level AA compliance (100% of applicable criteria)
- [ ] Lighthouse Accessibility score: 95+
- [ ] axe DevTools: 0 violations
- [ ] All interactive elements keyboard accessible
- [ ] Screen reader navigable (tested with 2+ screen readers)

#### User Experience
- [ ] No unhandled errors in production
- [ ] All operations provide user feedback (toast or UI change)
- [ ] All loading states have skeletons or indicators
- [ ] All empty states have helpful guidance
- [ ] All error states have recovery actions
- [ ] App usable in offline mode (with cached data)

#### Performance
- [ ] Initial load time: < 3 seconds
- [ ] Theme switch: < 500ms
- [ ] Component transitions: < 300ms
- [ ] Animations: Smooth 60fps
- [ ] Bundle size: < 5MB (production build)

#### Design Consistency
- [ ] All components use design system
- [ ] Consistent spacing throughout
- [ ] Consistent typography
- [ ] Consistent color usage
- [ ] Consistent interaction patterns

#### Responsive Design
- [ ] Functional on mobile (375px+ width)
- [ ] Functional on tablets
- [ ] Functional on desktop (all sizes)
- [ ] No horizontal scrolling (except carousels)
- [ ] Touch targets: 44x44px minimum

#### Code Quality
- [ ] TypeScript: No type errors
- [ ] ESLint: No linting errors
- [ ] Accessibility linting: No a11y errors
- [ ] All components documented
- [ ] Reusable component library created

---

## 14. NOTES & CONSIDERATIONS

### Design Philosophy
- **User-First**: Every decision prioritizes user experience
- **Accessible by Default**: Accessibility is not an afterthought
- **Progressive Enhancement**: Core features work without JS (N/A for Electron, but keep in mind for future web version)
- **Performance Matters**: Fast load times, smooth animations
- **Fail Gracefully**: Always have a fallback

### Development Principles
- **Mobile-First**: Design for mobile, scale up
- **Component-Based**: Build reusable, composable components
- **Type-Safe**: Leverage TypeScript for reliability
- **Test as You Go**: Don't defer testing to the end
- **Document Everything**: Future you will thank present you

### Accessibility Commitment
- Accessibility is not optional
- Test with real assistive technologies
- Don't rely solely on automated tools
- Consider diverse user needs
- Prioritize keyboard navigation

### Performance Targets
- Initial load: < 3 seconds
- Time to interactive: < 5 seconds
- Animation frame rate: 60fps
- Bundle size: < 5MB gzipped

### Browser Support
- Electron: Latest stable
- Chrome: Last 2 versions (for web version)
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Edge: Last 2 versions

### Known Limitations
- ESPN API rate limits (gracefully handle)
- No real-time WebSocket data (polling only)
- Electron app size (cannot reduce significantly)
- SQLite limitations (single writer)

---

## 15. APPROVAL & SIGN-OFF

### Specification Status
- **Status**: Draft / Ready for Review / Approved
- **Version**: 1.0
- **Last Updated**: 2025-11-18
- **Next Review**: [Date]

### Stakeholders
- **Product Owner**: [Name]
- **Lead Developer**: [Name]
- **Designer**: [Name] (if applicable)
- **Accessibility Specialist**: [Name] (if applicable)

### Approval Checklist
- [ ] Requirements complete and clear
- [ ] Technical approach validated
- [ ] Timeline realistic
- [ ] Dependencies identified
- [ ] Risks assessed
- [ ] Success metrics defined
- [ ] Budget approved (if commercial project)

---

## APPENDICES

### Appendix A: WCAG 2.1 Level AA Checklist
[Link to full WCAG checklist - to be created separately]

### Appendix B: Color Palette
[Detailed color palette with contrast ratios - to be created separately]

### Appendix C: Component API Documentation
[Full component API docs - to be created after implementation]

### Appendix D: Keyboard Shortcuts Reference
[Complete keyboard shortcut list - to be finalized during implementation]

### Appendix E: Error Message Catalog
[Complete list of error messages - to be created during implementation]

---

**END OF SPECIFICATION**

---

## DOCUMENT METADATA

**Document Type**: Product Specification  
**Document ID**: V2-ENHANCED-UI-UX-001  
**Version**: 1.0  
**Created**: 2025-11-18  
**Last Updated**: 2025-11-18  
**Status**: Draft  
**Classification**: Internal  
**Distribution**: Development Team  

**Change Log**:
- v1.0 (2025-11-18): Initial specification created

**Related Documents**:
- VERSION-1-BASE-SPEC.md (to be created)
- VERSION-3-ADVANCED-FEATURES-SPEC.md (future)
- API-DOCUMENTATION.md (to be created)
- DEPLOYMENT-GUIDE.md (existing)
