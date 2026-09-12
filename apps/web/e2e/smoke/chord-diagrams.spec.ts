import { expect, test } from '@playwright/test';
import {
  alternateTuningChordSongFixture,
  legacyChordSongFixture,
  missingFingeringChordSongFixture,
} from '../fixtures/chord-song';
import { mockChordRoute } from '../helpers/route-mock';

const songUrl = '/artists/fixture-artist/songs/diagramas';
const expectedSymbols = ['Am', 'Bm11', 'C', 'C9', 'D', 'D9/F#', 'E'];
const diagramName = (symbol: string) => new RegExp(`^Diagrama de ${symbol} `);

test.describe('dicionário de acordes', () => {
  test.beforeEach(async ({ page }) => {
    await mockChordRoute(page);
  });

  test('mostra a faixa única, ordenada e com diagramas completos', async ({ page }) => {
    await page.goto(songUrl);

    await expect(page.getByRole('heading', { name: 'Diagramas', level: 1 })).toBeVisible();
    const strip = page.getByRole('region', { name: 'Acordes desta música' });
    await expect(strip).toBeVisible();
    await expect(strip.getByRole('button', { name: /^Ver variações de / })).toHaveCount(7);

    const diagrams = strip.getByRole('img');
    await expect(diagrams).toHaveCount(7);
    await expect(diagrams.first()).toHaveAttribute('aria-labelledby', /chord-diagram-/);
    await expect(strip.locator('.chord-diagram__string')).toHaveCount(42);
    await expect(strip.locator('.chord-diagram__fret')).toHaveCount(42);
    await expect(strip.locator('.chord-diagram__marker')).not.toHaveCount(0);
    await expect(strip.locator('.chord-diagram__finger')).not.toHaveCount(0);

    await strip.getByRole('button', { name: 'Ver variações de C', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Variações de C' }).locator('.chord-diagram__barre')).not.toHaveCount(0);
    await page.getByRole('button', { name: 'Fechar variações' }).click();

    await expect(strip.locator('.chord-diagram__title')).toHaveText(expectedSymbols);
    for (const symbol of expectedSymbols) {
      await expect(strip.getByRole('img', { name: diagramName(symbol) })).toBeVisible();
    }
  });

  test('troca a variação e restaura a preferência após recarregar', async ({ page }) => {
    await page.goto(songUrl);
    const opener = page.getByRole('button', { name: 'Ver variações de C', exact: true });
    await opener.click();

    const dialog = page.getByRole('dialog', { name: 'Variações de C' });
    const options = dialog.getByRole('radio');
    expect(await options.count()).toBeGreaterThanOrEqual(2);
    await options.nth(1).click();
    await expect(options.nth(1)).toHaveAttribute('aria-checked', 'true');
    await dialog.getByRole('button', { name: 'Fechar variações' }).click();

    await page.reload();
    await page.getByRole('button', { name: 'Ver variações de C', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Variações de C' }).getByRole('radio').nth(1))
      .toHaveAttribute('aria-checked', 'true');
  });

  test('mostra o hover acima da interface e mantém uma única forma em modal compacto', async ({ page }) => {
    await page.goto(songUrl);

    const inlineChord = page.getByRole('button', {
      name: 'Acorde D9/F#. Diagrama e variações disponíveis',
    });
    await inlineChord.hover();

    const preview = page.getByRole('group', { name: 'Diagrama e variações de D9/F#' });
    await expect(preview).toBeVisible();
    expect(Number(await preview.evaluate((element) => getComputedStyle(element).zIndex))).toBeGreaterThan(100);

    const bounds = await preview.boundingBox();
    const viewport = page.viewportSize();
    expect(bounds).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport!.width);

    await preview.getByRole('button', { name: 'Ver detalhes' }).click();
    const dialog = page.getByRole('dialog', { name: 'Variações de D9/F#' });
    await expect(dialog).toBeVisible();
    expect((await dialog.boundingBox())!.width).toBeLessThanOrEqual(320);
    expect((await dialog.locator('[data-slot="chord-diagram"]').boundingBox())!.width).toBeLessThanOrEqual(198);
  });

  test('descarta uma preferência inexistente sem quebrar o card', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('chord-fingering/guitar/E-A-D-G-B-E/Am', 'forma-removida');
    });
    await page.goto(songUrl);

    await expect(page.getByRole('img', { name: /^Diagrama de Am/ })).toBeVisible();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('chord-fingering/guitar/E-A-D-G-B-E/Am')))
      .toBeNull();
  });

  test('mantém texto e faixa sincronizados ao transpor e usar capo', async ({ page }) => {
    await page.goto(songUrl);

    await page.getByRole('button', { name: 'Subir meio tom' }).click();
    await page.getByRole('button', { name: 'Subir meio tom' }).click();
    await expect(page.getByText('E9/G#', { exact: true })).toHaveCount(2);
    await expect(page.getByRole('img', { name: /^Diagrama de E9\/G#/ })).toBeVisible();

    await page.getByRole('combobox', { name: 'Capotraste' }).click();
    await page.getByRole('option', { name: 'Casa 1' }).click();
    await expect(page.getByText('Transposição efetiva: +1 semitom(s)')).toBeVisible();
    await expect(page.getByText('D#9/G', { exact: true })).toHaveCount(2);

    await page.getByRole('button', { name: 'Resetar' }).click();
    await expect(page.getByText('D9/F#', { exact: true })).toHaveCount(2);
  });

  test('extrai acordes de uma cifra legada sem falsos positivos da letra', async ({ page }) => {
    await page.unroute('**/api/artists/fixture-artist/songs/diagramas*');
    await mockChordRoute(page, legacyChordSongFixture);
    await page.goto(songUrl);

    const strip = page.getByRole('region', { name: 'Acordes desta música' });
    await expect(strip.locator('.chord-diagram__title')).toHaveText(['Am', 'C', 'D9/F#', 'E']);
    await expect(strip.getByText('A vida')).toHaveCount(0);
  });

  test('preserva a cifra e bloqueia diagramas em afinação alternativa', async ({ page }) => {
    await page.unroute('**/api/artists/fixture-artist/songs/diagramas*');
    await mockChordRoute(page, alternateTuningChordSongFixture);
    await page.goto(songUrl);

    const strip = page.getByLabel('Acordes desta música');
    await expect(strip).toContainText('Diagramas indisponíveis para esta afinação');
    await expect(strip.getByRole('img')).toHaveCount(0);
    await expect(page.getByText('D9/F#', { exact: true })).toBeVisible();
  });

  test('explica quando um acorde válido não possui forma cadastrada', async ({ page }) => {
    await page.unroute('**/api/artists/fixture-artist/songs/diagramas*');
    await mockChordRoute(page, missingFingeringChordSongFixture);
    await page.goto(songUrl);

    const strip = page.getByRole('region', { name: 'Acordes desta música' });
    await expect(strip).toContainText('C7(b9)');
    await expect(strip).toContainText('Diagrama indisponível');
  });
});
