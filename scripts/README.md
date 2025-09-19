# Luminova Scripts

This directory contains utility scripts for the Luminova Controller project.

## Scripts

### production.js

Increments the Expo version number in `app.json` using semantic versioning and npm

#### Usage

```bash
# Manual execution
node scripts/production.js [increment-type]

# Using npm scripts
npm run version:patch    # Increment patch version (2.0.0 → 2.0.1)
npm run version:minor    # Increment minor version (2.0.0 → 2.1.0)
npm run version:major    # Increment major version (2.0.0 → 3.0.0)
npm run version:check    # Display current version
```

### removeEmptyLines.js

Removes empty lines from code files

#### Usage

```bash
node scripts/removeEmptyLines.js [filePath]
```
