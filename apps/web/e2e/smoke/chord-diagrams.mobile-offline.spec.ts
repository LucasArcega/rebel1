import { expect, test } from '@playwright/test';
import { failChordRoute, mockChordRoute } from '../helpers/route-mock';

const songUrl = '/artists/fixture-artist/songs/diagramas';

test('viewport móvel mantém scroll local e o picker funciona por teclado', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockChordRoute(page);
  await page.goto(songUrl);

  const strip = page.getByRole('region', { name: 'Acordes desta música' });
  const list = strip.locator('.song-chord-strip__list');
  await expect.poll(() => list.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  const opener = page.getByRole('button', { name: 'Ver variações de C', exact: true });
  await opener.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Variações de C' });
  await expect(dialog).toBeVisible();
  const secondOption = dialog.getByRole('radio').nth(1);
  await page.keyboard.press('ArrowRight');
  await expect(secondOption).toBeFocused();
  await page.keyboard.press('Space');
  await expect(secondOption).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('reabre a cifra e seus diagramas offline sem acessar a API', async ({ page }) => {
  await mockChordRoute(page);
  await page.goto(songUrl);
  await expect(page.getByText('Salva offline')).toBeVisible();
  await expect(page.getByRole('img', { name: /^Diagrama de Am/ })).toBeVisible();

  await failChordRoute(page);
  await page.reload();
  await expect(page.getByText('Offline', { exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Acordes desta música' }).getByRole('img')).toHaveCount(7);
});
