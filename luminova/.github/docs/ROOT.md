# Root Directory Files
## Configuration Files
### app.json
**Purpose:** Expo app configuration defining app metadata, build settings, and platform-specific configurations.

### App.tsx
**Purpose:** Main application entry point that sets up navigation, context providers, and app-wide configurations.

### babel.config.js
**Purpose:** Configures Babel to transform modern JavaScript/TypeScript code for React Native compatibility and enables React Native Reanimated animations.

### biome.json
**Purpose:** All-in-one code formatter and linter configuration that replaces ESLint + Prettier, enforcing consistent code style and catching bugs.

### eas.json
**Purpose:** EAS (Expo Application Services) configuration for building, submitting, and distributing your Luminova Controller app across different environments.

### index.js
**Purpose:** React Native entry point that registers the main App component with the React Native runtime.

### metro.config.js
**Purpose:** Metro bundler configuration optimized for React Native Reanimated, essential for LED animation performance.

### package.json
**Purpose:** Node.js project configuration defining dependencies, scripts, and project metadata for the Luminova Controller app.

### react-native.config.js
**Purpose:** Configures React Native's autolinking system and automatically links custom fonts to iOS and Android projects.

### tsconfig.json
**Purpose:** TypeScript compiler configuration that ensures type safety, enables modern JavaScript features, and configures path aliases for cleaner imports.

## Data Files
### credentials.json
**Purpose:** Stores sensitive configuration data and API credentials (should be in .gitignore for security).

### savedSettings.json
**Purpose:** Persistent storage for user's LED controller settings and configurations across app sessions.

## Build/Development Files
### .biomeignore
**Purpose:** Specifies files and directories that Biome should ignore during linting and formatting.

### README.md
**Purpose:** Project documentation with setup instructions, usage guidelines, and development information.

### CONTRIBUTING.md
**Purpose:** Guidelines for contributing to the project, including code standards and development workflow.

### CONFIGURATION_README.MD
**Purpose:** Detailed documentation of all configuration files and their purposes in the project.
