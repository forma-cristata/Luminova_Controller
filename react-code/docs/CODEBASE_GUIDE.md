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
- **Conditional Rendering**: Always use ternary operators (`? :`) instead of logical AND (`&&`) for JSX conditional rendering
- **Keyboard Management**: All screens with `TextInput` components should be wrapped in a `TouchableWithoutFeedback` component to dismiss the keyboard when tapping outside the input.

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

### ⌨️ **Keyboard Handling**

To ensure a consistent user experience, all screens containing `TextInput` components must implement a mechanism to dismiss the keyboard when the user taps outside of the input field.

**✅ Correct Pattern:**
```typescript
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

// Wrap the entire screen's content in TouchableWithoutFeedback
export default function ScreenWithInput() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView>
        {/* ... other components ... */}
        <TextInput />
        {/* ... other components ... */}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
```

**Why this is important:**
- **Prevents UI Obstruction**: Ensures the keyboard doesn't permanently cover other interactive elements.
- **Consistent Behavior**: Provides a predictable way for users to dismiss the keyboard across all input screens.
- **Improved Usability**: A simple tap anywhere is an intuitive gesture for dismissing the keyboard.

### 🎨 **Conditional Rendering Standards**

#### **Always Use Ternary Operators**
The codebase follows a strict standard of using ternary operators (`? :`) instead of logical AND (`&&`) for all JSX conditional rendering.

**✅ Correct Pattern:**
```typescript
// For simple conditional rendering
{condition ? <Component /> : null}

// For conditional content with fallback
{condition ? <ActiveComponent /> : <FallbackComponent />}

// For complex conditional blocks
{condition ? (
  <>
    <Component1 />
    <Component2 />
  </>
) : null}
```

**❌ Avoid This Pattern:**
```typescript
// Don't use logical AND operators
{condition && <Component />}
{condition && (
  <>
    <Component1 />
    <Component2 />
  </>
)}
```

#### **Benefits of Ternary Operators**
- **Explicit null handling**: Makes it clear what happens when condition is false
- **Type safety**: Better TypeScript inference and error detection
- **Consistency**: Uniform pattern across all conditional rendering
- **Readability**: Clearer intent for both true and false conditions

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
- **Conditional Rendering**: Use ternary operators (`? :`) instead of logical AND (`&&`) for all JSX conditional rendering

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
│   │   ├── EditButton.tsx       # Reusable edit button component
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
├── utils/                        # Utility functions (camelCase)
│   ├── settingUtils.ts          # Setting ID generation and utilities
│   └── ...
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
- **utils/**: Utility functions and helper methods
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

## Recent Optimizations & Component Consolidation

### ✅ **Button Architecture Refactoring (Latest)**
- **Organized Structure**: Moved all button components to `src/components/buttons/` directory
- **Base Component**: Created `Button.tsx` as the foundation for all button components
  - Handles common styling (font, border, basic structure)
  - Supports variants: `default`, `wide`, `welcome`
  - Centralized opacity and disabled state logic
- **Specialized Components**: All button types now extend the base Button component
  - `ActionButton`: Reset/Save/Preview actions with variant support
  - `EditButton`: Navigation to setting modification
  - `FlashButton`: Hardware communication with API integration
  - `ColorButton`: White/Black color presets
  - `CreateButton`: "+" new setting creation
  - `BackButton`, `InfoButton`, `MetronomeButton`, `RandomizeButton`: Icon-based actions
- **Import Cleanup**: Updated all imports to use new `buttons/` directory structure
- **Index Export**: Added `buttons/index.ts` for cleaner imports
- **Benefits**: Consistent styling foundation, reduced code duplication, organized structure

### ✅ **Previous Optimizations**
- **ActionButton**: Consolidated repetitive Reset/Save/Preview button patterns across ColorEditor and FlashingPatternEditor
  - Eliminated 12+ lines of repetitive TouchableOpacity code per button
  - Centralized opacity/disabled state logic
  - Consistent styling with variant support
- **ColorButton**: Unified White/Black color preset buttons in ColorEditor
  - Removed duplicate styling definitions
  - Scale-responsive design
  - Centralized color logic
- **Deprecated Code Removal**: Cleaned up unused button styles and imports
- **Benefits**: Reduced code duplication by ~60 lines, improved maintainability, consistent UI behavior

### ✅ **Previous Optimizations**
- **InfoButton component**: Reusable across all screens
- **SharedStyles system**: Centralized theming and styling constants
- **Button style consolidation**: Consistent UI patterns
- **API service layer**: Unified error handling and communication
- **Animation state isolation**: Prevents state bleeding between components
- **EditButton & FlashButton**: Reusable action components with callback support

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

#### `src/components/ActionButton.tsx`
- **Purpose**: Reusable action button component for common operations (Reset, Save, Preview, etc.)
- **Features**:
  - Consistent styling with COMMON_STYLES
  - Built-in disabled/opacity state handling
  - Variant support (primary, disabled, preview)
  - Customizable style and text overrides
- **Props**: `title`, `onPress`, `disabled`, `variant`, `style`, `textStyle`, `opacity`

#### `src/components/ColorButton.tsx`
- **Purpose**: Reusable color selection button component for White/Black color presets
- **Features**:
  - Predefined white and black color styling
  - Scale-responsive design
  - Consistent with color picker interface
  - Disabled state support
- **Props**: `color`, `onPress`, `disabled`, `style`, `textStyle`, `scale`

#### `src/components/EditButton.tsx`
- **Purpose**: Reusable edit button component for navigating to setting modification
- **Usage**: Now primarily used in compact layout carousel items; focused settings use direct touch interaction
- **Features**:
  - Navigation integration with parameter passing
  - Configuration context integration
  - Customizable styling and text
  - Consistent behavior across components
- **Props**: `navigation`, `setting`, `settingIndex`, `style`, `disabled`, `onPress`, `textStyle`

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
- **Purpose**: Setting display component used in carousel and focused settings
- **Modes**:
  - **Full Layout** (`layout="full"`): Fully interactive touchable setting block for focused view
    - Entire block is touchable via TouchableOpacity
    - Displays setting name, dots preview, and "tap to edit" hint
    - Tapping anywhere navigates to ChooseModification screen
    - Visual feedback with activeOpacity on touch
  - **Compact Layout** (`layout="compact"`): Simplified preview for carousel items
    - Static display with FlashButton for quick actions
    - Used in Settings screen carousel
- **Features**: 
  - Direct edit functionality - entire focused block acts as edit trigger
  - Integrated ConfigurationContext for state management
  - Responsive touch area that fills entire container
- **Optimizations**: 
  - Memoized dots rendering with specific dependencies to prevent unnecessary re-renders
  - Unique keys for AnimatedDots components to ensure proper lifecycle management
  - Fixed carousel animation freezing after navigation by improving memoization dependencies
  - TouchableOpacity with explicit dimensions for reliable touch registration

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

### 🔑 Key Management & Component Stability

#### `src/utils/settingUtils.ts`
- **Purpose**: Stable ID generation for React component keys
- **Critical Rule**: **NEVER use array indices for component keys**
- **Methods**:
  - `getStableSettingId(setting)` - Generate content-based stable IDs
  - `generateUniqueSettingId()` - Create unique IDs for new settings

#### **Why Stable Keys Matter**
Using array indices as React keys is an anti-pattern that causes:
- ❌ Text rendering errors during scrolling ("Text strings must be rendered within a <Text> component")
- ❌ Component state loss during list reordering
- ❌ Unnecessary re-renders and performance issues
- ❌ React reconciliation problems

#### **Stable Key Generation Algorithm**
```typescript
export const getStableSettingId = (setting: Setting): string => {
  if (setting.id) {
    return setting.id; // Use existing ID if available
  }
  
  // Create deterministic ID based on setting content
  const content = `${setting.name}-${setting.colors.join(',')}-${setting.delayTime}-${setting.flashingPattern}`;
  
  // Simple string hash for consistent ID generation
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return `setting-${Math.abs(hash)}`;
};
```

#### **Key Management Best Practices**

**✅ Correct Key Usage:**
```typescript
// Use stable, content-based keys
{settingsData.map(item => (
  <SettingBlock
    key={getStableSettingId(item)}  // ✅ Stable, unique key
    setting={item}
    // ... other props
  />
))}
```

**❌ Avoid These Patterns:**
```typescript
// Don't use array indices
{settingsData.map((item, index) => (
  <SettingBlock
    key={index}  // ❌ Bad: causes re-render issues
    key={`item-${index}`}  // ❌ Bad: still index-based
    // ... props
  />
))}

// Don't use unstable generators
{settingsData.map(item => (
  <SettingBlock
    key={Math.random()}  // ❌ Bad: changes every render
    key={new Date().getTime()}  // ❌ Bad: unstable
    // ... props
  />
))}
```

#### **Updated Setting Interface**
```typescript
interface Setting {
  id?: string; // Optional unique identifier for stable keys
  name: string;
  colors: string[];
  whiteValues: number[];
  brightnessValues: number[];
  flashingPattern: string;
  delayTime: number;
}
```

#### **Implementation Examples**
```typescript
// In SettingBlock.tsx
import { getStableSettingId } from "@/src/utils/settingUtils";

const SettingBlock = ({ setting, ... }) => {
  const stableId = getStableSettingId(setting);
  
  const dotsRendered = React.useMemo(() => {
    return isAnimated ? (
      <AnimatedDots key={`animated-${stableId}`} />
    ) : (
      <ColorDots key={`static-${stableId}`} />
    );
  }, [stableId, ...]);
};

// In Settings.tsx
const renderItem = ({ item }) => (
  <SettingBlock
    key={getStableSettingId(item)}
    setting={item}
  />
);
```

#### **Benefits of This Approach**
- ✅ **Eliminates text rendering errors** during scrolling
- ✅ **Maintains component state** during list updates
- ✅ **Improves performance** by preventing unnecessary re-renders
- ✅ **Provides deterministic behavior** across app sessions
- ✅ **Follows React best practices** for key management
- ✅ **Centralized utility** for consistent ID generation across codebase

#### **🚨 CRITICAL DEBUGGING LESSONS - AI STUPIDITY PREVENTION 🚨**

**The "Text strings must be rendered within a <Text> component" Error:**

This error is caused by TWO main issues that must BOTH be fixed:

1. **Logical AND (`&&`) in JSX conditional rendering**
2. **Array indices used in React component keys**

**🔥 REAL DEBUGGING SESSION EXAMPLE (August 2025):**

**The Problem:** User reported the text rendering error when tapping "create" button.

**AI's Epic Failure Process:**
1. ✅ **Correctly identified** logical AND in Settings.tsx and fixed it
2. ❌ **Found the real issue** in AnimatedDots.tsx but then proceeded to be completely stupid
3. ❌ **Ignored the existing `getStableSettingId` utility** that was RIGHT THERE in the codebase
4. ❌ **Created increasingly complex key generation schemes** while still using array indices
5. ❌ **Added unnecessary complexity** (color hashes, position calculations) instead of using the simple utility
6. ❌ **Required user to literally spell it out** multiple times before understanding

**🎯 THE SIMPLE SOLUTION THAT TOOK FOREVER TO REACH:**

**Before (WRONG):**
```tsx
// AnimatedDots.tsx - CAUSES ERRORS
{dotColors && Array.isArray(dotColors) // ❌ Logical AND
  ? dotColors.map((color, index) => (
      <Dot 
        key={`dot-${index}`}  // ❌ ARRAY INDEX IN KEY!
        color={color} 
        id={`dot_${index + 1}`}  // ❌ NO IDS IN REACT NATIVE!
      />
    ))
  : null}
```

**After (CORRECT):**
```tsx
// AnimatedDots.tsx - FIXED
{dotColors 
  ? Array.isArray(dotColors) 
    ? dotColors.map((color, index) => (
        <Dot 
          key={getStableSettingId(setting)}  // ✅ USE THE UTILITY FUNCTION!
          color={color} 
        />
      ))
    : null
  : null}
```

**🔥 KEY LESSONS FOR FUTURE AIs:**

1. **USE THE EXISTING UTILITIES** - Don't reinvent the wheel when `getStableSettingId` exists
2. **NO ARRAY INDICES IN KEYS** - Ever. Period. Use content-based stable IDs
3. **NO LOGICAL AND (`&&`) IN JSX** - Always use ternary operators for conditional rendering
4. **NO DOM IDS IN REACT NATIVE** - There are no DOM elements, remove all `id` props
5. **SIMPLE IS BETTER** - Don't overcomplicate key generation with hashes and calculations
6. **READ THE EXISTING CODE** - The solution was already implemented in the utils

**🎯 The Ultimate Rule:** 
When debugging React key issues, just use `getStableSettingId(setting)` and move on. Don't be clever.

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
  - `id` - (Optional) Unique identifier for stable React keys
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

## Build Configuration

### 🎨 Splash Screen Setup

The app uses a custom splash screen (`./assets/images/splash-screen.png`) that displays while the app loads fonts and initializes. The splash screen is configured for both iOS and Android platforms.

#### **Configuration in `app.json`:**

```json
{
  "expo": {
    "splash": {
      "image": "./assets/images/splash-screen.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    },
    "ios": {
      "splash": {
        "image": "./assets/images/splash-screen.png",
        "resizeMode": "contain",
        "backgroundColor": "#000000"
      }
    },
    "android": {
      "splash": {
        "image": "./assets/images/splash-screen.png",
        "resizeMode": "contain",
        "backgroundColor": "#000000"
      }
    },
    "plugins": [
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-screen.png",
          "resizeMode": "contain",
          "backgroundColor": "#000000"
        }
      ]
    ]
  }
}
```

#### **Implementation in Code:**

- **`App.tsx`**: Main entry point that handles splash screen visibility and font loading
- **`src/screens/index.tsx`**: Navigation setup wrapped by splash screen logic
- **Font Loading**: Custom fonts are loaded before hiding the splash screen
- **Error Handling**: Splash screen hides on both successful font loading and errors

#### **Development Notes:**

- Run `npx expo prebuild --clean` after splash screen changes to regenerate native files
- Splash screen image should be optimized for both iOS and Android display densities
- Background color (`#000000`) matches the app's dark theme
- `resizeMode: "contain"` ensures the image scales properly on all screen sizes

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
- **Body**: `Clearlight` font for UI text and labels
- **Consistent Sizing**: Use scale-based sizing for responsive design

#### **Layout Patterns**
- **SafeAreaView**: Used on all screens for proper device compatibility
- **InfoButton**: Positioned consistently in top-left corner
- **BackButton**: Positioned consistently in top-left corner (when applicable)
- **Responsive Scaling**: All components scale based on screen dimensions

#### **Touch Interaction Patterns**
- **Focused Settings**: Entire setting block is touchable for editing
  - TouchableOpacity with `activeOpacity={0.8}` for visual feedback
  - "tap to edit" hint text at bottom of focused settings
  - Full container dimensions for reliable touch registration
- **Carousel Items**: Traditional button-based interactions
  - EditButton for navigation to modification screens
  - FlashButton for quick hardware actions
- **Responsive Touch Areas**: All interactive elements have explicit dimensions for consistent touch response
- **Visual Feedback**: All touchable elements provide immediate visual feedback through opacity changes

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

#### **ActionButton Usage**
```typescript
// Basic usage for standard actions
<ActionButton 
  title="Save"
  onPress={handleSave}
  disabled={!hasChanges}
/>

// With custom opacity and variant
<ActionButton
  title="Reset"
  onPress={handleReset}
  disabled={!hasChanges}
  opacity={hasChanges ? 1 : COLORS.DISABLED_OPACITY}
/>

// Preview button with dynamic text and variant
<ActionButton
  title={previewMode ? (hasChanges ? "Update" : "Preview") : "Preview"}
  onPress={() => {
    previewAPI();
    setPreviewMode(true);
  }}
  variant={!hasChanges && previewMode ? "disabled" : "primary"}
/>
```

#### **ColorButton Usage**
```typescript
// White color preset button
<ColorButton
  color="white"
  disabled={selectedDot === null}
  onPress={() => {
    if (selectedDot !== null) {
      handleHexInput("FFFFFF");
    }
  }}
  scale={scale}
/>

// Black color preset button
<ColorButton
  color="black"
  disabled={selectedDot === null}
  onPress={() => {
    if (selectedDot !== null) {
      handleHexInput("000000");
    }
  }}
  scale={scale}
/>
```

#### **EditButton Usage**
```typescript
// Basic usage with navigation
<EditButton 
  navigation={navigation}
  setting={setting}
  settingIndex={index}
/>

// Custom styling and callbacks
<EditButton
  navigation={navigation}
  setting={setting}
  settingIndex={index}
  style={COMMON_STYLES.styleAButton}
  textStyle={customTextStyle}
  onPress={() => console.log("Edit button pressed")}
  disabled={!setting}
/>
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
- **Memoization**: Use specific dependencies instead of whole objects to prevent unnecessary re-renders
- **Component Keys**: Use unique keys for AnimatedDots to ensure proper lifecycle management

#### **Carousel Navigation**
- **Smooth Transitions**: Use react-native-reanimated-carousel
- **State Persistence**: Maintain scroll position across navigation
- **Performance**: Memoize render items and data
- **Animation Continuity**: Fixed animation freezing after navigation with improved memoization patterns

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
- **Carousel Animation Freezing**: After navigation, animated dots in carousel may stop rendering. Fixed by using unique keys and proper memoization dependencies in `SettingBlock.tsx`
- **Touch Registration Issues**: If TouchableOpacity doesn't respond across entire component area, ensure explicit width/height dimensions. Use `width: "100%", height: "100%"` in style and verify parent container has proper dimensions.
- **SafeAreaProvider Nesting Error**: This app uses a global SafeAreaProvider from expo-router. Individual screens should ONLY use `SafeAreaView`, not wrap content in additional `SafeAreaProvider` components, as this causes context conflicts and crashes during carousel navigation.

### ⚠️ Common Warnings
- **`EDGE_TO_EDGE_PLUGIN` on Android**: This warning appears when the app does not properly resize when the software keyboard is shown. To resolve this, add `"softwareKeyboardLayoutMode": "resize"` to the `android` configuration in `app.json`. This ensures the UI adapts to the keyboard, preventing it from obscuring input fields.
- **`RNCSafeAreaProvider` Stack Trace**: This error occurs when multiple SafeAreaProviders are nested. Ensure only one SafeAreaProvider exists at the app root level.

### 🔍 Debugging Tips

- Check console logs for API responses
- Use React Developer Tools for state inspection
- Monitor network requests in development
- Test gesture recognizers on physical devices