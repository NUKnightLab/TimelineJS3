const { test, expect } = require('@playwright/test');

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for timeline to fully load
    await page.waitForSelector('#timeline-embed .tl-timeline', { timeout: 30000 });
    await page.waitForFunction(() => window.timeline && window.timeline.ready);
    // Wait a bit more for animations to settle
    await page.waitForTimeout(2000);
  });

  test('timeline default appearance', async ({ page }) => {
    // Hide dynamic elements that might change between runs
    await page.addStyleTag({
      content: `
        .tl-attribution { display: none !important; }
        .tl-menubar { display: none !important; }
      `
    });
    
    const timeline = page.locator('#timeline-embed');
    await expect(timeline).toHaveScreenshot('timeline-default.png');
  });

  test('timeline mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    await page.addStyleTag({
      content: `
        .tl-attribution { display: none !important; }
        .tl-menubar { display: none !important; }
      `
    });
    
    const timeline = page.locator('#timeline-embed');
    await expect(timeline).toHaveScreenshot('timeline-mobile.png');
  });

  test('timeline with different data', async ({ page }) => {
    // Load different timeline data
    const input = page.locator('#timeline-src');
    await input.clear();
    await input.fill('all-media-types.json');
    await input.press('Enter');
    
    // Wait for new timeline to load
    await page.waitForTimeout(3000);
    await page.waitForFunction(() => window.timeline && window.timeline.ready);
    await page.waitForTimeout(2000);
    
    await page.addStyleTag({
      content: `
        .tl-attribution { display: none !important; }
        .tl-menubar { display: none !important; }
      `
    });
    
    const timeline = page.locator('#timeline-embed');
    await expect(timeline).toHaveScreenshot('timeline-media-types.png');
  });

  test('timeline navigation states', async ({ page }) => {
    await page.addStyleTag({
      content: `
        .tl-attribution { display: none !important; }
        .tl-menubar { display: none !important; }
      `
    });
    
    // Take screenshot of first slide
    let timeline = page.locator('#timeline-embed');
    await expect(timeline).toHaveScreenshot('timeline-slide-1.png');
    
    // Navigate to next slide if possible
    const nextButton = page.locator('.tl-slidenav-next');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(1500); // Wait for animation
      
      await expect(timeline).toHaveScreenshot('timeline-slide-2.png');
    }
  });

  test('timeline error states', async ({ page }) => {
    // Test with invalid data source
    const input = page.locator('#timeline-src');
    await input.clear();
    await input.fill('invalid-url.json');
    await input.press('Enter');
    
    // Wait for error to appear
    await page.waitForTimeout(3000);
    
    const timeline = page.locator('#timeline-embed');
    await expect(timeline).toHaveScreenshot('timeline-error-state.png');
  });

  test('timeline components individual screenshots', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Screenshot of time navigation
    const timeNav = page.locator('.tl-timenav');
    if (await timeNav.isVisible()) {
      await expect(timeNav).toHaveScreenshot('timeline-timenav.png');
    }
    
    // Screenshot of story slider
    const storySlider = page.locator('.tl-storyslider');
    if (await storySlider.isVisible()) {
      await expect(storySlider).toHaveScreenshot('timeline-storyslider.png');
    }
    
    // Screenshot of current slide
    const activeSlide = page.locator('.tl-slide.tl-slide-active');
    if (await activeSlide.isVisible()) {
      await expect(activeSlide).toHaveScreenshot('timeline-active-slide.png');
    }
  });
});
