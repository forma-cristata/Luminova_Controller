# ColorEditor Viewport Height Calculation

## Current Layout Structure:
1. SafeAreaView with flex: 1
2. Header component 
3. Title container (name input)
4. ColorDots component
5. Color palette (optional)
6. Hex input container  
7. ColorWheelContainer
8. Button container (3 buttons)

## Height Calculations:

### Header: ~8-12% of viewport
- Android top padding: 8% of screen height
- Header content: ~4% of screen height
- **Total: 12% on Android, 4% on iOS**

### Title Container: ~8-10% of viewport
- Text + TextInput + margins: ~8-10%

### ColorDots: ~8-12% of viewport  
- Two rows of 8 dots each
- Estimated: 8-12% with margins

### Color Palette: ~3-5% of viewport (when visible)
- Horizontal scroll of small color buttons
- Estimated: 3-5%

### Hex Input: ~5-8% of viewport
- Single input field with margins
- Estimated: 5-8%

### ColorWheel: ~30-40% of viewport
- Current wheel diameter: 240 * scale
- Container padding: 8 * scale * 2
- Margins: 5 * scale + 8 * scale (brightness)
- **Target: Reduce to 25-30%**

### Button Container: ~8-10% of viewport
- 3 buttons in a row with margins
- marginTop: 20 * scale
- Estimated: 8-10%

## Current Total: ~90-110% (OVER LIMIT!)
## Target Total: 100% MAX

## Required Optimizations:
1. Reduce ColorWheel diameter from 240 to 180-200
2. Reduce ColorWheel container margins
3. Reduce button container marginTop 
4. Reduce title container height
5. Make color palette conditional/smaller
