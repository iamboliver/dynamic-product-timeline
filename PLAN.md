Feature Release Timeline – Implementation Plan
1. Goal & UX Brief
Build a JSON‑driven, horizontal feature timeline for the marketing site that:

Uses a single JSON file as the source of truth for feature releases (past and future).

Renders a horizontal time axis with “Today” anchored in the visual center.

Positions feature cards left (past) and right (future) of today, above/below the line to avoid overlap.

Allows the user to drag a handle / timeline track to move through time; as the viewport moves, feature cards come into focus with smooth animation.

Uses a futuristic, high‑polish visual style: dark theme, neon accents, rounded cards, subtle glows, smooth transitions.

Assume this will be built as a reusable React component that can be embedded on a marketing page, but keep the logic UI‑framework agnostic where possible.

2. Data Model
2.1 JSON schema
Define a JSON file, e.g. features.json:

json
[
  {
    "id": "feat-voice-memos",
    "title": "AI Voice Memos",
    "description": "Record, transcribe, and summarize conversations with one tap.",
    "releaseDate": "2025-11-15",
    "status": "released",              // "released" | "beta" | "planned"
    "screenshots": ["url1", "url2"],
    "videos": ["url3"],
    "tags": ["mobile", "ai", "transcription"],
    "highlight": true                  // optional, for visual emphasis
  }
]
Key requirements:

releaseDate must be ISO 8601 string (YYYY-MM-DD or full datetime).

Optional status used for styling (e.g., future/planned vs shipped).

Optional highlight to make flagship launches more visually prominent.

2.2 Data loading
Provide a small data loader that:

Fetches features.json at load time.

Parses dates into Date objects.

Sorts features ascending by releaseDate.

Computes metadata: minDate, maxDate.

3. Timeline Layout & Positioning
3.1 Coordinate system
Treat time as a continuous horizontal axis:

Map each feature’s releaseDate to an x position using a linear scale from minDate → maxDate.

Use a pixels‑per‑day value (configurable) to control density (e.g., 8–16 px/day).

The visible viewport is a fixed width (e.g., container width); the internal timeline canvas may be much wider and is scrolled/translated.

3.2 Today anchor
Define today = new Date() (or inject as prop for determinism/testing).

Compute today’s x‑coordinate as the origin (0) in the logical coordinate system.

Past releases: negative x.

Future releases: positive x.

On initial render, center the viewport so that today’s x maps to the center of the container.

3.3 Card placement (above/below)
Each feature is rendered as a card node anchored to the timeline line by a small stem/connector.

Rules:

If releaseDate <= today: place card below the line (past).

If releaseDate > today: place card above the line (future).

Use alternating offsets to avoid overlapping cards when dates are close:

Maintain an array of columns “slots” in each hemisphere (above/below).

If two features are within a given pixel distance on x (e.g., < 120 px), vertically stagger them with an offset (e.g., 40–60 px increments).

4. Interaction Model
4.1 Drag and scroll behavior
The user can:

Drag a grab handle (circle or diamond on the timeline) horizontally.

Drag anywhere on the timeline background to pan left/right.

Use scroll wheel / trackpad horizontally for convenience (optional).

Implementation options:

Maintain a single state variable viewportOffsetX that represents the translation of the internal timeline relative to the container center.

Apply this via CSS transform: transform: translateX(viewportOffsetX) on the main timeline content wrapper.

For drag:

On pointer down, store initial pointer x and viewportOffsetX.

On pointer move, update viewportOffsetX with deltaX, clamped to min/max bounds (so user can’t drag beyond earliest/latest feature by more than a configurable margin).

On pointer up, stop listening.

Add inertia and ease‑out (e.g., GSAP, Framer Motion, or a light spring) so the drag feels smooth and futuristic.

4.2 Focus and selection
As the timeline moves, apply a “focus” state to the feature card closest to the center:

Compute each card’s screen x position; the one nearest the container center gets a “focused” CSS class.

Focused card could:

Slightly scale up (e.g., 1.03).

Increase glow intensity.

Show more text / CTA.

Clicking a card:

Opens a modal or enlarges the card in place, showing:

Full description.

Screenshots (carousel).

Video embed (if present).

Status badge and release date.

4.3 Keyboard and accessibility
Allow keyboard navigation (optional but recommended):

Left/right arrow keys move focus to the previous/next feature and pan the timeline so that feature is centered.

Ensure all cards and controls are reachable via tab, with ARIA roles where appropriate (timeline list, current item, etc.).

5. Visual & Motion Design
5.1 Overall style
Theme:

Dark background (#050814–#050B17 range).

Timeline line as a subtle gradient (e.g., teal → purple) with low opacity.

Neon accent colors for future features (cyan, magenta); warmer, softer tones for past features.

Shapes:

Rounded edges everywhere:

Cards: 18–24 px border radius.

Buttons: pill style.

Timeline nodes: circles with inner glow.

Depth:

Soft shadows + glows on focused cards.

Subtle glassmorphism (semi‑transparent panels) is acceptable but avoid readability issues.

5.2 Cards
Card content:

Title (1–2 lines max).

One‑line summary.

Status badge (“Released”, “In Beta”, “Coming Soon”).

Date label (e.g., “Shipped Nov 2025” or “Planned Q2 2026”).

Visuals:

Small preview thumbnail (screenshot or icon) in the corner; full media only in expanded view.

For flagged highlight features, slightly larger card and accent border.

5.3 Animation
On load:

Animate the timeline drawing from center outwards, with today marker appearing first.

Cards fade/slide in from their side (past from left, future from right) with small delays.

On drag/pan:

Use smooth, hardware‑accelerated transforms (translate3d).

Keep animation frame rate high; avoid heavy box‑shadows on many elements at once.

On focus change:

150–250 ms ease‑out scale + glow transition.

On modal open:

Subtle zoom and fade from the card position; overlay darkens the background.

6. Architecture & Components
Assuming React (adapt names as needed):

FeatureTimeline (container)

Props:

dataUrl or features array.

today (optional override).

theme options (colors, fonts, radius, motion toggles).

Responsibilities:

Load/parse/sort features.

Compute time scale and coordinates.

Manage viewportOffsetX, drag, focus logic.

Render TimelineAxis, FeatureCardsLayer, and TodayMarker.

TimelineAxis

Renders:

Main line (with gradient).

Ticks (e.g., years/quarters) with labels.

TodayMarker (vertical marker + label “Today”).

FeatureCardsLayer

Receives:

Features with computed x coordinate and side (above/below).

viewportOffsetX and container width.

Renders:

Cards positioned via absolute layout on the timeline.

Connector stems from line to card.

Applies class for focused card.

FeatureCard

Displays card UI; handles click to open FeatureModal.

FeatureModal

Full details: description, media gallery, videos, tags, etc.

7. Implementation Steps
Set up project skeleton

Choose stack: React + TypeScript + styled‑components / Tailwind / CSS Modules.

Create basic page that renders a placeholder FeatureTimeline component.

Data loading & parsing

Implement the JSON loader.

Add type definitions for Feature.

Normalize and sort data.

Time scaling & positioning

Implement linear time → x mapping (using min/max date and px/day).

Implement today anchoring at x = 0 and conversion to screen coordinates.

Render static axis and markers for a few sample features.

Card layout logic

Add above/below placement rules.

Implement collision avoidance / vertical staggering.

Confirm cards are visually legible at different container widths.

Drag & pan

Implement drag handling for the canvas (pointer events).

Wire up viewportOffsetX state and translate the content.

Add clamping and optional inertia / easing.

Focus & selection

Implement logic to compute “closest to center” feature on each render.

Add focused styling and click handler to open modal.

Implement FeatureModal with sample content.

Futuristic visual design

Apply dark theme, gradients, rounded corners, shadows/glows.

Tune typography and spacing.

Add entrance animations and transitions with a motion library if desired.

Responsiveness & touch

Ensure drag works with touch events on mobile.

Adjust px/day scale dynamically for small screens.

Consider collapsing to a vertical, scrollable timeline on very narrow viewports.

Performance & polish

Use requestAnimationFrame for drag updates if needed.

Avoid re‑rendering all cards unnecessarily (memoization / virtualization if many features).

Add basic unit tests for time scaling and placement, plus visual regression checks as needed.

Integration

Expose as a drop‑in component with minimal props for the marketing site.

Provide hooks for analytics (e.g., card click events, modal opens).

8. Nice‑to‑Have Extensions
Zoom control (slider or pinch) to change time scale.

Filters (e.g., by tag / platform) that fade out non‑matching cards.

“Jump to” controls for key milestones (e.g., year markers or major launches).

Autoplay “story mode” that animates through major releases chronologically.