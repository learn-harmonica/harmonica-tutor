const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

type NoteName = (typeof NOTE_NAMES)[number];

export function midiToFrequency(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function frequencyToMidi(frequency: number) {
  return 69 + 12 * Math.log2(frequency / 440);
}

export function midiToNoteName(midi: number) {
  const normalized = ((midi % 12) + 12) % 12;
  const note = NOTE_NAMES[normalized] as NoteName;
  const octave = Math.floor(midi / 12) - 1;
  return `${note}${octave}`;
}

export function frequencyToNote(frequency: number) {
  const midi = Math.round(frequencyToMidi(frequency));
  const referenceFrequency = midiToFrequency(midi);
  const cents = 1200 * Math.log2(frequency / referenceFrequency);

  return {
    midi,
    noteName: midiToNoteName(midi),
    cents
  };
}

export function rms(samples: Float32Array) {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    const value = samples[i];
    sum += value * value;
  }

  return Math.sqrt(sum / samples.length);
}

export function estimatePitch(samples: Float32Array, sampleRate: number): number | null {
  const signal = rms(samples);
  if (!Number.isFinite(signal) || signal < 0.01) {
    return null;
  }

  const size = samples.length;
  let r1 = 0;
  let r2 = size - 1;
  const threshold = 0.2;

  for (let i = 0; i < size / 2; i++) {
    if (Math.abs(samples[i]) < threshold) {
      r1 = i;
      break;
    }
  }

  for (let i = 1; i < size / 2; i++) {
    if (Math.abs(samples[size - i]) < threshold) {
      r2 = size - i;
      break;
    }
  }

  const trimmed = samples.slice(r1, r2);
  if (trimmed.length < 2) {
    return null;
  }

  const c = new Array<number>(trimmed.length).fill(0);

  for (let lag = 0; lag < trimmed.length; lag++) {
    let sum = 0;
    for (let i = 0; i < trimmed.length - lag; i++) {
      sum += trimmed[i] * trimmed[i + lag];
    }
    c[lag] = sum;
  }

  let d = 0;
  while (d + 1 < c.length && c[d] > c[d + 1]) {
    d++;
  }

  let maxPos = -1;
  let maxVal = -Infinity;
  for (let i = d; i < c.length; i++) {
    if (c[i] > maxVal) {
      maxVal = c[i];
      maxPos = i;
    }
  }

  if (maxPos <= 0) {
    return null;
  }

  let t0 = maxPos;

  const x1 = c[t0 - 1] ?? 0;
  const x2 = c[t0] ?? 0;
  const x3 = c[t0 + 1] ?? 0;

  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;

  if (a !== 0) {
    t0 = t0 - b / (2 * a);
  }

  if (!Number.isFinite(t0) || t0 <= 0) {
    return null;
  }

  const frequency = sampleRate / t0;
  if (!Number.isFinite(frequency) || frequency <= 0) {
    return null;
  }

  return frequency;
}
