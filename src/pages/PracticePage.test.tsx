import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import type { PitchFrame } from '../audio/types';

type MockPitchState = {
  supported: boolean;
  status: 'idle' | 'requesting' | 'listening' | 'error';
  error: string | null;
  frequency: number | null;
  noteName: string | null;
  cents: number | null;
  level: number;
  stabilityCents: number | null;
  frame: PitchFrame | null;
  start: () => void;
  stop: () => void;
};

let mockPitchState: MockPitchState = {
  supported: true,
  status: 'idle',
  error: null,
  frequency: null,
  noteName: null,
  cents: null,
  level: 0,
  stabilityCents: null,
  frame: null,
  start: () => undefined,
  stop: () => undefined
};

vi.mock('../audio/useMicrophonePitch', () => {
  return {
    useMicrophonePitch: () => mockPitchState
  };
});

import PracticePage from './PracticePage';

describe('PracticePage', () => {
  it('shows a not-supported message when microphone APIs are unavailable', () => {
    mockPitchState = {
      ...mockPitchState,
      supported: false,
      status: 'idle',
      error: null
    };

    render(
      <MemoryRouter>
        <PracticePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/not supported/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start microphone/i })).toBeDisabled();
  });

  it('enables start button when supported and idle', () => {
    mockPitchState = {
      ...mockPitchState,
      supported: true,
      status: 'idle',
      error: null
    };

    render(
      <MemoryRouter>
        <PracticePage />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /start microphone/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /save take/i })).toBeDisabled();
    expect(screen.getByText(/no takes yet/i)).toBeInTheDocument();
  });

  it('renders saved takes from localStorage', () => {
    mockPitchState = {
      ...mockPitchState,
      supported: true,
      status: 'idle',
      error: null
    };

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
        <PracticePage />
      </MemoryRouter>
    );

    expect(screen.queryByText(/no takes yet/i)).not.toBeInTheDocument();
    expect(screen.getByText(/hole 4 blow/i)).toBeInTheDocument();
    expect(screen.getAllByText(/C5/).length).toBeGreaterThan(0);
  });

  it('reads target selection from URL query params', () => {
    mockPitchState = {
      ...mockPitchState,
      supported: true,
      status: 'idle',
      error: null
    };

    render(
      <MemoryRouter initialEntries={['/practice?key=G&hole=4&breath=draw']}>
        <PracticePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/target:/i)).toBeInTheDocument();
    expect(screen.getByText('G4')).toBeInTheDocument();
  });
});
