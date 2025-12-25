import type { HarmonicaKey } from '../content/types';

import { midiToFrequency, midiToNoteName } from '../audio/pitch';

type Breath = 'blow' | 'draw';

const RICHTER_C: Record<number, { blow: number; draw: number }> = {
  1: { blow: 60, draw: 62 },
  2: { blow: 64, draw: 67 },
  3: { blow: 67, draw: 71 },
  4: { blow: 72, draw: 74 },
  5: { blow: 76, draw: 77 },
  6: { blow: 79, draw: 81 },
  7: { blow: 84, draw: 83 },
  8: { blow: 88, draw: 86 },
  9: { blow: 91, draw: 89 },
  10: { blow: 96, draw: 93 }
};

const TRANSPOSITION: Record<HarmonicaKey, number> = {
  C: 0,
  G: -5,
  A: -3
};

export function getRichterMidi(key: HarmonicaKey, hole: number, breath: Breath) {
  const base = RICHTER_C[hole]?.[breath];
  if (!base) {
    return null;
  }

  return base + TRANSPOSITION[key];
}

export function getRichterNote(key: HarmonicaKey, hole: number, breath: Breath) {
  const midi = getRichterMidi(key, hole, breath);
  if (midi === null) {
    return null;
  }

  return {
    midi,
    noteName: midiToNoteName(midi),
    frequency: midiToFrequency(midi)
  };
}
