# Luminova Scripts

This directory contains utility scripts for the Luminova Controller project.

## Scripts

### production.js

Automatically increments the Expo version number in `app.json` using semantic versioning.

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

#### Increment Types

- **patch** (default): Bug fixes, small changes (2.0.0 → 2.0.1)
- **minor**: New features, backwards compatible (2.0.0 → 2.1.0)
- **major**: Breaking changes, major updates (2.0.0 → 3.0.0)

#### Features

- ✅ Semantic versioning support
- ✅ Automatic JSON formatting preservation
- ✅ Error handling and validation
- ✅ CI/CD integration support
- ✅ Git hook integration

#### Integration

The script is automatically triggered by:

1. **Husky Pre-Push Hook** - Increments patch version before each push
2. **GitHub Actions Workflow** - Runs on push/pull request to main branch
3. **Docker Build Process** - Uses version for container tagging

#### Error Handling

The script will exit with error code 1 if:
- `app.json` cannot be read or written
- Version format is invalid (must be x.y.z)
- Invalid increment type is specified

#### Output

The script provides colored console output and sets GitHub Actions output variables for CI/CD integration.

### removeEmptyLines.js

Utility script for removing empty lines from files (primarily used for Arduino code cleanup).

#### Usage

```bash
node scripts/removeEmptyLines.js <file-path>
```

## Automation

### Git Hooks (Husky)

- **pre-push**: Automatically increments patch version and commits changes before push

### GitHub Actions

- **production.yml**: Runs on push/PR to handle version management and Docker builds
- Automatically creates GitHub releases for main branch pushes
- Builds and pushes Docker images with version tags

### Docker Integration

- Production builds tagged with current version
- Automatic deployment pipeline integration
- Multi-stage build support for development and production

## Development

To modify the production script:

1. Update `scripts/production.js`
2. Test with `npm run version:patch`
3. Verify version changes in `app.json`
4. Update this documentation if needed

## Troubleshooting

### Common Issues

1. **Permission denied on Git hooks**
   ```bash
   chmod +x .husky/pre-push
   ```

2. **Version format errors**
   - Ensure app.json expo.version follows x.y.z format
   - Check for corrupted JSON syntax

3. **Git hook not triggering**
   ```bash
   git config core.hooksPath .husky
   ```

4. **Docker build failures**
   - Check Dockerfile syntax
   - Verify all dependencies are properly installed
