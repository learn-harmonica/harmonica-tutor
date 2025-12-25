const midiToTab = new Map<number, string>([
  [60, '4'], // C4 hole 4 blow
  [62, '-4'], // D4 hole 4 draw
  [64, '5'], // E4 hole 5 blow
  [65, '-5'], // F4 hole 5 draw
  [67, '6'], // G4 hole 6 blow
  [69, '-6'], // A4 hole 6 draw
  [71, '7'], // B4 hole 7 blow
  [72, '8'], // C5 hole 8 blow
  [74, '-7'], // D5 hole 7 draw
  [76, '9'], // E5 hole 9 blow
  [79, '10'], // G5 hole 10 blow
  [83, '-10'], // B5 hole 10 draw
]);

const tabToMidiMap = new Map<string, number>([
  ['4', 60],
  ['-4', 62],
  ['5', 64],
  ['-5', 65],
  ['6', 67],
  ['-6', 69],
  ['7', 71],
  ['8', 72],
  ['-7', 74],
  ['9', 76],
  ['10', 79],
  ['-10', 83],
]);

export function convertMidiToTab(midi: number): string | null {
  return midiToTab.get(midi) || null;
}

export function tabToMidi(tab: string): number | null {
  return tabToMidiMap.get(tab) || null;
}
