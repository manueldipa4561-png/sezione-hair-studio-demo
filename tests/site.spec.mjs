import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/servizi.html', '/lavori.html', '/prima-volta.html', '/journal.html', '/prenota.html'];

for (const route of routes) {
  test(`${route} renders and passes critical accessibility checks`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: 'networkidle' });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.skip-link')).toHaveCount(1);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(v => ['serious', 'critical'].includes(v.impact));
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
}

test('mobile navigation is keyboard/state safe', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('[data-menu-toggle]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('[data-mobile-menu]')).toHaveAttribute('aria-hidden', 'false');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('booking demo stays local and completes without submission', async ({ page }) => {
  await page.goto('/prenota.html');
  await page.locator('[data-booking-choice]').first().click();
  await page.locator('[data-booking-time]').first().click();
  await expect(page.locator('[data-booking-summary-service]')).toContainText('Consulenza');
  await page.locator('[data-booking-confirm]').click();
  await expect(page.locator('[data-booking-success]')).toBeVisible();
  await expect(page.locator('[data-booking-success]')).toContainText('Nessun dato è stato inviato');
});
