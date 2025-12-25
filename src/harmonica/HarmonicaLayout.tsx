import type { HarmonicaKey } from '../content/types';

import { getRichterNote } from './richter';

type Breath = 'blow' | 'draw';

type Props = {
  harmonicaKey: HarmonicaKey;
  selectedHole: number;
  selectedBreath: Breath;
  onSelect: (hole: number, breath: Breath) => void;
};

const HOLES = Array.from({ length: 10 }, (_, index) => index + 1);

function cellClass(isSelected: boolean) {
  return [
    'rounded border px-1 py-2 text-center text-sm',
    isSelected
      ? 'border-indigo-400 bg-indigo-600/20 text-indigo-100'
      : 'border-slate-700 bg-slate-950/40 text-slate-200 hover:bg-slate-900/60'
  ].join(' ');
}

export default function HarmonicaLayout({
  harmonicaKey,
  selectedHole,
  selectedBreath,
  onSelect
}: Props) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-11 gap-1 text-center text-xs text-slate-400">
        <div />
        {HOLES.map((hole) => (
          <div key={hole}>{hole}</div>
        ))}
      </div>

      {(['blow', 'draw'] as const).map((breath) => (
        <div key={breath} className="grid grid-cols-11 gap-1">
          <div className="flex items-center justify-end pr-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {breath}
          </div>

          {HOLES.map((hole) => {
            const note = getRichterNote(harmonicaKey, hole, breath)?.noteName;
            const isSelected = hole === selectedHole && breath === selectedBreath;

            return (
              <button
                key={`${breath}-${hole}`}
                className={cellClass(isSelected)}
                onClick={() => onSelect(hole, breath)}
                type="button"
                aria-label={`${breath} hole ${hole}${note ? ` ${note}` : ''}`}
                aria-pressed={isSelected}
              >
                <div className="font-semibold">{note ?? '—'}</div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
