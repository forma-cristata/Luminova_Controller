# Luminova Controller Documentation

## Overview
This documentation provides comprehensive coverage of the Luminova Controller React Native app architecture, organized to mirror the actual project file structure for easy navigation and reference.

## Documentation Structure

### Root Level Documentation
- **[ROOT.md](ROOT.md)**: Documentation for all root-level configuration and project files

### Source Code Documentation
- **[src/SRC_OVERVIEW.md](src/SRC_OVERVIEW.md)**: Overview of the entire source code architecture and organization

#### Component Documentation
- **[src/components/COMPONENTS_OVERVIEW.md](src/components/COMPONENTS_OVERVIEW.md)**: All reusable UI components organized by functionality

#### Configuration Documentation  
- **[src/configurations/CONFIGURATIONS_OVERVIEW.md](src/configurations/CONFIGURATIONS_OVERVIEW.md)**: App-wide constants, defaults, and LED pattern definitions

#### Context Documentation
- **[src/context/CONTEXT_OVERVIEW.md](src/context/CONTEXT_OVERVIEW.md)**: Global state management and React Context providers

#### Hooks Documentation
- **[src/hooks/HOOKS_OVERVIEW.md](src/hooks/HOOKS_OVERVIEW.md)**: Custom React hooks for reusable stateful logic

#### Screens Documentation
- **[src/screens/SCREENS_OVERVIEW.md](src/screens/SCREENS_OVERVIEW.md)**: Full-screen components and navigation flow

#### Services Documentation
- **[src/services/SERVICES_OVERVIEW.md](src/services/SERVICES_OVERVIEW.md)**: Business logic layer and API communication

#### Styles Documentation
- **[src/styles/STYLES_OVERVIEW.md](src/styles/STYLES_OVERVIEW.md)**: Centralized design system and theming

#### Types Documentation
- **[src/types/TYPES_OVERVIEW.md](src/types/TYPES_OVERVIEW.md)**: TypeScript interfaces and type safety

#### Utils Documentation
- **[src/utils/UTILS_OVERVIEW.md](src/utils/UTILS_OVERVIEW.md)**: Pure utility functions and helper methods

## Quick Reference

### Project Architecture
The Luminova Controller is a React Native app built with Expo SDK 53 that communicates with LED hardware via REST API. The app features:

- **16-dot LED grid** representation (2 rows of 8)
- **12 animation patterns** with real-time preview
- **HSV color picker** with gesture controls  
- **Carousel-based settings** management
- **TypeScript throughout** for type safety
- **Centralized styling** system

### Key Files to Understand
1. **App.tsx**: Main application entry point and navigation setup
2. **src/context/ConfigurationContext.tsx**: Global state management
3. **src/services/ApiService.ts**: LED hardware communication
4. **src/styles/SharedStyles.ts**: Design system and theming
5. **src/components/animations/AnimatedDots.tsx**: LED animation preview
6. **src/utils/settingUtils.ts**: Critical utility functions

### Development Workflow
1. **Configuration**: All config files documented in ROOT.md
2. **Components**: Reusable UI elements in components/ subdirectories
3. **Screens**: Navigation destinations in screens/ directory
4. **Services**: Business logic and API communication in services/
5. **Styling**: Centralized theming in styles/SharedStyles.ts

### Documentation Usage
- **Mirror structure**: Documentation follows exact project file organization
- **Quick reference**: Each overview file provides essential information at a glance
- **Integration points**: Cross-references show how different parts work together
- **Best practices**: Established patterns and conventions documented throughout

### Navigation Guide
- Start with **SRC_OVERVIEW.md** for architecture understanding
- Review **COMPONENTS_OVERVIEW.md** for UI component organization
- Check **SERVICES_OVERVIEW.md** for business logic and API patterns
- Reference **STYLES_OVERVIEW.md** for design system usage
- Consult **ROOT.md** for build and configuration understanding

This documentation system ensures that developers can quickly understand any part of the Luminova Controller codebase by following the same organizational structure used in the actual project files.
