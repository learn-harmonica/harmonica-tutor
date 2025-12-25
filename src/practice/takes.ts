import type { PitchFrame } from '../audio/types';
import type { HarmonicaKey } from '../content/types';

export type Breath = 'blow' | 'draw';

export type PracticeTarget = {
  key: HarmonicaKey;
  hole: number;
  breath: Breath;
  noteName: string;
  frequency: number;
};

export type PracticeTakeMetrics = {
  durationMs: number;
  frames: number;
  voicedFrames: number;
  voicedPercent: number;
  meanCents: number | null;
  meanAbsCents: number | null;
  stabilityCents: number | null;
  meanLevel: number;
};

export type PracticeTakeAudio = {
  mimeType: string;
  dataUrl: string;
  sizeBytes: number;
  durationMs: number;
};

export type PracticeTake = {
  id: string;
  createdAt: string;
  target: PracticeTarget;
  metrics: PracticeTakeMetrics;
  audio?: PracticeTakeAudio;
};

const STORAGE_KEY = 'harmonica.practice.takes';
const MAX_TAKES = 50;
const MAX_AUDIO_TAKES = 10;

function createId() {
  const cryptoObj = globalThis.crypto as Crypto | undefined;
  if (cryptoObj?.randomUUID) {
    return cryptoObj.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function centsBetween(frequency: number, targetFrequency: number) {
  return 1200 * Math.log2(frequency / targetFrequency);
}

export function computeTakeMetrics(frames: PitchFrame[], targetFrequency: number): PracticeTakeMetrics {
  const count = frames.length;
  const durationMs = count >= 2 ? frames[count - 1].t - frames[0].t : 0;
  const meanLevel = count > 0 ? frames.reduce((sum, frame) => sum + frame.level, 0) / count : 0;

  const voiced = frames
    .filter((frame) => frame.frequency !== null && Number.isFinite(frame.frequency))
    .map((frame) => frame.frequency as number);

  const voicedFrames = voiced.length;
  const voicedPercent = count > 0 ? voicedFrames / count : 0;

  if (voicedFrames === 0 || !Number.isFinite(targetFrequency) || targetFrequency <= 0) {
    return {
      durationMs,
      frames: count,
      voicedFrames,
      voicedPercent,
      meanCents: null,
      meanAbsCents: null,
      stabilityCents: null,
      meanLevel
    };
  }

  const cents = voiced.map((frequency) => centsBetween(frequency, targetFrequency));

  const meanCents = cents.reduce((sum, value) => sum + value, 0) / cents.length;
  const meanAbsCents = cents.reduce((sum, value) => sum + Math.abs(value), 0) / cents.length;

  let variance = 0;
  for (const value of cents) {
    const delta = value - meanCents;
    variance += delta * delta;
  }
  variance /= cents.length;

  const stabilityCents = Math.sqrt(variance);

  return {
    durationMs,
    frames: count,
    voicedFrames,
    voicedPercent,
    meanCents,
    meanAbsCents,
    stabilityCents,
    meanLevel
  };
}

export function createPracticeTake(target: PracticeTarget, metrics: PracticeTakeMetrics): PracticeTake {
  return {
    id: createId(),
    createdAt: new Date().toISOString(),
    target,
    metrics
  };
}

function safeParse(raw: string): PracticeTake[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as PracticeTake[];
  } catch {
    return [];
  }
}

export function loadPracticeTakes(): PracticeTake[] {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  return safeParse(raw);
}

export function savePracticeTake(take: PracticeTake) {
  if (typeof localStorage === 'undefined') {
    return [take];
  }

  const existing = loadPracticeTakes();
  const next = [take, ...existing].slice(0, MAX_TAKES);

  let audioCount = 0;
  const normalized: PracticeTake[] = next.map((entry) => {
    if (!entry.audio) {
      return entry;
    }

    if (audioCount < MAX_AUDIO_TAKES) {
      audioCount += 1;
      return entry;
    }

    const { audio: _audio, ...rest } = entry;
    return rest;
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    const withoutAudio: PracticeTake[] = normalized.map((entry) => {
      const { audio: _audio, ...rest } = entry;
      return rest;
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(withoutAudio));
      return withoutAudio;
    } catch {
      const trimmed = withoutAudio.slice(0, 10);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        return trimmed;
      } catch {
        return existing;
      }
    }
  }
}

export function clearPracticeTakes() {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}

export function getTakeFeedback(take: PracticeTake) {
  const feedback: string[] = [];
  const { meanCents, stabilityCents, voicedPercent } = take.metrics;

  if (meanCents === null || voicedPercent < 0.4) {
    feedback.push('No stable pitch detected. Try isolating one hole, playing gently, and reducing breath noise.');
    feedback.push('If you are bending, try a straight long tone for this exercise.');
    return feedback;
  }

  const abs = Math.abs(meanCents);
  if (abs <= 15) {
    feedback.push('Close to the target pitch.');
  } else if (meanCents > 0) {
    feedback.push('Sharp vs target. Back off air pressure and relax your mouth shape.');
  } else {
    feedback.push('Flat vs target. Try a slightly faster airstream or a more focused embouchure.');
  }

  if (stabilityCents !== null) {
    if (stabilityCents <= 20) {
      feedback.push('Pitch stability looks steady.');
    } else if (stabilityCents <= 40) {
      feedback.push('Pitch wobbles a bit. Focus on even breath and a stable embouchure.');
    } else {
      feedback.push('Pitch is quite unstable. Slow down and aim for a clean single note first.');
    }
  }

  if (voicedPercent < 0.7) {
    feedback.push('Detection dropped out often; multi-hole sound or background noise can confuse it.');
  }

  feedback.push('Note: this is approximate and works best on straight long tones (not bends/vibrato).');
  return feedback;
}
