import {
  DEFAULT_BPM,
  DEFAULT_LINES_PER_BEAT,
  MAX_BPM,
  MAX_LINES_PER_BEAT,
  MIN_BPM,
  MIN_LINES_PER_BEAT,
} from './types.js';

export const clampBpm = (bpm: number): number => {
  if (!Number.isFinite(bpm)) {
    return DEFAULT_BPM;
  }

  return Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(bpm)));
};

export const clampLinesPerBeat = (linesPerBeat: number): number => {
  if (!Number.isFinite(linesPerBeat)) {
    return DEFAULT_LINES_PER_BEAT;
  }

  const snapped = Math.round(linesPerBeat / 0.25) * 0.25;
  return Math.min(MAX_LINES_PER_BEAT, Math.max(MIN_LINES_PER_BEAT, snapped));
};

export const beatIntervalMs = (bpm: number): number => 60_000 / clampBpm(bpm);

export const scrollPerBeat = (lineHeight: number, linesPerBeat: number): number => {
  const safeLineHeight = Number.isFinite(lineHeight) && lineHeight > 0 ? lineHeight : 23;
  return safeLineHeight * clampLinesPerBeat(linesPerBeat);
};

export const calculateTapTempoBpm = (taps: number[]): number | null => {
  if (taps.length < 3) {
    return null;
  }

  const intervals: number[] = [];
  for (let index = 1; index < taps.length; index += 1) {
    const interval = taps[index]! - taps[index - 1]!;
    if (interval <= 0) {
      return null;
    }
    intervals.push(interval);
  }

  if (intervals.length < 2) {
    return null;
  }

  const average = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  return clampBpm(60_000 / average);
};
