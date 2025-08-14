# Luminova Controller - Codebase Guide

## Overview

The Luminova Controller is a React Native application that controls LED lighting patterns through a REST API. The app allows users to create, edit, and manage custom lighting configurations with various animation patterns and color schemes.

## Architecture

### Core Technologies
- **React Native** with TypeScript
- **Expo** for development and deployment
- **React Navigation** for screen navigation
- **React Native Reanimated** for animations
- **Expo File System** for data persistence

## Development Standards & Best Practices

### 🧹 **Code Cleanup Protocol**
- **MANDATORY**: Always remove deprecated code when implementing fixes or new features
- **Remove**: Unused state variables, functions, imports, and components
- **Clean**: Old useEffect hooks, event listeners, and temporary debugging code
- **Validate**: Use TypeScript errors and linting to identify deprecated patterns

### 🔧 **Implementation Standards**

#### **Before Making Changes:**
- Scan related components to understand dependencies
- Check for existing patterns in SharedStyles.ts and ApiService.ts
- Review similar implementations in the codebase
- Consider impact on navigation flow and state management

#### **During Implementation:**
- Use established patterns (COMMON_STYLES, COLORS, FONTS)
- Leverage ApiService for all API communications
- Follow component organization standards
- Maintain TypeScript interfaces and type safety

#### **After Implementation:**
- **REMOVE DEPRECATED CODE** - Clean up any unused/replaced code
- Validate changes with get_errors tool
- Update documentation to reflect changes
- Test component integration patterns
- Verify no broken imports or dependencies

### 📚 **Documentation Maintenance**
- Update this guide when adding new components or patterns
- Document new shared utilities or optimization techniques
- Keep animation pattern lists current
- Maintain accuracy of component relationships

## Project Structure

```
react-code/
├── app/                          # Main application code
│   ├── components/               # Reusable UI components
│   ├── configurations/           # App configuration and constants
│   ├── context/                  # React Context providers
│   ├── interface/                # TypeScript interfaces
│   └── [screens].tsx             # Main application screens
├── assets/                       # Static assets (fonts, images)
├── services/                     # API and external service layers
└── [config files]                # Build and configuration files
```

## Main Application Screens

### 📱 Screen Navigation Flow

```
Welcome → Settings → ChooseModification → [ColorEditor | FlashingPatternEditor]
```

#### `/app/welcome.tsx`
- **Purpose**: Entry point with LED on/off toggle
- **Features**: 
  - Animated text display
  - LED status fetching and control
  - Navigation to Settings
- **API Integration**: Uses `ApiService` for status and LED control

#### `/app/settings.tsx`
- **Purpose**: Main settings management screen
- **Features**:
  - Carousel view of all lighting configurations
  - Create, duplicate, and delete settings
  - Setting preview with animated dots
- **Data Management**: Handles local storage of settings via `FileSystem`

#### `/app/ChooseModification.tsx`
- **Purpose**: Choice screen for editing colors vs flashing patterns
- **Layout**: Split-screen design (left: patterns, right: colors)

#### `/app/ColorEditor.tsx`
- **Purpose**: Advanced color editing interface
- **Features**:
  - 16-dot color grid (2 rows of 8)
  - HSV color picker with sliders
  - Hex input with validation
  - Gesture controls (swipe to copy/reverse rows)
  - Preview functionality
- **Modes**: Handles both new setting creation and existing setting editing

#### `/app/FlashingPatternEditor.tsx`
- **Purpose**: Animation pattern and timing configuration
- **Features**:
  - Pattern picker with 12 different animations
  - BPM-based speed control
  - Real-time preview
- **Patterns**: Supports 12 distinct animation patterns (0-11)

## Component Library

### 🎨 Dot Components

#### `/app/components/Dot.tsx`
- **Purpose**: Single LED representation
- **Props**: `color`, `id`
- **Usage**: Building block for all dot displays

#### `/app/components/ColorDots.tsx`
- **Purpose**: Unified, modular component for LED dot display and interaction
- **Modes**:
  - **Static Display**: `layout='single-row'` (default) - for previews in settings carousel
  - **Interactive Editor**: `layout='two-rows'` + interaction props - for color editing
- **Features**:
  - Configurable layouts (single-row/two-rows)
  - Optional interactivity with click selection and visual feedback
  - Scale animation for selected dots in interactive mode
  - Shadow effects for black dots in interactive mode
  - Customizable dot size and spacing
- **Usage Examples**:
  ```typescript
  // Static preview
  <ColorDots colors={setting.colors} />
  
  // Interactive editor
  <ColorDots 
    colors={colors}
    onDotSelect={handleDotSelect}
    selectedDot={selectedDot}
    layout='two-rows'
  />
  ```

#### `/app/components/AnimatedDots.tsx`
- **Purpose**: Animated dot patterns for previewing effects
- **Features**:
  - 12 different animation patterns
  - Proper cleanup and state isolation
  - Timeout management to prevent memory leaks
- **Animations**: Blender, Christmas, Comfort Song, Funky, Mold, Progressive, Still, Strobe Change, Techno, Trace Many, Trace One, Trance

### 🎛️ Control Components

#### `/app/components/Picker.tsx`
- **Purpose**: Scrollable pattern selection
- **Features**:
  - 12 predefined patterns with friendly names
  - Auto-scroll to selected pattern
  - Visual feedback for selection

#### `/app/components/HueSliderBackground.tsx`
- **Purpose**: Rainbow background for hue slider
- **Implementation**: Gradient background component

#### `/app/components/InfoButton.tsx`
- **Purpose**: Reusable info button across all screens
- **Design**: Consistent positioning and styling

### 📱 Layout Components

#### `/app/components/settingBlock.tsx`
- **Purpose**: Setting display component used in carousel
- **Modes**:
  - **Animated**: Full display with Edit/Flash buttons
  - **Static**: Simplified preview for carousel
- **Features**: API integration for flashing settings to hardware

## Shared Resources

### 🎨 Styling System

#### `/app/components/SharedStyles.ts`
- **Purpose**: Centralized styling constants and common styles
- **Contents**:
  - Color palette (`COLORS`)
  - Font definitions (`FONTS`)
  - Screen dimensions (`DIMENSIONS`)
  - Common button styles
  - Shared layout components

### 🌐 API Integration

#### `/app/services/ApiService.ts`
- **Purpose**: Centralized API communication layer
- **Methods**:
  - `flashSetting()` - Send configuration to hardware
  - `previewSetting()` - Temporary preview
  - `restoreConfiguration()` - Restore previous state
  - `getStatus()` - Get LED on/off status
  - `toggleLed()` - Control LED power
- **Benefits**: Consistent error handling, type safety, centralized logging

### 🔄 State Management

#### `/app/context/ConfigurationContext.tsx`
- **Purpose**: Global state management for current configuration
- **State**:
  - `currentConfiguration` - Active LED configuration
  - `lastEdited` - Index of last edited setting
- **Usage**: Shared across all screens for state consistency

### 📊 Data Models

#### `/app/interface/setting-interface.ts`
- **Purpose**: TypeScript interface for lighting configurations
- **Properties**:
  - `name` - User-friendly setting name
  - `colors` - Array of 16 hex color values
  - `whiteValues` - White LED brightness (0-255)
  - `brightnessValues` - Overall brightness (0-255)
  - `flashingPattern` - Animation pattern ID (0-11)
  - `delayTime` - Animation speed timing

## Configuration and Constants

### ⚙️ App Configuration

#### `/app/configurations/constants.ts`
- **Purpose**: Environment and API configuration
- **Contains**: API endpoint (`IP`), hardware communication settings

#### `/app/configurations/modes.json`
- **Purpose**: Default lighting presets
- **Contents**: 12 pre-configured lighting schemes
- **Usage**: Loaded as fallback when no user settings exist

## Navigation System

### 🧭 Navigation Structure

#### `/app/index.tsx`
- **Purpose**: Root navigation configuration
- **Stack Navigator**: 
  - Welcome
  - Settings  
  - ChooseModification
  - ColorEditor (with `isNew` parameter)
  - FlashingPatternEditor (with `isNew` parameter)
  - Info

#### Navigation Parameters
- **ColorEditor**: `{ setting: Setting, isNew?: boolean, originalName?: string }`
- **FlashingPatternEditor**: `{ setting: Setting, isNew?: boolean }`
- **ChooseModification**: `{ setting: Setting }`

## Animation Patterns

### 🎭 Available Patterns

| ID | Name | Description |
|----|------|-------------|
| 0 | Stuck in a Blender | Rotating color cascade |
| 1 | Smolder | Christmas-style alternating pattern |
| 2 | The Piano Man | Musical pattern with rhythm |
| 3 | Feel the Funk | Random strobe effects |
| 4 | Decay | Gradual fade effects |
| 5 | Cortez | Progressive color waves |
| 6 | Still | Static color display (no animation) |
| 7 | The Underground | Strobe pattern |
| 8 | Berghain Bitte | Techno-style rapid sequences |
| 9 | Lapis Lazuli | Multi-color tracing |
| 10 | Medusa | Single color tracing |
| 11 | State of Trance | Trance-style effects |

## Data Flow

### 💾 Data Persistence
1. **Default Data**: Loaded from `modes.json`
2. **User Data**: Stored in device's document directory as `settings.json`
3. **State Management**: Global context for active configuration
4. **API Communication**: Real-time hardware control

### 🔄 User Workflow

1. **Welcome Screen**: Turn LED system on/off
2. **Settings Screen**: Browse existing configurations
3. **Create New**: Start with color editing
4. **Edit Existing**: Choose between colors or patterns
5. **Color Editor**: Modify colors with various tools
6. **Pattern Editor**: Select animation and adjust speed
7. **Preview**: Test settings before saving
8. **Flash**: Send to hardware for immediate use

## Development Guidelines

### 🛠️ Code Organization

- **Components**: Reusable UI elements in `app/components/`
- **Screens**: Main app screens in root `app/`
- **Shared Logic**: Utilities in `services/` and `app/context/`
- **Types**: Interfaces in `app/interface/`
- **Styling**: Centralized in `app/components/SharedStyles.ts`

### 🎨 Styling Standards

- Use `SharedStyles.ts` for common styles
- Reference `COLORS` and `FONTS` constants
- Responsive scaling with `DIMENSIONS.SCALE`
- Consistent button styles from shared library

### 🔌 API Integration

- Always use `ApiService` for API calls
- Handle errors consistently
- Use appropriate service methods for different operations
- Maintain state consistency between app and hardware

## Common Tasks

### 🎯 Adding a New Animation Pattern

1. Add pattern logic to `AnimatedDots.tsx`
2. Update pattern list in `Picker.tsx`
3. Add case to switch statement in animation effect
4. Test with different color schemes

### 🎨 Adding New Color Tools

1. Implement in `ColorEditor.tsx`
2. Add UI controls and handlers
3. Update gesture recognizers if needed
4. Ensure preview functionality works

### 🔧 Modifying API Integration

1. Update method in `ApiService.ts`
2. Update calling components
3. Test error handling
4. Verify hardware communication

## Hardware Integration

### 📡 API Endpoints

- **POST** `/api/config` - Send lighting configuration
- **GET** `/api/status` - Get current LED status
- **GET** `/api/led/on` - Turn LEDs on
- **GET** `/api/led/off` - Turn LEDs off

### 🎛️ Configuration Format

The app sends JSON configurations to the hardware with:
- `colors` - Array of 16 hex color strings
- `whiteValues` - Array of 16 white brightness values
- `brightnessValues` - Array of 16 overall brightness values  
- `effectNumber` - Animation pattern ID (0-11)
- `delayTime` - Animation timing in milliseconds

## Troubleshooting

### 🐛 Common Issues

- **Animation Bleeding**: Ensure proper cleanup in `AnimatedDots`
- **State Inconsistency**: Check `ConfigurationContext` usage
- **API Errors**: Verify network connectivity and endpoint configuration
- **Performance**: Monitor timeout cleanup and memory usage

### 🔍 Debugging Tips

- Check console logs for API responses
- Use React Developer Tools for state inspection
- Monitor network requests in development
- Test gesture recognizers on physical devices