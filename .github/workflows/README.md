# GitHub Actions Workflows
This directory contains automated CI/CD pipelines for the Luminova Controller project.
## Available Workflows
### 🔍 `linter.yml` - Code Quality Check
**Triggers:** Push to any branch when source files change
**Purpose:** Lightweight linting validation

- Runs Biome linter on `src/` and `.github/docs/` directories
- Identifies code quality issues without auto-fixing
- Fast feedback for development workflow
### 🛠️ `ci.yml` - Comprehensive CI Pipeline  
**Triggers:** Push/PR to main branches (`main`, `master`, `develop`)
**Purpose:** Full code quality validation

- TypeScript type checking
- Biome linting and formatting validation
- Optional dependency analysis
- Blocks merges if issues found
### ⚡ `lint-check.yml` - Quick Validation
**Triggers:** Push/PR to any branch
**Purpose:** Basic checks with multiple validation steps

- TypeScript compilation check
- Biome linter verification
- Code formatting validation
- Suitable for feature branches
## Local Development Commands
Before pushing code, run these commands locally:
```bash
# Fix linting and formatting issues
npm run format-lint
# Check TypeScript compilation
npx tsc --noEmit
# Check linting only (no fixes)
npx @biomejs/biome lint src/
```
## Pipeline Integration
All workflows use:
- **Node.js 18** runtime
- **npm ci** for consistent dependency installation
- **Biome** for linting and formatting
- **TypeScript** compiler for type checking
The pipelines are designed to catch issues early and maintain code quality standards across the project.