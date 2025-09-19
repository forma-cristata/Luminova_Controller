# Animations Directory
## Component Files
### AnimatedDots.tsx
**Purpose:** Renders real-time LED pattern previews with 16-dot grid representation (2 rows of 8) for all 12 animation patterns.

**Recent Changes:** Animation function names updated to match pattern names from configurations/patterns.ts for consistency:
- blenderAnimation → stuckInABlender
- christmasAnimation → smolder  
- comfortSongAnimation → thePianoMan
- funkyAnimation → feelTheFunk
- stillAnimation → still
- moldAnimation → decay
- progressiveAnimation → cortez
- strobeChangeAnimation → theUnderground
- technoAnimation → berghainBitte
- traceManyAnimation → lapisLazuli
- traceOneAnimation → medusa
- tranceAnimation → stateOfTrance

**Pattern Mapping:** All function names now directly correspond to pattern names defined in FLASHING_PATTERNS configuration, improving code readability and maintainability.
