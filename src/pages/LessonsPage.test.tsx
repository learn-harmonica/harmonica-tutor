import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { lessons } from '../content/lessons';
import LessonsPage from './LessonsPage';

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

describe('LessonsPage', () => {
  it('lists available lessons with links', () => {
    render(
      <MemoryRouter>
        <LessonsPage />
      </MemoryRouter>
    );

    for (const lesson of lessons) {
      expect(
        screen.getByRole('link', { name: new RegExp(escapeRegExp(lesson.title), 'i') })
      ).toBeInTheDocument();
    }
  });
});
