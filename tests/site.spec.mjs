import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('reference-led Home hero renders cleanly', async ({ page }) => {
  const response = await page.goto('/', { waitUntil: 'networkidle' });
  expect(response?.ok()).toBeTruthy();

  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main > section')).toHaveCount(2);
  await expect(page.locator('.hero')).toBeVisible();
  await expect(page.locator('.home-statement')).toBeVisible();
  await expect(page.locator('.site-header')).toBeVisible();

  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('Home hero has no serious or critical accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter(v => ['serious','critical'].includes(v.impact));
  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
});

test('reference hero image loads', async ({ page }) => {
  await page.goto('/');
  const image = page.locator('.hero-media img');
  await expect(image).toHaveCount(1);
  await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 300), {
    timeout: 15000
  }).toBe(true);
});
