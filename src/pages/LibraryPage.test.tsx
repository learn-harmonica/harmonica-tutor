import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { libraryItems } from '../content/library';
import LibraryPage from './LibraryPage';

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

describe('LibraryPage', () => {
  it('renders curated library items', () => {
    render(<LibraryPage />);

    for (const item of libraryItems) {
      expect(
        screen.getByRole('link', { name: new RegExp(escapeRegExp(item.title), 'i') })
      ).toBeInTheDocument();
    }
  });
});
