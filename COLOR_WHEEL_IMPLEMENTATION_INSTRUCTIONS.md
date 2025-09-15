# Color Wheel Implementation Instructions

## Overview
Replace the three HSV sliders (hue, saturation, brightness) with a custom color wheel that allows users to select colors by clicking or dragging within a circular interface. The wheel will handle hue and saturation selection, while brightness will be controlled by a separate slider beneath the wheel.

## Current State Analysis
- **Components to Replace**: `ColorControl.tsx`, `HsvSlider.tsx`, `PlusMinusControl.tsx` 
- **Current Interface**: Three separate controls for hue (0-360°), saturation (0-100%), brightness (0-100%)
- **Platform Differences**: iOS uses sliders, Android uses plus/minus buttons
- **Usage Location**: `ColorEditor.tsx` lines 760-796 within `COMMON_STYLES.sliderContainer`
- **Current Footprint**: `sliderContainer` with width 85% of screen, bordered container with padding

## Implementation Plan

### 1. Create ColorWheel Component (`src/components/color-picker/ColorWheel.tsx`)

#### Core Requirements:
- **Circular Interface**: HSV color wheel with hue around the circumference and saturation from center to edge
- **White Center Point**: Pure white (#FFFFFF) at the center representing 0% saturation
- **3D Edge Effect**: Subtle curved shadow/highlight around the wheel perimeter to create depth illusion
- **Touch Handling**: Support both tap and drag gestures using React Native's PanGestureHandler or TouchableOpacity
- **Glass Marble Indicator**: Translucent selection indicator with warped/refracted edges resembling glass
- **Size**: Fill approximately the same footprint as the current three sliders combined
- **Accessibility**: Disabled state support matching current ColorControl behavior

#### Mathematical Implementation:
- **Coordinate System**: Convert touch coordinates to polar coordinates (angle, radius)
- **Hue Calculation**: `hue = (angle * 180 / Math.PI + 360) % 360` where angle is from center
- **Saturation Calculation**: `saturation = (radius / maxRadius) * 100` clamped to [0, 100]
- **Bounds Checking**: Ensure touch points stay within circular boundary
- **Color Rendering**: Generate wheel using canvas or SVG-like approach with color gradients
- **White Center**: Implement radial gradient from pure white at center to full saturation at edges
- **3D Wheel Effect**: Apply subtle shadow/highlight gradients around perimeter using multiple bordered views or linear gradients
- **Glass Marble Effect**: Layer multiple semi-transparent circles with different opacities and border effects for refraction appearance

#### Interface:
```typescript
interface ColorWheelProps {
  hue: number;           // 0-360
  saturation: number;    // 0-100
  brightness: number;    // 0-100 (for display purposes)
  disabled: boolean;
  onColorChange: (hue: number, saturation: number) => void;
  onColorChangeComplete: (hue: number, saturation: number) => void;
}
```

### 2. Create BrightnessSlider Component (`src/components/color-picker/BrightnessSlider.tsx`)

#### Requirements:
- **Standalone Brightness Control**: Separate slider for brightness only
- **Platform Adaptation**: Use existing ColorControl pattern (iOS slider, Android plus/minus)
- **Visual Integration**: Style to complement the color wheel
- **Current Color Preview**: Show brightness variations of the currently selected hue/saturation

#### Interface:
```typescript
interface BrightnessSliderProps {
  brightness: number;    // 0-100
  hue: number;          // For preview gradient
  saturation: number;   // For preview gradient
  disabled: boolean;
  onValueChange: (brightness: number) => void;
  onSlidingComplete: (brightness: number) => void;
}
```

### 3. Create ColorWheelControl Component (`src/components/color-picker/ColorWheelControl.tsx`)

#### Requirements:
- **Container Component**: Combines ColorWheel and BrightnessSlider
- **State Management**: Handles the interaction between wheel and brightness slider
- **Layout**: Arrange wheel above brightness slider in vertical layout
- **Consistent API**: Match the existing ColorControl interface for easy replacement

#### Interface:
```typescript
interface ColorWheelControlProps {
  hue: number;
  saturation: number; 
  brightness: number;
  disabled: boolean;
  onValueChange: (hue: number, saturation: number, brightness: number) => void;
  onSlidingComplete: (hue: number, saturation: number, brightness: number) => void;
}
```

### 4. Update ColorEditor.tsx Integration

#### Changes Required:
- **Import Update**: Replace `ColorControl` import with `ColorWheelControl`
- **Component Replacement**: Replace the three `ColorControl` components with single `ColorWheelControl`
- **State Management**: Update the callback handlers to receive all three values at once
- **Layout Adjustment**: Ensure the container sizing accommodates the circular wheel

#### Current Integration Points:
```typescript
// Lines 760-796: Replace these three ColorControl components
<ColorControl type="hue" ... />
<ColorControl type="saturation" ... />  
<ColorControl type="brightness" ... />

// With single:
<ColorWheelControl 
  hue={hue}
  saturation={saturation}
  brightness={brightness}
  disabled={selectedDot === null}
  onValueChange={(h, s, b) => {
    setHue(h);
    setSaturation(s);
    setBrightness(b);
    updateColor(h, s, b);
  }}
  onSlidingComplete={(h, s, b) => {
    handleSliderComplete(h, s, b);
  }}
/>
```

### 5. Update Component Exports

#### Files to Modify:
- **`src/components/color-picker/index.ts`**: Add exports for new components
- **Cleanup**: Consider deprecating unused components (HsvSlider, PlusMinusControl) if no longer needed

### 6. Styling and Responsive Design

#### Requirements:
- **Consistent Theming**: Use `SharedStyles.ts` constants (COLORS, DIMENSIONS, FONTS)
- **Device Scaling**: Apply `DIMENSIONS.SCALE` for responsive sizing
- **Visual Harmony**: Match the existing border styling and spacing from `COMMON_STYLES.sliderContainer`
- **Wheel Sizing**: Calculate appropriate diameter based on container width (85% of screen)

#### 3D Visual Effects:
- **Wheel Depth**: Create subtle 3D appearance using:
  - Outer shadow with slight offset below the wheel
  - Inner highlight ring near the perimeter
  - Gradient overlay to simulate curved surface reflection
  - Border effects with varying opacity for depth

#### Glass Marble Indicator:
- **Multi-Layer Structure**:
  - Base circle: Semi-transparent with current color (opacity ~0.3)
  - Middle layer: Clear with white highlight arc (opacity ~0.6) 
  - Outer ring: Subtle dark border for definition (opacity ~0.8)
  - Inner highlight: Small white dot offset slightly for glass refraction effect
- **Visual Properties**:
  - Border radius for perfect circle
  - Multiple shadow layers for depth
  - Gradient overlays for glass distortion effect
  - Size: Approximately 20-25px diameter scaled by DIMENSIONS.SCALE

### 7. Performance Considerations

#### Optimizations:
- **Throttled Updates**: Use `useDebounce` hook for color changes during dragging
- **Memoization**: Use `React.memo` and `useCallback` for expensive calculations
- **Gesture Handling**: Ensure smooth touch tracking without performance drops
- **Color Calculations**: Cache expensive HSV-to-RGB conversions where possible

### 8. Testing Strategy

#### Validation Points:
- **Mathematical Accuracy**: Verify hue/saturation calculations match expected values
- **Boundary Conditions**: Test edge cases (center point, circumference, outside circle)
- **Platform Compatibility**: Ensure consistent behavior on iOS and Android
- **Integration**: Verify hex color updates match wheel selections
- **Performance**: Test smooth dragging on various device specifications

### 9. Implementation Order

1. **ColorWheel.tsx**: Core wheel component with gesture handling
2. **BrightnessSlider.tsx**: Brightness-only slider component  
3. **ColorWheelControl.tsx**: Container combining wheel and brightness
4. **ColorEditor.tsx**: Integration and testing
5. **index.ts**: Export updates
6. **Cleanup**: Remove unused components if applicable

### 10. Key Technical Considerations

#### Color Space Mathematics:
- **Wheel Rendering**: Generate HSV color wheel using polar coordinates with white center point
- **Radial Saturation**: Implement smooth gradient from white (center) to full saturation (edge)
- **Hue Distribution**: Arrange full hue spectrum (0-360°) around circumference
- **Touch Conversion**: Convert screen coordinates to polar (angle, radius)
- **Hex Synchronization**: Ensure hex input field updates match wheel selections
- **Value Clamping**: Prevent invalid color values outside expected ranges

#### 3D Wheel Rendering:
- **Layered Approach**: Stack multiple circular views with different styling for depth
- **Shadow Effects**: Use React Native's shadow properties and elevation for 3D appearance
- **Gradient Overlays**: Apply linear/radial gradients to simulate curved surface lighting
- **Edge Definition**: Subtle border variations to enhance 3D curvature illusion

#### Glass Marble Implementation:
- **Component Structure**: Absolutely positioned indicator with multiple child views
- **Transparency Layers**: Stack circles with varying opacity (0.2-0.8 range)
- **Refraction Effect**: Use border styling and shadow offsets to simulate glass distortion
- **Highlight Positioning**: Offset white highlight dot to create realistic glass appearance
- **Dynamic Positioning**: Calculate indicator position based on current hue/saturation values

#### Gesture Implementation:
- **Touch Start**: Capture initial touch point and begin tracking
- **Touch Move**: Convert coordinates and update color in real-time  
- **Touch End**: Trigger completion callback for final value
- **Boundary Enforcement**: Keep touch tracking within circular bounds

## Success Criteria
- Users can select any hue/saturation combination by touching the wheel
- **White center point** represents 0% saturation correctly
- **3D wheel appearance** with subtle depth and curved edge effects
- **Glass marble indicator** provides clear visual feedback with translucent, realistic appearance
- Brightness is controlled independently via dedicated slider
- Hex color field updates automatically match wheel selection
- Component maintains same footprint as previous three-slider layout
- Smooth performance on both iOS and Android platforms
- Integration preserves all existing ColorEditor functionality
- **Visual polish** matches the app's existing design language while adding premium feel

## Files to Create/Modify
- **NEW**: `src/components/color-picker/ColorWheel.tsx`
- **NEW**: `src/components/color-picker/BrightnessSlider.tsx` 
- **NEW**: `src/components/color-picker/ColorWheelControl.tsx`
- **MODIFY**: `src/components/color-picker/index.ts`
- **MODIFY**: `src/screens/ColorEditor.tsx`
- **CONSIDER**: Deprecate `ColorControl.tsx`, `HsvSlider.tsx`, `PlusMinusControl.tsx` if unused elsewhere
