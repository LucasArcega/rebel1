import { expect, test } from '@playwright/test';
import { mockVersionedChordRoute } from '../helpers/route-mock';

test('trocar de versão substitui a lista de acordes anterior', async ({ page }) => {
  await mockVersionedChordRoute(page);
  await page.goto('/artists/fixture-artist/songs/diagramas');

  const strip = page.getByRole('region', { name: 'Acordes desta música' });
  await expect(strip.locator('.chord-diagram__title')).toHaveText(['Am', 'Bm11', 'C', 'C9', 'D', 'D9/F#', 'E']);

  await page.getByRole('button', { name: 'Simplificada' }).click();
  await expect(page).toHaveURL(/version=simplificada/);
  await expect(strip.locator('.chord-diagram__title')).toHaveText(['G', 'D', 'Em']);
  await expect(strip.getByText('Am', { exact: true })).toHaveCount(0);
});
