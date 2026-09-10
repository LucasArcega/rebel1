import { expect, test } from '@playwright/test';
import { mockChordRoute } from '../helpers/route-mock';

test('diagramas permanecem legíveis no tema escuro', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cifra-hub-theme', 'light'));
  await mockChordRoute(page);
  await page.goto('/artists/fixture-artist/songs/diagramas');

  await page.getByRole('button', { name: 'Tema escuro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  const strip = page.getByRole('region', { name: 'Acordes desta música' });
  await expect(strip.getByRole('img').first()).toBeVisible();
  await expect(strip.locator('.chord-diagram__string')).toHaveCount(42);
  await expect(strip.locator('.chord-diagram__fret')).toHaveCount(42);
  await expect(strip.locator('.chord-diagram__finger')).not.toHaveCount(0);
  await expect(strip).toHaveScreenshot('chord-strip-dark.png', {
    animations: 'disabled',
  });
});
