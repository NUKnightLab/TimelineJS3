const { test, expect } = require('@playwright/test');

test.describe('TimelineJS Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the development page
    await page.goto('/');
    
    // Wait for the timeline to load
    await page.waitForSelector('#timeline-embed .tl-timeline', { timeout: 30000 });
  });

  test('should load timeline successfully', async ({ page }) => {
    // Check that the timeline container exists
    const timeline = page.locator('#timeline-embed .tl-timeline');
    await expect(timeline).toBeVisible();
    
    // Check that the timeline has loaded content
    const slides = page.locator('.tl-slide');
    await expect(slides.first()).toBeVisible();
    
    // Check that navigation elements are present
    const timeNav = page.locator('.tl-timenav');
    await expect(timeNav).toBeVisible();
  });

  test('should navigate between slides', async ({ page }) => {
    // Wait for timeline to be ready
    await page.waitForFunction(() => window.timeline && window.timeline.ready);
    
    // Get initial slide
    const initialSlide = await page.locator('.tl-slide.tl-slide-active').textContent();
    
    // Click next button (if available)
    const nextButton = page.locator('.tl-slidenav-next');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      
      // Wait for slide change
      await page.waitForTimeout(1000);
      
      // Check that slide has changed
      const newSlide = await page.locator('.tl-slide.tl-slide-active').textContent();
      expect(newSlide).not.toBe(initialSlide);
    }
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus on the timeline
    await page.locator('#timeline-embed .tl-timeline').click();
    
    // Press right arrow key
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
    
    // Press left arrow key
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(500);
    
    // Timeline should still be visible and functional
    const timeline = page.locator('#timeline-embed .tl-timeline');
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
    
    const timeline = page.locator('#timeline-embed .tl-timeline');
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
    const timeline = page.locator('#timeline-embed .tl-timeline');
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
    const timeline = page.locator('#timeline-embed .tl-timeline');
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
    await page.waitForSelector('#timeline-embed .tl-timeline', { timeout: 30000 });
    
    // Check for critical errors (ignore minor warnings)
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('404') &&
      !error.includes('warning')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});
