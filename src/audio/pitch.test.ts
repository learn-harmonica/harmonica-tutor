import { describe, expect, it } from 'vitest';

import {
  estimatePitch,
  frequencyToMidi,
  frequencyToNote,
  midiToFrequency,
  midiToNoteName,
  rms
} from './pitch';

function generateSineWave(frequency: number, sampleRate: number, length: number, amplitude = 0.5) {
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    samples[i] = amplitude * Math.sin((2 * Math.PI * frequency * i) / sampleRate);
  }

  return samples;
}

describe('pitch utilities', () => {
  it('converts between midi and frequency (A4)', () => {
    expect(midiToFrequency(69)).toBeCloseTo(440, 6);
    expect(frequencyToMidi(440)).toBeCloseTo(69, 6);
  });

  it('formats midi to note names', () => {
    expect(midiToNoteName(60)).toBe('C4');
    expect(midiToNoteName(69)).toBe('A4');
  });

  it('converts a frequency to the nearest note', () => {
    const note = frequencyToNote(440);
    expect(note.midi).toBe(69);
    expect(note.noteName).toBe('A4');
    expect(note.cents).toBeCloseTo(0, 6);
  });

  it('computes RMS', () => {
    expect(rms(new Float32Array(128))).toBe(0);

    const constant = new Float32Array(128).fill(1);
    expect(rms(constant)).toBeCloseTo(1, 6);

    const sampleRate = 44100;
    const samples = generateSineWave(440, sampleRate, 2048, 0.5);
    expect(rms(samples)).toBeCloseTo(0.5 / Math.sqrt(2), 2);
  });

  it('estimates pitch for a sine wave', () => {
    const sampleRate = 44100;
    const target = 440;
    const samples = generateSineWave(target, sampleRate, 2048, 0.5);

    const estimated = estimatePitch(samples, sampleRate);
    expect(estimated).not.toBeNull();
    expect(Math.abs((estimated ?? 0) - target)).toBeLessThan(5);
  });

  it('returns null for silence or very quiet audio', () => {
    const sampleRate = 44100;

    expect(estimatePitch(new Float32Array(2048), sampleRate)).toBeNull();

    const quiet = generateSineWave(440, sampleRate, 2048, 0.001);
    expect(estimatePitch(quiet, sampleRate)).toBeNull();
  });
});
