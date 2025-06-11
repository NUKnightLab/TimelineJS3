#!/bin/bash

# TimelineJS3 Baseline Branch Setup Script
# This script creates a clean baseline branch with only testing infrastructure

set -e  # Exit on any error

echo "🎯 Setting up baseline branch for TimelineJS3 testing..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository!"
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Stash any uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_warning "Stashing uncommitted changes..."
    git stash push -m "Auto-stash before baseline setup - $(date)"
    STASHED=true
else
    STASHED=false
fi

# Switch to master and create baseline branch
print_status "Switching to master branch..."
git checkout master

print_status "Creating testing-baseline branch..."
git checkout -b testing-baseline

# Apply stashed changes if we stashed them (should only be testing infrastructure)
if [ "$STASHED" = true ]; then
    print_status "Applying stashed testing infrastructure changes..."
    git stash pop
fi

# Add all testing infrastructure files
print_status "Adding testing infrastructure files..."
git add .

# Show what we're about to commit
print_status "Files to be committed:"
git diff --cached --name-only

# package.json should already have the testing changes from the stash
# No need to manually edit it since modernization changes are already committed

# Commit the testing infrastructure
print_status "Committing testing infrastructure..."
git commit -m "Add testing infrastructure

- Add Playwright E2E testing framework
- Add visual regression testing
- Add ESLint and Prettier configuration
- Add comprehensive testing documentation
- Add testing scripts to package.json

This commit establishes the testing baseline from master branch."

# Install dependencies and run baseline tests
print_status "Installing dependencies..."
npm install

print_status "Installing Playwright browsers..."
npm run test:install

print_status "Creating visual test baselines..."
npm run test:visual

# Commit the baseline screenshots
if [ -d "test-results" ]; then
    git add test-results/
    git commit -m "Add visual test baselines from master state"
    print_status "Visual baselines committed!"
fi

print_status "Baseline branch setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Switch back to your modernization branch: git checkout $CURRENT_BRANCH"
echo "2. Merge the baselines: git merge testing-baseline"
echo "3. Run tests to see what changed: npm run test:visual"
echo ""
echo "🎯 The baseline branch 'testing-baseline' now contains:"
echo "   - Clean testing infrastructure"
echo "   - Visual baselines from master state"
echo "   - Ready to compare against modernization changes"
