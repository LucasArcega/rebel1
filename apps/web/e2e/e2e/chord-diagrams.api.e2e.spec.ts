import { expect, test } from '@playwright/test';

test('@real exibe acordes estruturados entregues pela API local', async ({ page }) => {
  const artist = process.env.E2E_REAL_ARTIST;
  const song = process.env.E2E_REAL_SONG;
  test.skip(!artist || !song, 'Defina E2E_REAL_ARTIST e E2E_REAL_SONG para o smoke real.');

  const responsePromise = page.waitForResponse((response) =>
    response.url().includes(`/api/artists/${artist}/songs/${song}`) && response.ok(),
  );
  await page.goto(`/artists/${artist}/songs/${song}`);
  const response = await responsePromise;
  const body = await response.json() as { data?: { chords?: unknown[] } };

  expect(body.data?.chords?.length).toBeGreaterThan(0);
  await expect(page.getByRole('region', { name: 'Acordes desta música' })).toBeVisible();
});
