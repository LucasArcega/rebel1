import { useEffect, useRef, useState } from 'react';
import {
  beatIntervalMs,
  clampBpm,
  clampLinesPerBeat,
  DEFAULT_BPM,
  DEFAULT_LINES_PER_BEAT,
  scrollPerBeat,
  type BpmSource,
} from '@cifra-hub/shared';
import type { BpmLookupResult } from '@/entities/bpm';
import {
  resolveInitialScrollBpm,
  saveScrollBpmPrefs,
  type CachedGetSongBpm,
} from '@/shared/lib/scroll-bpm-storage';

interface UseAutoScrollBpmOptions {
  artistSlug: string;
  songSlug: string;
  lineHeight: number;
  lookup?: BpmLookupResult;
  isFetchingBpm?: boolean;
  bpmError?: string | null;
}

const fallbackLineHeight = (measured: number) => (measured > 0 ? measured : 23);

export const useAutoScrollBpm = ({
  artistSlug,
  songSlug,
  lineHeight,
  lookup,
  isFetchingBpm = false,
  bpmError = null,
}: UseAutoScrollBpmOptions) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const initial = resolveInitialScrollBpm(artistSlug, songSlug);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(initial.bpm);
  const [linesPerBeat, setLinesPerBeat] = useState(initial.linesPerBeat);
  const [bpmSource, setBpmSource] = useState<BpmSource | null>(initial.bpmSource);
  const [cachedGetSong, setCachedGetSong] = useState<CachedGetSongBpm | undefined>(initial.cachedGetSong);
  const [lastTapBpm, setLastTapBpm] = useState<number | null>(null);

  useEffect(() => {
    if (!lookup || bpmSource === 'manual' || bpmSource === 'tap') {
      return;
    }

    const nextBpm = clampBpm(lookup.bpm);
    setBpm(nextBpm);
    setBpmSource('getsong');
    setCachedGetSong({
      bpm: nextBpm,
      key: lookup.key,
      fetchedAt: Date.now(),
    });
  }, [lookup, bpmSource]);

  useEffect(() => {
    if (!bpmSource) {
      return;
    }

    const timer = window.setTimeout(() => {
      saveScrollBpmPrefs(artistSlug, songSlug, {
        bpm,
        linesPerBeat,
        bpmSource,
        cachedGetSong,
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [artistSlug, songSlug, bpm, linesPerBeat, bpmSource, cachedGetSong]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = window.setInterval(() => {
      window.scrollBy(0, scrollPerBeat(fallbackLineHeight(lineHeight), linesPerBeat));

      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

      if (atBottom) {
        setIsPlaying(false);
      }
    }, beatIntervalMs(bpm));

    return () => window.clearInterval(interval);
  }, [isPlaying, bpm, linesPerBeat, lineHeight]);

  const changeBpm = (next: number) => {
    setBpm(clampBpm(next));
    setBpmSource('manual');
  };

  const changeLinesPerBeat = (next: number) => {
    setLinesPerBeat(clampLinesPerBeat(next));
  };

  const applyTapBpm = (next: number) => {
    const clamped = clampBpm(next);
    setBpm(clamped);
    setLastTapBpm(clamped);
    setBpmSource('tap');
  };

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const toggle = () => setIsPlaying((current) => !current);

  return {
    contentRef,
    isPlaying,
    bpm,
    linesPerBeat,
    bpmSource,
    lastTapBpm,
    isFetchingBpm: bpmSource === 'manual' || bpmSource === 'tap' ? false : isFetchingBpm,
    bpmError: bpmSource === 'manual' || bpmSource === 'tap' ? null : bpmError,
    beatIntervalMs: beatIntervalMs(bpm || DEFAULT_BPM),
    defaultBpm: DEFAULT_BPM,
    defaultLinesPerBeat: DEFAULT_LINES_PER_BEAT,
    play,
    pause,
    toggle,
    setBpm: changeBpm,
    setLinesPerBeat: changeLinesPerBeat,
    applyTapBpm,
  };
};
