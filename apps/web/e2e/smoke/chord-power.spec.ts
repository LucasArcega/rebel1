import { expect, test } from '@playwright/test';

test('renders power-chord diagrams for fifth chords', async ({ page }) => {
  test.setTimeout(90_000);
  await page.route('**/api/artists/fixture-artist/songs/power-chords*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          artistSlug: 'fixture-artist',
          artistName: 'Fixture Artist',
          songSlug: 'power-chords',
          songName: 'Power Chords',
          versionId: 1,
          tone: 'A',
          tuning: null,
          composers: [],
          hits: 1,
          youtubeId: null,
          cifraclubUrl: 'https://www.cifraclub.com.br/fixture-artist/power-chords/',
          content: '[Intro]\n<b>A5</b>  <b>C5</b>  <b>F#5</b>\n',
          chords: [
            { symbol: 'A5', normalizedSymbol: 'A5', order: 0 },
            { symbol: 'C5', normalizedSymbol: 'C5', order: 1 },
            { symbol: 'F#5', normalizedSymbol: 'F#5', order: 2 },
          ],
          versions: [],
        },
      }),
    });
  });

  await page.goto('/artists/fixture-artist/songs/power-chords', { waitUntil: 'domcontentloaded' });

  const strip = page.getByRole('region', { name: 'Acordes desta música' });
  await expect(strip.getByRole('img', { name: /^Diagrama de A5 / })).toBeVisible();
  await expect(strip.getByRole('img', { name: /^Diagrama de C5 / })).toBeVisible();
  await expect(strip.getByRole('img', { name: /^Diagrama de F#5 / })).toBeVisible();
  await expect(strip.getByText('Diagrama indisponível')).toHaveCount(0);
});
