import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  clearPracticeTakes,
  getTakeFeedback,
  loadPracticeTakes,
  type PracticeTake
} from '../practice/takes';
import { clearLessonProgress, loadLessonProgress } from '../progress/lessonProgress';
import { lessons } from '../content/lessons';

function formatNumber(value: number, digits: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

export default function ProgressPage() {
  const [takes, setTakes] = useState<PracticeTake[]>(() => loadPracticeTakes());
  const [lessonProgress, setLessonProgress] = useState(() => loadLessonProgress());

  const clear = useCallback(() => {
    clearPracticeTakes();
    setTakes([]);
  }, []);

  const clearLessons = useCallback(() => {
    clearLessonProgress();
    setLessonProgress({});
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Progress</h2>
        <p className="max-w-2xl text-slate-300">
          Practice takes are stored locally in your browser. Lesson completion tracking will be added later.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-400">Saved practice takes: {takes.length}</div>
        <div className="flex items-center gap-2">
          <Link className="rounded border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-900" to="/practice">
            Go to practice
          </Link>
          <button
            className="rounded border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 disabled:opacity-50 hover:bg-slate-900"
            disabled={takes.length === 0}
            onClick={clear}
            type="button"
          >
            Clear history
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Lesson progress</div>
            <div className="mt-1 text-sm text-slate-300">
              {Object.keys(lessonProgress).length} lessons started
            </div>
          </div>
          <button
            className="rounded border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 disabled:opacity-50 hover:bg-slate-900"
            disabled={Object.keys(lessonProgress).length === 0}
            onClick={clearLessons}
            type="button"
          >
            Clear lesson progress
          </button>
        </div>

        <div className="mt-4 grid gap-2">
          {lessons.map((lesson) => {
            const progress = lessonProgress[lesson.id];
            const completedSteps = progress ? Math.min(progress.maxStepIndex + 1, lesson.steps.length) : 0;
            const percent = lesson.steps.length > 0 ? completedSteps / lesson.steps.length : 0;

            return (
              <div key={lesson.id} className="rounded border border-slate-800 bg-slate-950/40 p-3">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="font-semibold">{lesson.title}</div>
                  <div className="text-xs text-slate-500">
                    {completedSteps}/{lesson.steps.length} steps
                  </div>
                </div>

                <div className="mt-2 h-2 rounded bg-slate-800">
                  <div className="h-2 rounded bg-indigo-500" style={{ width: `${Math.round(percent * 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {takes.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4 text-sm text-slate-300">
          No saved takes yet.
        </div>
      ) : (
        <div className="grid gap-3">
          {takes.slice(0, 10).map((take) => {
            const feedback = getTakeFeedback(take);
            return (
              <div key={take.id} className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="font-semibold">
                    {take.target.key} · hole {take.target.hole} {take.target.breath} → {take.target.noteName}
                  </div>
                  <div className="text-xs text-slate-500">{new Date(take.createdAt).toLocaleString()}</div>
                </div>

                <div className="mt-2 grid gap-2 text-sm text-slate-200 sm:grid-cols-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Mean</div>
                    <div>
                      {take.metrics.meanCents === null
                        ? '—'
                        : `${take.metrics.meanCents > 0 ? '+' : ''}${formatNumber(take.metrics.meanCents, 1)} cents`}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Stability</div>
                    <div>
                      {take.metrics.stabilityCents === null
                        ? '—'
                        : `±${formatNumber(take.metrics.stabilityCents, 1)} cents`}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Voiced</div>
                    <div>{Math.round(take.metrics.voicedPercent * 100)}%</div>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-sm text-slate-300">
                  {feedback.slice(0, 2).map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>

                {take.audio ? <audio className="mt-3 w-full" controls src={take.audio.dataUrl} /> : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
