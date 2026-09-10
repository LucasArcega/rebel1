import type { Page, Route } from '@playwright/test';
import {
  chordSongFixture,
  simplifiedChordSongFixture,
  type ChordSongFixture,
} from '../fixtures/chord-song';

export const chordApiPattern = '**/api/artists/fixture-artist/songs/diagramas*';

const respondWithFixture = async (route: Route, fixture: ChordSongFixture | object) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ data: fixture }),
  });
};

export const mockChordRoute = async (
  page: Page,
  fixture: ChordSongFixture | object = chordSongFixture,
) => {
  await page.route(chordApiPattern, (route) => respondWithFixture(route, fixture));
};

export const mockVersionedChordRoute = async (page: Page) => {
  await page.route(chordApiPattern, (route) => {
    const version = new URL(route.request().url()).searchParams.get('version');
    return respondWithFixture(
      route,
      version === 'simplificada' ? simplifiedChordSongFixture : chordSongFixture,
    );
  });
};

export const failChordRoute = async (page: Page) => {
  await page.unroute(chordApiPattern);
  await page.route(chordApiPattern, (route) => route.abort('internetdisconnected'));
};
