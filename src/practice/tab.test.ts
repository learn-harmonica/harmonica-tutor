import { describe, it, expect } from 'vitest';
import { convertMidiToTab } from '../tab';

describe('convertMidiToTab', () => {
  it('converts C4 (60) to "4"', () => {
    expect(convertMidiToTab(60)).toBe('4');
  });

  it('converts D4 (62) to "-4"', () => {
    expect(convertMidiToTab(62)).toBe('-4');
  });

  it('converts E4 (64) to "5"', () => {
    expect(convertMidiToTab(64)).toBe('5');
  });

  it('converts F4 (65) to "-5"', () => {
    expect(convertMidiToTab(65)).toBe('-5');
  });

  it('returns null for unknown MIDI', () => {
    expect(convertMidiToTab(61)).toBe(null);
  });
});

describe('dummy', () => {
  it('passes', () => {
    expect(true).toBe(true);
  });
});
