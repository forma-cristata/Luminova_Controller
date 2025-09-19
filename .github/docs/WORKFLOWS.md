# GitHub Workflows Documentation

## iOS Build and Submit Pipeline

**File:** `.github/workflows/iOSbuild.yaml`

### Overview
Automated workflow for building and submitting iOS apps using Expo Application Services (EAS) and GitHub Actions.

### Triggers
- **Manual Dispatch**: Can be triggered manually from GitHub Actions tab
- **Push to Main**: Automatically triggered when code is pushed to `main` branch with changes to:
  - `src/**` (source code changes)
  - `app.json` (app configuration)
  - `package.json` (dependencies)
  - `eas.json` (build configuration)

### Jobs

#### Build Job
- **Platform**: Ubuntu (cloud-based)
- **Purpose**: Compile iOS app using EAS build services
- **Steps**:
  1. Validate `EXPO_TOKEN` secret exists
  2. Checkout repository code
  3. Setup Node.js 18.x environment
  4. Install EAS CLI and authenticate
  5. Install project dependencies
  6. Start EAS build process
  7. Wait for build completion

#### Submit Job
- **Dependencies**: Runs after successful build
- **Conditions**: Triggered when:
  - Manual workflow with "Submit to App Store" enabled
  - Automatic trigger from main branch push
- **Purpose**: Submit completed build to App Store Connect
- **Steps**:
  1. Validate authentication
  2. Setup environment
  3. Submit build using EAS submit

### Configuration Options

#### Manual Workflow Inputs
- **`submit_to_store`**: Boolean flag to enable App Store submission
- **`build_profile`**: Choose from `production`, `preview`, or `development`

#### Required Secrets
- **`EXPO_TOKEN`**: Authentication token for Expo account
  - Generate at: https://expo.dev/accounts/[username]/settings/access-tokens
  - Add to repository secrets: Settings > Secrets and variables > Actions

### Build Profiles
Defined in `eas.json`:
- **Production**: App Store release builds
- **Preview**: Internal testing builds
- **Development**: Development client builds

### Usage Examples

#### Manual Build with Store Submission
1. Go to GitHub repository
2. Click "Actions" tab
3. Select "iOS Build and Submit"
4. Click "Run workflow"
5. Choose build profile
6. Enable "Submit to App Store after build"
7. Click "Run workflow"

#### Automatic Build on Code Push
```bash
git add .
git commit -m "Update iOS app features"
git push origin main
# Workflow automatically triggers
```

### Error Handling
- **Token Validation**: Fails fast if `EXPO_TOKEN` is missing
- **Build Monitoring**: Waits for build completion before submission
- **Non-Interactive**: All authentication handled via tokens

### Best Practices
1. **Test Builds**: Use `preview` profile for testing before production
2. **Token Security**: Never commit tokens to repository
3. **Build Monitoring**: Check Actions tab for build status
4. **Version Management**: Update `app.json` version before releases

### Troubleshooting

#### Common Issues
- **Missing EXPO_TOKEN**: Add token to repository secrets
- **Build Failures**: Check EAS build logs for detailed errors
- **Submission Failures**: Verify App Store Connect configuration
- **Permission Errors**: Ensure Expo account has necessary permissions

#### Debugging Steps
1. Check GitHub Actions logs
2. Review EAS build dashboard
3. Verify `eas.json` configuration
4. Confirm App Store Connect setup
