export type LessonProgress = {
  lessonId: string;
  maxStepIndex: number;
  lastStepIndex: number;
  updatedAt: string;
};

const STORAGE_KEY = 'harmonica.lesson.progress';

function safeParse(raw: string): Record<string, LessonProgress> {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') {
      return {};
    }

    return parsed as Record<string, LessonProgress>;
  } catch {
    return {};
  }
}

export function loadLessonProgress(): Record<string, LessonProgress> {
  if (typeof localStorage === 'undefined') {
    return {};
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }

  return safeParse(raw);
}

export function getLessonProgress(lessonId: string): LessonProgress | null {
  const all = loadLessonProgress();
  return all[lessonId] ?? null;
}

export function recordLessonStep(lessonId: string, stepIndex: number) {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  const clamped = Math.max(0, Math.floor(stepIndex));
  const all = loadLessonProgress();
  const existing = all[lessonId];

  const maxStepIndex = existing ? Math.max(existing.maxStepIndex, clamped) : clamped;
  const progress: LessonProgress = {
    lessonId,
    maxStepIndex,
    lastStepIndex: clamped,
    updatedAt: new Date().toISOString()
  };

  const next = {
    ...all,
    [lessonId]: progress
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return progress;
}

export function clearLessonProgress() {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}
