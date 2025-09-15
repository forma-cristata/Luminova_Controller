# Color-Picker Directory

## Component Files

### BpmControl.tsx
**Purpose:** Controls BPM (beats per minute) settings for audio-synchronized LED animations with increment/decrement functionality.

### BpmPlusMinusControl.tsx
**Purpose:** Provides plus/minus buttons for precise BPM adjustment in audio synchronization features.

### BpmSlider.tsx
**Purpose:** Slider component for continuous BPM value adjustment with real-time feedback and throttled updates.

### BrightnessSlider.tsx
**Purpose:** Horizontal slider for controlling LED brightness levels with visual feedback and optimized gesture handling.

### ColorDots.tsx
**Purpose:** Displays color preview dots showing current and selected colors in the color picker interface.

### ColorWheel.tsx
**Purpose:** Interactive circular color picker with 12-segment HSV color wheel for intuitive hue and saturation selection.

**Key Features:**
- **12-Color Segmentation:** Hard-coded HSL colors at 30-degree intervals for even distribution
- **Precise Touch Handling:** Converts touch coordinates to polar coordinates with segment snapping
- **Visual Consistency:** Each color segment has equal visual representation matching standard color wheels
- **Gesture Support:** Pan responder with proper touch tracking and completion callbacks
- **Saturation Gradient:** Radial saturation control from center (white) to edge (full saturation)
- **Glass Marble Indicator:** Styled position indicator with realistic glass effects

**Implementation:**
- Uses 360 individual degree slices for smooth color transitions
- Snaps touch input to nearest 30-degree segment for consistent behavior
- Maintains visual color accuracy with picker output
- Optimized for cross-device compatibility with responsive scaling

### ColorWheelControl.tsx
**Purpose:** Main color control component combining ColorWheel (hue/saturation) and BrightnessSlider (brightness) for complete HSV color selection.

### PlusMinusControl.tsx
**Purpose:** Generic increment/decrement control component used across various numeric inputs in the color picker.

## Color System Architecture

### Current Implementation
The color picker system uses a **ColorWheelControl** component that combines:
- **ColorWheel:** Handles hue (0-360°) and saturation (0-100%) selection
- **BrightnessSlider:** Handles brightness/value (0-100%) control

This replaces the previous individual HSV slider approach with a more intuitive visual interface.

### HSV Color Model
The color picker uses HSV (Hue, Saturation, Value) color model:
- **Hue (0-360°):** Color position on the wheel, snapped to 12 discrete segments
- **Saturation (0-100%):** Color intensity from center to edge of wheel
- **Value/Brightness (0-100%):** Overall brightness controlled via separate slider

### Color Wheel Implementation
The ColorWheel component implements a standard 12-segment color wheel:

```typescript
const TWELVE_COLOR_WHEEL = [
    { hue: 0, color: "hsl(0, 100%, 50%)" },     // Red
    { hue: 30, color: "hsl(30, 100%, 50%)" },   // Red-Orange
    { hue: 60, color: "hsl(60, 100%, 50%)" },   // Orange/Yellow-Orange
    { hue: 90, color: "hsl(90, 100%, 50%)" },   // Yellow-Green
    { hue: 120, color: "hsl(120, 100%, 50%)" }, // Green
    { hue: 150, color: "hsl(150, 100%, 50%)" }, // Green-Cyan
    { hue: 180, color: "hsl(180, 100%, 50%)" }, // Cyan
    { hue: 210, color: "hsl(210, 100%, 50%)" }, // Light Blue
    { hue: 240, color: "hsl(240, 100%, 50%)" }, // Blue
    { hue: 270, color: "hsl(270, 100%, 50%)" }, // Blue-Violet
    { hue: 300, color: "hsl(300, 100%, 50%)" }, // Magenta
    { hue: 330, color: "hsl(330, 100%, 50%)" }  // Pink-Red
];
```

### Touch Coordinate Mapping
The wheel converts touch coordinates to color values using polar coordinate transformation:
1. Calculate angle from touch position relative to wheel center
2. Snap angle to nearest 30-degree segment for consistent color selection
3. Calculate saturation based on distance from center
4. Return discrete hue value and continuous saturation value

### Performance Optimizations
- **React.memo:** All components memoized for efficient re-rendering
- **useCallback:** Gesture handlers and coordinate conversion functions
- **Throttled Updates:** Slider components use debounced state updates
- **Efficient Rendering:** 360 degree slices pre-calculated and optimized for smooth display
