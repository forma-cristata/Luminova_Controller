# GitHub Environment Setup for iOS Build Security

## Overview
The iOS build workflow now uses GitHub Environments to add an extra layer of security for production builds and submissions.

## Setup Instructions

### 1. Create Production Environment
1. Go to your repository on GitHub
2. Navigate to **Settings** → **Environments**
3. Click **New environment**
4. Name it `production`
5. Click **Configure environment**

### 2. Configure Protection Rules
Add the following protection rules for the `production` environment:

#### Required Reviewers
- Add yourself and/or trusted team members as required reviewers
- This ensures manual approval before sensitive operations

#### Deployment Branches
- Select **Selected branches**
- Add rule for `main` branch only
- This prevents unauthorized deployments from other branches

#### Environment Secrets
Move your `EXPO_TOKEN` to the environment level:
1. In the `production` environment settings
2. Click **Add secret**
3. Name: `EXPO_TOKEN`
4. Value: Your existing Expo token
5. Save

### 3. Update Repository Settings
Consider enabling these additional security features:

#### Branch Protection for Main
1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - Require pull request reviews
   - Require status checks to pass
   - Restrict pushes to this branch

#### Required Status Checks
- Add any linting/testing workflows as required checks
- This ensures code quality before builds

## Security Benefits

### Information Masking
The workflow now automatically masks sensitive information:
- Serial numbers
- Apple Team IDs
- Developer Portal IDs
- Bundle identifiers
- Build IDs

### Manual Approval
- Production builds require manual approval
- Prevents accidental or unauthorized releases
- Adds audit trail for all production deployments

### Branch Restrictions
- Only `main` branch can trigger production builds
- Prevents builds from untested feature branches

## Usage

### Automatic Builds
- Pushes to `main` still trigger builds automatically
- But now require environment approval

### Manual Builds
- Use workflow dispatch for manual builds
- Choose build profile (production/preview/development)
- Optionally submit to App Store after build

### Emergency Procedures
If you need to bypass environment protection in emergencies:
1. Temporarily disable environment protection rules
2. Run the build
3. Re-enable protection rules immediately after

## Monitoring

### Build Logs
- Sensitive information is now redacted from logs
- Build IDs are masked after extraction
- Apple credentials are hidden

### Audit Trail
- All environment approvals are logged
- Track who approved each production build
- Review deployment history in environment tab

## Troubleshooting

### Build ID Extraction Issues
If build ID extraction fails:
1. Check the EAS CLI output format hasn't changed
2. Review the regex pattern in the workflow
3. Manually extract build ID from Expo dashboard if needed

### Environment Approval Timeout
- Default timeout is 6 hours for manual approval
- Can be configured in environment settings
- Consider timezone differences for approvers
