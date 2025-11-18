# VERSION 2: VISUAL DESIGN GUIDE

**Visual mockup descriptions and UI layouts for VERSION 2 Enhanced UI/UX**

---

## TABLE OF CONTENTS

1. [Color Palettes](#color-palettes)
2. [Theme Comparison](#theme-comparison)
3. [Component States](#component-states)
4. [Loading States](#loading-states)
5. [Error States](#error-states)
6. [Empty States](#empty-states)
7. [Toast Notifications](#toast-notifications)
8. [Modal Dialogs](#modal-dialogs)
9. [Settings Panel](#settings-panel)
10. [Accessibility Features](#accessibility-features)
11. [Responsive Layouts](#responsive-layouts)

---

## COLOR PALETTES

### Dark Theme (Current + Enhanced)

```
┌─────────────────────────────────────────────────┐
│ Background Colors                               │
├─────────────────────────────────────────────────┤
│ background     #0a0e27  ████████  (Deep Blue)  │
│ surface        #1a1f3a  ████████  (Dark Blue)  │
│ surfaceHover   #242948  ████████  (Med Blue)   │
├─────────────────────────────────────────────────┤
│ Primary & Accent Colors                         │
├─────────────────────────────────────────────────┤
│ primary        #4A9EFF  ████████  (Bright Blue)│
│ primaryHover   #60AEFF  ████████  (Light Blue) │
│ success        #10B981  ████████  (Green)      │
│ error          #EF4444  ████████  (Red)        │
│ warning        #F59E0B  ████████  (Orange)     │
│ info           #3B82F6  ████████  (Blue)       │
├─────────────────────────────────────────────────┤
│ Text Colors                                     │
├─────────────────────────────────────────────────┤
│ textPrimary    #FFFFFF  ████████  (White)      │
│ textSecondary  #B4B8C5  ████████  (Light Gray) │
│ textDisabled   #6B7280  ████████  (Gray)       │
├─────────────────────────────────────────────────┤
│ Borders                                         │
├─────────────────────────────────────────────────┤
│ border         #2D3348  ████████  (Dark Gray)  │
│ borderHover    #3D4358  ████████  (Med Gray)   │
└─────────────────────────────────────────────────┘

Contrast Ratios (on background):
  textPrimary: 21:1 (AAA)
  textSecondary: 8.2:1 (AA+)
  primary: 6.5:1 (AA)
  success: 5.8:1 (AA)
```

### Light Theme (New)

```
┌─────────────────────────────────────────────────┐
│ Background Colors                               │
├─────────────────────────────────────────────────┤
│ background     #F9FAFB  ████████  (Off-White)  │
│ surface        #FFFFFF  ████████  (White)      │
│ surfaceHover   #F3F4F6  ████████  (Light Gray) │
├─────────────────────────────────────────────────┤
│ Primary & Accent Colors                         │
├─────────────────────────────────────────────────┤
│ primary        #2563EB  ████████  (Blue)       │
│ primaryHover   #3B82F6  ████████  (Light Blue) │
│ success        #059669  ████████  (Green)      │
│ error          #DC2626  ████████  (Red)        │
│ warning        #D97706  ████████  (Orange)     │
│ info           #2563EB  ████████  (Blue)       │
├─────────────────────────────────────────────────┤
│ Text Colors                                     │
├─────────────────────────────────────────────────┤
│ textPrimary    #111827  ████████  (Near Black) │
│ textSecondary  #6B7280  ████████  (Gray)       │
│ textDisabled   #9CA3AF  ████████  (Light Gray) │
├─────────────────────────────────────────────────┤
│ Borders                                         │
├─────────────────────────────────────────────────┤
│ border         #E5E7EB  ████████  (Light Gray) │
│ borderHover    #D1D5DB  ████████  (Med Gray)   │
└─────────────────────────────────────────────────┘

Contrast Ratios (on background):
  textPrimary: 15.8:1 (AAA)
  textSecondary: 4.7:1 (AA)
  primary: 7.2:1 (AA)
  success: 6.1:1 (AA)
```

---

## THEME COMPARISON

### Dashboard Header - Dark Theme
```
┌─────────────────────────────────────────────────────────────────┐
│  🏈 NFL Dashboard        [Select Favorite Team ▼] [🌙] [↻ Refresh]│
└─────────────────────────────────────────────────────────────────┘
  ↑ Background: #1a1f3a (dark blue)
  ↑ Text: #FFFFFF (white)
  ↑ Button: #4A9EFF (blue) on hover
```

### Dashboard Header - Light Theme
```
┌─────────────────────────────────────────────────────────────────┐
│  🏈 NFL Dashboard        [Select Favorite Team ▼] [☀️] [↻ Refresh]│
└─────────────────────────────────────────────────────────────────┘
  ↑ Background: #FFFFFF (white)
  ↑ Text: #111827 (near black)
  ↑ Button: #2563EB (blue) on hover
```

### Theme Toggle Animation
```
DARK MODE                  →  TRANSITION (400ms)  →  LIGHT MODE

[🌙]───────────────────────────────────────────────────────►[☀️]
 Blue background              Fade & color shift          White background
 White text                   Smooth gradient             Dark text
 Dark surfaces                All colors transition       Light surfaces
```

---

## COMPONENT STATES

### Button States

#### Primary Button - Dark Theme
```
┌──────────────────────────────────────────────────────┐
│ DEFAULT STATE                                        │
│ ┌──────────────┐  Background: #4A9EFF               │
│ │   Refresh    │  Text: #FFFFFF                     │
│ └──────────────┘  Border-radius: 8px                │
│                   Padding: 12px 24px                 │
├──────────────────────────────────────────────────────┤
│ HOVER STATE                                          │
│ ┌──────────────┐  Background: #60AEFF (lighter)     │
│ │   Refresh    │  Transform: scale(1.02)            │
│ └──────────────┘  Transition: 150ms ease            │
│                   Cursor: pointer                    │
├──────────────────────────────────────────────────────┤
│ ACTIVE/CLICK STATE                                   │
│ ┌──────────────┐  Background: #3A8EEF (darker)      │
│ │   Refresh    │  Transform: scale(0.98)            │
│ └──────────────┘  Ripple effect from click point    │
│                   Duration: 50ms                     │
├──────────────────────────────────────────────────────┤
│ LOADING STATE                                        │
│ ┌──────────────┐  Background: #4A9EFF               │
│ │ ⟳ Syncing... │  Icon: Rotating spinner            │
│ └──────────────┘  Disabled: true                    │
│                   Cursor: wait                       │
├──────────────────────────────────────────────────────┤
│ DISABLED STATE                                       │
│ ┌──────────────┐  Background: #4A9EFF               │
│ │   Refresh    │  Opacity: 0.5                      │
│ └──────────────┘  Cursor: not-allowed               │
│                   No hover effects                   │
├──────────────────────────────────────────────────────┤
│ FOCUS STATE (Keyboard)                               │
│ ┏━━━━━━━━━━━━━━┓  Outline: 2px solid #4A9EFF        │
│ ┃   Refresh    ┃  Outline-offset: 2px               │
│ ┗━━━━━━━━━━━━━━┛  Visible focus ring                │
│                   Never remove outline               │
└──────────────────────────────────────────────────────┘
```

### Card States

#### Game Card - Interactive States
```
┌───────────────────────────────────────────────────────┐
│ DEFAULT STATE                                         │
│ ┌─────────────────────────┐                          │
│ │ Week 5                  │  Background: #1a1f3a     │
│ │ Sun, Dec 25             │  Border: 1px #2D3348     │
│ │ 🏈 DAL @ PHI            │  Shadow: sm              │
│ │ 4:30 PM                 │  Padding: 16px           │
│ └─────────────────────────┘                          │
├───────────────────────────────────────────────────────┤
│ HOVER STATE                                           │
│ ┌─────────────────────────┐                          │
│ │ Week 5                  │  Transform: translateY(-2px)│
│ │ Sun, Dec 25             │  Shadow: md (increased)  │
│ │ 🏈 DAL @ PHI            │  Border: glow effect     │
│ │ 4:30 PM                 │  Background: lighten 5%  │
│ └─────────────────────────┘  Transition: 200ms       │
├───────────────────────────────────────────────────────┤
│ SELECTED STATE                                        │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━┓                          │
│ ┃ Week 5                  ┃  Border-left: 3px blue   │
│ ┃ Sun, Dec 25             ┃  Background: highlight   │
│ ┃ 🏈 DAL @ PHI            ┃  Shadow: lg              │
│ ┃ 4:30 PM                 ┃  Persistent state        │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━┛                          │
├───────────────────────────────────────────────────────┤
│ FOCUS STATE (Keyboard)                                │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━┓                          │
│ ┃ Week 5                  ┃  Outline: 2px solid      │
│ ┃ Sun, Dec 25             ┃  Outline-offset: 2px     │
│ ┃ 🏈 DAL @ PHI            ┃  Visible focus ring      │
│ ┃ 4:30 PM                 ┃  Tab-accessible          │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━┛                          │
└───────────────────────────────────────────────────────┘
```

---

## LOADING STATES

### Initial App Load - Staged Loading

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                         🏈                                  │
│                    NFL DASHBOARD                            │
│                                                             │
│              ┌──────────────────────────┐                  │
│              │████████░░░░░░░░░░░░░░░░│  65%             │
│              └──────────────────────────┘                  │
│                                                             │
│         ✓ Loading teams                                     │
│         → Syncing schedule...                               │
│         ○ Loading stats                                     │
│                                                             │
│            About 15 seconds remaining                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Progress stages:
  0-33%:  Loading teams (✓ when complete)
  33-66%: Syncing schedule (→ in progress, ✓ when complete)
  66-100%: Loading stats (○ pending, → in progress, ✓ when complete)
```

### Skeleton Screen - Dashboard Cards

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌────────────────────┐    ┌────────────────────┐         │
│  │ Next NFL Game      │    │ Your Team - Next   │         │
│  │                    │    │                    │         │
│  │  ○      @      ○   │    │  ○      @      ○   │  ← Team logos (shimmer)│
│  │  ▂▂▂▂  vs  ▂▂▂▂   │    │  ▂▂▂▂  vs  ▂▂▂▂   │  ← Team names│
│  │                    │    │                    │         │
│  │  ▂▂▂▂▂▂▂▂▂▂▂▂▂▂   │    │  ▂▂▂▂▂▂▂▂▂▂▂▂▂▂   │  ← Date/time│
│  │  ▂▂▂▂▂▂▂▂▂▂▂      │    │  ▂▂▂▂▂▂▂▂▂▂▂      │  ← Venue│
│  └────────────────────┘    └────────────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Animation: Left-to-right shimmer gradient
Duration: 1.5s continuous loop
Colors: rgba(255,255,255,0.05) → rgba(255,255,255,0.15)
```

### Skeleton Screen - Schedule List

```
┌─────────────────────────────────────────────────────┐
│  ○  Dallas Cowboys Schedule                        │
│  ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂                               │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ ▂▂  ▂▂▂▂▂  ○  ▂▂▂  ▂▂▂▂▂▂▂                 │  │
│  └─────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────┐  │
│  │ ▂▂  ▂▂▂▂▂  ○  ▂▂▂  ▂▂▂▂▂▂▂                 │  │
│  └─────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────┐  │
│  │ ▂▂  ▂▂▂▂▂  ○  ▂▂▂  ▂▂▂▂▂▂▂                 │  │
│  └─────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────┐  │
│  │ ▂▂  ▂▂▂▂▂  ○  ▂▂▂  ▂▂▂▂▂▂▂                 │  │
│  └─────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────┐  │
│  │ ▂▂  ▂▂▂▂▂  ○  ▂▂▂  ▂▂▂▂▂▂▂                 │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘

Shows 5-8 skeleton cards
Staggered appearance: 50ms delay between each
Individual shimmer animation per card
```

### Loading Spinner Sizes

```
SMALL (16px)      MEDIUM (32px)        LARGE (48px)
     ◌                  ◌                   ◌
   ◌   ◌              ◌   ◌               ◌   ◌
  ◌     ◌            ◌     ◌             ◌     ◌
   ◌   ◌              ◌   ◌               ◌   ◌
     ◌                  ◌                   ◌

Usage:
  Small: Inline with text, buttons
  Medium: Card loading, sections
  Large: Full-page/initial load

Animation: 360° rotation, 1s duration, continuous
```

---

## ERROR STATES

### Network Error - Section Level

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                         ✕                                   │
│                    ╱         ╲                              │
│                   ▕  WiFi     ▏  (WiFi icon with slash)    │
│                    ╲         ╱                              │
│                         ✕                                   │
│                                                             │
│                  Connection Lost                            │
│                                                             │
│     Unable to reach ESPN servers. Using cached data.        │
│              Last updated: 15 minutes ago                   │
│                                                             │
│         ┌──────────────┐      ┌────────────────┐          │
│         │  Retry Now   │      │ View Offline   │          │
│         └──────────────┘      └────────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Style:
  Icon: Large (48px), muted color
  Title: H3, semibold
  Message: Body text, secondary color
  Actions: Primary + Secondary buttons
  Background: Slightly different shade (subtle)
  No harsh red (informative, not alarming)
```

### Database Error - Critical

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                         ✕                                   │
│                    ╱         ╲                              │
│                   ▕ Database  ▏  (Database icon with X)    │
│                    ╲         ╱                              │
│                         ✕                                   │
│                                                             │
│                  Storage Error                              │
│                                                             │
│  Unable to save data locally. Please restart the app.       │
│                                                             │
│         ┌──────────────┐      ┌────────────────┐          │
│         │ Restart App  │      │   Get Help     │          │
│         └──────────────┘      └────────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Style:
  Background: Red tint (rgba(239, 68, 68, 0.1))
  Border: Red (#EF4444)
  Icon: Red color
  Critical error styling
  Primary action: Restart (danger style)
```

### Inline Error - Form Field

```
┌─────────────────────────────────────────────────────────────┐
│  Favorite Team                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ [Select Team ▼]                                    │    │
│  └────────────────────────────────────────────────────┘    │
│  └─ Border color: #EF4444 (red)                            │
│                                                             │
│  ✕ Please select a team from the list                      │
│  └─ Text color: #EF4444 (red), 14px                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## EMPTY STATES

### No Favorite Team Selected

```
┌─────────────────────────────────────────────────────────────┐
│  Your Team - Next Game                                      │
│ ╭─────────────────────────────────────────────────────────╮ │
│ │                                                         │ │
│ │                        ☆                                │ │
│ │                  (large star outline)                   │ │
│ │                                                         │ │
│ │            No Favorite Team Selected                    │ │
│ │                                                         │ │
│ │   Choose your favorite team from the dropdown above     │ │
│ │        to see their next game here.                     │ │
│ │                                                         │ │
│ │                       ↑ ↑ ↑                             │ │
│ │            (arrow pointing to dropdown)                 │ │
│ │                                                         │ │
│ ╰─────────────────────────────────────────────────────────╯ │
└─────────────────────────────────────────────────────────────┘

Style:
  Border: Dashed (not solid)
  Icon: Large (64px), secondary color
  Text: Centered, secondary color
  Background: Subtle highlight on hover
  Arrow: Subtle animation (pulse)
```

### No Upcoming Games (Off-season)

```
┌─────────────────────────────────────────────────────────────┐
│  Next NFL Game                                              │
│ ╭─────────────────────────────────────────────────────────╮ │
│ │                                                         │ │
│ │                        ✓                                │ │
│ │                   ╱          ╲                          │ │
│ │                  ▕  Calendar  ▏                         │ │
│ │                   ╲          ╱                          │ │
│ │                        ✓                                │ │
│ │                                                         │ │
│ │              No Upcoming Games                          │ │
│ │                                                         │ │
│ │   The 2025 NFL season has concluded. Check back soon    │ │
│ │   for the 2026 season!                                  │ │
│ │                                                         │ │
│ │          Season starts in approximately:                │ │
│ │                  234 days                               │ │
│ │                                                         │ │
│ ╰─────────────────────────────────────────────────────────╯ │
└─────────────────────────────────────────────────────────────┘

Style:
  Icon: Peaceful, completed
  Text: Informative, not negative
  Countdown: Helpful context
  Colors: Muted, calm
```

### No Game Selected

```
┌─────────────────────────────────────────────────────────────┐
│  Game Details                                               │
│                                                             │
│               ℹ️  (info circle icon)                         │
│                                                             │
│           Select a game to view details                     │
│                                                             │
│          Click any game in the schedule to see              │
│             team stats and player information               │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Style:
  Minimal, subtle
  Icon: Info (not error)
  Text: Secondary color, centered
  Background: Subtle gradient
```

---

## TOAST NOTIFICATIONS

### Toast Types & Positions

```
┌─────────────────────────────────────────────────────────────┐
│                                              ┌──────────────┤
│                                              │ ✓ Success    │
│                                              │ Data synced  │
│                                              └──────────────┘
│                                                      ↑
│                                              Top-right (default)
│                                              Auto-dismiss: 3s
│
│  ┌──────────────────────────────────────────┐
│  │ ✕ Error: Connection lost                 │
│  │ Please check your internet connection     │
│  │                          [Dismiss] [Retry]│
│  └──────────────────────────────────────────┘
│               ↑
│        Top-center (critical)
│        Auto-dismiss: 5s (or manual)
│
│
│  Content area...
│
│
│
│
└─────────────────────────────────────────────────────────────┘
```

### Toast Design Variants

#### Success Toast
```
┌─────────────────────────────────┐
│ ✓  NFL data updated successfully│  ← Green checkmark icon
│                           [✕]   │  ← Close button
└─────────────────────────────────┘
  ↑ Background: Success color with opacity
  ↑ Border-left: 3px solid green
  ↑ Icon: Green #10B981
  ↑ Auto-dismiss: 3 seconds
```

#### Error Toast
```
┌─────────────────────────────────┐
│ ✕  Failed to sync NFL data      │  ← Red X icon
│    Check your connection        │  ← Secondary message
│              [Retry]      [✕]   │  ← Action + Close
└─────────────────────────────────┘
  ↑ Background: Error color with opacity
  ↑ Border-left: 3px solid red
  ↑ Icon: Red #EF4444
  ↑ Auto-dismiss: 5 seconds (dismissible)
```

#### Warning Toast
```
┌─────────────────────────────────┐
│ ⚠  Using cached data            │  ← Warning triangle
│    Data may be outdated         │
│                           [✕]   │
└─────────────────────────────────┘
  ↑ Background: Warning color with opacity
  ↑ Border-left: 3px solid orange
  ↑ Icon: Orange #F59E0B
  ↑ Auto-dismiss: 4 seconds
```

#### Info Toast
```
┌─────────────────────────────────┐
│ ℹ️  Syncing in background        │  ← Info icon
│                           [✕]   │
└─────────────────────────────────┘
  ↑ Background: Info color with opacity
  ↑ Border-left: 3px solid blue
  ↑ Icon: Blue #3B82F6
  ↑ Auto-dismiss: 3 seconds
```

#### Loading Toast
```
┌─────────────────────────────────┐
│ ⟳  Syncing NFL data...          │  ← Spinning icon
│                                 │  ← No close button
└─────────────────────────────────┘
  ↑ Background: Primary color with opacity
  ↑ Border-left: 3px solid blue
  ↑ Icon: Rotating spinner
  ↑ Manual dismiss only (when operation completes)
```

### Toast Entrance/Exit Animation

```
ENTER (300ms)                    EXIT (200ms)

     │                                    │
   ↓ │                                  ↑ │
 ┌───┴────┐                         ┌───┴────┐
 │ Toast  │  Slide down + fade in   │ Toast  │  Slide up + fade out
 └────────┘                          └────────┘
   Slight bounce at end                Smooth exit

Transform: translateY(-100%) → translateY(0)
Opacity: 0 → 1
Easing: ease-out

Transform: translateY(0) → translateY(-20px)
Opacity: 1 → 0
Easing: ease-in
```

### Stacked Toasts

```
┌─────────────────────────┐
│ ✓ Team favorite updated │  ← Most recent (top)
└─────────────────────────┘
     ↓ Pushes down
┌─────────────────────────┐
│ ✓ Data synced           │  ← Previous toast
└─────────────────────────┘
     ↓ Pushes down
┌─────────────────────────┐
│ ℹ️ New scores available  │  ← Oldest (fading out)
└─────────────────────────┘

Max visible: 3 toasts
Spacing: 8px between toasts
New toasts push old ones down
Old toasts fade out when max reached
```

---

## MODAL DIALOGS

### Confirmation Dialog

```
┌─────────────────────────────────────────────────────────────┐
│                      [Dark overlay]                         │
│                                                             │
│        ┌───────────────────────────────────────┐           │
│        │  Are you sure?                     [✕]│           │
│        │                                       │           │
│        │  This will clear all cached data     │           │
│        │  and resync from ESPN. This action   │           │
│        │  cannot be undone.                   │           │
│        │                                       │           │
│        │              ┌──────────┐             │           │
│        │  ┌─────────┐ │  Delete  │             │           │
│        │  │ Cancel  │ │ (Danger) │             │           │
│        │  └─────────┘ └──────────┘             │           │
│        │     ↑ Focus                           │           │
│        └───────────────────────────────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Features:
  - Modal: Scale from 0.95 to 1.0 on open (250ms)
  - Backdrop: Fade in (200ms), rgba(0,0,0,0.5)
  - Focus trap: Keep focus within modal
  - Initial focus: Cancel button (safe action)
  - Escape key: Close modal (Cancel)
  - Click outside: Close modal (Cancel)
  - Danger action: Red color, secondary position
```

### Help/Settings Panel

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                       ┌────────────────────┐│
│                                       │ Settings        [✕]││
│                                       │                    ││
│                                       │ ┌────────────────┐││
│                                       │ │  Appearance    │││
│                                       │ │  Data & Sync   │││
│  Main content continues...            │ │  Accessibility │││
│  (slightly dimmed)                    │ │  About         │││
│                                       │ └────────────────┘││
│                                       │                    ││
│                                       │  Theme             ││
│                                       │  ⦿ Dark   ○ Light  ││
│                                       │                    ││
│                                       │  [More settings...]││
│                                       │                    ││
│                                       └────────────────────┘│
└─────────────────────────────────────────────────────────────┘
        ↑                                        ↑
   Backdrop (optional)            Slide in from right (300ms)
                                  Width: 400px (desktop)
                                  Full screen (mobile)
```

---

## SETTINGS PANEL

### Layout & Sections

```
┌──────────────────────────────────────────┐
│  Settings                             [✕]│
├──────────────────────────────────────────┤
│                                          │
│  ╔══════════════════════════════════╗   │ ← Active section
│  ║  Appearance                      ║   │
│  ╚══════════════════════════════════╝   │
│  ┌──────────────────────────────────┐   │
│  │  Data & Sync                     │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │  Accessibility                   │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │  About                           │   │
│  └──────────────────────────────────┘   │
│                                          │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄│ ← Divider
│                                          │
│  APPEARANCE                              │
│                                          │
│  Theme                                   │
│  ⦿ Dark      ○ Light      ○ Auto        │ ← Radio buttons
│                                          │
│  Font Size                               │
│  ├────────●───────────┤                 │ ← Slider
│  Small   Medium   Large                 │
│                                          │
│  Display Density                         │
│  ⦿ Comfortable   ○ Compact   ○ Spacious │
│                                          │
│                                          │
│                              [Scrollable]│
│                                          │
└──────────────────────────────────────────┘
```

### Theme Toggle Component

```
┌────────────────────────────────────┐
│  Theme                             │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  ⦿ Dark    ○ Light    ○ Auto │ │
│  └──────────────────────────────┘ │
│         ↑          ↑          ↑   │
│      Selected   Unselected  Future│
│                                    │
│  OR (Toggle Switch):               │
│                                    │
│  Dark  ◄─────●──────►  Light      │
│         └─────┘                    │
│        Toggle slider               │
│        (animated slide transition) │
└────────────────────────────────────┘
```

### Toggle Switch States

```
OFF (Dark)              TRANSITIONING            ON (Light)
┌──────────┐           ┌──────────┐            ┌──────────┐
│●         │    →      │    ●     │     →      │         ●│
│ 🌙       │           │          │            │       ☀️ │
└──────────┘           └──────────┘            └──────────┘
  Background:            Sliding:               Background:
  Dark blue              Animation:             Light gray
  Knob left              150-200ms              Knob right
```

---

## ACCESSIBILITY FEATURES

### Focus Indicators

#### Visible Focus Ring
```
DEFAULT (No focus)         FOCUSED (Keyboard)
┌──────────────┐          ┏━━━━━━━━━━━━━━┓
│   Button     │    →     ┃   Button     ┃
└──────────────┘          ┗━━━━━━━━━━━━━━┛
                             ↑ 2px outline
                             ↑ 2px offset
                             ↑ Blue color
                             ↑ High contrast
```

#### Focus Order Visualization
```
┌─────────────────────────────────────────────────────────────┐
│  [1] Skip to main → (Hidden, appears on focus)              │
├─────────────────────────────────────────────────────────────┤
│  [2] 🏈 NFL Dashboard   [3] [Fav Team ▼]  [4] [↻ Refresh]  │
├─────────────────────────────────────────────────────────────┤
│  [5] Next Game Card     [6] Your Team Card                  │
├─────────────────────────────────────────────────────────────┤
│  [7] Schedule: Game 1                                       │
│  [8] Schedule: Game 2                                       │
│  [9] Schedule: Game 3                                       │
├─────────────────────────────────────────────────────────────┤
│  [10] Carousel: ◄  [11] Team 1  [12] Team 2 ... [20] ►     │
└─────────────────────────────────────────────────────────────┘

Tab order: Logical, top to bottom, left to right
Skip link: Allows jumping to main content
All interactive elements: Reachable via keyboard
```

### ARIA Landmarks

```
┌─────────────────────────────────────────────────────────────┐
│  <header role="banner">                                     │
│    <nav aria-label="Main navigation">...</nav>              │
│  </header>                                                  │
├─────────────────────────────────────────────────────────────┤
│  <main role="main" id="main-content">                       │
│    <section aria-label="Dashboard">                         │
│      ...                                                    │
│    </section>                                               │
│    <section aria-label="Team schedule">                     │
│      ...                                                    │
│    </section>                                               │
│    <aside aria-label="Game details">                        │
│      ...                                                    │
│    </aside>                                                 │
│  </main>                                                    │
├─────────────────────────────────────────────────────────────┤
│  <footer role="contentinfo">                                │
│    ...                                                      │
│  </footer>                                                  │
└─────────────────────────────────────────────────────────────┘

Screen reader navigation:
  - Jump by landmark
  - "Navigate to main content"
  - "Navigate to navigation"
  - "Navigate to game details"
```

### Screen Reader Announcements

```
USER ACTION                SCREEN READER ANNOUNCES
─────────────────────────────────────────────────────────
Page loads              → "NFL Dashboard. Loading data."
                        → "NFL data loaded. Showing 32 teams."

Select team             → "Dallas Cowboys selected."
                        → "Showing schedule for Dallas Cowboys."

Select game             → "Game selected: Week 5, Cowboys at Eagles."
                        → "Loading game details."
                        → "Game details loaded."

Set favorite            → "Favorite team set to Dallas Cowboys."

Error occurs            → "Error: Could not load data. Please try again."
                           (aria-live="assertive")

Connection lost         → "Connection lost. Showing saved data."
                           (aria-live="polite")

Data synced             → "NFL data updated successfully."
                           (aria-live="polite")
```

### Keyboard Shortcuts Help

```
┌─────────────────────────────────────────────────────────────┐
│  Keyboard Shortcuts                                      [✕]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  NAVIGATION                                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tab              Move focus forward                  │  │
│  │  Shift + Tab      Move focus backward                 │  │
│  │  Enter / Space    Activate focused element            │  │
│  │  Arrow keys       Navigate within lists/carousels     │  │
│  │  Escape           Close modals or panels              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ACTIONS                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Ctrl/Cmd + R     Refresh data                        │  │
│  │  Ctrl/Cmd + ,     Open settings                       │  │
│  │  ?                Show this help                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  CAROUSEL                                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ← / →            Navigate teams                      │  │
│  │  Home             First team                          │  │
│  │  End              Last team                           │  │
│  │  Enter            Select focused team                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Trigger: Press "?" key anywhere
Dismissible: Escape or click outside
Scrollable if content overflows
```

---

## RESPONSIVE LAYOUTS

### Desktop (1200px+) - Current Layout

```
┌───────────────────────────────────────────────────────────────┐
│  🏈 NFL Dashboard        [Select Favorite ▼] [🌙] [↻ Refresh] │
├───────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐    ┌────────────────────────────┐   │
│  │ Next NFL Game       │    │ Your Team - Next Game      │   │
│  │  [Game info]        │    │  [Game info]               │   │
│  └─────────────────────┘    └────────────────────────────┘   │
├─────────────────────────────────┬─────────────────────────────┤
│ Schedule (60%)                  │ Game Details (40%)          │
│ ┌────────────────────────────┐  │ ┌─────────────────────────┐ │
│ │ Week 1: ...                │  │ │ Game Details            │ │
│ │ Week 2: ...                │  │ │                         │ │
│ │ Week 3: ...                │  │ │ [Teams]                 │ │
│ │ ...                        │  │ │ [Stats]                 │ │
│ │                            │  │ │ [Players]               │ │
│ └────────────────────────────┘  │ └─────────────────────────┘ │
│                                 │                             │
├─────────────────────────────────┴─────────────────────────────┤
│  ◄ [Team1] [Team2] [Team3] ... [Team10] [Team11] [Team12] ► │
└───────────────────────────────────────────────────────────────┘
```

### Tablet Landscape (992-1199px)

```
┌───────────────────────────────────────────────────────────────┐
│  🏈 NFL Dashboard        [Favorite ▼] [🌙] [↻]                │
├───────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐    ┌─────────────────────────────┐     │
│  │ Next Game        │    │ Your Team                   │     │
│  │  [Game info]     │    │  [Game info]                │     │
│  └──────────────────┘    └─────────────────────────────┘     │
├──────────────────────────────────┬────────────────────────────┤
│ Schedule (55%)                   │ Details (45%)              │
│ ┌─────────────────────────────┐  │ ┌────────────────────────┐ │
│ │ Week 1: ...                 │  │ │ Game Details           │ │
│ │ Week 2: ...                 │  │ │ [Slightly condensed]   │ │
│ └─────────────────────────────┘  │ └────────────────────────┘ │
├──────────────────────────────────┴────────────────────────────┤
│  ◄ [T1] [T2] [T3] [T4] [T5] [T6] [T7] [T8] [T9] [T10] ►      │
└───────────────────────────────────────────────────────────────┘

Changes:
  - Slightly narrower margins
  - Abbreviated button text
  - Show 8-10 teams in carousel
  - Details pane: 45% width
```

### Tablet Portrait (768-991px)

```
┌──────────────────────────────────────────────────┐
│  🏈 Dashboard  [Fav ▼] [🌙] [↻]                  │
├──────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────────────┐ │
│  │ Next Game      │  │ Your Team              │ │
│  └────────────────┘  └────────────────────────┘ │
├─────────────────────────┬────────────────────────┤
│ Schedule (50%)          │ Details (50%)          │
│ ┌────────────────────┐  │ ┌──────────────────┐  │
│ │ Week 1             │  │ │ Game Details     │  │
│ │ Week 2             │  │ │ [Compact]        │  │
│ └────────────────────┘  │ └──────────────────┘  │
├─────────────────────────┴────────────────────────┤
│  ◄ [T1] [T2] [T3] [T4] [T5] [T6] [T7] ►         │
└──────────────────────────────────────────────────┘

Changes:
  - 50/50 split for schedule/details
  - More compact cards
  - Smaller logos and text
  - Show 6-7 teams in carousel
```

### Mobile Landscape (576-767px)

```
┌────────────────────────────────────────────────┐
│  🏈 [Fav ▼] [🌙] [↻]                           │
├────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────────────────┐   │
│  │ Next     │  │ Your Team                │   │
│  └──────────┘  └──────────────────────────┘   │
├────────────────────────────────────────────────┤
│ Schedule                                       │
│ ┌──────────────────────────────────────────┐  │
│ │ Week 1                                   │  │
│ │ Week 2                                   │  │
│ └──────────────────────────────────────────┘  │
├────────────────────────────────────────────────┤
│  ◄ [T1] [T2] [T3] [T4] [T5] ►                 │
└────────────────────────────────────────────────┘
     ↑
     Game details: Overlay (slides up from bottom)

Changes:
  - Details become overlay (not side-by-side)
  - More compact header
  - Show 4-5 teams in carousel
  - Larger touch targets
```

### Mobile Portrait (375-575px)

```
┌─────────────────────────────┐
│  🏈 [≡] [🌙] [↻]            │
│  [Select Favorite Team ▼]   │
├─────────────────────────────┤
│  ┌───────────────────────┐  │
│  │ Next NFL Game         │  │
│  │ [Stacked info]        │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ Your Team - Next      │  │
│  │ [Stacked info]        │  │
│  └───────────────────────┘  │
├─────────────────────────────┤
│  Schedule                   │
│  ┌───────────────────────┐  │
│  │ Wk1 [Condensed]       │  │
│  │ Wk2 [Condensed]       │  │
│  │ Wk3 [Condensed]       │  │
│  └───────────────────────┘  │
├─────────────────────────────┤
│  ◄ [T1] [T2] [T3] ►         │
└─────────────────────────────┘
     ↑
     Swipe-enabled (no arrows on small screens)

Changes:
  - Single column layout
  - Full-width cards
  - Hamburger menu (optional)
  - Dropdown full-width
  - Simplified cards (less info)
  - Show 2-3 teams in carousel
  - Swipe gestures primary (hide arrows)
  - Game details: Full-screen overlay
```

### Touch Interactions (Mobile/Tablet)

```
CAROUSEL SWIPE
┌─────────────────────────────────┐
│  [T1] [T2] [T3] [T4] [T5]       │
│   ←─────────────────→           │
│      Swipe left/right           │
└─────────────────────────────────┘

GAME DETAILS CLOSE (Mobile)
┌─────────────────────────────────┐
│  Game Details              [✕]  │ ← Tap X or...
│  ─────────────────────────      │
│                                 │
│  [Content]                      │
│                                 │
│            ↓                    │
│         Swipe down              │ ← ...swipe down
└─────────────────────────────────┘

SCHEDULE SCROLL
┌─────────────────────────────────┐
│  Schedule                       │
│  │ Week 1                       │
│  │ Week 2                       │
│  ↓ Week 3                       │
│  │ ...                          │
│     Vertical scroll             │
└─────────────────────────────────┘

TOUCH TARGETS
Minimum: 44x44px (Apple) or 48x48px (Android)
Spacing: 8px between interactive elements
Buttons: Large, easy to tap
Links: Plenty of padding
```

---

## ANIMATION EXAMPLES

### Page Transition

```
CURRENT PAGE (Schedule)          NEW PAGE (Details)
┌──────────────────────┐         ┌──────────────────────┐
│                      │         │                      │
│  Schedule            │   →     │  Game Details        │
│  [Content]           │         │  [New Content]       │
│                      │         │                      │
└──────────────────────┘         └──────────────────────┘

Animation (350ms total):
  1. Old content fades out (150ms)
  2. New content slides in from right + fades in (200ms)
  3. Easing: ease-out
```

### Button Click Ripple

```
BEFORE CLICK        CLICK EVENT         RIPPLE SPREAD        COMPLETE
┌──────────┐       ┌──────────┐       ┌──────────┐        ┌──────────┐
│          │       │    ●     │       │   ◯◯◯   │        │          │
│  Button  │  →    │  Button  │  →    │  Button  │   →    │  Button  │
│          │       │          │       │          │        │          │
└──────────┘       └──────────┘       └──────────┘        └──────────┘
                     Click point       Ripple expands       Fades out
                                       (200ms)              (200ms)
```

### Skeleton Shimmer

```
FRAME 1             FRAME 2             FRAME 3             FRAME 1 (Loop)
████░░░░            ░░████░░            ░░░░████            ████░░░░
  ↑                   ↑                   ↑                   ↑
Gradient start      Gradient middle     Gradient end        Restart

Duration: 1.5s per cycle
Continuous loop
Left-to-right movement
```

### Modal Scale-In

```
START (scale: 0.95)     MID (scale: 0.975)      END (scale: 1.0)
     ┌────┐                  ┌──────┐               ┌────────┐
     │    │                  │      │               │        │
     │ ╳  │       →          │  ╳   │      →        │   ╳    │
     │    │                  │      │               │        │
     └────┘                  └──────┘               └────────┘
  Opacity: 0            Opacity: 0.5            Opacity: 1

Duration: 250ms
Easing: ease-out
Slightly overshoots then settles (optional bounce)
```

---

## DESIGN TOKENS REFERENCE

### Spacing Scale
```
xs:   4px   ▊
sm:   8px   ▊▊
md:   16px  ▊▊▊▊
lg:   24px  ▊▊▊▊▊▊
xl:   32px  ▊▊▊▊▊▊▊▊
xxl:  48px  ▊▊▊▊▊▊▊▊▊▊▊▊
```

### Border Radius
```
sm:   4px   ╭─╮
md:   8px   ╭──╮
lg:   12px  ╭───╮
xl:   16px  ╭────╮
full: 9999px  ●  (circular)
```

### Typography Scale
```
xs:   12px  Small text
sm:   14px  Secondary text
base: 16px  Body text (DEFAULT)
lg:   18px  Large body
xl:   20px  H4
2xl:  24px  H3
3xl:  28px  H2
4xl:  36px  H1
5xl:  48px  Display
```

### Shadow Scale
```
sm:   0 1px 2px rgba(0,0,0,0.05)        Subtle
md:   0 4px 6px rgba(0,0,0,0.1)         Default cards
lg:   0 10px 15px rgba(0,0,0,0.15)      Elevated cards
xl:   0 20px 25px rgba(0,0,0,0.2)       Modals, overlays
```

### Transition Durations
```
fast:   150ms   Quick feedback (hover)
normal: 300ms   Standard transitions
slow:   500ms   Large/complex animations
```

---

**END OF VISUAL GUIDE**

For complete implementation details, see:
- VERSION-2-ENHANCED-UI-UX-SPEC.md (full specification)
- VERSION-2-QUICK-REFERENCE.md (summary)

---

**Document Version**: 1.0  
**Created**: 2025-11-18  
**Status**: Reference Guide
