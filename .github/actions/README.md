# GitHub Actions Components

This directory contains reusable GitHub Actions components for the Luminova Controller CI/CD pipelines.

## Available Actions

### Core Setup Actions

#### `setup-environment`
**Purpose**: Complete environment setup including checkout, Node.js, dependencies, and EAS CLI
**Inputs**:
- `expo-token` (required): EXPO_TOKEN secret value
- `node-version` (optional, default: '20'): Node.js version to use
- `cache` (optional, default: 'npm'): Cache type (npm, yarn, pnpm)
- `ref` (optional): Branch, tag or SHA to checkout

**Usage**: Combines checkout, setup-node, and setup-eas for streamlined workflow setup.

#### `checkout`
**Purpose**: Standardized repository checkout with security pinning
**Inputs**:
- `ref` (optional): Branch, tag or SHA to checkout

#### `setup-node`
**Purpose**: Setup Node.js with caching and install project dependencies
**Inputs**:
- `node-version` (optional, default: '20'): Node.js version
- `cache` (optional, default: 'npm'): Cache type
- `install-dependencies` (optional, default: 'true'): Whether to install dependencies

#### `setup-eas`
**Purpose**: Validates EXPO_TOKEN and sets up Expo Application Services CLI
**Inputs**:
- `expo-token` (required): EXPO_TOKEN secret value
- `eas-version` (optional, default: 'latest'): EAS CLI version

### Build & Deploy Actions

#### `validate-config`
**Purpose**: Validate project configuration files and build profile
**Inputs**:
- `build-profile` (required): Build profile to validate (production/preview/development)

#### `eas-build`
**Purpose**: Build iOS or Android app using EAS Build
**Inputs**:
- `platform` (required): Platform to build for (ios, android, all)
- `profile` (required): Build profile to use
**Outputs**:
- `build-id`: The ID of the created build

#### `check-builds`
**Purpose**: Check for available EAS builds for a specific platform
**Inputs**:
- `platform` (required): Platform to check builds for (ios, android)
- `limit` (optional, default: '10'): Number of builds to list
- `profile` (optional): Build profile to filter by

#### `submit-ios`
**Purpose**: Submit latest iOS build to App Store Connect
**Inputs**:
- `profile` (optional, default: 'production'): EAS submit profile
- `build-id` (optional): Specific build ID (if not using latest)
- `apple-id` (optional): Apple ID for submission
- `asc-app-id` (optional): App Store Connect app ID
- `apple-team-id` (optional): Apple Team ID

## Workflow Integration

### iOS Build Workflow (`ios-build.yml`)
```yaml
steps:
  - name: Setup environment
    uses: ./.github/actions/setup-environment
  - name: Validate configuration
    uses: ./.github/actions/validate-config
  - name: Build iOS app
    uses: ./.github/actions/eas-build
```

### iOS Submit Workflow (`ios-submit.yml`)
```yaml
steps:
  - name: Setup environment
    uses: ./.github/actions/setup-environment
  - name: Check for available builds
    uses: ./.github/actions/check-builds
  - name: Submit Latest Build to App Store
    uses: ./.github/actions/submit-ios
```

## Security Features

- All external actions are pinned to specific commit SHAs for security
- Actions use composite run types for better control
- Input validation and error handling included
- Consistent shell usage (bash) across all actions

## Benefits

1. **Reusability**: Actions can be shared across multiple workflows
2. **Maintainability**: Changes to common functionality only need to be made in one place
3. **Consistency**: Standardized behavior across all workflows
4. **Security**: Centralized security practices and version pinning
5. **Debugging**: Easier to isolate and test individual components
