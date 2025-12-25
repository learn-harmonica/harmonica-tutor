import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import ProgressPage from './ProgressPage';

describe('ProgressPage', () => {
  it('shows empty state when there are no takes', () => {
    render(
      <MemoryRouter>
        <ProgressPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/saved practice takes: 0/i)).toBeInTheDocument();
    expect(screen.getByText(/no saved takes yet/i)).toBeInTheDocument();
  });

  it('clears practice history', async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      'harmonica.practice.takes',
      JSON.stringify([
        {
          id: 'take-1',
          createdAt: '2025-12-25T00:00:00.000Z',
          target: {
            key: 'C',
            hole: 4,
            breath: 'blow',
            noteName: 'C5',
            frequency: 523.25
          },
          metrics: {
            durationMs: 3000,
            frames: 30,
            voicedFrames: 30,
            voicedPercent: 1,
            meanCents: 0,
            meanAbsCents: 0,
            stabilityCents: 10,
            meanLevel: 0.2
          }
        }
      ])
    );

    render(
      <MemoryRouter>
        <ProgressPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/saved practice takes: 1/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear history/i }));

    expect(screen.getByText(/saved practice takes: 0/i)).toBeInTheDocument();
    expect(screen.getByText(/no saved takes yet/i)).toBeInTheDocument();
  });
});
