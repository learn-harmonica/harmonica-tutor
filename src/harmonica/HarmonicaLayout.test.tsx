import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import HarmonicaLayout from './HarmonicaLayout';

describe('HarmonicaLayout', () => {
  it('renders note names for a C harmonica', () => {
    const onSelect = vi.fn();

    render(
      <HarmonicaLayout
        harmonicaKey="C"
        selectedHole={4}
        selectedBreath="blow"
        onSelect={onSelect}
      />
    );

    expect(screen.getByRole('button', { name: /blow hole 4 C5/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /draw hole 4 D5/i })).toBeInTheDocument();
  });

  it('transposes note names for other keys', () => {
    const onSelect = vi.fn();

    render(
      <HarmonicaLayout
        harmonicaKey="G"
        selectedHole={4}
        selectedBreath="blow"
        onSelect={onSelect}
      />
    );

    expect(screen.getByRole('button', { name: /blow hole 4 G4/i })).toBeInTheDocument();

    render(
      <HarmonicaLayout
        harmonicaKey="A"
        selectedHole={4}
        selectedBreath="blow"
        onSelect={onSelect}
      />
    );

    expect(screen.getByRole('button', { name: /blow hole 4 A4/i })).toBeInTheDocument();
  });

  it('calls onSelect when a cell is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <HarmonicaLayout
        harmonicaKey="C"
        selectedHole={4}
        selectedBreath="blow"
        onSelect={onSelect}
      />
    );

    await user.click(screen.getByRole('button', { name: /draw hole 3 B4/i }));
    expect(onSelect).toHaveBeenCalledWith(3, 'draw');
  });
});
