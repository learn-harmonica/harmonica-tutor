import { describe, expect, it } from 'vitest';

import { libraryItems } from './library';
import { lessons } from './lessons';

function hasDuplicates(values: string[]) {
  return new Set(values).size !== values.length;
}

describe('content integrity', () => {
  it('library item ids are unique', () => {
    expect(hasDuplicates(libraryItems.map((i) => i.id))).toBe(false);
  });

  it('library item accessed dates look like ISO dates', () => {
    for (const item of libraryItems) {
      expect(item.accessed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('lesson ids are unique', () => {
    expect(hasDuplicates(lessons.map((l) => l.id))).toBe(false);
  });

  it('lessons reference existing library resources', () => {
    const ids = new Set(libraryItems.map((i) => i.id));

    for (const lesson of lessons) {
      for (const step of lesson.steps) {
        if (step.kind === 'resource') {
          expect(ids.has(step.resourceId)).toBe(true);
        }
      }
    }
  });
});
