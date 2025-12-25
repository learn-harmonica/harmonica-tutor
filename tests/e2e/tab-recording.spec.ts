import { test, expect } from '@playwright/test';

test('tab recording UI', async ({ page }) => {
  await page.goto('/#/practice');

  // Check that the Record Tab button is present
  await expect(page.locator('button').filter({ hasText: /^Record Tab$/ })).toBeVisible();

  // Check that Play Tab button is present (may be disabled without recording)
  await expect(page.locator('button').filter({ hasText: /^Play Tab$/ })).toBeVisible();

  // Since microphone access isn't available in test environment, we can't test recording functionality
  // Toggle buttons (Tab/Staff) are only shown after recording
});
