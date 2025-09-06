# Components Directory
## Overview
The `components/` directory contains all reusable React Native UI components, organized by functionality to support the LED controller app's features.
## Component Categories
### animations/
**Purpose:** Components for LED animation rendering and preview (see [ANIMATIONS.md](animations/ANIMATIONS.md) for details).

### audio/
**Purpose:** Audio processing components for music-reactive LED features (see [AUDIO.md](audio/AUDIO.md) for details).

### color-picker/
**Purpose:** HSV color selection interface components (see [COLOR-PICKER.md](color-picker/COLOR-PICKER.md) for details).

### settings/
**Purpose:** Configuration management components (see [SETTINGS.md](settings/SETTINGS.md) for details).

### ui/
**Purpose:** General-purpose UI components and controls (see [UI.md](ui/UI.md) for details).

### welcome/
**Purpose:** First-time user onboarding components (see [WELCOME.md](welcome/WELCOME.md) for details).

## Component Design Principles
### Reusability
- **Props interfaces** for customization and flexibility
- **SharedStyles integration** for consistent theming
- **Memoization** with React.memo() for performance
### Type Safety
- **TypeScript interfaces** for all props and state
- **Strict typing** for LED controller integration
- **API-safe components** with proper error handling
### Performance
- **Optimized rendering** for smooth LED animations
- **Gesture handling** with React Native Reanimated
- **Memory efficient** component lifecycle management