const { test, expect } = require('@playwright/test');

// Helper function to wait for timeline to be ready
async function waitForTimeline(page) {
  await page.waitForSelector('#timeline-embed', { timeout: 30000 });
  await page.waitForSelector('h2', { timeout: 30000 }); // Wait for content
  await page.waitForTimeout(3000); // Let animations settle
}

// Helper function to switch timeline data
async function switchTimeline(page, dataSource) {
  const input = page.locator('input[type="text"]'); // The data source input
  await input.clear();
  await input.fill(dataSource);
  await input.press('Enter');
  await waitForTimeline(page);
}

test.describe('Visual Regression Tests - Women in Computing Timeline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForTimeline(page);
  });

  test('women-in-computing - title slide', async ({ page }) => {
    await expect(page).toHaveScreenshot('women-computing-title.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('women-in-computing - ada lovelace slide', async ({ page }) => {
    // Navigate to first event slide (Ada Lovelace)
    const nextButton = page.locator('button').filter({ hasText: /next/i }).first();
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(2000);
    }

    await expect(page).toHaveScreenshot('women-computing-ada-lovelace.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('women-in-computing - grace hopper slide', async ({ page }) => {
    // Navigate to Grace Hopper slide (need to click next multiple times)
    const nextButton = page.locator('button').filter({ hasText: /next/i }).first();

    // Click next several times to get to Grace Hopper (slide ~6)
    for (let i = 0; i < 6; i++) {
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(1000);
      }
    }

    await expect(page).toHaveScreenshot('women-computing-grace-hopper.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('women-in-computing - mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(2000);

    await expect(page).toHaveScreenshot('women-computing-mobile.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });
});

test.describe('Visual Regression Tests - All Media Types Timeline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForTimeline(page);
    // Switch to all-media-types timeline
    await switchTimeline(page, 'all-media-types.json');
  });

  test('all-media-types - title slide', async ({ page }) => {
    await expect(page).toHaveScreenshot('all-media-title.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('all-media-types - image slide', async ({ page }) => {
    const nextButton = page.locator('button').filter({ hasText: /next/i }).first();
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(2000);
    }

    await expect(page).toHaveScreenshot('all-media-image-slide.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('all-media-types - video slide', async ({ page }) => {
    const nextButton = page.locator('button').filter({ hasText: /next/i }).first();

    // Navigate to a video slide (usually 2-3 slides in)
    for (let i = 0; i < 3; i++) {
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(1500);
      }
    }

    await expect(page).toHaveScreenshot('all-media-video-slide.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('all-media-types - mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(2000);

    await expect(page).toHaveScreenshot('all-media-mobile.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });
});

test.describe('Visual Regression Tests - Timeline Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForTimeline(page);
  });

  test('timeline navigation component', async ({ page }) => {
    // Focus on just the timeline navigation area
    const timelineNav = page.locator('[role="application"]').filter({ hasText: /Timeline navigation/i });
    if (await timelineNav.isVisible()) {
      await expect(timelineNav).toHaveScreenshot('timeline-navigation.png', {
        animations: 'disabled'
      });
    } else {
      // Fallback to bottom area where navigation usually is
      await expect(page.locator('#timeline-embed').last()).toHaveScreenshot('timeline-navigation-fallback.png', {
        animations: 'disabled'
      });
    }
  });

  test('timeline zoom controls', async ({ page }) => {
    // Look for zoom buttons
    const zoomIn = page.locator('button').filter({ hasText: /zoom.*in/i });
    const zoomOut = page.locator('button').filter({ hasText: /zoom.*out/i });

    if (await zoomIn.isVisible() && await zoomOut.isVisible()) {
      // Test zoom in
      await zoomIn.click();
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('timeline-zoomed-in.png', {
        fullPage: true,
        animations: 'disabled'
      });

      // Test zoom out
      await zoomOut.click();
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('timeline-zoomed-out.png', {
        fullPage: true,
        animations: 'disabled'
      });
    }
  });

  test('timeline keyboard navigation', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('timeline-keyboard-next.png', {
      fullPage: true,
      animations: 'disabled'
    });

    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('timeline-keyboard-prev.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });
});

test.describe('Visual Regression Tests - Error States', () => {
  test('timeline with invalid data source', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#timeline-embed', { timeout: 30000 });

    // Try to load invalid data
    await switchTimeline(page, 'invalid-timeline.json');

    // Wait for error state
    await page.waitForTimeout(3000);

    await expect(page).toHaveScreenshot('timeline-error-state.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });
});
