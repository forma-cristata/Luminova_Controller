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

### 📁 **File Naming Convention**

The project follows a consistent naming pattern across all file types:

#### **Components & Screens** - `PascalCase`
- React components use PascalCase for both file names and component names
- Examples: `SettingBlock.tsx`, `ColorEditor.tsx`, `AnimatedDots.tsx`
- Screen components follow the same pattern: `Settings.tsx`, `Welcome.tsx`

#### **Services & Utilities** - `PascalCase`
- Service classes use PascalCase for consistency with components
- Examples: `ApiService.ts`, `SettingsService.ts`

#### **Interfaces & Types** - `PascalCase`
- TypeScript interfaces and type definitions use PascalCase
- Examples: `SettingInterface.ts`
- Interface names should be descriptive: `Setting` interface in `SettingInterface.ts`

#### **Hooks** - `camelCase`
- Custom React hooks use camelCase starting with "use"
- Examples: `useDebounce.ts`
- Hook function names match file names: `useDebounce()` function

#### **Configuration & Constants** - `camelCase`
- Configuration files and constants use camelCase
- Examples: `constants.ts`, `patterns.ts`, `defaults.ts`
- Export names use SCREAMING_SNAKE_CASE for constants: `FLASHING_PATTERNS`, `API_ENDPOINTS`

#### **Context** - `PascalCase`
- React Context files use PascalCase
- Examples: `ConfigurationContext.tsx`
- Context names should end with "Context": `ConfigurationContext`

### 🧩 **Component Creation Guidelines**

#### **1. File Structure**
```typescript
// ComponentName.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, COMMON_STYLES } from '@/src/components/SharedStyles';

interface ComponentNameProps {
  // Define props with proper TypeScript typing
  title: string;
  onPress?: () => void;
  disabled?: boolean;
}

export default function ComponentName({ title, onPress, disabled = false }: ComponentNameProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Use SharedStyles constants
    backgroundColor: COLORS.BACKGROUND,
  },
  title: {
    fontFamily: FONTS.SIGNATURE,
    color: COLORS.WHITE,
  },
});
```

#### **2. Import Organization**
```typescript
// External libraries first
import React from 'react';
import { View, Text } from 'react-native';
import { useFonts } from 'expo-font';

// Internal components
import BackButton from '@/src/components/BackButton';
import InfoButton from '@/src/components/InfoButton';

// Shared resources
import { COLORS, COMMON_STYLES } from '@/src/components/SharedStyles';

// Services and utilities
import { ApiService } from '@/src/services/ApiService';

// Types and interfaces
import type { Setting } from '@/src/interface/SettingInterface';
```

#### **3. Component Standards**
- **Props Interface**: Always define TypeScript interfaces for props
- **Default Props**: Use ES6 default parameters instead of defaultProps
- **Styling**: Use SharedStyles constants (COLORS, FONTS, DIMENSIONS)
- **Memoization**: Use React.memo() for performance-critical components
- **Error Handling**: Implement proper error boundaries and fallbacks

#### **4. State Management**
- **Local State**: Use useState for component-specific state
- **Global State**: Use ConfigurationContext for app-wide state
- **Side Effects**: Use useEffect with proper cleanup
- **Performance**: Use useCallback/useMemo for expensive operations

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

### 🎨 **Component Creation Standards**

#### **Adding a New Component**

1. **Choose Appropriate Location**
   ```
   src/components/     # Reusable UI components
   src/screens/        # Screen-level components
   ```

2. **Create Component File**
   - Use PascalCase: `NewComponent.tsx`
   - Include proper TypeScript interfaces
   - Follow established import organization

3. **Implement Component Structure**
   ```typescript
   // Required imports
   import React from 'react';
   import { StyleSheet } from 'react-native';
   import { COLORS, FONTS, COMMON_STYLES } from '@/src/components/SharedStyles';
   
   // Props interface
   interface NewComponentProps {
     title: string;
     onPress?: () => void;
   }
   
   // Component implementation
   export default function NewComponent({ title, onPress }: NewComponentProps) {
     // Component logic
   }
   
   // Styles using SharedStyles constants
   const styles = StyleSheet.create({
     // Component-specific styles
   });
   ```

4. **Follow Established Patterns**
   - Use `COMMON_STYLES` for consistent styling
   - Leverage `ApiService` for API communications
   - Use `ConfigurationContext` for global state
   - Implement proper TypeScript typing

5. **Export and Integration**
   - Export as default from component file
   - Import using absolute paths: `@/src/components/NewComponent`
   - Update documentation if component introduces new patterns

#### **Component Organization Principles**

- **Single Responsibility**: Each component should have one clear purpose
- **Composition**: Build complex UIs from simple, reusable components
- **Consistency**: Follow established visual and behavioral patterns
- **Performance**: Use memoization and proper key props
- **Accessibility**: Include proper accessibility props where needed

#### **Styling Guidelines**

- **Use SharedStyles**: Import and use `COLORS`, `FONTS`, `DIMENSIONS`
- **Responsive Design**: Use `DIMENSIONS.SCALE` for responsive sizing
- **Consistent Spacing**: Follow established margin/padding patterns
- **Dark Theme**: All components should work with the dark color scheme

#### **Component Testing**

- Test component in both animated and static modes
- Verify proper prop handling and TypeScript compliance
- Test integration with existing navigation flow
- Validate performance with large datasets

### 📚 **Documentation Maintenance**
- Update this guide when adding new components or patterns
- Document new shared utilities or optimization techniques
- Keep animation pattern lists current
- Maintain accuracy of component relationships

## Project Structure

```
react-code/
├── src/                          # Main application code
│   ├── components/               # Reusable UI components (PascalCase)
│   │   ├── AnimatedDots.tsx     # Animation preview component
│   │   ├── FlashButton.tsx      # Reusable flash button component
│   │   ├── SettingBlock.tsx     # Setting display component
│   │   ├── SharedStyles.ts      # Centralized styling constants
│   │   └── ...
│   ├── configurations/           # App configuration (camelCase)
│   │   ├── constants.ts         # API endpoints and app constants
│   │   ├── patterns.ts          # Animation pattern definitions
│   │   ├── defaults.ts          # Default settings data
│   │   └── ...
│   ├── context/                  # React Context providers (PascalCase)
│   │   ├── ConfigurationContext.tsx
│   │   └── ...
│   ├── hooks/                    # Custom React hooks (camelCase)
│   │   ├── useDebounce.ts
│   │   └── ...
│   ├── interface/                # TypeScript interfaces (PascalCase)
│   │   ├── SettingInterface.ts
│   │   └── ...
│   ├── screens/                  # Main application screens (PascalCase)
│   │   ├── Settings.tsx         # Main settings management
│   │   ├── ColorEditor.tsx      # Color editing interface
│   │   ├── Welcome.tsx          # Entry point screen
│   │   └── ...
│   └── services/                 # API and service layers (PascalCase)
│       ├── ApiService.ts        # Hardware API communication
│       ├── SettingsService.ts   # Settings data management
│       └── ...
├── assets/                       # Static assets
│   ├── fonts/                   # Custom fonts
│   └── images/                  # App icons and images
├── docs/                        # Documentation
│   └── CODEBASE_GUIDE.md       # This guide
└── [config files]              # Build and configuration files
```

### 📁 **Directory Guidelines**

- **components/**: Reusable UI elements that can be used across multiple screens
- **screens/**: Full-screen components that represent app pages
- **services/**: Business logic and external API communication
- **configurations/**: App constants, default data, and configuration
- **context/**: React Context for global state management
- **hooks/**: Custom React hooks for reusable logic
- **interface/**: TypeScript type definitions and interfaces

## Main Application Screens

### 📱 Screen Navigation Flow

```
Welcome → Settings → ChooseModification → [ColorEditor | FlashingPatternEditor]
```

#### `src/screens/Welcome.tsx`
- **Purpose**: Entry point with LED on/off toggle
- **Features**: 
  - Animated text display
  - LED status fetching and control
  - Navigation to Settings
- **API Integration**: Uses `ApiService` for status and LED control

#### `src/screens/Settings.tsx`
- **Purpose**: Main settings management screen
- **Features**:
  - Carousel view of all lighting configurations
  - Create, duplicate, and delete settings
  - Setting preview with animated dots
- **Data Management**: Handles local storage of settings via `FileSystem`

#### `src/screens/ChooseModification.tsx`
- **Purpose**: Choice screen for editing colors vs flashing patterns
- **Layout**: Split-screen design (left: patterns, right: colors)

#### `src/screens/ColorEditor.tsx`
- **Purpose**: Advanced color editing interface
- **Features**:
  - 16-dot color grid (2 rows of 8)
  - HSV color picker with sliders
  - Hex input with validation
  - Gesture controls (swipe to copy/reverse rows)
  - Preview functionality
  - **Name editing for both new and existing settings**
- **Modes**: Handles both new setting creation and existing setting editing
- **Identification**: Uses index-based setting identification for consistency

#### `src/screens/FlashingPatternEditor.tsx`
- **Purpose**: Animation pattern and timing configuration
- **Features**:
  - Pattern picker with 12 different animations
  - BPM-based speed control
  - Real-time preview
  - **Name editing for both new and existing settings**
- **Patterns**: Supports 12 distinct animation patterns (0-11)
- **Identification**: Uses index-based setting identification for consistency

## Component Library

### 🎨 Dot Components

#### `src/components/Dot.tsx`
- **Purpose**: Single LED representation
- **Props**: `color`, `id`
- **Usage**: Building block for all dot displays

#### `src/components/ColorDots.tsx`
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

#### `src/components/AnimatedDots.tsx`
- **Purpose**: Animated dot patterns for previewing effects
- **Features**:
  - 12 different animation patterns
  - Proper cleanup and state isolation
  - Timeout management to prevent memory leaks
- **Animations**: Blender, Christmas, Comfort Song, Funky, Mold, Progressive, Still, Strobe Change, Techno, Trace Many, Trace One, Trance

### 🎛️ Control Components

#### `src/components/Picker.tsx`
- **Purpose**: Scrollable pattern selection
- **Features**:
  - 12 predefined patterns with friendly names
  - Auto-scroll to selected pattern
  - Visual feedback for selection

#### `src/components/HueSliderBackground.tsx`
- **Purpose**: Rainbow background for hue slider
- **Implementation**: Gradient background component

#### `src/components/InfoButton.tsx`
- **Purpose**: Reusable info button across all screens
- **Design**: Consistent positioning and styling

#### `src/components/FlashButton.tsx`
- **Purpose**: Reusable flash button component for sending settings to hardware
- **Features**:
  - API integration via ApiService
  - Customizable styling and text
  - Success/error callback support
  - Configuration context integration
- **Props**: `setting`, `style`, `disabled`, `onPress`, `onSuccess`, `onError`, `textStyle`

### 📱 Layout Components

#### `src/components/SettingBlock.tsx`
- **Purpose**: Setting display component used in carousel
- **Modes**:
  - **Animated**: Full display with Edit/Flash buttons
  - **Static**: Simplified preview for carousel
- **Features**: Uses FlashButton component for hardware communication

## Shared Resources

### 🎨 Styling System

#### `src/components/SharedStyles.ts`
- **Purpose**: Centralized styling constants and common styles
- **Contents**:
  - Color palette (`COLORS`)
  - Font definitions (`FONTS`)
  - Screen dimensions (`DIMENSIONS`)
  - Common button styles
  - Shared layout components

### 🌐 API Integration

#### `src/services/ApiService.ts`
- **Purpose**: Centralized API communication layer
- **Methods**:
  - `flashSetting()` - Send configuration to hardware
  - `previewSetting()` - Temporary preview
  - `restoreConfiguration()` - Restore previous state
  - `getStatus()` - Get LED on/off status
  - `toggleLed()` - Control LED power
- **Benefits**: Consistent error handling, type safety, centralized logging

### 🔄 State Management

#### `src/context/ConfigurationContext.tsx`
- **Purpose**: Global state management for current configuration
- **State**:
  - `currentConfiguration` - Active LED configuration
  - `lastEdited` - Index of last edited setting
- **Usage**: Shared across all screens for state consistency

### 📊 Data Models

#### `src/interface/SettingInterface.ts`
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

#### `src/configurations/constants.ts`
- **Purpose**: Environment and API configuration
- **Contains**: API endpoint (`IP`), hardware communication settings

#### `src/configurations/modes.json`
- **Purpose**: Default lighting presets
- **Contents**: 12 pre-configured lighting schemes
- **Usage**: Loaded as fallback when no user settings exist

## Navigation System

### 🧭 Navigation Structure

#### `src/screens/index.tsx`
- **Purpose**: Root navigation configuration
- **Stack Navigator**: 
  - Welcome
  - Settings  
  - ChooseModification
  - ColorEditor (with `isNew` parameter)
  - FlashingPatternEditor (with `isNew` parameter)
  - Info

#### Navigation Parameters
- **ColorEditor**: `{ setting: Setting, isNew?: boolean, settingIndex?: number }`
- **FlashingPatternEditor**: `{ setting: Setting, isNew?: boolean, settingIndex?: number }`
- **ChooseModification**: `{ setting: Setting, settingIndex: number }`

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

## Established Patterns & Conventions

### 🎨 **UI/UX Patterns**

#### **Color System**
- **Primary**: Black background (`#000000`) for all screens
- **Text**: White (`#FFFFFF`) for all text elements
- **Accents**: Red (`#FF0000`) for sliders and interactive elements
- **Disabled**: 50% opacity for disabled states
- **Error**: Red tinting for error states

#### **Typography**
- **Headers**: `Thesignature` font for titles and branding
- **Body**: `Clearlight-lJlq` font for UI text and labels
- **Consistent Sizing**: Use scale-based sizing for responsive design

#### **Layout Patterns**
- **SafeAreaView**: Used on all screens for proper device compatibility
- **InfoButton**: Positioned consistently in top-left corner
- **BackButton**: Positioned consistently in top-left corner (when applicable)
- **Responsive Scaling**: All components scale based on screen dimensions

### 🧩 **Component Patterns**

#### **State Management**
```typescript
// Local component state
const [value, setValue] = useState<Type>(initialValue);

// Global state access
const { currentConfiguration, setLastEdited } = useConfiguration();

// Debounced values for performance
const debouncedValue = useDebounce(value, 200);
```

#### **API Integration**
```typescript
// Always use ApiService for API calls
try {
  await ApiService.flashSetting(setting);
  console.log("Operation successful");
} catch (error) {
  console.error("Operation failed:", error);
}
```

#### **Event Handling**
```typescript
// Memoized callbacks for performance
const handlePress = useCallback(() => {
  // Handle action
}, [dependencies]);

// Throttled operations for sliders
const throttledUpdate = useMemo(() => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (value: number) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      updateValue(value);
    }, 50);
  };
}, []);
```

#### **FlashButton Usage**
```typescript
// Basic usage with default styling
<FlashButton setting={setting} />

// Custom styling and callbacks
<FlashButton
  setting={setting}
  style={COMMON_STYLES.styleAButton}
  textStyle={customTextStyle}
  onSuccess={(setting) => console.log(`Flashed: ${setting.name}`)}
  onError={(error) => Alert.alert("Flash Error", error.message)}
  disabled={!setting}
/>
```

### 🎭 **Animation Patterns**

#### **Dot Animations**
- **Cleanup**: Always clear timeouts on component unmount
- **State Isolation**: Each animation maintains its own state
- **Performance**: Use requestAnimationFrame for smooth animations

#### **Carousel Navigation**
- **Smooth Transitions**: Use react-native-reanimated-carousel
- **State Persistence**: Maintain scroll position across navigation
- **Performance**: Memoize render items and data

### 🔧 **Service Patterns**

#### **Settings Management**
```typescript
// Always use SettingsService for data operations
const settings = await SettingsService.loadSettings();
await SettingsService.saveSettings(updatedSettings);
const updated = await SettingsService.updateSetting(index, setting);
```

#### **Error Handling**
```typescript
// Consistent error handling pattern
try {
  const result = await apiOperation();
  return result;
} catch (error) {
  console.error("Operation description:", error);
  // Optional: Show user-friendly error message
  Alert.alert("Error", "User-friendly error message");
  throw error; // Re-throw if needed by caller
}
```

### 📱 **Navigation Patterns**

#### **Parameter Passing**
```typescript
// Type-safe navigation parameters
navigation.navigate("ScreenName", {
  setting: setting,
  isNew: boolean,
  settingIndex: number,
});

// Parameter extraction in target screen
const setting = route.params?.setting;
const isNew = route.params?.isNew || false;
const settingIndex = route.params?.settingIndex;
```

#### **Back Navigation**
```typescript
// Consistent back button behavior
<BackButton 
  beforePress={() => cleanupOperations()}
  onPress={() => navigation.goBack()}
  afterPress={() => resetState()}
/>
```

### 🎨 **Styling Patterns**

#### **Component Styles**
```typescript
// Use SharedStyles constants
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
  text: {
    color: COLORS.WHITE,
    fontFamily: FONTS.CLEAR,
    fontSize: 20 * DIMENSIONS.SCALE,
  },
  button: {
    ...COMMON_STYLES.styleAButton,
    // Component-specific overrides
  },
});
```

#### **Responsive Design**
```typescript
// Scale-based responsive sizing
const { width, height } = Dimensions.get("window");
const scale = Math.min(width, height) / 375;

const styles = StyleSheet.create({
  element: {
    width: 100 * scale,
    height: 50 * scale,
    fontSize: 16 * scale,
  },
});
```

### 🔄 **Data Flow Patterns**

#### **Configuration Updates**
```typescript
// Update pattern for settings
const updatedSetting = {
  ...existingSetting,
  modifiedProperty: newValue,
};

await SettingsService.updateSetting(index, updatedSetting);
setLastEdited(index.toString());
```

#### **Preview Functionality**
```typescript
// Consistent preview pattern
const handlePreview = async () => {
  try {
    setPreviewMode(true);
    await ApiService.previewSetting(setting);
  } catch (error) {
    console.error("Preview error:", error);
  }
};

const handleUnpreview = async () => {
  setPreviewMode(false);
  if (currentConfiguration) {
    await ApiService.restoreConfiguration(currentConfiguration);
  }
};
```

## Development Guidelines

### 🛠️ Code Organization

- **Components**: Reusable UI elements in `src/components/` (PascalCase)
- **Screens**: Main app screens in `src/screens/` (PascalCase)
- **Services**: Business logic in `src/services/` (PascalCase)
- **Hooks**: Custom hooks in `src/hooks/` (camelCase)
- **Types**: Interfaces in `src/interface/` (PascalCase)
- **Configuration**: Constants in `src/configurations/` (camelCase)
- **Context**: Global state in `src/context/` (PascalCase)
- **Styling**: Centralized in `src/components/SharedStyles.ts`

### 🎨 Styling Standards

- Use `SharedStyles.ts` for common styles and constants
- Reference `COLORS`, `FONTS`, and `DIMENSIONS` from SharedStyles
- Responsive scaling with `DIMENSIONS.SCALE`
- Consistent button styles from `COMMON_STYLES`
- Dark theme compatibility throughout

### 🔌 API Integration

- Always use `ApiService` for API calls
- Handle errors consistently across all service methods
- Use appropriate service methods for different operations
- Maintain state consistency between app and hardware
- Follow the established request/response patterns

### 📝 Naming Conventions Summary

| File Type | Convention | Example |
|-----------|------------|---------|
| Components | PascalCase | `SettingBlock.tsx` |
| Screens | PascalCase | `ColorEditor.tsx` |
| Services | PascalCase | `ApiService.ts` |
| Hooks | camelCase | `useDebounce.ts` |
| Interfaces | PascalCase | `SettingInterface.ts` |
| Configuration | camelCase | `constants.ts` |
| Context | PascalCase | `ConfigurationContext.tsx` |

### 🔄 Import Path Standards

- **Absolute Imports**: Use `@/src/` prefix for all internal imports
- **External Libraries**: Import from node_modules normally
- **Type Imports**: Use `import type` for TypeScript types
- **Consistent Ordering**: External → Internal → Types → Relative

Example:
```typescript
import React from 'react';
import { View, Text } from 'react-native';
import BackButton from '@/src/components/BackButton';
import { COLORS } from '@/src/components/SharedStyles';
import type { Setting } from '@/src/interface/SettingInterface';
```

## Common Tasks

### 🎯 Adding a New Animation Pattern

1. Add pattern logic to `AnimatedDots.tsx`
2. Update pattern list in `patterns.ts` configuration
3. Add case to switch statement in animation effect
4. Test with different color schemes
5. Update documentation with pattern description

### 🎨 Adding New Color Tools

1. Implement in `ColorEditor.tsx` following component standards
2. Add UI controls using SharedStyles constants
3. Update gesture recognizers if needed
4. Ensure preview functionality works with ApiService
5. Test across different screen sizes

### 🔧 Modifying API Integration

1. Update method in `ApiService.ts` with proper typing
2. Update calling components to use new API
3. Test error handling and edge cases
4. Verify hardware communication
5. Update documentation if endpoints change

### 🧩 Creating a New Component

1. **File Creation**: Use PascalCase naming (`NewComponent.tsx`)
2. **Location**: Choose appropriate directory (`components/` or `screens/`)
3. **Structure**: Follow established component template
4. **Styling**: Use SharedStyles constants and patterns
5. **Types**: Define proper TypeScript interfaces
6. **Testing**: Verify integration and performance
7. **Documentation**: Update this guide if introducing new patterns

### 📱 Adding a New Screen

1. **File Creation**: Create in `src/screens/` with PascalCase naming
2. **Navigation**: Add to navigation stack in `index.tsx`
3. **Parameters**: Define proper navigation parameter types
4. **Layout**: Use established screen layout patterns
5. **State**: Integrate with ConfigurationContext if needed
6. **Styling**: Follow responsive design patterns
7. **Testing**: Test navigation flow and state management

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
- **SafeAreaProvider Nesting Error**: This app uses a global SafeAreaProvider from expo-router. Individual screens should ONLY use `SafeAreaView`, not wrap content in additional `SafeAreaProvider` components, as this causes context conflicts and crashes during carousel navigation.

### ⚠️ Common Warnings
- **`EDGE_TO_EDGE_PLUGIN` on Android**: This warning appears when the app does not properly resize when the software keyboard is shown. To resolve this, add `"softwareKeyboardLayoutMode": "resize"` to the `android` configuration in `app.json`. This ensures the UI adapts to the keyboard, preventing it from obscuring input fields.
- **`RNCSafeAreaProvider` Stack Trace**: This error occurs when multiple SafeAreaProviders are nested. Ensure only one SafeAreaProvider exists at the app root level.

### 🔍 Debugging Tips

- Check console logs for API responses
- Use React Developer Tools for state inspection
- Monitor network requests in development
- Test gesture recognizers on physical devices