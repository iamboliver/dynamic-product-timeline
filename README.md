# Dynamic Product Timeline

A beautiful, interactive horizontal timeline for showcasing product features, releases, and roadmaps. Built with React, TypeScript, and Framer Motion.

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **Drag to Navigate** - Smooth horizontal scrolling with momentum physics
- **Smart Card Layout** - Automatic collision avoidance prevents overlapping
- **Past & Future** - Cards positioned above (future) or below (past) the timeline
- **Focus Detection** - Card closest to center automatically highlights
- **Detail Modals** - Click any card to see full details with media gallery
- **Like/Dislike Voting** - Built-in voting system (localStorage or API-ready)
- **Dark & Light Themes** - Toggle between themes with smooth transitions
- **Back to Today** - Floating button to reset view when scrolled away
- **Fully Typed** - Complete TypeScript support
- **JSON-Driven** - Feed data via URL or inline props

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/iamboliver/dynamic-product-timeline.git
cd dynamic-product-timeline

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🚀 Quick Start

### Basic Usage

```tsx
import { FeatureTimeline } from './components/FeatureTimeline';

function App() {
  return <FeatureTimeline dataUrl="/features.json" />;
}
```

### With Inline Data

```tsx
import { FeatureTimeline } from './components/FeatureTimeline';

const features = [
  {
    id: '1',
    title: 'Dark Mode',
    description: 'Full dark theme support across the application.',
    releaseDate: '2024-06-15',
    status: 'released',
    tags: ['UI', 'Accessibility'],
  },
  {
    id: '2',
    title: 'AI Assistant',
    description: 'Intelligent assistant powered by machine learning.',
    releaseDate: '2025-03-01',
    status: 'planned',
    highlight: true,
  },
];

function App() {
  return <FeatureTimeline features={features} />;
}
```

---

## 📋 Data Format

Create a `features.json` file in your `public` folder:

```json
[
  {
    "id": "unique-id",
    "title": "Feature Name",
    "description": "A detailed description of the feature.",
    "releaseDate": "2025-01-15",
    "status": "released",
    "screenshots": [
      "https://example.com/screenshot1.png",
      "https://example.com/screenshot2.png"
    ],
    "videos": [
      "https://example.com/demo.mp4"
    ],
    "tags": ["Category", "Type"],
    "highlight": false
  }
]
```

<details>
<summary><strong>Field Reference</strong></summary>

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `title` | string | Yes | Feature name |
| `description` | string | Yes | Feature description |
| `releaseDate` | string | Yes | ISO 8601 date (YYYY-MM-DD) |
| `status` | string | Yes | `released`, `beta`, or `planned` |
| `screenshots` | string[] | No | Array of image URLs |
| `videos` | string[] | No | Array of video URLs |
| `tags` | string[] | No | Category tags |
| `highlight` | boolean | No | Emphasize this feature |

</details>

---

## 🎨 Theming

The timeline supports dark and light themes out of the box.

### Using the Theme Toggle

```tsx
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { FeatureTimeline } from './components/FeatureTimeline';
import { ThemeToggle } from './components/ThemeToggle';
import { darkTheme, lightTheme } from './utils/constants';

function App() {
  const [isDark, setIsDark] = useState(true);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
      <FeatureTimeline dataUrl="/features.json" />
    </ThemeProvider>
  );
}
```

### Custom Theme

```tsx
import { TimelineTheme } from './types';

const customTheme: TimelineTheme = {
  colors: {
    background: '#0a0a0a',
    backgroundElevated: '#141414',
    backgroundSurface: '#1a1a1a',
    primary: '#db0011',           // Accent color
    primaryGlow: 'rgba(219, 0, 17, 0.4)',
    textPrimary: '#ffffff',
    textSecondary: '#b3b3b3',
    greyLight: '#b3b3b3',
    greyMid: '#666666',
    greyDark: '#333333',
    statusReleased: '#22c55e',    // Green
    statusBeta: '#f59e0b',        // Amber
    statusPlanned: '#db0011',     // Red
    todayMarker: '#db0011',
  },
  spacing: {
    cardBorderRadius: 20,
    cardPadding: 16,
    stemLength: 40,
    baseYOffset: 100,
    slotHeight: 120,
    minCardSpacing: 200,
  },
  animation: {
    dragMomentum: true,
    dragElastic: 0.1,
    focusTransitionDuration: 200,
    entranceStaggerDelay: 100,
  },
};
```

---

## 🗳️ Voting System

The timeline includes a like/dislike voting system that works out of the box with localStorage.

### Connecting to a Backend

To persist votes across users, update `src/services/voteService.ts`:

```typescript
// Set these URLs to enable API mode
const VOTES_API_URL = 'https://api.example.com/votes';      // GET: returns VotesMap
const VOTE_SUBMIT_URL = 'https://api.example.com/vote';     // POST: submit vote
```

**Expected API format:**

```typescript
// GET /votes response
{
  "feature-id-1": { "likes": 42, "dislikes": 3 },
  "feature-id-2": { "likes": 15, "dislikes": 8 }
}

// POST /vote request body
{
  "featureId": "feature-id-1",
  "voteType": "like",           // or "dislike"
  "previousVote": "dislike"     // optional, if changing vote
}

// POST /vote response
{ "likes": 43, "dislikes": 2 }
```

---

## ⚙️ Props Reference

```tsx
interface FeatureTimelineProps {
  dataUrl?: string;        // URL to fetch features JSON
  features?: Feature[];    // Inline feature data
  today?: Date;            // Override "today" (default: new Date())
  pxPerDay?: number;       // Pixels per day spacing (default: 12)
  className?: string;      // Additional CSS class
}
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── FeatureTimeline/
│   │   ├── index.ts              # Public exports
│   │   ├── FeatureTimeline.tsx   # Main container
│   │   ├── TimelineAxis.tsx      # Horizontal line + ticks
│   │   ├── TodayMarker.tsx       # Center marker
│   │   ├── FeatureCardsLayer.tsx # Card positioning
│   │   ├── FeatureCard.tsx       # Individual card
│   │   ├── ConnectorStem.tsx     # Card-to-axis connector
│   │   ├── FeatureModal.tsx      # Detail modal
│   │   └── styles.ts             # Styled components
│   └── ThemeToggle.tsx           # Dark/light toggle
├── hooks/
│   ├── useFeatureData.ts         # Data loading & processing
│   ├── useFocusedFeature.ts      # Focus detection
│   └── useVotes.ts               # Voting state
├── services/
│   └── voteService.ts            # Vote API layer
├── utils/
│   ├── timeScale.ts              # Date-to-pixel math
│   ├── collisionAvoidance.ts     # Card staggering
│   └── constants.ts              # Theme defaults
├── types/
│   └── index.ts                  # TypeScript interfaces
├── App.tsx
└── main.tsx
```

---

## 🛠️ Development

```bash
# Start dev server
npm run dev

# Type checking
npm run build

# Preview production build
npm run preview
```

---

## 📐 How It Works

### Coordinate System

- `x = 0` represents today
- Past dates → negative x values
- Future dates → positive x values
- Formula: `x = daysDifference × pxPerDay`

### Card Positioning

1. **Hemisphere**: Past features go below the line, future features go above
2. **Collision Avoidance**: Cards within `minCardSpacing` pixels are vertically staggered
3. **Focus Detection**: Card closest to viewport center receives focus styling

### Drag Mechanics

- Uses Framer Motion's pan gesture system
- Spring physics for smooth deceleration
- Bounded to prevent scrolling past first/last feature

---

## 🔧 Requirements

- Node.js 18+
- React 18+
- Modern browser with ES2020 support

---

## 📄 License

MIT License - feel free to use this in your own projects!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
