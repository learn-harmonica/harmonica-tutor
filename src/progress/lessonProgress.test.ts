import { describe, expect, it } from 'vitest';

import { clearLessonProgress, getLessonProgress, loadLessonProgress, recordLessonStep } from './lessonProgress';

describe('lesson progress', () => {
  it('records and loads lesson progress', () => {
    clearLessonProgress();

    expect(getLessonProgress('first-sounds')).toBeNull();

    const progress = recordLessonStep('first-sounds', 1);
    expect(progress).not.toBeNull();
    expect(progress?.lessonId).toBe('first-sounds');
    expect(progress?.maxStepIndex).toBe(1);

    const loaded = loadLessonProgress();
    expect(loaded['first-sounds']?.lastStepIndex).toBe(1);
  });

  it('keeps maxStepIndex monotonic', () => {
    clearLessonProgress();

    recordLessonStep('first-sounds', 2);
    recordLessonStep('first-sounds', 1);

    const progress = getLessonProgress('first-sounds');
    expect(progress?.maxStepIndex).toBe(2);
    expect(progress?.lastStepIndex).toBe(1);
  });
});
