# Luminova Controller
React Native LED controller app for managing custom lighting patterns through REST API.
[Download for iOS](https://apps.apple.com/us/app/luminova-interface/id6751150571)
[Download for Android](https://expo.dev/accounts/forma-cristata/projects/Luminova_Controller/builds/38d59bc2-59c8-45bb-918e-5621e26b41a1)

## Features
- 16-dot LED grid with 12 animation patterns
- HSV color picker with real-time preview
- REST API hardware communication
- FileSystem persistence & context state management
## Architecture
**Stack:** React Native + TypeScript, Expo SDK 53, React Navigation, Reanimated
**Flow:** Welcome → Settings → Editor screens

## Documentation
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Development standards and guidelines
- **[docs/README.md](./docs/README.md)** - Comprehensive documentation structure
- **[docs/ROOT.md](./docs/ROOT.md)** - Root configuration files reference
- **[docs/src/SRC.md](./docs/src/SRC.md)** - Source code architecture overview
```
luminova/
├── src/                          # Main application code
│   ├── components/               # Reusable UI components
│   │   ├── animations/          # Animation-specific components
│   │   ├── audio/               # Audio measurement components
│   │   ├── buttons/             # Button components
│   │   ├── color-picker/        # Color selection components
│   │   ├── common/              # Common shared components
│   │   ├── settings/            # Settings management components
│   │   └── welcome/             # Welcome screen components
│   ├── configurations/           # App configuration
│   │   ├── constants.ts         # API endpoints and app constants
│   │   ├── patterns.ts          # Animation pattern definitions
│   │   └── defaults.ts          # Default settings data
│   ├── context/                  # React Context providers
│   │   └── ConfigurationContext.tsx
│   ├── hooks/                    # Custom React hooks
│   │   └── useDebounce.ts
│   ├── screens/                  # Main application screens
│   │   ├── Welcome.tsx          # Entry point with LED toggle
│   │   ├── Settings.tsx         # Main settings management
│   │   ├── ColorEditor.tsx      # Color editing interface
│   │   ├── FlashingPatternEditor.tsx # Animation pattern configuration
│   │   ├── ChooseModification.tsx    # Choice between colors/patterns
│   │   └── Info.tsx             # Help and information
│   ├── services/                 # API and service layers
│   │   ├── ApiService.ts        # Hardware API communication
│   │   ├── SettingsService.ts   # Settings data management
│   │   ├── IpConfigService.ts   # IP address persistence
│   │   └── FirstTimeUserService.ts # Onboarding state management
│   ├── styles/                   # Centralized styling
│   │   └── SharedStyles.ts      # Colors, fonts, and common styles
│   ├── types/                    # TypeScript interfaces
│   │   └── SettingInterface.ts
│   └── utils/                    # Utility functions
│       └── settingUtils.ts      # Setting ID generation and utilities
├── assets/                       # Static assets
│   ├── fonts/                   # Custom fonts
│   └── images/                  # App icons and images
├── android/                      # Android build configuration
├── .github/                      # GitHub configuration
│   ├── workflows/               # CI/CD pipelines
│   ├── docs/                    # Documentation
│   ├── README.md               # This file
│   └── CONTRIBUTING.md         # Contribution guidelines
```
## Main Application Screens
### **Welcome Screen** (`src/screens/Welcome.tsx`)
- Entry point with LED on/off toggle
- First-time user tutorial with guided onboarding
- Animated text display and status indicators
- IP address configuration and connection testing
- **Responsive layout**: Dynamically scales across iPhone sizes (iPhone 15 to iPhone 16 Plus)
- **Adaptive sizing**: Title and button text scale with screen dimensions
- **Touch optimization**: Responsive hit areas and touch targets for all devices
### **Settings Screen** (`src/screens/Settings.tsx`)
- Main settings management with carousel view
- Real-time animation previews
- Direct editing access for focused settings
- Add, delete, and reorder lighting configurations
### **Color Editor** (`src/screens/ColorEditor.tsx`)
- Advanced color editing interface
- 16-dot color grid (2 rows of 8)
- HSV color picker with gesture controls
- Color presets and hex input keyboard
- Name editing for both new and existing settings
### **Flashing Pattern Editor** (`src/screens/FlashingPatternEditor.tsx`)
- Animation pattern and timing configuration
- 12 distinct animation patterns (0-11)
- Real-time pattern preview
- BPM measurement and audio-reactive features
- Name editing for both new and existing settings
###  **Info Screen** (`src/screens/Info.tsx`)
- Comprehensive usage instructions
- Step-by-step feature explanations
- Hidden debug mode for development
- Feedback and support information
## Component Library
### **Core Components**
#### **AnimatedDots** (`src/components/AnimatedDots.tsx`)
- Animated dot patterns for previewing effects
- 12 different animation patterns with timeout management
- Memory leak prevention and performance optimization
#### **SettingBlock** (`src/components/settings/SettingBlock.tsx`)
- Unified setting display component for carousel and focused views
- Direct edit functionality and responsive touch areas
- Memoized rendering for optimal performance
#### **ColorDots** (`src/components/color-picker/ColorDots.tsx`)
- Modular LED dot display and interaction component
- Configurable layouts (single-row for previews, two-rows for editing)
- Customizable dot size and spacing
### **UI Components**
#### **Button System** (`src/components/buttons/`)
- **Button.tsx**: Base component with consistent styling foundation
- **ActionButton.tsx**: Reset/Save/Preview actions with variant support
- **BackButton.tsx**, **InfoButton.tsx**: Icon-based navigation buttons
- **ColorButton.tsx**: White/Black color preset buttons
- **CreateButton.tsx**, **EditButton.tsx**: Setting management actions
- **FlashButton.tsx**: Hardware flash/preview functionality
- **MetronomeButton.tsx**: Audio BPM measurement trigger
- **RandomizeButton.tsx**: Color randomization controls
#### **Common UI Components** (`src/components/common/`)
- **AnimatedTitle.tsx**: Animated text component for screen titles
- **HexKeyboard.tsx**: Custom modal keyboard for hex color input
- **WelcomeTutorial.tsx**: Multi-page onboarding modal
- **DismissKeyboardView.tsx**: Keyboard dismissal wrapper
- **Dot.tsx**: Individual LED dot representation component
## Shared Resources
### **Styling System** (`src/styles/SharedStyles.ts`)
- Centralized color palette and typography
- Common layout patterns and responsive dimensions
- Consistent button and container styles
- Dark theme optimization
### **Service Layer**
#### **ApiService** (`src/services/ApiService.ts`)
- Centralized API communication with hardware
- Consistent error handling and type safety
- Methods: `flashSetting()`, `toggleLed()`, `getStatus()`
#### **Configuration Services**
- **IpConfigService**: Persistent IP address management
- **SettingsService**: Settings data persistence and validation
- **FirstTimeUserService**: Onboarding state management
### **Key Management** (`src/utils/settingUtils.ts`)
- Stable ID generation for React component keys
- Content-based hashing for deterministic key generation
- Prevention of "Text strings must be rendered within a <Text> component" errors
## Development Workflow
### **Available Scripts**
- `npm run format-lint` - Run Biome linter and formatter with fixes
- `npm run format` - Format code with Biome
- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
### **CI/CD Pipeline**
- **Automated quality checks** on every push
- **TypeScript compilation** validation
- **Biome linting** and formatting checks
- **Dependency analysis** and security scanning
## Recent Optimizations
### **Component Consolidation**
- **Button Architecture Refactoring**: Organized button system with base component
- **ActionButton Integration**: Eliminated repetitive button patterns
- **Shared Styling System**: Centralized theming and constants
- **API Service Layer**: Unified error handling and communication
### **Performance Improvements**
- **Animation State Isolation**: Prevents state bleeding between components
- **Stable Key Management**: Content-based React keys for optimal rendering
- **Memoization Strategy**: Strategic use of React.memo() and useCallback
- **Debounced Input Handling**: Optimized user interaction response
### **Code Quality**
- **TypeScript Integration**: Comprehensive type safety throughout codebase
- **Linting Pipeline**: Automated code quality enforcement
- **Documentation**: Comprehensive guides and inline documentation
- **Testing Standards**: Component validation and integration testing
## Getting Started
1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Start development server**: `npm start`
4. **Run on device**: `npm run android` or `npm run ios`
For detailed contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).
## Hardware Requirements
- **LED Controller Hardware** compatible with REST API
- **Network Connection** between device and LED controller
- **Android/iOS Device** for running the React Native application
## License
This project is part of the Luminova Controller system. See project documentation for licensing information.
