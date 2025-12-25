import { describe, expect, it } from 'vitest';

import type { PitchFrame } from '../audio/types';

import { computeTakeMetrics, createPracticeTake, getTakeFeedback } from './takes';

function makeFrames(values: Array<number | null>, start = 0, step = 100, level = 0.2): PitchFrame[] {
  return values.map((frequency, index) => ({
    t: start + index * step,
    frequency,
    level
  }));
}

describe('practice takes', () => {
  it('computes metrics for an in-tune take', () => {
    const target = 440;
    const frames = makeFrames([440, 441, 439, 440, 440, 441]);

    const metrics = computeTakeMetrics(frames, target);

    expect(metrics.frames).toBe(frames.length);
    expect(metrics.voicedFrames).toBe(frames.length);
    expect(metrics.voicedPercent).toBeCloseTo(1, 6);
    expect(metrics.meanCents).not.toBeNull();
    expect(Math.abs(metrics.meanCents ?? 0)).toBeLessThan(10);
    expect(metrics.stabilityCents).not.toBeNull();
  });

  it('computes metrics when detection drops out', () => {
    const target = 440;
    const frames = makeFrames([null, 440, null, 440, null, null, 440]);

    const metrics = computeTakeMetrics(frames, target);

    expect(metrics.frames).toBe(frames.length);
    expect(metrics.voicedFrames).toBe(3);
    expect(metrics.voicedPercent).toBeCloseTo(3 / frames.length, 6);
    expect(metrics.meanCents).not.toBeNull();
  });

  it('returns null tuning metrics when no voiced frames exist', () => {
    const metrics = computeTakeMetrics(makeFrames([null, null, null]), 440);

    expect(metrics.voicedFrames).toBe(0);
    expect(metrics.meanCents).toBeNull();
    expect(metrics.stabilityCents).toBeNull();
  });

  it('provides human-readable feedback strings', () => {
    const take = createPracticeTake(
      {
        key: 'C',
        hole: 4,
        breath: 'blow',
        noteName: 'C5',
        frequency: 523.25
      },
      computeTakeMetrics(makeFrames([523.25, 523.25, 523.25, 523.25, 523.25]), 523.25)
    );

    const feedback = getTakeFeedback(take);

    expect(feedback.length).toBeGreaterThan(0);
    expect(feedback.join(' ')).toMatch(/target pitch|close to the target/i);
  });
});
