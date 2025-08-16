# Source Code Directory Structure

## Overview
The `src/` directory contains all the React Native TypeScript source code for the Luminova Controller app, organized into logical modules for LED hardware control, UI components, and app infrastructure.

## Directory Structure

### components/
**Purpose:** Reusable React Native UI components organized by functionality (see [COMPONENTS_OVERVIEW.md](components/COMPONENTS_OVERVIEW.md) for details).

### configurations/
**Purpose:** App-wide configuration constants, default values, and LED pattern definitions (see [CONFIGURATIONS_OVERVIEW.md](configurations/CONFIGURATIONS_OVERVIEW.md) for details).

### context/
**Purpose:** React Context providers for global state management across the app (see [CONTEXT_OVERVIEW.md](context/CONTEXT_OVERVIEW.md) for details).

### hooks/
**Purpose:** Custom React hooks for reusable stateful logic and side effects (see [HOOKS_OVERVIEW.md](hooks/HOOKS_OVERVIEW.md) for details).

### screens/
**Purpose:** Full-screen React Native components representing different app views/pages (see [SCREENS_OVERVIEW.md](screens/SCREENS_OVERVIEW.md) for details).

### services/
**Purpose:** Business logic layer handling API communication, data persistence, and external integrations (see [SERVICES_OVERVIEW.md](services/SERVICES_OVERVIEW.md) for details).

### styles/
**Purpose:** Centralized styling system with shared colors, fonts, and component styles (see [STYLES_OVERVIEW.md](styles/STYLES_OVERVIEW.md) for details).

### types/
**Purpose:** TypeScript type definitions and interfaces for type safety across the app (see [TYPES_OVERVIEW.md](types/TYPES_OVERVIEW.md) for details).

### utils/
**Purpose:** Pure utility functions and helper methods used throughout the application (see [UTILS_OVERVIEW.md](utils/UTILS_OVERVIEW.md) for details).

## Architecture Principles

### Component Organization
- **Reusable components** in `/components/` folders by feature
- **Screen-level components** in `/screens/` for navigation targets  
- **Shared utilities** abstracted to `/utils/` and `/hooks/`

### Data Flow
- **Global state** managed through React Context in `/context/`
- **API communication** centralized in `/services/`
- **Type safety** enforced through `/types/` interfaces

### Styling System
- **Consistent theming** through `/styles/SharedStyles.ts`
- **Component-specific styles** co-located with components
- **Responsive design** using shared dimensions and breakpoints
