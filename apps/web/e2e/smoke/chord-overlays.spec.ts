import { expect, test, type Page } from '@playwright/test';
import { mockChordRoute } from '../helpers/route-mock';

const songUrl = '/artists/fixture-artist/songs/diagramas';

const assertInsideViewport = async (page: Page, locator: ReturnType<Page['locator']>) => {
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height);
};

test.describe('overlays de acordes', () => {
  test.beforeEach(async ({ page }) => {
    await mockChordRoute(page);
  });

  test('abre o preview por hover, permite ver formas e fecha com Escape', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(songUrl);

    const chord = page.getByRole('button', { name: 'Acorde C. Diagrama e variações disponíveis' }).first();
    await chord.hover();
    const preview = page.getByRole('group', { name: 'Diagrama e variações de C' });
    await expect(preview).toBeVisible();
    await preview.getByRole('button', { name: /ver \d+ variações/i }).hover();
    await expect(preview).toBeVisible();

    await preview.getByRole('button', { name: /ver \d+ variações/i }).click();
    const dialog = page.getByRole('dialog', { name: 'Variações de C' });
    await expect(dialog).toBeVisible();
    await expect(page.locator('[data-slot="dialog-backdrop"]')).toBeVisible();
    expect(Number(await preview.evaluate((element) => getComputedStyle(element).zIndex || '0'))).toBeLessThanOrEqual(
      Number(await page.locator('[data-slot="dialog-popup"]').evaluate((element) => getComputedStyle(element).zIndex)),
    );

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(chord).toBeFocused();
  });

  test('reposiciona o preview nas bordas e acima da sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(songUrl);

    const chords = page.getByRole('button', { name: /Acorde .+\. Diagrama e variações disponíveis/ });
    await chords.first().hover();
    await assertInsideViewport(page, page.locator('[data-slot="popover-popup"]'));

    await chords.last().hover();
    await assertInsideViewport(page, page.locator('[data-slot="popover-popup"]'));

    const popup = page.locator('[data-slot="popover-popup"]');
    const popupBox = await popup.boundingBox();
    const sidebar = page.locator('.chord-viewer__sidebar');
    const sidebarBox = await sidebar.boundingBox();
    expect(popupBox).not.toBeNull();
    expect(sidebarBox).not.toBeNull();
    expect(popupBox!.x + popupBox!.width).toBeGreaterThan(sidebarBox!.x + sidebarBox!.width - 8);
  });

  test('uma forma permanece compacta e várias formas cabem em 560px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(songUrl);

    await page.getByRole('button', { name: 'Acorde D9/F#. Diagrama e variações disponíveis' }).hover();
    await page.getByRole('button', { name: 'Ver detalhes' }).click();
    const compact = page.getByRole('dialog', { name: 'Variações de D9/F#' });
    await expect(compact).toBeVisible();
    expect((await compact.boundingBox())!.width).toBeLessThanOrEqual(320);
    expect((await compact.locator('[data-slot="chord-diagram"]').boundingBox())!.width).toBeLessThanOrEqual(198);
    await compact.getByRole('button', { name: 'Fechar variações' }).click();

    await page.getByRole('button', { name: 'Ver variações de C', exact: true }).click();
    const many = page.getByRole('dialog', { name: 'Variações de C' });
    await expect(many).toBeVisible();
    expect((await many.boundingBox())!.width).toBeLessThanOrEqual(560);
    for (const diagram of await many.locator('[data-slot="chord-diagram"]').all()) {
      expect((await diagram.boundingBox())!.width).toBeLessThanOrEqual(198);
    }
    await many.getByRole('radio').nth(1).click();
    await many.getByRole('button', { name: 'Fechar variações' }).click();
    await page.getByRole('button', { name: 'Ver variações de C', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Variações de C' }).getByRole('radio').nth(1))
      .toHaveAttribute('aria-checked', 'true');
  });

  test('respeita a viewport móvel com margem de 12px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(songUrl);

    await page.getByRole('button', { name: 'Ver variações de C', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Variações de C' });
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(12);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390 - 12);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });
});
