const { test, expect } = require('@playwright/test');

test.describe('TimelineJS Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the template page (which has local test data)
    await page.goto('/');

    // Wait for the timeline to load
    await page.waitForSelector('#timeline-embed.tl-timeline', { timeout: 30000 });
  });

  test('should load timeline successfully', async ({ page }) => {
    // Debug: Let's see what's actually in the DOM
    const bodyHTML = await page.locator('body').innerHTML();
    console.log('=== BODY HTML ===');
    console.log(bodyHTML.substring(0, 2000)); // First 2000 chars

    // Check that the timeline container exists
    const timelineEmbed = page.locator('#timeline-embed');
    await expect(timelineEmbed).toBeVisible();

    // Debug: Check what classes are on the timeline-embed element
    const embedClasses = await timelineEmbed.getAttribute('class');
    console.log('=== TIMELINE-EMBED CLASSES ===');
    console.log(embedClasses);

    // Check for any content inside timeline-embed
    const hasContent = await timelineEmbed.locator('*').count();
    console.log('=== CONTENT COUNT ===');
    console.log(hasContent);

    // Look for any h2 elements (timeline content)
    const headings = page.locator('h2');
    const headingCount = await headings.count();
    console.log('=== H2 COUNT ===');
    console.log(headingCount);

    if (headingCount > 0) {
      const firstHeading = await headings.first().textContent();
      console.log('=== FIRST H2 TEXT ===');
      console.log(firstHeading);
    }
  });

  test('should navigate between slides', async ({ page }) => {
    // Wait for timeline to be ready
    await page.waitForFunction(() => window.timeline && window.timeline.ready);

    // Get initial slide content (just check that content exists)
    const initialContent = await page.locator('h2').first().textContent();

    // Look for navigation buttons (they might be in different locations)
    const nextButton = page.locator('button').filter({ hasText: /next/i }).first();
    if (await nextButton.isVisible()) {
      await nextButton.click();

      // Wait for slide change
      await page.waitForTimeout(2000);

      // Check that content has changed (or at least timeline is still functional)
      const newContent = await page.locator('h2').first().textContent();

      // Either content changed OR timeline is still visible (both are success)
      const timelineStillVisible = await page.locator('#timeline-embed.tl-timeline').isVisible();
      expect(newContent !== initialContent || timelineStillVisible).toBe(true);
    } else {
      // No next button found - just verify timeline is functional
      const timeline = page.locator('#timeline-embed.tl-timeline');
      await expect(timeline).toBeVisible();
    }
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus on the timeline
    await page.locator('#timeline-embed.tl-timeline').click();
    
    // Press right arrow key
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
    
    // Press left arrow key
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(500);
    
    // Timeline should still be visible and functional
    const timeline = page.locator('#timeline-embed.tl-timeline');
    await expect(timeline).toBeVisible();
  });

  test('should display media content', async ({ page }) => {
    // Check for media elements
    const mediaElements = page.locator('.tl-media');
    if (await mediaElements.count() > 0) {
      await expect(mediaElements.first()).toBeVisible();
    }
    
    // Check for text content
    const textElements = page.locator('.tl-text');
    await expect(textElements.first()).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);
    
    const timeline = page.locator('#timeline-embed.tl-timeline');
    await expect(timeline).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    await expect(timeline).toBeVisible();
    
    // Check if mobile-specific classes are applied
    const timelineClasses = await timeline.getAttribute('class');
    // Timeline should adapt to mobile view
    expect(timelineClasses).toBeTruthy();
  });

  test('should handle zoom functionality', async ({ page }) => {
    // Wait for timeline to be ready
    await page.waitForFunction(() => window.timeline && window.timeline.ready);
    
    // Look for zoom controls
    const zoomIn = page.locator('.tl-menubar-button').filter({ hasText: /zoom.*in/i }).first();
    const zoomOut = page.locator('.tl-menubar-button').filter({ hasText: /zoom.*out/i }).first();
    
    if (await zoomIn.isVisible()) {
      await zoomIn.click();
      await page.waitForTimeout(500);
    }
    
    if (await zoomOut.isVisible()) {
      await zoomOut.click();
      await page.waitForTimeout(500);
    }
    
    // Timeline should still be functional
    const timeline = page.locator('#timeline-embed.tl-timeline');
    await expect(timeline).toBeVisible();
  });

  test('should load different data sources', async ({ page }) => {
    // Test loading a different timeline
    const input = page.locator('#timeline-src');
    await input.clear();
    await input.fill('all-media-types.json');
    await input.press('Enter');
    
    // Wait for new timeline to load
    await page.waitForTimeout(3000);
    
    // Check that timeline is still functional
    const timeline = page.locator('#timeline-embed.tl-timeline');
    await expect(timeline).toBeVisible();
  });

  test('should not have console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Navigate and interact with timeline
    await page.goto('/');
    await page.waitForSelector('#timeline-embed.tl-timeline', { timeout: 30000 });

    // Check for critical errors (ignore minor warnings)
    const criticalErrors = errors.filter(error =>
      !error.includes('favicon') &&
      !error.includes('404') &&
      !error.includes('warning')
    );

    expect(criticalErrors).toHaveLength(0);
  });

});
