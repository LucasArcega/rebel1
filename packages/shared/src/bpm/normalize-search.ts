export const normalizeSearchText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export const slugToSearchName = (slug: string): string =>
  slug
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const scoreNameMatch = (candidate: string, expected: string): number => {
  const normalizedCandidate = normalizeSearchText(candidate);
  const normalizedExpected = normalizeSearchText(expected);

  if (!normalizedCandidate || !normalizedExpected) {
    return 0;
  }

  if (normalizedCandidate === normalizedExpected) {
    return 3;
  }

  if (normalizedCandidate.includes(normalizedExpected) || normalizedExpected.includes(normalizedCandidate)) {
    return 2;
  }

  const candidateTokens = new Set(normalizedCandidate.split(' '));
  const expectedTokens = normalizedExpected.split(' ').filter(Boolean);
  const overlap = expectedTokens.filter((token) => candidateTokens.has(token)).length;

  if (overlap > 0 && overlap >= Math.ceil(expectedTokens.length / 2)) {
    return 1;
  }

  return 0;
};

export const scoreSongMatch = (
  hit: { artistName: string; title: string },
  artistName: string,
  songName: string,
): number => scoreNameMatch(hit.artistName, artistName) + scoreNameMatch(hit.title, songName);
