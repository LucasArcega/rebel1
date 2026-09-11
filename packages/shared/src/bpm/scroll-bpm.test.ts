import { describe, expect, it } from 'vitest';
import { beatIntervalMs, calculateTapTempoBpm, clampBpm, scrollPerBeat } from './scroll-bpm.js';

describe('scroll-bpm', () => {
  it('computes beat intervals from BPM', () => {
    expect(beatIntervalMs(120)).toBe(500);
    expect(beatIntervalMs(60)).toBe(1000);
  });

  it('clamps BPM to the playable range', () => {
    expect(clampBpm(12)).toBe(40);
    expect(clampBpm(400)).toBe(240);
    expect(clampBpm(Number.NaN)).toBe(120);
  });

  it('derives pixels scrolled on each beat', () => {
    expect(scrollPerBeat(24, 1)).toBe(24);
    expect(scrollPerBeat(24, 2)).toBe(48);
    expect(scrollPerBeat(24, 0.5)).toBe(12);
  });

  it('calculates tap tempo from regular 500ms taps', () => {
    expect(calculateTapTempoBpm([1_000, 1_500, 2_000, 2_500])).toBe(120);
  });

  it('returns null when there are fewer than two intervals', () => {
    expect(calculateTapTempoBpm([])).toBeNull();
    expect(calculateTapTempoBpm([1_000])).toBeNull();
    expect(calculateTapTempoBpm([1_000, 1_500])).toBeNull();
  });
});
