import { expect, test } from '@playwright/test';

const decodeHtml = (value: string) => value
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#(?:x27|39);/gi, "'")
  .replace(/\r\n/g, '\n')
  .trim();

const extractCifraClubContent = (html: string) => {
  const match = html.match(/<pre[^>]*data-chord-content="true"[^>]*>([\s\S]*?)<\/pre>/i);
  if (!match) throw new Error('Conteúdo da cifra não encontrado no HTML do Cifra Club');
  return decodeHtml(match[1]);
};

const normalizeTabContent = (value: string) => value
  .replace(/\r\n/g, '\n')
  .split('\n')
  .map((line) => line.trimEnd())
  .join('\n')
  .trim();

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

test('@real Dear God baixo corresponde às páginas atuais do Cifra Club', async ({ request }) => {
  test.setTimeout(120_000);
  const appBase = 'http://127.0.0.1:3001/api/artists/avenged-sevenfold/songs/dear-god';
  const cifraBase = 'https://www.cifraclub.com.br/avenged-sevenfold/dear-god/tabs-baixo';

  const mainResponse = await request.get(appBase);
  expect(mainResponse.ok()).toBe(true);
  const mainPayload = await mainResponse.json() as {
    data: { versions: Array<{ instrumentSlug: string; labelSlug: string; path: string }> };
  };
  expect(mainPayload.data.versions).toContainEqual(expect.objectContaining({
    instrumentSlug: 'bass',
    labelSlug: 'principal',
    path: '/avenged-sevenfold/dear-god/tabs-baixo/',
  }));

  for (const version of [
    {
      query: '?instrument=bass',
      sourceUrl: `${cifraBase}/`,
      id: 32276,
      expectedPath: '/avenged-sevenfold/dear-god/tabs-baixo/simplificada.html',
    },
    {
      query: '?instrument=bass&version=simplificada',
      sourceUrl: `${cifraBase}/simplificada.html`,
      id: 33534,
      expectedPath: null,
    },
  ]) {
    const [apiResponse, sourceResponse] = await Promise.all([
      request.get(`${appBase}${version.query}`),
      request.get(version.sourceUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 CifraHub live comparison' },
      }),
    ]);
    expect(apiResponse.ok()).toBe(true);
    expect(sourceResponse.ok()).toBe(true);

    const payload = await apiResponse.json() as {
      data: {
        versionId: number;
        content: string;
        versions: Array<{ path: string }>;
      };
    };
    const sourceContent = extractCifraClubContent(await sourceResponse.text());

    expect(payload.data.versionId).toBe(version.id);
    expect(normalizeTabContent(payload.data.content)).toBe(normalizeTabContent(sourceContent));
    if (version.expectedPath) {
      expect(payload.data.versions).toContainEqual(expect.objectContaining({ path: version.expectedPath }));
    }
  }
});
