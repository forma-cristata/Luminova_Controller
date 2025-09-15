# Color Wheel Fix Instructions

## Problem Analysis
The current color wheel has uneven color distribution:
- Top half and bottom left quadrant: 3 distinct color sections each (good)
- Bottom right quadrant: Only 1 red section, doesn't fade to green properly
- Picker shows different colors than visually represented

## Root Cause
The current math-based approach in `generateHueStops()` creates uneven color distribution with only 13 stops (0-360 by 30s), causing poor color representation in certain quadrants.

## Solution: Hard-coded 12-Color Wheel with Proper Wedges

### Step 1: Define 12 Equal Color Wedges (30° each)
Create 12 distinct colors that form a complete color wheel:
1. Red (0°)
2. Red-Orange (30°)  
3. Orange (60°)
4. Yellow-Orange (90°)
5. Yellow (120°)
6. Yellow-Green (150°)
7. Green (180°)
8. Blue-Green (210°)
9. Cyan (240°)
10. Blue (270°)
11. Blue-Violet (300°)
12. Violet/Magenta (330°)

### Step 2: Use CSS Conic Gradient or Wedge Masking
Replace the current multiple `hueSegment` views with:
- Option A: CSS conic-gradient (if supported)
- Option B: 12 individual wedge components with proper masking

### Step 3: Wedge Implementation with Masking
Each wedge should be:
- 30° wide (360° / 12 = 30°)
- Triangular shape from center to edge
- Use `transform: rotate()` for positioning
- Use `overflow: hidden` and `clipPath` or masking for triangular shape

### Step 4: Saturation Gradient
For each wedge:
- Full saturation at outer edge
- Fade to white/low saturation toward center
- Use radial gradient or multiple overlay rings

### Step 5: Coordinate Conversion Updates
Update the angle calculation in `coordinatesToPolar()`:
- Map touch coordinates to nearest 30° wedge
- Calculate saturation based on distance from center
- Ensure proper hue snapping to 12 discrete values

## Implementation Steps

1. Replace `generateHueStops()` with fixed 12-color array
2. Create proper wedge components with masking
3. Update coordinate conversion logic
4. Test each quadrant for proper color representation
5. Verify picker matches visual colors

## Key Requirements
- Exactly 12 equal wedges (30° each)
- Proper color transitions between adjacent wedges
- Saturation increases from center to edge
- Visual colors must match picker output
- No math-generated colors - use hard-coded HSL values

## Testing Checklist
- [ ] Top half shows 6 distinct color sections
- [ ] Bottom left shows 3 distinct color sections  
- [ ] Bottom right shows 3 distinct color sections (not just red)
- [ ] Colors transition smoothly between wedges
- [ ] Picker output matches visual representation
- [ ] All 12 colors are accessible via touch
