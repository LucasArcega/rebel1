export interface SearchResult {
  artistSlug: string;
  artistName: string;
  songSlug: string;
  songName: string;
  imageUrl: string | null;
  hits: number | null;
}
