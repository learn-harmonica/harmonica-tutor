import { useEffect, useRef } from 'react';
import Vex from 'vexflow';
import { tabToMidi } from '../tab';

interface StaffNotationProps {
  tab: string[];
  timestamps: number[];
  currentNoteIndex?: number;
}

const tabToVexKey = (tab: string): string | null => {
  const midi = tabToMidi(tab);
  if (!midi) return null;
  const noteNames = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = midi % 12;
  const note = noteNames[noteIndex];
  return `${note}/${octave}`;
};

const getVexDuration = (durationMs: number): string => {
  if (durationMs >= 2000) return 'w'; // whole
  if (durationMs >= 1000) return 'h'; // half
  if (durationMs >= 500) return 'q'; // quarter
  return '8'; // eighth
};

export default function StaffNotation({ tab, timestamps, currentNoteIndex }: StaffNotationProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current || !tab.length) return;

    try {
      const { Flow, Stave, StaveNote, Voice, Formatter, Renderer } = Vex as any;
      const div = divRef.current;
      div.innerHTML = '';

      const renderer = new Renderer(div, Renderer.Backends.SVG);
      renderer.resize(500, 150);
      const context = renderer.getContext();

      const stave = new Stave(10, 20, 480);
      stave.addClef('treble');
      stave.setContext(context).draw();

      // Limit to first 2 notes to avoid 'too many ticks' error
      const displayTab = tab.slice(0, 2);
      const displayTimestamps = timestamps.slice(0, 2);

      const notes = displayTab.map((t, i) => {
        const key = tabToVexKey(t);
        if (!key) return null;
        const durationMs = i < displayTimestamps.length - 1 ? displayTimestamps[i + 1] - displayTimestamps[i] : 500;
        const duration = getVexDuration(durationMs);
        const note = new StaveNote({ clef: 'treble', keys: [key], duration });
        if (i === currentNoteIndex) {
          note.setStyle({ fillStyle: 'red', strokeStyle: 'red' });
        }
        return note;
      }).filter(Boolean) as any[];

      if (notes.length === 0) return;

      const voice = new Voice({ num_beats: notes.length, beat_value: 4 });
      voice.addTickables(notes);

      const formatter = new Formatter().joinVoices([voice]).format([voice], 460);
      voice.draw(context, stave);
    } catch (error) {
      console.error('Error rendering staff notation:', error);
      if (divRef.current) {
        divRef.current.innerHTML = '<p>Unable to display staff notation. Please check your recording.</p>';
      }
    }
  }, [tab, timestamps, currentNoteIndex]);

  return <div ref={divRef} />;
}
