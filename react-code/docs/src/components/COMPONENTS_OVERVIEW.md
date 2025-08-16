# Components Directory

## Overview
The `components/` directory contains all reusable React Native UI components, organized by functionality to support the LED controller app's features.

## Component Categories

### animations/
**Purpose:** Components for LED animation rendering and preview.

### audio/
**Purpose:** Audio processing components for music-reactive LED features.

### color-picker/
**Purpose:** HSV color selection interface components.

### settings/
**Purpose:** Configuration management components.

### ui/
**Purpose:** General-purpose UI components and controls.

### welcome/
**Purpose:** First-time user onboarding components.

## Direct Component Files

### AnimatedDots.tsx (in animations/)
**Purpose:** Renders real-time LED pattern previews with 16-dot grid representation (2 rows of 8) for all 12 animation patterns.

### BPMMeasurer.tsx (in audio/)
**Purpose:** Measures beats per minute from audio input to synchronize LED animations with music tempo.

### ColorDots.tsx (in color-picker/)
**Purpose:** Displays color preview dots showing current and selected colors in the color picker interface.

### HueSliderBackground.tsx (in color-picker/)
**Purpose:** Renders the hue spectrum background gradient for the color picker slider component.

### Picker.tsx (in color-picker/)
**Purpose:** Main HSV color picker component with gesture controls for hue, saturation, and value selection.

### SettingBlock.tsx (in settings/)
**Purpose:** Individual setting item component used in carousel-based settings management interface.

### AnimatedTitle.tsx (in ui/)
**Purpose:** Animated text component for screen titles with smooth transitions and visual effects.

### DismissKeyboardView.tsx (in ui/)
**Purpose:** Wrapper component that dismisses the keyboard when tapping outside input fields.

### Dot.tsx (in ui/)
**Purpose:** Individual LED dot representation component used in the 16-dot grid layout.

### HexKeyboard.tsx (in ui/)
**Purpose:** Custom hexadecimal color input keyboard for precise color value entry.

### WelcomeTutorial.tsx (in ui/)
**Purpose:** Interactive tutorial component guiding new users through app features and LED controller setup.

### buttons/ (in ui/)
**Purpose:** Directory containing reusable button components with consistent styling and SharedStyles integration.

### IpAddressInput.tsx (in welcome/)
**Purpose:** IP address input component for connecting to LED controller hardware during initial setup.

### LedToggle.tsx (in welcome/)
**Purpose:** Toggle switch component for enabling/disabling LED controller connection during onboarding.

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
