# TimelineJS3 Testing Guide

## Overview
This guide covers the comprehensive testing strategy for TimelineJS3, especially important during modernization to ensure no regressions.

## Testing Types

### 1. Unit Tests (Jest)
**Purpose**: Test individual functions and components in isolation
**Location**: `tests/unit/` and `src/js/**/__tests__/`
**Run**: `npm run test:unit`

**What we test**:
- Modern DOM utilities (`ModernDOM.js`)
- Network utilities (`ModernNet.js`) 
- Core utility functions
- Component initialization
- Error handling

### 2. End-to-End Tests (Playwright)
**Purpose**: Test complete user workflows in real browsers
**Location**: `tests/e2e/`
**Run**: `npm run test:e2e`

**What we test**:
- Timeline loading and rendering
- Navigation between slides
- Keyboard interactions
- Responsive behavior
- Different data sources
- Error states

### 3. Visual Regression Tests (Playwright)
**Purpose**: Catch unintended visual changes
**Location**: `tests/e2e/visual-regression.spec.js`
**Run**: `npm run test:visual`

**What we test**:
- Default timeline appearance
- Mobile vs desktop layouts
- Different themes and fonts
- Component screenshots
- Error state visuals

## Quick Start

### 1. Install Dependencies
```bash
npm install
npm run test:install  # Install Playwright browsers
```

### 2. Run All Tests
```bash
npm run test:all  # Unit + E2E tests
```

### 3. Run Specific Test Types
```bash
npm run test:unit     # Jest unit tests only
npm run test:e2e      # Playwright E2E tests only
npm run test:visual   # Visual regression tests only
npm run test:e2e:ui   # Playwright with UI (interactive)
```

## Development Workflow

### Before Making Changes
1. Run baseline tests: `npm run test:all`
2. Take visual snapshots: `npm run test:visual`

### During Development
1. Run unit tests frequently: `npm run test:unit --watch`
2. Test in browser: `npm start` (manual testing)
3. Run E2E tests for major changes: `npm run test:e2e`

### Before Committing
1. Run all tests: `npm run test:all`
2. Check linting: `npm run lint`
3. Format code: `npm run format`
4. Update visual baselines if needed

## Manual Testing

### Development Server
```bash
npm start  # Starts webpack dev server at http://localhost:8080
```

**Test scenarios**:
- Load different timeline data sources
- Test responsive behavior (resize browser)
- Test keyboard navigation
- Test zoom functionality
- Test different themes/fonts
- Test error states (invalid URLs)

### Production Testing
```bash
npm run disttest  # Builds and serves production version
```

## Visual Regression Testing

### Understanding Visual Tests
- Screenshots are taken of timeline components
- Compared against baseline images
- Differences highlight potential regressions
- Baselines need updating when intentional changes are made

### Updating Visual Baselines
```bash
npm run test:visual -- --update-snapshots
```

**When to update**:
- After intentional visual changes
- After modernization improvements
- When adding new visual test cases

### Reviewing Visual Differences
1. Run tests: `npm run test:visual`
2. Check `test-results/` folder for diff images
3. Review changes carefully
4. Update baselines if changes are intentional

## Continuous Integration

### GitHub Actions (Recommended)
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:unit
      - run: npm run test:install
      - run: npm run test:e2e
```

## Troubleshooting

### Common Issues

**Playwright tests timeout**:
- Increase timeout in `playwright.config.js`
- Check if dev server is starting properly
- Verify timeline is loading correctly

**Visual tests failing**:
- Check if changes are intentional
- Update baselines if needed
- Ensure consistent test environment

**Unit tests failing**:
- Check for syntax errors
- Verify imports are correct
- Check mock setup

### Debug Mode
```bash
npm run test:e2e:ui  # Interactive Playwright UI
npm run test:e2e -- --debug  # Debug mode
npm run test:unit -- --verbose  # Verbose Jest output
```

## Best Practices

### Writing Tests
1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Keep tests independent**
4. **Mock external dependencies**
5. **Test error conditions**

### Maintaining Tests
1. **Update tests when features change**
2. **Remove obsolete tests**
3. **Keep visual baselines current**
4. **Document test scenarios**

## Modernization Testing Strategy

### Phase 1: Baseline
1. Establish comprehensive test coverage
2. Create visual baselines
3. Document current behavior

### Phase 2: Incremental Changes
1. Test each modernization step
2. Verify backward compatibility
3. Update tests as needed

### Phase 3: Validation
1. Full regression testing
2. Performance comparison
3. Cross-browser validation

This testing strategy ensures that modernization changes don't break existing functionality while providing confidence in the improvements.
